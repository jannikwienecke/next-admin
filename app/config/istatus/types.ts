import { Color, Tag } from "@prisma/client";

export type ColorInterface = {
  Tag: Tag;
} & Color;
