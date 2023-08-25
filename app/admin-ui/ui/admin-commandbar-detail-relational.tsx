import {
  ComboboxItemProps,
  FormFieldType,
} from "../client/admin-utils/base-types";

export const DetailViewRelational = (props: FormFieldType) => {
  const value = props.value as any as ComboboxItemProps;
  return (
    <div className="block text-base font-medium text-black ">{value.label}</div>
  );
};
