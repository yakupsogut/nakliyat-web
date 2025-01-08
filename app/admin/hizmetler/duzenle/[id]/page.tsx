"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { use } from "react";
import Image from "next/image";

interface Hizmet {
  id: number;
  baslik: string;
  aciklama: string;
  resim_url: string;
  aktif: boolean;
  siralama: number;
  ozellikler: string[];
}

export default function DuzenleHizmet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState<Hizmet>({
    id: parseInt(id),
    baslik: "",
    aciklama: "",
    resim_url: "",
    aktif: true,
    siralama: 0,
    ozellikler: [""],
  });

  useEffect(() => {
    const fetchHizmet = async () => {
      try {
        const { data, error } = await supabase
          .from('hizmetler')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            ...data,
            ozellikler: data.ozellikler || [""],
          });
          if (data.resim_url) {
            setPreviewImage(data.resim_url);
          }
        }
      } catch (error) {
        console.error('Hizmet yüklenirken hata:', error);
        alert('Hizmet yüklenirken bir hata oluştu.');
        router.push('/admin/hizmetler');
      }
    };

    fetchHizmet();
  }, [id, router]);

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
      let imageUrl = formData.resim_url;
      
      // Eğer yeni bir resim seçildiyse yükle
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Dosyayı yükle
        const { error: uploadError } = await supabase.storage
          .from('hizmet-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // Public URL'i al
        const { data: { publicUrl } } = supabase.storage
          .from('hizmet-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Boş özellikleri filtrele
      const filteredOzellikler = formData.ozellikler.filter(ozellik => ozellik.trim() !== "");

      const { error } = await supabase
        .from('hizmetler')
        .update({
          baslik: formData.baslik,
          aciklama: formData.aciklama,
          resim_url: imageUrl,
          aktif: formData.aktif,
          ozellikler: filteredOzellikler,
        })
        .eq('id', parseInt(id));

      if (error) {
        console.error('Güncelleme hatası:', error);
        throw error;
      }

      router.push('/admin/hizmetler');
      router.refresh();
    } catch (error) {
      console.error('Hizmet güncellenirken hata:', error);
      alert('Hizmet güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Hizmet Düzenle</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Başlık
            </label>
            <input
              type="text"
              name="baslik"
              value={formData.baslik}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Açıklama
            </label>
            <textarea
              name="aciklama"
              value={formData.aciklama}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Resim
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
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
                  alt="Resim önizleme"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Özellikler
            </label>
            {formData.ozellikler.map((ozellik, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ozellik}
                  onChange={(e) => {
                    const newOzellikler = [...formData.ozellikler];
                    newOzellikler[index] = e.target.value;
                    setFormData({ ...formData, ozellikler: newOzellikler });
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  placeholder="Özellik ekleyin"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newOzellikler = formData.ozellikler.filter((_, i) => i !== index);
                    setFormData({ ...formData, ozellikler: newOzellikler });
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Sil
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  ozellikler: [...formData.ozellikler, ""],
                });
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Özellik Ekle
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="aktif"
              checked={formData.aktif}
              onChange={(e) =>
                setFormData({ ...formData, aktif: e.target.checked })
              }
              className="w-4 h-4 text-indigo-600 border-gray-700 rounded focus:ring-indigo-500"
            />
            <label className="text-sm font-medium text-gray-200">Aktif</label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/hizmetler')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 