"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PricingPlan } from "@/types";
import { cn } from "@/lib/utils";

export function PricingCard({
  plan,
  currentPlan,
  onSelect,
  dark = false,
}: {
  plan: PricingPlan;
  currentPlan?: string;
  onSelect?: (planId: PricingPlan["id"]) => void;
  dark?: boolean;
}) {
  return (
    <Card
      glow={plan.highlight}
      className={cn(
        "relative h-full rounded-[32px] p-6",
        dark
          ? "border-white/10 bg-white/5 text-white"
          : "border-white/75 bg-white/90",
        plan.highlight && !dark && "bg-gradient-to-br from-[#0f221a] via-[#153524] to-[#10231c] text-white",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.24em]",
              plan.highlight ? "text-lime-200/80" : dark ? "text-emerald-100/60" : "text-brand-700",
            )}
          >
            {plan.name}
          </p>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{plan.price}</h3>
          <p
            className={cn(
              "mt-3 text-sm leading-7",
              plan.highlight || dark ? "text-emerald-50/75" : "text-slate-600",
            )}
          >
            {plan.description}
          </p>
        </div>
        {plan.badge ? (
          <Badge variant={plan.highlight ? "warning" : dark ? "locked" : "brand"}>
            {plan.badge}
          </Badge>
        ) : null}
      </div>

      <div className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full",
                plan.highlight || dark ? "bg-white/10 text-lime-200" : "bg-brand-100 text-brand-700",
              )}
            >
              <Check size={14} />
            </span>
            <p
              className={cn(
                "text-sm leading-7",
                plan.highlight || dark ? "text-emerald-50/80" : "text-slate-600",
              )}
            >
              {feature}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          variant={plan.highlight ? "secondary" : dark ? "outline" : "primary"}
          className="w-full"
          onClick={() => onSelect?.(plan.id)}
        >
          {currentPlan === plan.id ? "Gói hiện tại" : plan.cta}
        </Button>
      </div>
    </Card>
  );
}
