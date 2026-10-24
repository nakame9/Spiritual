# Tử Vi Việt Nam

Website lập lá số tử vi theo phái Việt, có luận giải từng cung, tử vi 12 con giáp, bài viết, và trang quản trị.

```
tuvivietnam/
├── frontend/            Trang web tĩnh, chạy được ngay trên GitHub Pages
│   ├── index.html       Trang chủ: kết hợp tử vi, cung hoàng đạo, số chủ đạo để dự đoán may mắn, tình cảm, sự nghiệp; công cụ, bài viết mới
│   ├── la-so.html       Lập lá số 12 cung + luận giải
│   ├── con-giap.html    Tử vi 12 con giáp theo ngày, tuần, tháng, năm
│   ├── bai-viet.html    Bài viết
│   ├── admin/index.html Trang quản trị (chỉ chạy khi mở qua backend)
│   └── js/
│       ├── tuvi.js      Engine: lịch âm (Hồ Ngọc Đức) và an sao
│       ├── luangiai.js  Luận giải theo cung (sửa được từ trang quản trị)
│       ├── congiap.js   Tử vi 12 con giáp
│       ├── tong-hop.js  Dự đoán kết hợp ba hệ cho trang chủ (dùng thêm ../../zodiac và ../../numerology)
│       ├── trang-chu.js Giao diện trang chủ
│       ├── markdown.js  Hiển thị bài viết viết bằng Markdown rút gọn
│       └── api.js       Địa chỉ backend (TUVI_API) cho web công khai
└── backend/             Máy chủ Node.js + Express
    ├── server.js        API công khai và phục vụ thư mục frontend
    ├── quan-tri.js      API quản trị: đăng nhập, bài viết, luận giải, người dùng
    ├── lib/kho.js       Lưu dữ liệu vào file JSON trong DATA_DIR
    ├── lib/xacthuc.js   Mật khẩu (scrypt), phiên đăng nhập, chặn đoán mật khẩu
    ├── data-mau/        Bài viết mẫu nạp vào lần chạy đầu
    ├── package.json
    └── test/            Kiểm tra engine, API và trang quản trị
```

Frontend tự tính lá số ngay trên trình duyệt, nên trang trên GitHub Pages chạy không cần máy chủ.
Backend dùng chung `frontend/js/tuvi.js` và `frontend/js/luangiai.js`, nên API luôn ra cùng kết quả với trang web.

## Chạy trên máy

Cần Node.js 18 trở lên.

```bash
cd tuvivietnam/backend
npm install
npm start        # mở http://localhost:3000
npm test         # chạy kiểm tra
```

Biến môi trường:

| Biến | Ý nghĩa |
|---|---|
| `PORT` | Cổng chạy, mặc định 3000 |
| `DATA_DIR` | Thư mục lưu dữ liệu (bài viết, tài khoản, luận giải đã sửa). Mặc định `backend/data` |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Tạo quản trị viên đầu tiên khi chưa có tài khoản nào. Mật khẩu ít nhất 8 ký tự |

## Trang quản trị

1. Chạy lần đầu kèm tài khoản quản trị:
   ```bash
   ADMIN_USER=quantri ADMIN_PASSWORD='mat-khau-cua-ban' npm start
   ```
   (Windows PowerShell: `$env:ADMIN_USER="quantri"; $env:ADMIN_PASSWORD="mat-khau-cua-ban"; npm start`)
2. Mở http://localhost:3000/admin/ và đăng nhập. Sau lần đầu không cần hai biến này nữa; nên đổi mật khẩu trong mục Tài khoản.
3. Các mục:
   - **Bài viết**: viết, sửa, xóa; để nháp hoặc xuất bản. Bài xuất bản hiện ở trang Bài viết và mục Bài viết mới trên trang chủ.
   - **Luận giải**: sửa 154 đoạn chữ (ý nghĩa 12 cung, 14 chính tinh theo từng lĩnh vực, phụ tinh); khôi phục mặc định từng đoạn.
   - **Người dùng** (chỉ quản trị viên): thêm biên tập viên hoặc quản trị viên, đổi vai trò, khóa, đặt lại mật khẩu, xóa.
   - **Tài khoản**: đổi mật khẩu của mình.

Bảo mật: mật khẩu băm bằng scrypt; cookie đăng nhập HttpOnly, SameSite=Lax, hết hạn sau 8 giờ; sai mật khẩu 5 lần thì tạm khóa 15 phút theo IP; không ai tự khóa hay tự xóa được mình, và luôn còn ít nhất một quản trị viên. Nội dung nhập từ trang quản trị được escape trước khi hiện trên web.

Dữ liệu nằm trong `DATA_DIR/du-lieu.json` (có mật khẩu đã băm, đừng đưa lên GitHub; thư mục `backend/data` đã được bỏ qua trong `.gitignore`). Sao lưu file này định kỳ.

## Đưa lên mạng

Trang quản trị cần backend chạy trên một máy chủ (Render, Railway, VPS…). Lưu ý:

- Chọn gói có **ổ đĩa bền vững** và đặt `DATA_DIR` vào đó. Ổ đĩa mặc định của các gói miễn phí bị xóa mỗi lần khởi động lại, mất hết bài viết và tài khoản.
- Đặt `ADMIN_USER`, `ADMIN_PASSWORD` cho lần chạy đầu, đăng nhập, đổi mật khẩu, rồi xóa hai biến đó.
- Phiên đăng nhập lưu trong bộ nhớ: khởi động lại máy chủ thì phải đăng nhập lại. Chỉ chạy **một** tiến trình máy chủ.
- Khi web công khai vẫn đặt ở GitHub Pages, sửa `frontend/js/api.js`: điền địa chỉ backend vào `TUVI_API` để trang Bài viết, trang chủ và luận giải lấy nội dung từ trang quản trị. Để trống thì GitHub Pages dùng nội dung có sẵn trong file HTML.

## API

### `POST /api/la-so`

Gửi JSON:

| Trường | Bắt buộc | Giá trị |
|---|---|---|
| `ngay`, `thang`, `nam` | có | Ngày sinh; năm từ 1900 đến 2100 |
| `gio` | có | Giờ sinh theo chi: 1 = Tý, 2 = Sửu, … 12 = Hợi |
| `gioiTinh` | có | `"nam"` hoặc `"nu"` |
| `amLich` | không | `true` nếu ngày nhập là âm lịch (mặc định dương lịch) |
| `nhuan` | không | `true` nếu sinh vào tháng nhuận âm lịch |
| `ten` | không | Họ tên, tối đa 100 ký tự |

Ví dụ:

```bash
curl -X POST http://localhost:3000/api/la-so \
  -H "Content-Type: application/json" \
  -d '{"ngay":30,"thang":8,"nam":2008,"gio":4,"gioiTinh":"nam"}'
```

Trả về `{ laSo, luanGiai }`:

- `laSo`: ngày âm dương, can chi, bản mệnh, cục, Mệnh chủ, Thân chủ và 12 cung (`cung[i].sao` là danh sách sao kèm độ sáng, Tứ Hóa; `daiHan`, `tieuHan`, `tuan`, `triet`).
- `luanGiai`: 12 phần tử theo thứ tự Mệnh, Tài Bạch, Quan Lộc, Phu Thê…, mỗi phần tử có `cung`, `chi` và `html` là đoạn luận giải.

Dữ liệu sai trả mã 400 kèm `{ "error": "..." }` bằng tiếng Việt.

### `GET /api/con-giap`

Tử vi theo tuổi. Tham số: `tuoi` (1 = Tý … 12 = Hợi, bắt buộc), `ky` (`ngay`, `tuan`, `thang`, `nam`; mặc định `ngay`), `ngay` (dạng `YYYY-MM-DD`, mặc định hôm nay), và tùy chọn `namSinh`, `gioiTinh` (`nam`/`nu`) để xem sao chiếu mệnh khi `ky=nam`.

```bash
curl "http://localhost:3000/api/con-giap?tuoi=7&ky=nam&namSinh=1990&gioiTinh=nam"
```

Trả về tiêu đề, mức độ (`diem` 1–5, `nhan`), các ghi chú quan hệ can chi (`dong`), 4 mục Công việc, Tài lộc, Tình cảm, Sức khỏe (`muc`), lời khuyên, màu và số may mắn; theo ngày có thêm `gioTot`, theo tuần có `tuan` (7 ngày), theo năm có `sao`.

### `POST /api/tong-hop`

Dự đoán kết hợp ba hệ của trang chủ. Gửi cùng các trường như `/api/la-so`, thêm `homNay` (`YYYY-MM-DD`, không bắt buộc, mặc định hôm nay theo giờ Việt Nam).

Trả về:

- `hoSo`: tuổi can chi, bản mệnh, cung Mệnh (tử vi); cung hoàng đạo; số chủ đạo và năm cá nhân.
- `ky.ngay`, `ky.thang`, `ky.nam`: mỗi mốc có `linhVuc` gồm May mắn, Tình cảm, Sự nghiệp. Mỗi mặt có:
  - `phanTram`: điểm chung 0–100% (50% là trung bình), quy từ `diem` 1–5 là trung bình ba hệ;
  - `tongHop`: câu nói rõ hệ nào thuận, hệ nào nghịch, kèm lời khuyên;
  - `nguon`: điểm (`diem`, `phanTram`) và lời giải của từng hệ.
- `mayMan`: màu và số may mắn.

Điểm từng hệ:

- **Tử vi:** 40% nền lá số và 60% vận của tuổi theo ngày, tháng âm lịch, năm âm lịch. Nền lá số chấm từ độ sáng chính tinh, cát tinh, hung tinh, Tuần, Triệt ở các cung Tài Bạch và Phúc Đức (cho may mắn), Phu Thê (cho tình cảm), Quan Lộc (cho sự nghiệp).
- **Cung hoàng đạo:** tử vi theo cung Mặt Trời, tính từ vị trí thật của các hành tinh.
- **Số chủ đạo:** ngày, tháng, năm cá nhân, cộng thiên hướng của số chủ đạo.

Máy chủ này cũng phục vụ `/zodiac/frontend`, `/numerology/frontend`, `/Tarot/frontend` từ các thư mục bên cạnh, để trang chủ và menu chạy đủ khi chạy riêng máy chủ tử vi.

### Nội dung từ trang quản trị

- `GET /api/bai-viet`: danh sách bài đã xuất bản (mới nhất trước), không kèm nội dung.
- `GET /api/bai-viet/:slug`: một bài, có `html` đã chuyển từ Markdown.
- `GET /api/luan-giai/ghi-de`: các đoạn luận giải đã sửa, dạng `{ "cung.Mệnh": "...", "chinh.1.tinh": "..." }`.

Các API công khai cho phép gọi từ trang khác (CORS). API quản trị nằm dưới `/api/admin` và cần đăng nhập.

### `GET /api/health`

Trả `{ "ok": true }` khi máy chủ đang chạy.

## GitHub Pages

GitHub Pages của kho đang phục vụ từ thư mục gốc. Các file `index.html`, `la-so.html`, `bai-viet.html` ở gốc kho chỉ chuyển hướng vào `tuvivietnam/frontend/`, để link cũ vẫn mở được.
