import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CircleAlert,
  CircleCheck,
  Clipboard,
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
type AuthStage = "idle" | "pi" | "server";

const PI_AUTH_TIMEOUT_MS = 30_000;
const PI_INIT_TIMEOUT_MS = 20_000;

function withTimeout<T>(operation: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([operation, timeout]).finally(() => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  });
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-line sm:text-[11px]">
      {children}
    </p>
  );
}

function Metric({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <article className="group min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors hover:border-line/25 hover:bg-white/[0.04] sm:p-5">
      <p className="text-[11px] font-medium leading-5 text-slate-400">{label}</p>
      <p className="mt-3 break-words font-display text-xl font-medium tracking-tight text-white sm:text-[23px]">{value}</p>
      <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-8 items-center gap-1 text-[11px] font-medium text-line-soft hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line">
        Verify on BscScan <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </article>
  );
}

function ContractCard({
  name,
  address,
  href,
  copied,
  onCopy,
}: {
  name: string;
  address: string;
  href: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#0d1421] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{name}</h3>
          <p className="mt-2 break-all font-mono text-[11px] leading-5 text-slate-400 sm:text-xs">{address}</p>
        </div>
        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-line" aria-label="Verified contract source" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-3">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-[11px] font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line"
          aria-label={`Copy ${name} contract address`}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy address"}
        </button>
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-[11px] font-medium text-line-soft transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line">
          BscScan <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function PiNetwork() {
  const [sdkState, setSdkState] = useState<SdkState>("loading");
  const [sdkMessage, setSdkMessage] = useState("");
  const [identity, setIdentity] = useState<PiVerifiedIdentity | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("idle");
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const [snapshot, setSnapshot] = useState<PiTransparencySnapshot | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [copiedAddress, setCopiedAddress] = useState("");
  const [copyError, setCopyError] = useState("");

  const refreshData = useCallback(async () => {
    setLoadingData(true);
    setDataError("");
    try {
      setSnapshot(await fetchPiTransparency());
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Live BNB contract data is temporarily unavailable.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    withTimeout(
      initializePiTestnet(),
      PI_INIT_TIMEOUT_MS,
      "Pi SDK initialization timed out. Check your connection and reload this page.",
    )
      .then(() => {
        if (active) setSdkState("ready");
      })
      .catch((error: unknown) => {
        if (active) {
          setSdkState("unavailable");
          setSdkMessage(error instanceof Error ? error.message : "Pi SDK could not start. Please reload and try again.");
        }
      });
    void refreshData();
    return () => {
      active = false;
    };
  }, [refreshData]);

  const signIn = async () => {
    setSigningIn(true);
    setAuthStage("pi");
    setAuthTimedOut(false);
    setAuthError("");
    setNotice("");
    let failedStage: AuthStage = "pi";
    try {
      // Invoke Pi.authenticate synchronously inside this click handler so Pi
      // Browser can present authorization from the user's gesture.
      const authentication = authenticateWithPi(() => {
        setNotice("Pi reported an incomplete payment on this account. This read-only Pi experience cannot approve or complete payments; resolve it in Pi support before retrying sign-in.");
      });
      const auth = await withTimeout(
        authentication,
        PI_AUTH_TIMEOUT_MS,
        "Pi authorization did not respond within 30 seconds. Confirm this is open in Pi Browser or the authorized Pi Sandbox; reload before retrying.",
      );
      if (!auth.accessToken || auth.accessToken.length > 4_096) {
        throw new Error("Pi returned an invalid sign-in token.");
      }

      setAuthStage("server");
      failedStage = "server";
      const controller = new AbortController();
      const verificationTimeout = window.setTimeout(() => controller.abort(), 10_000);
      let response: Response;
      try {
        response = await fetch("/api/pi/verify", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ accessToken: auth.accessToken }),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(verificationTimeout);
      }
      if (!response.headers.get("Content-Type")?.toLowerCase().includes("application/json")) {
        throw new Error("Pi verification returned an unexpected response. Check the Testnet Worker and try again.");
      }
      const result = (await response.json()) as { user?: PiVerifiedIdentity; error?: string };
      if (!response.ok || !result.user?.uid || !result.user.username) {
        if (response.status === 429) throw new Error("Please wait a minute before trying Pi sign-in again.");
        if (response.status === 503) throw new Error("Pi verification is not configured on this Testnet Worker yet.");
        if (response.status === 401) throw new Error("Pi rejected this sign-in token. Please start again.");
        throw new Error("Meridian could not verify this Pi identity. Please try again.");
      }
      setIdentity(result.user);
    } catch (error) {
      if (error instanceof Error && error.message.includes("did not respond within 30 seconds")) {
        setAuthTimedOut(true);
      }
      const message = error instanceof DOMException && error.name === "AbortError"
        ? "The Testnet Worker did not finish verifying Pi within 10 seconds. Please retry."
        : error instanceof Error ? error.message : "Pi sign-in was cancelled or failed.";
      setAuthError(`${failedStage === "pi" ? "Pi authorization" : "Meridian server verification"}: ${message}`);
    } finally {
      setAuthStage("idle");
      setSigningIn(false);
    }
  };

  const copyAddress = async (name: string, address: string) => {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(name);
      window.setTimeout(() => setCopiedAddress((current) => current === name ? "" : current), 1_800);
    } catch {
      setCopyError("Clipboard access is unavailable in this browser. Select the address and copy it manually.");
    }
  };

  const signOut = () => {
    setIdentity(null);
    setAuthError("");
    setNotice("");
  };

  const pending = snapshot?.pendingWithdrawal;
  const pendingSummary = pending?.exists === null || pending?.exists === undefined
    ? "Unavailable"
    : pending.exists
      ? `${formatMrdn(pending.amount)} pending`
      : "No pending withdrawal";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b13] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#080d17]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-line" aria-label="Meridian Protocol Pi experience home">
            <img src="/favicon/token-icon.png" alt="" className="h-9 w-9 rounded-full border border-line/30" />
            <span className="min-w-0">
              <span className="block truncate font-display text-[13px] font-semibold tracking-[0.16em] text-white sm:text-sm">MERIDIAN PROTOCOL</span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">MRDN · BNB Smart Chain</span>
            </span>
          </a>
          <nav aria-label="Pi experience sections" className="hidden items-center gap-6 md:flex">
            <a href="#identity" className="text-xs text-slate-400 transition hover:text-white">Pi identity</a>
            <a href="#transparency" className="text-xs text-slate-400 transition hover:text-white">Transparency</a>
            <a href="#contracts" className="text-xs text-slate-400 transition hover:text-white">Contracts</a>
          </nav>
          <span className="shrink-0 rounded-full border border-line/25 bg-line/[0.06] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-line-soft sm:px-3.5 sm:text-[10px]">Pi Testnet</span>
        </div>
        <nav aria-label="Pi experience sections" className="flex gap-5 overflow-x-auto border-t border-white/[0.05] px-4 py-2.5 md:hidden">
          <a href="#identity" className="shrink-0 text-[11px] text-slate-400">Pi identity</a>
          <a href="#transparency" className="shrink-0 text-[11px] text-slate-400">Transparency</a>
          <a href="#contracts" className="shrink-0 text-[11px] text-slate-400">Contracts</a>
        </nav>
      </header>

      <main id="top">
        <section className="relative isolate border-b border-white/[0.07]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_65%_at_50%_-20%,rgba(201,162,39,0.15),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-meridian-grid bg-grid opacity-35" />
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <SectionLabel>Private identity · Public transparency</SectionLabel>
              <h1 className="mt-5 max-w-3xl font-display text-[2.65rem] font-medium leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.5rem]">
                Meridian, in <span className="text-gradient">clear view.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
                Explore Meridian Protocol through Pi Browser, verify a Pi username on Testnet, and review live public MRDN contract data from BNB Smart Chain.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#identity" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#d5b13b] to-[#f0d77b] px-5 py-3 text-[13px] font-semibold text-[#111318] shadow-[0_8px_30px_rgba(201,162,39,0.16)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Verify Pi identity <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="#transparency" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line">
                  View public data
                </a>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[26px] border border-line/20 bg-[#0c121d]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:p-7">
              <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-line/10 blur-3xl" aria-hidden="true" />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">Network boundary</p>
                  <h2 className="mt-2 font-display text-lg font-medium text-white">Two networks. Clear roles.</h2>
                </div>
                <ShieldCheck className="h-6 w-6 shrink-0 text-line" aria-hidden="true" />
              </div>
              <div className="relative mt-6 grid gap-3">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <span><span className="block text-sm font-semibold text-white">Pi Network</span><span className="mt-1 block text-xs text-slate-400">Testnet identity only</span></span>
                  <span className="rounded-full bg-violet-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-violet-200">Pi</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <span><span className="block text-sm font-semibold text-white">BNB Smart Chain</span><span className="mt-1 block text-xs text-slate-400">MRDN contracts & public data</span></span>
                  <span className="rounded-full bg-line/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-line-soft">BSC</span>
                </div>
              </div>
              <p className="relative mt-4 text-[11px] leading-5 text-slate-500">This experience does not represent MRDN as a Pi token or claim Pi Network endorsement.</p>
            </aside>
          </div>
        </section>

        <section id="identity" className="scroll-mt-28 border-b border-white/[0.07] bg-[#090e18]">
          <div className="mx-auto grid max-w-6xl gap-7 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div className="max-w-md">
              <SectionLabel>01 · Pi Network · Testnet</SectionLabel>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">Your Pi identity, verified.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">Sign in with the username permission only. Meridian verifies the temporary Pi token before showing your identity; the token stays out of browser storage.</p>
              <p className="mt-4 text-xs leading-6 text-slate-500">Pi sign-in is separate from Meridian account access. It does not connect a BNB wallet or authorize blockchain transactions.</p>
            </div>

            <div className="rounded-[24px] border border-white/[0.09] bg-gradient-to-br from-[#111a29] to-[#0b111c] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.2)] sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line/20 bg-line/[0.08] text-line"><Fingerprint className="h-5 w-5" aria-hidden="true" /></div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-medium text-white">Continue securely</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">Authentication runs through the official Pi SDK and Meridian’s Testnet Worker.</p>
                </div>
              </div>

              {identity ? (
                <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 sm:p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white"><CircleCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" /> Pi identity verified</p>
                  <p className="mt-3 font-display text-xl text-emerald-100">@{identity.username}</p>
                  <button type="button" onClick={signOut} className="mt-4 inline-flex min-h-9 items-center gap-2 text-xs text-slate-400 hover:text-white"><LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Clear this page’s identity</button>
                  <p className="mt-2 text-[10px] leading-5 text-slate-500">The display is held in memory and clears when this page is refreshed.</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={signIn}
                  disabled={signingIn || authTimedOut || sdkState !== "ready"}
                  className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#d5b13b] to-[#f0d77b] px-5 py-3 text-sm font-semibold text-[#111318] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {signingIn || sdkState === "loading" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Fingerprint className="h-4 w-4" aria-hidden="true" />}
                  {signingIn
                    ? authStage === "pi" ? "Waiting for Pi authorization…" : "Verifying your identity…"
                    : authTimedOut ? "Reload page to retry Pi sign-in"
                      : sdkState === "loading" ? "Preparing Pi sign-in…" : "Continue with Pi username"}
                </button>
              )}

              {signingIn ? <p role="status" className="mt-3 text-xs leading-5 text-slate-400">{authStage === "pi" ? "Waiting for the Pi Browser authorization prompt (up to 30 seconds)." : "Pi approved the request; Meridian is verifying it securely."}</p> : null}
              {sdkState === "unavailable" ? <p role="alert" className="mt-3 text-xs leading-5 text-amber-200">{sdkMessage}</p> : null}
              {authError ? <p role="alert" className="mt-3 flex items-start gap-2 text-xs leading-5 text-amber-200"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{authError}</p> : null}
              {notice ? <p role="status" className="mt-3 text-xs leading-5 text-amber-200">{notice}</p> : null}
            </div>
          </div>
        </section>

        <section id="transparency" className="scroll-mt-28 border-b border-white/[0.07]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>02 · BNB Smart Chain · Read only</SectionLabel>
                <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">MRDN transparency dashboard</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Public values are read directly from the verified BNB contracts. No Pi balance or transaction is involved.</p>
              </div>
              <button type="button" onClick={() => void refreshData()} disabled={loadingData} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-line/30 hover:bg-white/[0.04] disabled:opacity-50 sm:self-auto">
                <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} aria-hidden="true" /> Refresh data
              </button>
            </div>

            {loadingData && !snapshot ? <p role="status" className="mt-7 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 text-sm text-slate-400">Reading public BNB contracts…</p> : null}
            {dataError ? <p role="alert" className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-xs leading-6 text-amber-100">{dataError}</p> : null}
            {snapshot?.status === "partial" ? <p role="status" className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-xs leading-6 text-amber-100">Some contract reads did not respond. Available values are live; unavailable values can be retried.</p> : null}

            <div className="mt-7 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3">
              <Metric label="MRDN total supply" value={formatMrdn(snapshot?.totalSupply.raw ?? null)} href={CONTRACTS.token.explorer} />
              <Metric label="Total staked" value={formatMrdn(snapshot?.totalStaked.raw ?? null)} href={CONTRACTS.staking.explorer} />
              <Metric label="Staking reward pool" value={formatMrdn(snapshot?.rewardPool.raw ?? null)} href={CONTRACTS.staking.explorer} />
              <Metric label="Vesting released" value={formatMrdn(snapshot?.vestingReleased.raw ?? null)} href={CONTRACTS.vesting.explorer} />
              <Metric label="Vesting allocation" value={formatMrdn(snapshot?.vestingAllocation.raw ?? null)} href={CONTRACTS.vesting.explorer} />
              <Metric label="Treasury balance" value={formatMrdn(snapshot?.treasuryBalance.raw ?? null)} href={CONTRACTS.treasury.explorer} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
                <p className="text-[11px] font-medium text-slate-400">Treasury timelock minimum delay</p>
                <p className="mt-2 font-display text-lg font-medium text-white">{formatDuration(snapshot?.treasuryMinDelay.raw ?? null)}</p>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
                <p className="text-[11px] font-medium text-slate-400">Pending withdrawal</p>
                <p className="mt-2 font-display text-lg font-medium text-white">{pendingSummary}</p>
                {pending?.exists && pending.to ? <a href={`https://bscscan.com/address/${pending.to}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 break-all font-mono text-[10px] text-line-soft hover:underline">Recipient {pending.to} <ExternalLink className="h-3 w-3 shrink-0" /></a> : null}
                {pending?.exists ? <p className="mt-1 text-[10px] text-slate-500">Executable after {pending.executableAfter ? new Date(Number(pending.executableAfter) * 1000).toLocaleString() : "unavailable"}</p> : null}
              </article>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-slate-500">{snapshot ? `Fetched ${new Date(snapshot.fetchedAt).toLocaleTimeString()}.` : "Unavailable values are shown honestly and can be retried."} Values are public contract reads; network delays or provider outages may affect availability.</p>
          </div>
        </section>

        <section id="contracts" className="scroll-mt-28 border-b border-white/[0.07] bg-[#090e18]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <SectionLabel>03 · Verified BNB Smart Chain contracts</SectionLabel>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">Public addresses. Independently verifiable.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">These contracts are on BNB Smart Chain mainnet. Verify each address on BscScan before using it elsewhere.</p>
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 text-[10px] font-medium text-emerald-200 sm:self-auto"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> BNB Chain · Chain ID 56</span>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {Object.values(CONTRACTS).map((contract) => (
                <ContractCard
                  key={contract.address}
                  name={contract.name}
                  address={contract.address}
                  href={contract.explorer}
                  copied={copiedAddress === contract.name}
                  onCopy={() => void copyAddress(contract.name, contract.address)}
                />
              ))}
            </div>
            {copyError ? <p role="status" className="mt-3 text-xs text-amber-200">{copyError}</p> : null}
            <a href={`${CONTRACTS.token.explorer}#transactions`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-10 items-center gap-2 text-xs font-medium text-line-soft hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line">
              View public MRDN transaction history <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="border-b border-white/[0.07]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <SectionLabel>04 · Protocol overview</SectionLabel>
            <h2 className="mt-3 max-w-2xl font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">How Meridian Protocol works</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">A concise guide to the public BNB infrastructure this Pi experience can inspect.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { number: "01", title: "MRDN token", copy: `MRDN is a fixed-supply ${TOKEN_CONFIG.standard} token deployed on BNB Smart Chain. This page only reads its public state.` },
                { number: "02", title: "Staking", copy: "The staking contract records deposits and reward-pool state. Displayed figures do not promise future rewards." },
                { number: "03", title: "Vesting", copy: "Public vesting data shows the deployed allocation and released amount. Check on-chain transactions for current state." },
                { number: "04", title: "Treasury", copy: "The treasury allocation is managed through a timelock contract. Its public balance and pending operation state are shown when available." },
              ].map((item) => (
                <article key={item.number} className="rounded-2xl border border-white/[0.07] bg-[#0c121d] p-5">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-line">{item.number}</p>
                  <h3 className="mt-4 font-display text-base font-medium text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-400">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-[24px] border border-line/15 bg-gradient-to-br from-[#141a24] via-[#101620] to-[#0c121b] p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-line" aria-hidden="true" />
              <div>
                <SectionLabel>05 · Security & network disclosure</SectionLabel>
                <h2 className="mt-2 font-display text-lg font-medium text-white">Separate identity. Read-only BNB data.</h2>
                <p className="mt-3 max-w-4xl text-xs leading-6 text-slate-400">Pi is used only for Testnet username authentication in this application. MRDN remains on BNB Smart Chain. This experience does not provide Pi payments, deposits, withdrawals, token purchases or sales, swaps, transfers, or bridges. Pi login does not connect a BNB wallet or authorize transactions. Public chain data may be delayed, incomplete, or unavailable; verify addresses and transactions independently. Nothing here guarantees staking rewards, returns, price appreciation, or exchange listings. Meridian does not claim Pi Network endorsement or partnership.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] bg-[#060a11]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <a href="#top" className="inline-flex items-center gap-2.5 rounded-md text-slate-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-line">
            <img src="/favicon/token-icon.png" alt="" className="h-7 w-7 rounded-full border border-line/25" />
            <span><span className="block font-display text-[11px] font-semibold tracking-[0.15em]">MERIDIAN PROTOCOL</span><span className="mt-1 block text-[10px] text-slate-500">Pi Testnet identity · BNB public data</span></span>
          </a>
          <nav aria-label="Pi Testnet legal pages" className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <Link to="/pi/privacy" className="text-slate-400 transition hover:text-line-soft">Privacy policy</Link>
            <Link to="/pi/terms" className="text-slate-400 transition hover:text-line-soft">Terms of service</Link>
            <a href="https://meridianprotocol.site/" className="inline-flex items-center gap-1 text-slate-400 transition hover:text-line-soft">Main website <ExternalLink className="h-3 w-3" aria-hidden="true" /></a>
          </nav>
          <p className="text-[10px] text-slate-600">© {new Date().getFullYear()} Meridian Protocol</p>
        </div>
      </footer>
    </div>
  );
}
