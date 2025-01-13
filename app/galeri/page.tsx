import GalleryGrid from '../components/GalleryGrid';

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

export const metadata = {
    title: 'Galeri - Nakliyat Hizmetleri',
    description: 'Profesyonel nakliyat hizmetlerimizden örnek çalışmalar ve galeri.',
};

export default async function GalleryPage() {
    const galleryItems = await getGalleryItems();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Galeri</h1>
                    <p className="text-xl text-gray-600">Profesyonel nakliyat hizmetlerimizden örnekler</p>
                </div>

                <GalleryGrid items={galleryItems} />
            </div>
        </div>
    );
} 