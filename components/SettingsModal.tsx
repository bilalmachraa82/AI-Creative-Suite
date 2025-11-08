import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Load existing key from localStorage
            const existingKey = localStorage.getItem('gemini_api_key');
            if (existingKey) {
                setApiKey(existingKey);
            }
        }
    }, [isOpen]);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose();
            }, 1500);
        }
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="glass-card rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-10 border-2 border-white/10 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-sora text-3xl font-black text-gradient mb-2">
                            ⚙️ Configurações
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Configure sua API key do Gemini para usar todas as funcionalidades
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Fechar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* API Key Section */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="api-key" className="block text-base font-semibold text-white mb-3 font-sora">
                            🔑 Gemini API Key
                        </label>
                        <div className="relative">
                            <input
                                id="api-key"
                                type={showKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Cole sua API key aqui..."
                                className="w-full glass-card border-2 border-slate-700 rounded-2xl p-4 text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                aria-label={showKey ? 'Ocultar' : 'Mostrar'}
                            >
                                {showKey ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="glass-card p-5 rounded-2xl border border-indigo-500/30">
                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <span className="text-lg">💡</span>
                            Como obter sua API Key
                        </h3>
                        <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                            <li>Acesse <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">ai.google.dev</a></li>
                            <li>Clique em "Get API Key" no topo da página</li>
                            <li>Faça login com sua conta Google</li>
                            <li>Crie um novo projeto ou selecione um existente</li>
                            <li>Copie a API key gerada e cole acima</li>
                        </ol>
                        <p className="text-xs text-slate-500 mt-3">
                            ⚠️ Sua API key é armazenada localmente no seu navegador e nunca é enviada para servidores externos.
                        </p>
                    </div>

                    {/* Privacy Note */}
                    <div className="flex items-start gap-3 text-sm text-slate-400 bg-slate-800/30 p-4 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div>
                            <p className="font-medium text-white mb-1">100% Seguro e Privado</p>
                            <p>Sua API key é armazenada apenas no seu navegador (localStorage). Nunca compartilhamos ou enviamos seus dados.</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSave}
                            disabled={!apiKey.trim()}
                            className="btn-primary flex-1 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saved ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Salvo!
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Salvar API Key
                                </>
                            )}
                        </button>
                        {apiKey && (
                            <button
                                onClick={handleClear}
                                className="btn-secondary text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Limpar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SettingsModal;
