import React, { useState, useMemo } from 'react';
import { PROMPT_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByTab, type PromptTemplate } from '../data/promptTemplates';

interface PromptTemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (prompt: string) => void;
    currentTab: string;
}

export const PromptTemplatesModal: React.FC<PromptTemplatesModalProps> = ({
    isOpen,
    onClose,
    onSelectTemplate,
    currentTab
}) => {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Get templates filtered by current tab
    const availableTemplates = useMemo(() => {
        return getTemplatesByTab(currentTab);
    }, [currentTab]);

    // Get categories that have templates for current tab
    const availableCategories = useMemo(() => {
        const categoryIds = new Set(availableTemplates.map(t => t.category));
        return TEMPLATE_CATEGORIES.filter(cat => categoryIds.has(cat.id));
    }, [availableTemplates]);

    // Filter templates by category and search
    const filteredTemplates = useMemo(() => {
        let templates = availableTemplates;

        // Filter by category
        if (activeCategory !== 'all') {
            templates = templates.filter(t => t.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            templates = templates.filter(t =>
                t.title.toLowerCase().includes(query) ||
                t.prompt.toLowerCase().includes(query)
            );
        }

        return templates;
    }, [availableTemplates, activeCategory, searchQuery]);

    const handleSelectTemplate = (template: PromptTemplate) => {
        onSelectTemplate(template.prompt);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="glass-card rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden border-2 border-white/10 animate-bounce-in flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-sora text-2xl md:text-3xl font-bold text-gradient-aurora">
                                📚 Biblioteca de Templates
                            </h2>
                            <p className="text-slate-400 mt-1 text-sm">
                                {availableTemplates.length} templates profissionais prontos para usar
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                            aria-label="Fechar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Pesquisar templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full glass-card border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="px-6 pt-4 pb-2 border-b border-slate-700 overflow-x-auto">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`
                                px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                                transition-all duration-300
                                ${activeCategory === 'all'
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                    : 'glass-card text-slate-300 hover:bg-slate-700/50'
                                }
                            `}
                        >
                            ✨ Todos ({availableTemplates.length})
                        </button>
                        {availableCategories.map(category => {
                            const count = availableTemplates.filter(t => t.category === category.id).length;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`
                                        px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                                        transition-all duration-300
                                        ${activeCategory === category.id
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                            : 'glass-card text-slate-300 hover:bg-slate-700/50'
                                        }
                                    `}
                                >
                                    {category.name} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-slate-400 text-lg">Nenhum template encontrado</p>
                            <p className="text-slate-500 text-sm mt-2">Tente ajustar a pesquisa ou categoria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTemplates.map((template, index) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template)}
                                    className="glass-card p-5 rounded-2xl hover-lift text-left group transition-all duration-300 hover:border-indigo-500/50 border border-transparent"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                                            {template.icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">
                                                {template.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors">
                                        {template.prompt}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            Clique para usar
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/30">
                    <p className="text-xs text-slate-400 text-center">
                        💡 Dica: Pode editar o template depois de selecionar para personalizá-lo
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PromptTemplatesModal;
