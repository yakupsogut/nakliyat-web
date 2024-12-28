import { supabase } from './supabase'
import { Teklif, IletisimMesaji, Referans, Hizmet } from './types'

// Teklif işlemleri
export async function createTeklif(teklifData: Omit<Teklif, 'id' | 'created_at' | 'updated_at'>): Promise<Teklif> {
  const { data, error } = await supabase
    .from('teklifler')
    .insert([teklifData])
    .select()
    .single();
  
  if (error) throw error
  return data;
}

// İletişim mesajı işlemleri
export async function createIletisimMesaji(mesajData: Omit<IletisimMesaji, 'id' | 'created_at'>): Promise<IletisimMesaji> {
  const { data, error } = await supabase
    .from('iletisim_mesajlari')
    .insert([mesajData])
    .select()
    .single();
  
  if (error) throw error
  return data;
}

// Referans işlemleri
export async function getReferanslar(): Promise<Referans[]> {
  const { data, error } = await supabase
    .from('referanslar')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error
  return data || [];
}

// Hizmet işlemleri
export async function getAktifHizmetler(): Promise<Hizmet[]> {
  const { data, error } = await supabase
    .from('hizmetler')
    .select('*')
    .eq('aktif', true)
    .order('siralama', { ascending: true });
  
  if (error) throw error
  return data || [];
}

export async function getHizmetById(id: number): Promise<Hizmet | null> {
  const { data, error } = await supabase
    .from('hizmetler')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
} 