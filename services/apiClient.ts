/**
 * API Client for Frontend
 * Calls Vercel Serverless Functions instead of Gemini SDK directly
 */

export interface GeneratedProductImage {
    src: string;
    id: string;
    favorite?: boolean;
}

// API base URL - will be same domain in production
const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : '/api';

/**
 * Generate product photoshoot images
 */
export const generateProductImages = async (
    base64Data: string,
    mimeType: string
): Promise<GeneratedProductImage[]> => {
    const response = await fetch(`${API_BASE}/generate-images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Data, mimeType }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate product images');
    }

    const data = await response.json();
    return data.images;
};

/**
 * Edit image with prompt
 */
export const editImageWithPrompt = async (
    base64Data: string,
    mimeType: string,
    prompt: string
): Promise<string> => {
    const response = await fetch(`${API_BASE}/edit-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Data, mimeType, prompt }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to edit image');
    }

    const data = await response.json();
    return data.imageUrl;
};

/**
 * Generate image from text prompt
 */
export const generateImageFromText = async (prompt: string): Promise<string> => {
    const response = await fetch(`${API_BASE}/generate-image-text`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image from text');
    }

    const data = await response.json();
    return data.imageUrl;
};

/**
 * Generate video from image
 */
export const generateVideoFromImage = async (
    base64Data: string,
    mimeType: string,
    prompt: string,
    aspectRatio: '16:9' | '9:16'
): Promise<string> => {
    const response = await fetch(`${API_BASE}/generate-video`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Data, mimeType, prompt, aspectRatio }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate video');
    }

    const data = await response.json();
    // The API returns base64 video data, we need to convert to blob URL
    const byteCharacters = atob(data.videoData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'video/mp4' });
    return URL.createObjectURL(blob);
};

/**
 * Generate product description and marketing content
 */
export const generateProductDescription = async (
    base64Data: string,
    mimeType: string
): Promise<string> => {
    const response = await fetch(`${API_BASE}/generate-content`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Data, mimeType }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate content');
    }

    const data = await response.json();
    return data.content;
};
