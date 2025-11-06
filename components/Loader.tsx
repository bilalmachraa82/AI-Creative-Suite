import React from 'react';

interface LoaderProps {
    isButtonLoader?: boolean;
    task?: string;
}

const getTaskMessage = (task?: string) => {
    switch(task) {
        case 'photoshoot':
            return 'A IA está a criar as suas fotos de produto...';
        case 'edit':
            return 'A aplicar as suas edições mágicas...';
        case 'generate':
            return 'A materializar a sua imaginação...';
        case 'video':
            return 'A gerar o seu vídeo...';
        case 'content':
            return 'A escrever conteúdo criativo...';
        default:
            return 'A processar o seu pedido...';
    }
}

export const Loader: React.FC<LoaderProps> = ({ isButtonLoader = false, task }) => {
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

    return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center p-4">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-l-transparent border-indigo-500 animate-spin"></div>
            </div>
            <p className="text-slate-200 font-medium text-lg font-sora">{getTaskMessage(task)}</p>
            <p className="text-slate-400 text-sm max-w-xs">
                {task === 'video' ? 'Isto pode demorar alguns minutos. Por favor, não feche esta janela.' : 'Isto pode demorar alguns momentos.'}
            </p>
        </div>
    );
};