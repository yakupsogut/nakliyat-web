import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('x-revalidate-token');
    if (!REVALIDATE_TOKEN || token !== REVALIDATE_TOKEN) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Tüm sayfaları yeniden oluştur
    revalidatePath('/', 'layout');

    return Response.json({
      revalidated: true,
      message: 'Tüm sayfalar yeniden oluşturuldu',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      error: 'Revalidation hatası',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 