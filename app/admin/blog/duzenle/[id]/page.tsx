"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";

interface BlogPost {
  id: number;
  baslik: string;
  ozet: string;
  icerik: string;
  kapak_resmi: string;
  yazar: string;
  kategori: string;
  etiketler: string[];
  aktif: boolean;
  slug: string;
}

export default function BlogDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [post, setPost] = useState<BlogPost>({
    id: 0,
    baslik: "",
    ozet: "",
    icerik: "",
    kapak_resmi: "",
    yazar: "",
    kategori: "",
    etiketler: [],
    aktif: true,
    slug: "",
  });

  const fetchPost = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setPost(data);
        if (data.kapak_resmi) {
          setPreviewImage(data.kapak_resmi);
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }, [id, setPost, setPreviewImage, setLoading]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = post.kapak_resmi;
      
      // Eğer yeni bir resim seçildiyse yükle
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Dosyayı yükle
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // Public URL'i al
        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("blog")
        .update({
          ...post,
          kapak_resmi: imageUrl,
        })
        .eq("id", post.id);

      if (error) throw error;
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Blog yazısı güncellenirken bir hata oluştu.");
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Blog Yazısını Düzenle</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Başlık
              </label>
              <input
                type="text"
                required
                value={post.baslik}
                onChange={(e) => setPost({ ...post, baslik: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Blog yazısı başlığı"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Kapak Resmi
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-3 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-700
                    file:cursor-pointer
                    file:transition-colors file:duration-200"
                />
              </div>
              {previewImage && (
                <div className="mt-4 relative w-full h-56 rounded-lg overflow-hidden">
                  <Image
                    src={previewImage}
                    alt="Kapak resmi önizleme"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Özet
            </label>
            <textarea
              required
              rows={4}
              value={post.ozet}
              onChange={(e) => setPost({ ...post, ozet: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
              placeholder="Blog yazısının kısa özeti"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              İçerik
            </label>
            <div className="rounded-lg overflow-hidden">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={post.icerik}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                    "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                    "insertdatetime", "media", "table", "code", "help", "wordcount"
                  ],
                  toolbar: "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  skin: "oxide-dark",
                  content_css: "dark",
                  content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #1F2937; color: #fff; }",
                }}
                onEditorChange={(content) => setPost({ ...post, icerik: content })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Yazar
              </label>
              <input
                type="text"
                required
                value={post.yazar}
                onChange={(e) => setPost({ ...post, yazar: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Yazarın adı"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Kategori
              </label>
              <input
                type="text"
                required
                value={post.kategori}
                onChange={(e) => setPost({ ...post, kategori: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Blog kategorisi"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Etiketler (virgülle ayırın)
            </label>
            <input
              type="text"
              value={post.etiketler.join(", ")}
              onChange={(e) =>
                setPost({
                  ...post,
                  etiketler: e.target.value.split(",").map((tag) => tag.trim()),
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
              placeholder="örnek, etiket, nakliyat"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
              placeholder="url-slug-ornegi"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={post.aktif}
              onChange={(e) => setPost({ ...post, aktif: e.target.checked })}
              className="w-5 h-5 rounded border-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900 bg-gray-800 transition-colors duration-200"
            />
            <label className="text-sm font-medium text-gray-200">
              Aktif
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}