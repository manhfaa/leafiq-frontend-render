"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brand } from "@/constants/brand";
import { pricingPlans } from "@/data/mock/plans";
import { PlanTier } from "@/types";
import { useSessionStore } from "@/store/session-store";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useSessionStore();
  const [name, setName] = useState("Nguyễn Văn Nông");
  const [email, setEmail] = useState("demo@leafiq.vn");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("free");

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const selectedPlanInfo = useMemo(
    () => pricingPlans.find((plan) => plan.id === selectedPlan),
    [selectedPlan],
  );

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="relative overflow-hidden rounded-[40px] border-white/70 bg-[#10231c] p-8 text-white shadow-float">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(135,224,167,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(236,248,180,0.12),transparent_28%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-4">
              <Logo dark />
              <Link
                href="/"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Về landing page
              </Link>
            </div>

            <div className="mt-12 max-w-xl">
              <Badge variant="locked">Mock authentication experience</Badge>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-tight">
                Đăng nhập demo để bước vào không gian chẩn đoán của Leafiq.
              </h1>
              <p className="mt-5 text-base leading-8 text-emerald-50/75">
                {brand.slogan} Trang này cho phép chọn sẵn gói Free, Pro hoặc Plus để kiểm tra toàn bộ luồng giao diện như một sản phẩm thật.
              </p>
            </div>

            <div className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-5">
              <Image
                src="/illustrations/hero-dashboard.svg"
                alt="Minh họa dashboard Leafiq"
                width={900}
                height={680}
                className="w-full rounded-[24px]"
              />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Đăng nhập giả lập không cần backend.",
                "Chọn gói để test lock state và nâng cấp.",
                "Điều hướng trực tiếp sang dashboard sau khi đăng nhập.",
              ].map((item) => (
                <div key={item} className="rounded-[24px] bg-white/5 px-4 py-4 text-sm leading-7 text-emerald-50/75">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-[40px] border-white/70 bg-white/90 p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-brand-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                Demo access
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">
                Khởi tạo phiên người dùng
              </h2>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <Input label="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Sparkles size={16} className="text-brand-700" />
              Chọn gói trải nghiệm
            </div>
            <div className="mt-4 grid gap-4">
              {pricingPlans.map((plan) => {
                const active = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`rounded-[28px] border p-5 text-left transition ${
                      active
                        ? "border-brand-300 bg-emerald-50 shadow-soft"
                        : "border-emerald-100 bg-white hover:border-brand-200 hover:bg-emerald-50/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                          {plan.name}
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                          {plan.price}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {plan.description}
                        </p>
                      </div>
                      {active ? (
                        <CheckCircle2 className="text-brand-700" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 rounded-[28px] bg-[#f4f8f4] p-5">
            <p className="text-sm font-semibold text-brand-700">
              Quyền lợi nổi bật của gói đang chọn
            </p>
            <div className="mt-4 space-y-3">
              {selectedPlanInfo?.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-brand-700">
                    <CheckCircle2 size={14} />
                  </span>
                  <p className="text-sm leading-7 text-slate-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => {
                login({ name, email, plan: selectedPlan });
                router.push("/dashboard");
              }}
            >
              Vào dashboard
              <ArrowRight size={18} />
            </Button>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-200 px-6 text-sm font-medium text-slate-700 transition hover:bg-emerald-50"
            >
              Xem landing page
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
