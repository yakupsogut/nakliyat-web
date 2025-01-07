"use client";

import { useState } from "react";

interface Teklif {
  id: number;
  ad: string;
  email: string;
  telefon: string;
  nereden: string;
  nereye: string;
  tarih: string;
  durum: "Beklemede" | "İnceleniyor" | "Onaylandı" | "Reddedildi";
}

const mockTeklifler: Teklif[] = [
  {
    id: 1,
    ad: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    telefon: "5551234567",
    nereden: "İstanbul",
    nereye: "Ankara",
    tarih: "2024-01-07",
    durum: "Beklemede",
  },
  // Daha fazla mock veri eklenebilir
];

export default function TekliflerPage() {
  const [teklifler, setTeklifler] = useState<Teklif[]>(mockTeklifler);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTeklifler = teklifler.filter((teklif) => {
    const matchesSearch =
      teklif.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teklif.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teklif.nereden.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teklif.nereye.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || teklif.durum === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (teklifId: number, yeniDurum: Teklif["durum"]) => {
    // Backend entegrasyonu burada yapılacak
    const updatedTeklifler = teklifler.map((teklif) =>
      teklif.id === teklifId ? { ...teklif, durum: yeniDurum } : teklif
    );
    setTeklifler(updatedTeklifler);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Teklifler</h1>
          <p className="mt-2 text-sm text-gray-400">
            Tüm nakliyat tekliflerinin listesi
          </p>
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
              placeholder="Teklif ara..."
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
            <option value="Beklemede">Beklemede</option>
            <option value="İnceleniyor">İnceleniyor</option>
            <option value="Onaylandı">Onaylandı</option>
            <option value="Reddedildi">Reddedildi</option>
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
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Ad Soyad
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      İletişim
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Nereden - Nereye
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Tarih
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Durum
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {filteredTeklifler.map((teklif) => (
                    <tr key={teklif.id} className="hover:bg-gray-700">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                        {teklif.ad}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <div>{teklif.email}</div>
                        <div>{teklif.telefon}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {teklif.nereden} - {teklif.nereye}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {new Date(teklif.tarih).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <select
                          value={teklif.durum}
                          onChange={(e) =>
                            handleStatusChange(
                              teklif.id,
                              e.target.value as Teklif["durum"]
                            )
                          }
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            teklif.durum === "Beklemede"
                              ? "bg-yellow-900 text-yellow-200"
                              : teklif.durum === "İnceleniyor"
                              ? "bg-blue-900 text-blue-200"
                              : teklif.durum === "Onaylandı"
                              ? "bg-green-900 text-green-200"
                              : "bg-red-900 text-red-200"
                          }`}
                        >
                          <option value="Beklemede">Beklemede</option>
                          <option value="İnceleniyor">İnceleniyor</option>
                          <option value="Onaylandı">Onaylandı</option>
                          <option value="Reddedildi">Reddedildi</option>
                        </select>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => {
                            // Detay görüntüleme işlemi
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Detay
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