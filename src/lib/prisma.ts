import { PrismaClient } from '@prisma/client'

let prismaInstance: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  if (prismaInstance) return prismaInstance

  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (url && authToken && url.startsWith('libsql://')) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaLibSql } = require('@prisma/adapter-libsql')
      const adapter = new PrismaLibSql({ url, authToken })
      prismaInstance = new PrismaClient({ adapter } as any)
    } catch (e) {
      console.error('Turso adapter error, using default PrismaClient:', e)
      prismaInstance = new PrismaClient()
    }
  } else {
    prismaInstance = new PrismaClient()
  }

  return prismaInstance
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    return (client as any)[prop]
  },
})
