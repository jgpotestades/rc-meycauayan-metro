import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient; pool: pg.Pool }

// Use your environment variable file configuration string safely here
const connectionString = process.env.DATABASE_URL || "postgresql://dashboard_admin:secure_local_password@localhost:5432/dashboard_dev"

const pool = globalForPrisma.pool || new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
}