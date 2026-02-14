"use client";

import { SessionProvider } from "next-auth/react";
import { DisplayPreferenceProvider } from "./display-preference";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DisplayPreferenceProvider>{children}</DisplayPreferenceProvider>
    </SessionProvider>
  );
}
