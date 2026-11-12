# DESIGN.md: Lá Số Tử Vi, "Oriental Modern"

Huyền học phương Đông hiện đại: huyền bí nhưng không tối. Nền giấy ngà sáng chiếm ưu thế, chữ màu mực, đỏ đô cho hành động, vàng champagne cho đường chỉ và hoa văn mảnh.

## Nguồn
- `shared/tokens.css`: màu, cỡ chữ, khoảng cách, bo góc, đổ bóng, thời lượng chuyển động.
- `shared/site.css`: header, menu, chân trang, nút, ô nhập, panel, tab, toast, modal, trạng thái; bí danh biến cũ (`--paper`, `--ink`, `--tu`…) cho css từng phần; chế độ tối.
- `shared/base.css`: reset, cuộn, chữ cơ bản. `shared/fonts.css`: Cormorant Garamond 500–700, Be Vietnam Pro 400–600 (tự lưu trữ, có tập tiếng Việt).
- Header và chân trang sinh từ `shared/dieu-huong.js` bằng `node scripts/menu.js`; hành vi ở `shared/site.js`.

## Màu
| Vai trò | Giá trị |
|---|---|
| Nền trang / giấy / be | #F6F1E8 / #FBF8F2 / #EAE1D3 |
| Chữ / chữ phụ | #29251F / #6B6458 (đạt AA trên nền ngà) |
| Hành động (nút chính, mục đang chọn, `--tu`) | đỏ đô #783B3B, hover #5F2C2C |
| Viền nhấn, hoa văn | vàng #B69A65, vàng nhạt #D8C7A3, vàng đậm cho chữ #9C8152 |
| Tốt / phụ | xanh rêu #566B59; xanh mực #263746 (ô "Hôm nay", mặt sau lá Tarot) |
| Ngũ hành (dữ liệu) | Kim #6E6A5E, Mộc #4E6B52, Thủy #2F4A63, Hỏa #8E3E36, Thổ #8A6328 |

## Chữ
- Tiêu đề: Cormorant Garamond 600, số kiểu lining (`font-variant-numeric: lining-nums` trên body).
- Nội dung: Be Vietnam Pro 400/500/600; số liệu dùng `tabular-nums`.
- Mỗi `h1` có đường hoa văn vàng phía trên (`h1::before`, dùng `--hoa-van`).

## Hình khối
- Bo góc: card 6px, nhỏ 4px. Đổ bóng mềm, chỉ cho biểu mẫu chính và lớp nổi.
- Biểu mẫu chính (`.well`, `form.panel`, `.hero > form`, `.quick`): giấy sáng, viền mảnh, hai góc chỉ vàng.
- Không viền dày một bên; khối nhấn dùng nền be hoặc viền vàng 1px.
- Chân trang nền be, đường vàng và hình thoi hoa văn ở mép trên.

## Chuyển động
- 120/220/480ms, ease-out. Vòng 12 địa chi ở trang chủ xoay 240 giây/vòng, tắt khi `prefers-reduced-motion`.

## Trang chủ
Hero (tiêu đề, hai nút, vòng 12 địa chi và Bát quái vẽ nét) → Lập lá số nhanh → kết quả ba hệ → sáu công cụ → Hôm nay, bài viết mới, hướng dẫn → Cách chúng tôi tính → chân trang.

## Hình minh họa
- `shared/minh-hoa/*.svg` (480×270, 16:9): tranh nét vàng trên nền be, quầng sáng tròn, sao bốn cánh; điểm nhấn đỏ đô, xanh mực, màu ngũ hành.
- Mỗi chức năng một hình: la-so (bàn 12 cung, Bắc Đẩu), con-giap (vòng 12 chi, mèo tuổi Mão), xem-ngay (tờ lịch, tuần trăng), chiem-tinh (quả cầu thiên văn), hop-doi (hai vòng mặt trời, mặt trăng), than-so (tam giác mười chấm, biểu đồ 3×3), tarot (ba lá xòe), ngu-hanh, hop-tuoi (nhẫn và chỉ hồng), la-ban (la bàn Bát quái), giai-mong, tro-ly, sach.
- Dùng: thẻ công cụ và dải "Tra cứu nhanh" ở trang chủ, thẻ trang Tra cứu, đầu trang công cụ (`.dau-cong-cu`, hoặc `.anh-hero` dưới đoạn dẫn khi đầu trang có biểu mẫu). Lớp chung: `.minh-hoa`.
