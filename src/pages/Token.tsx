import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { TOKEN_CONFIG, CONTRACTS } from "@/data/token";
import StatusBadge from "@/components/StatusBadge";

const FACTS: { label: string; value: string }[] = [
  { label: "Token Name", value: TOKEN_CONFIG.name },
  { label: "Symbol", value: TOKEN_CONFIG.symbol },
  { label: "Blockchain", value: TOKEN_CONFIG.chain },
  { label: "Token Standard", value: TOKEN_CONFIG.standard },
  { label: "Decimals", value: String(TOKEN_CONFIG.decimals) },
  {
    label: "Total Supply",
    value: `${TOKEN_CONFIG.totalSupply} ${TOKEN_CONFIG.symbol}`,
  },
  {
    label: "Circulating Supply",
    value: TOKEN_CONFIG.circulatingSupply,
  },
  {
    label: "Contract Verified",
    value: TOKEN_CONFIG.contractVerified ? "Yes" : "No",
  },
];

const UTILITY = [
  { label: "Transferable BEP-20 Token", status: "LIVE" },
  { label: "Staking", status: "LIVE" },
  { label: "Team Vesting", status: "LIVE" },
  { label: "Treasury Timelock", status: "LIVE" },
  { label: "Community Structure", status: "IN DEVELOPMENT" },
  { label: "Governance Participation", status: "PLANNED" },
  { label: "Ecosystem Rewards", status: "PLANNED" },
];

const MRDN_ADDRESS =
  "0xd4025a390a0b2a606f24Ea33A902D10D978715F2";

const MRDN_IMAGE =
  "https://meridianprotocol.site/favicon/token-icon.png";

const BSC_CHAIN_ID = "0x38";

export default function Token() {
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(MRDN_ADDRESS);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  const getMetaMaskProvider = () => {
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      return null;
    }

    // Multiple wallet extensions can inject providers.
    // Prefer MetaMask specifically.
    if (Array.isArray(ethereum.providers)) {
      const metaMaskProvider = ethereum.providers.find(
        (provider: any) => provider.isMetaMask
      );

      if (metaMaskProvider) {
        return metaMaskProvider;
      }
    }

    // Standard MetaMask injection
    if (ethereum.isMetaMask) {
      return ethereum;
    }

    return ethereum;
  };

  const openMetaMaskMobile = () => {
    const dappUrl =
      `${window.location.host}${window.location.pathname}${window.location.search}`;

    window.location.href =
      `https://metamask.app.link/dapp/${dappUrl}`;
  };

  const addToMetaMask = async () => {
    if (adding) return;

    setAdding(true);

    try {
      const provider = getMetaMaskProvider();

      /*
       * MOBILE / NORMAL BROWSER
       *
       * If MetaMask provider isn't injected, open this website
       * directly inside MetaMask Mobile.
       */
      if (!provider) {
        openMetaMaskMobile();
        return;
      }

      /*
       * Make sure MetaMask is connected to BNB Smart Chain.
       * BSC Chain ID = 56 = 0x38
       */
      let chainId = await provider.request({
        method: "eth_chainId",
      });

      if (chainId !== BSC_CHAIN_ID) {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: BSC_CHAIN_ID,
              },
            ],
          });

          chainId = await provider.request({
            method: "eth_chainId",
          });
        } catch (switchError: any) {
          console.error(
            "Unable to switch to BNB Smart Chain:",
            switchError
          );

          alert(
            "Please switch MetaMask to BNB Smart Chain and try again."
          );

          return;
        }
      }

      /*
       * Explicit MRDN token data.
       *
       * Do NOT use TOKEN_CONFIG here.
       * This guarantees that the exact MRDN contract,
       * symbol, decimals and logo are sent to MetaMask.
       */
      const result = await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: MRDN_ADDRESS,
            symbol: "MRDN",
            decimals: 18,
            image: MRDN_IMAGE,
          },
        },
      });

      console.log("MRDN MetaMask result:", result);
    } catch (error: any) {
      console.error("MRDN MetaMask error:", error);

      if (error?.code === 4001) {
        console.log("User rejected the MetaMask request.");
      } else {
        alert(
          "Unable to add MRDN to MetaMask. Please open Meridian Protocol inside MetaMask and try again."
        );
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Token
            </p>

            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              MRDN
            </h1>

            <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
              A fixed-supply {TOKEN_CONFIG.standard} token on{" "}
              {TOKEN_CONFIG.chain}, built with transparency as a core
              principle. Utility is developed and disclosed openly.
            </p>
          </div>
        </div>
      </section>

      {/* Contract Card */}
      <section className="border-b border-surface-border">
        <div className="container-page py-12">
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface/40 p-6 backdrop-blur-sm">
              <div
                className="pointer-events-none absolute inset-0 card-glow"
                aria-hidden="true"
              />

              <div className="relative">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  Contract Address
                </p>

                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="break-all font-mono text-[14px] text-ink">
                    {MRDN_ADDRESS}
                  </p>

                  <div className="flex shrink-0 flex-wrap gap-2.5">
                    <button
                      onClick={copy}
                      className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface/60 px-4 py-2.5 text-[13px] font-medium text-ink-dim transition-all hover:border-line/30 hover:text-ink"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}

                      {copied ? "Copied" : "Copy"}
                    </button>

                    <button
                      onClick={addToMetaMask}
                      disabled={adding}
                      className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface/60 px-4 py-2.5 text-[13px] font-medium text-ink-dim transition-all hover:border-line/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {adding
                        ? "Opening MetaMask..."
                        : "Add to MetaMask"}
                    </button>

                    <a
                      href={TOKEN_CONFIG.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shine-sweep inline-flex items-center gap-1.5 rounded-full bg-line px-5 py-2.5 text-[13px] font-semibold text-base-deep transition-all hover:bg-line-soft hover:shadow-glow-sm"
                    >
                      BscScan
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick verification links */}
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                Independent verification
              </p>

              <div className="mt-3 flex flex-wrap gap-2.5">
                {[
                  { label: "Contract", suffix: "" },
                  { label: "Holders", suffix: "#balances" },
                  { label: "Transactions", suffix: "" },
                  { label: "Source Code", suffix: "#code" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={`${TOKEN_CONFIG.explorerUrl}${l.suffix}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-surface-border px-4 py-2 text-[12.5px] text-ink-dim transition-all duration-300 hover:border-line/40 hover:bg-surface/40 hover:text-ink"
                  >
                    {l.label}
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Facts */}
      <section className="border-b border-surface-border">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Specification
            </p>

            <h2 className="mt-2 text-xl font-medium text-ink">
              Token Facts
            </h2>

            <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {FACTS.map((f) => (
                <div
                  key={f.label}
                  className="border-b border-surface-border pb-4 transition-colors duration-300 hover:border-line/30"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                    {f.label}
                  </p>

                  <p className="mt-1.5 text-[15px] text-ink">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Utility Status */}
      <section className="border-b border-surface-border bg-surface/10">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Utility
            </p>

            <h2 className="mt-2 text-xl font-medium text-ink">
              Current Status
            </h2>

            <p className="mt-3 text-[14px] text-ink-dim">
              Each item is labeled by its actual status today.
            </p>

            <div className="mt-8 space-y-3">
              {UTILITY.map((u) => (
                <div
                  key={u.label}
                  className="flex items-center justify-between rounded-2xl border border-surface-border bg-base/70 px-5 py-4 transition-all duration-300 hover:border-line/20 hover:bg-surface/40"
                >
                  <span className="text-[14.5px] text-ink">
                    {u.label}
                  </span>

                  <StatusBadge
                    status={u.status}
                    tone={
                      u.status === "LIVE"
                        ? "live"
                        : u.status === "IN DEVELOPMENT"
                        ? "progress"
                        : "planned"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Contracts */}
      <section>
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Infrastructure
            </p>

            <h2 className="mt-2 text-xl font-medium text-ink">
              Supporting Contracts
            </h2>

            <div className="mt-8 space-y-4">
              {Object.values(CONTRACTS).map((c) => (
                <div
                  key={c.address}
                  className="rounded-2xl border border-surface-border bg-surface/30 p-5 transition-all duration-300 hover:border-line/20 hover:bg-surface/50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-[15px] font-medium text-ink">
                        {c.name}
                      </h3>

                      <p className="mt-1 break-all font-mono text-[12px] text-ink-faint">
                        {c.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge
                        status={c.status}
                        tone="live"
                      />

                      <a
                        href={c.explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] text-ink-dim hover:text-ink"
                      >
                        View
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
                  }
