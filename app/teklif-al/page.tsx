'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';

export default function QuoteRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      serviceType: formData.get('service-type'),
      moveDate: formData.get('move-date'),
      fromAddress: formData.get('from-address'),
      toAddress: formData.get('to-address'),
      notes: formData.get('notes'),
    };

    try {
      const response = await fetch('/api/teklif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Bir hata oluştu');
      }

      setSubmitStatus('success');
      e.currentTarget.reset();
    } catch (error) {
      console.error('Hata:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Teklif Al</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Ücretsiz fiyat teklifi almak için formu doldurun, uzmanlarımız en kısa sürede size ulaşsın.
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="mx-auto mt-6 max-w-2xl rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Talebiniz başarıyla alındı. En kısa sürede size ulaşacağız.
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mx-auto mt-6 max-w-2xl rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mx-auto mt-16 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Kişisel Bilgiler */}
              <div className="border-b border-gray-900/10 pb-8">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">Kişisel Bilgiler</h3>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Ad
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Soyad
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      E-posta
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Telefon
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="tel"
                        name="phone"
                        id="phone"
                        autoComplete="tel"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Taşınma Detayları */}
              <div className="border-b border-gray-900/10 pb-8">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">Taşınma Detayları</h3>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="service-type" className="block text-sm font-medium leading-6 text-gray-900">
                      Hizmet Türü
                    </label>
                    <div className="mt-2">
                      <select
                        required
                        id="service-type"
                        name="service-type"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Seçiniz</option>
                        <option>Evden Eve Nakliyat</option>
                        <option>Ofis Taşıma</option>
                        <option>Şehirler Arası Nakliyat</option>
                        <option>Asansörlü Taşıma</option>
                        <option>Parça Eşya Taşıma</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="move-date" className="block text-sm font-medium leading-6 text-gray-900">
                      Taşınma Tarihi
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="date"
                        name="move-date"
                        id="move-date"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="from-address" className="block text-sm font-medium leading-6 text-gray-900">
                      Mevcut Adres
                    </label>
                    <div className="mt-2">
                      <textarea
                        required
                        name="from-address"
                        id="from-address"
                        rows={3}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="to-address" className="block text-sm font-medium leading-6 text-gray-900">
                      Taşınılacak Adres
                    </label>
                    <div className="mt-2">
                      <textarea
                        required
                        name="to-address"
                        id="to-address"
                        rows={3}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                      Ek Notlar
                    </label>
                    <div className="mt-2">
                      <textarea
                        name="notes"
                        id="notes"
                        rows={4}
                        placeholder="Taşınacak özel eşyalar, kat bilgisi, asansör durumu vb."
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Teklif İste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </main>
  );
} 