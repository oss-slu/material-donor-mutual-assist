import { Request } from 'supertest';

export const newItem = {
    itemType: 'Book',
    currentStatus: 'Received',
    programId: 1,
    donorId: 1,
    dateDonated: new Date().toISOString()
};

export const updateItem = {
    itemType: 'Updated Book',
    currentStatus: 'Received',
    programId: 1,
    donorId: 1,
    dateDonated: new Date().toISOString()
};

export const newItemFormData = (request: Request): Request => {
    return request
        .field('itemType', 'Book')
        .field('currentStatus', 'Received')
        .field('donorId', 1)
        .field('programId', 1)
        .field('dateDonated', new Date().toISOString())
};

export const invalidItemFormData = (request: Request): Request => {
    return request
        .field('itemType', 'computer')
        .field('currentStatus', 'Received')
        .field('donorId', 29)
        .field('programId', 234)
        .field('dateDonated', '2024-10-05')
};