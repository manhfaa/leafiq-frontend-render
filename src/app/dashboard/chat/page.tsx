"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { DatabaseZap, ShieldCheck, Sparkles } from "lucide-react";

import { AdvisorPlaceholder } from "@/components/chat/advisor-placeholder";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatWindow } from "@/components/chat/chat-window";
import { LockedPanel } from "@/components/chat/locked-panel";
import { QuickPrompts } from "@/components/chat/quick-prompts";
import { UpgradeModal } from "@/components/pricing/upgrade-modal";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { advisorMessages, expertMessages, quickPrompts, ragMessages } from "@/data/mock/chat";
import {
  AdvisoryMode,
  ChatApiResponse,
  ChatMessage,
  ChatMode,
  ChatWorkspace,
  QuickPrompt,
  RagDocument,
} from "@/types";
import { useDiagnosisStore } from "@/store/diagnosis-store";
import { useSessionStore } from "@/store/session-store";

const FALLBACK_DOCS: RagDocument[] = [];

function getWorkspaceSubtitle(workspace: ChatWorkspace, advisoryMode: AdvisoryMode) {
  if (workspace === "rag") {
    return "Light RAG là công nghệ dùng trong Chat RAG để truy vấn dữ liệu nông nghiệp và gắn nguồn tham chiếu ngay trong câu trả lời.";
  }

  if (advisoryMode === "advisor") {
    return "Chat AI điều trị sẽ dùng prompt chặt chẽ sinh từ kết quả CNN để đưa ra đánh giá, giải pháp và điều trị. Hiện tại phần này đang chờ CNN.";
  }

  return "Chat chuyên gia nông nghiệp dùng bộ tri thức nông nghiệp với Light RAG để retrieval và trả lời theo ngữ cảnh thực địa.";
}

export default function DashboardChatPage() {
  const { user } = useSessionStore();
  const { records, latestRecordId } = useDiagnosisStore();
  const [workspace, setWorkspace] = useState<ChatWorkspace>("rag");
  const [advisoryMode, setAdvisoryMode] = useState<AdvisoryMode>("advisor");
  const [composerByMode, setComposerByMode] = useState<Record<ChatMode, string>>({
    rag: "",
    advisor: "",
    expert: "",
  });
  const [typingMode, setTypingMode] = useState<ChatMode | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [kbSize, setKbSize] = useState(0);
  const [lastRetrievedDocs, setLastRetrievedDocs] = useState<Record<ChatMode, RagDocument[]>>({
    rag: FALLBACK_DOCS,
    advisor: FALLBACK_DOCS,
    expert: FALLBACK_DOCS,
  });
  const [messagesByMode, setMessagesByMode] = useState<Record<ChatMode, ChatMessage[]>>({
    rag: ragMessages,
    advisor: advisorMessages,
    expert: expertMessages,
  });

  const plusUnlocked = user?.currentPlan === "plus";
  const latestDiagnosis = useMemo(
    () => records.find((item) => item.id === latestRecordId) ?? records[0] ?? null,
    [latestRecordId, records],
  );
  const latestHasClassification = Boolean(latestDiagnosis?.classificationReady);
  const activeMode: ChatMode = workspace === "rag" ? "rag" : advisoryMode;
  const currentDocs = lastRetrievedDocs[activeMode] ?? FALLBACK_DOCS;
  const subtitle = getWorkspaceSubtitle(workspace, advisoryMode);

  useEffect(() => {
    let active = true;

    async function loadInitialContext() {
      try {
        const response = await fetch("/api/chat", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = (await response.json()) as Pick<ChatApiResponse, "kbSize" | "retrievedDocs">;
        if (!active) return;

        setKbSize(data.kbSize);
        setLastRetrievedDocs({
          rag: data.retrievedDocs,
          advisor: [],
          expert: data.retrievedDocs,
        });
      } catch {
        if (!active) return;
        setKbSize(0);
      }
    }

    void loadInitialContext();

    return () => {
      active = false;
    };
  }, []);

  function setComposer(mode: ChatMode, value: string) {
    setComposerByMode((current) => ({
      ...current,
      [mode]: value,
    }));
  }

  async function sendMessage(mode: ChatMode, content: string) {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `${mode}-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessagesByMode((current) => ({
      ...current,
      [mode]: [...current[mode], userMessage],
    }));
    setComposer(mode, "");
    setTypingMode(mode);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: content,
          mode,
          latestDiagnosis,
        }),
      });

      if (!response.ok) {
        throw new Error("API chat trả về lỗi.");
      }

      const data = (await response.json()) as ChatApiResponse;

      setMessagesByMode((current) => ({
        ...current,
        [mode]: [
          ...current[mode],
          {
            id: `${mode}-${Date.now()}-assistant`,
            role: "assistant",
            content: data.answer,
            createdAt: data.generatedAt,
            citations: data.citations,
          },
        ],
      }));

      setKbSize(data.kbSize);
      setLastRetrievedDocs((current) => ({
        ...current,
        [mode]: data.retrievedDocs,
      }));
    } catch {
      setMessagesByMode((current) => ({
        ...current,
        [mode]: [
          ...current[mode],
          {
            id: `${mode}-${Date.now()}-fallback`,
            role: "assistant",
            content:
              "Leafiq chưa kết nối được tới API chat ở lượt này. Bạn có thể thử lại sau vài giây hoặc kiểm tra dev server nội bộ.",
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    } finally {
      setTypingMode(null);
    }
  }

  const handlePrompt = (prompt: QuickPrompt) => {
    void sendMessage(workspace === "rag" ? "rag" : "expert", prompt.prompt);
  };

  const canUseRagChat = plusUnlocked;
  const canUseExpertChat = plusUnlocked;
  const canUseAdvisorChat = latestHasClassification;

  return (
    <div className="space-y-6">
      <Card className="rounded-[34px] border-white/10 bg-white/5 text-white">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/60">
              Chat workspace
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Hệ chat của Leafiq được tách rõ giữa truy vấn tri thức và tư vấn thực địa.
            </h2>
            <p className="mt-3 text-sm leading-7 text-emerald-50/75">{subtitle}</p>
          </div>
          <Tabs
            value={workspace}
            onChange={(value) => setWorkspace(value as ChatWorkspace)}
            tabs={[
              { value: "rag", label: "Chat RAG dữ liệu" },
              { value: "advisory", label: "Chat tư vấn" },
            ]}
          />
        </div>
      </Card>

      {workspace === "rag" ? (
        canUseRagChat ? (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <ChatWindow messages={messagesByMode.rag} typing={typingMode === "rag"} />
              <ChatComposer
                label="Nhập câu hỏi truy vấn dữ liệu"
                value={composerByMode.rag}
                onChange={(value) => setComposer("rag", value)}
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  void sendMessage("rag", composerByMode.rag);
                }}
                placeholder="Ví dụ: Nguồn dữ liệu nào nên ưu tiên để dựng KB nông nghiệp Việt Nam, hoặc schema JSONL nào phù hợp cho Light RAG?"
                helperText="Chat này dùng Light RAG để retrieval dữ liệu, tài liệu và nguồn tri thức."
              />
            </div>

            <div className="space-y-6">
              <QuickPrompts prompts={quickPrompts} onSelect={handlePrompt} />

              <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <DatabaseZap size={18} className="text-lime-200" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold">
                      Light RAG đang truy vấn dữ liệu
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-emerald-50/75">
                      UI gửi truy vấn tới `/api/chat`, server route sẽ retrieval rồi trả về câu trả
                      lời kèm nguồn tham chiếu.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                <h3 className="font-display text-2xl font-semibold">Nguồn đang được truy xuất</h3>
                <div className="mt-5 space-y-3">
                  {currentDocs.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/10"
                    >
                      <p className="font-semibold text-white">{doc.title}</p>
                      <p className="mt-2 text-sm leading-7 text-emerald-50/75">{doc.summary}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-lime-200">
                        {doc.source.name} • {doc.source.license}
                      </p>
                    </a>
                  ))}
                </div>
              </Card>

              <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                <h3 className="font-display text-2xl font-semibold">Context hiện tại</h3>
                <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-50/75">
                  <p>Knowledge base demo hiện có {kbSize} tài liệu nội bộ đã gắn source và license.</p>
                  <p>Retriever ưu tiên nguồn dữ liệu uy tín, playbook ETL và tri thức nông nghiệp có thể dùng ngay cho Light RAG.</p>
                  {latestDiagnosis ? (
                    <p>
                      Ảnh gần nhất đã được YOLO xác thực là lá hợp lệ. Chat RAG sẽ ưu tiên truy vấn
                      các nguồn dữ liệu và tài liệu liên quan tới bước tiếp theo.
                    </p>
                  ) : null}
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <LockedPanel onUpgrade={() => setUpgradeOpen(true)} />
            <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
              <p className="text-sm leading-7 text-emerald-50/75">
                Chat RAG là nơi Leafiq dùng Light RAG để truy vấn dữ liệu và nguồn tri thức. Khu
                vực này đang mở khóa trên gói Plus.
              </p>
            </Card>
          </>
        )
      ) : (
        <div className="space-y-6">
          <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/60">
                  Chat tư vấn
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold">
                  Hai lớp chat phục vụ hai mục tiêu khác nhau
                </h3>
              </div>
              <Tabs
                value={advisoryMode}
                onChange={(value) => setAdvisoryMode(value as AdvisoryMode)}
                tabs={[
                  { value: "advisor", label: "AI đánh giá & điều trị" },
                  { value: "expert", label: "Chuyên gia nông nghiệp" },
                ]}
              />
            </div>
          </Card>

          {advisoryMode === "advisor" ? (
            <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="space-y-4">
                <ChatWindow messages={messagesByMode.advisor} typing={typingMode === "advisor"} />
                {canUseAdvisorChat ? (
                  <>
                    <ChatComposer
                      label="Nhập câu hỏi cho AI điều trị"
                      value={composerByMode.advisor}
                      onChange={(value) => setComposer("advisor", value)}
                      onSubmit={(event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        void sendMessage("advisor", composerByMode.advisor);
                      }}
                      placeholder="Ví dụ: Hãy đánh giá mức độ, đưa ra giải pháp ưu tiên và hướng điều trị từ kết quả CNN này."
                      helperText="AI điều trị sẽ dùng prompt chặt chẽ sinh từ kết quả CNN."
                    />
                    <p className="px-2 text-xs text-amber-200">
                      (AI có thể mắc lỗi vui lòng kiểm tra lại)
                    </p>
                  </>
                ) : (
                  <AdvisorPlaceholder hasCnnResult={latestHasClassification} />
                )}
              </div>

              <div className="space-y-6">
                <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Sparkles size={18} className="text-lime-200" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">
                        Prompt điều trị sẽ dùng kết quả CNN
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-emerald-50/75">
                        Prompt sẽ bám chặt vào cây trồng, bệnh nghi ngờ, độ tin cậy, mức độ và các
                        tín hiệu triệu chứng để sinh phần đánh giá, giải pháp và điều trị có cấu
                        trúc.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                  <h3 className="font-display text-2xl font-semibold">Tình trạng hiện tại</h3>
                  <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-50/75">
                    <p>
                      {latestHasClassification
                        ? "Ca gần nhất đã có dữ liệu CNN để khởi động AI điều trị."
                        : "Ca gần nhất mới dừng ở bước YOLO xác thực ảnh lá, nên AI điều trị chưa được phép trả lời."}
                    </p>
                    <p>
                      Đây là lớp tư vấn riêng, khác với Chat RAG dữ liệu và cũng khác với chat chuyên
                      gia nông nghiệp.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          ) : canUseExpertChat ? (
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                <ChatWindow messages={messagesByMode.expert} typing={typingMode === "expert"} />
                <ChatComposer
                  label="Nhập câu hỏi cho chuyên gia nông nghiệp"
                  value={composerByMode.expert}
                  onChange={(value) => setComposer("expert", value)}
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    void sendMessage("expert", composerByMode.expert);
                  }}
                  placeholder="Ví dụ: Với ảnh lá vừa xác thực, tôi nên chụp bổ sung thêm những góc nào hoặc ghi thêm dữ liệu gì ngoài hiện trường?"
                  helperText="Chat chuyên gia dùng bộ tri thức nông nghiệp với Light RAG để retrieval trước khi trả lời."
                />
              </div>

              <div className="space-y-6">
                <QuickPrompts prompts={quickPrompts} onSelect={handlePrompt} />

                <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <ShieldCheck size={18} className="text-lime-200" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">
                        Chuyên gia đang dùng Light RAG
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-emerald-50/75">
                        Chat chuyên gia vẫn đi qua Light RAG để retrieval bộ tri thức nông nghiệp,
                        sau đó mới trả lời theo giọng tư vấn thực địa.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                  <h3 className="font-display text-2xl font-semibold">Nguồn đang được truy xuất</h3>
                  <div className="mt-5 space-y-3">
                    {currentDocs.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/10"
                      >
                        <p className="font-semibold text-white">{doc.title}</p>
                        <p className="mt-2 text-sm leading-7 text-emerald-50/75">{doc.summary}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-lime-200">
                          {doc.source.name} • {doc.source.license}
                        </p>
                      </a>
                    ))}
                    {currentDocs.length === 0 ? (
                      <div className="rounded-[24px] border border-dashed border-white/10 px-4 py-6 text-sm text-emerald-50/70">
                        Chưa có tài liệu nào được API trả về.
                      </div>
                    ) : null}
                  </div>
                </Card>

                <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                  <h3 className="font-display text-2xl font-semibold">Bối cảnh gần nhất</h3>
                  <p className="mt-4 text-sm leading-7 text-emerald-50/75">
                    {latestDiagnosis
                      ? latestHasClassification
                        ? `Chuyên gia đang nhận context từ API với ca ${latestDiagnosis.disease.toLowerCase()} trên ${latestDiagnosis.plant.toLowerCase()}.`
                        : "Chuyên gia đang nhận context rằng ảnh gần nhất đã qua YOLO xác thực lá, và đang dùng Light RAG để trả lời theo bộ tri thức nông nghiệp."
                      : "Chưa có ca mới trong phiên hiện tại, nên chuyên gia sẽ trả lời ở mức hướng dẫn chung."}
                  </p>
                </Card>
              </div>
            </div>
          ) : (
            <>
              <LockedPanel onUpgrade={() => setUpgradeOpen(true)} />
              <Card className="rounded-[30px] border-white/10 bg-white/5 text-white">
                <p className="text-sm leading-7 text-emerald-50/75">
                  Chat chuyên gia nông nghiệp dùng bộ dữ liệu nông nghiệp với Light RAG để trả lời
                  và hiện được mở khóa trên gói Plus.
                </p>
              </Card>
            </>
          )}
        </div>
      )}

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
