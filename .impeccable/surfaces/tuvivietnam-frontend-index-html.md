---
version: 1
slug: "tuvivietnam-frontend-index-html"
primary_target: "tuvivietnam/frontend/index.html"
related_targets: ["shared/site.css"]
---

# Trang chủ và khung chung (header, footer)

Mode: Persuade cho trang chủ (người mới hiểu ngay website làm được gì và bắt đầu), Operate cho header và footer dùng chung.

Người xem: người Việt tra cứu cho mình và người thân, phần lớn trên điện thoại. Việc chính: nhập ngày sinh một lần để có hồ sơ vận mệnh, hoặc tìm thẳng tới một công cụ.

Ràng buộc: đặc tả giao diện v1.0 mục 1.2, 2, 2.1, 3, 13, 14, 14.1, 15. Thứ tự section trang chủ cố định: hero và biểu mẫu, chức năng nổi bật, vận trình hôm nay, lịch âm hôm nay, Tarot nhanh, bài viết nổi bật, footer.

## Direction contract

THESIS: Đêm và ngày. Navy đêm đóng khung trang (header, hero, Tarot, footer), nội dung đọc nằm trên nền kem ngà ban ngày; vàng champagne là sợi chỉ ánh sao nối hai bên. Từ chối kiểu trang huyền bí tối toàn phần phát sáng, và kiểu trang SaaS trắng xám vô danh.

OWN-WORLD: navy #101B30, kem ngà #F7F4ED, trắng cho card và biểu mẫu, champagne #D6B56D cho viền nhấn, biểu tượng, nút trên nền navy; chữ phụ xám xanh, cảnh báo đỏ trầm. Playfair Display cho tiêu đề, Be Vietnam Pro cho nội dung và điều khiển. Card bo 14 px, bóng mềm. Họa tiết duy nhất: vòng hoàng đạo 12 nan với chấm chòm sao, vẽ nét champagne mảnh.

STORY: Người mới thấy ngay sáu công cụ chính và một biểu mẫu; nhập ngày sinh là có hồ sơ vận mệnh, vận trình hôm nay bốn mặt có điểm và nhận định; mỗi ngày quay lại xem lịch âm, giờ hoàng đạo, rút một lá Tarot, đọc bài.

FIRST VIEWPORT: dải navy toàn bề rộng; trái: tiêu đề "Khám phá vận mệnh của bạn", mô tả ngắn về tử vi, chiêm tinh, thần số học; phải: card trắng chứa biểu mẫu (ngày sinh, lịch âm dương, giờ sinh, giới tính, nơi sinh) và nút chính "Lập hồ sơ vận mệnh"; vòng hoàng đạo lớn mờ nằm sau, lệch phải, cắt mép. Mobile xếp dọc: tiêu đề, biểu mẫu.

FORM: seed: none (pinned) — "Kết hợp nền sáng màu kem cho nội dung đọc với các khu vực xanh navy đậm cho điểm nhấn. Sử dụng vàng champagne làm màu nhấn; họa tiết chòm sao, vòng tròn hoàng đạo, âm dương và ngũ hành chỉ dùng ở mức vừa phải." và "Tiêu đề chính: “Khám phá vận mệnh của bạn”… Hình nền thiên văn hoặc vòng tròn hoàng đạo; desktop bố cục hai cột, mobile xếp dọc."

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
