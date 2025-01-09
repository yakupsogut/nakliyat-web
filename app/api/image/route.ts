import { NextRequest, NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// 1 yıllık önbellek süresi (saniye cinsinden)
const CACHE_DURATION = 31536000;

export const runtime = 'nodejs'; // nodejs fonksiyonu olarak çalıştır

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    const bucketName = searchParams.get('bucket') || 'blog-images';

    // URL'den benzersiz bir ETag oluştur
    const etag = `"${bucketName}-${imagePath}"`;
    
    // İstemcinin gönderdiği If-None-Match header'ını kontrol et
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      // Resim değişmemişse 304 Not Modified dön
      return new NextResponse(null, {
        status: 304,
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATION}, immutable`,
          'ETag': etag,
        },
      });
    }

    if (!imagePath) {
      return new NextResponse('Resim yolu belirtilmedi', { status: 400 });
    }

    const supabaseImageUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${imagePath}`;
    
    const imageResponse = await fetch(supabaseImageUrl);
    
    if (!imageResponse.ok) {
      return new NextResponse('Resim bulunamadı', { status: 404 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const headers = new Headers();
    
    // Content-Type header'ını ayarla
    headers.set('Content-Type', imageResponse.headers.get('Content-Type') || 'image/jpeg');
    
    // Güçlü önbellek direktifleri
    headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}, immutable`);
    headers.set('ETag', etag);
    
    // Diğer performans ve güvenlik header'ları
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Vary', 'Accept');
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    
    // Content güvenlik politikaları
    headers.set('Content-Security-Policy', "default-src 'self'");
    headers.set('X-Content-Type-Options', 'nosniff');

    return new NextResponse(imageBuffer, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Resim proxy hatası:', error);
    return new NextResponse('Sunucu hatası', { status: 500 });
  }
} 