import { Button } from "@/components/ui/button";
import { useAdminState } from "../client/provider/state";
import { Spinner } from "@/components/ui/spinner";
import { Dropdown } from "@/components/container/drop-down";

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
        <Dropdown
          size="default"
          title="Actions"
          items={[
            {
              label: "Edit",
              id: "edit",
              isChecked: false,
              onCheck: () => {},
            },
          ]}
        />

        <Button onClick={emiiter.clickCreate}>Create New</Button>
      </div>
    </div>
  );
};
