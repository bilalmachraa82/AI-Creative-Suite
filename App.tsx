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
            <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
                {needsImage && <ImageUploader onImageUpload={handleImageUpload} previewUrl={sourceImage.previewUrl} />}
                {needsPrompt && (
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">Comando (Prompt)</label>
                        <textarea
                            id="prompt"
                            rows={3}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 transition glass-morphism"
                            placeholder={promptPlaceholders[activeTab] || ""}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                )}
                {activeTab === TABS[4] && ( // Aspect ratio for video
                     <div>
                        <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-300 mb-2">Proporção do Vídeo</label>
                        <select 
                            id="aspectRatio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 transition glass-morphism"
                        >
                            <option value="16:9">16:9 (Paisagem)</option>
                            <option value="9:16">9:16 (Retrato)</option>
                        </select>
                    </div>
                )}
            </div>
        );
    }
    
    const renderButton = () => {
        const buttonText: { [key: string]: string } = {
            [TABS[0]]: "Gerar Fotos",
            [TABS[2]]: "Aplicar Edição",
            [TABS[3]]: "Gerar Imagem",
            [TABS[4]]: "Gerar Vídeo",
            [TABS[5]]: "Gerar Conteúdo",
        };
        
        const isDisabled = isLoading || ( [TABS[0], TABS[2], TABS[5]].includes(activeTab) && !sourceImage.file) || ([TABS[2], TABS[3]].includes(activeTab) && !prompt) || (activeTab === TABS[4] && !sourceImage.file) ;

        if (activeTab === TABS[4] && !isVeoKeySelected) {
            return (
                 <div className="text-center">
                    <button onClick={handleSelectVeoKey} className="btn-primary text-white font-bold py-3 px-6 rounded-lg text-lg">
                        Selecionar Chave de API para Vídeo
                    </button>
                    <p className="text-xs text-slate-500 mt-2">
                        A geração de vídeo com Veo requer uma chave de API selecionada. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-300">Saber mais sobre faturação.</a>
                    </p>
                </div>
            )
        }

        return (
            <button
                onClick={handleGenerate}
                disabled={isDisabled}
                className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-lg flex items-center justify-center w-full max-w-xs mx-auto"
            >
                {isLoading ? <Loader isButtonLoader={true} /> : buttonText[activeTab]}
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
        <div className="min-h-screen text-white font-sans">
            <div 
                className={`fixed top-4 right-4 z-50 transition-all duration-300 ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            >
                <div className="glass-morphism rounded-lg p-4 text-white flex items-center gap-3 border-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{toast.message}</span>
                </div>
            </div>

            <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />
            <Header />
            <main className="container mx-auto px-4 pb-24">
                <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
                    <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={handleTabChange} />
                    {renderActiveTabContent()}
                </div>
            </main>
        </div>
    );
}

export default App;