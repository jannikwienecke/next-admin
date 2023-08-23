import { ColorWheelIcon } from "@radix-ui/react-icons";
import { useAdminState } from "../client/provider/state";
import { CommandDialogFooter } from "./admin-commandbar-footer";
import { CommandDialogHeader } from "./admin-commandbar-header";

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
  const { state } = useAdminState();

  const { activeItem, label, fields, meta } =
    state.context.commandbar.view.detail || {};

  if (!activeItem) return null;
  if (!label) throw new Error("No label found");

  return (
    <div className="flex flex-row border-r-[1px] border-r-gray-200">
      <div className="flex flex-col w-2/3">
        <div className="py-8 px-6 border-b-[1px] border-b-gray-200 flex flex-row items-center space-x-5">
          <ColorWheelIcon className="h-14 w-16 ml-2 bg-indigo-500 text-white p-2 rounded-xl" />
          <div className="text-3xl flex flex-row justify-between w-full items-center">
            <div className="font-bold">{label}</div>
            <div className="rounded-lg text-xl bg-gray-100 py-2 border-gray-300 border-[1px] px-4">
              {label}
            </div>
          </div>
        </div>

        <div className="min-h-[25rem] py-8 px-6 flex flex-col space-y-2">
          {fields?.map((field) => {
            return (
              <div key={field.name}>
                <DetailViewLabel label={field.label} />
                <DetailViewValue value={field.defaultValue} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-1/3 border-l-[1px] border-l-gray-200 px-4 py-8 flex-1">
        <div className="h-full flex flex-col space-y-2 justify-end">
          <label className="block text-sm font-sm text-gray-600 font-semibold ">
            Created
          </label>

          <div className="block text-sm font-medium text-black ">
            {meta?.dateCreated}
          </div>

          <label className="block text-sm font-sm text-gray-600 font-semibold ">
            Updated
          </label>

          <div className="block text-sm font-medium text-black ">
            {meta?.dateUpdated}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailViewLabel = (props: { label: string }) => {
  return (
    <div className="block text-base font-sm text-gray-600 font-semibold ">
      {props.label}
    </div>
  );
};

const DetailViewValue = (props: { value: string }) => {
  return (
    <div className="block text-base font-medium text-black ">{props.value}</div>
  );
};
