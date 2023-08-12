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
    crudEdit: "CRUD_EDIT";
    init: "INIT_STATE";
    searchChanged: "SEARCH_CHANGED";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "idle"
    | "ready"
    | "ready.crud"
    | "ready.crud.create"
    | "ready.crud.edit"
    | "ready.loading"
    | "ready.searching"
    | "ready.waiting"
    | {
        ready?:
          | "crud"
          | "loading"
          | "searching"
          | "waiting"
          | { crud?: "create" | "edit" };
      };
  tags: never;
}
