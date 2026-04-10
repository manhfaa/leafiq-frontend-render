import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  dark = false,
  className,
}: {
  href?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      <span className="relative flex h-11 w-11 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400 via-brand-600 to-emerald-800 shadow-soft" />
        <span className="absolute inset-[5px] rounded-[14px] border border-white/20" />
        <span className="absolute h-8 w-8 animate-pulseRing rounded-full border border-lime-200/70" />
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <path
            d="M17.5 4C11.8 4.4 7.2 7.2 4.5 12.4C6.2 17.4 11.7 19.7 15.8 17.4C19.3 15.3 20 10.3 17.5 4Z"
            fill="#F3FAD9"
          />
          <path
            d="M6 12.5C8 11 10.2 9.8 13.2 8.8M10 17C9.8 14.2 10.8 11.7 13.2 8.8"
            stroke="#0F2D1E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-tight",
            dark ? "text-white" : "text-ink",
          )}
        >
          Leafiq
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            dark ? "text-emerald-50/70" : "text-slate-500",
          )}
        >
          Plant intelligence studio
        </span>
      </span>
    </Link>
  );
}
