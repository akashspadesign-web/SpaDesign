import { PrismaClient } from "@prisma/client";

/**
 * In dev, Next.js's hot-reloader otherwise creates a new PrismaClient on every
 * request and exhausts SQLite connections. Cache the singleton on globalThis.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
