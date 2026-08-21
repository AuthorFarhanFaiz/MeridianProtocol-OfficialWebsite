// The site's signature visual element: a field of converging meridian
// (longitude) lines, evoking navigation charts — a literal, honest
// expression of the brand name rather than a generic crypto glow.
// Purely decorative: no counters, no fabricated data, respects
// prefers-reduced-motion via the global stylesheet.

interface MeridianFieldProps {
  className?: string;
  dense?: boolean;
}

export default function MeridianField({ className = "", dense = false }: MeridianFieldProps) {
  const lineCount = dense ? 14 : 9;
  const lines = Array.from({ length: lineCount }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Soft ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,162,39,0.08),transparent_70%)]" />

      {/* Floating soft orbs */}
      <div className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-line/5 blur-3xl animate-pulse-glow" />
      <div className="absolute right-[10%] top-[40%] h-48 w-48 rounded-full bg-line/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMin slice"
        className="h-full w-full opacity-70"
      >
        <defs>
          <linearGradient id="meridianFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#C9A227" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </linearGradient>
        </defs>

        {lines.map((i) => {
          const topX = 600 + (i - lineCount / 2) * 28;
          return (
            <path
              key={i}
              d={`M ${topX} -40 Q 600 300 ${600 + (topX - 600) * 2.5} 640`}
              stroke="url(#meridianFade)"
              strokeWidth={i === Math.floor(lineCount / 2) ? 1.5 : 0.75}
              fill="none"
            />
          );
        })}

        {/* equatorial arcs */}
        {[200, 320, 440].map((ry) => (
          <ellipse
            key={ry}
            cx="600"
            cy="50"
            rx="580"
            ry={ry}
            stroke="rgba(232,236,244,0.05)"
            strokeWidth="0.7"
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
}
