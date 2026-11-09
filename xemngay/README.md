# Xem ngày tốt xấu (xemngay)

Chức năng xem ngày của website Lá Số Tử Vi, theo lịch vạn niên dân gian Việt Nam. Chỉ tính trên máy người xem; năm sinh không lưu, không gửi đi.

## Chức năng

- **Lịch tháng** (`index.html`): lịch dương và âm song song; mỗi ô có ngày dương, ngày âm, can chi ngày, trực, tiết khí (ngày bắt đầu tiết), dấu hoàng đạo và chấm màu theo mức tốt xấu; rê chuột xem sao tốt xấu và giờ hoàng đạo. Chuyển tháng bằng nút hoặc chọn tháng, năm bất kỳ.
- **Chi tiết ngày**: thông tin ngày (dương, âm, thứ, can chi ngày tháng năm, ngũ hành nạp âm, tiết khí, trực); đánh giá ngày (tính chất, sao tốt, sao xấu, ngày kỵ, giờ tốt, giờ cần tránh, hướng xuất hành, tuổi); đánh giá 7 việc khai trương, cưới hỏi, động thổ, nhập trạch, xuất hành, ký kết, khởi công (Nên làm, Cân nhắc, Không nên kèm lý do); mục "Phương pháp tính". Mở với `index.html#ngay=2026-10-24&nam=1990&tz=7`.
- **Chọn ngày theo việc** (`chon-ngay.html`): bắt buộc chọn việc trước; chọn khoảng thời gian (tối đa 190 ngày), ngày sinh hoặc năm sinh người thực hiện, khu vực/múi giờ. Mỗi ngày được xếp loại Tốt theo tiêu chí, Trung bình hoặc Cần lưu ý kèm nội dung; xem danh sách ngày tốt xếp từ tốt nhất hoặc tất cả ngày theo lịch.

## Cách tính

| Mục | Cách tính |
|---|---|
| Âm lịch, can chi | Dùng lại `tuvi.js` (thuật toán Hồ Ngọc Đức, múi giờ +7). Can chi tháng theo tháng âm lịch |
| Hoàng đạo, hắc đạo | 12 thần (Thanh Long … Câu Trận), khởi Thanh Long theo tháng âm lịch. Dùng lại `congiap.js` như trang 12 con giáp và trang chủ |
| Thập nhị trực | Kiến … Bế; trực Kiến rơi vào ngày cùng chi với tháng tiết khí (tháng Dần bắt đầu từ Lập xuân, 315°). Ngày giao tiết lặp lại trực của hôm trước |
| Nhị thập bát tú | 28 sao xoay vòng mỗi ngày một sao; mốc 1/1/2025 là sao Sâm |
| Thần sát | Theo tháng âm lịch, bảng phổ biến trong Ngọc Hạp Thông Thư: Thiên Đức, Nguyệt Đức, Sinh Khí (tốt, +1); Thiên Cương, Hà Khôi, Sát Chủ (xấu, −2), Thụ Tử (−3, kỵ mọi việc lớn) |
| Ngũ hành ngày | Nạp âm của can chi ngày, kèm hành của can và chi |
| Giờ cần tránh | 6 giờ hắc đạo của ngày, cộng giờ xung tuổi khi nhập năm sinh |
| Múi giờ | Mặc định UTC+7 (lịch âm Việt Nam). Chọn múi giờ khác thì lịch âm, tiết khí, hoàng đạo, trực tính lại theo múi giờ đó |
| Tiết khí | 24 tiết, mỗi tiết 15° kinh độ Mặt Trời |
| Ngày kỵ | Tam nương (âm 3, 7, 13, 18, 22, 27), Nguyệt kỵ (5, 14, 23), Dương công kỵ nhật (13/1, 11/2, 9/3, 7/4, 5/5, 3/6, 8/7, 29/7, 27/8, 25/9, 23/10, 21/11, 19/12) |
| Hướng xuất hành | Hỷ thần và Tài thần theo can ngày |
| Tuổi | Xung: chi đối diện chi ngày. Hợp: tam hợp, lục hợp. Khi nhập năm sinh, xét thêm hình, hại, phá |

**Điểm %** = 50 + 7 × tổng điểm, giới hạn 0–100. Tổng điểm gồm: hoàng đạo +2, hắc đạo −2; trực tốt +1, xấu −1 (khi chọn việc: trực hợp việc +2, kỵ việc −3); sao tốt +1, xấu −1 (khi chọn việc: sao hợp việc +2, kỵ việc −2); Tam nương −2, Nguyệt kỵ −2, Dương công kỵ −3; quan hệ với tuổi theo `congiap.js`. Mức: từ 70% Tốt, 55% Khá, 40% Bình thường, dưới 40% Xấu.

**Đánh giá theo việc**: Tốt theo tiêu chí (Nên làm) khi ngày hoàng đạo, không phạm ngày kỵ, trực, sao và thần sát không kỵ việc đó, điểm từ 55%. Cần lưu ý (Không nên) khi trực, sao hoặc thần sát kỵ việc đó, phạm ngày kỵ, hoặc điểm dưới 40%. Còn lại là Trung bình (Cân nhắc).

Các ngày mẫu trong test đã đối chiếu với lịch vạn niên công bố (ngaydep.com, baohatinh.vn). Các sách lịch có thể khác nhau ở vài chi tiết như bảng Hỷ thần hay cách xếp sao tốt xấu.

```
xemngay/
├── frontend/
│   ├── index.html            Xem ngày + lịch tháng
│   ├── chon-ngay.html        Chọn ngày theo việc
│   ├── css/xem-ngay.css
│   └── js/lich-ngay.js       Cách tính (dùng chung với backend; cần tuvi.js, congiap.js của tuvivietnam)
│       js/trang-xem-ngay.js  Giao diện trang xem ngày
│       js/trang-chon-ngay.js Giao diện trang chọn ngày
└── backend/                  Node.js + Express (cổng 3004)
```

## Chạy trên máy

```bash
cd xemngay/backend
npm install
npm start        # mở http://localhost:3004
npm test
```

## API

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| `GET` | `/api/ngay?ngay=2026-10-24&namSinh=1990&viec=cuoiHoi&tz=7` | Chi tiết một ngày. `namSinh` (năm âm lịch), `viec`, `tz` không bắt buộc |
| `GET` | `/api/viec-ngay?ngay=2026-10-24&namSinh=1990&tz=7` | Đánh giá 7 việc trong một ngày |
| `GET` | `/api/thang?nam=2026&thang=10&namSinh=1990&tz=7` | Cả tháng dương lịch |
| `GET` | `/api/chon-ngay?viec=khaiTruong&tu=2026-11-01&den=2026-12-31&namSinh=1990&tz=7` | `ngay`: ngày tốt theo tiêu chí xếp từ tốt nhất; `tatCa`: mọi ngày theo lịch kèm `loai`, `danhGia`, `noiDung`. Tối đa 190 ngày |
| `GET` | `/api/viec` | Danh sách việc: `khaiTruong`, `cuoiHoi`, `dongTho`, `nhapTrach`, `xuatHanh`, `kyKet`, `khoiCong` |

`tz` nhận: 7 (mặc định), 8, 9, 10, 12, 0, 1, 3, −5, −6, −8.
| `GET` | `/api/health` | `{ "ok": true }` |

Nội dung do Lá Số Tử Vi tự biên soạn, chỉ để tham khảo.
