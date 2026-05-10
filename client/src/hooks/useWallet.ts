import { useCallback, useEffect, useState } from "react";

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey: { toString(): string } | null;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect: () => Promise<void>;
  signTransaction: <T>(tx: T) => Promise<T>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeAllListeners?: () => void;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const provider = window.solana;
  if (provider?.isPhantom) return provider;
  return null;
}

export interface WalletState {
  publicKey: string | null;
  connecting: boolean;
  connected: boolean;
  hasPhantom: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>(() => ({
    publicKey: null,
    connecting: false,
    connected: false,
    hasPhantom: !!getPhantom(),
  }));

  useEffect(() => {
    const phantom = getPhantom();
    if (!phantom) return;

    // Try eager re-connect if previously approved
    phantom
      .connect({ onlyIfTrusted: true })
      .then(({ publicKey }) => {
        setState(s => ({
          ...s,
          publicKey: publicKey.toString(),
          connected: true,
          hasPhantom: true,
        }));
      })
      .catch(() => {
        // not previously authorized — silent
      });

    const handleConnect = () => {
      const pk = phantom.publicKey?.toString() ?? null;
      setState(s => ({ ...s, publicKey: pk, connected: !!pk, hasPhantom: true }));
    };
    const handleDisconnect = () => {
      setState(s => ({ ...s, publicKey: null, connected: false }));
    };

    phantom.on("connect", handleConnect);
    phantom.on("disconnect", handleDisconnect);

    return () => {
      phantom.removeAllListeners?.();
    };
  }, []);

  const connect = useCallback(async () => {
    const phantom = getPhantom();
    if (!phantom) {
      window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
      return null;
    }
    setState(s => ({ ...s, connecting: true }));
    try {
      const { publicKey } = await phantom.connect();
      const pk = publicKey.toString();
      setState({ publicKey: pk, connecting: false, connected: true, hasPhantom: true });
      return pk;
    } catch (err) {
      setState(s => ({ ...s, connecting: false }));
      throw err;
    }
  }, []);

  const disconnect = useCallback(async () => {
    const phantom = getPhantom();
    if (!phantom) return;
    await phantom.disconnect();
    setState(s => ({ ...s, publicKey: null, connected: false }));
  }, []);

  const signTransaction = useCallback(async <T,>(tx: T): Promise<T> => {
    const phantom = getPhantom();
    if (!phantom) throw new Error("Phantom wallet not available");
    return phantom.signTransaction(tx);
  }, []);

  return { ...state, connect, disconnect, signTransaction };
}
