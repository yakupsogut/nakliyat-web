"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { MenuItem } from "@/lib/types";
import { toast } from "react-hot-toast";
import { Bars3Icon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/app/components/ConfirmModal";
import { Dialog } from "@headlessui/react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onSave: (item: { baslik: string; link: string }) => Promise<void>;
  yukleniyor: boolean;
}

function EditModal({ isOpen, onClose, item, onSave, yukleniyor }: EditModalProps) {
  const [formData, setFormData] = useState({ baslik: "", link: "" });

  useEffect(() => {
    if (item) {
      setFormData({ baslik: item.baslik, link: item.link });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-lg bg-white dark:bg-gray-800 p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Menü Öğesini Düzenle
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Başlık
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={formData.baslik}
                  onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Link
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  /
                </span>
                <input
                  type="text"
                  required
                  value={formData.link.replace(/^\//, '')}
                  onChange={(e) => setFormData({ ...formData, link: '/' + e.target.value.replace(/^\//, '') })}
                  className="w-full pl-7 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={yukleniyor}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default function MenuYonetimi() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: MenuItem | null;
  }>({
    isOpen: false,
    item: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemTitle: string;
  }>({
    isOpen: false,
    itemId: null,
    itemTitle: "",
  });
  const [yeniMenu, setYeniMenu] = useState({
    baslik: "",
    link: "",
    parent_id: null as string | null,
  });

  useEffect(() => {
    getMenuItems();
  }, []);

  async function getMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sira', { ascending: true });

    if (error) {
      toast.error('Menü öğeleri yüklenirken hata oluştu');
      return;
    }

    // Ana menüleri filtrele (parent_id olmayanlar)
    const anaMenuler = data?.filter(item => !item.parent_id) || [];
    setMenuItems(anaMenuler);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setYukleniyor(true);

    // Link formatını düzenle
    let formattedLink = yeniMenu.link;
    if (!formattedLink.startsWith('/')) {
      formattedLink = '/' + formattedLink;
    }
    // Çift slash'ları temizle
    formattedLink = formattedLink.replace(/\/+/g, '/');

    try {
      const { error } = await supabase
        .from('menu_items')
        .insert([
          {
            baslik: yeniMenu.baslik,
            link: formattedLink,
            parent_id: yeniMenu.parent_id,
            sira: menuItems.length,
            aktif: true
          }
        ]);

      if (error) throw error;

      toast.success('Menü öğesi başarıyla eklendi');
      setYeniMenu({ baslik: "", link: "", parent_id: null });
      getMenuItems();
    } catch (error) {
      console.error('Ekleme hatası:', error);
      toast.error('Menü öğesi eklenirken hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  }

  const openDeleteModal = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemTitle: title,
    });
  };

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Menü öğesi başarıyla silindi');
      getMenuItems();
      setDeleteModal({ isOpen: false, itemId: null, itemTitle: "" });
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error('Menü öğesi silinirken hata oluştu');
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggingId(null);
    setDragOverId(null);
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;

    const sourceItem = menuItems.find(p => p.id === draggingId);
    const targetItem = menuItems.find(p => p.id === targetId);
    if (!sourceItem || !targetItem) return;

    try {
      // Sıralama değerlerini güncelle
      const updates = menuItems.map(item => {
        if (item.id === draggingId) {
          return { ...item, sira: targetItem.sira };
        }
        if (sourceItem.sira < targetItem.sira) {
          // Yukarıdan aşağıya sürükleme
          if (item.sira <= targetItem.sira && item.sira > sourceItem.sira) {
            return { ...item, sira: item.sira - 1 };
          }
        } else {
          // Aşağıdan yukarıya sürükleme
          if (item.sira >= targetItem.sira && item.sira < sourceItem.sira) {
            return { ...item, sira: item.sira + 1 };
          }
        }
        return item;
      });

      // Veritabanını güncelle
      for (const item of updates) {
        const { error } = await supabase
          .from('menu_items')
          .update({ sira: item.sira })
          .eq('id', item.id);

        if (error) throw error;
      }

      // State'i güncelle
      setMenuItems(updates.sort((a, b) => a.sira - b.sira));
      toast.success('Menü sıralaması güncellendi');
    } catch (error) {
      console.error('Sıralama hatası:', error);
      toast.error('Menü sıralaması güncellenirken hata oluştu');
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditModal({
      isOpen: true,
      item,
    });
  };

  const handleEditSave = async (formData: { baslik: string; link: string }) => {
    if (!editModal.item) return;

    setYukleniyor(true);
    try {
      // Link formatını düzenle
      let formattedLink = formData.link;
      if (!formattedLink.startsWith('/')) {
        formattedLink = '/' + formattedLink;
      }
      // Çift slash'ları temizle
      formattedLink = formattedLink.replace(/\/+/g, '/');

      const { error } = await supabase
        .from('menu_items')
        .update({
          baslik: formData.baslik,
          link: formattedLink,
        })
        .eq('id', editModal.item.id);

      if (error) throw error;

      toast.success('Menü öğesi başarıyla güncellendi');
      setEditModal({ isOpen: false, item: null });
      getMenuItems();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Menü öğesi güncellenirken hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemTitle: "" })}
        onConfirm={() => deleteModal.itemId && handleDelete(deleteModal.itemId)}
        title="Menü Öğesini Sil"
        message={`"${deleteModal.itemTitle}" başlıklı menü öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null })}
        item={editModal.item}
        onSave={handleEditSave}
        yukleniyor={yukleniyor}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Menü Yönetimi
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Menü öğelerini ekleyebilir, sıralayabilir ve düzenleyebilirsiniz. Sıralamayı değiştirmek için öğeleri sürükleyip bırakın.
              </p>
            </div>

            {/* Yeni Menü Öğesi Formu */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                Yeni Menü Öğesi Ekle
              </h4>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Başlık
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        required
                        value={yeniMenu.baslik}
                        onChange={(e) => setYeniMenu({ ...yeniMenu, baslik: e.target.value })}
                        placeholder="Örn: Hakkımızda"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Link
                    </label>
                    <div className="mt-1 relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                        /
                      </span>
                      <input
                        type="text"
                        required
                        value={yeniMenu.link}
                        onChange={(e) => setYeniMenu({ ...yeniMenu, link: e.target.value })}
                        placeholder="hakkimizda"
                        className="w-full pl-7 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Başında / işareti olmadan yazabilirsiniz
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={yukleniyor}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {yukleniyor ? 'Ekleniyor...' : 'Menü Öğesi Ekle'}
                  </button>
                </div>
              </form>
            </div>

            {/* Menü Listesi */}
            <div>
              <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                Mevcut Menü Öğeleri
              </h4>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDrop={(e) => handleDrop(e, item.id)}
                    className={`flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border ${
                      dragOverId === item.id 
                        ? 'border-blue-500 dark:border-blue-400' 
                        : 'border-gray-200 dark:border-gray-600'
                    } shadow-sm hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className="flex items-center space-x-3">
                      <Bars3Icon className="h-5 w-5 text-gray-400 cursor-move" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.baslik}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.link}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <PencilIcon className="h-5 w-5 text-blue-500" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item.id, item.baslik)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
                {menuItems.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">Henüz menü öğesi eklenmemiş</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 