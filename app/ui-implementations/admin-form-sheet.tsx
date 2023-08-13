import { Slideover } from "@/components/container/slide-over";
// import { AdminForm } from "./admin-form";
import { useAdminState } from "../provider/state";
import { ProfileForm } from "./form";

export const AdminFormSheet = () => {
  const { state, emiiter, form } = useAdminState();
  const showForm = state.matches("ready.showForm");

  return (
    <Slideover.Sheet isOpen={showForm} onClose={emiiter.clickCancel}>
      <Slideover.Header title="Tag Create" description="" />

      <Slideover.Content>
        <ProfileForm />
      </Slideover.Content>
    </Slideover.Sheet>
  );
};
