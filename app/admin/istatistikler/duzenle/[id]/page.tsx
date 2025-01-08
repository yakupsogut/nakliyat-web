"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Istatistik {
  id: number;
  baslik: string;
  deger: string;
  aciklama: string;
  ikon: string;
  aktif: boolean;
  siralama: number;
}

export default function DuzenleIstatistik({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Istatistik>({
    id: parseInt(id),
    baslik: "",
    deger: "",
    aciklama: "",
    ikon: "",
    aktif: true,
    siralama: 0,
  });

  useEffect(() => {
    const fetchIstatistik = async () => {
      try {
        const { data, error } = await supabase
          .from('istatistikler')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) setFormData(data);
      } catch (error) {
        console.error('İstatistik yüklenirken hata:', error);
        alert('İstatistik yüklenirken bir hata oluştu.');
        router.push('/admin/istatistikler');
      }
    };

    fetchIstatistik();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('istatistikler')
        .update({
          baslik: formData.baslik,
          deger: formData.deger,
          aciklama: formData.aciklama,
          ikon: formData.ikon,
          aktif: formData.aktif,
        })
        .eq('id', id);

      if (error) throw error;
      router.push('/admin/istatistikler');
      router.refresh();
    } catch (error) {
      console.error('İstatistik güncellenirken hata:', error);
      alert('İstatistik güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-6">İstatistik Düzenle</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="baslik" className="block text-sm font-medium text-gray-200">
              Başlık
            </label>
            <input
              type="text"
              name="baslik"
              id="baslik"
              required
              value={formData.baslik}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="deger" className="block text-sm font-medium text-gray-200">
              Değer
            </label>
            <input
              type="text"
              name="deger"
              id="deger"
              required
              value={formData.deger}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="aciklama" className="block text-sm font-medium text-gray-200">
              Açıklama
            </label>
            <textarea
              name="aciklama"
              id="aciklama"
              rows={3}
              required
              value={formData.aciklama}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="ikon" className="block text-sm font-medium text-gray-200">
              İkon
            </label>
            <select
              name="ikon"
              id="ikon"
              required
              value={formData.ikon}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            >
              <option value="">İkon Seçin</option>
              <option value="truck">Kamyon</option>
              <option value="users">Kullanıcılar</option>
              <option value="chart-bar">Grafik</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="aktif"
              id="aktif"
              checked={formData.aktif}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="aktif" className="ml-2 block text-sm text-gray-200">
              Aktif
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 