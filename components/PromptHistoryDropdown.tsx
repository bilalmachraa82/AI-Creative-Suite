import React, { useState, useEffect, useRef } from 'react';
import { getPromptsByTab, formatRelativeTime, clearPromptHistory, type PromptHistoryItem } from '../utils/promptHistory';

interface PromptHistoryDropdownProps {
    currentTab: string;
    onSelectPrompt: (prompt: string) => void;
}

export const PromptHistoryDropdown: React.FC<PromptHistoryDropdownProps> = ({ currentTab, onSelectPrompt }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<PromptHistoryItem[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load history when dropdown opens
        if (isOpen) {
            const prompts = getPromptsByTab(currentTab);
            setHistory(prompts);
        }
    }, [isOpen, currentTab]);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelectPrompt = (prompt: string) => {
        onSelectPrompt(prompt);
        setIsOpen(false);
    };

    const handleClearHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearPromptHistory();
        setHistory([]);
        setIsOpen(false);
    };

    if (history.length === 0 && !isOpen) {
        return null; // Don't show button if no history
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-slate-700 hover:border-slate-600 transition-all text-sm text-slate-300 hover:text-white"
                aria-label="Ver histórico de prompts"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden md:inline">Histórico</span>
                {history.length > 0 && (
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                        {history.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-96 max-w-[calc(100vw-2rem)] glass-card border border-slate-700 rounded-2xl shadow-2xl z-50 animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="font-semibold text-white">Prompts Recentes</h3>
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={handleClearHistory}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                            >
                                Limpar
                            </button>
                        )}
                    </div>

                    {/* History List */}
                    <div className="max-h-96 overflow-y-auto">
                        {history.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm">Nenhum prompt salvo ainda</p>
                                <p className="text-xs mt-1">Use prompts para começar</p>
                            </div>
                        ) : (
                            <div className="py-2">
                                {history.map((item, index) => (
                                    <button
                                        key={`${item.timestamp}-${index}`}
                                        onClick={() => handleSelectPrompt(item.text)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-700/30 transition-colors group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">
                                                    {item.text}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {formatRelativeTime(item.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Tip */}
                    {history.length > 0 && (
                        <div className="p-3 border-t border-slate-700 bg-slate-800/30">
                            <p className="text-xs text-slate-400 text-center">
                                💡 Clique num prompt para reutilizá-lo
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PromptHistoryDropdown;
