import { useEffect, useState } from "react";

export type GwapTier = "elite" | "verified" | "rising" | "new";

export interface GwapScoreResult {
  score: number | null;
  tier: GwapTier | null;
  loading: boolean;
}

const GWAP_SCORE_API =
  (import.meta.env.VITE_GWAP_SCORE_API_URL as string | undefined) ?? "https://api.gwapscore.xyz";

export function useGwapScore(walletAddress: string | null): GwapScoreResult {
  const [state, setState] = useState<GwapScoreResult>({
    score: null,
    tier: null,
    loading: false,
  });

  useEffect(() => {
    if (!walletAddress) {
      setState({ score: null, tier: null, loading: false });
      return;
    }
    let cancelled = false;
    setState(s => ({ ...s, loading: true }));
    fetch(`${GWAP_SCORE_API}/v1/score/${walletAddress}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(data => {
        if (cancelled) return;
        setState({
          score: typeof data?.score === "number" ? data.score : null,
          tier: data?.tier ?? null,
          loading: false,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ score: null, tier: null, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  return state;
}
