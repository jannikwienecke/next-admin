import { Prisma } from "@prisma/client";
import { ModelSchema, ModelType } from "./base-types";

export const generateModelSchema = ({
  model,
}: {
  model: ModelType;
}): ModelSchema => {
  const config = Prisma.dmmf.datamodel.models.find((prismaModel) => {
    return prismaModel.name === model;
  });

  if (!config) {
    throw new Error(`generateModelSchema: Model ${model} not found`);
  }

  const modelSchema: ModelSchema = {
    columns:
      config?.fields.map((field, index) => {
        // console.log({
        //   kind: field.kind,
        //   type: field.type,
        //   name: field.name,
        // });

        return {
          name: field.name,
          kind: field.kind,
          isRequired: field.isRequired,
          isUnique: field.isUnique,
          isId: field.isId,
          type: field.type,
          relationFromFields: field.relationFromFields || [],
        };
      }) || [],
  };
  return modelSchema;
};
