import GalleryGrid from '../components/GalleryGrid';
import { Metadata } from 'next';

async function getGalleryItems() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        
    const res = await fetch(`${baseUrl}/api/gallery`, {
        cache: 'no-store'
    });
    
    if (!res.ok) {
        throw new Error('Galeri verileri alınamadı');
    }
    
    return res.json();
}

export const metadata: Metadata = {
    title: 'Galeri - Nakliyat Hizmetleri',
    description: 'Profesyonel nakliyat hizmetlerimizden örnek çalışmalar ve galeri.',
};

export default async function GalleryPage() {
    const galleryItems = await getGalleryItems();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="relative py-16 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-5xl font-extrabold text-white mb-4">
                            Galeri
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                            Profesyonel nakliyat hizmetlerimizle gerçekleştirdiğimiz başarılı projelerden örnekler
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="grid grid-cols-1 gap-8 mb-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Çalışmalarımız
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Her bir proje, müşteri memnuniyeti ve profesyonel hizmet anlayışımızın bir göstergesidir.
                            </p>
                        </div>
                    </div>
                    
                    <GalleryGrid items={galleryItems} />
                </div>
            </div>
        </div>
    );
} 