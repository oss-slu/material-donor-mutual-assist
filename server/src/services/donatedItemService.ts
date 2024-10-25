import multer from 'multer';
import { storage } from "../configs/SMCloudStoreConfig";

export async function uploadToAzure(file: Express.Multer.File, filename: string): Promise<string> {
    const containerName = 'mdma-dev';
    await storage.putObject(containerName, filename, file.buffer, {
        'Content-Type': file.mimetype
    });
    return `${containerName}/${filename}`;
}