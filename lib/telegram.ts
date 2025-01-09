import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getActiveChatIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from('telegram_notifications')
    .select('chat_id')
    .eq('is_active', true);

  if (error) {
    console.error('Telegram chat ID\'leri alınamadı:', error);
    return [];
  }

  return data.map(row => row.chat_id);
}

export async function sendTelegramMessage(message: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = await getActiveChatIds();

  if (!TELEGRAM_BOT_TOKEN || chatIds.length === 0) {
    console.error('Telegram yapılandırması eksik veya aktif chat ID bulunamadı');
    return;
  }

  try {
    const sendPromises = chatIds.map(async (chatId) => {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId.trim(),
            text: message,
            parse_mode: 'HTML',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Telegram mesajı gönderilemedi (Chat ID: ${chatId})`);
      }

      return response.json();
    });

    return await Promise.all(sendPromises);
  } catch (error) {
    console.error('Telegram bildirimi hatası:', error);
  }
}

interface TeklifData {
  ad_soyad: string;
  telefon: string;
  email: string;
  hizmet_turu: string;
  tasima_tarihi: string;
  nereden_adres: string;
  nereye_adres: string;
  notlar?: string;
}

interface IletisimData {
  ad_soyad: string;
  email: string;
  telefon: string;
  mesaj: string;
}

export function formatTeklifMessage(data: TeklifData) {
  return `
🆕 <b>Yeni Teklif Talebi</b>

👤 <b>Müşteri Bilgileri:</b>
Ad Soyad: ${data.ad_soyad}
Telefon: ${data.telefon}
E-posta: ${data.email}

📦 <b>Taşıma Detayları:</b>
Hizmet: ${data.hizmet_turu}
Tarih: ${data.tasima_tarihi}

📍 <b>Adresler:</b>
Nereden: ${data.nereden_adres}
Nereye: ${data.nereye_adres}

📝 <b>Notlar:</b>
${data.notlar || 'Not belirtilmemiş'}
`;
}

export function formatIletisimMessage(data: IletisimData) {
  return `
💌 <b>Yeni İletişim Mesajı</b>

👤 <b>Gönderen Bilgileri:</b>
Ad Soyad: ${data.ad_soyad}
E-posta: ${data.email}
Telefon: ${data.telefon}

📝 <b>Mesaj:</b>
${data.mesaj}
`;
} 