"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteAyarlari } from "@/lib/types";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function SiteAyarlariPage() {
  const [ayarlar, setAyarlar] = useState<SiteAyarlari | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    getAyarlar();
  }, []);

  async function getAyarlar() {
    const { data, error } = await supabase
      .from('site_ayarlari')
      .select('*')
      .single();

    if (error) {
      toast.error('Site ayarları yüklenirken hata oluştu');
      return;
    }

    setAyarlar(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setYukleniyor(true);

    try {
      // Logo yükleme
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
      }

      // Ayarları güncelle
      const { error: updateError } = await supabase
        .from('site_ayarlari')
        .update({
          ...ayarlar,
          logo_url: yeniLogoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', ayarlar?.id);

      if (updateError) throw updateError;

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
          <div className="space-y-8 divide-y divide-gray-700">
            <div className="space-y-6 sm:space-y-5">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-200">
                  Site Ayarları
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Logo, iletişim bilgileri ve sosyal medya hesaplarını buradan yönetebilirsiniz.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Logo */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Logo
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    {ayarlar.logo_url && (
                      <div className="mb-4">
                        <Image
                          src={ayarlar.logo_url}
                          alt="Mevcut Logo"
                          width={80}
                          height={80}
                          className="h-20 object-contain bg-white rounded p-2"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-400

                        file:mr-4 file:py-2 file:px-4

                        file:rounded-md file:border-0

                        file:text-sm file:font-semibold

                        file:bg-gray-700 file:text-gray-200

                        hover:file:bg-gray-600"

                    />
                  </div>
                </div>

                {/* Logo Text */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    Logo Yazısı
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      value={ayarlar.logo_text || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, logo_text: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
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
                      type="text"
                      value={ayarlar.telefon || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, telefon: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                    E-posta
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="email"
                      value={ayarlar.email || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
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
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
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
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
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
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
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
                      type="text"
                      value={ayarlar.whatsapp_numara || ''}
                      onChange={(e) => setAyarlar({ ...ayarlar, whatsapp_numara: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
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
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={yukleniyor}
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 