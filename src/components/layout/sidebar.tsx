"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Xác thực ảnh", href: "/dashboard/diagnosis", icon: ScanSearch },
  { label: "Chat tư vấn", href: "/dashboard/chat", icon: MessageSquareText },
  { label: "Lịch sử", href: "/dashboard/history", icon: ShieldCheck },
  { label: "Gói dịch vụ", href: "/dashboard/pricing", icon: CreditCard },
  { label: "Hồ sơ", href: "/dashboard/profile", icon: UserRound },
];

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 transition lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col border-r border-white/10 bg-[#0f2119]/95 p-5 text-white backdrop-blur-xl transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Logo dark href="/dashboard" />

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-brand-800/80 to-brand-900/60 p-4 shadow-sm">
            <div className="rounded-2xl bg-brand-500/20 p-3">
              <Sparkles size={18} className="text-lime-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-50/60">
                AI pipeline
              </p>
              <p className="mt-1 text-sm font-semibold text-white">YOLO • RAG • Expert</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-white text-ink shadow-soft"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[28px] border border-white/10 bg-gradient-to-br from-brand-800/80 via-brand-900 to-brand-800 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/60">
            Leafiq Plus
          </p>
          <h3 className="mt-3 font-display text-xl font-semibold">
            Mở khóa chat tư vấn chuyên sâu
          </h3>
          <p className="mt-2 text-sm leading-6 text-emerald-50/75">
            Trải nghiệm hội thoại với Light RAG và chuyên gia để chuẩn hóa ảnh đầu vào và chuẩn bị
            dữ liệu tốt hơn trước khi CNN ra mắt.
          </p>
        </div>
      </aside>
    </>
  );
}
