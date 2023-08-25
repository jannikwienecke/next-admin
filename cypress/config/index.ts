import iStatus from "./istatus/config.client";
import iProject from "./iproject/config.client";
import task from "./task/config.client";

import iStatusServer from "./istatus/config.server";
import iProjectServer from "./iproject/config.server";
import taskServer from "./task/config.server";

export const clientConfig = {
  iStatus,
  iProject,
  task,
};

export const serverConfig = {
  iStatus: iStatusServer,
  iProject: iProjectServer,
  taskServer,
};
