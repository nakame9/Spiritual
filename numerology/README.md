# Số chủ đạo (numerology)

Chức năng thần số học của website Lá Số Tử Vi. Cách tính theo Pythagoras, kiểu đang phổ biến ở Việt Nam. Chỉ tính trên máy người xem; họ tên và ngày sinh không lưu, không gửi đi.

| Chỉ số | Cách tính |
|---|---|
| Số chủ đạo | Cộng mọi chữ số của ngày sinh dương lịch. Giữ nguyên 10, 11, 22 (22/4); tổng lớn hơn 11 thì cộng tiếp tới khi còn từ 2 đến 11. Kết quả là 2–11 hoặc 22/4. Trang hiển thị từng bước cộng và rút gọn |
| Chỉ số ngày sinh | Ngày sinh rút gọn về 1–9, giữ 11 và 22 |
| Chỉ số thái độ | Ngày + tháng sinh, rút gọn như trên |
| Sứ mệnh, linh hồn, nhân cách | Theo họ tên: bỏ dấu, Đ = D, bảng chữ A J S = 1 … I R = 9. Sứ mệnh dùng mọi chữ cái, linh hồn dùng nguyên âm (Y luôn là nguyên âm trong tên tiếng Việt), nhân cách dùng phụ âm |
| Biểu đồ ngày sinh | Lưới 3 × 3 (3 6 9 / 2 5 8 / 1 4 7) với số lần mỗi chữ số xuất hiện. 8 mũi tên sức mạnh khi đủ ba ô, mũi tên trống khi thiếu cả ba |
| Năm, tháng, ngày cá nhân | Năm = ngày sinh + tháng sinh + năm đang xét. Tháng = năm cá nhân + tháng. Ngày = tháng cá nhân + ngày. Tất cả rút gọn 1–9, kèm chu kỳ 9 năm. Hai cách tính: `duongLich` (mặc định, đổi số vào 1/1) và `sinhNhat` (đổi số vào ngày sinh nhật) |
| Bốn đỉnh cao | Ngày, tháng, năm sinh rút về 1–9. Đỉnh 1 = tháng + ngày, đỉnh 2 = ngày + năm, đỉnh 3 = đỉnh 1 + đỉnh 2, đỉnh 4 = tháng + năm (giữ 11, 22). Mốc tuổi đỉnh 1 = 36 − số chủ đạo (10, 11, 22/4 tính là 1, 2, 4), các đỉnh sau cách 9 năm |
| So sánh hai số | Xét vị trí hai số trên lưới 3 × 3 (10, 11, 22/4 theo gốc 1, 2, 4). Cùng số: Đồng điệu 75%. Cùng hàng (mặt phẳng Trí não 3-6-9, Cảm xúc 2-5-8, Thể chất 1-4-7): Hợp tự nhiên 85%. Cùng một mũi tên dọc hoặc chéo: Bổ trợ 70%. Còn lại: Cần dung hòa 55% |

Mỗi số chủ đạo có: tổng quan, điểm mạnh, điểm cần cải thiện, phong cách yêu, giao tiếp, cảm xúc, phong cách làm việc, môi trường và nghề phù hợp, bài học phát triển bản thân, 3 câu hỏi tự suy ngẫm, lời khuyên.

```
numerology/
├── frontend/              Trang web tĩnh, chạy được ngay trên GitHub Pages
│   ├── index.html         Tính số chủ đạo và mọi chỉ số, biểu đồ ngày sinh, năm cá nhân, bốn đỉnh cao, ý nghĩa các số
│   ├── tuong-hop.html     So sánh hai số chủ đạo (mở với #a=6&b=9)
│   ├── css/so-hoc.css     Giao diện trang số chủ đạo
│   └── js/so-hoc.js       Cách tính và nội dung (dùng chung với backend và trang chủ tử vi)
│       js/trang-so-hoc.js     Giao diện trang chính
│       js/trang-tuong-hop.js  Giao diện trang so sánh
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
| `GET` | `/api/so-chu-dao?ngaySinh=1990-08-15&ten=Lê Thị Thu&homNay=2026-10-24&truongPhai=sinhNhat` | Mọi chỉ số, gồm `soChuDao.buoc` (từng bước) và `dinhCao`. `ten`, `homNay`, `truongPhai` không bắt buộc (mặc định hôm nay theo giờ Việt Nam, `duongLich`) |
| `GET` | `/api/tuong-hop?a=6&b=9` | So sánh hai số chủ đạo (2–11 hoặc 22) |
| `GET` | `/api/y-nghia/:so` | Ý nghĩa một số chủ đạo (2–11 hoặc 22) |
| `GET` | `/api/chu-ky` | Chủ đề và điểm của năm cá nhân 1–9 |
| `GET` | `/api/health` | `{ "ok": true }` |

Nội dung do Lá Số Tử Vi tự biên soạn, chỉ để tham khảo.
