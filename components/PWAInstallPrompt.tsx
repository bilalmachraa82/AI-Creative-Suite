import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Check if user hasn't dismissed before
            const dismissed = localStorage.getItem('pwa-install-dismissed');
            const dismissedDate = dismissed ? parseInt(dismissed) : 0;
            const daysSinceDismissed = (Date.now() - dismissedDate) / (1000 * 60 * 60 * 24);

            // Show prompt if never dismissed or dismissed more than 7 days ago
            if (!dismissed || daysSinceDismissed > 7) {
                setTimeout(() => setShowPrompt(true), 5000); // Show after 5 seconds
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowPrompt(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('PWA installed');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        setShowPrompt(false);
    };

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-96 z-50 animate-bounce-in">
            <div className="glass-card rounded-3xl shadow-2xl border-2 border-indigo-500/30 p-6 backdrop-blur-xl">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-700/50 transition-colors"
                    aria-label="Fechar"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-slate-400"
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

                {/* Icon */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
                        📱
                    </div>
                    <div className="flex-1">
                        <h3 className="font-sora text-xl font-bold text-white mb-1">
                            Instalar App
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Acesso rápido, trabalhe offline e receba notificações
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <span>Acesso instantâneo do desktop/homescreen</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <span>Funciona offline (modo avião)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <span>Mais rápido que no browser</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                    >
                        Agora não
                    </button>
                    <button
                        onClick={handleInstall}
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white btn-primary flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg"
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
                        Instalar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
