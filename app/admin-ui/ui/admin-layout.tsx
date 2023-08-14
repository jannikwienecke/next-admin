import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { PageSidebar, PageTopMenu } from ".";
import { useAdminState } from "../client/provider/state";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { form } = useAdminState();

  React.useEffect(() => {
    const error = form?.error;
    if (!error?.message) return;

    toast({
      title: "Something went wrong",
      description: error?.message,
      // action: <ToastAction altText={"try again"}>Try again</ToastAction>,
      variant: "destructive",
    });
  }, [form?.error, toast]);

  return (
    <div>
      <Toaster />
      <PageTopMenu />

      <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5 min-h-screen">
            <PageSidebar />

            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
