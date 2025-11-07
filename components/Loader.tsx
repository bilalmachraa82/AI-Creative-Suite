import React, { useEffect, useState } from 'react';

interface LoaderProps {
    isButtonLoader?: boolean;
    task?: string;
}

const getTaskMessage = (task?: string) => {
    switch(task) {
        case 'photoshoot':
            return { message: 'A IA está a criar as suas fotos de produto...', emoji: '📸', color: '#667eea' };
        case 'edit':
            return { message: 'A aplicar as suas edições mágicas...', emoji: '✨', color: '#764ba2' };
        case 'generate':
            return { message: 'A materializar a sua imaginação...', emoji: '🎨', color: '#fa709a' };
        case 'video':
            return { message: 'A gerar o seu vídeo...', emoji: '🎬', color: '#4facfe' };
        case 'content':
            return { message: 'A escrever conteúdo criativo...', emoji: '📝', color: '#00f2fe' };
        default:
            return { message: 'A processar o seu pedido...', emoji: '🤖', color: '#667eea' };
    }
}

export const Loader: React.FC<LoaderProps> = ({ isButtonLoader = false, task }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    if (isButtonLoader) {
        return (
             <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>A processar...</span>
            </>
        )
    }

    const taskInfo = getTaskMessage(task);

    return (
        <div className="flex flex-col items-center justify-center space-y-8 text-center p-8 animate-fade-in-scale">
            {/* Animated Loader with Multiple Rings */}
            <div className="relative w-32 h-32">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-800/30"></div>

                {/* Middle Ring - Gradient */}
                <div
                    className="absolute inset-2 rounded-full border-4 border-transparent animate-spin"
                    style={{
                        borderTopColor: taskInfo.color,
                        borderRightColor: taskInfo.color,
                        animationDuration: '1.5s'
                    }}
                />

                {/* Inner Ring - Reverse */}
                <div
                    className="absolute inset-6 rounded-full border-4 border-transparent animate-spin"
                    style={{
                        borderBottomColor: taskInfo.color,
                        borderLeftColor: taskInfo.color,
                        animationDuration: '2s',
                        animationDirection: 'reverse'
                    }}
                />

                {/* Center Glow */}
                <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                        background: `radial-gradient(circle, ${taskInfo.color}20, transparent 70%)`,
                        animationDuration: '2s'
                    }}
                />

                {/* Emoji Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl animate-bounce" style={{ animationDuration: '1s' }}>
                        {taskInfo.emoji}
                    </span>
                </div>
            </div>

            {/* Message with Shimmer Effect */}
            <div className="space-y-3 max-w-md">
                <p className="text-slate-100 font-semibold text-xl md:text-2xl font-sora">
                    {taskInfo.message}
                    <span className="inline-block w-12 text-left">{dots}</span>
                </p>

                <p className="text-slate-400 text-sm md:text-base font-organic">
                    {task === 'video'
                        ? '🎥 Isto pode demorar alguns minutos. Por favor, não feche esta janela.'
                        : '⚡ Processando com a velocidade da luz...'}
                </p>

                {/* Progress Indicator */}
                <div className="mt-6 w-full max-w-xs mx-auto">
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full animate-pulse"
                            style={{
                                background: `linear-gradient(90deg, transparent, ${taskInfo.color}, transparent)`,
                                animation: 'shimmer 2s linear infinite'
                            }}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
};