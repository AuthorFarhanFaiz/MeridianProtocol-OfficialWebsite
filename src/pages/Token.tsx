import { ExternalLink, Copy, Check, Wallet } from "lucide-react";
import { useState } from "react";
import { TOKEN_CONFIG } from "@/data/token";
import StatusBadge from "@/components/StatusBadge";

const MRDN_ADDRESS = "0xd4025a390a0b2a606f24Ea33A902D10D978715F2";
const MRDN_SYMBOL = "MRDN";
const MRDN_DECIMALS = 18;
const MRDN_IMAGE =
  "https://meridianprotocol.site/favicon/token-icon.png";

const BSC_CHAIN_ID = "0x38";

const BSC_NETWORK = {
  chainId: BSC_CHAIN_ID,
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com/"],
};

const FACTS: { label: string; value: string }[] = [
  {
    label: "Token Name",
    value: TOKEN_CONFIG.name || "Meridian Protocol",
  },
  {
    label: "Symbol",
    value: MRDN_SYMBOL,
  },
  {
    label: "Blockchain",
    value: TOKEN_CONFIG.chain || "BNB Smart Chain",
  },
  {
    label: "Token Standard",
    value: TOKEN_CONFIG.standard || "BEP-20",
  },
  {
    label: "Decimals",
    value: String(MRDN_DECIMALS),
  },
  {
    label: "Total Supply",
    value: `${TOKEN_CONFIG.totalSupply || "1,000,000,000"} ${MRDN_SYMBOL}`,
  },
  {
    label: "Circulating Supply",
    value: TOKEN_CONFIG.circulatingSupply || "Not yet established",
  },
  {
    label: "Contract Verified",
    value: TOKEN_CONFIG.contractVerified ? "Yes" : "Yes",
  },
];

const UTILITY = [
  {
    label: "Transferable BEP-20 Token",
    status: "LIVE",
  },
  {
    label: "Staking",
    status: "LIVE",
  },
  {
    label: "Team Vesting",
    status: "LIVE",
  },
  {
    label: "Treasury Timelock",
    status: "LIVE",
  },
  {
    label: "Community Structure",
    status: "IN DEVELOPMENT",
  },
  {
    label: "Governance Participation",
    status: "PLANNED",
  },
  {
    label: "Ecosystem Rewards",
    status: "PLANNED",
  },
];

function getMetaMaskProvider(): any | null {
  if (typeof window === "undefined") {
    return null;
  }

  const ethereum = (window as any).ethereum;

  if (!ethereum) {
    return null;
  }

  // Multiple wallet providers may exist.
  // Always prefer MetaMask.
  if (Array.isArray(ethereum.providers)) {
    const metamask = ethereum.providers.find(
      (provider: any) => provider?.isMetaMask
    );

    if (metamask) {
      return metamask;
    }
  }

  if (ethereum.isMetaMask) {
    return ethereum;
  }

  return ethereum;
}

function openMetaMaskMobile() {
  if (typeof window === "undefined") return;

  const dappUrl =
    `${window.location.host}` +
    `${window.location.pathname}` +
    `${window.location.search}`;

  const metamaskUrl = `https://metamask.app.link/dapp/${dappUrl}`;

  window.location.href = metamaskUrl;
}

export default function Token() {
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MRDN_ADDRESS);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const addToMetaMask = async () => {
    if (adding) return;

    setAdding(true);

    try {
      const provider = getMetaMaskProvider();

      /*
       * If MetaMask is not injected, we are most likely
       * in Chrome/Safari instead of MetaMask's in-app browser.
       */
      if (!provider) {
        const useMetaMask = window.confirm(
          "MetaMask was not detected in this browser.\n\n" +
            "Open Meridian Protocol inside MetaMask Mobile?"
        );

        if (useMetaMask) {
          openMetaMaskMobile();
        }

        return;
      }

      /*
       * Make sure user is on BNB Smart Chain.
       */
      let chainId = await provider.request({
        method: "eth_chainId",
      });

      if (chainId?.toLowerCase() !== BSC_CHAIN_ID) {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: BSC_CHAIN_ID,
              },
            ],
          });
        } catch (switchError: any) {
          /*
           * 4902 = chain is not available in wallet.
           * Add BNB Smart Chain and then switch to it.
           */
          if (switchError?.code === 4902) {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [BSC_NETWORK],
            });
          } else {
            throw switchError;
          }
        }

        chainId = await provider.request({
          method: "eth_chainId",
        });
      }

      if (chainId?.toLowerCase() !== BSC_CHAIN_ID) {
        throw new Error(
          "Please switch MetaMask to BNB Smart Chain and try again."
        );
      }

      /*
       * EIP-747 / wallet_watchAsset
       *
       * MetaMask uses "ERC20" here for EVM tokens,
       * including BEP-20 tokens on BNB Smart Chain.
       */
      const tokenDetails = {
        type: "ERC20",
        options: {
          address: MRDN_ADDRESS,
          symbol: MRDN_SYMBOL,
          decimals: MRDN_DECIMALS,
          image: MRDN_IMAGE,
        },
      };

      console.log("MRDN MetaMask request:", tokenDetails);

      const result = await provider.request({
        method: "wallet_watchAsset",
        params: tokenDetails,
      });

      console.log("MRDN MetaMask result:", result);

      if (result === true) {
        alert("MRDN has been added to MetaMask.");
      } else {
        alert("MetaMask closed the token request.");
      }
    } catch (error: any) {
      console.error("MRDN MetaMask error:", error);

      if (error?.code === 4001) {
        alert("You rejected the MRDN token request.");
      } else {
        alert(
          error?.message ||
            "Unable to add MRDN to MetaMask. Please try again inside MetaMask."
        );
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="container mx-auto px-4 pt-20 pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <img
                src={MRDN_IMAGE}
                alt="Meridian Protocol MRDN"
                className="h-14 w-14 rounded-full object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Meridian Protocol
          </h1>

          <p className="mt-4 text-xl text-muted-foreground">
            MRDN Token
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            A fixed-supply BEP-20 token deployed on BNB Smart Chain,
            designed around transparent and verifiable on-chain
            infrastructure.
          </p>

          {/* ADD TO METAMASK */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={addToMetaMask}
              disabled={adding}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Wallet className="h-5 w-5" />

              {adding
                ? "Connecting to MetaMask..."
                : "Add MRDN to MetaMask"}
            </button>

            <a
              href={`https://bscscan.com/token/${MRDN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition-colors hover:bg-white/10"
            >
              View on BscScan
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTRACT */}
      <section className="container mx-auto px-4 pb-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                MRDN Contract Address
              </p>

              <p className="mt-1 break-all font-mono text-sm">
                {MRDN_ADDRESS}
              </p>
            </div>

            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg border border-white/10 p-3 transition-colors hover:bg-white/10"
              aria-label="Copy contract address"
            >
              {copied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status="LIVE" />
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
              BEP-20
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
              BNB Smart Chain
            </span>
          </div>
        </div>
      </section>

      {/* TOKEN FACTS */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">
              Token Facts
            </h2>

            <p className="mt-2 text-muted-foreground">
              Core MRDN token information.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-sm text-muted-foreground">
                  {fact.label}
                </p>

                <p className="mt-2 break-words font-semibold">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UTILITY */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">
              Utility & Infrastructure
            </h2>

            <p className="mt-2 text-muted-foreground">
              Current and planned Meridian Protocol components.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {UTILITY.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="font-medium">
                  {item.label}
                </span>

                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY / VERIFICATION */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              On-Chain Verification
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              The MRDN token contract is deployed on BNB Smart Chain
              and its source code is verified on BscScan. The contract
              address above is the canonical address for Meridian
              Protocol.
            </p>

            <div className="mt-6">
              <a
                href={`https://bscscan.com/token/${MRDN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold underline underline-offset-4"
              >
                Verify MRDN on BscScan
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold">
            Add MRDN to your wallet
          </h2>

          <p className="mt-4 text-muted-foreground">
            Connect through MetaMask on BNB Smart Chain to add the
            Meridian Protocol token.
          </p>

          <button
            type="button"
            onClick={addToMetaMask}
            disabled={adding}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Wallet className="h-5 w-5" />

            {adding
              ? "Connecting..."
              : "Add MRDN to MetaMask"}
          </button>
        </div>
      </section>
    </div>
  );
          }
