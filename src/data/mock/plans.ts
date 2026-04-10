import { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "0đ",
    description: "Dành cho trải nghiệm ban đầu và khám phá giao diện xác thực ảnh lá.",
    cta: "Bắt đầu miễn phí",
    features: [
      "Landing page và dashboard demo",
      "YOLO xác thực ảnh có phải lá cây",
      "Lưu lịch sử mock cơ bản",
      "Khám phá quy trình tải ảnh và chụp ảnh",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "299.000đ/tháng",
    description: "Dành cho người dùng cần xác thực ảnh lá ổn định và sẵn sàng cho lộ trình CNN sau.",
    cta: "Nâng cấp Pro",
    features: [
      "YOLO kiểm tra ảnh có phải lá cây",
      "Lưu lịch sử xác thực nâng cao",
      "Ưu tiên trải nghiệm upload và chụp ảnh",
      "Quyền truy cập sớm CNN khi ra mắt",
      "Không có chat RAG",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: "699.000đ/tháng",
    description: "Gói đầy đủ cho xác thực ảnh lá, tư vấn Light RAG và đồng hành chuyên sâu.",
    cta: "Mở khóa Plus",
    highlight: true,
    badge: "Đề xuất cho đội ngũ canh tác",
    features: [
      "YOLO kiểm tra ảnh lá cây",
      "Chat AI Light RAG tư vấn bước tiếp theo",
      "Chat với chuyên gia nông nghiệp",
      "Lịch sử xác thực ảnh đầy đủ hơn",
      "Ưu tiên truy cập CNN khi ra mắt",
    ],
  },
];
