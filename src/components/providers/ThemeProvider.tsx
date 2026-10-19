"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import type { ReactNode } from "react";

interface Props extends ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider
      {...props}
      forcedTheme="light"
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme={false}
    >
      {children}
    </NextThemesProvider>
  );
}
