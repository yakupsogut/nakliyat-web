import { createServerClient } from '@/lib/supabase';
import AdminHeroSlider from './AdminHeroSlider';

export default async function HeroAdmin() {
  const supabase = createServerClient();
  
  const { data: slides } = await supabase
    .from('hero_slides')
    .select('*')
    .order('order_no', { ascending: true });

  if (!slides) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return <AdminHeroSlider initialSlides={slides} />;
} 