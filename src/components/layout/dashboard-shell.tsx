"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UpgradeModal } from "@/components/pricing/upgrade-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionStore } from "@/store/session-store";

import { DashboardTopbar } from "./dashboard-topbar";
import { Sidebar } from "./sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useSessionStore();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-dashboard-mesh px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <Skeleton className="h-[calc(100vh-4rem)] rounded-[32px]" />
          <div className="space-y-6">
            <Skeleton className="h-32 rounded-[32px]" />
            <Skeleton className="h-[70vh] rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-mesh">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-[290px]">
        <DashboardTopbar
          onOpenUpgrade={() => setUpgradeOpen(true)}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
