"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { TrashIcon, EyeIcon, EnvelopeIcon, EnvelopeOpenIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ConfirmModal from "@/app/components/ConfirmModal";

interface IletisimMesaji {
  id: number;
  created_at: string;
  ad_soyad: string;
  email: string;
  telefon: string;
  mesaj: string;
  okundu: boolean;
}

export default function IletisimPage() {
  const [loading, setLoading] = useState(true);
  const [mesajlar, setMesajlar] = useState<IletisimMesaji[]>([]);
  const [selectedMesaj, setSelectedMesaj] = useState<IletisimMesaji | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    mesajId: number | null;
    mesajAd: string;
  }>({
    isOpen: false,
    mesajId: null,
    mesajAd: "",
  });

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
    try {
      const { error } = await supabase
        .from('iletisim_mesajlari')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMesajlar(mesajlar.filter(mesaj => mesaj.id !== id));
      setDeleteModal({ isOpen: false, mesajId: null, mesajAd: "" });
    } catch (error) {
      console.error('Mesaj silinirken hata:', error);
      alert('Mesaj silinirken bir hata oluştu.');
    }
  };

  const toggleOkundu = async (id: number, yeniDurum: boolean) => {
    try {
      const { data, error } = await supabase
        .from('iletisim_mesajlari')
        .update({ okundu: yeniDurum })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setMesajlar(mesajlar.map(mesaj => 
          mesaj.id === id ? { ...mesaj, okundu: yeniDurum } : mesaj
        ));
      }
    } catch (error) {
      console.error('Mesaj durumu güncellenirken hata:', error);
      alert('Mesaj durumu güncellenirken bir hata oluştu.');
    }
  };

  const openDeleteModal = (id: number, ad: string) => {
    setDeleteModal({
      isOpen: true,
      mesajId: id,
      mesajAd: ad,
    });
  };

  function closeModal() {
    setIsOpen(false);
    setSelectedMesaj(null);
  }

  async function openModal(mesaj: IletisimMesaji) {
    setSelectedMesaj(mesaj);
    setIsOpen(true);

    // Mesaj açıldığında okundu olarak işaretle
    if (!mesaj.okundu) {
      await toggleOkundu(mesaj.id, true);
    }
  }

  const filteredMesajlar = mesajlar.filter((mesaj) => {
    const searchFields = [
      mesaj.ad_soyad,
      mesaj.email,
      mesaj.telefon,
      mesaj.mesaj
    ].map(field => (field || "").toLowerCase());

    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchesSearch = searchTerms.every(term => 
      searchFields.some(field => field.includes(term))
    );

    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "okunmadi" && !mesaj.okundu) || 
      (statusFilter === "okundu" && mesaj.okundu);

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
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, mesajId: null, mesajAd: "" })}
          onConfirm={() => deleteModal.mesajId && handleDelete(deleteModal.mesajId)}
          title="Mesajı Sil"
          message={`"${deleteModal.mesajAd}" adlı kişinin mesajını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        />

        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">İletişim Mesajları</h1>
            <p className="mt-2 text-sm text-gray-400">
              Gelen iletişim formları listesi
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
                placeholder="Mesaj ara..."
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
              <option value="all">Tüm Mesajlar</option>
              <option value="okunmadi">Okunmamış</option>
              <option value="okundu">Okunmuş</option>
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
                        Durum
                      </th>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                        Ad Soyad
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        İletişim
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Mesaj
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Tarih
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">İşlemler</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800">
                    {filteredMesajlar.map((mesaj) => (
                      <tr key={mesaj.id} className={`hover:bg-gray-700 ${!mesaj.okundu ? 'bg-gray-700/50' : ''}`}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                          <button
                            onClick={() => toggleOkundu(mesaj.id, !mesaj.okundu)}
                            className={`${
                              mesaj.okundu 
                                ? 'text-gray-400 hover:text-gray-300' 
                                : 'text-yellow-400 hover:text-yellow-300'
                            }`}
                          >
                            {mesaj.okundu ? (
                              <EnvelopeOpenIcon className="w-5 h-5" />
                            ) : (
                              <EnvelopeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                          {mesaj.ad_soyad}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          <div>{mesaj.email}</div>
                          <div>{mesaj.telefon}</div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-300">
                          <div className="max-w-xs truncate">
                            {mesaj.mesaj}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {format(new Date(mesaj.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => openModal(mesaj)}
                            className="text-indigo-400 hover:text-indigo-300 mr-4"
                          >
                            <EyeIcon className="w-5 h-5 inline" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(mesaj.id, mesaj.ad_soyad)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="w-5 h-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredMesajlar.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                          {searchTerm ? "Aramanızla eşleşen mesaj bulunamadı" : "Henüz hiç mesaj yok"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  {selectedMesaj && (
                    <>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                        İletişim Mesajı Detayı
                      </Dialog.Title>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400">Gönderen</label>
                          <p className="mt-1 text-white">{selectedMesaj.ad_soyad}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400">E-posta</label>
                          <p className="mt-1 text-white">{selectedMesaj.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400">Telefon</label>
                          <p className="mt-1 text-white">{selectedMesaj.telefon}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400">Mesaj</label>
                          <p className="mt-1 text-white whitespace-pre-wrap">{selectedMesaj.mesaj}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400">Tarih</label>
                          <p className="mt-1 text-white">
                            {format(new Date(selectedMesaj.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Kapat
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 