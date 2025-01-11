import Link from 'next/link';
import GalleryGrid from './GalleryGrid';

const galleryItems = [
    {
        id: 1,
        title: 'Ev Taşıma',
        image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b',
        order: 1
    },
    {
        id: 2,
        title: 'Ofis Taşıma',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
        order: 2
    },
    {
        id: 3,
        title: 'Paketleme',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f',
        order: 3
    },
    {
        id: 4,
        title: 'Depolama',
        image: 'https://images.unsplash.com/photo-1600573472591-ee6c563aabc0',
        order: 4
    },
    {
        id: 5,
        title: 'Şehirler Arası Nakliyat',
        image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
        order: 5
    },
    {
        id: 6,
        title: 'Uluslararası Nakliyat',
        image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3',
        order: 6
    }
];

const HomeGallery = () => {
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