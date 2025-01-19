'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TbTruckDelivery } from "react-icons/tb";
import { MdSupportAgent, MdSecurity } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { PencilIcon, TrashIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';

const iconOptions = [
  { value: 'TbTruckDelivery', label: 'Kamyon', icon: <TbTruckDelivery /> },
  { value: 'MdSupportAgent', label: 'Destek', icon: <MdSupportAgent /> },
  { value: 'MdSecurity', label: 'Güvenlik', icon: <MdSecurity /> },
  { value: 'FaBoxOpen', label: 'Kutu', icon: <FaBoxOpen /> },
];

interface Feature {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  order_no: number;
}

interface Props {
  features: Feature[];
  onEdit: (feature: Feature) => void;
  onDelete: (id: number, title: string) => void;
  onReorder: (features: Feature[]) => void;
}

export default function AdminFeaturesList({ features, onEdit, onDelete, onReorder }: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

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
    if (draggingId === id) return;
    setDragOverId(id);
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetId: number) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;

    const oldIndex = features.findIndex(f => f.id === draggingId);
    const newIndex = features.findIndex(f => f.id === targetId);
    
    if (oldIndex === -1 || newIndex === -1) return;

    try {
      // Yeni sıralama dizisini oluştur
      const newFeatures = [...features];
      const [movedFeature] = newFeatures.splice(oldIndex, 1);
      newFeatures.splice(newIndex, 0, movedFeature);

      // Sıra numaralarını güncelle
      const updatedFeatures = newFeatures.map((feature, index) => ({
        ...feature,
        order_no: index + 1
      }));

      // Veritabanını güncelle
      const updates = updatedFeatures.map(feature => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon_name: feature.icon_name,
        order_no: feature.order_no
      }));

      const { error } = await supabase
        .from('features')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      // State'i güncelle
      onReorder(updatedFeatures);
      toast.success('Sıralama güncellendi');
    } catch (error) {
      console.error('Error reordering features:', error);
      toast.error('Sıralama güncellenirken bir hata oluştu');
    }
  };

  return (
    <div className="mt-8 flex flex-col">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="w-10 px-3 py-3.5 text-left text-sm font-semibold text-white">
                    <span className="sr-only">Sırala</span>
                  </th>
                  <th scope="col" className="w-10 px-3 py-3.5 text-left text-sm font-semibold text-white">
                    İkon
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Başlık
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Açıklama
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {features.map((feature) => (
                  <tr
                    key={feature.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, feature.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, feature.id)}
                    onDrop={(e) => handleDrop(e, feature.id)}
                    className={`${
                      dragOverId === feature.id ? 'bg-gray-700' : ''
                    } hover:bg-gray-700 transition-colors cursor-move`}
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                      <Bars3Icon className="h-5 w-5 text-gray-500" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                      <div className="text-2xl text-primary">
                        {iconOptions.find(opt => opt.value === feature.icon_name)?.icon}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                      {feature.title}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-300">
                      {feature.description}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(feature)}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDelete(feature.id, feature.title)}
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
  );
} 