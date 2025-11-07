import React, { useState, useMemo } from 'react';
import type { GeneratedProductImage } from '../services/geminiService';
import { generationPrompts } from '../services/geminiService';

interface GeneratedImagesGridProps {
    images: GeneratedProductImage[];
}

const filterLabels: { [key: string]: string } = {
    all: 'Todas',
    studio_white_background: 'Fundo Branco',
    lifestyle: 'Lifestyle',
    male_model: 'Modelo Masculino',
    female_model: 'Modelo Feminino',
    closeup_texture: 'Textura',
    edited: 'Editada',
    generated: 'Gerada'
};

const getFilterLabel = (id: string) => filterLabels[id] || id;

export const GeneratedImagesGrid: React.FC<GeneratedImagesGridProps> = ({ images }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Dynamically create filters based on the images present
    const availableFilters = useMemo(() => {
        const ids = new Set(images.map(img => img.id));
        return ['all', ...Array.from(ids)];
    }, [images]);

    const filteredImages = useMemo(() => {
        if (activeFilter === 'all') {
            return images;
        }
        return images.filter(image => image.id === activeFilter);
    }, [images, activeFilter]);

    // Only show filters if it was a "photoshoot" generation or any scenario with multiple distinct image types
    const showFilters = availableFilters.length > 2;

    if (images.length === 0) return null;

    return (
        <div className="w-full flex flex-col gap-8 animate-fade-in max-w-7xl mx-auto">
            {/* Header with Count and Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-gradient font-sora">
                        ✨ Imagens Geradas
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base mt-1 font-organic">
                        {filteredImages.length} {filteredImages.length === 1 ? 'resultado' : 'resultados'} prontos para download
                    </p>
                </div>

                {showFilters && (
                    <div className="glass-card p-2 rounded-2xl">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {availableFilters.map((filterId) => (
                                <button
                                    key={filterId}
                                    onClick={() => setActiveFilter(filterId)}
                                    className={`
                                        px-4 py-2 text-sm font-medium rounded-xl
                                        transition-all duration-300
                                        focus:outline-none
                                        ${activeFilter === filterId
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
                                            : 'bg-transparent text-slate-300 hover:bg-slate-700/50 hover:scale-105'
                                        }
                                    `}
                                >
                                    {getFilterLabel(filterId)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[140px] md:auto-rows-[200px]">
                {filteredImages.map((image, index) => {
                    // Dynamic class assignment for bento grid
                    let gridClass = 'col-span-1 md:col-span-1 row-span-1 md:row-span-1';
                     if (filteredImages.length >= 5) {
                        if (index === 0) gridClass = 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
                        else if (index === 1) gridClass = 'col-span-1 row-span-1 md:col-span-1 md:row-span-1';
                        else if (index === 2) gridClass = 'col-span-1 row-span-1 md:col-span-1 md:row-span-1';
                        else if (index === 3) gridClass = 'col-span-1 row-span-1 md:col-span-1 md:row-span-1';
                        else if (index === 4) gridClass = 'col-span-1 row-span-1 md:col-span-1 md:row-span-1';
                    } else if (filteredImages.length === 1) {
                        gridClass = 'col-span-2 md:col-span-4 row-span-3 md:row-span-4';
                    } else if (filteredImages.length === 2) {
                        gridClass = 'col-span-2 md:col-span-2 row-span-2 md:row-span-2';
                    }

                    return (
                        <div
                            key={`${image.id}-${index}`}
                            className={`
                                relative group overflow-hidden rounded-2xl
                                glass-card hover-lift cursor-pointer
                                transition-all duration-500
                                ${gridClass}
                            `}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={() => setSelectedImage(image.src)}
                        >
                            {/* Image */}
                            <img
                                src={image.src}
                                alt={`Generated image ${getFilterLabel(image.id)}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Info Badge */}
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-morphism text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                {getFilterLabel(image.id)}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(image.src);
                                    }}
                                    className="p-3 rounded-full glass-morphism text-white hover:bg-white/20 transition-all hover:scale-110"
                                    aria-label="Ampliar imagem"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </button>
                                <a
                                    href={image.src}
                                    download={`gerado-por-ia-${image.id}.png`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-3 rounded-full glass-morphism text-white hover:bg-white/20 transition-all hover:scale-110"
                                    aria-label="Download imagem"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                            </div>

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
                                <div
                                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-3 rounded-full glass-morphism text-white hover:bg-white/20 transition-all"
                        onClick={() => setSelectedImage(null)}
                        aria-label="Fechar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Ampliada"
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-fade-in-scale"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};