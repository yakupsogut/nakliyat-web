import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// SendGrid API anahtarını ayarla
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // E-posta içeriğini oluştur
    const msg = {
      to: process.env.CONTACT_EMAIL || '', // Alıcı e-posta adresi
      from: process.env.SENDGRID_FROM_EMAIL || '', // Gönderen e-posta adresi (SendGrid'de doğrulanmış olmalı)
      subject: 'Yeni İletişim Formu Mesajı',
      text: `Ad Soyad: ${name}\nE-posta: ${email}\nTelefon: ${phone}\n\nMesaj:\n${message}`,
      html: `
        <h3>Yeni İletişim Formu Mesajı</h3>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `,
    };

    // E-postayı gönder
    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('E-posta gönderimi sırasında hata:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 