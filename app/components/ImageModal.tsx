import { useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
    image: string;
    title: string;
    description?: string;
    onClose: () => void;
}

const ImageModal = ({ image, title, description, onClose }: ImageModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
             onClick={onClose}>
            <div className="relative max-w-5xl w-full h-[80vh] bg-white rounded-lg overflow-hidden"
                 onClick={e => e.stopPropagation()}>
                <button
                    className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                    onClick={onClose}
                >
                    ✕
                </button>
                <div className="relative w-full h-full">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        priority
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    {description && <p className="text-sm text-gray-200">{description}</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageModal; 