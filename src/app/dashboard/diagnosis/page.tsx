"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, MessageSquareText, Sparkles } from "lucide-react";

import { AIProcessStepper } from "@/components/diagnosis/ai-process-stepper";
import type { StepItem } from "@/components/diagnosis/ai-process-stepper";
import { CameraFrame } from "@/components/diagnosis/camera-frame";
import { DiagnosisResultCard } from "@/components/diagnosis/result-card";
import { UploadPanel } from "@/components/diagnosis/upload-panel";
import { UpgradeModal } from "@/components/pricing/upgrade-modal";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockDiagnoses } from "@/data/mock/diagnoses";
import {
  createPreviewDataUrl,
  detectLeafInImage,
  type LeafDetectionResult,
} from "@/lib/leaf-detector";
import { formatConfidence } from "@/lib/utils";
import {
  CameraPreviewState,
  DiagnosisInputMethod,
  DiagnosisRecord,
  DiagnosisStatus,
  DiagnosisStepState,
} from "@/types";
import { useDiagnosisStore } from "@/store/diagnosis-store";
import { useSessionStore } from "@/store/session-store";

const inputMethodLabelMap: Record<DiagnosisInputMethod, string> = {
  upload: "ảnh tải lên",
  capture: "ảnh chụp",
  sample: "ảnh mẫu",
};

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function buildGeneratedRecord({
  template,
  previewUrl,
  detection,
  inputMethod,
}: {
  template: DiagnosisRecord;
  previewUrl: string;
  detection: LeafDetectionResult;
  inputMethod: DiagnosisInputMethod;
}): DiagnosisRecord {
  const plant = inputMethod === "sample" ? template.plant : "Chưa phân loại cây";

  return {
    id: `user-${Date.now()}`,
    plant,
    disease: "Ảnh lá đã xác thực",
    confidence: detection.confidence,
    severity: "Chờ CNN",
    classificationReady: false,
    image: previewUrl,
    createdAt: new Date().toISOString(),
    note:
      inputMethod === "sample"
        ? `YOLO đã xác nhận ${inputMethodLabelMap[inputMethod]} là ảnh lá ${template.plant.toLowerCase()} hợp lệ. CNN phân loại bệnh sẽ được bổ sung sau.`
        : `YOLO đã xác nhận ${inputMethodLabelMap[inputMethod]} là ảnh lá cây hợp lệ. Hệ thống hiện chưa chạy CNN phân loại cây và bệnh.`,
    yoloVerified: true,
    leafConfidence: detection.confidence,
    leafCheckNote: detection.reason,
    inputMethod,
    origin: "user",
    symptomSummary:
      "Leafiq hiện dừng ở bước xác thực ảnh lá bằng YOLO. Ảnh này đã đạt điều kiện đầu vào và có thể được lưu để dùng lại khi lớp CNN được tích hợp sau.",
    causes: [
      `Tỉ lệ vùng thực vật đạt ${formatConfidence(detection.plantLikeRatio)}.`,
      `Tỉ lệ vùng xanh nổi bật đạt ${formatConfidence(detection.greenRatio)}.`,
      `${inputMethodLabelMap[inputMethod]} đã được đọc ổn định trên trình duyệt.`,
    ],
    recommendations: [
      {
        title: "Bước nên làm tiếp",
        items: [
          "Lưu ảnh này vào lịch sử để dùng lại khi CNN được bổ sung.",
          "Chụp thêm 2 đến 3 ảnh ở các góc khác nhau để làm bộ dữ liệu đầu vào tốt hơn.",
          "Dùng chat Light RAG để hỏi về cách chụp ảnh nông nghiệp và chuẩn hóa dữ liệu hiện trường.",
        ],
      },
      {
        title: "Mẹo trước khi có CNN",
        items: [
          "Ưu tiên ảnh đủ sáng, nền gọn và phiến lá chiếm phần lớn khung hình.",
          "Tránh rung tay hoặc chụp lúc lá bị khuất, vì sẽ làm giảm chất lượng dữ liệu cho giai đoạn sau.",
          "Ghi lại ngày chụp và bối cảnh ruộng hoặc chậu cây để có thêm context cho chat hoặc chuyên gia.",
        ],
      },
    ],
  };
}

export default function DashboardDiagnosisPage() {
  const { user } = useSessionStore();
  const { addGeneratedRecord } = useDiagnosisStore();
  const [status, setStatus] = useState<DiagnosisStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiagnosisRecord | null>(null);
  const [leafAnalysis, setLeafAnalysis] = useState<LeafDetectionResult | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState<DiagnosisInputMethod | null>(null);
  const [runCount, setRunCount] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [cameraState, setCameraState] = useState<CameraPreviewState>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"environment" | "user">(
    "environment",
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentPlan = user?.currentPlan ?? "free";
  const busy = status === "uploading" || status === "scanning";
  const ragLocked = currentPlan !== "plus";

  useEffect(() => {
    setCameraSupported(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function",
    );
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function stopCameraStream(nextState: CameraPreviewState = "idle") {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraError(null);
    setCameraState(nextState);
  }

  async function openCamera(nextFacingMode = cameraFacingMode) {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      setCameraState("unsupported");
      setCameraError(
        "TrÃ¬nh duyá»‡t hiá»‡n táº¡i chÆ°a há»— trá»£ camera trá»±c tiáº¿p. Báº¡n hÃ£y dÃ¹ng tÃ¹y chá»n táº£i áº£nh hoáº·c camera thiáº¿t bá»‹.",
      );
      return;
    }

    stopCameraStream("idle");
    setCameraState("starting");
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: nextFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }

      setCameraState("live");
    } catch {
      stopCameraStream("error");
      setCameraError(
        "KhÃ´ng thá»ƒ má»Ÿ camera. Báº¡n hÃ£y cho phÃ©p truy cáº­p camera hoáº·c chuyá»ƒn sang táº£i áº£nh tá»« thiáº¿t bá»‹.",
      );
    }
  }

  async function captureFromCamera() {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraState("error");
      setCameraError("Camera chÆ°a sáºµn sÃ ng Ä‘á»ƒ chá»¥p. Báº¡n hÃ£y thá»­ má»Ÿ láº¡i camera.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setCameraState("error");
      setCameraError("KhÃ´ng thá»ƒ táº¡o khung chá»¥p trÃªn thiáº¿t bá»‹ hiá»‡n táº¡i.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      setCameraState("error");
      setCameraError("KhÃ´ng thá»ƒ xuáº¥t áº£nh tá»« camera. Báº¡n hÃ£y thá»­ láº¡i.");
      return;
    }

    stopCameraStream();

    const file = new File([blob], `leafiq-capture-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    await applySelectedFile(file, "capture");
  }

  function handleSwitchCamera() {
    const nextFacingMode = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(nextFacingMode);
    void openCamera(nextFacingMode);
  }

  const processSteps = useMemo<StepItem[]>(() => {
    const yoloState: DiagnosisStepState =
      status === "invalid-image"
        ? "warning"
        : status === "scanning"
          ? "processing"
          : status === "success"
            ? "success"
            : previewUrl
              ? "queued"
              : "idle";

    const roadmapState: DiagnosisStepState =
      status === "success" || previewUrl ? "queued" : "idle";

    const ragState: DiagnosisStepState = ragLocked
      ? "locked"
      : status === "success"
        ? "success"
        : previewUrl
          ? "queued"
          : "idle";

    return [
      {
        key: "yolo",
        title: "YOLO xác thực ảnh có phải lá cây",
        description:
          "Leafiq phân tích vùng xanh, hình dạng thực vật và độ bão hòa ngay trên trình duyệt để xác nhận ảnh đầu vào có phải lá cây hay không.",
        state: yoloState,
        detail:
          status === "invalid-image"
            ? leafAnalysis?.reason ??
              "Ảnh hiện tại chưa đủ điều kiện để được xác nhận là lá cây hợp lệ."
            : status === "success"
              ? `YOLO đã xác nhận ảnh đầu vào là lá cây với độ tin cậy ${formatConfidence(
                  leafAnalysis?.confidence ?? 0,
                )}.`
              : status === "scanning"
                ? "Đang quét các vùng màu thực vật và cấu trúc ảnh để xác thực đầu vào."
                : "Tải ảnh hoặc chụp ảnh lá để bắt đầu bước xác thực đầu vào.",
      },
      {
        key: "roadmap",
        title: "CNN phân loại bệnh sẽ bổ sung sau",
        description:
          "Phiên bản hiện tại chỉ xác thực ảnh có phải lá cây hay không. Sau khi có YOLO, lớp CNN sẽ được tích hợp ở giai đoạn tiếp theo.",
        state: roadmapState,
        detail:
          status === "success"
            ? "Ảnh hợp lệ đã được lưu sẵn trong lịch sử để dùng lại khi mô hình CNN được bổ sung."
            : "Khi YOLO xác thực xong, ảnh đầu vào sạch sẽ sẵn sàng cho lộ trình CNN sau này.",
      },
      {
        key: "rag",
        title: "Light RAG tư vấn bước tiếp theo",
        description:
          "Sau khi ảnh qua YOLO, bạn có thể dùng chat Light RAG để hỏi về cách chụp ảnh tốt hơn, chuẩn bị dữ liệu và quy trình nông nghiệp liên quan.",
        state: ragState,
        detail: ragLocked
          ? "Free và Pro vẫn xem được kết quả xác thực ảnh. Nâng cấp Plus để mở khóa tư vấn hội thoại và chat chuyên gia."
          : status === "success"
            ? "Ảnh vừa xác thực đã sẵn sàng làm context cho chat Light RAG."
            : "Hoàn tất bước YOLO để bật context cho lớp chat tư vấn.",
      },
    ];
  }, [leafAnalysis, previewUrl, ragLocked, status]);

  async function applySelectedFile(file: File, method: DiagnosisInputMethod) {
    try {
      stopCameraStream();
      const nextUrl = await createPreviewDataUrl(file);
      setPreviewUrl(nextUrl);
      setInputMethod(method);
      setSelectedTemplateId(null);
      setSelectedRecord(null);
      setLeafAnalysis(null);
      setStatus("idle");
    } catch {
      setPreviewUrl(null);
      setInputMethod(null);
      setSelectedRecord(null);
      setLeafAnalysis(null);
      setStatus("invalid-image");
    }
  }

  function loadSampleRecord() {
    stopCameraStream();
    const template = mockDiagnoses[runCount % mockDiagnoses.length];
    setPreviewUrl(template.image);
    setInputMethod("sample");
    setSelectedTemplateId(template.id);
    setSelectedRecord(null);
    setLeafAnalysis(null);
    setStatus("idle");
  }

  async function handleStartDiagnosis() {
    const fallbackTemplate = mockDiagnoses[runCount % mockDiagnoses.length];
    const activePreview = previewUrl ?? fallbackTemplate.image;
    const activeMethod = inputMethod ?? "sample";
    const template =
      mockDiagnoses.find((item) => item.id === selectedTemplateId) ?? fallbackTemplate;

    if (!previewUrl) {
      setPreviewUrl(fallbackTemplate.image);
      setInputMethod("sample");
      setSelectedTemplateId(fallbackTemplate.id);
    }

    setStatus("uploading");
    setSelectedRecord(null);
    setLeafAnalysis(null);

    await delay(350);
    setStatus("scanning");

    try {
      const detection = await detectLeafInImage(activePreview);
      setLeafAnalysis(detection);
      await delay(900);

      if (!detection.isLeaf) {
        setStatus("invalid-image");
        return;
      }

      const generatedRecord = buildGeneratedRecord({
        template,
        previewUrl: activePreview,
        detection,
        inputMethod: activeMethod,
      });

      setSelectedRecord(generatedRecord);
      addGeneratedRecord(generatedRecord);
      setStatus("success");
      setRunCount((value) => value + 1);
    } catch {
      setLeafAnalysis({
        isLeaf: false,
        confidence: 0.12,
        greenRatio: 0,
        plantLikeRatio: 0,
        averageSaturation: 0,
        reason: "Không thể đọc ảnh này để phân tích. Bạn hãy thử ảnh khác rõ hơn hoặc chụp lại lá.",
      });
      setStatus("invalid-image");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <UploadPanel
          status={status}
          busy={busy}
          cameraSupported={cameraSupported}
          onFileSelected={applySelectedFile}
          onOpenCamera={() => {
            void openCamera();
          }}
          onUseSample={loadSampleRecord}
          onStart={() => {
            void handleStartDiagnosis();
          }}
        />
        <CameraFrame
          previewUrl={previewUrl}
          busy={busy}
          cameraState={cameraState}
          cameraError={cameraError}
          videoRef={videoRef}
          onOpenCamera={() => {
            void openCamera();
          }}
          onCapture={() => {
            void captureFromCamera();
          }}
          onCloseCamera={() => stopCameraStream()}
          onSwitchCamera={handleSwitchCamera}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="brand">Gói hiện tại: {currentPlan.toUpperCase()}</Badge>
        <Button
          variant="secondary"
          onClick={() => {
            stopCameraStream();
            setPreviewUrl("/illustrations/non-leaf-sample.svg");
            setInputMethod("sample");
            setSelectedTemplateId(null);
            setSelectedRecord(null);
            setLeafAnalysis(null);
            setStatus("idle");
          }}
        >
          Dùng ảnh không phải lá
        </Button>
        {selectedRecord && status === "success" ? (
          <Link
            href={`/dashboard/results/${selectedRecord.id}`}
            className={buttonVariants({ variant: "primary" })}
          >
            Xem kết quả xác thực
          </Link>
        ) : null}
        {selectedRecord && status === "success" ? (
          <Link href="/dashboard/chat" className={buttonVariants({ variant: "secondary" })}>
            <MessageSquareText size={16} />
            Mở chat Light RAG
          </Link>
        ) : null}
      </div>

      {leafAnalysis ? (
        <Card className="rounded-[30px] border-emerald-100 bg-white/90">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                Độ tin cậy YOLO
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-ink">
                {formatConfidence(leafAnalysis.confidence)}
              </p>
            </div>
            <div className="rounded-[24px] bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                Vùng thực vật
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-ink">
                {formatConfidence(leafAnalysis.plantLikeRatio)}
              </p>
            </div>
            <div className="rounded-[24px] bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                Vùng xanh
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-ink">
                {formatConfidence(leafAnalysis.greenRatio)}
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {status === "invalid-image" ? (
        <Card className="rounded-[30px] border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-amber-950">
                Ảnh đầu vào chưa được xác nhận là lá cây
              </h3>
              <p className="mt-3 text-sm leading-7 text-amber-900/80">
                {leafAnalysis?.reason ??
                  "Bạn hãy thử chụp cận hơn vào phiến lá, tăng ánh sáng hoặc đổi sang ảnh có phần lá chiếm diện tích lớn hơn."}
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      <AIProcessStepper steps={processSteps} />

      <DiagnosisResultCard
        record={selectedRecord}
        locked={ragLocked && status === "success"}
        onUpgrade={() => setUpgradeOpen(true)}
      />

      <Card className="rounded-[34px] border-white/10 bg-white/5 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <Sparkles size={18} className="text-lime-200" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold">
              Phiên bản hiện tại tập trung YOLO xác thực ảnh lá
            </h3>
            <p className="mt-2 text-sm leading-7 text-emerald-50/75">
              Ảnh tải lên hoặc ảnh chụp được xác thực trên trình duyệt và lưu lại để dùng cho chat
              Light RAG cũng như cho lớp CNN trong giai đoạn tiếp theo.
            </p>
          </div>
        </div>
      </Card>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
