import { Sidebar } from "@/components/container";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { useAdmin } from "../provider/hooks";

export const PageSidebar = () => {
  const { navigation, routing } = useAdmin();

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
