'use client';

import { useRef, useEffect, useState } from 'react';
import { convertSupabaseImageUrl } from '@/lib/utils';

interface Props {
  icerik: string;
}

// İçindekiler tablosunu oluşturan yardımcı fonksiyon
function extractTableOfContents(content: string) {
  if (typeof window === 'undefined') return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h2, h3'));
  return headings.map((heading, index) => ({
    id: `heading-${index}`,
    text: heading.textContent || '',
    level: parseInt(heading.tagName[1])
  }));
}

export default function BlogIcerik({ icerik }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [processedContent, setProcessedContent] = useState(icerik);

  useEffect(() => {
    const processedIcerik = convertSupabaseImageUrl(icerik);
    setProcessedContent(processedIcerik);
  }, [icerik]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const totalHeight = contentRef.current.clientHeight;
        const windowHeight = window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / (totalHeight - windowHeight)) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const toc = extractTableOfContents(icerik);
    setTableOfContents(toc);
  }, [icerik]);

  return (
    <>
      {/* İlerleme Çubuğu */}
      <div 
        style={{ transform: `translateX(${scrollProgress - 100}%)` }}
        className="fixed top-0 left-0 w-full h-1 bg-blue-600 transition-transform duration-150 z-[60]"
      />

      {/* İçerik */}
      <div 
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: processedContent }}
        className="text-gray-800 leading-relaxed"
      />

      {/* İçindekiler */}
      {tableOfContents.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            İçindekiler
          </h2>
          <nav className="space-y-2">
            {tableOfContents.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block text-sm hover:text-blue-600 transition-colors ${
                  heading.level === 2 ? 'font-medium' : 'pl-4 text-gray-600'
                }`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
} 