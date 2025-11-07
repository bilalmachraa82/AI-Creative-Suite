import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

interface TextResultProps {
    content: string;
}

export const TextResult: React.FC<TextResultProps> = ({ content }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        if (content) {
            const parsedHtml = marked.parse(content) as string;
            setHtmlContent(parsedHtml);
        }
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-scale">
            <div className="mb-6 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gradient font-sora flex items-center justify-center gap-3">
                    <span className="text-3xl">📝</span>
                    Conteúdo Criado com IA
                </h3>
                <p className="text-slate-400 mt-2 font-organic">
                    Texto gerado e pronto para usar!
                </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-3xl">
                <div
                    className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-white prose-lg max-w-none text-left"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                <div className="mt-8 flex flex-wrap justify-center gap-3 pt-6 border-t border-slate-700">
                    <button
                        onClick={handleCopy}
                        className="btn-primary text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar Texto
                    </button>
                    <button
                        onClick={() => {
                            const blob = new Blob([content], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'conteudo-gerado-ia.md';
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="btn-secondary text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descarregar .md
                    </button>
                </div>
            </div>
        </div>
    );
};