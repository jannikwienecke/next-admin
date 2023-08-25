// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.invoke-action": {
      type: "done.invoke.invoke-action";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.invoke-get-single-record": {
      type: "done.invoke.invoke-get-single-record";
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
    "error.platform.invoke-get-single-record": {
      type: "error.platform.invoke-get-single-record";
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
    commandBarActionFired: "COMMAND_BAR_ACTION_FIRED";
    crudCreate: "CRUD_CREATE";
    crudCreateRelational: "CRUD_CLICK_CREATE_RELATIONAL_VALUE";
    crudDelete: "CRUD_DELETE";
    crudEdit: "CRUD_EDIT";
    crudReadError: "error.platform.invoke-get-single-record";
    crudSave: "CRUD_SAVE";
    crudSaveError:
      | "error.platform.invoke-action"
      | "error.platform.invoke-delete-action";
    crudSaveOnDisabled: "CRUD_SAVE_ON_DISABLED";
    formChange: "FORM_CHANGE";
    hideCommands: "CLICK_CLOSE_COMMANDS";
    init: "INIT_STATE";
    openCommandbar: "CLICK_OPEN_COMMAND_BAR";
    openCommandbarDetailFromSearch: "done.invoke.invoke-get-single-record";
    openCommandbarRelationalField: "CLICK_ON_RELATIONAL_FIELD";
    resetFormState: "done.invoke.invoke-action";
    resetToOriginForm: "CRUD_CANCEL";
    resetToOriginFormAndUseCreatedValue: "done.invoke.invoke-action";
    showCommands: "CLICK_OPEN_COMMAND_BAR";
    updateData: "UPDATE_DATA";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    "invoke-action": "CRUD_SAVE";
    "invoke-delete-action": "CRUD_DELETE";
    "invoke-get-single-record": "COMMAND_BAR_SELECT_ROW";
  };
  matchesStates:
    | "idle"
    | "ready"
    | "ready.deleting"
    | "ready.loading"
    | "ready.searching"
    | "ready.showCommandbar"
    | "ready.showCommandbar.commands"
    | "ready.showCommandbar.detail"
    | "ready.showCommandbar.search"
    | "ready.showCommandbar.search.detail"
    | "ready.showCommandbar.search.getSingleRecord"
    | "ready.showCommandbar.search.searching"
    | "ready.showForm"
    | "ready.showForm.editing"
    | "ready.showForm.editing.idle"
    | "ready.showForm.editing.showRelationalForm"
    | "ready.showForm.saving"
    | "ready.waiting"
    | {
        ready?:
          | "deleting"
          | "loading"
          | "searching"
          | "showCommandbar"
          | "showForm"
          | "waiting"
          | {
              showCommandbar?:
                | "commands"
                | "detail"
                | "search"
                | { search?: "detail" | "getSingleRecord" | "searching" };
              showForm?:
                | "editing"
                | "saving"
                | { editing?: "idle" | "showRelationalForm" };
            };
      };
  tags: never;
}
