-- Önce mevcut sayfalar tablosunu yedekleyelim
create table if not exists public.sayfalar_yedek as
select * from public.sayfalar;

-- Mevcut sayfalar tablosunu düşürelim
drop table if exists public.sayfalar;

-- Yeni basitleştirilmiş sayfalar tablosunu oluşturalım
create table if not exists public.sayfalar (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    baslik text not null,
    icerik text not null default '',
    meta_title text,
    meta_description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- Yedekten verileri geri yükleyelim ve içeriği dönüştürelim
insert into public.sayfalar (id, slug, baslik, icerik, meta_title, meta_description, created_at, updated_at)
select 
  id, 
  slug, 
  baslik,
  -- İçeriği HTML formatına dönüştür
  (
    select string_agg(
      case 
        when item->>'type' = 'heading' then '<h2>' || (item->>'content') || '</h2>'
        when item->>'type' = 'paragraph' then (item->>'content')
        when item->>'type' = 'image' then '<img src="' || (item->>'url') || '" alt="' || (item->>'alt') || '" />'
        else ''
      end,
      E'\n'
    )
    from jsonb_array_elements(icerik) as item
  ),
  meta_title,
  meta_description,
  created_at,
  updated_at
from public.sayfalar_yedek;

-- Yedek tabloyu silelim
drop table if exists public.sayfalar_yedek; 