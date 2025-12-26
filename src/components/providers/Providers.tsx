import { ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ModalProvider } from "./ModalProvider";
import { DatabaseProvider } from "./DatabaseProvider";
import { UserProvider } from "@/hooks/useUser";

export const Providers = ({ children }: { children?: ReactNode }) => {
  return (
    <UserProvider>
      <DatabaseProvider>
        <ModalProvider>
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </StoreProvider>
        </ModalProvider>
      </DatabaseProvider>
    </UserProvider>
  );
};
