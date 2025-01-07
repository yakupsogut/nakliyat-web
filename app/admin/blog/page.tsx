"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PencilIcon, TrashIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
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

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const currentPost = posts.find(post => post.id === id);
    if (!currentPost) return;

    const currentIndex = posts.indexOf(currentPost);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= posts.length) return;

    const otherPost = posts[newIndex];

    try {
      // İki yazının sıralamasını değiştir
      const { error: error1 } = await supabase
        .from('blog')
        .update({ siralama: otherPost.siralama })
        .eq('id', currentPost.id);

      const { error: error2 } = await supabase
        .from('blog')
        .update({ siralama: currentPost.siralama })
        .eq('id', otherPost.id);

      if (error1 || error2) throw error1 || error2;

      // State'i güncelle
      const newPosts = [...posts];
      newPosts[currentIndex] = { ...currentPost, siralama: otherPost.siralama };
      newPosts[newIndex] = { ...otherPost, siralama: currentPost.siralama };
      newPosts.sort((a, b) => a.siralama - b.siralama);
      setPosts(newPosts);
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
            {posts.map((post, index) => (
              <tr key={post.id} className="hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-100">{post.siralama}</span>
                    <div className="flex flex-col">
                      <button
                        onClick={() => handleReorder(post.id, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUpIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(post.id, 'down')}
                        disabled={index === posts.length - 1}
                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDownIcon className="w-4 h-4" />
                      </button>
                    </div>
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