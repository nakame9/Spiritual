# Design: Lá Số Tử Vi

Hệ giao diện đã khóa. Mọi trang mới đọc file này trước và dùng chung hệ này. Muốn đổi thì đổi ở đây có chủ đích; file này là luật.

## System
- Genre: editorial
- Shape of the first page: Map / Diagram (trang chủ); các trang công cụ là app screen giữ bố cục riêng
- Theme: Solstice (Hallmark), light long-light, dark mode dùng ánh "dusk"
- Axes: light/high-contrast-serif/warm · posture: restrained

## Tokens
`shared/tokens.css` là nguồn gốc. Vai trò chính:
```css
:root {
  --color-paper: oklch(94% 0.03 80);  --color-paper-2: oklch(97% 0.02 85);  --color-paper-3: oklch(89% 0.05 80);
  --color-ink: oklch(27% 0.05 50);  --color-ink-2: oklch(36% 0.05 50);  --color-muted: oklch(48% 0.06 55);  --color-rule: oklch(84% 0.06 78);
  --color-accent: oklch(54% 0.20 24);  --color-accent-ink: oklch(97% 0.02 85);  --color-focus: oklch(54% 0.20 24);  --color-gold: oklch(74% 0.14 75);
  --font-display: "Yeseva One";  --font-body: "Archivo";  --font-outlier: "Archivo Narrow";  --font-symbol: (chỉ cho ký hiệu 12 cung)
  --radius-card: 0;  --radius-pill: 999px;  --rule-hair: 1px;  --rule-bar: 2px;  --shadow-card: 10px 10px 0 var(--color-paper-3);
}
```
Thang khoảng cách, cỡ chữ, easing, thời lượng nằm trong `tokens.css`. Màu dark mode, dải mực (`--band-*`), ánh hero (`--color-glow`) và màu ngũ hành (`--kim --moc --thuy --hoa --tho`) nằm trong khối `:root` của `shared/site.css`. Tên cũ (`--paper --ink --tu --line --soft --hl --f-display --f-ui`) là bí danh cho css từng phần.

## Controls
- Primary: viên thuốc đỏ son (`button.go`, `a.btn.primary`), Archivo Narrow 600, cao 48px, một nút chính mỗi màn hình
- Secondary: chữ mực trên gạch chân 2px, không khung (`.btn2`, `a.btn`), cao tối thiểu 44px
- Ô nhập: vuông, nền paper-2, viền 1px muted, cao 48px; nhãn Archivo Narrow viết thường, không giãn chữ
- Bề mặt: tấm (`.panel`) viền mảnh; tấm nổi (biểu mẫu chính) viền mực 2px, chỉ vàng lồng trong, bóng giấy cứng

## Rules
- Không dòng chữ nhỏ viết hoa giãn trên tiêu đề (eyebrow), không chuỗi nối bằng dấu "·" trong nội dung, không mũi tên dính vào chữ liên kết
- Ảnh: ảnh của bạn hoặc ảnh thư viện Wikimedia Commons, ghi công ở chân trang (`data-credits`), xử lý ấm sepia nhẹ
- Ảnh chụp công cụ thật nằm ở `tuvivietnam/frontend/img/cong-cu/`

## Motion
- Character: calm. Chỉ đổi màu, gạch chân và dịch chuyển nhỏ; hiệu ứng xáo bài Tarot giữ theo yêu cầu. Khi giảm chuyển động, mọi thứ dừng ngay.

## Exports
`shared/tokens.css`, `shared/base.css`, `shared/fonts.css` (phông tự lưu trong `shared/fonts/`, SIL OFL 1.1).
