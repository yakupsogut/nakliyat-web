import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // WhatsApp mesaj metni oluştur
    const message = `🚛 *Yeni Teklif Talebi*\n\n` +
      `*Müşteri Bilgileri:*\n` +
      `Ad: ${data.firstName}\n` +
      `Soyad: ${data.lastName}\n` +
      `Telefon: ${data.phone}\n` +
      `E-posta: ${data.email}\n\n` +
      `*Taşınma Detayları:*\n` +
      `Hizmet: ${data.serviceType}\n` +
      `Tarih: ${data.moveDate}\n` +
      `Mevcut Adres: ${data.fromAddress}\n` +
      `Taşınılacak Adres: ${data.toAddress}\n` +
      `Notlar: ${data.notes}`;

    // E-posta gönder
    const emailHtml = `
      <h2>Yeni Teklif Talebi</h2>
      <h3>Müşteri Bilgileri:</h3>
      <p><strong>Ad:</strong> ${data.firstName}</p>
      <p><strong>Soyad:</strong> ${data.lastName}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>E-posta:</strong> ${data.email}</p>
      <h3>Taşınma Detayları:</h3>
      <p><strong>Hizmet:</strong> ${data.serviceType}</p>
      <p><strong>Tarih:</strong> ${data.moveDate}</p>
      <p><strong>Mevcut Adres:</strong> ${data.fromAddress}</p>
      <p><strong>Taşınılacak Adres:</strong> ${data.toAddress}</p>
      <p><strong>Notlar:</strong> ${data.notes}</p>
    `;

    const emailData = {
      to: process.env.CONTACT_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL || '',
      subject: 'Yeni Teklif Talebi',
      text: message,
      html: emailHtml,
    };

    await sgMail.send(emailData);

    // WhatsApp mesajı gönder
    const whatsappEndpoint = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    const whatsappResponse = await fetch(whatsappEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: process.env.ADMIN_PHONE_NUMBER,
        type: "text",
        text: { body: message }
      }),
    });

    if (!whatsappResponse.ok) {
      console.error('WhatsApp mesajı gönderilemedi');
    }

    // Müşteriye otomatik yanıt e-postası gönder
    const autoReplyEmailData = {
      to: data.email,
      from: process.env.SENDGRID_FROM_EMAIL || '',
      subject: 'Teklif Talebiniz Alındı - NakliyatPro',
      html: `
        <h2>Sayın ${data.firstName} ${data.lastName},</h2>
        <p>Teklif talebiniz başarıyla alınmıştır. En kısa sürede size dönüş yapacağız.</p>
        <h3>Talep Detaylarınız:</h3>
        <p><strong>Hizmet:</strong> ${data.serviceType}</p>
        <p><strong>Tarih:</strong> ${data.moveDate}</p>
        <p><strong>Mevcut Adres:</strong> ${data.fromAddress}</p>
        <p><strong>Taşınılacak Adres:</strong> ${data.toAddress}</p>
        <br>
        <p>Sorularınız için bize aşağıdaki kanallardan ulaşabilirsiniz:</p>
        <p>📞 Telefon: +90 (212) 123 45 67</p>
        <p>📧 E-posta: info@nakliyatpro.com</p>
        <br>
        <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
        <p><strong>NakliyatPro Ekibi</strong></p>
      `
    };

    await sgMail.send(autoReplyEmailData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 