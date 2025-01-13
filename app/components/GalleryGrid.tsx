"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { convertSupabaseImageUrl } from '@/lib/utils';

interface GalleryItem {
    id: string;
    title: string;
    image_url: string;
    description?: string;
    order_no: number;
}

interface GalleryGridProps {
    items: GalleryItem[];
    limit?: number;
}

const GalleryGrid = ({ items, limit }: GalleryGridProps) => {
    const displayItems = limit ? items.slice(0, limit) : items;
    const sortedItems = displayItems.sort((a, b) => a.order_no - b.order_no);

    useEffect(() => {
        const loadFancybox = async () => {
            NativeFancybox.bind("[data-fancybox]", {
                compact: false,
                idle: false,
                animated: true,
                showClass: "f-fadeIn",
                hideClass: "f-fadeOut",
                Toolbar: {
                    display: {
                        left: [],
                        middle: ["prev", "counter", "next"],
                        right: ["zoom", "slideshow", "fullscreen", "close"],
                    },
                },
                Thumbs: {
                    type: "classic",
                    showOnStart: true,
                },
            });
        };

        loadFancybox();

        return () => {
            NativeFancybox.destroy();
        };
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedItems.map((item) => {
                const proxyImageUrl = convertSupabaseImageUrl(item.image_url, 'public');
                const isPriority = item.order_no <= 3;

                return (
                    <a
                        key={item.id}
                        data-fancybox="gallery"
                        data-caption={`<h3 class="text-xl font-bold mb-2">${item.title}</h3>${item.description ? `<p class="text-sm text-gray-300">${item.description}</p>` : ''}`}
                        href={proxyImageUrl}
                        className="group relative aspect-square block overflow-hidden rounded-lg bg-gray-100"
                    >
                        <div className="relative h-full w-full">
                            <Image
                                src={proxyImageUrl}
                                alt={item.title}
                                fill
                                quality={75}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6NT87Pi45ODVFRkdGNjNPUFZXUE1MU0ZST0X/2wBDAR"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                {...(isPriority ? { priority: true } : { loading: 'lazy' })}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white text-xl font-semibold mb-2">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-white/90 text-sm line-clamp-2">{item.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
};

export default GalleryGrid; 