# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Người Việt muốn tra cứu huyền học cho chính mình và người thân: lập lá số tử vi, xem tuổi hợp khi cưới hỏi hay làm ăn, chọn ngày, xem cung hoàng đạo, số chủ đạo, rút bài Tarot, đọc bài giải thích phương pháp. Phần lớn dùng điện thoại; nhiều người quay lại thường xuyên để xem vận trình, lịch âm hôm nay.

## Product Purpose

Nền tảng huyền học tổng hợp tiếng Việt: tử vi phái Việt, 12 con giáp, lịch vạn niên và xem ngày, ngũ hành và phong thủy, chiêm tinh phương Tây, thần số học, Tarot, giải mộng, thư viện bài viết, trợ lý AI. Thành công là người dùng tra cứu nhanh, đọc được nội dung dài dễ dàng, hiểu kết quả được tính theo phương pháp nào.

## Positioning

Mọi kết quả được tính bằng bộ quy tắc công khai riêng cho từng hệ (âm lịch theo thuật toán Hồ Ngọc Đức, an sao phái Việt, vị trí hành tinh tính thật bằng Astronomy Engine, Pythagoras ghi rõ trường phái), chạy ngay trên máy người dùng; trang luôn ghi phương pháp và tính tham khảo. Trợ lý AI chỉ diễn giải dữ liệu đã tính, không tự tạo sao, cung hay kết quả.

## Operating Context

Trang tĩnh trên GitHub Pages (https://nakame9.github.io/Spiritual/), mỗi phần có backend Node/Express tùy chọn (bài viết từ trang quản trị, lượt đọc, trợ lý AI). Không có tài khoản người dùng trên máy chủ: hồ sơ, lịch sử, yêu thích lưu trong trình duyệt (đã xác nhận với chủ dự án).

## Capabilities and Constraints

- HTML, CSS, JavaScript thuần, module UMD dùng chung trình duyệt và Node; không framework, không bước build ngoài các script trong `scripts/`.
- Menu và chân trang sinh từ `scripts/menu.js`; trang bài viết sinh từ `scripts/bai-viet.js`; `npm test` kiểm tra cả hai.
- Hệ con giáp Việt Nam: Mão là Mèo.
- Thứ tự triển khai giao diện theo đặc tả 8 giai đoạn; giai đoạn 1 là design system, header, footer, trang chủ.

## Brand Commitments

- Tên: Lá Số Tử Vi. Ngôn ngữ: tiếng Việt.
- Đặc tả giao diện v1.0 (12/11/2026) của chủ dự án là ràng buộc: nền kem ngà cho vùng đọc, navy đêm cho header, hero, khu nhấn và footer, vàng champagne làm màu nhấn, trắng cho card và biểu mẫu, xám xanh cho chữ phụ, đỏ trầm cho cảnh báo; Playfair Display hoặc Cormorant Garamond cho tiêu đề, Inter hoặc Be Vietnam Pro cho nội dung; họa tiết chòm sao, vòng hoàng đạo, âm dương, ngũ hành ở mức vừa phải; không hiệu ứng phát sáng dày đặc hay hoạt ảnh gây phân tâm.

## Evidence on Hand

- Ảnh chụp công cụ thật: `tuvivietnam/frontend/img/cong-cu/`.
- 16 bài viết trong `tuvivietnam/frontend/js/thu-vien-du-lieu.js`, mỗi bài có ảnh đại diện SVG vẽ theo chuyên mục.
- Không có lời chứng thực, số người dùng hay đánh giá: không được bịa.

## Product Principles

- Tách rõ dữ liệu nhập, kết quả tính và phần luận giải.
- Công khai phương pháp, trường phái và tính tham khảo trên mọi kết quả.
- Mobile-first, đọc được nội dung dài thoải mái.
- Dùng chung một hệ màu, chữ, nút, biểu mẫu, card, điều hướng cho mọi phần.

## Accessibility & Inclusion

Vùng chạm 44–48 px, tương phản chữ đạt WCAG AA, không dùng màu làm tín hiệu duy nhất, nhãn rõ cho ô nhập và lỗi, điều hướng bàn phím cho thành phần tương tác, tôn trọng giảm chuyển động.
