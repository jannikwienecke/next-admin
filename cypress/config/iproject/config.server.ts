import { createServerView } from "../../../app/admin-ui/server/utils";
import { IProject } from "@prisma/client";

export default createServerView<IProject, "iProject">({
  model: "iProject",
  name: "iProject",
  crud: {
    read: {
      orderBy: {
        name: "asc",
      },
      labelKey: "name",
      relationalFields: {},
      mappings: {
        dateCreated: "date_created",
        dateUpdated: "date_modified",
      },
    },
  },
});
