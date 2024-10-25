require('dotenv').config();
const SMCloudStore = require('smcloudstore')

// connection options for Azure Blob Storage
const connection = {
    storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    storageAccessKey: process.env.AZURE_STORAGE_ACCESS_KEY
}

// Return an instance of the AzureStorageProvider class
export const storage = SMCloudStore.Create('azure-storage', connection)