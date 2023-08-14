import { cn } from "@/lib/utils";

export const BaseCell = (props: {
  icon?: React.ComponentType<any>;
  label: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center", props.className)}>
      {props.icon && (
        <props.icon className="mr-2 h-4 w-4 text-muted-foreground" />
      )}
      <span>{props.label}</span>
    </div>
  );
};
