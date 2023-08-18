import { Input } from "@/components/ui/input";
import { FormFieldType } from "../client/admin-utils/base-types";

export const FormDefaultInputField = ({ label, ...props }: FormFieldType) => {
  return (
    <>
      <Input
        key={props.id}
        {...props}
        value={props.value as string}
        className="col-span-3"
      />
    </>
  );
};
