import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, ...props }, ref) => {
    return (
      <label className="block space-y-2">
        {label ? (
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "h-12 w-full rounded-2xl border border-emerald-100 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100",
            className,
          )}
          {...props}
        />
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </label>
    );
  },
);

Input.displayName = "Input";
