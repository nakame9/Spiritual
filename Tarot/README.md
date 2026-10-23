# Tarot

Chức năng xem bài Tarot của website Lá Số Tử Vi: đặt câu hỏi, chọn chủ đề (Tổng quan, Tình yêu, Sự nghiệp, Tài chính, Bản thân) và kiểu trải bài, tự chọn lá từ bộ 78 lá đã xáo, lật bài và đọc ý nghĩa xuôi/ngược theo chủ đề và vị trí.

```
Tarot/
├── frontend/               Trang web tĩnh, chạy được ngay trên GitHub Pages
│   ├── index.html          Trang xem bài
│   ├── css/site.css        Màu, chữ, menu (giống phần tử vi)
│   ├── css/tarot.css       Giao diện lá bài, bộ bài, kết quả
│   └── js/
│       ├── bo-bai.js       78 lá, ý nghĩa chung, chủ đề, kiểu trải bài, xáo bài, đọc bài
│       ├── y-nghia-chu-de.js  Ý nghĩa từng lá theo Tình yêu, Sự nghiệp, Tài chính, Bản thân (xuôi/ngược)
│       └── app.js          Vẽ lá bài bằng SVG và các bước trên trang
└── backend/                Máy chủ Node.js + Express
    ├── server.js           API và phục vụ thư mục frontend
    ├── package.json
    └── test/               Kiểm tra bộ bài và API
```

Frontend tự xáo bài trên trình duyệt (dùng `crypto.getRandomValues`, mọi lá có xác suất như nhau), nên trang trên GitHub Pages chạy không cần máy chủ.
Backend dùng chung `frontend/js/bo-bai.js`, nên API ra cùng nội dung với trang web.

Ý nghĩa 78 lá (ý nghĩa chung và 624 đoạn theo 4 chủ đề) do Lá Số Tử Vi tự biên soạn; hình lá bài được vẽ bằng code, không dùng ảnh có bản quyền.

## Chạy trên máy

Cần Node.js 18 trở lên.

```bash
cd Tarot/backend
npm install
npm start        # mở http://localhost:3001
npm test
```

Đổi cổng bằng `PORT`. Menu trên trang trỏ sang các trang tử vi trong `../tuvivietnam`, nên các link đó chỉ mở được khi xem trên GitHub Pages (cùng kho), không mở được khi chạy riêng backend Tarot.

## API

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| `POST` | `/api/rut-bai` | Xáo bộ bài và rút theo kiểu trải. Gửi `{ "kieu": "1la" \| "3la" \| "tinhcam", "chuDe": "tongquan" \| "tinhyeu" \| "sunghiep" \| "taichinh" \| "banthan", "nguoc": true, "cauHoi": "..." }` (đều không bắt buộc; mặc định `3la`, `tongquan`, có lá ngược). Trả về `{ cauHoi, kieu, tenKieu, chuDe, tenChuDe, la: [...], tongQuan: [...] }`; mỗi lá có `y` (ý nghĩa theo chủ đề) và `yChung` (ý nghĩa chung, khi chủ đề khác Tổng quan) |
| `GET` | `/api/bo-bai` | Cả 78 lá với ý nghĩa xuôi và ngược |
| `GET` | `/api/la-bai/:id` | Một lá, `id` từ 0 đến 77 (0–21 Ẩn Chính; 22–35 Gậy, 36–49 Cốc, 50–63 Kiếm, 64–77 Tiền, mỗi bộ từ Át đến Vua) |
| `GET` | `/api/kieu-trai` | Các kiểu trải bài và ý nghĩa từng vị trí |
| `GET` | `/api/chu-de` | Các chủ đề |
| `GET` | `/api/health` | `{ "ok": true }` khi máy chủ đang chạy |

Ví dụ:

```bash
curl -X POST http://localhost:3001/api/rut-bai \
  -H "Content-Type: application/json" \
  -d '{"kieu":"tinhcam","chuDe":"tinhyeu","cauHoi":"Mối quan hệ này sẽ ra sao?"}'
```

Dữ liệu sai trả mã 400 kèm `{ "error": "..." }` bằng tiếng Việt. Các API cho phép gọi từ trang khác (CORS).
