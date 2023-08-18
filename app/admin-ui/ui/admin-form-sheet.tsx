import { Slideover } from "@/components/container/slide-over";
// import { AdminForm } from "./admin-form";
import { useAdminState } from "../client/provider/state";
import { AdminForm } from "./form";
import React from "react";

export const AdminFormSheet = () => {
  const { state, emiiter, form } = useAdminState();
  const showForm = state.matches("ready.showForm");
  const showRelationalForm = state.matches(
    "ready.showForm.editing.showRelationalForm"
  );

  const { formHandler } = useAdminState();
  const saving = state.matches("ready.showForm.saving");

  return (
    <>
      <Slideover.Sheet
        className={showRelationalForm ? "w-550 sm:w-[640px]" : ""}
        isOpen={showForm}
        onClose={emiiter.clickCancel}
      >
        <Slideover.Header
          title={form?.title || "New Record"}
          description={form?.description || ""}
        />

        <Slideover.Content>
          {showRelationalForm ? (
            <AdminForm {...formHandler} saving={saving} />
          ) : (
            <AdminForm {...formHandler} saving={saving} />
          )}
        </Slideover.Content>
      </Slideover.Sheet>
    </>
  );
};
