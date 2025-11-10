import React, { useState } from 'react';

interface ExportOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    onExport: (format: 'png' | 'jpg' | 'webp', quality: number) => void;
}

export const ExportOptionsModal: React.FC<ExportOptionsModalProps> = ({
    isOpen,
    onClose,
    imageSrc,
    onExport,
}) => {
    const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');
    const [quality, setQuality] = useState(95);

    if (!isOpen) return null;

    const formatInfo = {
        png: {
            name: 'PNG',
            description: 'Sem perda de qualidade, suporta transparência',
            icon: '🖼️',
            size: '~3-5 MB',
            color: 'from-blue-500 to-cyan-500',
        },
        jpg: {
            name: 'JPG/JPEG',
            description: 'Ótima compressão, ideal para web',
            icon: '📸',
            size: '~500 KB',
            color: 'from-orange-500 to-red-500',
        },
        webp: {
            name: 'WebP',
            description: 'Formato moderno, menor tamanho',
            icon: '✨',
            size: '~300 KB',
            color: 'from-green-500 to-emerald-500',
        },
    };

    const handleExport = () => {
        onExport(format, quality);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="glass-card rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border-2 border-white/10 animate-bounce-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-sora text-2xl md:text-3xl font-bold text-gradient-aurora">
                                📥 Opções de Export
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Escolha o formato e qualidade ideais
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                            aria-label="Fechar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Preview */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 p-4">
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full glass-card text-xs font-semibold text-white">
                            Preview
                        </div>
                        <img
                            src={imageSrc}
                            alt="Preview"
                            className="w-full h-48 object-contain rounded-xl"
                        />
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label className="block text-base font-semibold text-white mb-3 font-sora">
                            Formato
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(Object.keys(formatInfo) as Array<'png' | 'jpg' | 'webp'>).map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => setFormat(fmt)}
                                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                                        format === fmt
                                            ? `border-indigo-500 bg-gradient-to-br ${formatInfo[fmt].color} bg-opacity-10 scale-105`
                                            : 'border-slate-700 hover:border-slate-600 hover:scale-105'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{formatInfo[fmt].icon}</span>
                                        <div>
                                            <div className="font-bold text-white">{formatInfo[fmt].name}</div>
                                            <div className="text-xs text-slate-400">{formatInfo[fmt].size}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {formatInfo[fmt].description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quality Slider (for JPG/WebP only) */}
                    {(format === 'jpg' || format === 'webp') && (
                        <div className="animate-fade-in">
                            <label className="block text-base font-semibold text-white mb-3 font-sora">
                                Qualidade: {quality}%
                            </label>
                            <div className="space-y-3">
                                <input
                                    type="range"
                                    min="60"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Menor tamanho</span>
                                    <span>Melhor qualidade</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                        <div className="flex items-start gap-3">
                            <div className="text-xl">💡</div>
                            <div>
                                <p className="text-sm font-semibold text-white mb-1">Dica</p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    <strong>PNG</strong> para imagens com transparência. <strong>JPG</strong>{' '}
                                    para fotos (menor tamanho). <strong>WebP</strong> para web moderna (melhor
                                    compressão).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-6 rounded-xl text-white font-semibold bg-slate-700 hover:bg-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex-1 py-3 px-6 rounded-xl text-white font-semibold btn-primary flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Exportar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportOptionsModal;
