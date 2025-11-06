import React from 'react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const features = [
        { name: "Photoshoot de Produto", description: "Crie 5 fotos profissionais a partir de uma única imagem do seu produto." },
        { name: "Processamento em Lote", description: "Otimize dezenas de imagens de uma só vez e descarregue tudo num ZIP." },
        { name: "Editar com IA", description: "Use comandos de texto para fazer edições mágicas nas suas fotos." },
        { name: "Gerar Imagem", description: "Transforme as suas ideias em imagens únicas a partir de um simples texto." },
        { name: "Gerar Vídeo", description: "Dê vida às suas imagens, criando um vídeo curto com animação." },
        { name: "Gerar Conteúdo", description: "Crie descrições de produtos e legendas para redes sociais a partir de uma foto." },
    ];

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="glass-morphism rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border-none animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <h2 className="font-sora text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                        Bem-vindo ao AI Creative Suite!
                    </h2>
                    <p className="mt-3 text-lg text-slate-300">
                        A sua nova ferramenta para produção de conteúdo criativo.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {features.map(feature => (
                        <div key={feature.name} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                            <h3 className="font-bold text-white font-sora text-base">{feature.name}</h3>
                            <p className="text-sm text-slate-400 mt-1">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-lg"
                    >
                        Entendido, Vamos Criar!
                    </button>
                </div>
            </div>
        </div>
    );
};