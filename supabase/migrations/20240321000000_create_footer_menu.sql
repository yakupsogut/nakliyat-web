-- Footer menü grupları tablosunu oluştur
create table if not exists public.footer_menu_groups (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    baslik text not null,
    sira integer not null default 0,
    aktif boolean default true
);

-- Footer menü öğeleri tablosunu oluştur
create table if not exists public.footer_menu_items (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    baslik text not null,
    link text not null,
    sira integer not null default 0,
    group_id uuid references public.footer_menu_groups(id) on delete cascade,
    aktif boolean default true
);

-- Footer menü grupları için politikalar
create policy "Herkes footer menü gruplarını görebilir"
on public.footer_menu_groups for select
to public
using (true);

create policy "Sadece yetkililer footer menü gruplarını düzenleyebilir"
on public.footer_menu_groups for all
to authenticated
using (true)
with check (true);

-- Footer menü öğeleri için politikalar
create policy "Herkes footer menü öğelerini görebilir"
on public.footer_menu_items for select
to public
using (true);

create policy "Sadece yetkililer footer menü öğelerini düzenleyebilir"
on public.footer_menu_items for all
to authenticated
using (true)
with check (true);

-- RLS'yi etkinleştir
alter table public.footer_menu_groups enable row level security;
alter table public.footer_menu_items enable row level security;

-- Örnek footer menü grupları
insert into public.footer_menu_groups (baslik, sira) values
('Kurumsal', 1),
('Hizmetlerimiz', 2),
('Faydalı Linkler', 3);

-- Örnek footer menü öğeleri
insert into public.footer_menu_items (baslik, link, sira, group_id) 
select 'Hakkımızda', '/hakkimizda', 1, id from public.footer_menu_groups where baslik = 'Kurumsal'
union all
select 'İletişim', '/iletisim', 2, id from public.footer_menu_groups where baslik = 'Kurumsal'; 