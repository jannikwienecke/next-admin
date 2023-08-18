import { PRODVIDER } from "../..";
import { ModelSchema } from "./base-types";

const { schema } = PRODVIDER.prisma;

export const generateModelSchema = ({
  model,
}: {
  model: string;
}): ModelSchema => {
  // const config = schema.dmmf.datamodel.models.find((prismaModel) => {
  //   return prismaModel.name.toLowerCase() === model.toLowerCase();
  // });

  // if (!config) {
  //   throw new Error(`generateModelSchema: Model ${model} not found`);
  // }

  const modelSchema: ModelSchema = schema.dmmf.datamodel.models.reduce(
    (prev, current) => {
      const cols = current.fields.map((field) => {
        return {
          name: field.name,
          kind: field.kind,
          isRequired: field.isRequired,
          isUnique: field.isUnique,
          isId: field.isId,
          type: field.type,
          relationFromFields: field.relationFromFields || [],
          isList: field.isList,
        };
      });

      return {
        ...prev,
        [current.name]: {
          columns: cols,
        },
      };
    },
    {} as ModelSchema
  );

  return modelSchema;
};
