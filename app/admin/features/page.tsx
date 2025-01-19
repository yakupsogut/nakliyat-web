"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PlusIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/app/components/ConfirmModal";
import AdminFeaturesList from './AdminFeaturesList';
import FeatureModal from './FeatureModal';
import { toast } from 'react-hot-toast';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  order_no: number;
}

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    featureId: number | null;
    featureTitle: string;
  }>({
    isOpen: false,
    featureId: null,
    featureTitle: "",
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    feature?: Feature;
  }>({
    isOpen: false,
    feature: undefined,
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('order_no');

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Özellikler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFeatures(features.filter(f => f.id !== id));
      toast.success('Özellik başarıyla silindi');
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('Özellik silinirken bir hata oluştu');
    } finally {
      setDeleteModal({ isOpen: false, featureId: null, featureTitle: "" });
    }
  };

  const handleSave = async (feature: Partial<Feature>) => {
    try {
      if (feature.id) {
        // Güncelleme
        const { error } = await supabase
          .from('features')
          .update({
            title: feature.title,
            description: feature.description,
            icon_name: feature.icon_name,
            order_no: feature.order_no,
          })
          .eq('id', feature.id);

        if (error) throw error;

        setFeatures(features.map(f => 
          f.id === feature.id ? { ...f, ...feature } : f
        ));
        toast.success('Özellik başarıyla güncellendi');
      } else {
        // Yeni ekleme
        const { data, error } = await supabase
          .from('features')
          .insert({
            title: feature.title,
            description: feature.description,
            icon_name: feature.icon_name,
            order_no: feature.order_no,
          })
          .select()
          .single();

        if (error) throw error;

        setFeatures([...features, data]);
        toast.success('Özellik başarıyla eklendi');
      }
    } catch (error) {
      console.error('Error saving feature:', error);
      toast.error('Özellik kaydedilirken bir hata oluştu');
    } finally {
      setEditModal({ isOpen: false, feature: undefined });
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
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, featureId: null, featureTitle: "" })}
        onConfirm={() => deleteModal.featureId && handleDelete(deleteModal.featureId)}
        title="Özelliği Sil"
        message={`"${deleteModal.featureTitle}" başlıklı özelliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <FeatureModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, feature: undefined })}
        onSave={handleSave}
        feature={editModal.feature}
        maxOrder={features.length}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Özellikler</h1>
          <p className="mt-2 text-sm text-gray-400">
            Ana sayfada görüntülenen özelliklerin listesi
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setEditModal({ isOpen: true })}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Yeni Özellik
          </button>
        </div>
      </div>

      <div className="mt-8">
        <AdminFeaturesList
          features={features}
          onEdit={(feature) => setEditModal({ isOpen: true, feature })}
          onDelete={(id, title) => setDeleteModal({ isOpen: true, featureId: id, featureTitle: title })}
          onReorder={setFeatures}
        />
      </div>
    </div>
  );
} 