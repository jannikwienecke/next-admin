import { Input } from "@/components/ui/input";
import { FormFieldType } from "../admin-utils/base-types";
import { Label } from "@/components/ui/label";
import React from "react";
import { useAdmin } from "../provider/hooks";

export const AdminForm = () => {
  const { form } = useAdmin();

  return (
    <div className="grid gap-4 py-4">
      {form?.fields.map((field) => {
        const FormField = FormFieldDict[field.type];

        if (!FormField) {
          return <></>;
        }

        return (
          <div key={field.name} className="grid grid-cols-4 items-center gap-4">
            <FormField {...field} />
          </div>
        );
      })}
    </div>
  );
};

const FormDefaultInputField = ({ label, ...props }: FormFieldType) => {
  return (
    <>
      <Label htmlFor="username" className="text-right">
        {label}
      </Label>
      <Input {...props} value={props.value as string} className="col-span-3" />
    </>
  );
};

const FormFieldDict: {
  [key in FormFieldType["type"]]: (props: FormFieldType) => JSX.Element;
} = {
  Int: FormDefaultInputField,
  String: FormDefaultInputField,
};
