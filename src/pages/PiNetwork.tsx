import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  Fingerprint,
  LoaderCircle,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { CONTRACTS, TOKEN_CONFIG } from "@/data/token";
import {
  fetchPiTransparency,
  formatDuration,
  formatMrdn,
  type PiTransparencySnapshot,
} from "@/lib/piTransparency";
import { authenticateWithPi, initializePiTestnet, type PiVerifiedIdentity } from "@/lib/piSdk";

type SdkState = "loading" | "ready" | "unavailable";

function ContractLink({ name, address, href }: { name: string; address: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-surface/20 p-4 transition hover:border-line/30 hover:bg-surface/40"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{name}</span>
        <span className="mt-1 block truncate font-mono text-[11px] text-ink-faint">{address}</span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-ink-faint group-hover:text-line" />
    </a>
  );
}

function Metric({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface/30 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-faint">{label}</p>
      <p className="mt-3 break-words text-xl font-medium text-ink sm:text-2xl">{value}</p>
      <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[11px] text-line hover:underline">
        Verify on BscScan <ArrowUpRight className="h-3 w-3" />
      </a>
    </div>
  );
}

export default function PiNetwork() {
  const [sdkState, setSdkState] = useState<SdkState>("loading");
  const [sdkMessage, setSdkMessage] = useState("");
  const [identity, setIdentity] = useState<PiVerifiedIdentity | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const [snapshot, setSnapshot] = useState<PiTransparencySnapshot | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const refreshData = useCallback(async () => {
    setLoadingData(true);
    try {
      setSnapshot(await fetchPiTransparency());
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    initializePiTestnet()
      .then(() => {
        if (active) setSdkState("ready");
      })
      .catch(() => {
        if (active) {
          setSdkState("unavailable");
          setSdkMessage("Pi sign-in requires Pi Browser and a configured Testnet development URL.");
        }
      });
    void refreshData();
    return () => {
      active = false;
    };
  }, [refreshData]);

  const signIn = async () => {
    setSigningIn(true);
    setAuthError("");
    setNotice("");
    try {
      const auth = await authenticateWithPi(() => {
        setNotice("A prior Pi payment is incomplete. This read-only Meridian page cannot approve or complete Pi payments; resolve it in Pi support before using that payment flow.");
      });
      if (!auth.accessToken || auth.accessToken.length > 4096) {
        throw new Error("Pi returned an invalid sign-in token.");
      }

      const response = await fetch("/api/pi/verify", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: auth.accessToken }),
        signal: AbortSignal.timeout(10_000),
      });
      const result = (await response.json()) as {
        user?: PiVerifiedIdentity;
        error?: string;
      };

      if (!response.ok || !result.user?.uid || !result.user.username) {
        if (response.status === 429) throw new Error("Please wait a minute before trying Pi sign-in again.");
        if (response.status === 503) throw new Error("Pi verification is not configured on this Testnet Worker yet.");
        throw new Error("Pi could not verify this sign-in. Open the Testnet app in Pi Browser and try again.");
      }
      setIdentity(result.user);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Pi sign-in was cancelled or failed.");
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = () => {
    setIdentity(null);
    setNotice("");
    setAuthError("");
  };

  const pending = snapshot?.pendingWithdrawal;
  const pendingSummary = pending?.exists === null || pending?.exists === undefined
    ? "Unavailable"
    : pending.exists
      ? `${formatMrdn(pending.amount)} pending`
      : "No pending withdrawal";

  return (
    <div>
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              Separate Pi Testnet experience
            </p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">Meridian on Pi.</h1>
                <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
                  Explore Meridian Protocol from Pi Browser, authenticate with your Pi username on Testnet, and inspect public MRDN contract data from BNB Smart Chain.
                </p>
              </div>
              <div className="rounded-2xl border border-status-live/20 bg-status-live/5 p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-ink"><ShieldCheck className="h-4 w-4 text-status-live" /> Two separate networks</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">Pi is used here for Testnet identity only. MRDN remains a BNB Smart Chain token; this page does not imply a Pi token, partnership, or endorsement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border">
        <div className="container-page py-12 sm:py-14">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-surface-border bg-surface/30 p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">Pi Network · Testnet</p>
              <h2 className="mt-3 text-xl font-medium text-ink">Verify your Pi identity</h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">Sign-in asks only for your Pi username. Meridian sends the temporary access token to its Worker for verification with Pi; the token is not saved in browser storage.</p>

              {identity ? (
                <div className="mt-6 rounded-xl border border-status-live/25 bg-status-live/5 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-ink"><CircleCheck className="h-4 w-4 text-status-live" /> Pi identity verified</p>
                  <p className="mt-2 text-[14px] text-ink-dim">@{identity.username}</p>
                  <button onClick={signOut} className="mt-4 inline-flex items-center gap-2 text-[12px] text-ink-faint hover:text-ink"><LogOut className="h-3.5 w-3.5" /> Clear this page’s verified identity</button>
                  <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">This clears the local display state. Pi permission revocation is managed in Pi Browser.</p>
                </div>
              ) : (
                <button
                  onClick={signIn}
                  disabled={signingIn || sdkState !== "ready"}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-line px-5 py-3 text-sm font-semibold text-base-deep transition hover:bg-line-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {signingIn || sdkState === "loading" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
                  {signingIn ? "Verifying with Pi…" : sdkState === "loading" ? "Loading Pi SDK…" : "Continue with Pi username"}
                </button>
              )}

              {sdkState === "unavailable" ? <p className="mt-3 text-[12px] text-amber-200">{sdkMessage}</p> : null}
              {authError ? <p role="alert" className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-amber-200"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />{authError}</p> : null}
              {notice ? <p role="status" className="mt-3 text-[12px] leading-relaxed text-amber-200">{notice}</p> : null}

              <div className="mt-5 border-t border-surface-border pt-4 text-[11px] leading-relaxed text-ink-faint">
                Pi Testnet authentication is separate from Meridian’s existing account sign-in. It does not create a BNB wallet session or authorize transactions.
              </div>
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface/20 p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">BNB Smart Chain · Read only</p>
                  <h2 className="mt-3 text-xl font-medium text-ink">MRDN transparency</h2>
                </div>
                <button onClick={() => void refreshData()} disabled={loadingData} className="inline-flex items-center gap-2 rounded-full border border-surface-border px-3 py-2 text-[12px] text-ink-dim transition hover:text-ink disabled:opacity-50">
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              {loadingData && !snapshot ? <p className="mt-7 text-sm text-ink-faint">Reading public BNB contracts…</p> : null}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Metric label="MRDN total supply" value={formatMrdn(snapshot?.totalSupply.raw ?? null)} href={CONTRACTS.token.explorer} />
                <Metric label="Total staked" value={formatMrdn(snapshot?.totalStaked.raw ?? null)} href={CONTRACTS.staking.explorer} />
                <Metric label="Staking reward pool" value={formatMrdn(snapshot?.rewardPool.raw ?? null)} href={CONTRACTS.staking.explorer} />
                <Metric label="Vesting released" value={formatMrdn(snapshot?.vestingReleased.raw ?? null)} href={CONTRACTS.vesting.explorer} />
                <Metric label="Vesting allocation" value={formatMrdn(snapshot?.vestingAllocation.raw ?? null)} href={CONTRACTS.vesting.explorer} />
                <Metric label="Treasury balance" value={formatMrdn(snapshot?.treasuryBalance.raw ?? null)} href={CONTRACTS.treasury.explorer} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-surface-border p-4">
                  <p className="text-[11px] text-ink-faint">Treasury timelock minimum delay</p>
                  <p className="mt-2 text-sm font-medium text-ink">{formatDuration(snapshot?.treasuryMinDelay.raw ?? null)}</p>
                </div>
                <div className="rounded-xl border border-surface-border p-4">
                  <p className="text-[11px] text-ink-faint">Pending withdrawal</p>
                  <p className="mt-2 text-sm font-medium text-ink">{pendingSummary}</p>
                  {pending?.exists && pending.to ? <a href={`https://bscscan.com/address/${pending.to}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-line hover:underline">To {pending.to.slice(0, 8)}…{pending.to.slice(-6)} <ExternalLink className="h-3 w-3" /></a> : null}
                  {pending?.exists ? <p className="mt-1 text-[11px] text-ink-faint">Executable after {pending.executableAfter ? new Date(Number(pending.executableAfter) * 1000).toLocaleString() : "unavailable"}</p> : null}
                </div>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
                {snapshot ? `Fetched ${new Date(snapshot.fetchedAt).toLocaleTimeString()}.` : "Values will appear when the BNB RPC responds."} Each value is read from the listed BNB contract; failed individual reads show as unavailable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border">
        <div className="container-page py-12 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-line">How Meridian works</p>
                <h2 className="mt-3 text-2xl font-medium text-ink">Public contracts, clear boundaries.</h2>
                <div className="mt-6 space-y-4 text-[13.5px] leading-relaxed text-ink-dim">
                  <p><strong className="font-medium text-ink">MRDN</strong> is a fixed-supply BEP-20 token on BNB Smart Chain. This Pi page only reads public contract data and does not move or custody tokens.</p>
                  <p><strong className="font-medium text-ink">Staking</strong> lets users deposit MRDN into the staking contract. The dashboard values are live contract state; they are not a promise of future rewards.</p>
                  <p><strong className="font-medium text-ink">Vesting</strong> reports the allocation and amount released by the deployed vesting contract. Check its source and transactions on BscScan.</p>
                  <p><strong className="font-medium text-ink">Treasury</strong> holds its MRDN allocation behind a timelock. A planned withdrawal can be inspected through the public pending state and contract history.</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <ArrowDownToLine className="h-4 w-4 text-line" />
                  <h2 className="text-lg font-medium text-ink">Verified BNB contracts</h2>
                </div>
                <div className="mt-4 space-y-3">
                  <ContractLink name={CONTRACTS.token.name} address={TOKEN_CONFIG.contractAddress} href={CONTRACTS.token.explorer} />
                  <ContractLink name={CONTRACTS.staking.name} address={CONTRACTS.staking.address} href={CONTRACTS.staking.explorer} />
                  <ContractLink name={CONTRACTS.vesting.name} address={CONTRACTS.vesting.address} href={CONTRACTS.vesting.explorer} />
                  <ContractLink name={CONTRACTS.treasury.name} address={CONTRACTS.treasury.address} href={CONTRACTS.treasury.explorer} />
                </div>
                <a href={`${CONTRACTS.token.explorer}#transactions`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-[12px] text-line hover:underline">
                  Open public MRDN transaction history on BscScan <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <p className="mt-2 text-[11px] text-ink-faint">A separate live transaction index is not configured; the link opens the explorer’s public record.</p>
              </div>
            </div>

            <div className="mt-10 flex items-start gap-3 rounded-xl border border-surface-border bg-surface/20 p-4 text-[12px] leading-relaxed text-ink-faint">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-line" />
              <p>This page is for Testnet Pi authentication and public BNB data only. It does not implement Pi payments, Pi deposits or withdrawals, MRDN purchases, sales, swaps, or bridges. Meridian does not promise returns, price appreciation, or exchange listings.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
