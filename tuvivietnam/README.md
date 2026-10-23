# Tử Vi Việt Nam

Website lập lá số tử vi theo phái Việt, có luận giải từng cung và bài viết nhập môn.

```
tuvivietnam/
├── frontend/            Trang web tĩnh, chạy được ngay trên GitHub Pages
│   ├── index.html       Trang chủ: giới thiệu, xem tử vi nhanh, công cụ, bài viết mới
│   ├── la-so.html       Lập lá số 12 cung + luận giải
│   ├── bai-viet.html    Bài viết
│   ├── css/site.css     Màu, chữ, menu dùng chung
│   └── js/
│       ├── tuvi.js      Engine: lịch âm (Hồ Ngọc Đức) và an sao
│       └── luangiai.js  Luận giải theo cung
└── backend/             Máy chủ Node.js + Express
    ├── server.js        API và phục vụ thư mục frontend
    ├── package.json
    └── test/            Kiểm tra engine và API
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

Đổi cổng bằng biến môi trường `PORT`, ví dụ `PORT=8080 npm start`.

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

### `GET /api/health`

Trả `{ "ok": true }` khi máy chủ đang chạy.

## GitHub Pages

GitHub Pages của kho đang phục vụ từ thư mục gốc. Các file `index.html`, `la-so.html`, `bai-viet.html` ở gốc kho chỉ chuyển hướng vào `tuvivietnam/frontend/`, để link cũ vẫn mở được.
