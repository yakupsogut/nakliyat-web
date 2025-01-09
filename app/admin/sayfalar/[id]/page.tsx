"use client";

import { useState, useEffect, useCallback, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Sayfa } from "@/lib/types";
import dynamic from "next/dynamic";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const RichTextEditor = dynamic(() => import("@/app/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-700 rounded-md animate-pulse" />,
});

export default function SayfaDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sayfa, setSayfa] = useState<Sayfa>({
    id: "",
    slug: "",
    baslik: "",
    icerik: "",
    meta_title: "",
    meta_description: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const fetchSayfa = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("sayfalar")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) setSayfa(data);
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  }, [id, setSayfa, setLoading]);

  useEffect(() => {
    if (id !== "yeni") {
      fetchSayfa();
    } else {
      setLoading(false);
    }
  }, [id, fetchSayfa]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id === "yeni") {
        const { error } = await supabase.from("sayfalar").insert([
          {
            slug: sayfa.slug,
            baslik: sayfa.baslik,
            icerik: sayfa.icerik,
            meta_title: sayfa.meta_title,
            meta_description: sayfa.meta_description,
          },
        ]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sayfalar")
          .update({
            slug: sayfa.slug,
            baslik: sayfa.baslik,
            icerik: sayfa.icerik,
            meta_title: sayfa.meta_title,
            meta_description: sayfa.meta_description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
        if (error) throw error;
      }

      router.push("/admin/sayfalar");
      router.refresh();
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Sayfa kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            href="/admin/sayfalar"
            className="mr-4 p-2 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white">
            {id === "yeni" ? "Yeni Sayfa" : "Sayfayı Düzenle"}
          </h1>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Başlık
              </label>
              <input
                type="text"
                required
                value={sayfa.baslik}
                onChange={(e) => setSayfa({ ...sayfa, baslik: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Sayfa başlığı"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                URL (Slug)
              </label>
              <div className="flex rounded-lg overflow-hidden">
                <span className="inline-flex items-center px-4 bg-gray-700 border border-r-0 border-gray-600 text-gray-400">
                  /
                </span>
                <input
                  type="text"
                  required
                  value={sayfa.slug}
                  onChange={(e) => setSayfa({ ...sayfa, slug: e.target.value })}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                  placeholder="sayfa-url"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Meta Başlık (SEO)
              </label>
              <input
                type="text"
                value={sayfa.meta_title || ""}
                onChange={(e) => setSayfa({ ...sayfa, meta_title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="SEO başlığı"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Meta Açıklama (SEO)
              </label>
              <textarea
                rows={3}
                value={sayfa.meta_description || ""}
                onChange={(e) => setSayfa({ ...sayfa, meta_description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="SEO açıklaması"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              İçerik
            </label>
            <div className="rounded-lg overflow-hidden">
              <RichTextEditor
                value={sayfa.icerik}
                onChange={(content) => setSayfa({ ...sayfa, icerik: content })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Link
              href="/admin/sayfalar"
              className="px-6 py-3 rounded-lg text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 