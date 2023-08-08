import { Sidebar } from "@/components/container";
import { MinusCircledIcon } from "@radix-ui/react-icons";

export const PageSidebar = () => {
  return (
    <Sidebar
      categories={[
        {
          label: "Library",
          items: [
            {
              label: "Radio",
              active: false,
              icon: MinusCircledIcon,
            },
            {
              label: "Music",
              active: true,
              icon: MinusCircledIcon,
            },
          ],
        },
        {
          label: "Store",
          items: [
            {
              label: "Buy",
              active: false,
              icon: MinusCircledIcon,
            },
            {
              label: "Stuff",
              active: false,
              icon: MinusCircledIcon,
            },
          ],
        },
      ]}
      className="hidden lg:block"
    />
  );
};
