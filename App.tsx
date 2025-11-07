import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { ImageUploader } from './components/ImageUploader';
import { Loader } from './components/Loader';
import { GeneratedImagesGrid } from './components/GeneratedImagesGrid';
import { VideoResult } from './components/VideoResult';
import { TextResult } from './components/TextResult';
import { BatchProcessor } from './components/BatchProcessor';
import { WelcomeModal } from './components/WelcomeModal';
import { fileToBase64 } from './utils/fileUtils';
import { 
    generateProductImages, 
    editImageWithPrompt, 
    generateImageFromText,
    generateVideoFromImage,
    generateProductDescription,
    GeneratedProductImage
} from './services/geminiService';

// Fix: Resolved a TypeScript error regarding subsequent property declarations for `window.aistudio`.
// The property must be of type `AIStudio`, so this change defines that interface
// and applies it to `window.aistudio` to ensure type compatibility.
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }
    interface Window {
        aistudio?: AIStudio;
    }
}

const TABS = ["Photoshoot de Produto", "Processamento em Lote", "Editar com IA", "Gerar Imagem", "Gerar Vídeo", "Gerar Conteúdo"];

type LoadingTask = 'photoshoot' | 'edit' | 'generate' | 'video' | 'content';
type AspectRatio = '16:9' | '9:16';
type ToastState = { show: boolean; message: string; type: 'error' | 'success' };

interface SourceImage {
    file: File | null;
    previewUrl: string;
    base64: string;
    mimeType: string;
}

function App() {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [sourceImage, setSourceImage] = useState<SourceImage>({ file: null, previewUrl: '', base64: '', mimeType: '' });
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTask, setLoadingTask] = useState<LoadingTask | null>(null);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'error' });

    const [generatedImages, setGeneratedImages] = useState<GeneratedProductImage[]>([]);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [textContent, setTextContent] = useState<string>('');
    
    const [isVeoKeySelected, setIsVeoKeySelected] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('ai-creative-suite-visited');
        if (!hasVisited) {
            setShowWelcome(true);
        }
    }, []);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '', type: 'error' });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (message: string, type: 'error' | 'success' = 'error') => {
        setToast({ show: true, message, type });
    };

    const handleWelcomeClose = () => {
        sessionStorage.setItem('ai-creative-suite-visited', 'true');
        setShowWelcome(false);
    }

    const resetState = useCallback(() => {
        setGeneratedImages([]);
        setVideoUrl('');
        setTextContent('');
    }, []);

    const handleTabChange = (tab: string) => {
        resetState();
        setSourceImage({ file: null, previewUrl: '', base64: '', mimeType: '' });
        setPrompt('');
        setActiveTab(tab);
    }
    
    const checkVeoKey = async () => {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            try {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsVeoKeySelected(hasKey);
            } catch (e) {
                console.error("Error checking for Veo API key:", e);
                setIsVeoKeySelected(true); // Assume key exists if check fails
            }
        } else {
            setIsVeoKeySelected(true);
        }
    };

    useEffect(() => {
        if (activeTab === 'Gerar Vídeo') {
            checkVeoKey();
        }
    }, [activeTab]);

    const handleSelectVeoKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            setIsVeoKeySelected(true); // Assume success to avoid race condition
        }
    };

    const handleImageUpload = useCallback(async (file: File) => {
        resetState();
        const previewUrl = URL.createObjectURL(file);
        try {
            const base64Data = await fileToBase64(file);
            setSourceImage({
                file,
                previewUrl,
                base64: base64Data,
                mimeType: file.type
            });
        } catch (error) {
            console.error("Error converting file to base64:", error);
            showToast("Não foi possível processar a imagem. Por favor, tente novamente.");
            setSourceImage({ file: null, previewUrl: '', base64: '', mimeType: '' });
        }
    }, [resetState]);

    const handleGenerate = async () => {
        if (isLoading) return;
        resetState();
        setIsLoading(true);
        
        try {
            switch (activeTab) {
                case TABS[0]: // Photoshoot
                    if (!sourceImage.base64) throw new Error("Por favor, carregue uma imagem.");
                    setLoadingTask('photoshoot');
                    const productImages = await generateProductImages(sourceImage.base64, sourceImage.mimeType);
                    setGeneratedImages(productImages);
                    break;
                case TABS[2]: // Edit
                    if (!sourceImage.base64) throw new Error("Por favor, carregue uma imagem.");
                    if (!prompt) throw new Error("Por favor, insira um comando de edição.");
                    setLoadingTask('edit');
                    const editedImage = await editImageWithPrompt(sourceImage.base64, sourceImage.mimeType, prompt);
                    setGeneratedImages([{ src: editedImage, id: 'edited' }]);
                    break;
                case TABS[3]: // Generate Image
                     if (!prompt) throw new Error("Por favor, insira um comando para gerar a imagem.");
                    setLoadingTask('generate');
                    const newImage = await generateImageFromText(prompt);
                    setGeneratedImages([{ src: newImage, id: 'generated' }]);
                    break;
                case TABS[4]: // Generate Video
                    if (!sourceImage.base64) throw new Error("Por favor, carregue uma imagem.");
                    setLoadingTask('video');
                    const url = await generateVideoFromImage(sourceImage.base64, sourceImage.mimeType, prompt, aspectRatio);
                    setVideoUrl(url);
                    break;
                case TABS[5]: // Generate Content
                    if (!sourceImage.base64) throw new Error("Por favor, carregue uma imagem.");
                    setLoadingTask('content');
                    const content = await generateProductDescription(sourceImage.base64, sourceImage.mimeType);
                    setTextContent(content);
                    break;
            }
        } catch (e: any) {
            console.error("API Error:", e);
            if (e.message?.includes("Requested entity was not found")) {
                 showToast("A chave de API não foi encontrada. Por favor, selecione uma chave de API válida.");
                 setIsVeoKeySelected(false);
            } else {
                 showToast(e.message || 'Ocorreu um erro desconhecido.');
            }
        } finally {
            setIsLoading(false);
            setLoadingTask(null);
        }
    };
    
    const renderInputs = () => {
        const needsImage = [TABS[0], TABS[2], TABS[4], TABS[5]].includes(activeTab);
        const needsPrompt = [TABS[2], TABS[3], TABS[4]].includes(activeTab);

        const promptPlaceholders: { [key: string]: string } = {
            [TABS[2]]: "Ex: 'Muda o fundo para uma praia tropical'",
            [TABS[3]]: "Ex: 'Um astronauta a andar de skate na lua, estilo cartoon'",
            [TABS[4]]: "Ex: 'Faz a câmara aproximar-se lentamente do objeto'"
        };

        return (
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
                {needsImage && <ImageUploader onImageUpload={handleImageUpload} previewUrl={sourceImage.previewUrl} />}
                {needsPrompt && (
                    <div className="animate-fade-in">
                        <label htmlFor="prompt" className="block text-base font-semibold text-white mb-3 font-sora flex items-center gap-2">
                            <span className="text-2xl">💭</span>
                            Comando (Prompt)
                        </label>
                        <div className="relative">
                            <textarea
                                id="prompt"
                                rows={4}
                                className="w-full glass-card border-2 border-slate-700 rounded-2xl p-4 md:p-5 text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none hover:border-slate-600"
                                placeholder={promptPlaceholders[activeTab] || ""}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-mono">
                                {prompt.length} caracteres
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === TABS[4] && ( // Aspect ratio for video
                     <div className="animate-fade-in">
                        <label htmlFor="aspectRatio" className="block text-base font-semibold text-white mb-3 font-sora flex items-center gap-2">
                            <span className="text-2xl">📐</span>
                            Proporção do Vídeo
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setAspectRatio('16:9')}
                                className={`
                                    glass-card p-6 rounded-2xl border-2 transition-all duration-300
                                    ${aspectRatio === '16:9'
                                        ? 'border-indigo-500 bg-indigo-500/10 scale-105'
                                        : 'border-slate-700 hover:border-slate-600 hover:scale-105'
                                    }
                                `}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-10 rounded border-2 border-current"></div>
                                    <div className="text-center">
                                        <div className="font-bold text-white">16:9</div>
                                        <div className="text-xs text-slate-400">Paisagem</div>
                                    </div>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAspectRatio('9:16')}
                                className={`
                                    glass-card p-6 rounded-2xl border-2 transition-all duration-300
                                    ${aspectRatio === '9:16'
                                        ? 'border-indigo-500 bg-indigo-500/10 scale-105'
                                        : 'border-slate-700 hover:border-slate-600 hover:scale-105'
                                    }
                                `}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-10 h-16 rounded border-2 border-current"></div>
                                    <div className="text-center">
                                        <div className="font-bold text-white">9:16</div>
                                        <div className="text-xs text-slate-400">Retrato</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    const renderButton = () => {
        const buttonConfig: { [key: string]: { text: string; icon: string } } = {
            [TABS[0]]: { text: "Gerar Fotos Profissionais", icon: "📸" },
            [TABS[2]]: { text: "Aplicar Edição Mágica", icon: "✨" },
            [TABS[3]]: { text: "Gerar Imagem Única", icon: "🎨" },
            [TABS[4]]: { text: "Gerar Vídeo Animado", icon: "🎬" },
            [TABS[5]]: { text: "Gerar Conteúdo Criativo", icon: "📝" },
        };

        const isDisabled = isLoading || ( [TABS[0], TABS[2], TABS[5]].includes(activeTab) && !sourceImage.file) || ([TABS[2], TABS[3]].includes(activeTab) && !prompt) || (activeTab === TABS[4] && !sourceImage.file) ;

        if (activeTab === TABS[4] && !isVeoKeySelected) {
            return (
                 <div className="text-center space-y-4 animate-fade-in">
                    <button onClick={handleSelectVeoKey} className="btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg hover:scale-105 transition-transform">
                        🔑 Selecionar Chave de API para Vídeo
                    </button>
                    <div className="glass-card p-4 rounded-xl max-w-md mx-auto">
                        <p className="text-sm text-slate-400 leading-relaxed">
                            A geração de vídeo com Veo requer uma chave de API selecionada.{' '}
                            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300">
                                Saber mais sobre faturação
                            </a>
                        </p>
                    </div>
                </div>
            )
        }

        const config = buttonConfig[activeTab];

        return (
            <button
                onClick={handleGenerate}
                disabled={isDisabled}
                className="btn-primary text-white font-bold py-4 px-10 rounded-2xl text-lg md:text-xl flex items-center justify-center gap-3 w-full max-w-md mx-auto hover:scale-105 transition-transform disabled:hover:scale-100"
            >
                {isLoading ? (
                    <Loader isButtonLoader={true} />
                ) : (
                    <>
                        <span className="text-2xl">{config?.icon}</span>
                        <span>{config?.text}</span>
                    </>
                )}
            </button>
        )
    }

    const renderResults = () => {
        if (isLoading) return <Loader task={loadingTask || undefined} />;
        // Error is now handled by the toast
        if (generatedImages.length > 0) return <GeneratedImagesGrid images={generatedImages} />;
        if (videoUrl) return <VideoResult videoUrl={videoUrl} />;
        if (textContent) return <TextResult content={textContent} />;
        // Empty state could go here
        return null;
    }
    
    const renderActiveTabContent = () => {
        if (activeTab === TABS[1]) {
            return <BatchProcessor />;
        }
        return (
            <>
                {renderInputs()}
                <div className="w-full text-center">
                    {renderButton()}
                </div>
                <div className="w-full flex justify-center mt-8">
                    {renderResults()}
                </div>
            </>
        )
    }

    return (
        <div className="min-h-screen text-white font-sans overflow-x-hidden">
            {/* Toast Notification */}
            <div
                className={`fixed top-6 right-6 z-50 transition-all duration-500 ${toast.show ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}`}
            >
                <div className={`glass-card rounded-2xl p-5 text-white flex items-center gap-4 border-2 shadow-2xl min-w-[320px] ${
                    toast.type === 'error' ? 'border-red-500/50' : 'border-green-500/50'
                }`}>
                    {toast.type === 'error' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span className="font-medium">{toast.message}</span>
                </div>
            </div>

            <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />
            <Header />
            <main className="container mx-auto px-4 pb-32">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 md:gap-12">
                    <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={handleTabChange} />
                    {renderActiveTabContent()}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 mt-16 border-t border-slate-800">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm font-organic">
                        Criado com 💜 usando Gemini AI • {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;