"use client";

import { Crown } from "lucide-react";

import { pricingPlans } from "@/data/mock/plans";
import { useSessionStore } from "@/store/session-store";

import { Modal } from "../ui/modal";
import { PricingCard } from "./pricing-card";

export function UpgradeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, setPlan } = useSessionStore();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nâng cấp trải nghiệm Leafiq"
      description="Chọn gói phù hợp để mở khóa đầy đủ lớp chẩn đoán, tư vấn và chuyên gia nông nghiệp."
    >
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-emerald-50/75">
        <Crown size={16} className="text-lime-200" />
        Gói hiện tại: {user?.currentPlan?.toUpperCase() ?? "FREE"}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            dark
            currentPlan={user?.currentPlan}
            onSelect={(planId) => {
              setPlan(planId);
              onClose();
            }}
          />
        ))}
      </div>
    </Modal>
  );
}
