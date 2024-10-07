const mockPrismaClient = {
    donor: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
};

export default mockPrismaClient;
