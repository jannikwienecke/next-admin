import { CaretLeftIcon } from "@radix-ui/react-icons";
import { useAdminState } from "../client/provider/state";

export const CommandDialogHeader = () => {
  const { send } = useAdminState();

  const handleClick = () => {
    send({ type: "CLICK_CLOSE_COMMAND_BAR" });
  };

  return (
    <div className="flex flex-row justify-between border-b-[1px] border-gray-200 px-2 py-3">
      <button
        onClick={handleClick}
        className="flex flex-row items-center gap-2 cursor-pointer rounded-full bg-gray-200 p-1"
      >
        <CaretLeftIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
