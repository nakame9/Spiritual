# Tử Vi Việt Nam

Website lập lá số tử vi theo phái Việt, có luận giải từng cung, tử vi 12 con giáp, bài viết, và trang quản trị.

```
tuvivietnam/
├── frontend/            Trang web tĩnh, chạy được ngay trên GitHub Pages
│   ├── index.html       Trang chủ: nhập ngày giờ sinh, nơi sinh, múi giờ; hồ sơ ba hệ và tổng quan vận trình 6 mục × 4 mốc; nút mở lá số, bản đồ sao, số chủ đạo; công cụ, bài viết mới
│   ├── la-so.html       Lập lá số 12 cung; luận giải 6 phần từng cung; đại hạn, tiểu hạn, lưu niên, lưu nguyệt, lưu nhật theo năm chọn; báo cáo in PDF; hồ sơ đã lưu
│   ├── con-giap.html    12 con giáp: trang riêng từng tuổi (#ty … #hoi) với năm sinh, can, nạp âm, tính cách, khía cạnh cuộc sống,
│   │                    tử vi ngày, tuần, tháng, năm; công cụ tra tuổi hợp, tuổi xung theo 5 mục đích
│   ├── bai-viet.html    Thư viện bài viết: tìm, lọc chuyên mục, mới nhất, phổ biến, yêu thích
│   ├── bai-viet/        Mỗi bài một trang tĩnh, sinh bởi scripts/bai-viet.js (đừng sửa tay)
│   ├── bai-viet-doc.html  Trang đọc bài đăng từ trang quản trị (cần backend)
│   ├── tra-cuu/         Ngũ hành và bản mệnh, xem tuổi hai người, phong thủy cá nhân, giải mộng, trợ lý AI
│   ├── admin/index.html Trang quản trị (chỉ chạy khi mở qua backend)
│   └── js/
│       ├── tuvi.js      Engine: lịch âm (Hồ Ngọc Đức) và an sao
│       ├── luangiai.js  Luận giải theo cung (tổng quan, phân tích sao, tam phương tứ chính, hỗ trợ và bất lợi, theo giai đoạn, lời khuyên),
│       │                vận hạn theo năm và báo cáo lá số; chi tiết: chính tinh và độ sáng, cách đồng cung, ngũ hành sao với cung, Tứ Hóa theo lĩnh vực,
│       │                phụ tinh, Tuần Triệt, vòng Tràng Sinh, sao chiếu từ tam phương, đánh giá chung kèm điểm cộng/trừ và lời khuyên
│       │                (ý nghĩa cung, chính tinh, phụ tinh sửa được từ trang quản trị)
│       ├── con-giap-ho-so.js  Hồ sơ 12 con giáp, nét riêng theo năm sinh, tra tuổi hợp theo mục đích
│       ├── congiap.js   Tử vi 12 con giáp
│       ├── tong-hop.js  Tổng quan vận trình kết hợp ba hệ cho trang chủ (dùng thêm ../../zodiac và ../../numerology)
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

### `GET /api/con-giap/ho-so?tuoi=1..12`

Hồ sơ một con giáp (1 = Tý … 12 = Hợi): các năm sinh 1900–2100 với can chi, nạp âm, mệnh; tính cách và các khía cạnh cuộc sống; tam hợp, lục hợp, tứ hành xung.

### `GET /api/tuoi-hop?a=1990&b=1992`

Tra tuổi hợp giữa năm sinh âm lịch `a` (mình) và `b` (người cần xem): quan hệ địa chi, thiên can, ngũ hành nạp âm, và đánh giá riêng cho kết hôn, làm ăn, sinh con (`b` là năm sinh của con), kết giao, chọn đối tác.

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
| `namXem` | không | Năm xem hạn (1900–2200), mặc định năm nay. Kết quả có thêm `vanHan`: đại hạn, tiểu hạn, sao lưu niên, phân tích công việc, tài chính, tình cảm, gia đình của năm, lưu nguyệt 12 tháng |

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
- `POST /api/tro-ly` `{ cauHoi, hoSo: { d, m, y, gio, gioiTinh, ten } }`: trợ lý huyền học. Trả `{ traLoi, nguon: 'ai' | 'mau', loai, duLieu, thieu }`. Giới hạn 20 câu hỏi mỗi 10 phút cho một IP (`TRO_LY_GIOI_HAN`).
- `POST /api/bai-viet/:slug/xem`: ghi một lượt đọc (bài trong thư viện hoặc bài đã xuất bản). `GET /api/bai-viet/luot-xem`: `{ slug: số lượt }`, dùng cho mục Phổ biến.
- `GET /api/luan-giai/ghi-de`: các đoạn luận giải đã sửa, dạng `{ "cung.Mệnh": "...", "chinh.1.tinh": "..." }`.

Các API công khai cho phép gọi từ trang khác (CORS). API quản trị nằm dưới `/api/admin` và cần đăng nhập.

### `GET /api/health`

Trả `{ "ok": true }` khi máy chủ đang chạy.

## GitHub Pages

GitHub Pages của kho đang phục vụ từ thư mục gốc. Các file `index.html`, `la-so.html`, `bai-viet.html` ở gốc kho chỉ chuyển hướng vào `tuvivietnam/frontend/`, để link cũ vẫn mở được.

## Thư viện bài viết

Nội dung nằm ở `frontend/js/thu-vien-du-lieu.js`: 8 chuyên mục (Tử vi, 12 con giáp, Phong thủy, Chiêm tinh, Thần số học, Tarot, Lịch vạn niên, Kiến thức) và các bài. Mỗi bài có tiêu đề, mô tả ngắn, ảnh đại diện (SVG vẽ theo chuyên mục), mục lục, nội dung, ví dụ minh họa, câu hỏi thường gặp, bài liên quan, nguồn tham khảo, ngày đăng và ngày cập nhật.

Thêm hoặc sửa bài: sửa file dữ liệu rồi chạy `npm run bai-viet` ở gốc kho. Lệnh này sinh `frontend/bai-viet/<slug>.html` (có thẻ canonical, Open Graph và dữ liệu có cấu trúc Article, FAQPage, BreadcrumbList cho máy tìm kiếm), cập nhật danh sách trong `bai-viet.html`, mục "Bài viết mới" ở trang chủ và `sitemap.xml`. `npm test` báo lỗi nếu quên chạy.

- **Tìm kiếm**: không phân biệt dấu, mọi từ đều phải có; xếp theo độ khớp (tiêu đề, từ khóa, mô tả, nội dung).
- **Bài liên quan**: từ khóa chung, cùng chuyên mục và độ giống nội dung (cosine trên tần suất từ).
- **Phổ biến**: theo lượt đọc backend ghi nhận; không có backend (GitHub Pages) thì theo thứ tự biên tập (`noiBat`).
- **Yêu thích**: lưu trong trình duyệt (localStorage), không gửi đi.
- Link cũ `bai-viet.html#tu-vi-la-gi`, `#doc-la-so`, `#dai-han-tieu-han` tự chuyển sang trang riêng của bài.

## Tra cứu (`frontend/tra-cuu/`)

| Trang | Nội dung | Dữ liệu cần |
|---|---|---|
| `ngu-hanh.html` | Can chi năm sinh, ngũ hành nạp âm, tương sinh, tương khắc, màu, phương hướng theo trường phái chọn (ngũ hành phương vị hoặc Bát trạch), quan hệ hai bản mệnh. Bảng "đừng đánh đồng" đặt cạnh nhau năm loại hành: nạp âm, can năm, chi năm, nhật chủ (Bát tự), cung phi | Ngày sinh; giới tính nếu xem cung phi |
| `hop-tuoi.html` | Báo cáo tương hợp hai người: tuổi, can chi, nạp âm, cung phi; địa chi, thiên can, nạp âm, du niên cung phi; đánh giá theo mục đích (dùng `ConGiapHoSo.hopTuoi`); Kim lâu nếu nhập năm cưới. In được, có đường dẫn báo cáo | Ngày sinh, giới tính hai người |
| `phong-thuy.html` | Bát trạch: cung phi, la bàn 8 hướng, hướng nhà (so cả cách xét hướng cửa và cách xét tọa), hướng bàn làm việc, bố trí phòng, màu theo nạp âm và theo cung phi. Ghi rõ dữ liệu đầu vào và những gì Bát trạch không xét | Ngày sinh và giới tính (bắt buộc); hướng nhà hoặc số độ la bàn (không bắt buộc) |
| `giai-mong.html` | 26 biểu tượng: diễn giải phổ biến, ý nghĩa biểu tượng, góc nhìn tâm lý, câu hỏi tự chiêm nghiệm. Không đưa con số, không khẳng định điềm báo | Mô tả hoặc từ khóa |
| `tro-ly.html` | Trợ lý AI: `js/tro-ly.js` phân loại câu hỏi, tính dữ liệu bằng các module có sẵn, rồi AI chỉ diễn giải | Hồ sơ ngày giờ sinh |

Cách tính trong `js/ban-menh.js`:

- **Năm can chi**: đổi năm vào Tết (mặc định) hoặc Lập xuân (khi kinh độ Mặt Trời đạt 315°). Sinh đúng ngày Lập xuân thì báo cần giờ sinh.
- **Cung phi**: nam `(11 − năm mod 9) mod 9`, nữ `(năm mod 9 + 4) mod 9`, 0 thành 9; số 5 nam đổi Khôn, nữ đổi Cấn. 1 Khảm, 2 Khôn, 3 Chấn, 4 Tốn, 6 Càn, 7 Đoài, 8 Cấn, 9 Ly.
- **Du niên**: bảng Bát trạch Minh cảnh (Sinh Khí, Thiên Y, Diên Niên, Phục Vị tốt; Họa Hại, Ngũ Quỷ, Lục Sát, Tuyệt Mệnh xấu). Test kiểm tra bảng đối xứng và Đông, Tây tứ mệnh.
- **Kim lâu**: tuổi mụ năm cưới chia 9 dư 1, 3, 6, 8.

### Bật trợ lý AI

Đặt biến môi trường cho backend:

```bash
ANTHROPIC_API_KEY=...            # bắt buộc để bật AI
ANTHROPIC_MODEL=claude-sonnet-5-5 # tùy chọn
```

Không có khóa (hoặc AI lỗi, hoặc trang chạy trên GitHub Pages không có backend) thì trợ lý trả lời theo mẫu ghép từ cùng dữ liệu đã tính. Câu hỏi thiếu dữ liệu (ví dụ hỏi cung Quan Lộc mà chưa có giờ sinh) không được gửi cho AI. Lời nhắc hệ thống cấm AI tự tính hay thêm sao, cung, con số không có trong dữ liệu; người dùng luôn xem được dữ liệu AI đã nhận.
