import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Webhook'u kaldır
async function deleteWebhook(botToken: string) {
  await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
}

// Son işlenen mesaj ID'sini saklamak için
let lastProcessedUpdateId = 0;

// Son mesajları al
async function getUpdates(botToken: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastProcessedUpdateId + 1}`
  );
  return response.json();
}

interface TelegramUpdate {
  update_id: number;
  message?: {
    photo?: {
      file_id: string;
      width: number;
      height: number;
      file_size?: number;
    }[];
    caption?: string;
    text?: string;
    chat: {
      id: number;
    };
  };
}

// Galeri listesini getir
async function getGalleryList(): Promise<string> {
  const { data: gallery, error } = await supabase
    .from('gallery')
    .select('*')
    .order('order_no', { ascending: true });

  if (error) {
    throw error;
  }

  return gallery.map((item, index) => 
    `${index + 1}. ${item.title} (Sıra: ${item.order_no})`
  ).join('\n');
}

// Yetkili chat ID'leri kontrol et
async function isAuthorizedChat(chatId: number): Promise<boolean> {
  const { data: notifications, error } = await supabase
    .from('telegram_notifications')
    .select('chat_id')
    .eq('is_active', true);

  if (error) {
    console.error('Telegram yetkilendirme hatası:', error);
    return false;
  }

  return notifications.some(n => n.chat_id === chatId.toString());
}

// Komutları işle
async function processCommand(data: TelegramUpdate) {
  const text = data.message?.text;
  const chatId = data.message?.chat.id;
  
  if (!text || !chatId) return;

  // Yetkili chat ID kontrolü
  if (!await isAuthorizedChat(chatId)) {
    console.log('Yetkisiz chat ID: ', chatId);
    return;
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  if (text === '/galeri') {
    const list = await getGalleryList();
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '📸 <b>Galeri Listesi:</b>\n\n' + list,
          parse_mode: 'HTML'
        })
      }
    );
  }
}

// Resmi işle
async function processPhoto(data: TelegramUpdate) {
  if (!data.message?.photo || data.message.photo.length === 0) {
    throw new Error('No photo in message');
  }

  const photo = data.message.photo[data.message.photo.length - 1];
  const caption = data.message.caption || '';
  const chatId = data.message.chat.id;
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  // Yetkili chat ID kontrolü
  if (!await isAuthorizedChat(chatId)) {
    console.log('Yetkisiz chat ID:', chatId);
    return null;
  }

  // Caption'ı parçala
  const lines = caption.split('\n');
  const firstLine = lines[0] || '';
  const titleParts = firstLine.split('|').map(part => part.trim());
  const title = titleParts[0] || 'Yeni Resim';
  const orderNo = parseInt(titleParts[1]) || 0;
  const description = lines.slice(1).join('\n') || null;

  // Dosya işlemleri
  const fileResponse = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${photo.file_id}`
  );
  const fileData = await fileResponse.json();

  if (!fileData.ok) {
    throw new Error('Could not get file path from Telegram');
  }

  const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
  const imageResponse = await fetch(fileUrl);
  const imageBuffer = await imageResponse.arrayBuffer();

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('public')
    .upload(fileName, imageBuffer, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrl } = supabase.storage
    .from('public')
    .getPublicUrl(fileName);

  const { data: galleryItem, error: dbError } = await supabase
    .from('gallery')
    .insert({
      title: title,
      description: description,
      image_url: publicUrl.publicUrl,
      order_no: orderNo
    })
    .select()
    .single();

  if (dbError) {
    throw dbError;
  }

  await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `✅ Resim başarıyla galeriye eklendi!\n\nBaşlık: ${title}\nSıra: ${orderNo}`,
        parse_mode: 'HTML'
      })
    }
  );

  return galleryItem;
}

export async function GET() {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }

    // Webhook'u kaldır
    await deleteWebhook(TELEGRAM_BOT_TOKEN);

    // Son mesajları al
    const updates = await getUpdates(TELEGRAM_BOT_TOKEN);
    
    if (!updates.ok) {
      throw new Error('Could not get updates from Telegram');
    }

    // Mesajları işle
    const results = [];
    for (const update of updates.result) {
      try {
        if (update.message?.photo) {
          const result = await processPhoto(update);
          if (result) results.push(result);
        } else if (update.message?.text) {
          await processCommand(update);
        }
        // Son işlenen mesajın ID'sini güncelle
        lastProcessedUpdateId = update.update_id;
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: results,
      lastProcessedUpdateId 
    });
  } catch (error) {
    console.error('Telegram gallery test error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 