import Link from "next/link";

import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/ui/reveal";
import { pricingPlans } from "@/data/mock/plans";
import { buttonVariants } from "@/components/ui/button";
import { PricingCard } from "@/components/pricing/pricing-card";

export function PricingPreviewSection() {
  return (
    <SectionShell
      id="goi-dich-vu"
      eyebrow="Pricing preview"
      title="So sánh Free, Pro và Plus bằng bố cục đủ mạnh để thuyết phục nâng cấp."
      description="Pro tập trung vào YOLO và quyền truy cập sớm CNN. Plus mở khóa đầy đủ chat RAG và chuyên gia nông nghiệp."
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <Reveal key={plan.id} delay={index * 0.06}>
            <PricingCard plan={plan} />
          </Reveal>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/login" className={buttonVariants({ variant: "primary", size: "lg" })}>
          Dùng thử dashboard Leafiq
        </Link>
      </div>
    </SectionShell>
  );
}
