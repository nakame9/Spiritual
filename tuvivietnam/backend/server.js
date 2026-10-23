// Máy chủ Tử Vi Việt Nam: API lập lá số + luận giải, và phục vụ luôn các trang trong ../frontend
const path = require('path');
const express = require('express');
// Dùng chung engine với frontend để trình duyệt và máy chủ luôn ra cùng một kết quả
const TuVi = require('../frontend/js/tuvi.js');
const LuanGiai = require('../frontend/js/luangiai.js');
const ConGiap = require('../frontend/js/congiap.js');
const Markdown = require('../frontend/js/markdown.js');
// Trang chủ kết hợp tử vi, cung hoàng đạo (../../zodiac) và số chủ đạo (../../numerology)
const TongHop = require('../frontend/js/tong-hop.js');
const { moKho } = require('./lib/kho');
const quanTri = require('./quan-tri');

const FRONTEND = path.join(__dirname, '..', 'frontend');
// DATA_DIR nên trỏ tới ổ đĩa bền vững khi chạy trên máy chủ thật (dữ liệu bài viết, tài khoản nằm ở đây)
const kho = moKho(process.env.DATA_DIR || path.join(__dirname, 'data'));
if (quanTri.taoAdminDauTien(kho, process.env)) console.log(`Đã tạo quản trị viên "${process.env.ADMIN_USER}".`);
LuanGiai.apDung(kho.data.luanGiai);

const app = express();
app.set('trust proxy', 1); // chạy sau proxy HTTPS của nhà cung cấp hosting: lấy đúng IP và bật cookie Secure
app.use(express.json({ limit: '300kb' }));

// API công khai cho phép gọi từ trang khác (frontend đặt ở GitHub Pages); API quản trị thì không
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/admin')) return next();
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method !== 'OPTIONS') return next();
  res.set({ 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.sendStatus(204);
});
app.use('/api/admin', quanTri({ kho, LuanGiai }));

/** Kiểm tra dữ liệu gửi lên, trả về tham số cho TuVi.lapLaSo hoặc ném lỗi tiếng Việt */
function docVao(b) {
  const so = (k, min, max, ten) => {
    const v = Number(b[k]);
    if (!Number.isInteger(v) || v < min || v > max) throw new Error(`${ten} cần là số nguyên từ ${min} đến ${max}.`);
    return v;
  };
  if (b.gioiTinh !== 'nam' && b.gioiTinh !== 'nu') throw new Error('gioiTinh cần là "nam" hoặc "nu".');
  const amLich = b.amLich === true;
  return {
    ngay: so('ngay', 1, amLich ? 30 : 31, 'Ngày sinh'),
    thang: so('thang', 1, 12, 'Tháng sinh'),
    nam: so('nam', 1900, 2100, 'Năm sinh'),
    gio: so('gio', 1, 12, 'Giờ sinh (1 = Tý … 12 = Hợi)'),
    namGioi: b.gioiTinh === 'nam',
    amLich,
    nhuan: b.nhuan === true,
    ten: typeof b.ten === 'string' ? b.ten.trim().slice(0, 100) : '',
  };
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Lập lá số: trả về lá số đầy đủ và luận giải 12 cung (HTML từng cung)
app.post('/api/la-so', (req, res) => {
  let laSo;
  try {
    laSo = TuVi.lapLaSo(docVao(req.body || {}));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  const luanGiai = LuanGiai.THU_TU.map(ten => {
    const c = laSo.cung.find(x => x.ten === ten);
    return { cung: ten, so: c.so, chi: c.chi, html: LuanGiai.luanGiai(laSo, c.so) };
  });
  res.json({ laSo, luanGiai });
});

// Tử vi 12 con giáp: /api/con-giap?tuoi=1..12&ky=ngay|tuan|thang|nam&ngay=YYYY-MM-DD[&namSinh=1990&gioiTinh=nam]
const KY = { ngay: ConGiap.tuViNgay, tuan: ConGiap.tuViTuan, thang: ConGiap.tuViThang, nam: ConGiap.tuViNam };
app.get('/api/con-giap', (req, res) => {
  const q = req.query, tuoi = Number(q.tuoi), ky = q.ky || 'ngay';
  if (!Number.isInteger(tuoi) || tuoi < 1 || tuoi > 12) return res.status(400).json({ error: 'tuoi cần từ 1 (Tý) đến 12 (Hợi).' });
  if (!KY[ky]) return res.status(400).json({ error: 'ky cần là ngay, tuan, thang hoặc nam.' });
  let d = new Date();
  d = [d.getDate(), d.getMonth() + 1, d.getFullYear()];
  if (q.ngay) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(q.ngay);
    const t = m && new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if (!m || t.getMonth() !== Number(m[2]) - 1 || m[1] < 1901 || m[1] > 2199) return res.status(400).json({ error: 'ngay cần dạng YYYY-MM-DD, năm từ 1901 đến 2199.' });
    d = [Number(m[3]), Number(m[2]), Number(m[1])];
  }
  let opts = null;
  if (q.namSinh) {
    const y = Number(q.namSinh);
    if (!Number.isInteger(y) || y < 1900 || y > 2100) return res.status(400).json({ error: 'namSinh cần từ 1900 đến 2100.' });
    opts = { namSinh: y, gioiTinh: q.gioiTinh === 'nu' ? 'nu' : 'nam' };
  }
  res.json(KY[ky](tuoi, TuVi.jdFromDate(...d), opts));
});

// Dự đoán kết hợp ba hệ (trang chủ): cùng dữ liệu vào như /api/la-so, thêm homNay=YYYY-MM-DD (không bắt buộc, mặc định hôm nay giờ Việt Nam)
app.post('/api/tong-hop', (req, res) => {
  const b = req.body || {};
  let v, homNay;
  try {
    v = docVao(b);
    const [y, m, d] = (b.homNay || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())).split('-').map(Number);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.homNay || '2000-01-01') || y < 1900 || y > 2100 || new Date(Date.UTC(y, m - 1, d)).getUTCDate() !== d) throw new Error('homNay cần dạng YYYY-MM-DD, năm 1900–2100.');
    homNay = { y, m, d };
    return res.json(TongHop.duDoan(v, homNay));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// Bài viết đã xuất bản và các đoạn luận giải đã sửa, cho web công khai
const daXuatBan = () => kho.data.baiViet.filter(b => b.trangThai === 'xuatban').sort((a, b) => b.taoLuc.localeCompare(a.taoLuc));
app.get('/api/bai-viet', (req, res) => res.json(daXuatBan().map(({ slug, tieuDe, chuyenMuc, tomTat, phutDoc, tacGia, taoLuc }) => ({ slug, tieuDe, chuyenMuc, tomTat, phutDoc, tacGia, taoLuc }))));
app.get('/api/bai-viet/:slug', (req, res) => {
  const b = daXuatBan().find(x => x.slug === req.params.slug);
  if (!b) return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
  const { slug, tieuDe, chuyenMuc, tomTat, phutDoc, tacGia, taoLuc, suaLuc } = b;
  res.json({ slug, tieuDe, chuyenMuc, tomTat, phutDoc, tacGia, taoLuc, suaLuc, html: Markdown.render(b.noiDung) });
});
app.get('/api/luan-giai/ghi-de', (req, res) => res.json(kho.data.luanGiai));

app.use('/api', (req, res) => res.status(404).json({ error: 'Không có API này.' }));
// Trang quản trị không cho nhúng vào trang khác (chống clickjacking)
app.use('/admin', (req, res, next) => { res.set({ 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'same-origin' }); next(); });
app.use(express.static(FRONTEND));
// Các phần khác của site nằm cạnh thư mục tuvivietnam; phục vụ luôn để trang chủ và menu chạy được khi chạy riêng máy chủ này
for (const p of ['zodiac', 'numerology', 'Tarot']) app.use(`/${p}/frontend`, express.static(path.join(__dirname, '..', '..', p, 'frontend')));

// Lỗi JSON hỏng hoặc lỗi bất ngờ: trả lời gọn, không lộ chi tiết máy chủ
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Dữ liệu gửi lên không phải JSON hợp lệ.' });
  console.error(err);
  res.status(500).json({ error: 'Máy chủ gặp lỗi.' });
});

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => console.log(`Tử Vi Việt Nam đang chạy tại http://localhost:${PORT}`));
}
module.exports = app;
