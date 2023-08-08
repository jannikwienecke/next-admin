import { PrismaClient } from "@prisma/client";

export const singleton = <Value>(
  name: string,
  valueFactory: () => Value
): Value => {
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};

// Hard-code a unique key, so we can look up the client when this module gets re-imported
let prisma = singleton("prisma", () => new PrismaClient());

prisma.$connect();

export { prisma };
