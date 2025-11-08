import React from 'react';

interface VideoResultProps {
    videoUrl: string;
}

export const VideoResult: React.FC<VideoResultProps> = ({ videoUrl }) => {
    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in-scale">
            <div className="mb-6 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gradient font-sora flex items-center justify-center gap-3">
                    <span className="text-3xl">🎬</span>
                    Vídeo Gerado com Sucesso!
                </h3>
                <p className="text-slate-400 mt-2 font-organic">
                    Seu vídeo está pronto. Clique para descarregar.
                </p>
            </div>
            <div className="glass-card p-4 md:p-6 rounded-3xl hover-lift">
                <video
                    key={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="rounded-2xl shadow-2xl w-full"
                >
                    <source src={videoUrl} type="video/mp4" />
                    O seu browser não suporta a tag de vídeo.
                </video>
                <div className="mt-4 flex justify-center gap-3">
                    <a
                        href={videoUrl}
                        download="video-gerado-ia.mp4"
                        className="btn-primary text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descarregar Vídeo
                    </a>
                </div>
            </div>
        </div>
    );
};


export default VideoResult;
