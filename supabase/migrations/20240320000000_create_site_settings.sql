-- Site ayarları tablosunu oluştur
create table if not exists public.site_ayarlari (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    telefon text,
    email text,
    facebook_url text,
    instagram_url text,
    twitter_url text,
    logo_url text,
    logo_text text,
    whatsapp_numara text,
    adres text
);

-- Menü tablosunu oluştur
create table if not exists public.menu_items (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    baslik text not null,
    link text not null,
    sira integer not null default 0,
    parent_id uuid references public.menu_items(id),
    aktif boolean default true
);

-- Logo ve menü resimleri için storage bucket oluştur
insert into storage.buckets (id, name, public) 
values ('site_assets', 'site_assets', true);

-- Storage politikaları
create policy "Herkes site_assets görebilir"
on storage.objects for select
using ( bucket_id = 'site_assets' );

create policy "Sadece yetkililer site_assets yükleyebilir"
on storage.objects for insert
with check ( 
    bucket_id = 'site_assets' 
    and auth.role() = 'authenticated'
);

create policy "Sadece yetkililer site_assets güncelleyebilir"
on storage.objects for update
using ( 
    bucket_id = 'site_assets' 
    and auth.role() = 'authenticated'
);

create policy "Sadece yetkililer site_assets silebilir"
on storage.objects for delete
using ( 
    bucket_id = 'site_assets' 
    and auth.role() = 'authenticated'
);

-- Tablo politikaları
create policy "Herkes site ayarlarını görebilir"
on public.site_ayarlari for select
to public
using (true);

create policy "Sadece yetkililer site ayarlarını düzenleyebilir"
on public.site_ayarlari for all
to authenticated
using (true)
with check (true);

create policy "Herkes menü öğelerini görebilir"
on public.menu_items for select
to public
using (true);

create policy "Sadece yetkililer menü öğelerini düzenleyebilir"
on public.menu_items for all
to authenticated
using (true)
with check (true);

-- Varsayılan site ayarları
insert into public.site_ayarlari (telefon, email, logo_text)
values ('+90 555 555 55 55', 'info@firma.com', 'Firma Adı');

-- RLS'yi etkinleştir
alter table public.site_ayarlari enable row level security;
alter table public.menu_items enable row level security; 