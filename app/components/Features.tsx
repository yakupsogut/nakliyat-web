import { TbTruckDelivery } from "react-icons/tb";
import { MdSupportAgent, MdSecurity } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { createServerClient } from '@/lib/supabase';

// İkon haritası
const iconMap: { [key: string]: JSX.Element } = {
  TbTruckDelivery: <TbTruckDelivery className="w-12 h-12 text-indigo-600" />,
  MdSupportAgent: <MdSupportAgent className="w-12 h-12 text-indigo-600" />,
  MdSecurity: <MdSecurity className="w-12 h-12 text-indigo-600" />,
  FaBoxOpen: <FaBoxOpen className="w-12 h-12 text-indigo-600" />
};

async function getFeatures() {
  const supabase = createServerClient();
  const { data: features } = await supabase
    .from('features')
    .select('*')
    .order('order_no');
  return features || [];
}

export default async function Features() {
  const features = await getFeatures();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Yılların deneyimi ve profesyonel kadromuzla eşyalarınızı güvenle taşıyoruz
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-4">
                {iconMap[feature.icon_name]}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 