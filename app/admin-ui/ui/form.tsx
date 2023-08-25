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
import { cn } from "@/lib/utils";

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
  const { emiiter, form: formState, activeFormState } = useAdminState();

  const { missingFields, isReady, showMissingValues } = activeFormState || {};

  const form = useForm();

  return (
    <>
      <Form {...form}>
        <div className="space-y-8">
          {fields.map((f) => {
            const Component = FormFieldDict[f.type];
            // const isMissing = missingFields?.includes(f.name);
            return (
              <>
                <FormItem>
                  <FormLabel>{f.label}</FormLabel>
                  <Component
                    {...f}
                    id={
                      formState?.activeRelationalConfigs?.length
                        ? `${formState.activeRelationalConfigs[0].model}_${f.name}`
                        : (f.name as any)
                    }
                    onAddNew={(props) => {
                      if (!f.relation) return;
                      emiiter.clickCreateRelationalValue({
                        modelName: f.relation?.modelName,
                        ...props,
                      });
                    }}
                    onUpdate={(value) => {
                      emiiter.changeFormState({
                        field: f,
                        value,
                      });
                    }}
                  />
                  {f.error ? (
                    <FormMessage>
                      <span className="text-destructive">{f.error}</span>
                    </FormMessage>
                  ) : null}
                </FormItem>
              </>
            );
          })}
        </div>
      </Form>

      <Slideover.Footer>
        <div className="pt-8 flex flex-row space-x-2">
          <Button onClick={emiiter.clickCancel} variant={"outline"}>
            Cancel
          </Button>

          <Button
            onClick={isReady ? emiiter.clickSave : emiiter.clickSaveOnDisabeld}
            disabled={saving}
            variant={
              missingFields && showMissingValues ? "destructive" : undefined
            }
            className={cn(
              "transition-all",
              !isReady ? `opacity-75 transition-all` : "",
              missingFields && showMissingValues ? "opacity-100" : ""
            )}
          >
            {saving ? <Spinner /> : "Save changes"}
          </Button>
        </div>
      </Slideover.Footer>
    </>
  );
}
