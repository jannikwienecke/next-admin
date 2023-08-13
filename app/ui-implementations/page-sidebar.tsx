import { Sidebar } from "@/components/container";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { useAdminState } from "../provider/state";

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
              onClick: () => {
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
