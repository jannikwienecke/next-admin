import { createServerView } from "@/app/admin-ui/server/utils";
import { ColorInterface } from "./types";

// validation
// name of config cannot be used more than once
//  check that the name of server and client is the same
// if a field is a relational field -> validate

export default createServerView<ColorInterface, "color">({
  model: "color",
  name: "color",
  crud: {
    read: {
      // loader: colorLoader,
      orderBy: {
        name: "asc",
      },
      labelKey: "name",
      relationalFields: {},
    },
  },
});
