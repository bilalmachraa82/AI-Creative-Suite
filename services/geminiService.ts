import { GoogleGenAI, Modality } from "@google/genai";

export interface GeneratedProductImage {
    src: string;
    id: string;
    favorite?: boolean;
}

// === PHOTOSHOOT SERVICE ===
export const generationPrompts = [
    { id: "studio_white_background", prompt: "Uma foto de produto profissional deste item sobre um fundo branco, limpo e minimalista, com iluminação de estúdio suave." },
    { id: "lifestyle", prompt: "Uma foto de estilo de vida deste produto a ser utilizado num ambiente relevante e elegante, com profundidade de campo rasa." },
    { id: "male_model", prompt: "Uma imagem fotorrealista de um modelo masculino a usar este produto numa sessão de fotos profissional em estúdio." },
    { id: "female_model", prompt: "Uma imagem fotorrealista de uma modelo feminina a usar este produto numa sessão de fotos profissional ao ar livre." },
    { id: "closeup_texture", prompt: "Uma foto detalhada em close-up da textura e dos materiais deste produto, com iluminação lateral para realçar os detalhes." }
];

export async function generateSingleImageWithPrompt(ai: GoogleGenAI, base64Data: string, mimeType: string, prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
        config: { responseModalities: [Modality.IMAGE] },
    });
    // Find the first part that is image data
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    if (part && part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error('No image data found in response for photoshoot generation.');
}

export const generateProductImages = async (base64Data: string, mimeType: string): Promise<GeneratedProductImage[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePromises = generationPrompts.map(async (p) => {
        const imageUrl = await generateSingleImageWithPrompt(ai, base64Data, mimeType, p.prompt);
        return { src: imageUrl, id: p.id };
    });
    return Promise.all(imagePromises);
};

// === IMAGE EDITING SERVICE ===
export const editImageWithPrompt = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
        config: { responseModalities: [Modality.IMAGE] },
    });
     const part = response.candidates[0].content.parts.find(p => p.inlineData);
    if (part && part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error('No image data found in response for image editing.');
};

// === TEXT-TO-IMAGE GENERATION SERVICE ===
export const generateImageFromText = async (prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: { numberOfImages: 1, aspectRatio: '1:1' },
    });
    const image = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${image}`;
};

// === VIDEO GENERATION SERVICE ===
export const generateVideoFromImage = async (base64Data: string, mimeType: string, prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
    // Veo requires a new instance to ensure the latest key is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: { imageBytes: base64Data, mimeType: mimeType },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio,
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error('Video generation failed or returned no URI.');
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

// === CONTENT GENERATION SERVICE ===
export const generateProductDescription = async (base64Data: string, mimeType: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Baseado na imagem deste produto, gera o seguinte conteúdo de marketing em Português (PT-PT). Formata a tua resposta em Markdown.
    
    **1. Descrição do Produto:** Um parágrafo cativante e detalhado (cerca de 50-70 palavras) que descreve o produto, o seu estilo, materiais e para quem se destina.
    
    **2. Publicação para Instagram:** Uma legenda curta e apelativa para uma publicação no Instagram. Inclui 3 a 5 hashtags relevantes.
    
    **3. Publicação para Twitter/X:** Um tweet conciso (menos de 280 caracteres) para promover o produto.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
    });
    return response.text;
};