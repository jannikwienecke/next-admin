import { Sidebar } from "@/components/container";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { useMachine } from "../provider/hooks";

export const PageSidebar = () => {
  const { navigation, routing } = useMachine();

  return (
    <Sidebar
      categories={navigation.categories.map((c) => {
        return {
          ...c,
          items: c.items.map((i) => {
            return {
              ...i,
              onClick: () => {
                console.log("clicked", i.name);
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
