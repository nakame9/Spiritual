# Số chủ đạo (numerology)

Chức năng thần số học của website Lá Số Tử Vi. Cách tính theo Pythagoras, kiểu đang phổ biến ở Việt Nam. Chỉ tính trên máy người xem; họ tên và ngày sinh không lưu, không gửi đi.

| Chỉ số | Cách tính |
|---|---|
| Số chủ đạo | Cộng mọi chữ số của ngày sinh dương lịch. Giữ nguyên 10, 11, 22 (22/4); tổng lớn hơn 11 thì cộng tiếp tới khi còn từ 2 đến 11. Kết quả là 2–11 hoặc 22/4 |
| Chỉ số ngày sinh | Ngày sinh rút gọn về 1–9, giữ 11 và 22 |
| Chỉ số thái độ | Ngày + tháng sinh, rút gọn như trên |
| Sứ mệnh, linh hồn, nhân cách | Theo họ tên: bỏ dấu, Đ = D, bảng chữ A J S = 1 … I R = 9. Sứ mệnh dùng mọi chữ cái, linh hồn dùng nguyên âm (Y luôn là nguyên âm trong tên tiếng Việt), nhân cách dùng phụ âm |
| Biểu đồ ngày sinh | Lưới 3 × 3 (3 6 9 / 2 5 8 / 1 4 7) với số lần mỗi chữ số xuất hiện. 8 mũi tên sức mạnh khi đủ ba ô, mũi tên trống khi thiếu cả ba |
| Năm, tháng, ngày cá nhân | Năm = ngày sinh + tháng sinh + năm đang xét. Tháng = năm cá nhân + tháng. Ngày = tháng cá nhân + ngày. Tất cả rút gọn 1–9, kèm chu kỳ 9 năm |

```
numerology/
├── frontend/              Trang web tĩnh, chạy được ngay trên GitHub Pages
│   ├── index.html         Tính số chủ đạo, các chỉ số, biểu đồ ngày sinh, năm cá nhân, ý nghĩa các số
│   ├── css/site.css       Màu, chữ, menu (giống phần tử vi)
│   ├── css/so-hoc.css     Giao diện trang số chủ đạo
│   └── js/so-hoc.js       Cách tính và nội dung (dùng chung với backend và trang chủ tử vi)
│       js/trang-so-hoc.js Giao diện
└── backend/               Máy chủ Node.js + Express (cổng 3003)
```

Mở trang với `index.html#ngay=1990-08-15` thì ngày sinh được điền sẵn và tính luôn (trang chủ dùng cách này).

## Chạy trên máy

```bash
cd numerology/backend
npm install
npm start        # mở http://localhost:3003
npm test
```

## API

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| `GET` | `/api/so-chu-dao?ngaySinh=1990-08-15&ten=Lê Thị Thu&homNay=2026-10-24` | Mọi chỉ số. `ten`, `homNay` không bắt buộc (mặc định hôm nay theo giờ Việt Nam) |
| `GET` | `/api/y-nghia/:so` | Ý nghĩa một số chủ đạo (2–11 hoặc 22) |
| `GET` | `/api/chu-ky` | Chủ đề và điểm của năm cá nhân 1–9 |
| `GET` | `/api/health` | `{ "ok": true }` |

Nội dung do Lá Số Tử Vi tự biên soạn, chỉ để tham khảo.
