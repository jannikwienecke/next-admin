export const AdminCommandbarEmpty = ({
  query,
  show,
}: {
  query?: string;
  show: boolean;
}) => {
  if (!show) return null;

  return (
    <div className="h-[25rem] text-muted-foreground items-center grid text-center p-16 text-sm font-medium">
      {`No results found for '${query}`}
    </div>
  );
};
