"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PlusIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ConfirmModal from "@/app/components/ConfirmModal";
import { Switch } from "@headlessui/react";

interface SSS {
  id: number;
  soru: string;
  cevap: string;
  kategori: string;
  siralama: number;
  aktif: boolean;
  created_at: string;
}

interface DeleteModal {
  isOpen: boolean;
  sssId: number | null;
  soru: string;
}

export default function SSSPage() {
  const router = useRouter();
  const [sss, setSSS] = useState<SSS[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({
    isOpen: false,
    sssId: null,
    soru: "",
  });

  useEffect(() => {
    fetchSSS();
  }, []);

  const fetchSSS = async () => {
    try {
      const { data, error } = await supabase
        .from('sss')
        .select('*')
        .order('siralama', { ascending: true });

      if (error) throw error;
      setSSS(data || []);
    } catch (error) {
      console.error('SSS yüklenirken hata:', error);
      alert('SSS yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: number, soru: string) => {
    setDeleteModal({
      isOpen: true,
      sssId: id,
      soru,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('sss')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSSS(sss.filter(item => item.id !== id));
    } catch (error) {
      console.error('SSS silinirken hata:', error);
      alert('SSS silinirken bir hata oluştu.');
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: number) => {
    setDraggingId(id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    setDraggingId(null);
    setDragOverId(null);
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, id: number) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetId: number) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;

    const draggedIndex = sss.findIndex(item => item.id === draggingId);
    const targetIndex = sss.findIndex(item => item.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSSS = [...sss];
    const [draggedItem] = newSSS.splice(draggedIndex, 1);
    newSSS.splice(targetIndex, 0, draggedItem);

    // Update siralama values
    const updatedSSS = newSSS.map((item, index) => ({
      ...item,
      siralama: index + 1,
    }));

    setSSS(updatedSSS);

    try {
      const { error } = await supabase.rpc('update_sss_siralama', {
        yeni_siralama: updatedSSS.map(item => ({
          id: item.id,
          siralama: item.siralama,
        })),
      });

      if (error) throw error;
    } catch (error) {
      console.error('Sıralama güncellenirken hata:', error);
      alert('Sıralama güncellenirken bir hata oluştu.');
      fetchSSS(); // Hata durumunda orijinal sıralamayı geri yükle
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('sss')
        .update({ aktif: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setSSS(sss.map(item => 
        item.id === id ? { ...item, aktif: !currentStatus } : item
      ));
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  const filteredSSS = sss.filter((item) => {
    const searchFields = [
      item.soru,
      item.cevap,
      item.kategori
    ].map(field => (field || "").toLowerCase());

    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchesSearch = searchTerms.every(term => 
      searchFields.some(field => field.includes(term))
    );

    return matchesSearch;
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
        onClose={() => setDeleteModal({ isOpen: false, sssId: null, soru: "" })}
        onConfirm={() => deleteModal.sssId && handleDelete(deleteModal.sssId)}
        title="SSS'yi Sil"
        message={`"${deleteModal.soru}" sorusunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Sık Sorulan Sorular</h1>
          <p className="mt-2 text-sm text-gray-400">
            SSS'leri görüntüleyin, düzenleyin veya yeni soru ekleyin.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/sss/yeni"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Yeni Soru
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
              placeholder="SSS ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="w-10 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      <span className="sr-only">Sırala</span>
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Soru
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Kategori
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
                  {filteredSSS.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-700 ${
                        draggingId === item.id ? 'opacity-50' : ''
                      } ${dragOverId === item.id ? 'border-t-2 border-indigo-500' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDrop={(e) => handleDrop(e, item.id)}
                    >
                      <td className="w-10 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-400 sm:pl-6 cursor-move">
                        <Bars3Icon className="h-5 w-5" />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-white">{item.soru}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {item.kategori}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <Switch
                          checked={item.aktif}
                          onChange={() => toggleStatus(item.id, item.aktif)}
                          className={`${
                            item.aktif ? 'bg-indigo-600' : 'bg-gray-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                        >
                          <span className="sr-only">Durumu değiştir</span>
                          <span
                            className={`${
                              item.aktif ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => router.push(`/admin/sss/duzenle/${item.id}`)}
                          className="text-indigo-400 hover:text-indigo-300 mr-4"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => openDeleteModal(item.id, item.soru)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Sil
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