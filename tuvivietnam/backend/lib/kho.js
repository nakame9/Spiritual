// Kho dữ liệu: một file JSON (người dùng, bài viết, luận giải đã sửa) trong DATA_DIR.
// shortcut: một file JSON cho một tiến trình máy chủ; khi có nhiều máy chủ chạy song song hoặc dữ liệu lớn thì chuyển sang SQLite/Postgres
const fs = require('fs');
const path = require('path');

function moKho(thuMuc) {
  const file = path.join(thuMuc, 'du-lieu.json');
  fs.mkdirSync(thuMuc, { recursive: true });
  let data;
  if (fs.existsSync(file)) data = JSON.parse(fs.readFileSync(file, 'utf8'));
  else {
    // Lần đầu: nạp sẵn các bài viết mẫu của website
    const mau = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data-mau', 'bai-viet.json'), 'utf8'));
    data = { nguoiDung: [], baiViet: mau, luanGiai: {} };
  }
  const luu = () => {
    const tam = file + '.tmp';
    fs.writeFileSync(tam, JSON.stringify(data, null, 2));
    fs.renameSync(tam, file); // ghi file tạm rồi đổi tên, tránh hỏng dữ liệu nếu máy chủ tắt giữa chừng
  };
  luu();
  return {
    get data() { return data; },
    /** Sửa dữ liệu trong fn rồi lưu xuống đĩa */
    sua(fn) { const kq = fn(data); luu(); return kq; },
  };
}

module.exports = { moKho };
