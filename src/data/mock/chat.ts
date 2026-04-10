import { ChatMessage, QuickPrompt } from "@/types";

export const ragMessages: ChatMessage[] = [
  {
    id: "rag-1",
    role: "assistant",
    content:
      "Leafiq Light RAG đã sẵn sàng. Chat này dùng Light RAG để truy vấn tri thức nông nghiệp, nguồn dữ liệu, license, ETL và cấu trúc knowledge base.",
    createdAt: "2026-04-02T07:10:00.000Z",
    citations: [
      {
        id: "fao-agris-ods",
        title: "FAO AGRIS ODS metadata",
        sourceName: "Food and Agriculture Organization of the United Nations",
        url: "https://www.fao.org/agris/download",
        license: "CC BY 3.0 IGO",
      },
      {
        id: "vn-naec-safegro-2025",
        title: "SAFEGRO 2025: Hướng dẫn thực hành sản xuất rau an toàn, bền vững",
        sourceName: "Trung tâm Khuyến nông Quốc gia",
        url: "https://khuyennongvn.gov.vn/DesktopModules/Module/home/UserNewsList_TaiLieu_Download.ashx?url=%2Fdata%2Fdocuments%2F0%2F2025%2F09%2F10%2Fhangweb%2Fe-book-huong-dan-thuc-hanh-san-xuat-rau-an-toan-ben-vung.pdf",
        license: "Tái bản cho mục đích giáo dục hoặc phi lợi nhuận, cần ghi nguồn",
      },
    ],
  },
];

export const advisorMessages: ChatMessage[] = [
  {
    id: "advisor-1",
    role: "assistant",
    content:
      "Chat AI đánh giá, giải pháp và điều trị sẽ dùng prompt chặt chẽ sinh từ kết quả CNN. Hiện tại hệ thống chưa có CNN nên phần này đang chờ dữ liệu đầu vào chuẩn.",
    createdAt: "2026-04-03T08:00:00.000Z",
  },
];

export const expertMessages: ChatMessage[] = [
  {
    id: "expert-1",
    role: "assistant",
    content:
      "Chat chuyên gia nông nghiệp đang dùng bộ tri thức nông nghiệp với Light RAG để trả lời. Bạn có thể hỏi về cách chụp ảnh tốt hơn, ghi nhận dữ liệu hiện trường hoặc nguồn tri thức uy tín.",
    createdAt: "2026-04-03T09:40:00.000Z",
  },
];

export const quickPrompts: QuickPrompt[] = [
  {
    id: "prompt-1",
    label: "Nguồn cho Việt Nam",
    prompt: "Nguồn dữ liệu nào nên ưu tiên cho KB nông nghiệp Việt Nam và vì sao?",
  },
  {
    id: "prompt-2",
    label: "JSONL schema",
    prompt: "Một schema JSONL tối thiểu cho Light RAG nông nghiệp nên có những trường nào?",
  },
  {
    id: "prompt-3",
    label: "Dedup và license",
    prompt: "Nên khử trùng lặp và kiểm soát license như thế nào khi ingest dữ liệu nông nghiệp?",
  },
  {
    id: "prompt-4",
    label: "Ảnh đầu vào",
    prompt: "Làm sao chụp ảnh lá tốt hơn để chuẩn bị cho bước CNN sau này?",
  },
];
