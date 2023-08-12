import { createActorContext } from "@xstate/react";
import { createMachine } from "xstate";
import { adminMachine } from "./machine";

export const SomeMachineContext = createActorContext(adminMachine);

export const StateMachineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <SomeMachineContext.Provider>{children}</SomeMachineContext.Provider>;
};
