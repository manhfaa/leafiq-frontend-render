"use client";

import { useState } from "react";

import { OverviewStatGrid } from "@/components/dashboard/overview-stat-grid";
import { QuickAccessPanel } from "@/components/dashboard/quick-access-panel";
import { RecentDiagnosisPanel } from "@/components/dashboard/recent-diagnosis-panel";
import { UpgradeBanner } from "@/components/dashboard/upgrade-banner";
import { UpgradeModal } from "@/components/pricing/upgrade-modal";
import { Card } from "@/components/ui/card";
import { successMetrics } from "@/data/mock/dashboard";
import { useSessionStore } from "@/store/session-store";

export default function DashboardOverviewPage() {
  const { user } = useSessionStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <OverviewStatGrid />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <RecentDiagnosisPanel />

        <Card className="relative overflow-hidden rounded-[32px] border-emerald-100/70">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#f4fbea] to-emerald-50/80" />
          <div className="pointer-events-none absolute -right-12 top-10 h-32 w-32 rounded-full bg-lime-100/70 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700/70">
              Health metrics
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">
              Tín hiệu vận hành mô phỏng
            </h2>

            <div className="mt-6 space-y-4">
              {successMetrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-emerald-100 bg-white/80 p-5 shadow-soft"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">{item.label}</p>
                    <span className="font-display text-3xl font-semibold text-emerald-700">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <QuickAccessPanel />

      <UpgradeBanner
        currentPlan={user?.currentPlan ?? "free"}
        onOpenUpgrade={() => setOpen(true)}
      />

      <UpgradeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
