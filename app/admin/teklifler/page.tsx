"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
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

export default function AdminTeklifler() {
  const [teklifler, setTeklifler] = useState<Teklif[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    teklifId: number | null;
    teklifAd: string;
  }>({
    isOpen: false,
    teklifId: null,
    teklifAd: "",
  });

  useEffect(() => {
    fetchTeklifler();
  }, []);

  const fetchTeklifler = async () => {
    try {
      const { data, error } = await supabase
        .from('teklifler')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeklifler(data || []);
    } catch (error) {
      console.error('Teklifler getirilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('teklifler')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTeklifler(teklifler.filter(teklif => teklif.id !== id));
      setDeleteModal({ isOpen: false, teklifId: null, teklifAd: "" });
    } catch (error) {
      console.error('Teklif silinirken hata:', error);
    }
  };

  const openDeleteModal = (id: number, ad: string) => {
    setDeleteModal({
      isOpen: true,
      teklifId: id,
      teklifAd: ad,
    });
  };

  const updateDurum = async (id: number, yeniDurum: string) => {
    try {
      const { data, error } = await supabase
        .from('teklifler')
        .update({ 
          durum: yeniDurum,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Durum güncellenirken hata:', error);
        return;
      }

      if (data) {
        setTeklifler(teklifler.map(teklif => 
          teklif.id === id ? data : teklif
        ));
      }
    } catch (error) {
      console.error('Teklif durumu güncellenirken hata:', error);
    }
  };

  const filteredTeklifler = teklifler.filter((teklif) => {
    const searchFields = [
      teklif.ad_soyad,
      teklif.email,
      teklif.telefon,
      teklif.hizmet_turu,
      teklif.nereden_adres,
      teklif.nereye_adres,
      teklif.notlar
    ].map(field => (field || "").toLowerCase());

    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchesSearch = searchTerms.every(term => 
      searchFields.some(field => field.includes(term))
    );

    const matchesStatus =
      statusFilter === "all" || (teklif.durum || "beklemede") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, teklifId: null, teklifAd: "" })}
        onConfirm={() => deleteModal.teklifId && handleDelete(deleteModal.teklifId)}
        title="Teklifi Sil"
        message={`"${deleteModal.teklifAd}" adlı teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Teklifler</h1>
          <p className="mt-2 text-sm text-gray-400">
            Tüm nakliyat tekliflerinin listesi
          </p>
        </div>
      </div>

      <div className="mt-4 sm:flex sm:items-center sm:justify-between">
        <div className="max-w-lg w-full lg:max-w-xs">
          <label htmlFor="search" className="sr-only">
            Ara
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Teklif ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <select
            id="status"
            name="status"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="beklemede">Beklemede</option>
            <option value="inceleniyor">İnceleniyor</option>
            <option value="onaylandi">Onaylandı</option>
            <option value="reddedildi">Reddedildi</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Ad Soyad
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      İletişim
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Hizmet Türü
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Tarih
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Durum
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {filteredTeklifler.map((teklif) => (
                    <tr key={teklif.id} className="hover:bg-gray-700">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                        {teklif.ad_soyad}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <div>{teklif.email}</div>
                        <div>{teklif.telefon}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {teklif.hizmet_turu}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {new Date(teklif.created_at).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <select
                          value={teklif.durum || 'beklemede'}
                          onChange={(e) => updateDurum(teklif.id, e.target.value)}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            teklif.durum === "beklemede"
                              ? "bg-yellow-900 text-yellow-200"
                              : teklif.durum === "inceleniyor"
                              ? "bg-blue-900 text-blue-200"
                              : teklif.durum === "onaylandi"
                              ? "bg-green-900 text-green-200"
                              : "bg-red-900 text-red-200"
                          }`}
                        >
                          <option value="beklemede">Beklemede</option>
                          <option value="inceleniyor">İnceleniyor</option>
                          <option value="onaylandi">Onaylandı</option>
                          <option value="reddedildi">Reddedildi</option>
                        </select>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/admin/teklifler/detay/${teklif.id}`}
                          className="text-indigo-400 hover:text-indigo-300 mr-4"
                        >
                          <EyeIcon className="w-5 h-5 inline" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(teklif.id, teklif.ad_soyad)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 