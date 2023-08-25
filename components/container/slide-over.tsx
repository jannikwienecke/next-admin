import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SlideOverContainer({
  onClose,
  children,
  isOpen,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <Sheet
      open={isOpen}
      modal={true}
      onOpenChange={(isOpen) => {
        !isOpen && onClose?.();
      }}
    >
      <SheetContent
        className={cn("w-[500px] sm:w-[600px] transition-all", className)}
      >
        {children}
      </SheetContent>
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
  return <SheetFooter>{children}</SheetFooter>;
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
