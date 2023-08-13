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
import { FormFieldType } from "../admin-utils/base-types";
import { useAdminState } from "../provider/state";
import { FormDefaultInputField } from "./admin-form-field-default";
import { RelationFormInputField } from "./admin-form-field-relational";

const FormFieldDict: {
  [key in FormFieldType["type"]]: (props: FormFieldType) => JSX.Element;
} = {
  Int: FormDefaultInputField,
  String: FormDefaultInputField,
  Relation: RelationFormInputField,
};

export function ProfileForm() {
  const { formHandler, emiiter, state } = useAdminState();
  const { fields, form, submitForm } = formHandler;
  const saving = state.matches("ready.showForm.saving");

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

                return (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <Component {...field} {...f} />
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
              onClick={emiiter.clickCancel}
              variant={"outline"}
              type="submit"
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
