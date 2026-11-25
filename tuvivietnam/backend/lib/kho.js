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
  let hen = null; // hẹn ghi của suaSau
  const huyHen = () => { if (hen) { clearTimeout(hen); hen = null; } };
  return {
    get data() { return data; },
    /** Sửa dữ liệu trong fn rồi lưu xuống đĩa */
    sua(fn) { const kq = fn(data); huyHen(); luu(); return kq; },
    /** Sửa dữ liệu ít quan trọng (lượt đọc) và gom lại ghi một lần sau ms mili giây; tắt máy đột ngột thì mất phần chưa ghi */
    suaSau(fn, ms = 5000) {
      const kq = fn(data);
      if (!hen) {
        hen = setTimeout(() => { hen = null; try { luu(); } catch (e) { console.error('Không ghi được kho:', e.message); } }, ms);
        if (hen.unref) hen.unref(); // không giữ tiến trình sống chỉ vì lần ghi đang hẹn
      }
      return kq;
    },
    /** Ghi ngay phần đang hẹn (khi tắt máy chủ) */
    ghiNgay() { if (hen) { huyHen(); luu(); } },
  };
}

module.exports = { moKho };
