"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function UpgradeBanner({
  currentPlan,
  onOpenUpgrade,
}: {
  currentPlan: string;
  onOpenUpgrade: () => void;
}) {
  return (
    <Card className="overflow-hidden rounded-[34px] border-emerald-100/70 p-0 shadow-float">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0f241b] via-[#143626] to-[#1a4a31] px-6 py-7 text-white sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,255,151,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(91,214,140,0.16),transparent_30%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-lime-100">
              <Crown size={14} />
              Gói hiện tại: {currentPlan.toUpperCase()}
            </div>

            <h2 className="mt-5 font-display text-3xl font-semibold">
              Mở khóa Leafiq Plus để nhận khuyến nghị RAG và chat trực tiếp với chuyên gia
              nông nghiệp.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/80">
              Leafiq Plus phù hợp khi bạn cần tư vấn sâu hơn, truy vấn dữ liệu nông nghiệp bằng
              Light RAG và nhận hỗ trợ gần với tình huống thực địa hơn.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={onOpenUpgrade}>
                <Sparkles size={16} />
                Nâng cấp ngay
              </Button>
              <Link href="/dashboard/pricing" className={buttonVariants({ variant: "outline" })}>
                Xem chi tiết gói
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/65">
              Leafiq impact
            </p>

            <div className="mt-5 space-y-4">
              {[
                "Tư vấn sau xác thực dưới dạng hội thoại dễ hiểu, bám sát ngữ cảnh.",
                "Ưu tiên người dùng cần xử lý nhanh ngoài hiện trường hoặc tại vườn.",
                "Giao diện chuyên gia tạo cảm giác đồng hành rõ ràng và đáng tin cậy.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-emerald-50/85"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
