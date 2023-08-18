// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.invoke-action": {
      type: "done.invoke.invoke-action";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.invoke-action": {
      type: "error.platform.invoke-action";
      data: unknown;
    };
    "error.platform.invoke-delete-action": {
      type: "error.platform.invoke-delete-action";
      data: unknown;
    };
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
    crudCreate: "CRUD_CREATE";
    crudCreateRelational: "CRUD_CLICK_CREATE_RELATIONAL_VALUE";
    crudDelete: "CRUD_DELETE";
    crudEdit: "CRUD_EDIT";
    crudSave: "CRUD_SAVE";
    crudSaveError:
      | "error.platform.invoke-action"
      | "error.platform.invoke-delete-action";
    init: "INIT_STATE";
    resetToOriginForm: "CRUD_CANCEL" | "done.invoke.invoke-action";
    updateData: "UPDATE_DATA";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    "invoke-action": "CRUD_SAVE";
    "invoke-delete-action": "CRUD_DELETE";
  };
  matchesStates:
    | "idle"
    | "ready"
    | "ready.deleting"
    | "ready.loading"
    | "ready.searching"
    | "ready.showForm"
    | "ready.showForm.editing"
    | "ready.showForm.editing.showRelationalForm"
    | "ready.showForm.saving"
    | "ready.waiting"
    | {
        ready?:
          | "deleting"
          | "loading"
          | "searching"
          | "showForm"
          | "waiting"
          | {
              showForm?:
                | "editing"
                | "saving"
                | { editing?: "showRelationalForm" };
            };
      };
  tags: never;
}
