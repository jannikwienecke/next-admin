import { LL } from "@/lib/utils";
import { assign, createMachine } from "xstate";
import { serverAction } from "../../server/actions";
import { ConfigTypeDictClient, IDataValue } from "../admin-utils/base-types";
import {
  generateColumns,
  generateCommandSearchView,
  generateCommandbarActions,
  generateFields,
  generateNavigationCategories,
  getActiveConfig,
  getFormStateOfView,
  getLabelValue,
  getMetaData,
  getMissingFieldsInForm,
  resetFormStateDict,
  resetStateOfForms,
  updateFormStateDict,
  updateStateOfForms,
} from "../admin-utils/utils";
import { AdminStateEvents } from "./events";
import {
  AdminStateContextType,
  DEFAULT_ADMIN_STATE_CONTEXT,
} from "./state-context";

export const adminMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import("./machine.typegen").Typegen0,
    schema: {
      context: {} as AdminStateContextType,
      events: {} as AdminStateEvents,
    },

    id: "admin-machine",
    initial: "idle",
    context: DEFAULT_ADMIN_STATE_CONTEXT,
    on: {
      INIT_STATE: {
        target: "ready",
        actions: ["init"],
      },

      UPDATE_DATA: {
        actions: ["updateData"],
      },
    },
    states: {
      idle: {},

      ready: {
        on: {
          // CRUD
          CRUD_CREATE: {
            target: "ready.showForm",
            actions: ["crudCreate"],
          },
          CRUD_EDIT: {
            target: "ready.showForm",
            actions: ["crudEdit"],
          },
          CRUD_DELETE: {
            target: "ready.deleting",
            actions: ["crudDelete"],
          },
          CLICK_OPEN_COMMAND_BAR: {
            target: "ready.showCommandbar",
            actions: ["openCommandbar"],
          },
          CLICK_ON_RELATIONAL_FIELD: {
            target:
              "#admin-machine.ready.showCommandbar.search.getSingleRecord",
            actions: ["openCommandbarRelationalField"],
          },
        },
        initial: "waiting",

        states: {
          waiting: {},
          deleting: {
            invoke: {
              id: "invoke-delete-action",
              src: async (context, event) => {
                LL("invoke-action DELETE", { context, event });
                await serverAction({
                  action: {
                    data: (event as any).data.row,
                    name: "delete",
                  },
                  viewName: context.config.name,
                });
              },
              onDone: {
                target: "#admin-machine.ready",
              },
              onError: {
                actions: ["crudSaveError"],
              },
            },
          },

          showCommandbar: {
            initial: "commands",
            on: {
              CLICK_OPEN_COMMAND_BAR: {
                actions: ["showCommands"],
              },
              CLICK_CLOSE_COMMANDS: {
                actions: ["hideCommands"],
              },
            },
            states: {
              commands: {
                on: {
                  COMMAND_BAR_ACTION_FIRED: {
                    actions: ["commandBarActionFired"],
                    target: "search",
                  },
                  CLICK_CLOSE_COMMAND_BAR: {
                    target: "#admin-machine.ready",
                  },
                },
              },

              detail: {
                on: {
                  CLICK_CLOSE_COMMAND_BAR: [
                    {
                      cond: (c) => {
                        console.log("CLICK CLOSE", c);

                        return Boolean(c.state.commandbar.closeOnBack);
                      },
                      target: "#admin-machine.ready",
                    },
                    {
                      target: "#admin-machine.ready.showCommandbar.commands",
                    },
                  ],
                },
              },
              search: {
                on: {
                  CLICK_CLOSE_COMMAND_BAR: {
                    target: "#admin-machine.ready.showCommandbar.commands",
                  },
                  COMMAND_BAR_SELECT_ROW: {
                    target:
                      "#admin-machine.ready.showCommandbar.search.getSingleRecord",
                  },
                },

                initial: "searching",
                states: {
                  searching: {},
                  detail: {
                    on: {
                      CLICK_CLOSE_COMMAND_BAR: [
                        {
                          cond: (c) => Boolean(c.state.commandbar.closeOnBack),
                          target: "#admin-machine.ready",
                        },
                        {
                          target: "#admin-machine.ready.showCommandbar.search",
                        },
                      ],
                    },
                  },
                  getSingleRecord: {
                    invoke: {
                      id: "invoke-get-single-record",
                      src: async (context, event) => {
                        LL("invoke-action GET_SINGLE_RECORD", {
                          context,
                          event,
                        });

                        const config = context.state.commandbar.activeConfig;
                        if (!config) {
                          throw new Error("No activeConfig");
                        }

                        // // when clicking on  a relational field
                        // what is the model we are on
                        const startConfigModelName =
                          context.state.commandbar.startConfig?.model;

                        let idOfRow = (event as any).data.row.id;

                        // if we start on the normal table view and click on a relational field
                        if (startConfigModelName) {
                          // we start at config "task"
                          // we click on a relational field like iproject
                          const moderlSchamDict =
                            context.internal.modelSchema[
                              startConfigModelName as keyof typeof context.internal.modelSchema
                            ];

                          // we want to find the schema of the model we are on
                          // we click on a relational field like iproject
                          // we need to get the id field of it (iprojectId === projectId)
                          const columnOfClickedField =
                            moderlSchamDict.columns.find(
                              (c) =>
                                c.name.toLowerCase() ===
                                config.name.toLowerCase()
                            );

                          if (!columnOfClickedField) {
                            throw new Error("No columnOfClickedField");
                          }

                          // here we get projectId
                          const idOfRelationalField = (event as any).data.row[
                            columnOfClickedField?.relationFromFields?.[0]
                          ];

                          // from the clicked task row we get the projectId
                          idOfRow = idOfRelationalField;
                        }

                        const data = (await serverAction({
                          action: {
                            data: {
                              id: idOfRow,
                            },
                            name: "getSingleRecord",
                          },
                          viewName: config.name,
                        })) as any;

                        if (!data) {
                          throw new Error("No data");
                        }

                        return data;
                      },
                      onDone: {
                        target:
                          "#admin-machine.ready.showCommandbar.search.detail",
                        actions: ["openCommandbarDetailFromSearch"],
                      },
                      onError: {
                        actions: ["crudReadError"],
                      },
                    },
                  },
                },
              },
            },
          },

          showForm: {
            initial: "editing",
            states: {
              editing: {
                initial: "idle",

                on: {
                  CRUD_CANCEL: [
                    {
                      cond: (c) =>
                        c.form?.activeRelationalConfigs?.length === 1,
                      target: "#admin-machine.ready.showForm.editing",
                      actions: ["resetToOriginForm"],
                    },
                    {
                      target: "#admin-machine.ready.waiting",
                    },
                  ],

                  CRUD_SAVE: {
                    target: "#admin-machine.ready.showForm.saving",
                    actions: ["crudSave"],
                  },
                  CRUD_SAVE_ON_DISABLED: {
                    actions: ["crudSaveOnDisabled"],
                  },
                  CRUD_CLICK_CREATE_RELATIONAL_VALUE: {
                    target:
                      "#admin-machine.ready.showForm.editing.showRelationalForm",
                    actions: ["crudCreateRelational"],
                  },
                  FORM_CHANGE: {
                    actions: ["formChange"],
                  },
                },

                states: {
                  idle: {},
                  showRelationalForm: {},
                },
              },
              saving: {
                invoke: {
                  id: "invoke-action",
                  src: async (context, event) => {
                    LL("invoke-action", { context, event });

                    const viewName =
                      context.form?.activeRelationalConfigs?.[0]?.name ||
                      context.config.name;

                    if (!context.state.activeAction)
                      throw new Error("No action");

                    const formState = getFormStateOfView({ context });

                    const res = await serverAction({
                      action: {
                        data: {
                          ...formState,
                          id:
                            context.state.activeAction === "create"
                              ? null
                              : context.state.activeRow?.id,
                        },
                        name: context.state.activeAction,
                      },
                      viewName,
                    });

                    LL("invoke-action res", { res });
                    return {
                      data: res,
                      event,
                    };
                  },
                  onDone: [
                    {
                      cond: (c) =>
                        c.form?.activeRelationalConfigs?.length === 1,
                      target: "#admin-machine.ready.showForm.editing",
                      actions: [
                        "resetToOriginFormAndUseCreatedValue",
                        // "resetFormState",
                      ],
                    },
                    {
                      target: "#admin-machine.ready",
                      actions: ["resetFormState"],
                    },
                  ],
                  onError: {
                    target: "editing",
                    actions: ["crudSaveError"],
                  },
                },
              },
            },
          },

          searching: {},
          loading: {
            //
          },
        },
      },
    },
  },
  {
    actions: {
      init: assign((context, event) => {
        const { config, modelSchema, view, query } = event.data;

        const activeClient = Object.values(config).find(
          (config) => config.name.toLowerCase() === view.toLowerCase()
        );

        if (!activeClient) {
          throw new Error(`No client found for view: ${view}`);
        }

        const columnsToRender = generateColumns({
          customColumns: activeClient.table.columns,
          baseColumns: modelSchema[activeClient.model]?.columns,
          columnsToHide: (activeClient.table.columnsToHide || []) as string[],
          onClickRelationalField: (props) => {
            var evt = new CustomEvent("CUSTOM_EVENT_ADMIN", { detail: props });
            window.dispatchEvent(evt);
          },
        });

        const fields = generateFields({
          modelSchema,
          config: activeClient,
        });

        return {
          ...context,
          internal: {
            config: event.data.config,
            data: event.data.data,
            modelSchema,
            router: event.data.router,
            clientConfigServer: event.data.serverConfig,
          },
          config: activeClient,
          data: event.data.data,
          columns: columnsToRender,
          navigation: {
            categories: generateNavigationCategories({
              config: config,
            }),
            // categories: config.
          },
          control: {
            ...context.control,
            filters: event.data.filters,
            search: {
              ...context.control.search,
              value: query,
            },
          },
          form: {
            ...context.form,
            title: "",
            description: "",
            fields,
          },
        };
      }),

      updateData: assign((context, event) => {
        return {
          ...context,
          internal: {
            ...context.internal,
            data: event.data.data,
          },
          data: event.data.data,
        };
      }),

      // CRUD
      crudEdit: assign((context, event) => {
        return {
          ...context,
          form: {
            ...context.form,
            title: `Edit ${context.config.label}`,
            // state: formState,
            fields: generateFields({
              modelSchema: context.internal.modelSchema,
              activeRecord: event.data.row,
              config: context.config,
              defaultFormState: event.data.row,
            }),
          },
          state: {
            ...context.state,
            activeRow: event.data.row,
            activeAction: "edit" as const,
          },
        };
      }),

      crudCreate: assign((context, event) => {
        const formStateOfView = getFormStateOfView({ context });

        return {
          ...context,
          form: {
            ...context.form,
            title: `Create ${context.config.label}`,
            fields: generateFields({
              // modelSchema: context.internal.,
              modelSchema: context.internal.modelSchema,
              activeRecord: undefined,
              config: context.config,
              defaultFormState: formStateOfView,
            }),
          },
          state: {
            ...context.state,
            activeRow: undefined,
            activeAction: "create" as const,
          },
        };
      }),

      resetFormState: assign((context, event) => {
        const formStateDict = resetFormStateDict({ context });
        const statesOfForm = resetStateOfForms({ context });

        return {
          ...context,
          form: {
            ...context.form,

            states: formStateDict,
            stateOfForms: statesOfForm,
          },
        };
      }),

      crudCreateRelational: assign((context, event) => {
        const config = Object.values(context.internal.config).find(
          (c) => c.model.toLowerCase() === event.data.modelName.toLowerCase()
        );

        if (!config) {
          return {
            ...context,
            form: {
              ...context.form,
              error: {
                message: `No Config was found for the model: "${event.data.modelName}"`,
              },
            },
          };
        }

        const acitveConfigsForModel =
          context.form?.activeRelationalConfigs || [];
        acitveConfigsForModel.push(config);

        const labelKey = acitveConfigsForModel[0].labelKey;

        const formStateDict = updateFormStateDict({
          context: {
            ...context,
            form: {
              ...context.form,
              activeRelationalConfigs: acitveConfigsForModel,
            },
          },
          fieldName: labelKey as string,
          value: event.data.value,
        });

        const missingFields = getMissingFieldsInForm({
          config,
          formStateDict,
          modelSchema: context.internal.modelSchema,
        });

        const updatedStateOfFormDict = updateStateOfForms({
          context: {
            ...context,
            form: {
              ...context.form,
              activeRelationalConfigs: acitveConfigsForModel,
            },
          },
          newStateOfForm: {
            isDirty: true,
            missingFields: missingFields?.map((f) => f.name),
            showMissingValues: false,
            isReady: !missingFields,
          },
        });

        return {
          ...context,
          form: {
            ...context.form,
            title: `Create ${config.label}`,
            activeRelationalConfigs: acitveConfigsForModel,
            states: formStateDict,
            stateOfForms: updatedStateOfFormDict,
            fields: generateFields({
              modelSchema: context.internal.modelSchema,
              activeRecord: undefined,
              config,
              defaultValueLabelKey: event.data.value,
            }),
          },
          state: {
            ...context.state,
            activeRow: undefined,
            activeAction: "create" as const,
          },
        };
      }),

      openCommandbarRelationalField: assign((c, event) => {
        const config = Object.values(c.internal.config).find(
          (c) => c.name.toLowerCase() === event.data.name.toLowerCase()
        );

        if (!config) {
          throw new Error(`No config found for view: ${event.data.name}`);
        }

        return {
          ...c,
          state: {
            ...c.state,
            commandbar: {
              ...c.state.commandbar,
              closeOnBack: true,
              activeConfig: config,
              startConfig: c.config,
            },
          },
        };
      }),

      openCommandbarDetailFromSearch: assign((c, event) => {
        if (!c.state?.commandbar.activeConfig?.name) {
          throw new Error("No activeConfig");
        }

        return {
          ...c,
          commandbar: {
            ...c.commandbar,
            view: {
              ...c.commandbar.view,
              detail: {
                label: getLabelValue({
                  config: c.state?.commandbar.activeConfig,
                  activeRecord: event.data as IDataValue,
                }),
                meta: getMetaData({
                  config: c.internal.clientConfigServer,
                  activeRecord: event.data as IDataValue,
                }),

                type: "detail" as const,
                view: c.state?.commandbar.activeConfig?.name,
                activeItem: event.data as IDataValue,
                fields: generateFields({
                  modelSchema: c.internal.modelSchema,
                  activeRecord: event.data as IDataValue,
                  config: c.state?.commandbar.activeConfig,
                }),
              },
            },
          },
        };
      }),

      crudDelete: assign((context, event) => {
        const row = event.data.row;

        return {
          ...context,
          data: context.data.filter((r) => r.id !== row.id),
        };
      }),

      crudSave: assign((context, event) => {
        return {
          ...context,
          form: {
            ...context.form,
            title: context.form?.title || "",
            fields: context.form?.fields || [],
            // state: event.data.formState,
            error: undefined,
          },
        };
      }),

      crudSaveOnDisabled: assign((context, event) => {
        const updatedStateOfForm = updateStateOfForms({
          context,
          newStateOfForm: {
            showMissingValues: true,
          },
        });

        return {
          ...context,
          form: {
            ...context.form,
            stateOfForms: updatedStateOfForm,
            fields: generateFields({
              modelSchema: context.internal.modelSchema,
              activeRecord: undefined,
              config: getActiveConfig({ context }),
              stateOfFormDict: updatedStateOfForm,
            }),
          },
        };
      }),

      crudSaveError: assign((context, event) => {
        const message = (event.data as any)?.message || "Unknown error";
        return {
          ...context,
          form: {
            ...context.form,
            title: context.form?.title || "",
            fields: context.form?.fields || [],
            error: {
              message,
            },
          },
        };
      }),

      crudReadError: assign((context, event) => {
        const message = (event.data as any)?.message || "Unknown error";

        return {
          ...context,
          state: {
            ...context.state,
            commandbar: {
              ...context.state.commandbar,
              error: {
                message,
              },
              //
            },
          },
        };
      }),

      resetToOriginForm: assign((c, e) => {
        const { id, ...rest } = getFormStateOfView({
          context: {
            ...c,
            form: {
              ...c.form,
              activeRelationalConfigs: undefined,
            },
          },
        });

        return {
          ...c,
          form: {
            ...c.form,
            title: `Create ${c.config.label}`,
            activeRelationalConfigs: undefined,
            fields: generateFields({
              modelSchema: c.internal.modelSchema,
              activeRecord: undefined,
              config: c.config,
              defaultFormState: rest,
            }),
          },
        };
      }),

      resetToOriginFormAndUseCreatedValue: assign((c, e) => {
        const eventData = e.data as any;
        const { data } = eventData;

        const { id, ...rest } = getFormStateOfView({
          context: {
            ...c,
            form: {
              ...c.form,
              activeRelationalConfigs: undefined,
            },
          },
        });

        const activeConfig = c.form?.activeRelationalConfigs?.[0];
        const fieldName = activeConfig?.model as string;
        const labelKey = activeConfig?.labelKey as string;
        const labelValue = data[labelKey] || id;

        const defaultFormState = {
          ...rest,
          [fieldName]: {
            label: labelValue,
            value: data.id,
          },
        };

        const _form = {
          ...c.form,
          activeRelationalConfigs: c.form?.activeRelationalConfigs?.slice(1),
        };

        const newConfig = getActiveConfig({
          context: {
            ...c,
            form: _form,
          },
        });

        const formStateDict = updateFormStateDict({
          context: {
            ...c,
            form: _form,
          },
          fieldName: activeConfig?.model as string,
          value: {
            label: labelValue,
            value: data.id,
          },
        });

        const missingFields = getMissingFieldsInForm({
          modelSchema: c.internal.modelSchema,
          config: newConfig,
          formStateDict: formStateDict,
        });

        const stateOfFormDict = updateStateOfForms({
          context: c,
          newStateOfForm: {
            isDirty: true,
            isReady: !missingFields,
            missingFields: missingFields?.map((f) => f.name),
            showMissingValues: false,
          },
        });

        return {
          ...c,
          form: {
            ...c.form,
            title: `Create ${newConfig.label}`,
            stateOfForms: stateOfFormDict,
            states: formStateDict,
            activeRelationalConfigs: c.form?.activeRelationalConfigs?.slice(1),
            fields: generateFields({
              modelSchema: c.internal.modelSchema,
              activeRecord: undefined,
              config: newConfig,
              defaultFormState: defaultFormState,
              stateOfFormDict: stateOfFormDict,
            }),
          },
        };
      }),

      formChange: assign((c, e) => {
        const { field, value } = e.data;

        const formStateDict = updateFormStateDict({
          context: c,
          fieldName: field.name,
          value,
        });

        const config = c.form?.activeRelationalConfigs?.[0] || c.config;

        const newFormState =
          formStateDict[config.name as keyof typeof formStateDict];

        const missingFields = getMissingFieldsInForm({
          config,
          modelSchema: c.internal.modelSchema,
          formStateDict,
        });

        const updatedStateOfForm = updateStateOfForms({
          context: c,
          newStateOfForm: {
            isDirty: true,
            isReady: !missingFields,
            missingFields: missingFields?.map((f) => f.name),
          },
        });

        return {
          ...c,
          form: {
            ...c.form,
            stateOfForms: updatedStateOfForm,
            fields: generateFields({
              modelSchema: c.internal.modelSchema,
              activeRecord: undefined,
              config,
              defaultFormState: newFormState,
              stateOfFormDict: updatedStateOfForm,
            }),

            states: formStateDict,
          },
        };
      }),

      showCommands: assign((c) => {
        return {
          ...c,
          state: {
            ...c.state,
            commandbar: {
              ...c.state.commandbar,
              showCommands: true,
            },
          },
        };
      }),

      hideCommands: assign((c) => {
        return {
          ...c,
          state: {
            ...c.state,
            commandbar: {
              ...c.state.commandbar,
              showCommands: false,
            },
          },
        };
      }),

      // commandbar
      openCommandbar: assign((c) => {
        return {
          ...c,
          commandbar: {
            ...c.commandbar,
            view: {
              commands: generateCommandbarActions({
                config: c.internal.config,
              }),
            },
          },
        };
      }),

      commandBarActionFired: assign((c, event) => {
        const action = event.data.action;

        const isNavigation = action.action.type === "NAVIGATION";

        if (!isNavigation) {
          throw new Error(`Action type not supported: ${action.action.type}`);
        }

        if ("to" in action.action === false) {
          throw new Error(`Action type not supported: ${action.action.type}`);
        }

        const searchView = action.action.to.view;
        return {
          ...c,
          state: {
            ...c.state,
            commandbar: {
              ...c.commandbar,
              showCommands: false,
              activeConfig:
                c.internal.config[searchView as keyof ConfigTypeDictClient],
            },
          },
          commandbar: {
            ...c.commandbar,
            view: {
              ...c.commandbar.view,
              search: generateCommandSearchView({
                config: c.internal.config,
                viewName: searchView,
                // x : event.data.action.action.
              }),
            },
          },
        };
      }),
    },
  }
);
