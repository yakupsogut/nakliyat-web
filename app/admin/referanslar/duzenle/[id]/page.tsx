"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { use } from "react";

interface Referans {
  id: number;
  musteri_adi: string;
  yorum: string;
  puan: number;
  hizmet_turu: string;
}

export default function DuzenleReferans({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Referans>({
    id: parseInt(id),
    musteri_adi: "",
    yorum: "",
    puan: 5,
    hizmet_turu: "",
  });

  useEffect(() => {
    const fetchReferans = async () => {
      try {
        const { data, error } = await supabase
          .from('referanslar')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        console.error('Referans yüklenirken hata:', error);
        alert('Referans yüklenirken bir hata oluştu.');
        router.push('/admin/referanslar');
      }
    };

    fetchReferans();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('referanslar')
        .update({
          musteri_adi: formData.musteri_adi,
          yorum: formData.yorum,
          puan: formData.puan,
          hizmet_turu: formData.hizmet_turu,
        })
        .eq('id', parseInt(id));

      if (error) throw error;

      router.push('/admin/referanslar');
      router.refresh();
    } catch (error) {
      console.error('Referans güncellenirken hata:', error);
      alert('Referans güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const hizmetTurleri = [
    "Evden Eve Nakliyat",
    "Kurumsal Nakliyat",
    "Asansörlü Taşımacılık",
    "Şehirler Arası Nakliyat",
    "Depolama Hizmetleri",
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Referans Düzenle</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Müşteri Adı
            </label>
            <input
              type="text"
              value={formData.musteri_adi}
              onChange={(e) => setFormData({ ...formData, musteri_adi: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Yorum
            </label>
            <textarea
              value={formData.yorum}
              onChange={(e) => setFormData({ ...formData, yorum: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Puan
            </label>
            <select
              value={formData.puan}
              onChange={(e) => setFormData({ ...formData, puan: parseInt(e.target.value) })}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            >
              {[1, 2, 3, 4, 5].map((puan) => (
                <option key={puan} value={puan}>
                  {puan} Yıldız
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Hizmet Türü
            </label>
            <select
              value={formData.hizmet_turu}
              onChange={(e) => setFormData({ ...formData, hizmet_turu: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            >
              <option value="">Hizmet Türü Seçin</option>
              {hizmetTurleri.map((hizmet) => (
                <option key={hizmet} value={hizmet}>
                  {hizmet}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/referanslar')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 