"use client";

import { Sparkles } from "lucide-react";

import { ComparisonTable } from "@/components/pricing/comparison-table";
import { PricingCard } from "@/components/pricing/pricing-card";
import { Card } from "@/components/ui/card";
import { pricingPlans } from "@/data/mock/plans";
import { useSessionStore } from "@/store/session-store";

export default function DashboardPricingPage() {
  const { user, setPlan } = useSessionStore();

  return (
    <div className="space-y-6">
      <Card className="rounded-[34px] border-white/10 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-800 text-white shadow-float ring-1 ring-white/10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/60">
              Pricing strategy
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold">
              Gói Plus được làm nổi bật để mở khóa tư vấn Light RAG và hỗ trợ chuyên gia ngay từ bây giờ.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/75">
              Free phù hợp trải nghiệm giao diện, Pro tập trung vào YOLO và quyền truy cập sớm CNN,
              còn Plus hoàn thiện hành trình với chat RAG và chuyên gia nông nghiệp.
            </p>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-lime-100">
              <Sparkles size={16} />
              Gói hiện tại: {user?.currentPlan?.toUpperCase() ?? "FREE"}
            </div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-50/75">
              <p>Pro: dùng YOLO xác thực lá ổn định và được ưu tiên khi CNN ra mắt.</p>
              <p>Plus: thêm Light RAG, chat chuyên gia và trải nghiệm tư vấn sâu hơn.</p>
              <p>Thiết kế pricing thiên về thuyết phục nâng cấp nhưng vẫn rõ ràng, dễ so sánh.</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            dark
            currentPlan={user?.currentPlan}
            onSelect={(planId) => setPlan(planId)}
          />
        ))}
      </div>

      <ComparisonTable />
    </div>
  );
}
