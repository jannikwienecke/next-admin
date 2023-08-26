import { Sidebar } from "@/components/container";
import { useAdminState } from "../client/provider/state";

export const PageSidebar = () => {
  const { navigation, routing } = useAdminState();

  return (
    <Sidebar
      categories={navigation.categories.map((c) => {
        return {
          ...c,
          items: c.items.map((i) => {
            return {
              ...i,
              active: routing.view === i.name,
              onClick: () => {
                if (routing.view === i.name) return;
                routing.redirectToView(i.name);
              },
            };
          }),
        };
      })}
      className="hidden lg:block"
    />
  );
};
