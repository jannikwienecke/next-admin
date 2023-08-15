import { PRODVIDER } from "../..";
import { ModelSchema } from "./base-types";

const { schema } = PRODVIDER.prisma;

export const generateModelSchema = ({
  model,
}: {
  model: string;
}): ModelSchema => {
  const config = schema.dmmf.datamodel.models.find((prismaModel) => {
    return prismaModel.name.toLowerCase() === model.toLowerCase();
  });

  if (!config) {
    throw new Error(`generateModelSchema: Model ${model} not found`);
  }

  const modelSchema: ModelSchema = {
    columns:
      config?.fields.map((field, index) => {
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
