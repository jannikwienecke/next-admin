import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function SlideOverContainer({
  onClose,
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}) {
  return (
    <Sheet
      open={isOpen}
      modal={true}
      onOpenChange={(isOpen) => {
        !isOpen && onClose?.();
      }}
    >
      <SheetContent className="w-[600px] sm:w-[640px]">{children}</SheetContent>
    </Sheet>
  );
}

export const SliderOverHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <SheetHeader>
      <SheetTitle>{title}</SheetTitle>
      {description ? (
        <SheetDescription>
          Make changes to your profile here. Click save when you're done.
        </SheetDescription>
      ) : null}
    </SheetHeader>
  );
};

export const SliderOverFooter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SheetFooter>
      <SheetClose asChild>
        {/* <Button type="submit">Save changes</Button> */}
        {children}
      </SheetClose>
    </SheetFooter>
  );
};

export const SliderOverContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="py-4">{children}</div>;
};

export const Slideover = {
  Sheet: SlideOverContainer,
  Header: SliderOverHeader,
  Footer: SliderOverFooter,
  Content: SliderOverContent,
};
