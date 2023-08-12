import { PageTopMenu, PageSidebar } from ".";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
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
