"use client";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from 'tinymce';
import { supabase } from "@/lib/supabase";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

interface BlobInfo {
  blob: () => Blob;
  filename: () => string;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleImageUpload = async (blobInfo: BlobInfo, progress: (percent: number) => void): Promise<string> => {
    try {
      progress(0);
      const blob = blobInfo.blob();
      const fileExt = blobInfo.filename()?.split('.').pop() || 'png';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Blob'u File'a dönüştür
      const file = new File([blob], fileName, { type: blob.type });

      progress(30);
      // Dosyayı yükle
      const { error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      progress(70);
      if (uploadError) throw uploadError;

      // Public URL'i al
      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      progress(100);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: true,
        skin: "oxide-dark",
        content_css: "dark",
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
          "image"
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "image | removeformat | help",
        content_style: "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 14px }",
        // Resim yükleme ayarları
        images_upload_handler: handleImageUpload,
        images_upload_base_path: '/',
        image_advtab: true,
        image_dimensions: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        // Resim yükleme için ek araç çubuğu öğeleri
        image_toolbar: "alignleft aligncenter alignright | rotateleft rotateright | imageoptions",
        // Resim stilleri
        image_class_list: [
          { title: 'Responsive', value: 'img-fluid' },
          { title: 'Sol Hizalı', value: 'float-left mr-4' },
          { title: 'Sağ Hizalı', value: 'float-right ml-4' }
        ],
      }}
    />
  );
} 