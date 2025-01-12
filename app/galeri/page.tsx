import GalleryGrid from '../components/GalleryGrid';

const galleryItems = [
    {
        id: 1,
        title: 'Ev Taşıma',
        image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b',
        description: 'Güvenli ve profesyonel ev taşıma hizmeti',
        order: 1
    },
    {
        id: 2,
        title: 'Ofis Taşıma',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
        description: 'İş kesintisiz ofis taşıma çözümleri',
        order: 2
    },
    {
        id: 3,
        title: 'Paketleme',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f',
        description: 'Özenli paketleme hizmeti',
        order: 3
    },
    {
        id: 4,
        title: 'Depolama',
        image: 'https://images.unsplash.com/photo-1719937206341-38a6392dfdef',
        description: 'Güvenli depolama çözümleri',
        order: 4
    },
    {
        id: 5,
        title: 'Şehirler Arası Nakliyat',
        image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
        description: 'Şehirler arası güvenli taşımacılık',
        order: 5
    },
    {
        id: 6,
        title: 'Uluslararası Nakliyat',
        image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3',
        description: 'Uluslararası nakliyat hizmetleri',
        order: 6
    },
    {
        id: 7,
        title: 'Özel Eşya Taşıma',
        image: 'https://images.unsplash.com/photo-1577897113292-3b95936e5206',
        description: 'Değerli eşyalarınız için özel taşıma',
        order: 7
    },
    {
        id: 8,
        title: 'Araç Taşıma',
        image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95',
        description: 'Araç taşıma hizmetleri',
        order: 8
    },
    {
        id: 9,
        title: 'Asansörlü Taşıma',
        image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64926',
        description: 'Asansörlü taşıma hizmeti',
        order: 9
    }
];

export const metadata = {
    title: 'Galeri - Nakliyat Hizmetleri',
    description: 'Profesyonel nakliyat hizmetlerimizden örnek çalışmalar ve galeri.',
};

export default function GalleryPage() {
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