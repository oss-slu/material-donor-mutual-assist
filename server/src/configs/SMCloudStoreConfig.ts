require('dotenv').config();
const SMCloudStore = require('smcloudstore');

// connection options for Azure Blob Storage
const connection = {
    storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    storageAccessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
};

let instance: any = null;

// The Azure SDK validates the account name and key when the client is
// constructed, so building it at import time takes the whole server down when
// those values are missing or still placeholders — even for work that never
// touches blob storage. Construct it on first use instead, so an unconfigured
// blob store degrades file uploads rather than preventing startup.
function getStorage(): any {
    if (instance) return instance;

    if (!connection.storageAccount || !connection.storageAccessKey) {
        throw new Error(
            'Azure Blob Storage is not configured. Set AZURE_STORAGE_ACCOUNT_NAME ' +
                'and AZURE_STORAGE_ACCESS_KEY in your .env to use file uploads.',
        );
    }

    instance = SMCloudStore.Create('azure-storage', connection);
    return instance;
}

// Return an instance of the AzureStorageProvider class, created on first use.
export const storage: any = new Proxy(
    {},
    {
        get(_target, prop) {
            const client = getStorage();
            const value = client[prop];
            return typeof value === 'function' ? value.bind(client) : value;
        },
    },
);
