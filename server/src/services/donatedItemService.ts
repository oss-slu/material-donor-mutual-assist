import multer from 'multer';
import { storage } from "../configs/SMCloudStoreConfig";
import prisma from '../prismaClient'; 

export async function uploadToStorage(file: Express.Multer.File, filename: string): Promise<string> {
    const containerName = 'mdma-dev';
    await storage.putObject(containerName, filename, file.buffer, {
        'Content-Type': file.mimetype
    });
    return `${containerName}/${filename}`;
}

// extract file extension from MIME type
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
