import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL?.startsWith("postgres")
    ? process.env.DATABASE_URL
    : "postgres://postgres:postgres@localhost:5432/postgres";

  try {
    const pool = new Pool({ connectionString: dbUrl, connectionTimeoutMillis: 1000 });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.warn("Failed to initialize Prisma client:", error);
    const pool = new Pool({ connectionString: "postgres://postgres:postgres@localhost:5432/postgres", connectionTimeoutMillis: 1000 });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }
}

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = createPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prismaClient = global.prisma;
}

export const prisma = prismaClient;
export default prisma;
