import Link from 'next/link';
import GalleryGrid from './GalleryGrid';

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

const HomeGallery = async () => {
    const galleryItems = await getGalleryItems();

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Galeri</h2>
                    <p className="text-gray-600">Profesyonel nakliyat hizmetlerimizden örnekler</p>
                </div>
                
                <GalleryGrid items={galleryItems} limit={6} />
                
                <div className="text-center mt-8">
                    <Link href="/galeri" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        Tüm Galeriyi Görüntüle
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeGallery; 