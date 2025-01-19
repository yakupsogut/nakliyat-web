'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { TbTruckDelivery } from "react-icons/tb";
import { MdSupportAgent, MdSecurity } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";

const iconOptions = [
  { value: 'TbTruckDelivery', label: 'Kamyon', icon: <TbTruckDelivery /> },
  { value: 'MdSupportAgent', label: 'Destek', icon: <MdSupportAgent /> },
  { value: 'MdSecurity', label: 'Güvenlik', icon: <MdSecurity /> },
  { value: 'FaBoxOpen', label: 'Kutu', icon: <FaBoxOpen /> },
];

interface Feature {
  id?: number;
  title: string;
  description: string;
  icon_name: string;
  order_no: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feature: Feature) => void;
  feature?: Feature;
  maxOrder: number;
}

export default function FeatureModal({ isOpen, onClose, onSave, feature, maxOrder }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSave({
      id: feature?.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      icon_name: formData.get('icon_name') as string,
      order_no: parseInt(formData.get('order_no') as string),
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-white mb-4">
                    {feature ? 'Özelliği Düzenle' : 'Yeni Özellik Ekle'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-200">
                        Başlık
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        defaultValue={feature?.title}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-200">
                        Açıklama
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        defaultValue={feature?.description}
                        required
                        rows={3}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label htmlFor="icon_name" className="block text-sm font-medium text-gray-200">
                        İkon
                      </label>
                      <select
                        name="icon_name"
                        id="icon_name"
                        defaultValue={feature?.icon_name}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="order_no" className="block text-sm font-medium text-gray-200">
                        Sıra No
                      </label>
                      <input
                        type="number"
                        name="order_no"
                        id="order_no"
                        defaultValue={feature?.order_no || maxOrder + 1}
                        required
                        min="1"
                        max={maxOrder + 1}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      >
                        Kaydet
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 sm:col-start-1 sm:mt-0"
                        onClick={onClose}
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 