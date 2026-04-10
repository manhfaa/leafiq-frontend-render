import { ChatApiResponse, ChatMode, DiagnosisRecord, RagCitation, RagDocument } from "@/types";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string) {
  return normalize(text)
    .split(" ")
    .filter((token) => token.length > 1);
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function hasClassification(record?: DiagnosisRecord | null) {
  return Boolean(record?.classificationReady);
}

function getLatestContextLabel(record?: DiagnosisRecord | null) {
  if (!record) return "";
  if (hasClassification(record)) return `${record.disease} trên ${record.plant}`;
  return `${record.plant} đã được YOLO xác thực là ảnh lá hợp lệ`;
}

function getLatestContextTokens(record?: DiagnosisRecord | null) {
  if (!record) return [];

  const base = `${record.plant} ${record.note} ${record.leafCheckNote ?? ""}`;
  const extra = hasClassification(record)
    ? `${record.disease} ${record.severity}`
    : "yolo xac thuc la cay anh la hop le cnn prompt dieu tri chua san sang";

  return tokenize(`${base} ${extra}`);
}

export function retrieveLightRagDocuments({
  query,
  documents,
  latestDiagnosis,
  limit = 3,
}: {
  query: string;
  documents: RagDocument[];
  latestDiagnosis?: DiagnosisRecord | null;
  limit?: number;
}) {
  const queryTokens = tokenize(query);
  const contextTokens = getLatestContextTokens(latestDiagnosis);
  const signalTokens = unique([...queryTokens, ...contextTokens]);

  return documents
    .map((doc) => {
      const haystack = tokenize(
        `${doc.title} ${doc.summary} ${doc.content} ${doc.tags.join(" ")}`,
      );
      let score = 0;

      signalTokens.forEach((token) => {
        if (doc.tags.some((tag) => normalize(tag).includes(token))) score += 5;
        if (normalize(doc.title).includes(token)) score += 4;
        if (normalize(doc.summary).includes(token)) score += 3;
        if (haystack.includes(token)) score += 1;
      });

      if (
        latestDiagnosis &&
        hasClassification(latestDiagnosis) &&
        doc.category === "diagnosis" &&
        doc.tags.some((tag) =>
          [latestDiagnosis.plant, latestDiagnosis.disease].some((value) =>
            normalize(tag).includes(normalize(value)),
          ),
        )
      ) {
        score += 8;
      }

      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.doc);
}

function buildSourceAnswer(documents: RagDocument[]) {
  const lead = documents[0];
  const supporting = documents.slice(1).map((doc) => `- ${doc.summary}`).join("\n");

  return [
    `Nếu bạn đang dựng KB nông nghiệp cho Việt Nam, nên bắt đầu từ nguồn primary có license hoặc điều khoản rõ ràng. Điểm neo đầu tiên là ${lead.title.toLowerCase()}.`,
    lead.content,
    supporting ? `Nguồn bổ sung nên kết hợp:\n${supporting}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildVerificationAnswer(documents: RagDocument[], latestDiagnosis?: DiagnosisRecord | null) {
  const top = documents[0];
  const followUp =
    latestDiagnosis?.recommendations[0]?.items.slice(0, 2).join(" ") ??
    "Ưu tiên lưu ảnh rõ, chụp thêm vài góc khác nhau và ghi lại bối cảnh thực địa để chuẩn bị cho lớp CNN sau này.";

  return [
    `Ca gần nhất mới dừng ở bước YOLO xác thực ảnh lá${latestDiagnosis ? ` (${getLatestContextLabel(latestDiagnosis)})` : ""}. Vì chưa có CNN, Light RAG sẽ tập trung vào cách chuẩn hóa ảnh và chuẩn bị dữ liệu đầu vào.`,
    top.summary,
    `Việc nên làm ngay: ${followUp}`,
  ].join("\n\n");
}

function buildDiagnosisAnswer(documents: RagDocument[], latestDiagnosis?: DiagnosisRecord | null) {
  const top = documents[0];
  const followUp =
    latestDiagnosis?.recommendations[0]?.items.slice(0, 2).join(" ") ??
    "Ưu tiên theo dõi khu vực bị hại rõ, giữ môi trường canh tác thông thoáng và kiểm tra lại sau giai đoạn ẩm cao.";

  return [
    `Dựa trên ca gần nhất${latestDiagnosis ? ` (${getLatestContextLabel(latestDiagnosis)})` : ""}, Light RAG đang ưu tiên hướng xử lý ngắn hạn và phòng ngừa.`,
    top.summary,
    `Hành động nên làm trước: ${followUp}`,
  ].join("\n\n");
}

function buildAdvisorUnavailableAnswer(latestDiagnosis?: DiagnosisRecord | null) {
  return [
    "Luồng AI đánh giá, giải pháp và điều trị sẽ dùng prompt chặt chẽ sinh từ kết quả CNN.",
    latestDiagnosis
      ? `Hiện tại ca gần nhất mới có bước YOLO xác thực ảnh lá${latestDiagnosis.plant ? ` cho ${latestDiagnosis.plant}` : ""}, nên hệ thống chưa đủ dữ liệu để tạo prompt điều trị đáng tin cậy.`
      : "Hiện tại hệ thống chưa có kết quả CNN nên chưa thể sinh prompt điều trị đáng tin cậy.",
    "Khi CNN sẵn sàng, prompt sẽ bám chặt vào loại cây, bệnh nghi ngờ, độ tin cậy, mức độ và các tín hiệu triệu chứng để tạo phần đánh giá, giải pháp và điều trị có cấu trúc.",
  ].join("\n\n");
}

export function buildLightRagAnswer({
  query,
  documents,
  latestDiagnosis,
}: {
  query: string;
  documents: RagDocument[];
  latestDiagnosis?: DiagnosisRecord | null;
}) {
  const top = retrieveLightRagDocuments({
    query,
    documents,
    latestDiagnosis,
    limit: 3,
  });

  const fallbackDocuments = documents.filter((doc) =>
    ["source", "etl", "taxonomy"].includes(doc.category),
  );

  const retrieved = top.length > 0 ? top : fallbackDocuments.slice(0, 3);

  let answer = buildSourceAnswer(retrieved);
  if (latestDiagnosis && !hasClassification(latestDiagnosis)) {
    answer = buildVerificationAnswer(retrieved, latestDiagnosis);
  } else if (retrieved[0]?.category === "diagnosis") {
    answer = buildDiagnosisAnswer(retrieved, latestDiagnosis);
  }

  const citations: RagCitation[] = retrieved.map((doc) => ({
    id: doc.id,
    title: doc.title,
    sourceName: doc.source.name,
    url: doc.source.url,
    license: doc.source.license,
  }));

  return { answer, citations, retrieved };
}

export function buildAdvisorChatAnswer({
  latestDiagnosis,
}: {
  latestDiagnosis?: DiagnosisRecord | null;
}) {
  if (!latestDiagnosis || !hasClassification(latestDiagnosis)) {
    return {
      answer: buildAdvisorUnavailableAnswer(latestDiagnosis),
      citations: [] as RagCitation[],
      retrievedDocs: [] as RagDocument[],
    };
  }

  const sections = latestDiagnosis.recommendations
    .map((section) => `${section.title}: ${section.items.join(" ")}`)
    .join("\n\n");

  return {
    answer: [
      `Đánh giá: hệ thống đang nhận ca ${latestDiagnosis.disease.toLowerCase()} trên ${latestDiagnosis.plant.toLowerCase()} với độ tin cậy ${Math.round(latestDiagnosis.confidence * 100)}%.`,
      `Giải pháp ưu tiên: ${latestDiagnosis.causes.slice(0, 2).join(" ")}`,
      `Hướng điều trị và theo dõi: ${sections}`,
    ].join("\n\n"),
    citations: [] as RagCitation[],
    retrievedDocs: [] as RagDocument[],
  };
}

export function buildExpertChatAnswer({
  query,
  latestDiagnosis,
  documents,
}: {
  query: string;
  latestDiagnosis?: DiagnosisRecord | null;
  documents: RagDocument[];
}) {
  const retrievedDocs = retrieveLightRagDocuments({
    query,
    documents,
    latestDiagnosis,
    limit: 2,
  });

  const normalized = normalize(query);
  const sourceHint = retrievedDocs[0]?.summary ?? "Light RAG đang truy xuất bộ tri thức nông nghiệp nội bộ để hỗ trợ câu trả lời.";

  if (!latestDiagnosis) {
    return {
      answer: `Nếu chưa có ca xác thực cụ thể, tôi khuyên bạn ưu tiên chụp ảnh rõ, ghi lại thời tiết gần đây, tình trạng tưới và giai đoạn sinh trưởng trước khi xử lý ngoài ruộng.\n\n${sourceHint}`,
      retrievedDocs,
    };
  }

  const firstActions = latestDiagnosis.recommendations
    .flatMap((section) => section.items)
    .slice(0, 3)
    .join(" ");

  if (!hasClassification(latestDiagnosis)) {
    return {
      answer: `Hiện tại ca gần nhất mới dừng ở bước YOLO xác thực ảnh lá. Tôi khuyên bạn giữ lại ảnh rõ nhất, chụp thêm vài góc khác nhau và ghi chú bối cảnh ruộng vườn để sẵn sàng cho CNN sau này. ${firstActions}\n\n${sourceHint}`,
      retrievedDocs,
    };
  }

  if (
    normalized.includes("phong ngua") ||
    normalized.includes("vu toi") ||
    normalized.includes("vu sau")
  ) {
    return {
      answer: `Với ca ${latestDiagnosis.disease.toLowerCase()} trên ${latestDiagnosis.plant.toLowerCase()}, tôi sẽ ưu tiên phòng ngừa bằng cách giữ tán cây thông thoáng, kiểm tra lại sau mưa và vệ sinh khu vực có lá bệnh rõ. ${firstActions}\n\n${sourceHint}`,
      retrievedDocs,
    };
  }

  if (
    normalized.includes("nguon") ||
    normalized.includes("license") ||
    normalized.includes("du lieu")
  ) {
    return {
      answer: `Ở góc nhìn chuyên gia triển khai hệ thống, bạn nên ưu tiên nguồn chính thống, có điều khoản rõ ràng và ngôn ngữ sát thực địa. Với Việt Nam, nên bắt đầu từ tài liệu khuyến nông, sau đó mới mở rộng sang kho nghiên cứu và cổng dữ liệu mở địa phương.\n\n${sourceHint}`,
      retrievedDocs,
    };
  }

  return {
    answer: `Nếu xử lý thực địa ngay, tôi sẽ đi theo thứ tự: khoanh vùng lá bị hại rõ, giữ điều kiện canh tác thông thoáng và theo dõi lại sau giai đoạn ẩm cao. ${firstActions}\n\n${sourceHint}`,
    retrievedDocs,
  };
}

export function buildChatApiResponse({
  query,
  mode,
  documents,
  latestDiagnosis,
}: {
  query: string;
  mode: ChatMode;
  documents: RagDocument[];
  latestDiagnosis?: DiagnosisRecord | null;
}): ChatApiResponse {
  if (mode === "advisor") {
    const result = buildAdvisorChatAnswer({ latestDiagnosis });
    return {
      mode,
      answer: result.answer,
      citations: result.citations,
      retrievedDocs: result.retrievedDocs,
      kbSize: documents.length,
      generatedAt: new Date().toISOString(),
    };
  }

  if (mode === "expert") {
    const result = buildExpertChatAnswer({
      query,
      latestDiagnosis,
      documents,
    });

    return {
      mode,
      answer: result.answer,
      citations: undefined,
      retrievedDocs: result.retrievedDocs,
      kbSize: documents.length,
      generatedAt: new Date().toISOString(),
    };
  }

  const result = buildLightRagAnswer({
    query,
    documents,
    latestDiagnosis,
  });

  return {
    mode,
    answer: result.answer,
    citations: result.citations,
    retrievedDocs: result.retrieved,
    kbSize: documents.length,
    generatedAt: new Date().toISOString(),
  };
}
