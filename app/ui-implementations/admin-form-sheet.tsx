import { Slideover } from "@/components/container/slide-over";
import { Button } from "@/components/ui/button";
import { useAdmin } from "../provider/hooks";
import { AdminForm } from "./admin-form";

export const AdminFormSheet = () => {
  const { state, emiiter } = useAdmin();
  const create = state.matches("ready.crud.create");
  const edit = state.matches("ready.crud.edit");

  return (
    <Slideover.Sheet isOpen={create || edit} onClose={emiiter.clickCancel}>
      <Slideover.Header title="Tag Create" description="" />

      <Slideover.Content>
        <AdminForm />
      </Slideover.Content>

      <Slideover.Footer>
        <>
          <Button
            onClick={emiiter.clickCancel}
            variant={"outline"}
            type="submit"
          >
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </>
      </Slideover.Footer>
    </Slideover.Sheet>
  );
};
