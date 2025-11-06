import React from 'react';

interface VideoResultProps {
    videoUrl: string;
}

export const VideoResult: React.FC<VideoResultProps> = ({ videoUrl }) => {
    return (
        <div className="w-full max-w-lg mx-auto animate-fade-in">
            <video
                key={videoUrl}
                controls
                autoPlay
                loop
                className="rounded-lg shadow-2xl w-full"
            >
                <source src={videoUrl} type="video/mp4" />
                O seu browser não suporta a tag de vídeo.
            </video>
        </div>
    );
};
