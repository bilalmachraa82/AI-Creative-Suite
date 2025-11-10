import React from 'react';
import { keyboardShortcuts, type Shortcut } from '../utils/keyboardShortcuts';

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const shortcutsByCategory = keyboardShortcuts.getAllByCategory();

    const categoryIcons: Record<string, string> = {
        general: '⚡',
        images: '🖼️',
        navigation: '🧭',
        editing: '✨',
    };

    const categoryNames: Record<string, string> = {
        general: 'Geral',
        images: 'Imagens',
        navigation: 'Navegação',
        editing: 'Edição',
    };

    const renderShortcut = (shortcut: Shortcut) => {
        const formatted = keyboardShortcuts.formatShortcut(shortcut);

        return (
            <div
                key={formatted}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/30 transition-colors group"
            >
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {shortcut.description}
                </span>
                <div className="flex items-center gap-1">
                    {formatted.split('+').map((key, idx, arr) => (
                        <React.Fragment key={idx}>
                            <kbd className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-lg shadow-md min-w-[2rem] text-center">
                                {key}
                            </kbd>
                            {idx < arr.length - 1 && (
                                <span className="text-slate-500 text-xs mx-0.5">+</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="glass-card rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border-2 border-white/10 animate-bounce-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                                ⌨️
                            </div>
                            <div>
                                <h2 className="font-sora text-2xl md:text-3xl font-bold text-gradient-aurora">
                                    Atalhos de Teclado
                                </h2>
                                <p className="text-slate-400 text-sm mt-0.5">
                                    Trabalhe mais rápido com power user shortcuts
                                </p>
                            </div>
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
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                    {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => {
                        if (shortcuts.length === 0) return null;

                        return (
                            <div key={category} className="mb-8 last:mb-0">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl">{categoryIcons[category]}</span>
                                    <h3 className="text-lg font-bold text-white font-sora">
                                        {categoryNames[category]}
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent ml-3"></div>
                                </div>
                                <div className="space-y-2">
                                    {shortcuts.map((shortcut) => renderShortcut(shortcut))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Tip */}
                    <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">💡</div>
                            <div>
                                <p className="text-sm font-semibold text-white mb-1">
                                    Dica Pro
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Pressione <kbd className="px-2 py-0.5 text-xs bg-slate-700 rounded">?</kbd> a
                                    qualquer momento para ver esta janela. Os atalhos funcionam em toda a aplicação
                                    exceto quando estiver a escrever em campos de texto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/30">
                    <p className="text-xs text-slate-400 text-center">
                        Pressione <kbd className="px-2 py-0.5 text-xs bg-slate-700 rounded mx-1">ESC</kbd> para
                        fechar
                    </p>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
