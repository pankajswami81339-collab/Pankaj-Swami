// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: any;
}

let prismaInstance: any = null;
let isPrismaAvailable = false;

export function getPrismaClient(): any {
  if (prismaInstance) {
    return prismaInstance;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.info('ℹ️ [Prisma] DATABASE_URL not configured. Running in dual-mode (in-memory demo fallback active).');
    return null;
  }

  try {
    // Safe dynamic resolution for Prisma client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaModule: any = (globalThis as any).__prismaClientConstructor;
    if (prismaModule) {
      prismaInstance = global.prismaGlobal || new prismaModule();
      isPrismaAvailable = true;
      return prismaInstance;
    }
    return null;
  } catch (err: any) {
    console.warn('⚠️ [Prisma] Prisma client initialization notice:', err?.message || err);
    return null;
  }
}

export const prisma = getPrismaClient();
export { isPrismaAvailable };
