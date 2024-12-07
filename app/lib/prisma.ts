import { PrismaClient } from "@prisma/client";

// Why This is Important:
// Avoiding Connection Overload: Prisma creates a new database connection every time a new instance of PrismaClient is created. By using a Singleton, you prevent multiple connections from being created, which could overwhelm your database.
// Hot Reloading in Development: In a development environment with hot reloading enabled, each reload could potentially create a new PrismaClient instance. Using the globalThis object allows you to persist the PrismaClient across reloads, avoiding excessive database connections.

const prismaClientSingleton = () => {
  return new PrismaClient();
};

//You extend globalThis to add a prismaGlobal property, which holds the single instance of PrismaClient. This ensures that even if your code is hot-reloaded in development or run multiple times in serverless environments, the same PrismaClient instance is reused.
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

//Here, you check whether the prismaGlobal property on globalThis already exists. If it does, the existing instance is used (globalThis.prismaGlobal). If it doesn’t exist yet, you invoke the prismaClientSingleton function to create a new PrismaClient instance.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

//In non-production environments (e.g., development), Prisma Client is assigned to the global object to prevent multiple instances from being created during hot reloading or multiple requests. In production, you might not need to store it globally, as hot reloading is typically disabled and a new instance can be created per server restart without performance issues.
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
