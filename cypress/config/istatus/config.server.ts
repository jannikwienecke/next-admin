import { IStatus } from "@prisma/client";
import { createServerView } from "../../../app/admin-ui/server/utils";

export default createServerView<IStatus, "iStatus">({
  model: "iStatus",
  name: "iStatus",
  crud: {
    read: {
      // loader: colorLoader,
      orderBy: {
        label: "asc",
      },
      labelKey: "label",
      relationalFields: {},
    },
  },
});
