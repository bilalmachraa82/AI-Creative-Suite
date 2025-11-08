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
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const imageUrl = await retryWithBackoff(
            async () => {
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: { numberOfImages: 1, aspectRatio: '1:1' },
                });
                const image = response.generatedImages[0].image.imageBytes;
                return `data:image/png;base64,${image}`;
            },
            RETRY_PRESETS.STANDARD
        );

        return res.status(200).json({ imageUrl });
    } catch (error: any) {
        console.error('Error generating image from text:', error);
        return res.status(500).json({
            error: error.message || 'Failed to generate image from text'
        });
    }
}
