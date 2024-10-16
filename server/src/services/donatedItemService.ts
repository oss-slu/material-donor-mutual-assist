import prisma from '../prismaClient'; 

// export async function validateDonatedItem(donatedItemId: number) {
//     // Check if donatedItemId is a valid number (integer)
//     if (isNaN(donatedItemId) || !Number.isInteger(donatedItemId)) {
//         throw new Error("Donated item ID must be an integer");
//     }
//     const donatedItem = await prisma.donatedItem.findUnique({
//         where: { id: donatedItemId },
//         include: {
//             donor: true,      
//             program: true,
//         }
//     });

//     if (!donatedItem) {
//         throw new Error(`Donated item with ID ${donatedItemId} not found`);
//     }
//     return donatedItem;
// }

export function validateDonatedItem(donatedItemId: number) {
    // Check if donatedItemId is a valid number (integer)
    if (isNaN(donatedItemId)) {
        return false;
    } else {
        return true;
    }
    
}
