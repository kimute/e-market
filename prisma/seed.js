const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

(async () => {
    for (let i = 0; i < 30; i++) {
        await prisma.product.create({
            data: {
                price: 134134,
                description: '134134',
                title: '134134134',
                photo: '/goguma.jpg',
                createdAt: new Date(),
                user: {
                    connect: {
                        id: 1,
                    },
                },
            },
        });
    }
})();