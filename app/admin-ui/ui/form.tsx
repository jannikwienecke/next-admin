"use client";

import { Slideover } from "@/components/container/slide-over";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { FormEvent } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { FormFieldType } from "../client/admin-utils/base-types";
import { useAdminState } from "../client/provider/state";
import { FormDefaultInputField } from "./admin-form-field-default";
import { RelationFormInputField } from "./admin-form-field-relational";

const FormFieldDict: {
  [key in FormFieldType["type"]]: (
    props: FormFieldType & {
      onAddNew: (props: { value: string }) => void;
      onUpdate: (value: any) => void;
    }
  ) => JSX.Element;
} = {
  Int: FormDefaultInputField,
  String: FormDefaultInputField,
  Relation: RelationFormInputField,
};

export function AdminForm({
  saving,
  submitForm,
  fields,
}: {
  saving: boolean;
  submitForm: (event: FormEvent<HTMLFormElement>) => void;
  fields: FormFieldType[];
}) {
  const { emiiter, form: formState } = useAdminState();

  const form = useForm();

  return (
    <Form {...form}>
      <form onSubmit={submitForm} className="space-y-8">
        {fields.map((f) => {
          const Component = FormFieldDict[f.type];

          return (
            <>
              <FormItem>
                <FormLabel>{f.label}</FormLabel>
                <Component
                  {...f}
                  id={
                    formState?.activeRelationalConfigs
                      ? `${formState.activeRelationalConfigs[0].model}_${f.name}`
                      : (f.name as any)
                  }
                  onAddNew={(props) => {
                    // if (!f.relation) return;
                    // emiiter.clickCreateRelationalValue({
                    //   modelName: f.relation?.modelName,
                    //   formState: form.getValues(),
                    //   ...props,
                    // });
                  }}
                  onUpdate={(value) => {
                    emiiter.changeFormState({
                      field: f,
                      value,
                    });
                  }}
                />
              </FormItem>
            </>
          );
        })}

        <Slideover.Footer>
          <>
            <Button
              type="reset"
              onClick={emiiter.clickCancel}
              variant={"outline"}
            >
              Cancel
            </Button>

            <Button disabled={saving} type="submit">
              {saving ? <Spinner /> : "Save changes"}
            </Button>
          </>
        </Slideover.Footer>
      </form>
    </Form>
  );
}
