'use client';

import { useState } from 'react';

interface SSS {
  id: number;
  soru: string;
  cevap: string;
  kategori: string;
}

interface Props {
  sorular: SSS[];
  kategoriler: string[];
}

export default function SSSKategoriListesi({ sorular, kategoriler }: Props) {
  const [seciliKategori, setSeciliKategori] = useState(kategoriler[0] || '');

  const filtrelenmisSSS = seciliKategori
    ? sorular.filter(soru => soru.kategori === seciliKategori)
    : sorular;

  return (
    <>
      {/* Kategori Seçimi */}
      <div className="mt-16 flex justify-center space-x-4">
        {kategoriler.map((kategori) => (
          <button
            key={kategori}
            onClick={() => setSeciliKategori(kategori)}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              seciliKategori === kategori
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {kategori}
          </button>
        ))}
      </div>

      {/* SSS Listesi */}
      <div className="mt-16 max-w-3xl mx-auto divide-y divide-gray-200">
        {filtrelenmisSSS.map((soru) => (
          <div key={soru.id} className="py-8">
            <h3 className="text-xl font-bold text-gray-900">
              {soru.soru}
            </h3>
            <p className="mt-4 text-base text-gray-600">
              {soru.cevap}
            </p>
          </div>
        ))}
      </div>
    </>
  );
} 