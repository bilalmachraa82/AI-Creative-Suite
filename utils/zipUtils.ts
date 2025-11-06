import JSZip from 'jszip';
import type { GeneratedProductImage } from '../services/geminiService';

interface ProcessedFile {
    file: { name: string };
    generatedImages: GeneratedProductImage[];
}

// Helper to convert data URI to blob
function dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

export const createZipAndDownload = async (processedFiles: ProcessedFile[]): Promise<void> => {
    const zip = new JSZip();

    processedFiles.forEach(processedFile => {
        // Create a folder for each original image
        const originalName = processedFile.file.name;
        const cleanName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const folder = zip.folder(`${cleanName}_photoshoot`);

        if (folder) {
            processedFile.generatedImages.forEach((genImage, index) => {
                const blob = dataURItoBlob(genImage.src);
                const fileExtension = blob.type.split('/')[1] || 'png';
                // Use the id from the image object for a descriptive filename
                const promptId = genImage.id || `image_${index + 1}`;
                const fileName = `${String(index + 1).padStart(2, '0')}_${promptId}.${fileExtension}`;
                folder.file(fileName, blob);
            });
        }
    });

    // Generate the zip file and trigger download
    try {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `AI_Photoshoot_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error creating ZIP file:", error);
        alert("Ocorreu um erro ao criar o ficheiro ZIP.");
    }
};