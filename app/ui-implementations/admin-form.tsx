// import { Input } from "@/components/ui/input";
// import { FormFieldType } from "../admin-utils/base-types";
// import { Label } from "@/components/ui/label";
// import React from "react";
// import { useAdminState } from "../provider/state";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";

// // const formSchema = z.object({
// //   username: z.string().min(2).max(50),
// // });

// const fields = [
//   {
//     name: "username",
//   },
// ];

// // const generateFormSchemaFromFields = (
// //   fields: FormFieldType[]
// // ): z.ZodObject<any> => {
// //   return fields.reduce((acc, field) => {
// //     acc[field.name] = z.string().min(2).max(50);
// //     return acc;
// //   }, {} as any);
// // };

// // const formSchema = generateFormSchemaFromFields([
// //   {
// //     name: "username",
// //     defaultValue: "shadcn",
// //     value: undefined,
// //     type: "String",
// //     label: "Username",
// //   },
// // ]);

// export const AdminForm = ({
//   form,
//   fields,
// }: {
//   form: ReturnType<typeof useForm>;
//   fields: FormFieldType[];
// }) => {
//   console.log({ fields });

//   return (
//     <>
//       {/* {fields.map((_f) => {
//         <FormField
//           control={form.control}
//           name={"label"}
//           render={({ field }) => {
//             console.log({ field });

//             return (
//               <FormItem>
//                 <FormLabel>{_f.label}</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>

//                 <FormMessage />
//               </FormItem>
//             );
//           }}
//         />;
//       })} */}

//       <FormField
//         control={form.control}
//         name="label"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Username</FormLabel>
//             <FormControl>
//               <Input placeholder="Label" {...field} />
//             </FormControl>
//             <FormDescription>This is your public display name.</FormDescription>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </>

//     // <div className="grid gap-4 py-4">
//     //   {form?.fields.map((field) => {
//     //     const FormField = FormFieldDict[field.type];

//     //     if (!FormField) {
//     //       return <></>;
//     //     }

//     //     return (
//     //       <div key={field.name} className="grid grid-cols-4 items-center gap-4">
//     //         <FormField {...field} />
//     //       </div>
//     //     );
//     //   })}
//     // </div>
//   );
// };

// const FormDefaultInputField = ({ label, ...props }: FormFieldType) => {
//   return (
//     <>
//       <Label htmlFor="username" className="text-right">
//         {label}
//       </Label>
//       <Input {...props} value={props.value as string} className="col-span-3" />
//     </>
//   );
// };

// const FormFieldDict: {
//   [key in FormFieldType["type"]]: (props: FormFieldType) => JSX.Element;
// } = {
//   Int: FormDefaultInputField,
//   String: FormDefaultInputField,
// };
