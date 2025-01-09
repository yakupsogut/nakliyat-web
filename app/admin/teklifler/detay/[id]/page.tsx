"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/app/components/ConfirmModal";

interface Teklif {
  id: number;
  ad_soyad: string;
  email: string;
  telefon: string;
  hizmet_turu: string;
  nereden_adres: string;
  nereye_adres: string;
  tasima_tarihi: string;
  notlar: string;
  durum: string;
  created_at: string;
}

export default function TeklifDetay() {
  const params = useParams();
  const router = useRouter();
  const [teklif, setTeklif] = useState<Teklif | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchTeklif = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('teklifler')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setTeklif(data);
    } catch (error) {
      console.error('Teklif detayı getirilirken hata:', error);
      router.push('/admin/teklifler');
    } finally {
      setLoading(false);
    }
  }, [params.id, router, setTeklif, setLoading]);

  useEffect(() => {
    fetchTeklif();
  }, [fetchTeklif]);

  const updateDurum = async (yeniDurum: string) => {
    if (!teklif) return;

    try {
      const { data, error } = await supabase
        .from('teklifler')
        .update({ 
          durum: yeniDurum,
          updated_at: new Date().toISOString()
        })
        .eq('id', teklif.id)
        .select()
        .single();

      if (error) {
        console.error('Durum güncellenirken hata:', error);
        return;
      }

      if (data) {
        setTeklif(data);
      }
    } catch (error) {
      console.error('Teklif durumu güncellenirken hata:', error);
    }
  };

  const handleDelete = async () => {
    if (!teklif) return;

    try {
      const { error } = await supabase
        .from('teklifler')
        .delete()
        .eq('id', teklif.id);

      if (error) throw error;
      router.push('/admin/teklifler');
    } catch (error) {
      console.error('Teklif silinirken hata:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!teklif) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-100">Teklif bulunamadı</h2>
        <Link href="/admin/teklifler" className="mt-4 text-indigo-400 hover:text-indigo-300">
          Tekliflere Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Teklifi Sil"
        message={`"${teklif?.ad_soyad}" adlı teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/teklifler"
              className="inline-flex items-center text-gray-400 hover:text-gray-300"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-white">Teklif Detayı</h1>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Teklif bilgilerini görüntüleyin ve düzenleyin
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
          >
            Teklifi Sil
          </button>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium leading-6 text-white">Durum</h3>
              <select
                value={teklif.durum || 'beklemede'}
                onChange={(e) => updateDurum(e.target.value)}
                className={`mt-2 block w-full rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                  teklif.durum === "beklemede"
                    ? "bg-yellow-900 text-yellow-200 focus:ring-yellow-500"
                    : teklif.durum === "inceleniyor"
                    ? "bg-blue-900 text-blue-200 focus:ring-blue-500"
                    : teklif.durum === "onaylandi"
                    ? "bg-green-900 text-green-200 focus:ring-green-500"
                    : "bg-red-900 text-red-200 focus:ring-red-500"
                }`}
              >
                <option value="beklemede">Beklemede</option>
                <option value="inceleniyor">İnceleniyor</option>
                <option value="onaylandi">Onaylandı</option>
                <option value="reddedildi">Reddedildi</option>
              </select>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-white">Oluşturulma Tarihi</h3>
              <p className="mt-2 text-sm text-gray-300">
                {new Date(teklif.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-white">Ad Soyad</h3>
              <p className="mt-2 text-sm text-gray-300">{teklif.ad_soyad}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-white">Hizmet Türü</h3>
              <p className="mt-2 text-sm text-gray-300">{teklif.hizmet_turu}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-white">E-posta</h3>
              <p className="mt-2 text-sm text-gray-300">{teklif.email}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-white">Telefon</h3>
              <p className="mt-2 text-sm text-gray-300">{teklif.telefon}</p>
            </div>

            <div className="sm:col-span-2">
              <h3 className="text-lg font-medium leading-6 text-white">Nereden</h3>
              <p className="mt-2 text-sm text-gray-300">{teklif.nereden_adres}</p>
            </div>

            <div className="sm:col-span-2">
              <h3 className="text-lg font-medium leading-6 text-white">Nereye</h3>
              <p className="mt-2 text-sm text-gray-300">{teklif.nereye_adres}</p>
            </div>

            <div className="sm:col-span-2">
              <h3 className="text-lg font-medium leading-6 text-white">Taşıma Tarihi</h3>
              <p className="mt-2 text-sm text-gray-300">{teklif.tasima_tarihi}</p>
            </div>

            <div className="sm:col-span-2">
              <h3 className="text-lg font-medium leading-6 text-white">Notlar</h3>
              <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">{teklif.notlar}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 