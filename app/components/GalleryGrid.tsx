"use client";

import Image from 'next/image';
import { useState } from 'react';
import ImageModal from './ImageModal';

interface GalleryItem {
    id: number;
    title: string;
    image: string;
    description?: string;
    order: number;
}

interface GalleryGridProps {
    items: GalleryItem[];
    limit?: number;
}

const GalleryGrid = ({ items, limit }: GalleryGridProps) => {
    const [selectedImage, setSelectedImage] = useState<{
        image: string;
        title: string;
        description?: string;
    } | null>(null);

    const displayItems = limit ? items.slice(0, limit) : items;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayItems.sort((a, b) => a.order - b.order).map((item) => (
                    <div 
                        key={item.id} 
                        className="group bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer"
                        onClick={() => setSelectedImage({
                            image: item.image,
                            title: item.title,
                            description: item.description
                        })}
                    >
                        <div className="relative h-72">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-white text-xl font-semibold mb-2">{item.title}</h3>
                                    {item.description && <p className="text-white/90 text-sm">{item.description}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <ImageModal
                    image={selectedImage.image}
                    title={selectedImage.title}
                    description={selectedImage.description}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    );
};

export default GalleryGrid; 