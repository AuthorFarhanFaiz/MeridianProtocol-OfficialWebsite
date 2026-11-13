export type PiVerifiedIdentity = {
  uid: string;
  username: string;
};

type PiAuthResult = {
  accessToken: string;
  user: PiVerifiedIdentity;
};

type PiSdk = {
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

let sdkPromise: Promise<PiSdk> | undefined;
let sdkInitialized = false;

function loadPiSdk(): Promise<PiSdk> {
  if (window.Pi) return Promise.resolve(window.Pi);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<PiSdk>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://sdk.minepi.com/pi-sdk.js"]',
    );
    const script = existing ?? document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = () => {
      if (window.Pi) resolve(window.Pi);
      else reject(new Error("Pi SDK loaded without its expected interface."));
    };
    script.onerror = () => reject(new Error("Could not load Pi SDK."));
    if (!existing) document.head.appendChild(script);
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

export async function authenticateWithPi(
  onIncompletePaymentFound: (payment: unknown) => void,
): Promise<PiAuthResult> {
  const pi = await initializePiTestnet();
  return pi.authenticate(["username"], onIncompletePaymentFound);
}
