"use client";

import Link from "next/link";
import { Menu, Rocket, UserCircle2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/session-store";
import { getPlanLabel } from "@/lib/utils";

const titleMap: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Bảng điều khiển tổng quan",
    description: "Theo dõi hoạt động xác thực ảnh lá, gợi ý nâng cấp và tình trạng pipeline AI.",
  },
  "/dashboard/diagnosis": {
    title: "Xác thực ảnh lá cây",
    description: "Tải ảnh hoặc chụp ảnh để chạy bước YOLO kiểm tra ảnh có phải lá cây hay không.",
  },
  "/dashboard/chat": {
    title: "Chat tư vấn",
    description: "Trải nghiệm giao diện hội thoại AI RAG và chuyên gia nông nghiệp cho gói Plus.",
  },
  "/dashboard/history": {
    title: "Lịch sử xác thực",
    description: "Tìm lại ảnh lá đã xác thực nhanh chóng theo cây trồng và thời gian phát sinh.",
  },
  "/dashboard/pricing": {
    title: "Gói dịch vụ",
    description: "So sánh quyền lợi Free, Pro và Plus trong cùng một giao diện thuyết phục.",
  },
  "/dashboard/profile": {
    title: "Hồ sơ người dùng",
    description: "Quản lý thông tin tài khoản, gói hiện tại và các thiết lập cơ bản.",
  },
};

export function DashboardTopbar({
  onOpenUpgrade,
  onOpenMobileNav,
}: {
  onOpenUpgrade: () => void;
  onOpenMobileNav: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useSessionStore();
  const pageMeta =
    titleMap[pathname] ??
    (pathname.startsWith("/dashboard/results")
      ? {
          title: "Kết quả xác thực",
          description: "Xem chi tiết độ tin cậy YOLO, tình trạng hiện tại và gợi ý bước tiếp theo.",
        }
      : titleMap["/dashboard"]);

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[#10231c]/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="outline" size="sm" className="mt-1 lg:hidden" onClick={onOpenMobileNav}>
            <Menu size={16} />
          </Button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/60">
              Leafiq workspace
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white">
              {pageMeta.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/75">
              {pageMeta.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <Badge variant="dark">Gói {getPlanLabel(user?.currentPlan ?? "free")}</Badge>
          <Button variant="secondary" size="sm" onClick={onOpenUpgrade}>
            <Rocket size={16} />
            Nâng cấp
          </Button>
          <Link
            href="/dashboard/pricing"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-4 text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            Xem quyền lợi
          </Link>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <UserCircle2 size={20} className="text-emerald-100/70" />
              <div>
                <p className="text-sm font-semibold text-white">{user?.name ?? "Leafiq User"}</p>
                <p className="text-xs text-emerald-50/60">{user?.email ?? "demo@leafiq.vn"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
