import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

// Güvenlik için basit bir token kontrolü
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // Token kontrolü
    const token = request.headers.get('x-revalidate-token');
    if (!REVALIDATE_TOKEN || token !== REVALIDATE_TOKEN) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Path parametresini al
    const path = request.nextUrl.searchParams.get('path');
    
    if (!path) {
      return Response.json({ error: 'Path parametresi gerekli' }, { status: 400 });
    }

    // Revalidate işlemini gerçekleştir
    revalidatePath(path);
    
    return Response.json({
      revalidated: true,
      path,
      message: `${path} sayfası yeniden oluşturuldu`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      error: 'Revalidation hatası',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 