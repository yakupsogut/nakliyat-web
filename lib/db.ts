import { supabase } from './supabase'
import { Teklif, IletisimMesaji, Referans, Hizmet, SSS } from './types'

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
export async function getReferanslar(limit?: number): Promise<Referans[]> {
  let query = supabase
    .from('referanslar')
    .select('*')
    .order('siralama', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  
  if (error) throw error;
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
    .eq('aktif', true)
    .single();

  if (error) throw error;
  return data;
}

// SSS işlemleri
export async function getSSS(limit?: number): Promise<SSS[]> {
  let query = supabase
    .from('sss')
    .select('*')
    .order('siralama', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function getAktifSSS(): Promise<SSS[]> {
  const { data, error } = await supabase
    .from('sss')
    .select('*')
    .eq('aktif', true)
    .order('siralama', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getSSById(id: number): Promise<SSS | null> {
  const { data, error } = await supabase
    .from('sss')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
} 