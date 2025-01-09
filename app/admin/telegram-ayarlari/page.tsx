'use client';

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { PlusIcon, TrashIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import ConfirmModal from "@/app/components/ConfirmModal";
import toast from 'react-hot-toast';

interface TelegramNotification {
  id: string;
  chat_id: string;
  description: string;
  is_active: boolean;
}

// Input wrapper bileşeni
function InputWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      {children}
    </div>
  );
}

// Edit Modal bileşeni
function EditModal({ 
  isOpen, 
  notification, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  notification: TelegramNotification; 
  onClose: () => void;
  onSave: (data: TelegramNotification) => Promise<void>;
}) {
  const [data, setData] = useState(notification);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(notification);
  }, [notification]);

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
            {notification.id ? 'Bildirimi Düzenle' : 'Yeni Bildirim'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <InputWrapper label="Chat ID">
            <input
              type="text"
              value={data.chat_id}
              onChange={(e) => setData({ ...data, chat_id: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Örn: 123456789"
            />
          </InputWrapper>

          <InputWrapper label="Açıklama">
            <input
              type="text"
              value={data.description || ''}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Örn: Ahmet Bey&apos;in bildirimleri"
            />
          </InputWrapper>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.is_active}
              onChange={(e) => setData({ ...data, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
            />
            <span className="text-white">Aktif</span>
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
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TelegramAyarlari() {
  const [notifications, setNotifications] = useState<TelegramNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    notification: TelegramNotification;
  }>({
    isOpen: false,
    notification: {
      id: '',
      chat_id: '',
      description: '',
      is_active: true
    }
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    notificationId: string | null;
    notificationDesc: string;
    index: number | null;
  }>({
    isOpen: false,
    notificationId: null,
    notificationDesc: "",
    index: null
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('telegram_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Telegram bildirimleri yüklenirken hata:', error);
      toast.error('Bildirimler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: TelegramNotification) => {
    try {
      if (data.id) {
        // Güncelleme
        const { error } = await supabase
          .from('telegram_notifications')
          .update({
            chat_id: data.chat_id,
            description: data.description,
            is_active: data.is_active
          })
          .eq('id', data.id);

        if (error) throw error;

        setNotifications(notifications.map(n => 
          n.id === data.id ? data : n
        ));
        toast.success('Bildirim başarıyla güncellendi');
      } else {
        // Yeni kayıt
        const { data: newData, error } = await supabase
          .from('telegram_notifications')
          .insert({
            chat_id: data.chat_id,
            description: data.description,
            is_active: data.is_active
          })
          .select()
          .single();

        if (error) throw error;
        if (newData) {
          setNotifications([newData, ...notifications]);
          toast.success('Yeni bildirim eklendi');
        }
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Kaydetme işlemi sırasında bir hata oluştu');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.notificationId || deleteModal.index === null) return;

    try {
      const { error } = await supabase
        .from('telegram_notifications')
        .delete()
        .eq('id', deleteModal.notificationId);

      if (error) throw error;

      const updatedNotifications = notifications.filter((_, i) => i !== deleteModal.index);
      setNotifications(updatedNotifications);
      toast.success('Bildirim başarıyla silindi');
    } catch (error) {
      console.error('Bildirim silinirken hata:', error);
      toast.error('Bildirim silinirken bir hata oluştu');
    } finally {
      setDeleteModal({
        isOpen: false,
        notificationId: null,
        notificationDesc: "",
        index: null
      });
    }
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
        notification={editModal.notification}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, notificationId: null, notificationDesc: "", index: null })}
        onConfirm={handleDelete}
        title="Bildirimi Sil"
        message={`${deleteModal.notificationDesc} silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Telegram Bildirim Ayarları</h1>
          <p className="mt-2 text-sm text-gray-400">
            Telegram bildirimlerinin gönderileceği chat ID&apos;leri yönetin
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setEditModal({
              isOpen: true,
              notification: {
                id: '',
                chat_id: '',
                description: '',
                is_active: true
              }
            })}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Yeni Ekle
          </button>
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
                      Chat ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Açıklama
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
                  {notifications.map((notification, index) => (
                    <tr key={notification.id} className="hover:bg-gray-700">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-white sm:pl-6">
                        {notification.chat_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {notification.description || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {notification.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          onClick={() => setEditModal({
                            isOpen: true,
                            notification: notification
                          })}
                          className="text-indigo-500 hover:text-indigo-400 p-2 hover:bg-indigo-500/10 rounded-full transition-colors mr-2"
                          title="Düzenle"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            notificationId: notification.id,
                            notificationDesc: notification.description || 'Bu bildirimi',
                            index: index
                          })}
                          className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                          title="Sil"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {notifications.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-gray-800">
                  Henüz bildirim ayarı eklenmemiş. Yeni ekle butonunu kullanarak başlayabilirsiniz.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 