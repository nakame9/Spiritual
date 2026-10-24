# Xem ngày tốt xấu (xemngay)

Chức năng xem ngày của website Lá Số Tử Vi, theo lịch vạn niên dân gian Việt Nam. Chỉ tính trên máy người xem; năm sinh không lưu, không gửi đi.

## Chức năng

- **Xem ngày** (`index.html`): chọn một ngày, xem âm lịch, can chi ngày/tháng/năm, ngày hoàng đạo hay hắc đạo, trực, sao, tiết khí, ngày kỵ, giờ hoàng đạo, hướng xuất hành, tuổi xung và hợp. Có điểm % và lý do. Bên dưới là lịch tháng tô màu theo mức tốt xấu, bấm ngày nào xem ngày đó. Mở với `index.html#ngay=2026-10-24&nam=1990`.
- **Chọn ngày theo việc** (`chon-ngay.html`): chọn việc (cưới hỏi, động thổ, khai trương, về nhà mới, xuất hành, ký kết), khoảng thời gian (tối đa 190 ngày) và năm sinh nếu muốn, trang lọc ra ngày tốt và xếp từ tốt nhất.

## Cách tính

| Mục | Cách tính |
|---|---|
| Âm lịch, can chi | Dùng lại `tuvi.js` (thuật toán Hồ Ngọc Đức, múi giờ +7). Can chi tháng theo tháng âm lịch |
| Hoàng đạo, hắc đạo | 12 thần (Thanh Long … Câu Trận), khởi Thanh Long theo tháng âm lịch. Dùng lại `congiap.js` như trang 12 con giáp và trang chủ |
| Thập nhị trực | Kiến … Bế; trực Kiến rơi vào ngày cùng chi với tháng tiết khí (tháng Dần bắt đầu từ Lập xuân, 315°). Ngày giao tiết lặp lại trực của hôm trước |
| Nhị thập bát tú | 28 sao xoay vòng mỗi ngày một sao; mốc 1/1/2025 là sao Sâm |
| Tiết khí | 24 tiết, mỗi tiết 15° kinh độ Mặt Trời |
| Ngày kỵ | Tam nương (âm 3, 7, 13, 18, 22, 27), Nguyệt kỵ (5, 14, 23), Dương công kỵ nhật (13/1, 11/2, 9/3, 7/4, 5/5, 3/6, 8/7, 29/7, 27/8, 25/9, 23/10, 21/11, 19/12) |
| Hướng xuất hành | Hỷ thần và Tài thần theo can ngày |
| Tuổi | Xung: chi đối diện chi ngày. Hợp: tam hợp, lục hợp. Khi nhập năm sinh, xét thêm hình, hại, phá |

**Điểm %** = 50 + 7 × tổng điểm, giới hạn 0–100. Tổng điểm gồm: hoàng đạo +2, hắc đạo −2; trực tốt +1, xấu −1 (khi chọn việc: trực hợp việc +2, kỵ việc −3); sao tốt +1, xấu −1 (khi chọn việc: sao hợp việc +2, kỵ việc −2); Tam nương −2, Nguyệt kỵ −2, Dương công kỵ −3; quan hệ với tuổi theo `congiap.js`. Mức: từ 70% Tốt, 55% Khá, 40% Bình thường, dưới 40% Xấu.

**Chọn ngày theo việc** chỉ lấy ngày hoàng đạo, không phạm ngày kỵ, trực và sao không kỵ việc đó, điểm từ 55%.

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
| `GET` | `/api/ngay?ngay=2026-10-24&namSinh=1990&viec=cuoiHoi` | Chi tiết một ngày. `namSinh` (năm âm lịch), `viec` không bắt buộc |
| `GET` | `/api/thang?nam=2026&thang=10&namSinh=1990` | Cả tháng dương lịch |
| `GET` | `/api/chon-ngay?viec=khaiTruong&tu=2026-11-01&den=2026-12-31&namSinh=1990` | Ngày tốt cho việc, tối đa 190 ngày |
| `GET` | `/api/viec` | Danh sách việc: `cuoiHoi`, `dongTho`, `khaiTruong`, `nhapTrach`, `xuatHanh`, `kyKet` |
| `GET` | `/api/health` | `{ "ok": true }` |

Nội dung do Lá Số Tử Vi tự biên soạn, chỉ để tham khảo.
