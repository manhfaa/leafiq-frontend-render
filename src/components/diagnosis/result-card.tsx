"use client";

import { LockKeyhole, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DiagnosisRecord } from "@/types";
import { formatConfidence } from "@/lib/utils";

export function DiagnosisResultCard({
  record,
  locked,
  onUpgrade,
}: {
  record: DiagnosisRecord | null;
  locked?: boolean;
  onUpgrade?: () => void;
}) {
  const classificationReady = Boolean(record?.classificationReady);

  return (
    <Card className="relative overflow-hidden rounded-[34px] border-emerald-100 bg-white/90">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Bước 3
          </p>
          <h3 className="mt-2 font-display text-3xl font-semibold text-ink">
            Kết quả xác thực và tư vấn tiếp theo
          </h3>
        </div>
        <Badge variant={locked ? "warning" : "success"}>
          {locked ? "Cần Plus để mở khóa chat" : "Sẵn sàng xem gợi ý"}
        </Badge>
      </div>

      {record ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] bg-[#10231c] p-5 text-white">
            <p className="text-sm text-emerald-50/70">{record.plant}</p>
            <h4 className="mt-2 font-display text-3xl font-semibold">{record.disease}</h4>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-50/60">
                  Xác nhận lá
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {record.yoloVerified
                    ? record.leafConfidence
                      ? formatConfidence(record.leafConfidence)
                      : "Hợp lệ"
                    : "Chưa đạt"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-50/60">
                  Trạng thái CNN
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {classificationReady ? "Đã sẵn sàng" : "Sẽ bổ sung sau"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-50/60">
                  Nguồn ảnh
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {record.inputMethod === "capture"
                    ? "Ảnh chụp"
                    : record.inputMethod === "upload"
                      ? "Ảnh tải lên"
                      : "Ảnh mẫu"}
                </p>
              </div>
            </div>
            {record.leafCheckNote ? (
              <div className="mt-4 rounded-2xl bg-white/5 px-4 py-3 text-sm leading-6 text-emerald-50/80">
                {record.leafCheckNote}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-brand-700">
                {classificationReady ? "Tóm tắt chẩn đoán" : "Trạng thái hiện tại"}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{record.symptomSummary}</p>
            </div>
            <div className="rounded-[28px] border border-emerald-100 bg-white p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                <Sparkles size={16} />
                Gợi ý từ Light RAG
              </p>
              <div className="mt-4 space-y-4">
                {record.recommendations.map((section) => (
                  <div key={section.title}>
                    <p className="font-medium text-ink">{section.title}</p>
                    <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600">
                      {section.items.slice(0, locked ? 1 : section.items.length).map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[30px] border border-dashed border-emerald-200 bg-emerald-50/70 px-6 py-10 text-center text-sm leading-7 text-slate-600">
          Tải ảnh hoặc nạp ảnh mẫu để hiển thị kết quả xác thực lá bằng YOLO.
        </div>
      )}

      {locked ? (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-white via-white/95 to-white/60 px-6 py-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-brand-700">
            <LockKeyhole size={22} />
          </div>
          <div>
            <h4 className="font-display text-2xl font-semibold text-ink">
              Chat Light RAG đang khóa trên gói hiện tại
            </h4>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
              Gói Plus mở khóa trọn vẹn lớp tư vấn hội thoại, hướng dẫn chuẩn hóa ảnh và chat với
              chuyên gia nông nghiệp.
            </p>
          </div>
          <Button onClick={onUpgrade}>Nâng cấp lên Plus</Button>
        </div>
      ) : null}
    </Card>
  );
}
