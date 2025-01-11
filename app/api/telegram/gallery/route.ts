import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    // Telegram webhook verilerini al
    const data = await request.json();
    
    // Sadece fotoğraf içeren mesajları işle
    if (!data.message?.photo) {
      return NextResponse.json({ success: false, error: 'No photo in message' });
    }

    // En yüksek çözünürlüklü fotoğrafı al (array'in son elemanı)
    const photo = data.message.photo[data.message.photo.length - 1];
    const caption = data.message.caption || '';

    // Telegram'dan dosya bilgisini al
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${photo.file_id}`
    );
    const fileData = await fileResponse.json();

    if (!fileData.ok) {
      throw new Error('Could not get file path from Telegram');
    }

    // Telegram'dan dosyayı indir
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
    const imageResponse = await fetch(fileUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Dosya adını oluştur
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    // Supabase Storage'a yükle
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

    // Public URL'i al
    const { data: publicUrl } = supabase.storage
      .from('public')
      .getPublicUrl(fileName);

    // Veritabanına kaydet
    const { data: galleryItem, error: dbError } = await supabase
      .from('gallery')
      .insert({
        title: caption.split('\n')[0] || 'Yeni Resim',
        description: caption.split('\n').slice(1).join('\n') || null,
        image_url: publicUrl.publicUrl,
        order_no: 0
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // Telegram'a başarılı mesajı gönder
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: data.message.chat.id,
          text: '✅ Resim başarıyla galeriye eklendi!\n\nBaşlık: ' + galleryItem.title,
          parse_mode: 'HTML'
        })
      }
    );

    return NextResponse.json({ success: true, data: galleryItem });
  } catch (error) {
    console.error('Telegram gallery error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 