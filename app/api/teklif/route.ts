import { NextResponse } from 'next/server';
import { createTeklif } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const teklifData = {
      ad_soyad: `${data.firstName} ${data.lastName}`,
      email: data.email,
      telefon: data.phone,
      hizmet_turu: data.serviceType,
      nereden_adres: data.fromAddress,
      nereye_adres: data.toAddress,
      tasima_tarihi: data.moveDate,
      esya_boyutu: data.serviceType,
      asansor_var_mi: data.notes?.toLowerCase().includes('asansör'),
      notlar: data.notes
    };

    const teklif = await createTeklif(teklifData);

    return NextResponse.json({ success: true, data: teklif });
  } catch (error) {
    console.error('Teklif oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Teklif oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 