'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TrashIcon, XMarkIcon, PencilIcon, Bars3Icon, PlusIcon } from '@heroicons/react/24/outline';
import ConfirmModal from "@/app/components/ConfirmModal";
import toast from 'react-hot-toast';
import Image from 'next/image';

interface HeroSlide {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  button_text: string | null;
  button_url: string | null;
  order_no: number;
  active: boolean;
}

interface Props {
  initialSlides: HeroSlide[];
}

// Edit Modal bileşeni
function EditModal({ 
  isOpen, 
  item, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  item: HeroSlide; 
  onClose: () => void;
  onSave: (data: HeroSlide) => Promise<void>;
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
            Slider Öğesini Düzenle
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
            <label className="block text-sm font-medium text-gray-300">Buton Metni</label>
            <input
              type="text"
              value={data.button_text || ''}
              onChange={(e) => setData({ ...data, button_text: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Buton URL</label>
            <input
              type="url"
              value={data.button_url || ''}
              onChange={(e) => setData({ ...data, button_url: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
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

// Add Modal bileşeni
function AddModal({ 
  isOpen, 
  onClose, 
  onSave,
  maxOrder
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewHeroSlideData) => Promise<void>;
  maxOrder: number;
}) {
  const [data, setData] = useState<Omit<NewHeroSlideData, 'image_url'>>({
    title: '',
    description: '',
    button_text: '',
    button_url: '',
    order_no: maxOrder + 1,
    active: true
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
            Yeni Slider Ekle
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
            <label className="block text-sm font-medium text-gray-300">Buton Metni</label>
            <input
              type="text"
              value={data.button_text || ''}
              onChange={(e) => setData({ ...data, button_text: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Buton URL</label>
            <input
              type="url"
              value={data.button_url || ''}
              onChange={(e) => setData({ ...data, button_url: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
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
            disabled={saving || !selectedFile }
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface NewHeroSlideData {
  title: string;
  description: string | null;
  image_url: File;
  button_text: string | null;
  button_url: string | null;
  order_no: number;
  active: boolean;
}

export default function AdminHeroSlider({ initialSlides }: Props) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: HeroSlide;
  }>({
    isOpen: false,
    item: {
      id: '',
      title: '',
      description: '',
      image_url: '',
      button_text: '',
      button_url: '',
      order_no: 0,
      active: true
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
  const [addModal, setAddModal] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_no', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Slider öğeleri yüklenirken hata:', error);
      toast.error('Öğeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: HeroSlide) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({
          title: data.title,
          description: data.description,
          button_text: data.button_text,
          button_url: data.button_url,
          order_no: data.order_no
        })
        .eq('id', data.id);

      if (error) throw error;

      setSlides(slides.map(slide => 
        slide.id === data.id ? data : slide
      ));
      toast.success('Slider başarıyla güncellendi');
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
        .from('hero_slides')
        .delete()
        .eq('id', deleteModal.itemId);

      if (error) throw error;

      setSlides(slides.filter(slide => slide.id !== deleteModal.itemId));
      toast.success('Slider başarıyla silindi');
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

    const sourceIndex = slides.findIndex(slide => slide.id === draggingId);
    const targetIndex = slides.findIndex(slide => slide.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    try {
      const newSlides = [...slides];
      const [movedSlide] = newSlides.splice(sourceIndex, 1);
      newSlides.splice(targetIndex, 0, movedSlide);

      // Sıralama değerlerini güncelle
      const updatedSlides = newSlides.map((slide, index) => ({
        ...slide,
        order_no: index + 1
      }));

      // Veritabanını güncelle
    for (const slide of updatedSlides) {
      const { error } = await supabase
        .from('hero_slides')
        .update({ order_no: slide.order_no })
        .eq('id', slide.id);

        if (error) throw error;
      }

      setSlides(updatedSlides);
      toast.success('Sıralama güncellendi');
    } catch (error) {
      console.error('Sıralama hatası:', error);
      toast.error('Sıralama güncellenirken hata oluştu');
      fetchSlides();
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ active: !slide.active })
        .eq('id', slide.id);

      if (error) throw error;

      setSlides(slides.map(s => 
        s.id === slide.id ? { ...s, active: !s.active } : s
      ));
      toast.success('Durum güncellendi');
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      toast.error('Durum güncellenirken hata oluştu');
    }
  };

  const handleAddSave = async (data: NewHeroSlideData) => {
    try {
      let imageUrl = "";
      
      // Dosyayı yükle
      const file = data.image_url;
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-slides/${Date.now()}.${fileExt}`;

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
        .from('hero_slides')
        .insert([{
          title: data.title,
          description: data.description,
          image_url: imageUrl,
          button_text: data.button_text,
          button_url: data.button_url,
          order_no: data.order_no,
          active: data.active
        }]);

      if (error) throw error;

      // Listeyi yenile
      await fetchSlides();
      toast.success('Yeni slider başarıyla eklendi');
    } catch (error) {
      console.error('Ekleme hatası:', error);
      toast.error('Ekleme işlemi sırasında bir hata oluştu');
      throw error;
    }
  };

  // Sayfalama için hesaplamalar
  const totalPages = Math.ceil(slides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSlides = slides.slice(startIndex, endIndex);

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
        maxOrder={slides.length > 0 ? Math.max(...slides.map(slide => slide.order_no)) : 0}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemTitle: "" })}
        onConfirm={handleDelete}
        title="Slider'ı Sil"
        message={`"${deleteModal.itemTitle}" slider'ını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Hero Slider Yönetimi</h1>
          <p className="mt-2 text-sm text-gray-400">
            Ana sayfa slider öğelerini yönetin, düzenleyin ve sıralayın
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
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
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Durum
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {currentSlides.map((slide) => (
                    <tr 
                      key={slide.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, slide.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, slide.id)}
                      onDrop={(e) => handleDrop(e, slide.id)}
                      className={`hover:bg-gray-700 cursor-move ${
                        dragOverId === slide.id ? 'border-t-2 border-indigo-500' : ''
                      }`}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center space-x-2">
                          <Bars3Icon className="w-5 h-5 text-gray-400" />
                          <div className="relative h-16 w-16 rounded overflow-hidden">
                            {slide.image_url && (
                              <Image
                                      src={slide.image_url}
                                      alt={slide.title}
                                fill
                                className="object-cover"
                                    />
                            )}
                                  </div>
                                </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {slide.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {slide.order_no}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <button
                                    onClick={() => handleToggleActive(slide)}
                                    className={`px-3 py-1 rounded text-sm font-medium ${
                                      slide.active
                                        ? 'bg-green-900 text-green-200'
                                        : 'bg-gray-700 text-gray-200'
                                    }`}
                                  >
                                    {slide.active ? 'Aktif' : 'Pasif'}
                                  </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                                  <button
                            onClick={() => setEditModal({
                              isOpen: true,
                              item: slide
                            })}
                            className="text-indigo-500 hover:text-indigo-400 p-2 hover:bg-indigo-500/10 rounded-full transition-colors"
                            title="Düzenle"
                          >
                            <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                            onClick={() => setDeleteModal({
                              isOpen: true,
                              itemId: slide.id,
                              itemTitle: slide.title
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

              {slides.length === 0 && (
                          <div className="text-center py-12 text-gray-500 bg-gray-800">
                  Henüz slider öğesi eklenmemiş.
                      </div>
                    )}

              {/* Sayfalama */}
              {slides.length > 0 && (
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
                        Toplam <span className="font-medium">{slides.length}</span> öğeden{' '}
                        <span className="font-medium">{startIndex + 1}</span>-
                        <span className="font-medium">{Math.min(endIndex, slides.length)}</span> arası
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