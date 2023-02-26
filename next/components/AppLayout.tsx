import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  return (
    <div className='flex flex-col gap-3'>
      <AppHeader />
      <main className="max-w-md mx-auto">{children}</main>
    </div>
  );
};
