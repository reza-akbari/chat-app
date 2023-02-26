import { ReactNode } from "react";
import { useIsMounted } from "../hooks/useIsMounted";

interface ClientOnlyProps {
  children: ReactNode;
}

export const ClientOnly = ({
  children,
}: ClientOnlyProps): JSX.Element | null => {
  const isMounted = useIsMounted();
  return isMounted ? <>{children}</> : null;
};
