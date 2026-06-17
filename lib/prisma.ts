import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only initialize adapter if DATABASE_URL is available (skip during build if not set)
let prismaClient: PrismaClient;

if (process.env.DATABASE_URL) {
  // If database URL is configured, use the appropriate adapter
  if (process.env.DATABASE_URL.includes("mysql://") || process.env.DATABASE_URL.includes("mariadb://")) {
    const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    prismaClient =
      globalForPrisma.prisma ??
      new PrismaClient({
        adapter,
        log: ["query"],
      });
  } else {
    // Default client for other providers
    prismaClient =
      globalForPrisma.prisma ??
      new PrismaClient({
        log: ["query"],
      });
  }
} else {
  // No DATABASE_URL available (e.g., during build) - create minimal client without adapter
  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: ["query"],
    });
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;
