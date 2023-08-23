import { Input } from "@/components/ui/input";
import { FormFieldType } from "../client/admin-utils/base-types";

export const FormDefaultInputField = ({
  label,
  onUpdate,
  onAddNew,
  ...props
}: FormFieldType & {
  onAddNew: (props: { value: string }) => void;
  onUpdate: (value: number | string) => void;
}) => {
  return (
    <>
      <Input
        key={props.id}
        {...props}
        onChange={(e) => onUpdate(e.target.value)}
      value={props.value as string}
        className="col-span-3"
      />
    </>
  );
};
