"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ConfirmModal from "@/app/components/ConfirmModal";
import { Sayfa } from "@/lib/types";

export default function AdminSayfalar() {
  const [sayfalar, setSayfalar] = useState<Sayfa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    sayfaId: string | null;
    sayfaTitle: string;
  }>({
    isOpen: false,
    sayfaId: null,
    sayfaTitle: "",
  });

  useEffect(() => {
    fetchSayfalar();
  }, []);

  const fetchSayfalar = async () => {
    try {
      const { data, error } = await supabase
        .from('sayfalar')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSayfalar(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sayfalar')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSayfalar(sayfalar.filter(sayfa => sayfa.id !== id));
      setDeleteModal({ isOpen: false, sayfaId: null, sayfaTitle: "" });
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Sayfa silinirken bir hata oluştu.');
    }
  };

  const openDeleteModal = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      sayfaId: id,
      sayfaTitle: title,
    });
  };

  const filteredSayfalar = sayfalar.filter((sayfa) => {
    const searchFields = [
      sayfa.baslik,
      sayfa.slug,
      sayfa.meta_title,
      sayfa.meta_description
    ].map(field => (field || "").toLowerCase());

    const searchTerms = searchTerm.toLowerCase().split(" ");
    return searchTerms.every(term => 
      searchFields.some(field => field.includes(term))
    );
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
        onClose={() => setDeleteModal({ isOpen: false, sayfaId: null, sayfaTitle: "" })}
        onConfirm={() => deleteModal.sayfaId && handleDelete(deleteModal.sayfaId)}
        title="Sayfayı Sil"
        message={`"${deleteModal.sayfaTitle}" başlıklı sayfayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Sayfalar</h1>
          <p className="mt-2 text-sm text-gray-400">
            Web sitesindeki tüm sayfaların listesi
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/sayfalar/yeni"
            className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Yeni Sayfa
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
              placeholder="Sayfa ara..."
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Başlık
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      URL
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Oluşturulma Tarihi
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {filteredSayfalar.map((sayfa) => (
                    <tr key={sayfa.id} className="hover:bg-gray-700">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-white">
                          {sayfa.baslik}
                        </div>
                        {sayfa.meta_title && (
                          <div className="text-gray-400">
                            {sayfa.meta_title}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        /{sayfa.slug}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {new Date(sayfa.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/sayfalar/${sayfa.id}`}
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(sayfa.id, sayfa.baslik)}
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