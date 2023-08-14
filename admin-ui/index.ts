import { prisma } from "@/app/db";
import { Prisma } from "@prisma/client";

export const PRODVIDER = {
  prisma: {
    client: prisma,
    schema: Prisma,
  },
};
