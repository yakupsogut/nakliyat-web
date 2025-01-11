"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PencilIcon, TrashIcon, PlusIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ConfirmModal from "@/app/components/ConfirmModal";
import { revalidateAfterBlogUpdate } from "@/lib/revalidate";

interface BlogPost {
  id: number;
  baslik: string;
  ozet: string;
  yazar: string;
  kategori: string;
  created_at: string;
  aktif: boolean;
  slug: string;
  siralama: number;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    postId: number | null;
    postTitle: string;
  }>({
    isOpen: false,
    postId: null,
    postTitle: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog')
        .select('*')
        .order('siralama', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('blog')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Blog sayfasını revalidate et
      await revalidateAfterBlogUpdate();
      
      setPosts(posts.filter(post => post.id !== id));
      setDeleteModal({ isOpen: false, postId: null, postTitle: "" });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openDeleteModal = (id: number, title: string) => {
    setDeleteModal({
      isOpen: true,
      postId: id,
      postTitle: title,
    });
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog')
        .update({ aktif: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      // Blog sayfasını revalidate et
      await revalidateAfterBlogUpdate();
      
      setPosts(posts.map(post => 
        post.id === id ? { ...post, aktif: !currentStatus } : post
      ));
    } catch (error) {
      console.error('Error updating post status:', error);
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

    const sourcePost = posts.find(p => p.id === draggingId);
    const targetPost = posts.find(p => p.id === targetId);
    if (!sourcePost || !targetPost) return;

    try {
      // Sıralama değerlerini güncelle
      const updates = posts.map(post => {
        if (post.id === draggingId) {
          return { ...post, siralama: targetPost.siralama };
        }
        if (sourcePost.siralama < targetPost.siralama) {
          // Yukarıdan aşağıya sürükleme
          if (post.siralama <= targetPost.siralama && post.siralama > sourcePost.siralama) {
            return { ...post, siralama: post.siralama - 1 };
          }
        } else {
          // Aşağıdan yukarıya sürükleme
          if (post.siralama >= targetPost.siralama && post.siralama < sourcePost.siralama) {
            return { ...post, siralama: post.siralama + 1 };
          }
        }
        return post;
      });

      // Veritabanını güncelle
      for (const post of updates) {
        const { error } = await supabase
          .from('blog')
          .update({ siralama: post.siralama })
          .eq('id', post.id);

        if (error) throw error;
      }

      // Blog sayfasını revalidate et
      await revalidateAfterBlogUpdate();

      // State'i güncelle
      setPosts(updates.sort((a, b) => a.siralama - b.siralama));
    } catch (error) {
      console.error('Error reordering posts:', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const searchFields = [
      post.baslik,
      post.ozet,
      post.yazar,
      post.kategori
    ].map(field => (field || "").toLowerCase());

    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchesSearch = searchTerms.every(term => 
      searchFields.some(field => field.includes(term))
    );

    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "aktif" && post.aktif) || 
      (statusFilter === "pasif" && !post.aktif);

    return matchesSearch && matchesStatus;
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
        onClose={() => setDeleteModal({ isOpen: false, postId: null, postTitle: "" })}
        onConfirm={() => deleteModal.postId && handleDelete(deleteModal.postId)}
        title="Blog Yazısını Sil"
        message={`"${deleteModal.postTitle}" başlıklı blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Blog Yazıları</h1>
          <p className="mt-2 text-sm text-gray-400">
            Tüm blog yazılarının listesi
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/blog/yeni"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Yeni Yazı
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
              placeholder="Blog yazısı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <select
            id="status"
            name="status"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="aktif">Aktif</option>
            <option value="pasif">Pasif</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="w-16 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Sıra
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Başlık
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Yazar
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Kategori
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Durum
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Tarih
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, post.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, post.id)}
                      onDrop={(e) => handleDrop(e, post.id)}
                      className={`hover:bg-gray-700 cursor-move transition-colors ${
                        dragOverId === post.id ? 'border-t-2 border-indigo-500' : ''
                      }`}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                        <div className="flex items-center space-x-2">
                          <Bars3Icon className="w-5 h-5 text-gray-400" />
                          <span>{post.siralama}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {post.baslik}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {post.yazar}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {post.kategori}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button
                          onClick={() => toggleStatus(post.id, post.aktif)}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            post.aktif
                              ? 'bg-green-900 text-green-200'
                              : 'bg-red-900 text-red-200'
                          }`}
                        >
                          {post.aktif ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {new Date(post.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/admin/blog/duzenle/${post.id}`}
                          className="text-indigo-400 hover:text-indigo-300 mr-4"
                        >
                          <PencilIcon className="w-5 h-5 inline" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(post.id, post.baslik)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="w-5 h-5 inline" />
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