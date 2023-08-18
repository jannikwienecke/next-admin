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
import { FormFieldType } from "../client/admin-utils/base-types";
import { useAdminState } from "../client/provider/state";
import { FormDefaultInputField } from "./admin-form-field-default";
import { RelationFormInputField } from "./admin-form-field-relational";
import { UseFormReturn } from "react-hook-form";
import { FormEvent } from "react";

const FormFieldDict: {
  [key in FormFieldType["type"]]: (
    props: FormFieldType & {
      onAddNew: (props: { value: string }) => void;
    }
  ) => JSX.Element;
} = {
  Int: FormDefaultInputField,
  String: FormDefaultInputField,
  Relation: RelationFormInputField,
};

export function AdminForm({
  form,
  saving,
  submitForm,
  fields,
}: {
  saving: boolean;
  form: UseFormReturn<any, any, undefined>;
  submitForm: (event: FormEvent<HTMLFormElement>) => void;
  fields: FormFieldType[];
}) {
  const { emiiter, form: formState } = useAdminState();
  return (
    <Form {...form}>
      <form onSubmit={submitForm} className="space-y-8">
        {fields.map((f) => {
          return (
            <FormField
              key={f.name}
              control={form.control}
              name={f.name as any}
              render={({ field, fieldState }) => {
                const Component = FormFieldDict[f.type];

                if (!Component) {
                  // throw new Error(`No component found for ${f.type}`);
                  return <></>;
                }

                return (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <Component
                        {...field}
                        {...f}
                        id={
                          formState?.activeRelationalConfigs
                            ? `${formState.activeRelationalConfigs[0].model}_${f.name}`
                            : (f.name as any)
                        }
                        onAddNew={(props) => {
                          if (!f.relation) return;
                          emiiter.clickCreateRelationalValue({
                            modelName: f.relation?.modelName,
                            formState: form.getValues(),
                            ...props,
                          });
                        }}
                      />
                    </FormControl>
                    {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
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
