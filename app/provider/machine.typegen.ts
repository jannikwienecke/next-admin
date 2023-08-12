// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    init: "INIT_STATE";
    searchChanged: "SEARCH_CHANGED";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "idle"
    | "ready"
    | "ready.loading"
    | "ready.searching"
    | "ready.waiting"
    | { ready?: "loading" | "searching" | "waiting" };
  tags: never;
}
