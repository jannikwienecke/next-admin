import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { useAdminState } from "../client/provider/state";

export const AdminLoadingOverlay = () => {
  const [show, setShow] = React.useState(false);
  const { routing } = useAdminState();

  React.useEffect(() => {
    if (routing.loading) {
      const timeout = setTimeout(() => {
        setShow(true);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      setShow(false);
    }
  }, [routing.loading]);

  return (
    <>
      {show ? (
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1000,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff50",
          }}
        >
          <div className="-top-28 relative">
            <Spinner className="h-8 w-8" />
          </div>
        </div>
      ) : null}
    </>
  );
};
