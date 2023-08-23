import { prisma } from "../../../app/db";

export const colorLoader = async () => {
  const colors = await prisma.color.findMany({
    orderBy: {
      name: "desc",
    },
  });
  return {
    data: colors,
  };
};
