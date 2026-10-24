# Tarot

Chức năng xem bài Tarot của website Lá Số Tử Vi: chọn chủ đề (Tổng quan, Tình yêu, Sự nghiệp, Tài chính, Bản thân) và kiểu trải bài, tự chọn lá từ bộ 78 lá đã xáo, lật bài và đọc ý nghĩa xuôi/ngược theo chủ đề và vị trí.

```
Tarot/
├── frontend/               Trang web tĩnh, chạy được ngay trên GitHub Pages
│   ├── index.html          Trang chủ Tarot: giới thiệu, cách xem, các kiểu trải bài, chủ đề, bộ 78 lá
│   ├── xem-bai.html        Trang xem bài: chủ đề, kiểu trải → xáo bài (có hiệu ứng) → rút lá → lật lá → đọc ý nghĩa
│   ├── thu-vien.html       Thư viện: tra cứu 78 lá, tìm không dấu, lọc theo nhóm, xem chi tiết từng lá
│   ├── css/tarot.css       Giao diện lá bài, bộ bài, kết quả
│   └── js/
│       ├── bo-bai.js       78 lá, ý nghĩa chung, chủ đề, kiểu trải bài, xáo bài, đọc bài, luận giải, tìm lá
│       ├── y-nghia-chu-de.js  Ý nghĩa từng lá theo Tình yêu, Sự nghiệp, Tài chính, Bản thân (xuôi/ngược)
│       ├── la-bai.js       Vẽ lá bài bằng SVG (dùng chung hai trang)
│       ├── app.js          Các bước trên trang xem bài, hiệu ứng xáo và chia bài
│       └── thu-vien.js     Trang thư viện
└── backend/                Máy chủ Node.js + Express
    ├── server.js           API và phục vụ thư mục frontend
    ├── package.json
    └── test/               Kiểm tra bộ bài và API
```

Có 5 kiểu trải: 1 lá, 3 lá (Quá khứ, Hiện tại, Tương lai), 3 lá Tình cảm, 5 lá chữ thập và 10 lá Thập tự Celtic (lá 2 nằm ngang đè lên lá 1). Kiểu trải 5 và 10 lá có thêm `luoi` để vẽ đúng sơ đồ đặt lá.

Trang xem bài nhận `#1la`, `#3la`, `#tinhcam`, `#5la`, `#10la` hoặc `#tinhyeu`, `#sunghiep`, `#taichinh`, `#banthan`, `#tongquan` trên đường dẫn để chọn sẵn kiểu trải hoặc chủ đề (trang chủ dùng cách này).

Khi xáo có 4 động tác nối nhau (khoảng 4 giây): trải quạt, trộn xen kẽ 2 lượt, cắt thành 3 xấp rồi chồng lại theo thứ tự khác, gõ cho gọn; dòng trạng thái ghi tên từng động tác, quanh bộ bài có vầng sáng và sao lấp lánh. Sau đó các lá được chia ra thành hàng. Người dùng bấm lá úp nào thì lá đó bay vào ô kế tiếp trong trải bài. Rút đủ lá thì chạm từng lá (hoặc "Lật tất cả") để lật: lá nhấc lên, xoay mặt, rồi hiện tên lá và chiều Xuôi/Ngược bên dưới; lật hết mới hiện ý nghĩa. Người dùng bật chế độ giảm chuyển động trên máy thì bỏ qua hiệu ứng. Hiệu ứng chỉ để trình diễn; thứ tự lá đã được xáo ngẫu nhiên trước đó.

Kết quả đọc bài có ba lớp:

- **Từng lá theo vị trí:** mỗi vị trí trong trải bài (18 vị trí) có hai cách đọc, chọn theo việc lá đang thuận hay nghịch (lá xuôi bình thường là thuận; các lá nặng như Tòa Tháp, 3 Kiếm, 10 Kiếm thì xuôi là nghịch, ngược là thuận vì thường mang nghĩa hồi phục), rồi ghép với từ khóa của lá. Kèm ý nghĩa theo chủ đề đã chọn và ý nghĩa chung.
- **Tổng hợp luận giải:** một bài đọc liền mạch gồm mở bài (sắc thái chung, lá Ẩn Chính, bộ nổi bật), các đoạn nối lá theo cấu trúc riêng của từng kiểu trải (dòng thời gian, bạn và người ấy, thập tự Celtic), câu nối đổi theo chiều thuận/nghịch giữa hai lá liền nhau, và lời nhắn chung.
- **Điểm đáng chú ý:** số lá Ẩn Chính, bộ nổi bật, số lá ngược.

Thư viện mở chi tiết một lá bằng `thu-vien.html#la-<id>` (ví dụ `#la-17` là Ngôi Sao) và lọc sẵn một nhóm bằng `#nhom-anChinh`, `#nhom-gay`, `#nhom-coc`, `#nhom-kiem`, `#nhom-tien`. Gõ tìm có dấu thì so khớp có dấu, gõ không dấu thì khớp cả từ có dấu.

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
| `POST` | `/api/rut-bai` | Xáo bộ bài và rút theo kiểu trải. Gửi `{ "kieu": "1la" \| "3la" \| "tinhcam" \| "5la" \| "10la", "chuDe": "tongquan" \| "tinhyeu" \| "sunghiep" \| "taichinh" \| "banthan", "nguoc": true }` (đều không bắt buộc; mặc định `3la`, `tongquan`, có lá ngược). Trả về `{ kieu, tenKieu, chuDe, tenChuDe, la: [...], luanGiai: [...], tongQuan: [...] }`; mỗi lá có `yTheoViTri` (ý nghĩa theo vị trí), `y` (ý nghĩa theo chủ đề) và `yChung` (ý nghĩa chung, khi chủ đề khác Tổng quan); `luanGiai` là các đoạn của bài đọc tổng hợp |
| `GET` | `/api/bo-bai` | Cả 78 lá với ý nghĩa xuôi, ngược và theo 4 chủ đề. Tra cứu bằng `?q=` (tên lá, tên tiếng Anh, từ khóa; không dấu cũng được) và `?nhom=anChinh\|gay\|coc\|kiem\|tien` |
| `GET` | `/api/la-bai/:id` | Một lá, `id` từ 0 đến 77 (0–21 Ẩn Chính; 22–35 Gậy, 36–49 Cốc, 50–63 Kiếm, 64–77 Tiền, mỗi bộ từ Át đến Vua) |
| `GET` | `/api/kieu-trai` | Các kiểu trải bài và ý nghĩa từng vị trí |
| `GET` | `/api/chu-de` | Các chủ đề |
| `GET` | `/api/health` | `{ "ok": true }` khi máy chủ đang chạy |

Ví dụ:

```bash
curl -X POST http://localhost:3001/api/rut-bai \
  -H "Content-Type: application/json" \
  -d '{"kieu":"tinhcam","chuDe":"tinhyeu"}'
```

Dữ liệu sai trả mã 400 kèm `{ "error": "..." }` bằng tiếng Việt. Các API cho phép gọi từ trang khác (CORS).
