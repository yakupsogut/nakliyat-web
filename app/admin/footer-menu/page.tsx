'use client';

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { FooterMenuGroup, FooterMenuItem } from "@/lib/types";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { Dialog } from "@headlessui/react";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { PlusIcon, TrashIcon, PencilIcon, GripVertical } from 'lucide-react';

interface MenuItemProps {
  item: FooterMenuItem;
  index: number;
  onEdit: (item: FooterMenuItem) => void;
  onDelete: (id: string, title: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}
        >
          <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <GripVertical size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">{item.baslik}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.link}</p>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(item)}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50"
            >
              <PencilIcon size={16} />
            </button>
            <button
              onClick={() => onDelete(item.id, item.baslik)}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

interface MenuGroupProps {
  group: FooterMenuGroup;
  index: number;
  onAddItem: () => void;
  onEditItem: (item: FooterMenuItem) => void;
  onDeleteItem: (id: string, title: string) => void;
  onDeleteGroup: () => void;
  onEditGroup: (group: FooterMenuGroup) => void;
}

const MenuGroup: React.FC<MenuGroupProps> = ({
  group,
  index,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDeleteGroup,
  onEditGroup,
}) => {
  return (
    <Draggable draggableId={`group-${group.id}`} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-gray-50 dark:bg-gray-900 rounded-xl p-4 ${
            snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div {...provided.dragHandleProps} className="flex items-center gap-3">
              <GripVertical className="text-gray-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer" onClick={() => onEditGroup(group)}>{group.baslik}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditGroup(group)}
                className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50"
              >
                <PencilIcon size={16} />
              </button>
              <button
                onClick={onAddItem}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <PlusIcon size={16} className="mr-1" />
                Öğe Ekle
              </button>
              <button
                onClick={onDeleteGroup}
                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </div>

          <Droppable droppableId={group.id} type="menuItem">
            {(provided: DroppableProvided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {group.menu_items?.map((item, itemIndex) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    index={itemIndex}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FooterMenuItem | null;
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
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {item ? 'Menü Öğesini Düzenle' : 'Yeni Menü Öğesi'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={formData.baslik}
                onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  /
                </span>
                <input
                  type="text"
                  value={formData.link.replace(/^\//, '')}
                  onChange={(e) => setFormData({ ...formData, link: '/' + e.target.value.replace(/^\//, '') })}
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={yukleniyor}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

interface GroupEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (baslik: string) => Promise<void>;
  yukleniyor: boolean;
  title: string;
  initialBaslik?: string;
}

function GroupEditModal({ isOpen, onClose, onSave, yukleniyor, title, initialBaslik = '' }: GroupEditModalProps) {
  const [baslik, setBaslik] = useState(initialBaslik);

  useEffect(() => {
    setBaslik(initialBaslik);
  }, [initialBaslik]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(baslik);
    setBaslik('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {title}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Grup başlığını girin"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={yukleniyor || !baslik.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default function FooterMenuYonetimi() {
  const [groups, setGroups] = useState<FooterMenuGroup[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: FooterMenuItem | null;
    groupId?: string;
  }>({
    isOpen: false,
    item: null
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemTitle: string;
    isGroup: boolean;
  }>({
    isOpen: false,
    itemId: null,
    itemTitle: "",
    isGroup: false,
  });
  const [groupModal, setGroupModal] = useState<{
    isOpen: boolean;
    groupId: string | null;
    baslik: string;
  }>({
    isOpen: false,
    groupId: null,
    baslik: '',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const { data, error } = await supabase
        .from('footer_menu_groups')
        .select(`
          *,
          menu_items:footer_menu_items(*)
        `)
        .order('sira', { ascending: true });

      if (error) throw error;

      const processedGroups = data.map(group => ({
        ...group,
        menu_items: group.menu_items.sort((a: FooterMenuItem, b: FooterMenuItem) => a.sira - b.sira)
      }));

      setGroups(processedGroups);
    } catch (error) {
      toast.error('Menü grupları yüklenirken bir hata oluştu');
      console.error('Error:', error);
    }
  }

  const handleAddGroup = () => {
    setGroupModal({
      isOpen: true,
      groupId: null,
      baslik: '',
    });
  };

  const handleSaveGroup = async (baslik: string) => {
    setYukleniyor(true);
    try {
      if (groupModal.groupId) {
        // Grup güncelleme
        const { error } = await supabase
          .from('footer_menu_groups')
          .update({ baslik })
          .eq('id', groupModal.groupId);

        if (error) throw error;

        setGroups(groups.map(group => 
          group.id === groupModal.groupId 
            ? { ...group, baslik } 
            : group
        ));

        toast.success('Grup başarıyla güncellendi');
      } else {
        // Yeni grup ekleme
        const { data, error } = await supabase
          .from('footer_menu_groups')
          .insert([
            { 
              baslik,
              sira: groups.length,
              aktif: true
            }
          ])
          .select()
          .single();

        if (error) throw error;

        setGroups([...groups, { ...data, menu_items: [] }]);
        toast.success('Grup başarıyla eklendi');
      }
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu');
      console.error('Error:', error);
    } finally {
      setYukleniyor(false);
      setGroupModal({ isOpen: false, groupId: null, baslik: '' });
    }
  };

  const handleEditGroup = (group: FooterMenuGroup) => {
    setGroupModal({
      isOpen: true,
      groupId: group.id,
      baslik: group.baslik,
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.itemId) return;
    setYukleniyor(true);

    try {
      const { error } = await supabase
        .from(deleteModal.isGroup ? 'footer_menu_groups' : 'footer_menu_items')
        .delete()
        .eq('id', deleteModal.itemId);

      if (error) throw error;

      if (deleteModal.isGroup) {
        setGroups(groups.filter(group => group.id !== deleteModal.itemId));
      } else {
        setGroups(groups.map(group => ({
          ...group,
          menu_items: group.menu_items?.filter(item => item.id !== deleteModal.itemId) || []
        })));
      }

      toast.success(`${deleteModal.isGroup ? 'Grup' : 'Menü öğesi'} başarıyla silindi`);
    } catch (error) {
      toast.error(`${deleteModal.isGroup ? 'Grup' : 'Menü öğesi'} silinirken bir hata oluştu`);
      console.error('Error:', error);
    } finally {
      setYukleniyor(false);
      setDeleteModal({ isOpen: false, itemId: null, itemTitle: "", isGroup: false });
    }
  };

  const handleSaveMenuItem = async (formData: { baslik: string; link: string }) => {
    setYukleniyor(true);

    try {
      if (editModal.item) {
        // Güncelleme
        const { error } = await supabase
          .from('footer_menu_items')
          .update({
            baslik: formData.baslik,
            link: formData.link
          })
          .eq('id', editModal.item.id);

        if (error) throw error;

        setGroups(groups.map(group => ({
          ...group,
          menu_items: group.menu_items?.map(item =>
            item.id === editModal.item?.id
              ? { ...item, baslik: formData.baslik, link: formData.link }
              : item
          ) || []
        })));

        toast.success('Menü öğesi güncellendi');
      } else if (editModal.groupId) {
        // Yeni öğe ekleme
        const group = groups.find(g => g.id === editModal.groupId);
        const { data, error } = await supabase
          .from('footer_menu_items')
          .insert([
            {
              baslik: formData.baslik,
              link: formData.link,
              group_id: editModal.groupId,
              sira: group?.menu_items?.length || 0
            }
          ])
          .select()
          .single();

        if (error) throw error;

        setGroups(groups.map(group => {
          if (group.id === editModal.groupId) {
            return {
              ...group,
              menu_items: [...(group.menu_items || []), data]
            };
          }
          return group;
        }));

        toast.success('Menü öğesi eklendi');
      }
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu');
      console.error('Error:', error);
    } finally {
      setYukleniyor(false);
      setEditModal({ isOpen: false, item: null });
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "group") {
      // Grup sıralaması
      const newGroups = Array.from(groups);
      const [removed] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, removed);

      setGroups(newGroups);

      // Veritabanını güncelle
      try {
        const updates = newGroups.map((group, index) => ({
          id: group.id,
          sira: index,
          baslik: group.baslik,
          aktif: group.aktif
        }));

        const { error } = await supabase
          .from('footer_menu_groups')
          .upsert(updates);

        if (error) throw error;
        
        toast.success('Grup sıralaması güncellendi');
      } catch (error) {
        toast.error('Sıralama güncellenirken bir hata oluştu');
        console.error('Error:', error);
      }
    } else {
      // Menü öğesi sıralaması
      const sourceGroup = groups.find(g => g.id === source.droppableId);
      const destGroup = groups.find(g => g.id === destination.droppableId);

      if (!sourceGroup || !destGroup) return;

      const newGroups = Array.from(groups);
      const sourceItems = Array.from(sourceGroup.menu_items || []);
      const destItems = source.droppableId === destination.droppableId
        ? sourceItems
        : Array.from(destGroup.menu_items || []);

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const updatedGroups = newGroups.map(group => {
        if (group.id === source.droppableId) {
          return { ...group, menu_items: sourceItems };
        }
        if (group.id === destination.droppableId) {
          return { ...group, menu_items: destItems };
        }
        return group;
      });

      setGroups(updatedGroups);

      // Veritabanını güncelle
      try {
        const updates = destItems.map((item, index) => ({
          id: item.id,
          sira: index,
          group_id: destination.droppableId,
          baslik: item.baslik,
          link: item.link,
          aktif: item.aktif
        }));

        const { error } = await supabase
          .from('footer_menu_items')
          .upsert(updates);

        if (error) throw error;

        const message = source.droppableId === destination.droppableId
          ? 'Menü öğesi sıralaması güncellendi'
          : 'Menü öğesi başka gruba taşındı';
        
        toast.success(message);
      } catch (error) {
        toast.error('Sıralama güncellenirken bir hata oluştu');
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Footer Menü Yönetimi</h1>
        <button
          onClick={handleAddGroup}
          disabled={yukleniyor}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-5 w-5 mr-1.5" />
          Yeni Grup Ekle
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="groups" type="group">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {groups.map((group, index) => (
                <MenuGroup
                  key={group.id}
                  group={group}
                  index={index}
                  onAddItem={() => setEditModal({ isOpen: true, item: null, groupId: group.id })}
                  onEditItem={(item) => setEditModal({ isOpen: true, item })}
                  onDeleteItem={(id, title) => setDeleteModal({
                    isOpen: true,
                    itemId: id,
                    itemTitle: title,
                    isGroup: false
                  })}
                  onDeleteGroup={() => setDeleteModal({
                    isOpen: true,
                    itemId: group.id,
                    itemTitle: group.baslik,
                    isGroup: true
                  })}
                  onEditGroup={handleEditGroup}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null })}
        item={editModal.item}
        onSave={handleSaveMenuItem}
        yukleniyor={yukleniyor}
      />

      <GroupEditModal
        isOpen={groupModal.isOpen}
        onClose={() => setGroupModal({ isOpen: false, groupId: null, baslik: '' })}
        onSave={handleSaveGroup}
        yukleniyor={yukleniyor}
        title={groupModal.groupId ? 'Grup Düzenle' : 'Yeni Grup Ekle'}
        initialBaslik={groupModal.baslik}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemTitle: "", isGroup: false })}
        onConfirm={handleDelete}
        title={`${deleteModal.isGroup ? 'Grubu' : 'Menü Öğesini'} Sil`}
        message={`"${deleteModal.itemTitle}" ${deleteModal.isGroup ? 'grubunu' : 'menü öğesini'} silmek istediğinizden emin misiniz?${
          deleteModal.isGroup ? ' Bu işlem gruptaki tüm menü öğelerini de silecektir.' : ''
        }`}
        confirmButtonText="Sil"
        cancelButtonText="İptal"
      />
    </div>
  );
} 