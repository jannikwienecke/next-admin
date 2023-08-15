import {
  prismaLoader,
  prismaGenerateDataObject,
  prismaCreate,
  prismaDelete,
  prismaGetIdFieldType,
  prismaUpdate,
} from "./prisma";

export const pageLoader = prismaLoader;
export const generateDataObject = prismaGenerateDataObject;
export const getIdFieldType = prismaGetIdFieldType;

export const crud = {
  create: prismaCreate,
  delete: prismaDelete,
  update: prismaUpdate,
};
