import { ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ModalProvider } from "./ModalProvider";

export const Providers = ({ children }: { children?: ReactNode }) => {
  return (
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
  );
};
