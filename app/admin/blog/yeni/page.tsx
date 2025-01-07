"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";

export default function YeniBlogYazisi() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState({
    baslik: "",
    ozet: "",
    icerik: "",
    kapak_resmi: "",
    yazar: "",
    kategori: "",
    etiketler: "",
    aktif: true
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      
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

      // Slug oluştur
      const slug = formData.baslik
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Etiketleri diziye çevir
      const etiketlerArray = formData.etiketler
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const { error } = await supabase
        .from('blog')
        .insert([
          {
            ...formData,
            kapak_resmi: imageUrl || formData.kapak_resmi,
            slug,
            etiketler: etiketlerArray
          }
        ]);

      if (error) throw error;

      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Blog yazısı eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Yeni Blog Yazısı</h1>
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
                value={formData.baslik}
                onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
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
              value={formData.ozet}
              onChange={(e) => setFormData({ ...formData, ozet: e.target.value })}
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
                value={formData.icerik}
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
                onEditorChange={(content) => setFormData({ ...formData, icerik: content })}
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
                value={formData.yazar}
                onChange={(e) => setFormData({ ...formData, yazar: e.target.value })}
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
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
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
              value={formData.etiketler}
              onChange={(e) => setFormData({ ...formData, etiketler: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
              placeholder="örnek, etiket, nakliyat"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.aktif}
              onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
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
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 