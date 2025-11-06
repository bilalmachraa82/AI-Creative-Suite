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
        <div className="w-full flex flex-col gap-6 animate-fade-in max-w-5xl mx-auto">
            {showFilters && (
                <div className="sticky top-4 z-10 p-2 rounded-full glass-morphism self-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {availableFilters.map((filterId) => (
                            <button
                                key={filterId}
                                onClick={() => setActiveFilter(filterId)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
                                    activeFilter === filterId
                                        ? 'bg-indigo-500 text-white shadow-md'
                                        : 'bg-transparent text-slate-300 hover:bg-slate-700/50'
                                }`}
                            >
                                {getFilterLabel(filterId)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[100px] md:auto-rows-[200px]">
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
                        gridClass = 'col-span-2 md:col-span-4 row-span-2 md:row-span-4';
                    } else if (filteredImages.length === 2) {
                        gridClass = 'col-span-2 md:col-span-2 row-span-2 md:row-span-2';
                    }

                    return (
                        <div key={`${image.id}-${index}`} className={`relative group overflow-hidden rounded-2xl shadow-lg glass-morphism ${gridClass}`}>
                            <img src={image.src} alt={`Generated image ${image.id}`} className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center p-4">
                                <a 
                                   href={image.src} 
                                   download={`gerado-por-ia-${image.id}.png`} 
                                   className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 bg-white/20 backdrop-blur-sm text-white rounded-full p-3 shadow-lg hover:scale-110 hover:bg-white/30"
                                   aria-label="Download image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};