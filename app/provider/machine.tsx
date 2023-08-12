import { assign, createMachine } from "xstate";
import {
  AdminStateContextType,
  DEFAULT_ADMIN_STATE_CONTEXT,
} from "./state-context";
import { AdminStateEvents } from "./events";
import { myAction } from "../api/actions";
import {
  generateColumns,
  generateFormFields,
  generateNavigationCategories,
} from "../admin-utils/utils";

export const adminMachine = createMachine(
  {
    tsTypes: {} as import("./machine.typegen").Typegen0,
    schema: {
      context: {} as AdminStateContextType,
      events: {} as AdminStateEvents,
    },

    id: "admin-machine",
    initial: "idle",
    context: DEFAULT_ADMIN_STATE_CONTEXT,
    states: {
      idle: {
        on: {
          INIT_STATE: {
            target: "ready",
            actions: ["init"],
          },
          SEARCH_CHANGED: {
            target: "ready",
            actions: ["searchChanged"],
          },
        },
      },

      ready: {
        on: {
          SEARCH_CHANGED: {
            actions: ["searchChanged"],
            // target: "ready.searching",
          },

          // CRUD
          CRUD_CREATE: {
            target: "ready.crud.create",
          },
          CRUD_EDIT: {
            target: "ready.crud.edit",
            actions: ["crudEdit"],
          },
        },
        initial: "waiting",

        states: {
          waiting: {},
          crud: {
            on: {
              CRUD_CANCEL: {
                target: "#admin-machine.ready.waiting",
              },
            },
            states: {
              create: {},
              edit: {},
            },
          },
          searching: {
            // invoke: {
            //   id: "getUser",
            //   src: (context, event) => myAction(),
            //   onDone: {
            //     target: "#admin-machine.ready",
            //     actions: assign((context, event) => {
            //       console.log("done", event.data);
            //     }),
            //     // actions: () => console.log("done"),
            //     // actions: assign({ user: (context, event) => event.data }),
            //   },
            //   onError: {
            //     target: "#admin-machine.ready",
            //     actions: () => console.log("error"),
            //     // actions: assign({ error: (context, event) => event.data }),
            //   },
            // },
          },
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
          (config) => config.name === view
        );

        if (!activeClient) {
          throw new Error(`No client found for view: ${view}`);
        }

        const columnsToRender = generateColumns({
          customColumns: activeClient.table.columns,
          baseColumns: modelSchema.columns,
          columnsToHide: (activeClient.table.columnsToHide || []) as string[],
        });

        return {
          ...context,
          internal: {
            config: event.data.config,
            data: event.data.data,
            modelSchema,
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
            search: {
              ...context.control.search,
              value: query,
            },
          },
          form: {
            ...context.form,
            title: "",
            description: "",
            fields: generateFormFields({ modelSchema, config: activeClient }),
          },
        };
      }),

      // CRUD
      crudEdit: assign((context, event) => {
        return {
          ...context,
          form: {
            ...context.form,
            title: "Edit row",
            fields: generateFormFields({
              // modelSchema: context.internal.,
              modelSchema: context.internal.modelSchema,
              activeRecord: event.data.row,
              config: context.config,
            }),
          },
          state: {
            ...context.state,
            activeRow: event.data.row,
          },
        };
      }),

      searchChanged: assign((context, event) => {
        return {
          ...context,
          control: {
            ...context.control,
            search: {
              ...context.control.search,
              value: event.data.value,
            },
          },
        };
      }),
    },
  }
);
