"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PencilIcon, TrashIcon, PlusIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ConfirmModal from "@/app/components/ConfirmModal";

interface Istatistik {
  id: number;
  baslik: string;
  deger: string;
  aciklama: string;
  ikon: string;
  aktif: boolean;
  siralama: number;
}

export default function AdminIstatistikler() {
  const [istatistikler, setIstatistikler] = useState<Istatistik[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    istatistikId: number | null;
    istatistikBaslik: string;
  }>({
    isOpen: false,
    istatistikId: null,
    istatistikBaslik: "",
  });

  useEffect(() => {
    fetchIstatistikler();
  }, []);

  const fetchIstatistikler = async () => {
    try {
      const { data, error } = await supabase
        .from('istatistikler')
        .select('*')
        .order('siralama', { ascending: true });

      if (error) throw error;
      setIstatistikler(data || []);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('istatistikler')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIstatistikler(istatistikler.filter(istatistik => istatistik.id !== id));
      setDeleteModal({ isOpen: false, istatistikId: null, istatistikBaslik: "" });
    } catch (error) {
      console.error('İstatistik silinirken hata:', error);
    }
  };

  const openDeleteModal = (id: number, baslik: string) => {
    setDeleteModal({
      isOpen: true,
      istatistikId: id,
      istatistikBaslik: baslik,
    });
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('istatistikler')
        .update({ aktif: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setIstatistikler(istatistikler.map(istatistik => 
        istatistik.id === id ? { ...istatistik, aktif: !currentStatus } : istatistik
      ));
    } catch (error) {
      console.error('İstatistik durumu güncellenirken hata:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: number) => {
    setDraggingId(id);
    e.currentTarget.classList.add('opacity-50');
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    setDraggingId(null);
    setDragOverId(null);
    e.currentTarget.classList.remove('opacity-50');
    document.querySelectorAll('tr').forEach(row => {
      row.classList.remove('border-t-2', 'border-indigo-500');
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(id);

    // Görsel geri bildirim için
    document.querySelectorAll('tr').forEach(row => {
      row.classList.remove('border-t-2', 'border-indigo-500');
    });
    e.currentTarget.classList.add('border-t-2', 'border-indigo-500');
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetId: number) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;

    const sourceIndex = istatistikler.findIndex(item => item.id === draggingId);
    const targetIndex = istatistikler.findIndex(item => item.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    try {
      const newItems = [...istatistikler];
      const [movedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, movedItem);

      // Sıralama değerlerini güncelle
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        siralama: index + 1
      }));

      // Veritabanını tek seferde güncelle
      const { error } = await supabase.rpc('update_istatistik_siralama', {
        yeni_siralama: updatedItems.map(item => ({
          id: item.id,
          siralama: item.siralama
        }))
      });

      if (error) {
        throw error;
      }

      setIstatistikler(updatedItems);
    } catch (error) {
      console.error('İstatistikler sıralanırken hata:', error);
      alert('Sıralama işlemi sırasında bir hata oluştu.');
      // Hata durumunda orijinal listeyi geri yükle
      fetchIstatistikler();
    }
  };

  const filteredIstatistikler = istatistikler.filter((istatistik) => {
    const searchFields = [
      istatistik.baslik,
      istatistik.deger,
      istatistik.aciklama,
    ].map(field => (field || "").toLowerCase());

    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchesSearch = searchTerms.every(term => 
      searchFields.some(field => field.includes(term))
    );

    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "aktif" && istatistik.aktif) || 
      (statusFilter === "pasif" && !istatistik.aktif);

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
        onClose={() => setDeleteModal({ isOpen: false, istatistikId: null, istatistikBaslik: "" })}
        onConfirm={() => deleteModal.istatistikId && handleDelete(deleteModal.istatistikId)}
        title="İstatistiği Sil"
        message={`"${deleteModal.istatistikBaslik}" başlıklı istatistiği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">İstatistikler</h1>
          <p className="mt-2 text-sm text-gray-400">
            Tüm istatistiklerin listesi
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/istatistikler/yeni"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Yeni İstatistik
          </Link>
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
              placeholder="İstatistik ara..."
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
            <option value="aktif">Aktif</option>
            <option value="pasif">Pasif</option>
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
                    <th scope="col" className="w-8 py-3.5 pl-4 pr-3">
                      <span className="sr-only">Sırala</span>
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Başlık
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Değer
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Açıklama
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      İkon
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
                  {filteredIstatistikler.map((istatistik) => (
                    <tr 
                      key={istatistik.id} 
                      className={`hover:bg-gray-700 cursor-move transition-all duration-200 ${
                        dragOverId === istatistik.id ? 'border-t-2 border-indigo-500' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, istatistik.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, istatistik.id)}
                      onDrop={(e) => handleDrop(e, istatistik.id)}
                    >
                      <td className="w-8 py-4 pl-4 pr-3 text-sm">
                        <Bars3Icon className="h-5 w-5 text-gray-500" />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                        {istatistik.baslik}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {istatistik.deger}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-300">
                        {istatistik.aciklama}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {istatistik.ikon}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button
                          onClick={() => toggleStatus(istatistik.id, istatistik.aktif)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            istatistik.aktif
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {istatistik.aktif ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/istatistikler/duzenle/${istatistik.id}`}
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(istatistik.id, istatistik.baslik)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
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