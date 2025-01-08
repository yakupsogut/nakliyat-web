"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PencilIcon, TrashIcon, PlusIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ConfirmModal from "@/app/components/ConfirmModal";
import Image from "next/image";

interface Hizmet {
  id: number;
  baslik: string;
  aciklama: string;
  resim_url: string;
  aktif: boolean;
  siralama: number;
  ozellikler: string[];
}

export default function AdminHizmetler() {
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    hizmetId: number | null;
    hizmetBaslik: string;
  }>({
    isOpen: false,
    hizmetId: null,
    hizmetBaslik: "",
  });

  useEffect(() => {
    fetchHizmetler();
  }, []);

  const fetchHizmetler = async () => {
    try {
      const { data, error } = await supabase
        .from('hizmetler')
        .select('*')
        .order('siralama', { ascending: true });

      if (error) throw error;
      setHizmetler(data || []);
    } catch (error) {
      console.error('Hizmetler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('hizmetler')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHizmetler(hizmetler.filter(hizmet => hizmet.id !== id));
      setDeleteModal({ isOpen: false, hizmetId: null, hizmetBaslik: "" });
    } catch (error) {
      console.error('Hizmet silinirken hata:', error);
      alert('Hizmet silinirken bir hata oluştu.');
    }
  };

  const openDeleteModal = (id: number, baslik: string) => {
    setDeleteModal({
      isOpen: true,
      hizmetId: id,
      hizmetBaslik: baslik,
    });
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hizmetler')
        .update({ aktif: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setHizmetler(hizmetler.map(hizmet => 
        hizmet.id === id ? { ...hizmet, aktif: !currentStatus } : hizmet
      ));
    } catch (error) {
      console.error('Hizmet durumu güncellenirken hata:', error);
      alert('Durum güncellenirken bir hata oluştu.');
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

    document.querySelectorAll('tr').forEach(row => {
      row.classList.remove('border-t-2', 'border-indigo-500');
    });
    e.currentTarget.classList.add('border-t-2', 'border-indigo-500');
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetId: number) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;

    const sourceIndex = hizmetler.findIndex(item => item.id === draggingId);
    const targetIndex = hizmetler.findIndex(item => item.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    try {
      const newItems = [...hizmetler];
      const [movedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, movedItem);

      // Sıralama değerlerini güncelle
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        siralama: index + 1
      }));

      // Veritabanını güncelle
      for (const item of updatedItems) {
        const { error } = await supabase
          .from('hizmetler')
          .update({ siralama: item.siralama })
          .eq('id', item.id);

        if (error) throw error;
      }

      setHizmetler(updatedItems);
    } catch (error) {
      console.error('Hizmetler sıralanırken hata:', error);
      alert('Sıralama işlemi sırasında bir hata oluştu.');
      fetchHizmetler();
    }
  };

  const filteredHizmetler = hizmetler.filter((hizmet) => {
    const searchFields = [
      hizmet.baslik,
      hizmet.aciklama,
      ...(hizmet.ozellikler || [])
    ].map(field => (field || "").toLowerCase());

    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchesSearch = searchTerms.every(term => 
      searchFields.some(field => field.includes(term))
    );

    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "aktif" && hizmet.aktif) || 
      (statusFilter === "pasif" && !hizmet.aktif);

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
        onClose={() => setDeleteModal({ isOpen: false, hizmetId: null, hizmetBaslik: "" })}
        onConfirm={() => deleteModal.hizmetId && handleDelete(deleteModal.hizmetId)}
        title="Hizmeti Sil"
        message={`"${deleteModal.hizmetBaslik}" başlıklı hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Hizmetler</h1>
          <p className="mt-2 text-sm text-gray-400">
            Tüm hizmetlerin listesi
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/hizmetler/yeni"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Yeni Hizmet
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
              placeholder="Hizmet ara..."
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
                    <th scope="col" className="w-20 px-3 py-3.5">
                      <span className="sr-only">Resim</span>
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Başlık
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Açıklama
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Özellikler
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
                  {filteredHizmetler.map((hizmet) => (
                    <tr 
                      key={hizmet.id} 
                      className={`hover:bg-gray-700 cursor-move transition-all duration-200 ${
                        dragOverId === hizmet.id ? 'border-t-2 border-indigo-500' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, hizmet.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, hizmet.id)}
                      onDrop={(e) => handleDrop(e, hizmet.id)}
                    >
                      <td className="w-8 py-4 pl-4 pr-3 text-sm">
                        <Bars3Icon className="h-5 w-5 text-gray-500" />
                      </td>
                      <td className="w-20 px-3 py-4">
                        {hizmet.resim_url && (
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                            <Image
                              src={hizmet.resim_url}
                              alt={hizmet.baslik}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                        {hizmet.baslik}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-300">
                        <div className="line-clamp-2">{hizmet.aciklama}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-300">
                        <div className="flex flex-wrap gap-1">
                          {hizmet.ozellikler?.slice(0, 2).map((ozellik, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-200"
                            >
                              {ozellik}
                            </span>
                          ))}
                          {(hizmet.ozellikler?.length || 0) > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-200">
                              +{hizmet.ozellikler!.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button
                          onClick={() => toggleStatus(hizmet.id, hizmet.aktif)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hizmet.aktif
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {hizmet.aktif ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/hizmetler/duzenle/${hizmet.id}`}
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(hizmet.id, hizmet.baslik)}
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