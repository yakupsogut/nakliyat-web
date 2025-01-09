import { NextResponse } from 'next/server';
import { createIletisimMesaji } from '@/lib/db';
import { sendTelegramMessage, formatIletisimMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const mesajData = {
      ad_soyad: data.name,
      email: data.email,
      telefon: data.phone,
      mesaj: data.message
    };

    const mesaj = await createIletisimMesaji(mesajData);

    // Telegram bildirimi gönder
    await sendTelegramMessage(formatIletisimMessage(mesajData));

    return NextResponse.json({ success: true, data: mesaj });
  } catch (error) {
    console.error('İletişim mesajı oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, error: 'İletişim mesajı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 