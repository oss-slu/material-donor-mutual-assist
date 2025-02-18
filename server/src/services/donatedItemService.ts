import multer from 'multer';
import { storage } from '../configs/SMCloudStoreConfig';
import prisma from '../prismaClient';
import { Readable } from 'stream';

export async function uploadToStorage(
    file: Express.Multer.File,
    filename: string,
): Promise<string> {
    const containerName = 'mdma-dev';
    await storage.putObject(containerName, filename, file.buffer, {
        'Content-Type': file.mimetype,
    });
    return `${containerName}/${filename}`;
}

export const fetchImagesFromCloud = async (imageUrls: string[]) => {
    const encodedImages = await Promise.all(
        imageUrls.map(imageUrl => fetchImageFromCloud(imageUrl)),
    );
    return encodedImages.filter((e): e is string => e !== null);
};

// const fetchImageFromCloud = async (url: string): Promise<string | null> => {
//     try {
//         console.log('Fetching image', url);
//         const url_chunks = url.split('/');
//         const containerName = url_chunks[0];
//         const fileName = url_chunks[1];
//         const stream = await storage.getObject(containerName, fileName);
//         const base64Image = await streamToBase64(stream);
//         return base64Image;
//     } catch (error) {
//         console.error('Failed to fetch or encode image:', error);
//         return null;
//     }
// };
const fetchImageFromCloud = async (url: string): Promise<string | null> => {
    try {
        console.log('Fetching image', url);
        const url_chunks = url.split('/');
        const containerName = url_chunks[0];
        const fileName = url_chunks[1];
        // Fetch image and get stream
        const stream = await storage.getObject(containerName, fileName);
        const base64Image = await streamToBase64(stream);
      
        if (!base64Image) {
            return null;
        }
        // Determine the mime type of the image
        const mimeType = getMimeType(fileName); // Update to detect the mime type based on file extension
        // return `data:${mimeType};base64,${base64Image}`;
        return `data:image/jpeg;base64,${base64Image}`;
    } catch (error) {
        console.error('Failed to fetch or encode image:', error);
        return null;
    }
};
const getMimeType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        default:
            return 'image/jpeg';  // Default MIME type
    }
};


const streamToBase64 = (stream: Readable): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const base64 = buffer.toString('base64');
            resolve(base64);
        });
        stream.on('error', error => {
            console.error('Stream error:', error);
            resolve(null); // Resolve with null in case of an error
        });
    });
};

//extract file extension from MIME type
export function getFileExtension(mimeType: string) {
    switch (mimeType) {
        case 'image/jpeg':
            return '.jpeg';
        case 'image/png':
            return '.png';
        case 'image/gif':
            return '.gif';
        default:
            return '.jpg';
    }
}


export function validateDonatedItem(donatedItemId: number) {
    // Check if donatedItemId is a valid number (integer)
    if (isNaN(donatedItemId)) {
        return false;
    } else {
        return true;
    }
}
