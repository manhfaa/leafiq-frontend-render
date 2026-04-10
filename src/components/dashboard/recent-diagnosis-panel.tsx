"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatConfidence, formatDate } from "@/lib/utils";
import { useDiagnosisStore } from "@/store/diagnosis-store";

export function RecentDiagnosisPanel() {
  const { records } = useDiagnosisStore();
  const items = records.slice(0, 3);

  return (
    <Card className="relative overflow-hidden rounded-[32px] border-emerald-100/70">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-emerald-50/80 to-lime-50/70" />
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-100/80 blur-3xl" />

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700/70">
            Xác thực gần đây
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">
            Các ảnh lá nổi bật trong tuần này
          </h2>
        </div>

        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:text-slate-950"
        >
          Xem tất cả
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="relative mt-6 grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/results/${item.id}`}
            className="group rounded-[28px] border border-emerald-100 bg-white/80 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:bg-white"
          >
            <div className="flex items-center justify-between gap-3">
              <Badge variant="brand">{item.plant}</Badge>
              <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
            </div>

            <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">
              {item.disease}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.note}</p>

            <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
              <span>Độ tin cậy YOLO</span>
              <span className="font-semibold text-emerald-700">
                {formatConfidence(item.leafConfidence ?? item.confidence)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
