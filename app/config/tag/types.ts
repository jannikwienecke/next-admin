import { AcitivityTag, Color, Tag } from "@prisma/client";

export type TagInterface = {
  id: number;
  Color: string;
  AcitivityTag?: undefined;
} & Tag;
