import { Button } from "@/components/ui/button";
import { useAdminState } from "../client/provider/state";
import { Spinner } from "@/components/ui/spinner";

export const AdminPageHeader = () => {
  const { emiiter, activeConfig, machineIsBusy } = useAdminState();

  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <div className="flex items-center space-x-3 flex-row">
          <h2 className="text-2xl font-bold tracking-tight">
            {activeConfig.label}
          </h2>
          {machineIsBusy ? <Spinner /> : null}
        </div>
        <p className="text-muted-foreground">
          {activeConfig.description || ""}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={emiiter.clickCreate}>Create New</Button>
      </div>
    </div>
  );
};
