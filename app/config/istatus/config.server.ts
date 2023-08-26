import { createServerView } from "@/app/admin-ui/server/utils";
import { IStatus } from "@prisma/client";

// validation
// name of config cannot be used more than once
//  check that the name of server and client is the same
// if a field is a relational field -> validate

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
