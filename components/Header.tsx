import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
                <h1 className="font-sora text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-indigo-400 tracking-tight" style={{textWrap: 'balance'} as React.CSSProperties}>
                    AI Creative Suite
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto" style={{textWrap: 'balance'} as React.CSSProperties}>
                    A sua ferramenta completa para criar imagens, vídeos e conteúdo profissional com o poder da IA.
                </p>
            </div>
        </header>
    );
};