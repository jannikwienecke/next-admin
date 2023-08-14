import { createActorContext } from "@xstate/react";
import { createMachine } from "xstate";
import { adminMachine } from "./machine";
import { useAdmin } from "./hooks";
import React from "react";

export const SomeMachineContext = createActorContext(adminMachine);

export const StateMachineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <SomeMachineContext.Provider>{children}</SomeMachineContext.Provider>;
};

const StateContext = React.createContext<ReturnType<typeof useAdmin>>(
  {} as ReturnType<typeof useAdmin>
);

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const admin = useAdmin();

  return (
    <StateContext.Provider value={admin}>{children}</StateContext.Provider>
  );
};

export const useAdminState = () => {
  const state = React.useContext(StateContext);

  if (!state) {
    throw new Error("useAdminState must be used within a StateProvider");
  }

  return state;
};
