export type PiVerifiedIdentity = {
  uid: string;
  username: string;
};

export type PiAuthResult = {
  accessToken: string;
  user: PiVerifiedIdentity;
};

export type PiSdk = {
  init(config: { version: string; sandbox: boolean }): void | Promise<void>;
  authenticate(
    scopes: string[],
    onIncompletePaymentFound: (payment: unknown) => void,
  ): Promise<PiAuthResult>;
};

declare global {
  interface Window {
    Pi?: PiSdk;
  }
}

const PI_SDK_URL = "https://sdk.minepi.com/pi-sdk.js";
const PI_SDK_LOAD_TIMEOUT_MS = 15_000;
let sdkPromise: Promise<PiSdk> | undefined;
let sdkInitialized = false;

function isPiSdk(value: unknown): value is PiSdk {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as { init?: unknown; authenticate?: unknown };
  return typeof candidate.init === "function" && typeof candidate.authenticate === "function";
}

function loadPiSdk(): Promise<PiSdk> {
  if (isPiSdk(window.Pi)) return Promise.resolve(window.Pi);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<PiSdk>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PI_SDK_URL}"]`);
    const script = existing ?? document.createElement("script");
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
      if (error) reject(error);
      else if (isPiSdk(window.Pi)) resolve(window.Pi);
      else reject(new Error("Pi SDK loaded, but its authentication methods are unavailable."));
    };
    const onLoad = () => finish();
    const onError = () => finish(new Error("Could not load the Pi SDK. Check the connection and reload."));
    const timeoutId = window.setTimeout(
      () => finish(new Error("Pi SDK did not finish loading within 15 seconds. Check Pi Browser connectivity, then reload.")),
      PI_SDK_LOAD_TIMEOUT_MS,
    );

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (!existing) {
      script.src = PI_SDK_URL;
      script.async = true;
      document.head.appendChild(script);
    } else if (isPiSdk(window.Pi)) {
      finish();
    }
  }).catch((error: unknown) => {
    sdkPromise = undefined;
    throw error;
  });

  return sdkPromise;
}

export async function initializePiTestnet(): Promise<PiSdk> {
  const pi = await loadPiSdk();
  if (!sdkInitialized) {
    await pi.init({ version: "2.0", sandbox: true });
    sdkInitialized = true;
  }
  return pi;
}

export function authenticateWithPi(
  onIncompletePaymentFound: (payment: unknown) => void,
): Promise<PiAuthResult> {
  // Initialization must finish before enabling the button. Start auth directly
  // from its click handler to preserve Pi Browser's user-gesture context.
  const pi = window.Pi;
  if (!sdkInitialized || !pi?.authenticate) {
    return Promise.reject(new Error("Pi SDK is not ready. Reload the Pi page and try again."));
  }
  return pi.authenticate(["username"], onIncompletePaymentFound);
}
