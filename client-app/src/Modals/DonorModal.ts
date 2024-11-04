export interface Donor {
    id: number;
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    state: string;
    city: string;
    zipcode: string;
    emailOptIn: boolean;
}
