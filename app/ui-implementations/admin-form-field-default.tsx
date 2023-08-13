import { Input } from "@/components/ui/input";
import { FormFieldType } from "../admin-utils/base-types";

export const FormDefaultInputField = ({ label, ...props }: FormFieldType) => {
  return (
    <>
      <Input {...props} value={props.value as string} className="col-span-3" />
    </>
  );
};
