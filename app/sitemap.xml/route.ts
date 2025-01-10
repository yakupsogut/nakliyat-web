import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();
  
  try {
    // Site ayarlarını al
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('sitemap_default_priority, sitemap_default_changefreq, canonical_url_base')
      .single();

    if (settingsError) {
      console.error('Site ayarları alınamadı:', settingsError);
      return new Response('Site ayarları alınamadı', { status: 500 });
    }

    if (!settings?.canonical_url_base) {
      return new Response('Site URL ayarı bulunamadı', { status: 500 });
    }

    const baseUrl = settings.canonical_url_base.replace(/\/$/, '');
    const defaultPriority = settings.sitemap_default_priority || 0.5;
    const defaultChangefreq = settings.sitemap_default_changefreq || 'weekly';

    // Tüm sayfaları al
    const { data: pages, error: pagesError } = await supabase
      .from('sayfalar')
      .select('slug, updated_at')
      .eq('aktif', true);

    if (pagesError) {
      console.error('Sayfalar alınamadı:', pagesError);
    }

    // Tüm hizmetleri al
    const { data: services, error: servicesError } = await supabase
      .from('hizmetler')
      .select('id, created_at')
      .eq('aktif', true)
      .order('siralama', { ascending: true });

    if (servicesError) {
      console.error('Hizmetler alınamadı:', servicesError);
    }

    // Tüm blog yazılarını al
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog')
      .select('slug, created_at')
      .eq('aktif', true)
      .order('created_at', { ascending: false });

    if (blogError) {
      console.error('Blog yazıları alınamadı:', blogError);
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Ana sayfa - En yüksek öncelik
    xml += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;

    // Sabit sayfalar - Yüksek öncelik
    const staticPages = [
      { path: '/hizmetler', priority: 0.9 },
      { path: '/blog', priority: 0.8 },
      { path: '/iletisim', priority: 0.8 },
      { path: '/hakkimizda', priority: 0.7 },
      { path: '/referanslar', priority: 0.7 },
      { path: '/sss', priority: 0.7 },
      { path: '/teklif-al', priority: 0.9 }
    ];

    staticPages.forEach(page => {
      xml += `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${defaultChangefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });

    // Dinamik sayfalar
    pages?.forEach(page => {
      xml += `  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${page.updated_at}</lastmod>
    <changefreq>${defaultChangefreq}</changefreq>
    <priority>${defaultPriority}</priority>
  </url>\n`;
    });

    // Hizmet sayfaları - Yüksek öncelik
    services?.forEach(service => {
      xml += `  <url>
    <loc>${baseUrl}/hizmetler/${service.id}</loc>
    <lastmod>${service.created_at}</lastmod>
    <changefreq>${defaultChangefreq}</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    // Blog yazıları - Orta öncelik
    blogPosts?.forEach(post => {
      xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.created_at}</lastmod>
    <changefreq>${defaultChangefreq}</changefreq>
    <priority>0.6</priority>
  </url>\n`;
    });

    xml += '</urlset>';

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // 1 saat cache
      },
    });
  } catch (error) {
    console.error('Sitemap oluşturulurken hata:', error);
    return new Response('Sitemap oluşturulamadı', { status: 500 });
  }
} 