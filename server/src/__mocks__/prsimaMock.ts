// src/__mocks__/prismaMock.ts
export default {
    donor: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      }),
      findMany: jest.fn().mockResolvedValue([{
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      }]),
    },
  };
  