import { TbTruckDelivery } from "react-icons/tb";
import { MdSupportAgent, MdSecurity } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { createServerClient } from '@/lib/supabase';

// İkon haritası
const iconMap: { [key: string]: JSX.Element } = {
  TbTruckDelivery: <TbTruckDelivery className="w-16 h-16 text-amber-500 group-hover:text-white transition-all duration-300" />,
  MdSupportAgent: <MdSupportAgent className="w-16 h-16 text-amber-500 group-hover:text-white transition-all duration-300" />,
  MdSecurity: <MdSecurity className="w-16 h-16 text-amber-500 group-hover:text-white transition-all duration-300" />,
  FaBoxOpen: <FaBoxOpen className="w-16 h-16 text-amber-500 group-hover:text-white transition-all duration-300" />
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
    <section className="py-24 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="text-amber-500 font-semibold text-lg mb-4 block">
            ÖZELLİKLERİMİZ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Yılların deneyimi ve profesyonel kadromuzla eşyalarınızı güvenle taşıyoruz.
            Her adımda yanınızdayız.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="group p-8 rounded-3xl bg-white border-2 border-amber-100 hover:border-white
                hover:bg-amber-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center">
                <div className="mb-6 p-4 bg-amber-50 rounded-2xl group-hover:bg-white/10 
                  transition-all duration-500">
                  {iconMap[feature.icon_name]}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white 
                  transition-colors duration-300 text-center">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 group-hover:text-white/90 transition-colors 
                  duration-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Hover efektlerini geliştirmek için stil tanımı */}
      <style>{`
        .group:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </section>
  );
} 