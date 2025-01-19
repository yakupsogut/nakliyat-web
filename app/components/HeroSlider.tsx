import { createServerClient } from '@/lib/supabase';
import ClientHeroSlider from './ClientHeroSlider';

export default async function HeroSlider() {
  const supabase = createServerClient();
  
  const { data: slides } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('order_no', { ascending: true });

  if (!slides || slides.length === 0) {
    return null;
  }

  return <ClientHeroSlider slides={slides} />;
} 