import type { ReactNode } from "react";

/**
 * No-op wrapper around the children. We use Phantom's window-injected provider
 * directly via the `useWallet` hook, so no React context is required.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
