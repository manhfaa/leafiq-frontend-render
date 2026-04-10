import Link from "next/link";
import { CreditCard, History, MessageSquareText, ScanSearch } from "lucide-react";

import { Card } from "@/components/ui/card";

const quickLinks = [
  {
    title: "Bắt đầu xác thực ảnh",
    description:
      "Upload ảnh hoặc chụp ảnh để khởi động bước YOLO kiểm tra ảnh có phải lá cây.",
    href: "/dashboard/diagnosis",
    icon: ScanSearch,
  },
  {
    title: "Chat tư vấn",
    description:
      "Mở hội thoại AI RAG hoặc chuyên gia nông nghiệp trong giao diện chat chuyên nghiệp.",
    href: "/dashboard/chat",
    icon: MessageSquareText,
  },
  {
    title: "Lịch sử xác thực",
    description: "Xem lại các lần xác thực ảnh lá theo cây trồng và thời gian.",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "Quyền lợi gói dịch vụ",
    description: "So sánh Free, Pro và Plus để chọn trải nghiệm phù hợp hơn.",
    href: "/dashboard/pricing",
    icon: CreditCard,
  },
];

const panelAccents = [
  "from-white via-emerald-50/80 to-emerald-100/70",
  "from-white via-sky-50/80 to-emerald-50/70",
  "from-white via-lime-50/75 to-emerald-50/70",
  "from-white via-amber-50/70 to-lime-50/80",
];

export function QuickAccessPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {quickLinks.map((item, index) => {
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <Card className="group relative h-full overflow-hidden rounded-[30px] border-emerald-100/70 transition duration-300 hover:-translate-y-1 hover:shadow-float">
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${panelAccents[index] ?? panelAccents[0]}`}
              />
              <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 rounded-full bg-white/80 blur-2xl" />

              <div className="relative flex items-start gap-4">
                <div className="rounded-2xl bg-[#10231c] p-3 text-emerald-50 shadow-soft transition duration-300 group-hover:scale-105">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="font-display text-2xl font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
