import { FormFieldType } from "../client/admin-utils/base-types";
import { useAdminState } from "../client/provider/state";
import { DetailViewDefault } from "./admin-commandbar-detail-default";
import { DetailViewRelational } from "./admin-commandbar-detail-relational";
import { CommandDialogFooter } from "./admin-commandbar-footer";
import { CommandDialogHeader } from "./admin-commandbar-header";

const DetailFieldDict: {
  [key in FormFieldType["type"]]: (props: FormFieldType & {}) => JSX.Element;
} = {
  Int: DetailViewDefault,
  String: DetailViewDefault,
  Relation: DetailViewRelational,
};

export const DetailView = () => {
  return (
    <>
      <CommandDialogHeader />
      <CommandDialogContent />
      <CommandDialogFooter />
    </>
  );
};

const CommandDialogContent = () => {
  const { state, activeConfig, navigation } = useAdminState();

  const { activeItem, label, fields, meta, view } =
    state.context.commandbar.view.detail || {};

  if (!activeItem) return null;
  if (!label) throw new Error("No label found");

  const navigationItem = navigation.categories
    .find((c) => c.items.find((i) => i.name === view))
    ?.items.find((i) => i.name === view);

  if (!navigationItem) throw new Error("No navigation item found");

  return (
    <div className="flex flex-row border-r-[1px] border-r-gray-200">
      <div className="flex flex-col w-2/3">
        <div className="py-8 px-6 border-b-[1px] border-b-gray-200 flex flex-row items-center space-x-5">
          <navigationItem.icon className="h-14 w-16 ml-2 bg-indigo-500 text-white p-2 rounded-xl" />

          <div className="text-3xl flex flex-row justify-between w-full items-center">
            <div className="font-bold">{label}</div>
            <div className="rounded-lg text-xl bg-gray-100 py-2 border-gray-300 border-[1px] px-4">
              {view}
            </div>
          </div>
        </div>

        <div className="min-h-[25rem] py-8 px-6 flex flex-col space-y-2">
          {fields?.map((field) => {
            if (activeConfig.labelKey === field.name) return null;

            const Component = DetailFieldDict[field.type];

            return (
              <div key={field.name}>
                <DetailViewLabel label={field.label} />
                <Component {...field} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-1/3 border-l-[1px] border-l-gray-200 px-4 py-8 flex-1">
        <div className="h-full flex flex-col space-y-2 justify-end">
          {meta?.dateCreated ? (
            <>
              <label className="block text-sm font-sm text-gray-600 font-semibold ">
                Created
              </label>

              <div className="block text-sm font-medium text-black ">
                {meta?.dateCreated}
              </div>
            </>
          ) : null}

          {meta?.dateUpdated ? (
            <>
              <label className="block text-sm font-sm text-gray-600 font-semibold ">
                Updated
              </label>
              <div className="block text-sm font-medium text-black ">
                {meta?.dateUpdated}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const DetailViewLabel = (props: { label: string }) => {
  return (
    <label className="block text-base font-sm text-gray-600 font-semibold ">
      {props.label}
    </label>
  );
};

// HIER WETIER MACHEN
// itasks -> will have error - due to realtional data
