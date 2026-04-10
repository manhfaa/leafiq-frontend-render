"use client";

import type { ChangeEvent } from "react";
import { useRef } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  FileImage,
  PlayCircle,
  Sparkles,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DiagnosisInputMethod, DiagnosisStatus } from "@/types";

const statusLabelMap: Record<DiagnosisStatus, string> = {
  idle: "Sẵn sàng nhận ảnh lá",
  uploading: "Đang chuẩn bị ảnh",
  scanning: "YOLO đang xác thực ảnh lá",
  success: "Ảnh đã được xác thực",
  "invalid-image": "Ảnh chưa đạt điều kiện lá cây",
  locked: "Tính năng bổ sung đang khóa",
};

const tips = [
  "Ưu tiên một phiến lá nổi bật, đủ sáng và không bị che khuất.",
  "Leafiq hiện xác thực ảnh lá bằng YOLO ngay trên trình duyệt.",
  "Ảnh hợp lệ sẽ được lưu để dùng tiếp cho chat Light RAG và lớp CNN sau này.",
];

const options = [
  {
    key: "upload",
    title: "Tải ảnh lá",
    description:
      "Chọn ảnh có vùng lá rõ, chiếm phần lớn khung hình để YOLO nhận diện ổn định hơn.",
    hint: "Phù hợp khi đã có ảnh sẵn",
    tone: "from-emerald-100 via-emerald-50 to-white",
    badge: "Từ thiết bị",
    icon: Upload,
  },
  {
    key: "capture",
    title: "Chụp ảnh lá",
    description:
      "Mở camera trực tiếp ngay trong khung chẩn đoán để canh phiến lá, đổi camera trước sau và chụp nhanh mà không rời khỏi trang.",
    hint: "Camera trực tiếp",
    tone: "from-teal-100 via-emerald-50 to-white",
    badge: "Từ camera",
    icon: Camera,
  },
  {
    key: "sample",
    title: "Dùng ảnh mẫu",
    description:
      "Nạp một ảnh demo để xem toàn bộ luồng xác thực ảnh, lưu kết quả và mở chat Light RAG.",
    hint: "Dễ xem luồng sản phẩm",
    tone: "from-lime-100 via-emerald-50 to-white",
    badge: "Demo nhanh",
    icon: FileImage,
  },
] as const;

export function UploadPanel({
  status,
  busy,
  cameraSupported,
  onFileSelected,
  onOpenCamera,
  onUseSample,
  onStart,
}: {
  status: DiagnosisStatus;
  busy: boolean;
  cameraSupported: boolean;
  onFileSelected: (file: File, method: DiagnosisInputMethod) => void;
  onOpenCamera: () => void;
  onUseSample: () => void;
  onStart: () => void;
}) {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const captureRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    method: DiagnosisInputMethod,
  ) {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file, method);
    event.target.value = "";
  }

  function handleOptionClick(optionKey: (typeof options)[number]["key"]) {
    if (optionKey === "upload") {
      uploadRef.current?.click();
      return;
    }

    if (optionKey === "capture") {
      if (cameraSupported) {
        onOpenCamera();
        return;
      }

      captureRef.current?.click();
      return;
    }

    onUseSample();
  }

  return (
    <Card className="relative overflow-hidden rounded-[36px] border-emerald-100/80 p-0 shadow-panel">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,214,156,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(217,247,164,0.26),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,251,246,0.92))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/60 to-transparent" />

      <div className="relative p-6 sm:p-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_320px] xl:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-soft">
              <Sparkles size={14} />
              Bước 1 · Đầu vào hình ảnh
            </div>

            <h3 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink sm:text-[2.25rem]">
              Tải ảnh hoặc chụp ảnh lá với bố cục rõ, sạch và dễ xác thực
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 sm:text-[15px]">
              Leafiq hiện tập trung vào bước YOLO để kiểm tra ảnh đầu vào có đúng là lá cây hay
              không. Sau khi ảnh đạt điều kiện, bạn có thể lưu kết quả và dùng tiếp trong chat
              Light RAG, trước khi lớp CNN được bổ sung ở giai đoạn sau.
            </p>
          </div>

          <div className="rounded-[28px] border border-emerald-100 bg-white/80 p-5 shadow-soft backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-800">
                <Sparkles size={20} />
              </div>

              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                {statusLabelMap[status]}
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">
              Thiết lập ảnh tốt ngay từ đầu để YOLO xác thực nhanh và ổn định hơn.
            </p>

            <div className="mt-4 space-y-3">
              {tips.map((tip) => (
                <div key={tip} className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 px-4 py-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-700" />
                  <p className="text-sm leading-6 text-slate-600">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon;
            const cameraFallback =
              option.key === "capture" && !cameraSupported
                ? "Camera thiết bị / fallback"
                : option.hint;

            return (
              <button
                key={option.key}
                type="button"
                disabled={busy}
                onClick={() => handleOptionClick(option.key)}
                className="group relative overflow-hidden rounded-[30px] border border-emerald-100 bg-white/85 p-5 text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-float disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div
                  className={`pointer-events-none absolute inset-x-5 top-5 h-16 rounded-[22px] bg-gradient-to-r ${option.tone} opacity-95`}
                />
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/70 blur-2xl" />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-emerald-700 ring-1 ring-emerald-100">
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {option.badge}
                  </span>
                </div>

                <h4 className="relative mt-16 font-display text-[1.75rem] font-semibold leading-tight text-ink">
                  {option.title}
                </h4>

                <p className="relative mt-3 text-sm leading-7 text-slate-600">
                  {option.description}
                </p>

                <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-emerald-100 pt-4">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700/80">
                    {cameraFallback}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-800">
                    Chọn
                    <ArrowRight size={16} className="transition duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[30px] border border-emerald-100 bg-white/82 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Sẵn sàng chạy YOLO
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Khi đã có ảnh, bắt đầu xác thực để kiểm tra đầu vào có phải lá cây hay không. Bạn
              cũng có thể nạp ảnh demo để xem nhanh toàn bộ trải nghiệm.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="dark" loading={busy} onClick={onStart}>
              <PlayCircle size={18} />
              Bắt đầu xác thực
            </Button>
            <Button variant="secondary" onClick={onUseSample}>
              Dùng ảnh demo
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFileChange(event, "upload")}
      />

      <input
        ref={captureRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => handleFileChange(event, "capture")}
      />
    </Card>
  );
}
