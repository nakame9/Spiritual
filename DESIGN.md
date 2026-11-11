---
name: Lá Số Tử Vi
description: Nền tảng huyền học tiếng Việt; hệ giao diện "Đêm và ngày" theo đặc tả giao diện v1.0.
colors:
  navy: "#101B30"
  navy-2: "#18263F"
  navy-3: "#253552"
  navy-ink-2: "#C9CFDA"
  navy-muted: "#A9B3C4"
  navy-rule: "#2C3D5C"
  champagne: "#D6B56D"
  champagne-2: "#E8D6A7"
  kem-nga: "#F7F4ED"
  trang-card: "#FFFFFF"
  kem-dam: "#EFE9DC"
  ink-2: "#2E3A52"
  xam-xanh: "#586477"
  rule: "#E3DCCB"
  line-strong: "#A9A08C"
  vang-nau: "#7C5F22"
  vang-nau-dam: "#5F4817"
  focus: "#9A7428"
  vang-gach: "#B8954A"
  do-tram: "#8B5960"
  thanh-cong: "#3C6E4F"
  hanh-kim: "#6B6658"
  hanh-moc: "#2F6B47"
  hanh-thuy: "#2B4E7E"
  hanh-hoa: "#A2452F"
  hanh-tho: "#8A5A1E"
typography:
  display:
    fontFamily: "Playfair Display, Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.375rem, 3.2vw + 1.2rem, 3.625rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Playfair Display, Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.875rem, 1.6vw + 1.25rem, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Playfair Display, Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.625rem, 1.2vw + 1.2rem, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  card-title:
    fontFamily: "Playfair Display, Cormorant Garamond, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.25
  subhead:
    fontFamily: "Be Vietnam Pro, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
  lead:
    fontFamily: "Be Vietnam Pro, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.3vw + 1rem, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Be Vietnam Pro, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Be Vietnam Pro, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.35
  number:
    fontFamily: "Playfair Display, Cormorant Garamond, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  xs: "6px"
  sm: "10px"
  card: "14px"
  pill: "999px"
spacing:
  3xs: "2px"
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "56px"
  3xl: "72px"
  4xl: "112px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.kem-nga}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#22324F"
    textColor: "{colors.kem-nga}"
  button-primary-dem:
    backgroundColor: "{colors.champagne}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-dem-hover:
    backgroundColor: "{colors.champagne-2}"
    textColor: "{colors.navy}"
  button-secondary:
    backgroundColor: "{colors.trang-card}"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.trang-card}"
    textColor: "{colors.navy}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "48px"
  segmented-selected:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.kem-nga}"
    rounded: "7px"
    padding: "0 16px"
  card:
    backgroundColor: "{colors.trang-card}"
    textColor: "{colors.navy}"
    rounded: "{rounded.card}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.kem-nga}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  header:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.navy-ink-2}"
    height: "72px"
---

# Design System: Lá Số Tử Vi

## Overview

**Creative North Star: "Đêm và ngày"**

Trang được đóng khung bằng đêm: header, hero, khu Tarot và footer là những dải navy sâu, còn mọi thứ cần đọc kỹ (vận trình, lịch âm, bài viết, biểu mẫu) nằm trên nền kem ngà ban ngày và trong các card trắng. Vàng champagne là sợi chỉ ánh sao nối hai bên: viền nhấn, biểu tượng, nét vẽ vòng hoàng đạo, nút chính khi đứng trên nền đêm. Không có vùng nào là "huyền bí tối toàn phần"; đêm chỉ đóng khung, ngày mới là chỗ đọc.

Mật độ vừa phải, thiên về đọc thoải mái trên điện thoại: chữ nội dung 16 px, dòng 1.55 đến 1.75, vùng chạm 44 đến 48 px, card bo 14 px với bóng mềm chỉ khi cần nổi. Tiêu đề Playfair Display mang giọng trang trọng, cổ điển; nội dung và mọi điều khiển dùng Be Vietnam Pro để dấu tiếng Việt rõ ràng.

Hệ này từ chối hai hướng đã được chủ dự án xác nhận: trang huyền bí tối toàn phần với hiệu ứng phát sáng dày đặc, và trang SaaS trắng xám vô danh. Họa tiết có mức độ: một vòng hoàng đạo 12 nan với chấm chòm sao, vẽ nét champagne mảnh, là hình ảnh trang trí đặc trưng duy nhất.

**Key Characteristics:**
- Navy đêm đóng khung, kem ngà để đọc, trắng cho card và biểu mẫu.
- Champagne chỉ là nét nhấn, không phải nền rộng trên vùng sáng.
- Playfair Display cho tiêu đề, Be Vietnam Pro cho nội dung và điều khiển.
- Nút dạng viên thuốc (pill), card bo 14 px, ô nhập bo 10 px.
- Màu mang dữ liệu (tốt, xấu, ngũ hành) tách khỏi màu trang trí.
- Chế độ tối là một biến thể navy, không phải đảo màu đơn thuần.

## Colors

Bảng màu hai cực đêm và ngày, nối bằng một ánh vàng champagne ấm; mọi màu chữ trên nền kem đều đạt WCAG AA.

### Primary
- **Navy đêm** (#101B30): nền header, hero, khu Tarot, footer, ô biểu tượng của card chức năng, nền nút chính trên vùng sáng, mục đang chọn của nút phân đoạn và menu phụ. Cũng là màu chữ chính (`--color-ink`) trên nền sáng. Hai sắc phụ: **Navy hover** (#18263F) cho nền mục menu khi rê chuột và mặt sau lá bài, **Navy sâu** (#253552) cho lớp sâu hơn.
- **Đường kẻ đêm** (#2C3D5C): đường phân cách bên trong dải navy (footer, drawer, thẻ lịch ngày).

### Secondary
- **Vàng champagne** (#D6B56D): viền card biểu mẫu hero, biểu tượng trên nền navy, nét vòng hoàng đạo, gạch dưới mục menu của trang hiện tại, viền focus trong header, nút chính bên trong vùng `.dem`. Chỉ dùng trên nền navy hoặc làm nét mảnh; không dùng làm màu chữ trên kem (không đủ tương phản).
- **Champagne nhạt** (#E8D6A7): trạng thái hover của nút champagne, chữ nhấn (ngày âm) trên nền navy.
- **Vàng gạch** (#B8954A): màu gạch chân của liên kết, viền card khi hover, thanh cuộn.

### Tertiary
- **Vàng nâu** (#7C5F22): champagne đã làm tối để đọc được trên kem và trắng. Dùng cho chữ nhấn (nhãn nhóm, "Xem chi tiết", mục đang chọn trong menu thả), hover của liên kết, và là màu trạng thái **tốt** (`--color-tot`). **Vàng nâu đậm** (#5F4817) cho nhấn mạnh hơn.
- **Vàng focus** (#9A7428): viền focus cho ô nhập, nút và card trên nền sáng.

### Neutral
- **Kem ngà** (#F7F4ED): nền trang ban ngày, nền khối phụ bên trong card (hồ sơ, thẻ lĩnh vực, chip giờ), và là màu chữ trên nền navy.
- **Trắng card** (#FFFFFF): card, biểu mẫu, menu thả, ô nhập, nút phụ.
- **Kem đậm** (#EFE9DC): nền gợi ý, thanh điểm rỗng, khung ảnh, ô nhập bị vô hiệu, hover của nút phân đoạn.
- **Mực phụ** (#2E3A52): chữ nội dung thứ cấp, nhãn ô nhập, đoạn mô tả.
- **Xám xanh** (#586477): chữ phụ, chú thích, placeholder, ngày tháng. Đã làm tối từ tông đặc tả để đạt AA trên kem.
- **Đường kẻ** (#E3DCCB): viền card, đường phân cách trên nền sáng.
- **Viền đậm** (#A9A08C): viền ô nhập, nút phụ, nút phân đoạn, khung trạng thái trống.
- **Chữ mờ đêm** (#C9CFDA) và **Xám đêm** (#A9B3C4): chữ phụ và chú thích trong header, hero, footer.

### Màu trạng thái và dữ liệu
- **Đỏ trầm** (#8B5960): cảnh báo, lỗi, trạng thái xấu, điểm thấp. Luôn đi cùng chữ hoặc biểu tượng tam giác, không đứng một mình.
- **Xanh thành công** (#3C6E4F): chỉ cho thông báo thao tác thành công (đã lưu, đã xóa), không dùng để đánh giá ngày hay điểm.
- **Ngũ hành**: Kim (#6B6658), Mộc (#2F6B47), Thủy (#2B4E7E), Hỏa (#A2452F), Thổ (#8A5A1E). Đây là màu dữ liệu, gắn với hành của sao, năm, mệnh.

### Chế độ tối
Chế độ tối (theo hệ điều hành, hoặc `data-theme="dark"`) giữ cấu trúc đêm và ngày bằng cách đẩy cả hai về navy: nền trang #0F1829, card #16223A, nền phụ #1F2D48, chữ #F2EDE2, chữ phụ #A7B0C0, đường kẻ #2B3A56; dải đêm sâu hơn (#0A1222). Nút chính đổi sang champagne với chữ navy, vàng nâu sáng lên thành #DDBF7B, đỏ trầm thành #D99CA3, ngũ hành chuyển sang tông sáng để giữ AA. Giá trị nằm trong `shared/site.css`; token sáng nằm trong `shared/tokens.css`.

### Named Rules
**The Đêm Đóng Khung Rule.** Navy chỉ dành cho các dải khung (header, hero, khu nhấn như Tarot, footer) và các điểm nhấn nhỏ (ô biểu tượng, mục đang chọn). Nội dung đọc dài không bao giờ nằm trên navy.

**The Sợi Chỉ Vàng Rule.** Champagne #D6B56D là nét, viền, biểu tượng và nút trên nền đêm. Trên nền kem hoặc trắng, chữ nhấn dùng vàng nâu #7C5F22; champagne chỉ xuất hiện dưới dạng viền hoặc nét vẽ.

**The Tốt Là Vàng Rule.** Trạng thái thuận lợi (ngày tốt, điểm cao, giờ hoàng đạo) dùng vàng nâu `--color-tot`, không dùng xanh lá; trạng thái bất lợi dùng đỏ trầm. Mỗi trạng thái luôn có chữ đi kèm (chấm tròn + nhãn), màu không bao giờ là tín hiệu duy nhất.

**The Màu Dữ Liệu Rule.** Năm màu ngũ hành chỉ dùng để mã hóa hành trong dữ liệu (sao, mệnh, năm). Không dùng chúng làm màu trang trí, nền section hay màu nút.

## Typography

**Display Font:** Playfair Display (với Cormorant Garamond, Georgia, serif)
**Body Font:** Be Vietnam Pro (với Inter, ui-sans-serif, system-ui)

**Character:** Playfair mang nét tương phản cao, trang trọng như bìa sách tử vi; Be Vietnam Pro được thiết kế cho dấu tiếng Việt, gọn và rõ ở cỡ nhỏ. Cả hai tự lưu trong kho (`shared/fonts/`, SIL OFL), không phụ thuộc Google Fonts; Playfair nạp hai độ đậm 500 và 600, Be Vietnam Pro nạp 400, 500, 600.

### Hierarchy
- **Display** (600, clamp 38 đến 58 px, line-height 1.06, tối đa 13ch): tiêu đề hero trên nền navy, mỗi trang một lần.
- **Headline** (600, clamp 30 đến 40 px, 1.12): tiêu đề trang (h1) của các trang công cụ và trang phụ.
- **Title** (600, clamp 26 đến 36 px, 1.15): tiêu đề section (h2) như "Vận trình hôm nay", "Lịch âm hôm nay".
- **Card title** (Playfair 600, 22 px, 1.25; 18 px trên điện thoại): tên công cụ trong card chức năng, tiêu đề bài viết, tên hồ sơ.
- **Subhead** (Be Vietnam Pro 600, 18 px, 1.2): h3 mặc định, tên lĩnh vực trong thẻ vận trình. Mặc định h3 là chữ không chân; chỉ tiêu đề card dạng liên kết mới dùng Playfair.
- **Lead** (400, clamp 17 đến 19 px, 1.6 đến 1.65, tối đa 46 đến 62ch): đoạn mở đầu dưới tiêu đề.
- **Body** (400, 16 px, 1.55; 1.75 cho văn bản dài, tối đa 65 đến 75ch): nội dung.
- **Label** (600, 14 px, 1.35): nhãn ô nhập, liên kết hành động, tiêu đề cột footer (màu champagne).
- **Number** (Playfair 600, 28 px, 1, số đều cột): điểm vận trình; ngày dương lịch lớn trong thẻ lịch lên đến 80 px.

### Named Rules
**The Không Kicker Rule.** Không đặt nhãn nhỏ (eyebrow, kicker) phía trên tiêu đề. Tiêu đề tự đứng; ngữ cảnh đi vào lead hoặc chú thích bên dưới.

**The Chữ Đậm Vừa Rule.** Độ đậm tối đa là 600 cho cả hai phông; không giả đậm (`font-synthesis: none`). Tracking tiêu đề -0.01em; không dùng chữ in hoa giãn cách.

## Layout

Khung nội dung rộng tối đa 1200 px với lề 32 px (24 px dưới 60rem, 16 px dưới 40rem, có tính vùng an toàn). Các dải đêm (header, hero, footer) tràn toàn bề rộng nhưng nội dung bên trong vẫn canh theo khung 1200 px. Khoảng cách giữa các section 48 px (40 px dưới 60rem, 32 px dưới 40rem); trong section, tiêu đề và nội dung cách nhau 24 px; trong card 16 px.

Thang khoảng cách cố định: 2, 4, 8, 12, 16, 24, 40, 56, 72, 112 px. Lưới card dùng khoảng 16 px. Header cao 72 px (64 px trên điện thoại) và dính trên cùng; mọi neo cuộn bù chiều cao header.

Hành vi đáp ứng theo ba mốc: 68rem (menu ngang chuyển thành drawer bên phải rộng tối đa 380 px; lưới bài viết 4 xuống 2 cột), 60rem (hero hai cột xuống một cột; lưới chức năng 3 xuống 2; vận trình 4 xuống 2; footer một cột), 40rem (mọi lưới một cột, card padding 16 px, trong hero thứ tự là tiêu đề, lead, biểu mẫu rồi mới đến ba điểm tin cậy). Bố cục hai cột của hero là chữ bên trái, biểu mẫu trong card trắng bên phải.

## Elevation & Depth

Hệ dùng bóng mềm có tông navy, không dùng bóng cứng. Trên nền sáng, card ở trạng thái nghỉ phẳng với viền mảnh #E3DCCB; bóng xuất hiện khi card là biểu mẫu chính, khi rê chuột lên card liên kết, hoặc khi là lớp nổi (menu thả, ô tìm kiếm). Trên nền đêm, chiều sâu đến từ một quầng champagne rất nhạt (radial 10 đến 12%) phía sau nội dung, và bóng đen sâu dưới card biểu mẫu và lá bài Tarot.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px rgb(16 27 48 / 0.05), 0 10px 28px -12px rgb(16 27 48 / 0.18)`): biểu mẫu chính, card liên kết khi hover.
- **Pop** (`box-shadow: 0 2px 6px rgb(16 27 48 / 0.08), 0 24px 48px -16px rgb(16 27 48 / 0.32)`): menu thả xuống, ô tìm kiếm.
- **Header khi cuộn** (`box-shadow: 0 10px 30px -14px rgb(5 10 20 / 0.55)`): kèm đường viền dưới champagne 35% khi trang đã cuộn.
- **Nổi trên đêm** (`box-shadow: 0 30px 60px -24px rgb(0 0 0 / 0.55)`): card biểu mẫu trắng đặt trên hero navy.

### Named Rules
**The Phẳng Khi Nghỉ Rule.** Card nội dung trên nền sáng phẳng ở trạng thái nghỉ (chỉ viền mảnh); bóng là phản hồi trạng thái (hover, nổi) hoặc dấu hiệu của biểu mẫu chính.

**The Không Phát Sáng Rule.** Không dùng glow, neon hay bóng màu phát sáng. Ánh sáng duy nhất là quầng champagne mờ trên nền navy.

## Shapes

Ngôn ngữ hình khối mềm và đều: card, menu thả, khung ảnh, thẻ lịch bo 14 px; ô nhập, nút phân đoạn, mục menu bo 10 px; khối gợi ý nhỏ bo 6 px; nút, chip, menu phụ và nút tròn trong header dạng viên thuốc (999 px). Khu Tarot trên trang chủ bo lớn hơn card một bậc (20 px) để đọc như một tấm thẻ đêm riêng. Đường viền luôn 1 px; gạch nhấn (mục menu hiện tại, thanh điểm) 2 đến 3 px, bo tròn đầu.

Hình đặc trưng là vòng tròn: logo là vòng hoàng đạo 12 nan với ngôi sao bốn cánh ở tâm; hero có cùng vòng đó phóng lớn, cắt mép phải, vẽ nét champagne mảnh với chấm chòm sao; thẻ lịch ngày và mặt sau lá Tarot dùng các cung tròn đồng tâm cùng nét đó.

## Components

### Buttons
Viên thuốc chắc chắn, một màu đặc, không gradient.
- **Shape:** dạng viên thuốc (999 px), cao 48 px cho nút chính, 44 px cho nút phụ.
- **Primary:** nền navy, chữ kem ngà, Be Vietnam Pro 600 16 px, padding ngang 24 px. Hover đổi nền sang #22324F; nhấn dịch xuống 1 px. Trong vùng đêm (`.dem`: hero, Tarot) nút chính đổi thành nền champagne chữ navy, hover sang champagne nhạt.
- **Secondary:** nền trắng, viền mảnh #A9A08C, chữ navy 600 14 px, padding ngang 16 px; hover chỉ đậm viền thành navy. Trong vùng đêm: nền trong suốt, viền champagne 55%, chữ kem; hover viền champagne đặc.
- **Liên kết hành động:** chữ navy 600 14 px, gạch chân vàng gạch, offset 4 px; hover chữ chuyển vàng nâu.
- **Hover / Focus:** chuyển màu 200 ms ease-out; focus là viền 2 px vàng focus cách 2 px (champagne trong header).
- **Disabled:** độ mờ 0.55, con trỏ not-allowed.

### Chips
- **Style:** nền kem ngà, viền mảnh #E3DCCB, chữ 500 14 px số đều cột, padding 4 px 10 px, dạng viên thuốc. Dùng cho danh sách giờ hoàng đạo.
- **Menu phụ (subnav):** viên thuốc trắng viền mảnh cao 40 px; mục hiện tại nền navy chữ kem.

### Cards / Containers
- **Corner Style:** bo 14 px.
- **Background:** trắng trên nền kem; khối con bên trong card dùng kem ngà, bo 10 px.
- **Shadow Strategy:** phẳng khi nghỉ; card liên kết hover thêm bóng Card, viền đổi vàng gạch và nâng 2 px (xem Elevation & Depth).
- **Border:** 1 px #E3DCCB.
- **Internal Padding:** 24 px (16 px trên điện thoại).

### Inputs / Fields
- **Style:** nền trắng, viền 1 px #A9A08C, bo 10 px, cao 48 px, chữ 16 px số đều cột; nhãn 600 14 px mực phụ đặt phía trên. Ngày sinh nhập bằng ba ô số ngắn ngăn bằng dấu gạch chéo.
- **Focus:** viền 2 px vàng focus cách 1 px, viền ô đổi theo.
- **Hover:** viền đậm thành mực phụ.
- **Error / Disabled:** viền đỏ trầm, thông báo lỗi đỏ trầm 500 với biểu tượng tam giác SVG phía trước; vô hiệu thì nền kem đậm, độ mờ 0.55.
- **Nút phân đoạn:** khung trắng viền đậm bo 10 px, cao 48 px; mục chọn nền navy chữ kem, bo 7 px. Dùng cho Dương lịch/Âm lịch, Nam/Nữ, mốc thời gian.

### Navigation
- **Header:** dải navy dính trên cùng, cao 72 px. Logo vòng hoàng đạo champagne + tên Playfair 600 20 px + dòng phụ. Mục menu Be Vietnam Pro 500 15 px màu chữ mờ đêm; hover nền navy hover chữ kem; mục của trang hiện tại có gạch champagne 2 px phía dưới. Nhóm menu mở ra menu thả trắng bo 14 px, bóng Pop, mỗi mục có tên đậm và một dòng mô tả xám xanh. Markup sinh từ `scripts/menu.js` theo `shared/dieu-huong.js`.
- **Nút tròn:** tìm kiếm, hồ sơ, mở menu là nút tròn 44 px, biểu tượng 22 px; hover nền navy hover, biểu tượng champagne.
- **Mobile:** dưới 68rem menu thành drawer navy trượt từ phải (380 ms ease-out) với lớp phủ tối; mục cao 48 px, mục hiện tại có gạch champagne dọc 3 px bên trái.
- **Footer:** dải navy, cột giới thiệu (logo, mô tả) và lưới các cột liên kết; tiêu đề cột champagne 600 14 px, liên kết chữ mờ đêm, tuyên bố tham khảo ở hàng dưới cùng sau đường kẻ đêm.

### Thẻ chỉ số vận trình
Thẻ trắng bo 14 px: tên lĩnh vực (Subhead), điểm lớn Playfair kèm "%", nhãn mức (chấm tròn 8 px + chữ) màu vàng nâu nếu cao, đỏ trầm nếu thấp, mực phụ nếu trung bình; thanh điểm 6 px bo tròn trên nền kem đậm, phần đầy cùng màu với mức.

### Vòng hoàng đạo (signature)
SVG vẽ tay: các vòng tròn đồng tâm, 12 nan, vạch chia độ mịn, bốn chòm sao chấm nối nét, ngôi sao bốn cánh ở tâm; tất cả `currentColor` champagne với độ mờ 0.25 đến 0.55. Đặt sau nội dung hero, lệch phải, cắt mép, không chặn tương tác. Khi tải trang, vòng ngoài được vẽ dần một lần (1.6 s ease-out); dưới giảm chuyển động thì hiện sẵn.

### Biểu tượng
Mọi biểu tượng giao diện là SVG tự vẽ, nét 1.6 (nét phụ 1.1 đến 1.2), đầu nét bo tròn, dùng `currentColor`. Biểu tượng chức năng đặt trong ô navy bo 14 px, 52 px, nét champagne. Ký hiệu 12 cung (♈ đến ♓) là dữ liệu chiêm tinh, hiển thị bằng phông ký hiệu (`--font-symbol`) để không thành emoji.

### Chuyển động
Chuyển động chỉ để phản hồi: chuyển màu 120 đến 200 ms, menu thả và lớp phủ 200 ms, drawer 380 ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`. Hiệu ứng trình diễn duy nhất là nét vẽ vòng hoàng đạo trong hero; lá Tarot xòe nhẹ khi hover. Mọi chuyển động dừng dưới `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** đặt nội dung đọc trên nền kem ngà #F7F4ED hoặc card trắng, và dành navy #101B30 cho header, hero, khu nhấn, footer.
- **Do** dùng nút chính navy trên vùng sáng và nút chính champagne trong vùng `.dem`; nút phụ là viên thuốc trắng viền mảnh.
- **Do** bo card 14 px, ô nhập 10 px, nút dạng viên thuốc; card phẳng khi nghỉ, bóng Card khi hover hoặc là biểu mẫu chính.
- **Do** dùng vàng nâu #7C5F22 cho chữ nhấn và trạng thái tốt trên nền sáng, đỏ trầm #8B5960 cho cảnh báo, và luôn kèm chữ hoặc biểu tượng.
- **Do** vẽ biểu tượng giao diện bằng SVG nét 1.6 `currentColor`; họa tiết trang trí duy nhất là vòng hoàng đạo nét champagne mảnh.
- **Do** giữ vùng chạm 44 đến 48 px và viền focus 2 px vàng (champagne trên nền navy).
- **Do** dùng năm màu ngũ hành chỉ để mã hóa hành trong dữ liệu.

### Don't:
- **Don't** làm trang tối toàn phần hay thêm glow, neon, ánh phát sáng dày đặc.
- **Don't** làm trang trắng xám vô danh kiểu SaaS: nền trang là kem ngà, không phải xám.
- **Don't** đặt nhãn eyebrow hay kicker phía trên tiêu đề.
- **Don't** dùng champagne làm màu chữ trên nền kem hoặc trắng, hay làm nền lớn trên vùng sáng.
- **Don't** dùng xanh lá cho ngày tốt hay điểm cao; xanh thành công chỉ dành cho thông báo thao tác.
- **Don't** dùng bóng cứng lệch (offset không mờ), emoji hay ký tự làm biểu tượng giao diện, hoặc phông hệ thống cho tiêu đề.
- **Don't** thêm họa tiết nền trang trí thứ hai; sơ đồ ngũ hành, âm dương, lá số chỉ xuất hiện khi chúng là nội dung (minh họa bài, biểu đồ dữ liệu).
