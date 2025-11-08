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
        const { base64Data, mimeType, prompt, aspectRatio } = req.body;

        if (!base64Data || !mimeType || !aspectRatio) {
            return res.status(400).json({ error: 'Missing base64Data, mimeType, or aspectRatio' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Initial video generation request with retry
        let operation = await retryWithBackoff(
            () => ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt || '',
                image: { imageBytes: base64Data, mimeType: mimeType },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio,
                }
            }),
            RETRY_PRESETS.GENTLE
        );

        // Polling with retry for each poll attempt
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
            operation = await retryWithBackoff(
                () => ai.operations.getVideosOperation({ operation: operation }),
                RETRY_PRESETS.FAST
            );
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error('Video generation failed or returned no URI.');
        }

        // Download video with retry
        const videoBlob = await retryWithBackoff(
            async () => {
                const videoResponse = await fetch(`${downloadLink}&key=${process.env.GEMINI_API_KEY}`);
                if (!videoResponse.ok) {
                    throw new Error(`Failed to download video: ${videoResponse.statusText}`);
                }
                return videoResponse.blob();
            },
            RETRY_PRESETS.STANDARD
        );

        // Convert blob to base64
        const buffer = await videoBlob.arrayBuffer();
        const base64Video = Buffer.from(buffer).toString('base64');

        return res.status(200).json({
            videoData: `data:video/mp4;base64,${base64Video}`
        });
    } catch (error: any) {
        console.error('Error generating video:', error);
        return res.status(500).json({
            error: error.message || 'Failed to generate video'
        });
    }
}

// Increase timeout for video generation (Vercel allows up to 60s on Hobby plan)
export const config = {
    maxDuration: 60,
};
