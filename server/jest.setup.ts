jest.mock('./src/prismaClient', () => {
    return {
        __esModule: true,
        default: require('./src/__mocks__/mockPrismaClient').default,
    };
});
