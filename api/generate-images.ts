import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Modality } from '@google/genai';
import { retryWithBackoff, RETRY_PRESETS } from '../utils/retryWithBackoff';

// Prompt configurations
const generationPrompts = [
    { id: "studio_white_background", prompt: "Uma foto de produto profissional deste item sobre um fundo branco, limpo e minimalista, com iluminação de estúdio suave." },
    { id: "lifestyle", prompt: "Uma foto de estilo de vida deste produto a ser utilizado num ambiente relevante e elegante, com profundidade de campo rasa." },
    { id: "male_model", prompt: "Uma imagem fotorrealista de um modelo masculino a usar este produto numa sessão de fotos profissional em estúdio." },
    { id: "female_model", prompt: "Uma imagem fotorrealista de uma modelo feminina a usar este produto numa sessão de fotos profissional ao ar livre." },
    { id: "closeup_texture", prompt: "Uma foto detalhada em close-up da textura e dos materiais deste produto, com iluminação lateral para realçar os detalhes." }
];

async function generateSingleImageWithPrompt(ai: GoogleGenAI, base64Data: string, mimeType: string, prompt: string): Promise<string> {
    return retryWithBackoff(
        async () => {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            const part = response.candidates[0].content.parts.find(p => p.inlineData);
            if (part && part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
            throw new Error('No image data found in response for photoshoot generation.');
        },
        RETRY_PRESETS.STANDARD
    );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { base64Data, mimeType } = req.body;

        if (!base64Data || !mimeType) {
            return res.status(400).json({ error: 'Missing base64Data or mimeType' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const imagePromises = generationPrompts.map(async (p) => {
            const imageUrl = await generateSingleImageWithPrompt(ai, base64Data, mimeType, p.prompt);
            return { src: imageUrl, id: p.id };
        });

        const images = await Promise.all(imagePromises);

        return res.status(200).json({ images });
    } catch (error: any) {
        console.error('Error generating images:', error);
        return res.status(500).json({
            error: error.message || 'Failed to generate images'
        });
    }
}
