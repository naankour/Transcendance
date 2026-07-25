const { PrismaClient } = require('@prisma/client');
// const { PrismaPg } = require('@prisma/adapter-pg');
// const { Pool } = require('pg');

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

// const prisma = new PrismaClient({ adapter });

module.exports = prisma;