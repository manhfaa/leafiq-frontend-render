import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, ...props }: CardProps) {
  const classes = className ?? "";
  const hasRoundedOverride = /\brounded(?:-[^\s]+)?/.test(classes);
  const hasPaddingOverride = /\bp[trblxy]?-[^\s]+/.test(classes);
  const hasBorderOverride = /\bborder(?:-[^\s]+)?/.test(classes);
  const hasBackgroundOverride = /\bbg-[^\s]+/.test(classes);
  const hasShadowOverride = /\bshadow-[^\s]+/.test(classes);

  return (
    <div
      className={cn(
        "backdrop-blur",
        !hasRoundedOverride && "rounded-[28px]",
        !hasPaddingOverride && "p-6",
        !hasBorderOverride && "border border-white/60",
        !hasBackgroundOverride && "bg-white/90",
        !hasShadowOverride && "shadow-panel",
        glow && "ring-1 ring-emerald-200/70 shadow-float",
        className,
      )}
      {...props}
    />
  );
}
