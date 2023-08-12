"use server";

import { prisma } from "../db";

export async function myAction() {
  console.log("myAction");
  return await prisma.tag.findMany();
}
