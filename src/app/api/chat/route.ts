import { NextResponse } from "next/server";

import { lightRagDocuments } from "@/data/mock/light-rag";
import { buildChatApiResponse } from "@/lib/light-rag";
import { ChatApiRequest, ChatMode } from "@/types";

export async function GET() {
  return NextResponse.json({
    kbSize: lightRagDocuments.length,
    retrievedDocs: lightRagDocuments.slice(0, 3),
    generatedAt: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  let body: Partial<ChatApiRequest> = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON không hợp lệ." }, { status: 400 });
  }

  const query = body.query?.trim();
  const mode: ChatMode =
    body.mode === "expert" ? "expert" : body.mode === "advisor" ? "advisor" : "rag";

  if (!query) {
    return NextResponse.json({ error: "Vui lòng gửi trường query." }, { status: 400 });
  }

  const response = buildChatApiResponse({
    query,
    mode,
    documents: lightRagDocuments,
    latestDiagnosis: body.latestDiagnosis ?? null,
  });

  return NextResponse.json(response);
}
