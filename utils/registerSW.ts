/**
 * Service Worker Registration Utility
 * Registers PWA service worker for offline functionality
 */

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            console.log('[SW] Service Worker registered successfully:', registration.scope);

            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available
                            console.log('[SW] New version available! Please refresh.');

                            // You could show a toast here asking user to refresh
                            if (confirm('Nova versão disponível! Recarregar agora?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                }
            });

            // Handle controller change (new SW activated)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('[SW] Controller changed, reloading...');
                window.location.reload();
            });

            return registration;
        } catch (error) {
            console.error('[SW] Service Worker registration failed:', error);
            return null;
        }
    } else {
        console.log('[SW] Service Worker not supported in this browser');
        return null;
    }
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        return registration.unregister();
    }
    return false;
};
