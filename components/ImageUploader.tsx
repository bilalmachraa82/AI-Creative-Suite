import React, { useCallback, useState } from 'react';

// Fix: Define ImageUploaderProps interface to resolve TypeScript error on line 3.
interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    previewUrl: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageUpload(e.dataTransfer.files[0]);
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
        <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-2">
                Imagem de Origem
            </label>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={`group relative flex justify-center items-center px-6 pt-5 pb-6 border border-dashed rounded-xl transition-all duration-300 h-64 md:h-80 overflow-hidden ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700'}`}
            >
                <div className="absolute inset-0 glass-morphism opacity-50"></div>
                 <div className={`absolute bottom-0 left-0 w-full h-full transition-transform duration-300 ease-out ${isDragging ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="bg-indigo-500/20 h-full w-full animate-[wave_5s_cubic-bezier(0.36,0.45,0.63,0.53)_infinite]"></div>
                    <div className="bg-indigo-500/30 h-full w-full animate-[wave_7s_cubic-bezier(0.36,0.45,0.63,0.53)_infinite_reverse]"></div>
                </div>

                <div className="relative z-10">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="h-full w-full max-h-[280px] object-contain rounded-md" />
                    ) : (
                        <div className="space-y-2 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <div className="flex text-sm text-slate-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none px-1">
                                    <span>Carregue um ficheiro</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                                </label>
                                <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG, WEBP até 10MB</p>
                        </div>
                    )}
                </div>
                <style jsx>{`
                    @keyframes wave {
                        0% { transform: translateX(0) translateY(0) rotate(0deg); }
                        100% { transform: translateX(-50%) translateY(-50%) rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};