'use client';

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { TrashIcon, XMarkIcon, PencilIcon, Bars3Icon } from '@heroicons/react/24/outline';
import ConfirmModal from "@/app/components/ConfirmModal";
import toast from 'react-hot-toast';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  order_no: number;
  created_at: string;
}

interface NewGalleryItemData {
  title: string;
  description: string | null;
  image_url: File;
  order_no: number;
}

// Edit Modal bileşeni
function EditModal({ 
  isOpen, 
  item, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  item: GalleryItem; 
  onClose: () => void;
  onSave: (data: GalleryItem) => Promise<void>;
}) {
  const [data, setData] = useState(item);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(item);
  }, [item]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            Galeri Öğesini Düzenle
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Başlık</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Açıklama</label>
            <textarea
              value={data.description || ''}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Sıralama</label>
            <input
              type="number"
              value={data.order_no}
              onChange={(e) => setData({ ...data, order_no: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Görsel</label>
            <div className="relative h-48 bg-gray-700 rounded-lg overflow-hidden">
              {data.image_url && (
                <Image
                  src={data.image_url}
                  alt={data.title}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Yeni Ekle Modal bileşeni
function AddModal({ 
  isOpen, 
  onClose, 
  onSave,
  maxOrder
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewGalleryItemData) => Promise<void>;
  maxOrder: number;
}) {
  const [data, setData] = useState<Omit<NewGalleryItemData, 'image_url'>>({
    title: '',
    description: '',
    order_no: maxOrder + 1
  });
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error('Lütfen bir görsel seçin');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...data,
        image_url: selectedFile
      });
      onClose();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            Yeni Galeri Öğesi Ekle
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Başlık</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Açıklama</label>
            <textarea
              value={data.description || ''}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Sıralama</label>
            <input
              type="number"
              value={data.order_no}
              onChange={(e) => setData({ ...data, order_no: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Görsel</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700
                file:cursor-pointer cursor-pointer"
              required
            />
            {preview && (
              <div className="relative h-48 bg-gray-700 rounded-lg overflow-hidden mt-2">
                <Image
                  src={preview}
                  alt="Önizleme"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedFile || !data.title}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: GalleryItem;
  }>({
    isOpen: false,
    item: {
      id: '',
      title: '',
      description: '',
      image_url: '',
      order_no: 0,
      created_at: new Date().toISOString()
    }
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemTitle: string;
  }>({
    isOpen: false,
    itemId: null,
    itemTitle: ""
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_no', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Galeri öğeleri yüklenirken hata:', error);
      toast.error('Öğeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: GalleryItem) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({
          title: data.title,
          description: data.description,
          order_no: data.order_no
        })
        .eq('id', data.id);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === data.id ? data : item
      ));
      toast.success('Öğe başarıyla güncellendi');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Kaydetme işlemi sırasında bir hata oluştu');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.itemId) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', deleteModal.itemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== deleteModal.itemId));
      toast.success('Öğe başarıyla silindi');
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu');
    } finally {
      setDeleteModal({
        isOpen: false,
        itemId: null,
        itemTitle: ""
      });
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    setDraggingId(id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    setDraggingId(null);
    setDragOverId(null);
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;

    const sourceIndex = items.findIndex(item => item.id === draggingId);
    const targetIndex = items.findIndex(item => item.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    try {
      const newItems = [...items];
      const [movedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, movedItem);

      // Sıralama değerlerini güncelle
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order_no: index + 1
      }));

      // Veritabanını güncelle
      for (const item of updatedItems) {
        const { error } = await supabase
          .from('gallery')
          .update({ order_no: item.order_no })
          .eq('id', item.id);

        if (error) throw error;
      }

      setItems(updatedItems);
      toast.success('Sıralama güncellendi');
    } catch (error) {
      console.error('Sıralama hatası:', error);
      toast.error('Sıralama güncellenirken hata oluştu');
      fetchItems();
    }
  };

  const handleAddSave = async (data: NewGalleryItemData) => {
    try {
      let imageUrl = "";
      
      // Dosyayı yükle
      const file = data.image_url;
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;

      // Veritabanına ekle
      const { error } = await supabase
        .from('gallery')
        .insert([{
          title: data.title,
          description: data.description,
          image_url: imageUrl,
          order_no: data.order_no
        }]);

      if (error) throw error;

      // Listeyi yenile
      await fetchItems();
      toast.success('Yeni öğe başarıyla eklendi');
    } catch (error) {
      console.error('Ekleme hatası:', error);
      toast.error('Ekleme işlemi sırasında bir hata oluştu');
      throw error;
    }
  };

  // Sayfalama için hesaplamalar
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <EditModal
        isOpen={editModal.isOpen}
        item={editModal.item}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        onSave={handleSave}
      />

      <AddModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSave={handleAddSave}
        maxOrder={items.length > 0 ? Math.max(...items.map(item => item.order_no)) : 0}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemTitle: "" })}
        onConfirm={handleDelete}
        title="Galeri Öğesini Sil"
        message={`"${deleteModal.itemTitle}" öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Galeri Yönetimi</h1>
          <p className="mt-2 text-sm text-gray-400">
            Galeri öğelerini yönetin, düzenleyin ve sıralayın
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Yeni Ekle
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-gray-700 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Görsel
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Başlık
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Sıra
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {currentItems.map((item) => (
                    <tr 
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDrop={(e) => handleDrop(e, item.id)}
                      className={`hover:bg-gray-700 cursor-move ${
                        dragOverId === item.id ? 'border-t-2 border-indigo-500' : ''
                      }`}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center space-x-2">
                          <Bars3Icon className="w-5 h-5 text-gray-400" />
                          <div className="relative h-16 w-16 rounded overflow-hidden">
                            {item.image_url && (
                              <Image
                                src={item.image_url}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {item.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {item.order_no}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditModal({
                              isOpen: true,
                              item: item
                            })}
                            className="text-indigo-500 hover:text-indigo-400 p-2 hover:bg-indigo-500/10 rounded-full transition-colors"
                            title="Düzenle"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({
                              isOpen: true,
                              itemId: item.id,
                              itemTitle: item.title
                            })}
                            className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Sil"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {items.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-gray-800">
                  Henüz galeri öğesi eklenmemiş.
                </div>
              )}

              {/* Sayfalama */}
              {items.length > 0 && (
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                    >
                      Önceki
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                    >
                      Sonraki
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-400">
                        Toplam <span className="font-medium">{items.length}</span> öğeden{' '}
                        <span className="font-medium">{startIndex + 1}</span>-
                        <span className="font-medium">{Math.min(endIndex, items.length)}</span> arası
                        gösteriliyor
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span className="sr-only">Önceki</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium ${
                              currentPage === index + 1
                                ? 'z-10 bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span className="sr-only">Sonraki</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 