export interface Teklif {
  id: number;
  created_at: string;
  updated_at: string;
  ad_soyad: string;
  email: string;
  telefon: string;
  hizmet_turu: string;
  tasima_tarihi: string;
  nereden_adres: string;
  nereye_adres: string;
  notlar?: string;
}

export interface IletisimMesaji {
  id: number;
  created_at: string;
  ad_soyad: string;
  email: string;
  telefon: string;
  mesaj: string;
}

export interface Referans {
  id: number;
  created_at: string;
  musteri_adi: string;
  yorum: string;
  puan: number;
  hizmet_turu: string;
  gorsel_url?: string;
}

export interface Hizmet {
  id: number;
  created_at: string;
  baslik: string;
  aciklama: string;
  resim_url?: string;
  aktif: boolean;
  siralama: number;
  ozellikler?: string[];
} 