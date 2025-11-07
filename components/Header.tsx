import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
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
        <header className="relative py-16 md:py-24 overflow-hidden">
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
                    className="font-sora text-5xl md:text-7xl lg:text-8xl font-black text-gradient-aurora tracking-tight mb-6 animate-bounce-in interactive-3d"
                    style={{
                        textWrap: 'balance',
                        textShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                        transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`
                    } as React.CSSProperties}
                >
                    AI Creative Suite
                </h1>

                {/* Subtitle with Shimmer Effect */}
                <p className="mt-6 text-lg md:text-2xl text-slate-300 max-w-4xl mx-auto font-organic leading-relaxed animate-fade-in"
                   style={{
                       textWrap: 'balance',
                       animationDelay: '0.2s'
                   } as React.CSSProperties}>
                    Sua ferramenta completa para criar <span className="text-gradient font-bold">imagens</span>, <span className="text-gradient font-bold">vídeos</span> e <span className="text-gradient font-bold">conteúdo profissional</span> com o poder da IA generativa.
                </p>

                {/* Feature Pills */}
                <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in"
                     style={{ animationDelay: '0.4s' }}>
                    {[
                        { icon: '🎨', text: 'Design Futurista', gradient: 'from-purple-500 to-pink-500' },
                        { icon: '🤖', text: 'IA Generativa', gradient: 'from-cyan-400 to-blue-500' },
                        { icon: '⚡', text: 'Ultra-Rápido', gradient: 'from-amber-400 to-orange-500' },
                        { icon: '🌍', text: '100% Acessível', gradient: 'from-green-400 to-emerald-500' }
                    ].map((feature, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm md:text-base font-medium hover-lift cursor-default"
                            style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                        >
                            <span className="text-xl">{feature.icon}</span>
                            <span className="text-white">{feature.text}</span>
                        </span>
                    ))}
                </div>

                {/* Decorative Line */}
                <div className="mt-12 flex justify-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    <div className="w-24 h-1 rounded-full" style={{
                        background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, #fa709a, transparent)'
                    }} />
                </div>
            </div>
        </header>
    );
};