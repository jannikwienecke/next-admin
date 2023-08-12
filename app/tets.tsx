"use client";

import { SomeMachineContext } from "./provider/state";

export const Test = () => {
  const [state, send] = SomeMachineContext.useActor();
  //   const count = SomeMachineContext.useSelector((state) => state.context.count);

  return <></>;
};
