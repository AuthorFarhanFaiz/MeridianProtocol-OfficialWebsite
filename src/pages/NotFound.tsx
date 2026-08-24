import Button from "@/components/Button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-32 text-center">
      <div className="pointer-events-none absolute inset-0 grid-field" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />

      <div className="container-page relative">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line/20 bg-line/5">
          <Compass className="h-6 w-6 text-line" />
        </div>
        <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.15em] text-line">404</p>
        <h1 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl">
          This coordinate doesn't exist.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-ink-dim">
          The page you're looking for has moved, was renamed, or was never here.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/official-links" variant="secondary">
            Official links
          </Button>
        </div>
      </div>
    </div>
  );
}
