import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from '../utils/fileUtils';
import { generationPrompts, generateSingleImageWithPrompt, GeneratedProductImage } from '../services/geminiService';
import { createZipAndDownload } from '../utils/zipUtils';

type FileStatus = 'queued' | 'processing' | 'completed' | 'error';

interface ProcessFile {
    id: string;
    file: File;
    previewUrl: string;
    status: FileStatus;
    generatedImages: GeneratedProductImage[];
}

const CONCURRENT_LIMIT = 4;

export const BatchProcessor: React.FC = () => {
    const [files, setFiles] = useState<ProcessFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: ProcessFile[] = acceptedFiles.map(file => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file,
            previewUrl: URL.createObjectURL(file),
            status: 'queued',
            generatedImages: [],
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
    });
    
    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };
    
    const clearAll = () => {
        files.forEach(f => URL.revokeObjectURL(f.previewUrl));
        setFiles([]);
        setIsProcessing(false);
    }

    const handleProcessing = async () => {
        setIsProcessing(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let filesToProcess = files.filter(f => f.status === 'queued' || f.status === 'error');

        const processFile = async (fileToProcess: ProcessFile) => {
            setFiles(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'processing' } : f));
            try {
                const base64 = await fileToBase64(fileToProcess.file);
                
                const imagePromises = generationPrompts.map(async (p) => {
                    const imageUrl = await generateSingleImageWithPrompt(ai, base64, fileToProcess.file.type, p.prompt);
                    return { src: imageUrl, id: p.id };
                });
                
                const images = await Promise.all(imagePromises);
                setFiles(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'completed', generatedImages: images } : f));
            } catch (err) {
                console.error(`Error processing ${fileToProcess.file.name}:`, err);
                setFiles(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'error' } : f));
            }
        };
        
        const worker = async () => {
            while(filesToProcess.length > 0) {
                const file = filesToProcess.shift();
                if(file) {
                    await processFile(file);
                }
            }
        };

        const workers = Array(CONCURRENT_LIMIT).fill(null).map(worker);
        await Promise.all(workers);

        setIsProcessing(false);
    };
    
    const processedCount = useMemo(() => files.filter(f => f.status === 'completed' || f.status === 'error').length, [files]);
    const progress = files.length > 0 ? (processedCount / files.length) * 100 : 0;
    
    const completedFiles = useMemo(() => files.filter(f => f.status === 'completed'), [files]);
    const canDownload = !isProcessing && completedFiles.length > 0;

    const handleDownload = () => {
        if (!canDownload) return;
        createZipAndDownload(completedFiles);
    };

    return (
        <div className="w-full flex flex-col gap-8 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white font-sora">Processamento em Lote</h2>
                <p className="text-slate-400 mt-2">Carregue várias imagens e a IA irá gerar um conjunto de fotos profissionais para cada uma.</p>
            </div>

            {!isProcessing && files.length === 0 && (
                <div {...getRootProps()} className={`cursor-pointer flex flex-col justify-center items-center p-10 border border-dashed rounded-xl transition-all duration-300 relative overflow-hidden ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700'}`}>
                    <div className="absolute inset-0 glass-morphism opacity-50"></div>
                    <input {...getInputProps()} />
                     <svg className="mx-auto h-12 w-12 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    <p className="mt-4 text-lg text-slate-300">Arraste e solte as suas imagens aqui</p>
                    <p className="text-slate-500">ou clique para selecionar ficheiros</p>
                </div>
            )}

            {files.length > 0 && (
                 <div className="space-y-6">
                    {/* --- CONTROLS --- */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={handleProcessing} disabled={isProcessing || files.length === 0} className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-lg flex items-center justify-center">
                            {isProcessing ? <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>A Processar...</span></> : `Iniciar Processamento (${files.length})`}
                        </button>
                         <button onClick={handleDownload} disabled={!canDownload} className="bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
                            Descarregar ZIP ({completedFiles.length})
                        </button>
                        <button onClick={clearAll} disabled={isProcessing} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
                            Limpar Tudo
                        </button>
                    </div>

                    {/* --- PROGRESS BAR --- */}
                    {isProcessing && (
                         <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-slate-300">Progresso Geral</span>
                                <span className="text-sm font-medium text-slate-300">{processedCount} de {files.length}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                                <div className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2.5 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                            </div>
                        </div>
                    )}
                    
                    {/* --- FILE LIST --- */}
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {files.map(f => (
                            <div key={f.id} className="glass-morphism p-3 rounded-lg flex items-center gap-4 transition-all">
                                <img src={f.previewUrl} alt={f.file.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-grow min-w-0">
                                     <p className="text-white font-medium truncate">{f.file.name}</p>
                                     <div className="flex items-center gap-2 text-sm">
                                        {f.status === 'queued' && <span className="text-slate-400">Na Fila</span>}
                                        {f.status === 'processing' && <span className="text-indigo-400 flex items-center"><svg className="animate-spin mr-1.5 h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" className="opacity-75"></path></svg>A Processar...</span>}
                                        {f.status === 'completed' && <span className="text-green-400">Concluído</span>}
                                        {f.status === 'error' && <span className="text-red-400">Erro</span>}
                                     </div>
                                </div>
                                <div className="flex flex-shrink-0 items-center gap-2 ml-auto">
                                    {f.status === 'completed' && f.generatedImages.map((img, i) => <img key={i} src={img.src} className="w-10 h-10 object-cover rounded-sm border border-slate-700" />)}
                                     {!isProcessing && <button onClick={() => removeFile(f.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}
        </div>
    );
};