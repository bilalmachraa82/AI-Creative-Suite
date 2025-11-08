import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
    onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
    const { theme, toggleTheme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };

        const timer = setInterval(() => setTime(new Date()), 1000);

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(timer);
        };
    }, []);

    const greeting = () => {
        const hour = time.getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 19) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <header className="relative py-8 md:py-12 overflow-hidden">
            {/* Action Buttons - Top Right */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full glass-card hover:scale-110 transition-all duration-300 hover:shadow-glow group"
                    aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                    title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                >
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 group-hover:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
                <button
                    onClick={onOpenSettings}
                    className="p-3 rounded-full glass-card hover:scale-110 transition-all duration-300 hover:shadow-glow group"
                    aria-label="Configurações"
                    title="Configurações"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            {/* Floating Orbs - 3D Effect */}
            <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 rounded-full opacity-20 blur-3xl animate-pulse"
                 style={{
                     background: 'linear-gradient(135deg, #667eea, #764ba2)',
                     transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                 }} />
            <div className="absolute bottom-10 right-10 w-40 h-40 md:w-56 md:h-56 rounded-full opacity-20 blur-3xl animate-pulse"
                 style={{
                     background: 'linear-gradient(135deg, #fa709a, #fee140)',
                     transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
                     animationDelay: '1s'
                 }} />

            <div className="container mx-auto px-4 text-center relative z-10">
                {/* Personalized Greeting */}
                <div className="animate-fade-in mb-4">
                    <span className="inline-block px-6 py-2 rounded-full glass-morphism text-sm md:text-base font-medium text-white">
                        ✨ {greeting()}, criador! {time.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {/* Main Title with 3D Transform */}
                <h1
                    className="font-sora text-4xl md:text-5xl lg:text-6xl font-black text-gradient-aurora tracking-tight mb-4 animate-bounce-in interactive-3d"
                    style={{
                        textWrap: 'balance',
                        textShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                        transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`
                    } as React.CSSProperties}
                >
                    AI Creative Suite
                </h1>

                {/* Subtitle with Shimmer Effect */}
                <p className="mt-3 text-base md:text-lg text-slate-300 max-w-3xl mx-auto font-organic leading-relaxed animate-fade-in"
                   style={{
                       textWrap: 'balance',
                       animationDelay: '0.2s'
                   } as React.CSSProperties}>
                    Sua ferramenta completa para criar <span className="text-gradient font-bold">imagens</span>, <span className="text-gradient font-bold">vídeos</span> e <span className="text-gradient font-bold">conteúdo profissional</span> com o poder da IA generativa.
                </p>

                {/* Feature Pills */}
                <div className="mt-4 flex flex-wrap justify-center gap-2 animate-fade-in"
                     style={{ animationDelay: '0.4s' }}>
                    {[
                        { icon: '🎨', text: 'Design Futurista', gradient: 'from-purple-500 to-pink-500' },
                        { icon: '🤖', text: 'IA Generativa', gradient: 'from-cyan-400 to-blue-500' },
                        { icon: '⚡', text: 'Ultra-Rápido', gradient: 'from-amber-400 to-orange-500' },
                        { icon: '🌍', text: '100% Acessível', gradient: 'from-green-400 to-emerald-500' }
                    ].map((feature, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs md:text-sm font-medium hover-lift cursor-default"
                            style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                        >
                            <span className="text-base md:text-lg">{feature.icon}</span>
                            <span className="text-white">{feature.text}</span>
                        </span>
                    ))}
                </div>

                {/* Decorative Line */}
                <div className="mt-6 flex justify-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    <div className="w-24 h-1 rounded-full" style={{
                        background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, #fa709a, transparent)'
                    }} />
                </div>
            </div>
        </header>
    );
};