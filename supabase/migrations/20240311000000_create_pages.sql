-- Sayfalar tablosunu oluştur
create table if not exists public.sayfalar (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    baslik text not null,
    icerik jsonb not null default '[]'::jsonb,
    meta_title text,
    meta_description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sayfa içeriği için JSONB şeması örneği:
comment on column public.sayfalar.icerik is
'İçerik JSON formatında olmalıdır. Örnek:
[
  {
    "type": "heading",
    "content": "Başlık"
  },
  {
    "type": "paragraph",
    "content": "Paragraf metni"
  },
  {
    "type": "image",
    "url": "https://...",
    "alt": "Resim açıklaması"
  }
]';

-- RLS politikaları
alter table public.sayfalar enable row level security;

-- Herkes okuyabilir
create policy "Herkes sayfaları görüntüleyebilir"
on public.sayfalar for select
to public
using (true);

-- Sadece yetkililer düzenleyebilir
create policy "Sadece yetkililer sayfaları düzenleyebilir"
on public.sayfalar for all
to authenticated
using (
  exists (
    select 1 from public.admin_users au 
    where au.id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users au 
    where au.id = auth.uid()
  )
);

-- Updated at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger handle_updated_at
  before update
  on public.sayfalar
  for each row
  execute procedure public.handle_updated_at();

-- Örnek sayfa: Hakkımızda
insert into public.sayfalar (slug, baslik, icerik, meta_title, meta_description) 
values (
  'hakkimizda',
  'Hakkımızda',
  '[
    {
      "type": "heading",
      "content": "20 Yıllık Tecrübe"
    },
    {
      "type": "paragraph",
      "content": "20 yıllık tecrübemizle Türkiye''nin önde gelen nakliyat şirketlerinden biriyiz."
    },
    {
      "type": "heading",
      "content": "Vizyonumuz"
    },
    {
      "type": "paragraph",
      "content": "Türkiye''nin lider nakliyat şirketi olma vizyonuyla, müşterilerimize en kaliteli ve güvenilir hizmeti sunmayı hedefliyoruz. Modern ekipmanlarımız ve uzman kadromuzla sektörde öncü olmaya devam ediyoruz."
    },
    {
      "type": "heading",
      "content": "Misyonumuz"
    },
    {
      "type": "paragraph",
      "content": "Müşterilerimizin eşyalarını kendi eşyalarımız gibi özenle taşımak, güvenli ve zamanında teslimat yapmak temel misyonumuzdur. Her müşterimize özel çözümler üreterek, en iyi hizmeti sunmaya çalışıyoruz."
    },
    {
      "type": "image",
      "url": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
      "alt": "Nakliyat ekibimiz"
    }
  ]'::jsonb,
  'Hakkımızda - 20 Yıllık Tecrübe',
  'Türkiye''nin önde gelen nakliyat şirketlerinden biri olarak 20 yıllık tecrübemizle hizmetinizdeyiz.'
); 