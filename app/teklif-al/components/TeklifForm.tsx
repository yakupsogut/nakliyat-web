'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  moveDate: string;
  fromAddress: string;
  toAddress: string;
  notes: string;
};

export default function TeklifForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/teklif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Teklif talebiniz başarıyla alındı!');
        reset(); // Form verilerini temizle
      } else {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                type="text"
                id="first-name"
                {...register('firstName', { required: 'Ad gereklidir' })}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
              Soyad
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="last-name"
                {...register('lastName', { required: 'Soyad gereklidir' })}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              E-posta
            </label>
            <div className="mt-2">
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'E-posta gereklidir',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Geçerli bir e-posta adresi giriniz',
                  },
                })}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
              Telefon
            </label>
            <div className="mt-2">
              <input
                type="tel"
                id="phone"
                {...register('phone', {
                  required: 'Telefon numarası gereklidir',
                  pattern: {
                    value: /^[0-9\s+()-]+$/,
                    message: 'Geçerli bir telefon numarası giriniz',
                  },
                })}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
              )}
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
                id="service-type"
                {...register('serviceType', { required: 'Hizmet türü seçiniz' })}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="">Seçiniz</option>
                <option value="Evden Eve Nakliyat">Evden Eve Nakliyat</option>
                <option value="Ofis Taşıma">Ofis Taşıma</option>
                <option value="Şehirler Arası Nakliyat">Şehirler Arası Nakliyat</option>
                <option value="Asansörlü Taşıma">Asansörlü Taşıma</option>
                <option value="Parça Eşya Taşıma">Parça Eşya Taşıma</option>
              </select>
              {errors.serviceType && (
                <p className="mt-2 text-sm text-red-600">{errors.serviceType.message}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="move-date" className="block text-sm font-medium leading-6 text-gray-900">
              Taşınma Tarihi
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="move-date"
                {...register('moveDate', { required: 'Taşınma tarihi gereklidir' })}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.moveDate && (
                <p className="mt-2 text-sm text-red-600">{errors.moveDate.message}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="from-address" className="block text-sm font-medium leading-6 text-gray-900">
              Mevcut Adres
            </label>
            <div className="mt-2">
              <textarea
                id="from-address"
                {...register('fromAddress', { required: 'Mevcut adres gereklidir' })}
                rows={3}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.fromAddress && (
                <p className="mt-2 text-sm text-red-600">{errors.fromAddress.message}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="to-address" className="block text-sm font-medium leading-6 text-gray-900">
              Taşınılacak Adres
            </label>
            <div className="mt-2">
              <textarea
                id="to-address"
                {...register('toAddress', { required: 'Taşınılacak adres gereklidir' })}
                rows={3}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.toAddress && (
                <p className="mt-2 text-sm text-red-600">{errors.toAddress.message}</p>
              )}
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
              Ek Notlar
            </label>
            <div className="mt-2">
              <textarea
                id="notes"
                {...register('notes')}
                rows={4}
                placeholder="Taşınacak özel eşyalar, kat bilgisi, asansör durumu vb."
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Teklif Al'}
        </button>
      </div>
    </form>
  );
} 