"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteAyarlari } from "@/lib/types";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function SiteAyarlariPage() {
  const [ayarlar, setAyarlar] = useState<SiteAyarlari | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [activeTab, setActiveTab] = useState('genel');

  useEffect(() => {
    getAyarlar();
  }, []);

  async function getAyarlar() {
    try {
      // Önce site_settings tablosundan SEO ve diğer ayarları al
      const { data: siteSettings, error: siteError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (siteError && siteError.code !== 'PGRST116') {
        throw siteError;
      }

      // Sonra site_ayarlari tablosundan genel ayarları al
      const { data: generalSettings, error: generalError } = await supabase
        .from('site_ayarlari')
        .select('*')
        .single();

      if (generalError && generalError.code !== 'PGRST116') {
        throw generalError;
      }

      // İki veri setini birleştir
      setAyarlar({
        ...generalSettings,
        ...siteSettings,
        // Eğer yeni bir kayıt oluşturulacaksa varsayılan değerler
        site_title: siteSettings?.site_title || 'Site Başlığı',
        robots_content: siteSettings?.robots_content || 'User-agent: *\nAllow: /',
        sitemap_auto_update: siteSettings?.sitemap_auto_update ?? true,
        sitemap_default_priority: siteSettings?.sitemap_default_priority || 0.5,
        sitemap_default_changefreq: siteSettings?.sitemap_default_changefreq || 'weekly',
        twitter_card_type: siteSettings?.twitter_card_type || 'summary_large_image',
      });
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
      toast.error('Site ayarları yüklenirken hata oluştu');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setYukleniyor(true);

    try {
      // Logo yükleme veya silme
      let yeniLogoUrl = ayarlar?.logo_url;
      if (logo) {
        const dosyaAdi = `logo-${Date.now()}${logo.name.substring(logo.name.lastIndexOf('.'))}`;
        const { error: uploadError } = await supabase.storage
          .from('site_assets')
          .upload(dosyaAdi, logo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site_assets')
          .getPublicUrl(dosyaAdi);

        yeniLogoUrl = publicUrl;
      } else if (ayarlar?.logo_url === '') {
        // Logo silindi, eski dosyayı storage'dan da silelim
        const eskiLogoPath = ayarlar?.logo_url?.split('/').pop();
        if (eskiLogoPath) {
          await supabase.storage
            .from('site_assets')
            .remove([eskiLogoPath]);
        }
        yeniLogoUrl = '';
      }

      // Favicon yükleme veya silme
      let yeniFaviconUrl = ayarlar?.favicon_url;
      if (favicon) {
        const dosyaAdi = `favicon-${Date.now()}${favicon.name.substring(favicon.name.lastIndexOf('.'))}`;
        const { error: uploadError } = await supabase.storage
          .from('site_assets')
          .upload(dosyaAdi, favicon);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site_assets')
          .getPublicUrl(dosyaAdi);

        yeniFaviconUrl = publicUrl;
      } else if (ayarlar?.favicon_url === '') {
        // Favicon silindi, eski dosyayı storage'dan da silelim
        const eskiFaviconPath = ayarlar?.favicon_url?.split('/').pop();
        if (eskiFaviconPath) {
          await supabase.storage
            .from('site_assets')
            .remove([eskiFaviconPath]);
        }
        yeniFaviconUrl = '';
      }

      // Genel ayarları güncelle
      const generalSettings = {
        logo_url: yeniLogoUrl,
        logo_text: ayarlar?.logo_text,
        telefon: ayarlar?.telefon,
        email: ayarlar?.email,
        facebook_url: ayarlar?.facebook_url,
        instagram_url: ayarlar?.instagram_url,
        twitter_url: ayarlar?.twitter_url,
        whatsapp_numara: ayarlar?.whatsapp_numara,
        adres: ayarlar?.adres,
      };

      // Önce mevcut kaydı kontrol et
      const { data: existingSettings, error: checkError } = await supabase
        .from('site_ayarlari')
        .select('id')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Eğer kayıt varsa güncelle, yoksa yeni kayıt oluştur
      const { error: generalError } = await supabase
        .from('site_ayarlari')
        .upsert({
          ...generalSettings,
          id: existingSettings?.id, // Eğer varsa mevcut id'yi kullan
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (generalError) throw generalError;

      // SEO ve diğer ayarları güncelle
      const seoSettings = {
        site_title: ayarlar?.site_title,
        site_description: ayarlar?.site_description,
        site_keywords: ayarlar?.site_keywords,
        favicon_url: yeniFaviconUrl,
        og_title: ayarlar?.og_title,
        og_description: ayarlar?.og_description,
        og_image: ayarlar?.og_image,
        twitter_card_type: ayarlar?.twitter_card_type,
        twitter_title: ayarlar?.twitter_title,
        twitter_description: ayarlar?.twitter_description,
        twitter_image: ayarlar?.twitter_image,
        robots_content: ayarlar?.robots_content,
        sitemap_auto_update: ayarlar?.sitemap_auto_update,
        sitemap_default_priority: ayarlar?.sitemap_default_priority,
        sitemap_default_changefreq: ayarlar?.sitemap_default_changefreq,
        canonical_url_base: ayarlar?.canonical_url_base,
        google_analytics_id: ayarlar?.google_analytics_id,
        google_site_verification: ayarlar?.google_site_verification,
      };

      // Önce mevcut kaydı kontrol et
      const { data: existingSeoSettings, error: checkSeoError } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      if (checkSeoError && checkSeoError.code !== 'PGRST116') {
        throw checkSeoError;
      }

      // Eğer kayıt varsa güncelle, yoksa yeni kayıt oluştur
      const { error: seoError } = await supabase
        .from('site_settings')
        .upsert({
          ...seoSettings,
          id: existingSeoSettings?.id, // Eğer varsa mevcut id'yi kullan
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (seoError) throw seoError;

      toast.success('Site ayarları başarıyla güncellendi');
      getAyarlar();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Site ayarları güncellenirken hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  }

  if (!ayarlar) return <div>Yükleniyor...</div>;

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full rounded-md border-gray-700 bg-gray-800 text-gray-200"
              >
                <option value="genel">Genel Ayarlar</option>
                <option value="seo">SEO Ayarları</option>
                <option value="robots">Robots.txt</option>
                <option value="sitemap">Sitemap</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="flex space-x-4">
                {['genel', 'seo', 'robots', 'sitemap'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === tab
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Ayarları
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'genel' && (
              <div className="space-y-6">
                {/* Logo */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Logo
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    {ayarlar.logo_url && (
                      <div className="mb-4">
                        <div className="flex items-center gap-4">
                          <Image
                            src={ayarlar.logo_url}
                            alt="Mevcut Logo"
                            width={80}
                            height={80}
                            className="h-20 object-contain bg-white rounded p-2"
                          />
                          <button
                            type="button"
                            onClick={() => setAyarlar({ ...ayarlar, logo_url: '' })}
                            className="px-3 py-2 text-sm text-red-400 hover:text-red-300 font-medium"
                          >
                            Logoyu Kaldır
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                    />
                  </div>
                </div>

                {/* Logo Yazısı */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Logo Yazısı
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      value={ayarlar.logo_text || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, logo_text: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                {/* Telefon */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Telefon
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="tel"
                      value={ayarlar.telefon || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, telefon: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="0212 123 45 67"
                    />
                  </div>
                </div>

                {/* E-posta */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    E-posta
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="email"
                      value={ayarlar.email || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="info@example.com"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    WhatsApp Numarası
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="tel"
                      value={ayarlar.whatsapp_numara || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, whatsapp_numara: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="905301234567"
                    />
                  </div>
                </div>

                {/* Adres */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Adres
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea
                      value={ayarlar.adres || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, adres: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="Firma adresinizi girin"
                    />
                  </div>
                </div>

                {/* Sosyal Medya */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Facebook URL
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="url"
                      value={ayarlar.facebook_url || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, facebook_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="https://facebook.com/sayfaadi"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Instagram URL
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="url"
                      value={ayarlar.instagram_url || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, instagram_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="https://instagram.com/kullaniciadi"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Twitter URL
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="url"
                      value={ayarlar.twitter_url || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, twitter_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="https://twitter.com/kullaniciadi"
                    />
                  </div>
                </div>

                {/* Site URL */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Site URL
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="url"
                      value={ayarlar.canonical_url_base || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, canonical_url_base: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="https://example.com"
                    />
                    <p className="mt-1 text-sm text-gray-400">
                      Site URL&apos;nizi https:// ile başlayacak şekilde girin. Örn: https://example.com
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Site Başlığı
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      value={ayarlar.site_title || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, site_title: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Site Açıklaması
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea
                      value={ayarlar.site_description || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, site_description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Anahtar Kelimeler
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      value={ayarlar.site_keywords || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, site_keywords: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="kelime1, kelime2, kelime3"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Favicon
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    {ayarlar.favicon_url && (
                      <div className="mb-4">
                        <div className="flex items-center gap-4">
                          <Image
                            src={ayarlar.favicon_url}
                            alt="Mevcut Favicon"
                            width={32}
                            height={32}
                            className="h-8 w-8 object-contain bg-white rounded p-1"
                          />
                          <button
                            type="button"
                            onClick={() => setAyarlar({ ...ayarlar, favicon_url: '' })}
                            className="px-3 py-2 text-sm text-red-400 hover:text-red-300 font-medium"
                          >
                            Favicon&apos;u Kaldır
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFavicon(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                    />
                    <p className="mt-1 text-sm text-gray-400">
                      Önerilen: 32x32 veya 16x16 piksel boyutunda .ico, .png formatında favicon
                    </p>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Google Analytics ID
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      value={ayarlar.google_analytics_id || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, google_analytics_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                      placeholder="UA-XXXXXXXXX-X"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Google Site Doğrulama
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      value={ayarlar.google_site_verification || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, google_site_verification: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'robots' && (
              <div className="space-y-6">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Robots.txt İçeriği
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea
                      value={ayarlar.robots_content || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, robots_content: e.target.value })}
                      rows={10}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 font-mono"
                      placeholder="User-agent: *\nAllow: /\nDisallow: /admin/"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sitemap' && (
              <div className="space-y-6">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Otomatik Güncelleme
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={ayarlar.sitemap_auto_update || false}
                      onChange={(e) => setAyarlar({ ...ayarlar, sitemap_auto_update: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 rounded bg-gray-800"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Varsayılan Öncelik
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={ayarlar.sitemap_default_priority || 0.5}
                      onChange={(e) => setAyarlar({ ...ayarlar, sitemap_default_priority: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Varsayılan Değişim Sıklığı
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      value={ayarlar.sitemap_default_changefreq || 'weekly'}
                      onChange={(e) => setAyarlar({ ...ayarlar, sitemap_default_changefreq: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                    >
                      <option value="always">Her zaman</option>
                      <option value="hourly">Saatlik</option>
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                      <option value="yearly">Yıllık</option>
                      <option value="never">Asla</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={yukleniyor}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    yukleniyor ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 