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

    return (
        <div 
            className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-white glass-morphism p-6 rounded-lg w-full max-w-2xl text-left animate-fade-in"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};