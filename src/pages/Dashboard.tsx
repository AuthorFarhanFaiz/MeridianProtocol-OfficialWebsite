import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Wallet, RefreshCw } from "lucide-react";
import { TOKEN_CONFIG } from "@/data/token";

const BSC_RPC = "https://bsc-dataseed.binance.org/";
const MRDN_ADDRESS = "0xd4025a390a0b2a606f24Ea33A902D10D978715F2";
const STAKING_ADDRESS = "0xE4679e407A4967f7182E87C1bc25Dcc786c3D3eb";
const VESTING_ADDRESS = "0xCb89849805B44A9D8Ee11B5D40cd6962d4fF93f7";

const ERC20_ABI = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];
const STAKING_ABI = [
  "function totalStaked() view returns (uint256)",
  "function rewardPoolBalance() view returns (uint256)",
  "function stakedBalanceOf(address) view returns (uint256)",
  "function earned(address) view returns (uint256)",
];
const VESTING_ABI = [
  "function totalAllocation() view returns (uint256)",
  "function totalReleased() view returns (uint256)",
];

function formatMRDN(raw: unknown): string {
  if (raw === null || raw === undefined) return "—";
  try {
    const value = Number(raw) / 1e18;
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  } catch {
    return "—";
  }
}

function StatCard(props: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const { label, value, sub, href } = props;
  return (
    <div className="rounded-2xl border border-surface-border bg-surface/40 p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
        {label}
      </p>
      <p className="mt-2 text-2xl font-medium text-ink">{value}</p>
      {sub ? <p className="mt-1 text-[12.5px] text-ink-dim">{sub}</p> : null}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-[11px] text-line hover:underline"
        >
          Verify on BscScan <ExternalLink className="h-3 w-3" />
        </a>
      ) : null}
    </div>
  );
}

export default function Dashboard() {
  const [ethersLib, setEthersLib] = useState<any>(null);
  const [chainData, setChainData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<any>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const w = window as any;
    if (w.ethers) {
      setEthersLib(w.ethers);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.4/ethers.umd.min.js";
    script.async = true;
    script.onload = () => setEthersLib((window as any).ethers);
    script.onerror = () =>
      setError("Could not load on-chain library. Please refresh.");
    document.body.appendChild(script);
  }, []);

  const fetchChainData = useCallback(async (ethers: any) => {
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.JsonRpcProvider(BSC_RPC);
      const token = new ethers.Contract(MRDN_ADDRESS, ERC20_ABI, provider);
      const staking = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, provider);
      const vesting = new ethers.Contract(VESTING_ADDRESS, VESTING_ABI, provider);

      const [totalSupply, totalStaked, rewardPoolBalance, totalAllocation, totalReleased] =
        await Promise.all([
          token.totalSupply(),
          staking.totalStaked(),
          staking.rewardPoolBalance(),
          vesting.totalAllocation(),
          vesting.totalReleased(),
        ]);

      setChainData({
        totalSupply,
        totalStaked,
        rewardPoolBalance,
        totalAllocation,
        totalReleased,
        fetchedAt: new Date(),
      });
    } catch {
      setError("Could not reach BNB Smart Chain right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ethersLib) fetchChainData(ethersLib);
  }, [ethersLib, fetchChainData]);

  const connectWallet = async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      setError("No wallet extension detected. Install MetaMask or a similar wallet.");
      return;
    }
    if (!ethersLib) return;

    setConnecting(true);
    setError(null);
    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      const addr = accounts[0] as string;
      setAccount(addr);

      const provider = new ethersLib.JsonRpcProvider(BSC_RPC);
      const token = new ethersLib.Contract(MRDN_ADDRESS, ERC20_ABI, provider);
      const staking = new ethersLib.Contract(STAKING_ADDRESS, STAKING_ABI, provider);

      const [balance, staked, earned] = await Promise.all([
        token.balanceOf(addr),
        staking.stakedBalanceOf(addr),
        staking.earned(addr),
      ]);

      setAccountData({ balance, staked, earned });
    } catch {
      setError("Wallet connection was cancelled or failed.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div>
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Live Data
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                Dashboard
              </h1>
              <button
                onClick={() => ethersLib && fetchChainData(ethersLib)}
                className="inline-flex items-center gap-1.5 rounded-full border border-surface-border px-4 py-2 text-[13px] text-ink-dim transition hover:text-ink"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
              Every figure on this page is read directly from BNB Smart Chain at
              load time. Click “Verify on BscScan” to confirm independently.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-12">
          <div className="mx-auto max-w-4xl">
            {error ? (
              <div className="mb-8 rounded-2xl border border-amber-600/40 bg-amber-500/10 p-4 text-[13.5px] text-amber-200">
                {error}
              </div>
            ) : null}

            {loading && !chainData ? (
              <p className="text-[14px] text-ink-faint">Loading live on-chain data…</p>
            ) : null}

            {chainData ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <StatCard
                    label="MRDN Total Supply"
                    value={formatMRDN(chainData.totalSupply)}
                    href={`https://bscscan.com/token/${MRDN_ADDRESS}`}
                  />
                  <StatCard
                    label="Total Staked"
                    value={formatMRDN(chainData.totalStaked)}
                    sub="MRDN currently in the staking contract"
                    href={`https://bscscan.com/address/${STAKING_ADDRESS}`}
                  />
                  <StatCard
                    label="Reward Pool Balance"
                    value={formatMRDN(chainData.rewardPoolBalance)}
                    sub="Available to pay stakers"
                    href={`https://bscscan.com/address/${STAKING_ADDRESS}`}
                  />
                  <StatCard
                    label="Vesting Contract"
                    value={`${formatMRDN(chainData.totalReleased)} released`}
                    sub={`of ${formatMRDN(chainData.totalAllocation)} total allocation`}
                    href={`https://bscscan.com/address/${VESTING_ADDRESS}`}
                  />
                </div>
                <p className="mt-4 text-[12px] text-ink-faint">
                  Last fetched: {chainData.fetchedAt.toLocaleTimeString()}
                </p>
              </>
            ) : null}

            <div className="mt-12 rounded-2xl border border-surface-border bg-surface/30 p-6 sm:p-8">
              <h2 className="text-lg font-medium text-ink">Check Your Own Balance</h2>
              <p className="mt-2 text-[14px] text-ink-dim">
                Connect your wallet to view your own MRDN balance and staking
                position. Read-only — no seed phrase, no transactions.
              </p>

              {!account ? (
                <button
                  onClick={connectWallet}
                  disabled={connecting || !ethersLib}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-line px-5 py-3 text-[13.5px] font-semibold text-base-deep transition hover:bg-line-soft disabled:opacity-50"
                >
                  <Wallet className="h-4 w-4" />
                  {connecting ? "Connecting…" : "Connect Wallet (view-only)"}
                </button>
              ) : (
                <div className="mt-5">
                  <p className="break-all font-mono text-[12.5px] text-ink-faint">{account}</p>
                  {accountData ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-ink-faint">
                          MRDN Balance
                        </p>
                        <p className="mt-1 text-lg text-ink">
                          {formatMRDN(accountData.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-ink-faint">
                          Staked
                        </p>
                        <p className="mt-1 text-lg text-ink">
                          {formatMRDN(accountData.staked)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-ink-faint">
                          Earned (unclaimed)
                        </p>
                        <p className="mt-1 text-lg text-ink">
                          {formatMRDN(accountData.earned)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <p className="mt-10 text-[12px] leading-relaxed text-ink-faint">
              This dashboard does not buy, sell, transfer, or custody any token.
              {TOKEN_CONFIG.symbol} is not currently listed for public trading.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
