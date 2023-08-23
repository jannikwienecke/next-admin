import iStatus from "./istatus/config.client";
import iProject from "./iproject/config.client";
import tag from "./task/config.client";

import iStatusServer from "./istatus/config.server";
import iProjectServer from "./iproject/config.server";
import tagServer from "./task/config.server";

export const clientConfig = {
  iStatus,
  iProject,
  tag,
};

export const serverConfig = {
  iStatus: iStatusServer,
  iProject: iProjectServer,
  tag: tagServer,
};
