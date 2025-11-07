import React, { useCallback, useState } from 'react';

// Fix: Define ImageUploaderProps interface to resolve TypeScript error on line 3.
interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    previewUrl: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            simulateUpload(e.target.files[0]);
        }
    };

    const simulateUpload = (file: File) => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onImageUpload(file);
                    setTimeout(() => setUploadProgress(0), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 50);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            simulateUpload(e.dataTransfer.files[0]);
        }
    }, [onImageUpload]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    return (
        <div className="animate-fade-in">
            <label htmlFor="file-upload" className="block text-base font-semibold text-white mb-3 font-sora flex items-center gap-2">
                <span className="text-2xl">🖼️</span>
                Imagem de Origem
            </label>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={`
                    group relative flex justify-center items-center px-6 py-8
                    border-2 border-dashed rounded-2xl
                    transition-all duration-500
                    h-72 md:h-96 overflow-hidden cursor-pointer
                    hover-lift
                    ${isDragging
                        ? 'border-indigo-400 bg-indigo-500/20 scale-[1.02]'
                        : previewUrl
                            ? 'border-transparent'
                            : 'border-slate-700 hover:border-slate-600'
                    }
                `}
            >
                {/* Glass Background */}
                <div className="absolute inset-0 glass-card"></div>

                {/* Drag Wave Animation */}
                {isDragging && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 animate-pulse"
                             style={{
                                 background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.3), transparent 70%)',
                             }}
                        />
                        <div
                            className="absolute -inset-20 animate-spin"
                            style={{
                                background: 'conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.2), transparent)',
                                animationDuration: '3s'
                            }}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {previewUrl ? (
                        <div className="relative w-full h-full group">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-contain rounded-xl"
                            />
                            {/* Image Overlay with Actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                <label htmlFor="file-upload-replace" className="btn-primary cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        🔄 Alterar Imagem
                                    </span>
                                    <input
                                        id="file-upload-replace"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                        accept="image/png, image/jpeg, image/webp"
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 text-center max-w-sm">
                            {/* Upload Icon with Animation */}
                            <div className="relative mx-auto w-24 h-24">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-pulse"></div>
                                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10 animate-ping"></div>
                                <div className="relative flex items-center justify-center h-full">
                                    <svg
                                        className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="space-y-3">
                                <div className="flex justify-center text-base md:text-lg text-slate-300 font-medium">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-gradient-neon hover:opacity-80 transition-opacity">
                                        <span>Clique para carregar</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept="image/png, image/jpeg, image/webp"
                                        />
                                    </label>
                                    <p className="pl-2">ou arraste aqui</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                                    <span className="px-3 py-1 rounded-full glass-morphism">PNG</span>
                                    <span className="px-3 py-1 rounded-full glass-morphism">JPG</span>
                                    <span className="px-3 py-1 rounded-full glass-morphism">WEBP</span>
                                    <span className="px-3 py-1 rounded-full glass-morphism">até 10MB</span>
                                </div>
                            </div>

                            {/* Upload Progress */}
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full max-w-xs mx-auto">
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">{uploadProgress}% carregado</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};