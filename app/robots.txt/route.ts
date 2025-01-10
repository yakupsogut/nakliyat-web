import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();
  
  const { data: settings } = await supabase
    .from('site_settings')
    .select('robots_content')
    .single();

  return new Response(settings?.robots_content || 'User-agent: *\nAllow: /', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 