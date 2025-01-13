import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        
        const { data: gallery, error } = await supabase
            .from('gallery')
            .select('*')
            .order('order_no', { ascending: true });

        if (error) throw error;

        return NextResponse.json(gallery);
    } catch (error) {
        console.error('Galeri verileri alınırken hata:', error);
        return NextResponse.json(
            { error: 'Galeri verileri alınamadı' },
            { status: 500 }
        );
    }
} 