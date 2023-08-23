import { Spinner } from "@/components/ui/spinner";

export const AdminCommandbarSpinner = () => {
  return (
    <div className="grid place-items-center w-full h-[25rem] p-8">
      <Spinner className="h-6 w-6" />
    </div>
  );
};
