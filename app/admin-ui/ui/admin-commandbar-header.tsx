import { CaretLeftIcon } from "@radix-ui/react-icons";

export const CommandDialogHeader = () => {
  return (
    <div className="flex flex-row justify-between border-b-[1px] border-gray-200 px-2 py-3">
      <div className="flex flex-row items-center gap-2 cursor-pointer rounded-full bg-gray-200 p-1">
        <CaretLeftIcon className="h-5 w-5" />
      </div>
    </div>
  );
};
