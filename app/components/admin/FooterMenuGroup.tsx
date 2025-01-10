'use client';

import React from 'react';
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import type { FooterMenuGroup, FooterMenuItem } from "@/lib/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  handle?: boolean;
}

function SortableItem({ id, children, handle = true }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    position: 'relative',
    zIndex: isDragging ? 999 : undefined,
  } as React.CSSProperties;

  const dragHandleElement = (
    <span 
      className={`
        text-gray-400 cursor-move select-none p-1 rounded
        hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10
        transition-all duration-150 ease-in-out
        ${isDragging ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : ''}
      `} 
      {...attributes} 
      {...listeners}
    >
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
      </svg>
    </span>
  );

  if (handle) {
    return (
      <div ref={setNodeRef} style={style}>
        <div 
          className={`
            flex items-center gap-3 rounded-lg
            ${isDragging ? 'shadow-lg ring-2 ring-blue-500/20 bg-white dark:bg-gray-800/95 backdrop-blur-sm' : ''}
          `}
        >
          {dragHandleElement}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`
        rounded-lg
        ${isDragging ? 'shadow-lg ring-2 ring-blue-500/20 bg-white dark:bg-gray-800/95 backdrop-blur-sm' : ''}
      `}
    >
      {children}
    </div>
  );
}

interface FooterMenuItemProps {
  item: FooterMenuItem;
  onEdit: () => void;
  onDelete: () => void;
}

function FooterMenuItem({ item, onEdit, onDelete }: FooterMenuItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg group hover:bg-white dark:hover:bg-gray-700/80 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
      <div className="flex items-center gap-4 min-w-0">
        <span className="truncate font-medium text-gray-900 dark:text-gray-100">{item.baslik}</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm shrink-0">({item.link})</span>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-150"
          title="Düzenle"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-150"
          title="Sil"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface FooterMenuGroupProps {
  group: FooterMenuGroup;
  onAddItem: () => void;
  onEditItem: (item: FooterMenuItem) => void;
  onDeleteItem: (itemId: string, title: string) => void;
  onDeleteGroup: () => void;
  onItemsReorder?: (items: FooterMenuItem[]) => void;
}

export default function FooterMenuGroup({
  group,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDeleteGroup,
  onItemsReorder
}: FooterMenuGroupProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 50,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !group.menu_items) return;

    const oldIndex = group.menu_items.findIndex(item => item.id === active.id);
    const newIndex = group.menu_items.findIndex(item => item.id === over.id);

    const newItems = arrayMove(group.menu_items, oldIndex, newIndex);

    try {
      const updates = newItems.map((item, index) => ({
        id: item.id,
        sira: index,
        baslik: item.baslik,
        link: item.link,
        group_id: item.group_id,
        aktif: item.aktif
      }));

      const { error } = await supabase
        .from('footer_menu_items')
        .upsert(updates);

      if (error) throw error;

      onItemsReorder?.(newItems);
      toast.success('Sıralama güncellendi');
    } catch (error) {
      toast.error('Sıralama güncellenirken bir hata oluştu');
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 group hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <SortableItem id={group.id} handle>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-200 truncate">
                {group.baslik}
              </h3>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {group.menu_items?.length || 0} öğe
                </span>
                <button
                  type="button"
                  onClick={onAddItem}
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors duration-150"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z" clipRule="evenodd" />
                  </svg>
                  Menü Öğesi Ekle
                </button>
              </div>
            </div>
          </SortableItem>
          <button
            type="button"
            onClick={onDeleteGroup}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
            title="Grubu Sil"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Menü Öğeleri */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={group.menu_items?.map(item => item.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {group.menu_items?.map((item) => (
              <SortableItem key={item.id} id={item.id} handle>
                <FooterMenuItem
                  item={item}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item.id, item.baslik)}
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
} 