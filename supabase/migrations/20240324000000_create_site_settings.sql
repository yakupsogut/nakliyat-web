-- Site ayarları tablosunu oluştur
create table if not exists public.site_settings (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- SEO Ayarları
    site_title text not null default 'Site Başlığı',
    site_description text,
    site_keywords text,
    favicon_url text,
    
    -- Open Graph
    og_title text,
    og_description text,
    og_image text,
    
    -- Twitter Card
    twitter_card_type text default 'summary_large_image',
    twitter_title text,
    twitter_description text,
    twitter_image text,
    
    -- Robots.txt Ayarları
    robots_content text default 'User-agent: *\nAllow: /',
    
    -- Sitemap Ayarları
    sitemap_auto_update boolean default true,
    sitemap_default_priority decimal default 0.5,
    sitemap_default_changefreq text default 'weekly',
    
    -- Genel Ayarlar
    canonical_url_base text,
    google_analytics_id text,
    google_site_verification text
);

-- RLS politikaları
alter table public.site_settings enable row level security;

create policy "Herkes site ayarlarını görebilir"
on public.site_settings for select
to public
using (true);

create policy "Sadece yetkililer site ayarlarını düzenleyebilir"
on public.site_settings for all
to authenticated
using (true)
with check (true);

-- Varsayılan site ayarlarını ekle
insert into public.site_settings (
    site_title,
    site_description,
    site_keywords,
    robots_content
) values (
    'Nakliyat Web Sitesi',
    'Profesyonel nakliyat hizmetleri',
    'nakliyat, taşımacılık, evden eve nakliyat',
    E'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml'
); 