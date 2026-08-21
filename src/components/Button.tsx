import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  icon?: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<string, string> = {
  primary:
    "bg-line text-base-deep border border-line font-semibold hover:bg-line-soft hover:shadow-glow-sm active:scale-[0.98]",
  secondary:
    "bg-surface/40 text-ink border border-surface-border hover:border-line/40 hover:bg-surface-raised hover:text-white",
  ghost:
    "bg-transparent text-ink-dim hover:text-ink hover:bg-surface/40",
};

export default function Button({
  href,
  children,
  variant = "primary",
  external = false,
  icon,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-medium transition-all duration-300 ${VARIANT_CLASSES[variant]} ${className}`;

  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link to={href} className={classes}>
      {children}
      {icon}
    </Link>
  );
}
