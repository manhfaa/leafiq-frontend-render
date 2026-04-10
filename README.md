# Leafiq Frontend

Frontend demo cho website chẩn đoán bệnh lá cây bằng AI, được dựng bằng `Next.js App Router + TypeScript + Tailwind CSS`.

## Chạy project

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
```

## Tóm tắt cấu trúc thư mục

```text
public/
  illustrations/   SVG minh họa nội bộ cho hero, camera frame và mẫu lá cây
  avatars/         Ảnh đại diện mẫu cho team và người dùng demo

src/
  app/             Routes chính theo App Router
    api/           API routes nội bộ cho frontend demo và tích hợp backend sau này
  components/      Hệ thống component chia theo vai trò
  constants/       Brand copy, điều hướng, hằng số giao diện
  data/mock/       Dữ liệu giả lập cho cây trồng, gói dịch vụ, lịch sử, chat
  lib/             Utility chung như format date, format confidence, cn()
  store/           Zustand stores cho session và chẩn đoán
  types/           Domain types dùng xuyên suốt toàn app
```

## Vai trò của các file chính

- `src/app/layout.tsx`: nạp font, metadata và global styles.
- `src/app/page.tsx`: landing page public của thương hiệu Leafiq.
- `src/app/login/page.tsx`: màn hình đăng nhập demo, chọn gói `Free / Pro / Plus`.
- `src/app/dashboard/layout.tsx`: app shell cho toàn bộ giao diện sau đăng nhập.
- `src/app/dashboard/diagnosis/page.tsx`: màn hình chẩn đoán quan trọng nhất với upload, camera trực tiếp, stepper YOLO/CNN/RAG.
- `src/app/dashboard/results/[id]/page.tsx`: trang kết quả chi tiết của một ca bệnh.
- `src/app/dashboard/chat/page.tsx`: giao diện chat AI RAG và chat chuyên gia với lock state cho non-Plus.
- `src/app/api/chat/route.ts`: API route cho Light RAG chat, nhận query từ UI và trả về câu trả lời + citations + retrieved docs.
- `src/app/dashboard/history/page.tsx`: lịch sử chẩn đoán với bộ lọc cây trồng và ngày.
- `src/app/dashboard/pricing/page.tsx`: trang so sánh gói Free, Pro và Plus.
- `src/app/dashboard/profile/page.tsx`: hồ sơ người dùng, cập nhật info mock và nâng cấp gói.
- `src/components/layout/*`: navbar, footer, sidebar, topbar, logo, section shell.
- `src/components/ui/*`: button, card, badge, input, modal, tabs, skeleton, reveal animation.
- `src/components/home/*`: các section trên landing page như hero, team, features, plants, workflow, mission, pricing preview.
- `src/components/dashboard/*`: stats, quick access, recent diagnosis, upgrade banner.
- `src/components/diagnosis/*`: upload panel, camera frame, AI stepper, result card.
- `src/components/pricing/*`: pricing cards, comparison table, upgrade modal.
- `src/components/chat/*`: chat window, quick prompts, locked panel.
- `src/store/session-store.ts`: lưu mock auth và gói hiện tại bằng Zustand persist.
- `src/store/diagnosis-store.ts`: lưu lịch sử và trạng thái lưu kết quả trong local state.

## Ghi chú

- Project chỉ làm frontend UI/UX, chưa có backend thật, database thật hay API thật.
- Riêng chat hiện đã có `API route` nội bộ trong Next.js để mô phỏng luồng gọi server qua `fetch("/api/chat")`.
- Ảnh upload và ảnh chụp camera đều được preview phía client, còn kết quả chẩn đoán hiện vẫn là mock data.
- Gói `Plus` mở khóa đầy đủ chat RAG và chat với chuyên gia nông nghiệp trong giao diện demo.
