"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PencilIcon, TrashIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";

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
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog')
        .update({ aktif: !currentStatus })
        .eq('id', id);

      if (error) throw error;
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

      // State'i güncelle
      setPosts(updates.sort((a, b) => a.siralama - b.siralama));
    } catch (error) {
      console.error('Error reordering posts:', error);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Blog Yazıları</h1>
        <Link
          href="/admin/blog/yeni"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Yeni Yazı
        </Link>
      </div>

      <div className="bg-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Sıra
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Başlık
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Yazar
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Kategori
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {posts.map((post) => (
              <tr
                key={post.id}
                draggable
                onDragStart={(e) => handleDragStart(e, post.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, post.id)}
                onDrop={(e) => handleDrop(e, post.id)}
                className={`hover:bg-gray-600 cursor-move transition-colors ${
                  dragOverId === post.id ? 'border-t-2 border-indigo-500' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Bars3Icon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-100">{post.siralama}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-100">{post.baslik}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-100">{post.yazar}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-100">{post.kategori}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(post.id, post.aktif)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.aktif
                        ? 'bg-green-900 text-green-200'
                        : 'bg-red-900 text-red-200'
                    }`}
                  >
                    {post.aktif ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-100">
                    {new Date(post.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/blog/duzenle/${post.id}`}
                    className="text-indigo-400 hover:text-indigo-300 mr-4"
                  >
                    <PencilIcon className="w-5 h-5 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
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
  );
} 