"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface SSS {
  id: number;
  soru: string;
  cevap: string;
  kategori: string;
  aktif: boolean;
  siralama: number;
}

export default function DuzenleSSS({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sss, setSSS] = useState<SSS>({
    id: parseInt(id),
    soru: "",
    cevap: "",
    kategori: "",
    aktif: true,
    siralama: 0,
  });

  const fetchSSS = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sss')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setSSS(data);
    } catch (error) {
      console.error('SSS yüklenirken hata:', error);
      alert('SSS yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [id, setSSS, setLoading]);

  useEffect(() => {
    fetchSSS();
  }, [fetchSSS]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('sss')
        .update({
          soru: sss.soru,
          cevap: sss.cevap,
          kategori: sss.kategori,
          aktif: sss.aktif
        })
        .eq('id', sss.id)
        .select();

      if (error) {
        console.error('Güncelleme hatası:', error);
        throw error;
      }

      router.push('/admin/sss');
      router.refresh();
    } catch (error) {
      console.error('SSS güncellenirken hata:', error);
      alert('SSS güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">SSS Düzenle</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Soru
              </label>
              <input
                type="text"
                required
                value={sss.soru}
                onChange={(e) => setSSS({ ...sss, soru: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Soru başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Cevap
              </label>
              <textarea
                required
                rows={6}
                value={sss.cevap}
                onChange={(e) => setSSS({ ...sss, cevap: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Detaylı cevap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Kategori
              </label>
              <select
                required
                value={sss.kategori}
                onChange={(e) => setSSS({ ...sss, kategori: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                <option value="">Kategori seçin</option>
                <option value="Sigorta">Sigorta</option>
                <option value="Süreç">Süreç</option>
                <option value="Hizmetler">Hizmetler</option>
                <option value="Depolama">Depolama</option>
                <option value="Ödeme">Ödeme</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={sss.aktif}
                onChange={(e) => setSSS({ ...sss, aktif: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900 bg-gray-800 transition-colors duration-200"
              />
              <label className="text-sm font-medium text-gray-200">
                Aktif
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push("/admin/sss")}
              className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 