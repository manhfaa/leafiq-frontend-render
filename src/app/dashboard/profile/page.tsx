"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";

import { PricingCard } from "@/components/pricing/pricing-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { pricingPlans } from "@/data/mock/plans";
import { useSessionStore } from "@/store/session-store";

export default function DashboardProfilePage() {
  const { user, updateProfile, setPlan } = useSessionStore();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const currentPlan = useMemo(
    () => pricingPlans.find((plan) => plan.id === user?.currentPlan),
    [user?.currentPlan],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[34px] border-white/10 bg-white/5 text-white">
          <div className="flex items-start gap-4">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/10">
              <Image
                src={user?.avatar ?? "/avatars/user-demo.svg"}
                alt={user?.name ?? "Leafiq User"}
                width={140}
                height={140}
                className="h-[120px] w-[120px]"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/60">
                Hồ sơ người dùng
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold">
                {user?.name ?? "Leafiq User"}
              </h2>
              <p className="mt-2 text-sm text-emerald-50/75">{user?.email}</p>
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-emerald-50/75">
                Gói hiện tại: <span className="font-semibold text-lime-200">{currentPlan?.name ?? "Free"}</span>
                <br />
                Bạn có thể chỉnh sửa hồ sơ demo ngay tại đây để kiểm tra trạng thái UI sau khi lưu.
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[34px] border-white/70 bg-white/90">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Tên người dùng" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mt-5 flex gap-3">
            <Button
              onClick={() => {
                updateProfile({ name, email });
              }}
            >
              Lưu thay đổi
            </Button>
            <Button variant="secondary">Đổi avatar</Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[34px] border-white/10 bg-white/5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/60">
            Bảo mật cơ bản
          </p>
          <div className="mt-5 space-y-4">
            {[
              {
                icon: Mail,
                title: "Xác minh email",
                description: "Mô phỏng trạng thái xác minh để giao diện tài khoản đầy đủ hơn.",
              },
              {
                icon: LockKeyhole,
                title: "Bảo vệ tài khoản",
                description: "Cho thấy vị trí thiết lập mật khẩu và cơ chế bảo vệ truy cập sau này.",
              },
              {
                icon: ShieldCheck,
                title: "Thông báo đăng nhập",
                description: "Màn hình hồ sơ sẵn sàng mở rộng khi tích hợp backend thật.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Icon size={20} className="text-lime-200" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-emerald-50/75">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentPlan={user?.currentPlan}
              onSelect={(planId) => setPlan(planId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
