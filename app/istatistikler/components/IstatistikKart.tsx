'use client';

import { motion } from 'framer-motion';
import { ChartBarIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Props {
  baslik: string;
  deger: string;
  aciklama: string;
  ikon: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function IstatistikKart({ baslik, deger, aciklama, ikon }: Props) {
  const getIcon = (ikonAdi: string) => {
    switch (ikonAdi) {
      case 'truck':
        return <TruckIcon className="h-8 w-8 text-white" />;
      case 'users':
        return <UserGroupIcon className="h-8 w-8 text-white" />;
      default:
        return <ChartBarIcon className="h-8 w-8 text-white" />;
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative flex flex-col items-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 transform transition-transform group-hover:scale-110">
        {getIcon(ikon)}
      </div>
      <dt className="text-4xl font-bold text-blue-600 tracking-tight">
        {deger}
      </dt>
      <dd className="mt-4 flex flex-auto flex-col text-center">
        <p className="text-xl font-semibold text-gray-900">{baslik}</p>
        <p className="mt-2 text-base leading-7 text-gray-600">{aciklama}</p>
      </dd>
    </motion.div>
  );
} 