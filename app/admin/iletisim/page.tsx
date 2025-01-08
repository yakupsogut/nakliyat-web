"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { TrashIcon } from "@heroicons/react/24/outline";

interface IletisimMesaji {
  id: number;
  created_at: string;
  ad_soyad: string;
  email: string;
  telefon: string;
  mesaj: string;
}

export default function IletisimPage() {
  const [loading, setLoading] = useState(true);
  const [mesajlar, setMesajlar] = useState<IletisimMesaji[]>([]);

  useEffect(() => {
    fetchMesajlar();
  }, []);

  const fetchMesajlar = async () => {
    try {
      const { data, error } = await supabase
        .from('iletisim_mesajlari')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMesajlar(data);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
      alert('Mesajlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('iletisim_mesajlari')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMesajlar(mesajlar.filter(mesaj => mesaj.id !== id));
    } catch (error) {
      console.error('Mesaj silinirken hata:', error);
      alert('Mesaj silinirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">İletişim Mesajları</h1>
              <p className="mt-2 text-gray-400">Gelen iletişim formları listesi</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">İletişim Mesajları</h1>
            <p className="mt-2 text-gray-400">Gelen iletişim formları listesi</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-700/50">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ad Soyad
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    E-posta
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Mesaj
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mesajlar.map((mesaj) => (
                  <tr key={mesaj.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {format(new Date(mesaj.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {mesaj.ad_soyad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {mesaj.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {mesaj.telefon}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="max-w-xs truncate">
                        {mesaj.mesaj}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(mesaj.id)}
                        className="text-red-500 hover:text-red-400 transition-colors inline-flex items-center gap-1 p-2 rounded-lg hover:bg-red-500/10"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {mesajlar.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                      Henüz hiç mesaj yok
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 