import { FormFieldType } from "../client/admin-utils/base-types";

export const DetailViewDefault = (props: FormFieldType) => {
  return (
    <div className="block text-base font-medium text-black ">{props.value}</div>
  );
};
