import React from 'react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const features = [
        { emoji: "📸", name: "Photoshoot de Produto", description: "Crie 5 fotos profissionais a partir de uma única imagem do seu produto.", color: "from-purple-500 to-pink-500" },
        { emoji: "🚀", name: "Processamento em Lote", description: "Otimize dezenas de imagens de uma só vez e descarregue tudo num ZIP.", color: "from-cyan-500 to-blue-500" },
        { emoji: "✨", name: "Editar com IA", description: "Use comandos de texto para fazer edições mágicas nas suas fotos.", color: "from-amber-500 to-orange-500" },
        { emoji: "🎨", name: "Gerar Imagem", description: "Transforme as suas ideias em imagens únicas a partir de um simples texto.", color: "from-green-500 to-emerald-500" },
        { emoji: "🎬", name: "Gerar Vídeo", description: "Dê vida às suas imagens, criando um vídeo curto com animação.", color: "from-indigo-500 to-purple-500" },
        { emoji: "📝", name: "Gerar Conteúdo", description: "Crie descrições de produtos e legendas para redes sociais a partir de uma foto.", color: "from-rose-500 to-pink-500" },
    ];

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="glass-card rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 md:p-12 border-2 border-white/10 animate-bounce-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block mb-4">
                        <div className="text-6xl md:text-7xl animate-pulse">✨</div>
                    </div>
                    <h2 className="font-sora text-3xl md:text-5xl font-black text-gradient-aurora mb-4">
                        Bem-vindo ao AI Creative Suite!
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 font-organic max-w-xl mx-auto">
                        A sua nova ferramenta para produção de conteúdo criativo com IA de última geração
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
                    {features.map((feature, index) => (
                        <div
                            key={feature.name}
                            className="glass-card p-5 rounded-2xl hover-lift group cursor-default"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-4xl group-hover:scale-125 transition-transform duration-300">
                                    {feature.emoji}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white font-sora text-base md:text-lg mb-2">
                                        {feature.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mt-10 text-center">
                    <button
                        onClick={onClose}
                        className="btn-primary text-white font-bold py-4 px-10 rounded-2xl text-lg hover:scale-105 transition-transform"
                    >
                        🚀 Entendido, Vamos Criar!
                    </button>
                    <p className="text-xs text-slate-500 mt-4">
                        Dica: Esta mensagem não aparecerá novamente nesta sessão
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
