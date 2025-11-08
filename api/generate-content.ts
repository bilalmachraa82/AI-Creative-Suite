import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { retryWithBackoff, RETRY_PRESETS } from '../utils/retryWithBackoff';

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

        const promptText = `
        Baseado na imagem deste produto, gera o seguinte conteúdo de marketing em Português (PT-PT). Formata a tua resposta em Markdown.

        **1. Descrição do Produto:** Um parágrafo cativante e detalhado (cerca de 50-70 palavras) que descreve o produto, o seu estilo, materiais e para quem se destina.

        **2. Publicação para Instagram:** Uma legenda curta e apelativa para uma publicação no Instagram. Inclui 3 a 5 hashtags relevantes.

        **3. Publicação para Twitter/X:** Um tweet conciso (menos de 280 caracteres) para promover o produto.
        `;

        const content = await retryWithBackoff(
            async () => {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-pro',
                    contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: promptText }] },
                });
                return response.text;
            },
            RETRY_PRESETS.STANDARD
        );

        return res.status(200).json({ content });
    } catch (error: any) {
        console.error('Error generating content:', error);
        return res.status(500).json({
            error: error.message || 'Failed to generate content'
        });
    }
}
