# Cung hoàng đạo (zodiac)

Chức năng cung hoàng đạo (chiêm tinh phương Tây) của website Lá Số Tử Vi. Vị trí các hành tinh được tính thật bằng thiên văn học, không dùng bảng tra sẵn.

| # | Chức năng | Trang | Mô tả |
|---|---|---|---|
| 1 | Xác định cung hoàng đạo | `index.html` | Nhập ngày sinh (giờ sinh không bắt buộc) để biết cung Mặt Trời. Ngày giao cung thì báo đúng giờ Mặt Trời đổi cung. |
| 2 | Tổng quan 12 cung | `index.html`, `cung.html` | Biểu tượng, nguyên tố, tính chất, hành tinh chủ quản, bộ phận cơ thể, màu, đá, ngày trong tuần. |
| 3 | Tử vi hằng ngày | `tu-vi.html` | Tình yêu, công việc, tài chính, sức khỏe (1–5 sao), việc nên làm, màu hợp. |
| 4 | Tử vi tuần, tháng, năm | `tu-vi.html` | Ngày nổi bật, trăng non, trăng tròn, hành tinh đổi cung, nghịch hành, Sao Mộc, Sao Thổ, nhật thực, nguyệt thực. |
| 5 | Giải mã tính cách | `cung.html` | Điểm mạnh, điểm yếu, xu hướng giao tiếp, cảm xúc. |
| 6 | Độ tương hợp | `tuong-hop.html` | Điểm tình yêu, tình bạn, công việc giữa hai cung, bảng hợp với cả 12 cung. |
| 7 | Tình yêu và mối quan hệ | `cung.html`, `tuong-hop.html` | Phong cách yêu, điều cần, điều nên lưu ý, cung dễ hợp nhất. |
| 8 | Sự nghiệp và công việc | `cung.html` | Đặc điểm làm việc, kỹ năng, môi trường phù hợp, nghề gợi ý. |
| 9 | Bản đồ sao (birth chart) | `ban-do-sao.html` | Vị trí 10 thiên thể, cung Mọc, thiên đỉnh, 12 nhà, góc chiếu, cân bằng nguyên tố. Vẽ vòng bản đồ sao bằng SVG. |
| 10 | Big Three | `ban-do-sao.html` | Phân tích Mặt Trời, Mặt Trăng, cung Mọc và cách ba yếu tố kết hợp. |

```
zodiac/
├── frontend/                   Trang web tĩnh, chạy được ngay trên GitHub Pages
│   ├── index.html, cung.html, tu-vi.html, tuong-hop.html, ban-do-sao.html
│   ├── css/site.css            Màu, chữ, menu (giống phần tử vi)
│   ├── css/zodiac.css          Giao diện cung hoàng đạo, màu bốn nguyên tố
│   └── js/
│       ├── vendor/astronomy.browser.min.js   Astronomy Engine 2.1.19 (MIT, Don Cross)
│       ├── thien-van.js        Vị trí hành tinh, cung Mọc, đổi giờ theo múi giờ, nghịch hành, giao cung, tuần trăng, thực
│       ├── cung-hoang-dao.js   Nội dung 12 cung, nguyên tố, tính chất, hành tinh, 12 nhà
│       ├── luan-giai.js        Xác định cung, tử vi theo kỳ, tương hợp, bản đồ sao, Big Three
│       ├── dia-diem.js         Nơi sinh (tọa độ, múi giờ) trong và ngoài nước
│       ├── ve-ban-do.js        Vẽ vòng bản đồ sao
│       └── chung.js, trang-*.js  Giao diện từng trang
└── backend/                    Máy chủ Node.js + Express
    ├── server.js               API và phục vụ thư mục frontend
    ├── package.json
    └── test/                   Kiểm tra dữ liệu, thiên văn (đối chiếu Swiss Ephemeris), luận giải, API
```

Backend dùng chung các file trong `frontend/js`, nên API và trang web luôn ra cùng một kết quả.

## Cách tính

- **Vị trí hành tinh:** theo hoàng đạo nhiệt đới, tính trên hoàng đạo thật của ngày (có tuế sai và chương động). Kết quả khớp Swiss Ephemeris với sai số dưới 20 giây cung; cung Mọc và thiên đỉnh sai dưới 1 giây cung.
- **Giờ sinh:** đổi sang UTC theo múi giờ IANA có lịch sử. Các tỉnh từ Quảng Trị trở vào dùng `Asia/Ho_Chi_Minh`, nên giờ sinh ở miền Nam giai đoạn 1960–1975 được tính là UTC+8. Từ Quảng Bình trở ra dùng `Asia/Bangkok` (UTC+7). Nước ngoài có giờ mùa hè.
- **Nhà:** hệ Whole Sign (cung Mọc là nhà 1, mỗi cung tiếp theo là một nhà).
- **Không rõ giờ sinh:** lấy 12 giờ trưa, không tính cung Mọc và các nhà. Nếu hôm đó Mặt Trăng đổi cung thì báo cả hai khả năng.
- **Tử vi theo cung:** dùng các nhà tính từ cung Mặt Trời. Có hai thành phần:
  - Điểm từng ngày (giờ Việt Nam, lúc 12 giờ trưa): dựa vào Mặt Trăng đi qua nhà nào, và góc giữa cung của bạn với Mặt Trăng, Sao Kim, Sao Hỏa, Sao Mộc. Có trừ điểm khi Sao Thủy nghịch hành.
  - Tử vi năm: dựa vào Sao Mộc và Sao Thổ đi qua nhà nào.

  Câu chữ được chọn cố định theo ngày và cung, nên ai xem cũng thấy giống nhau.
- **Tương hợp:** điểm nền được tính theo khoảng cách giữa hai cung trên vòng hoàng đạo: cùng cung, liền kề, lục hợp, vuông, tam hợp, lệch 150° hoặc xung đối. Sau đó cộng trừ theo cặp nguyên tố (với tình yêu), nguyên tố Khí (với tình bạn), nguyên tố Đất và cặp tính chất (với công việc).

## Chạy trên máy

Cần Node.js 18 trở lên (có ICU đầy đủ, bản cài thông thường đều có).

```bash
cd zodiac/backend
npm install
npm start        # mở http://localhost:3002
npm test
```

Đổi cổng bằng `PORT`.

## API

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| `GET` | `/api/cung` | Cả 12 cung với đầy đủ nội dung |
| `GET` | `/api/cung/:id` | Một cung, ví dụ `bach-duong`, `bo-cap` |
| `GET` | `/api/tong-quan` | Nguyên tố, tính chất, hành tinh, 12 nhà |
| `GET` | `/api/xac-dinh?ngay=1990-04-10&gio=10:30&tz=Asia/Bangkok` | Cung Mặt Trời. `gio`, `tz` không bắt buộc (mặc định giờ Việt Nam). Ngày giao cung trả thêm `giaoCung` |
| `GET` | `/api/tu-vi/:cung?ky=ngay\|tuan\|thang\|nam&ngay=2026-10-24` | Tử vi theo kỳ. Mặc định là hôm nay theo giờ Việt Nam |
| `GET` | `/api/tuong-hop?a=bach-duong&b=thien-binh` | Điểm tình yêu, tình bạn, công việc và nhận xét |
| `POST` | `/api/ban-do-sao` | Gửi `{ "ngay": "1990-04-10", "gio": "10:30", "tz": "Asia/Bangkok", "viDo": 21.03, "kinhDo": 105.85 }`. Bỏ `gio` khi không rõ giờ sinh. Trả về vị trí các thiên thể, cung Mọc, góc chiếu, cân bằng nguyên tố, Big Three |
| `GET` | `/api/dia-diem` | Danh sách nơi sinh và múi giờ |
| `GET` | `/api/health` | `{ "ok": true }` |

Dữ liệu sai trả mã 400 kèm `{ "error": "..." }` bằng tiếng Việt. Các API cho phép gọi từ trang khác (CORS).

Nội dung các cung do Lá Số Tử Vi tự biên soạn theo chiêm tinh phương Tây truyền thống, chỉ để tham khảo.
