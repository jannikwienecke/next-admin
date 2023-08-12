"use client";

import { StateMachineProvider } from "./provider/state";
import { Test } from "./tets";

export const Content = () => {
  //   const { state, send } = useMachine();

  return (
    <>
      <StateMachineProvider>
        <Test />
      </StateMachineProvider>
    </>
  );
};
