// Máy chủ số chủ đạo (thần số học): API tính các chỉ số và phục vụ luôn trang trong ../frontend
const path = require('path');
const express = require('express');
// Dùng chung mã với frontend để trang web và API luôn ra cùng kết quả
const SoHoc = require('../frontend/js/so-hoc.js');

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method !== 'OPTIONS') return next();
  res.set({ 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.sendStatus(204);
});

class Loi extends Error {}
function docNgay(s, ten) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')), y = m && Number(m[1]), mo = m && Number(m[2]), d = m && Number(m[3]);
  if (!m || y < 1900 || y > 2100 || mo < 1 || mo > 12 || new Date(Date.UTC(y, mo - 1, d)).getUTCDate() !== d) throw new Loi(`${ten} cần dạng YYYY-MM-DD, năm 1900–2100.`);
  return { y, m: mo, d };
}
const homNay = () => { const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).split('-').map(Number); return { y, m, d }; };
const boc = fn => (req, res) => { try { res.json(fn(req)); } catch (e) { if (e instanceof Loi) res.status(400).json({ error: e.message }); else throw e; } };

app.get('/api/health', (req, res) => res.json({ ok: true }));
// Toàn bộ chỉ số: ?ngaySinh=1990-08-15&ten=Nguyễn Văn A&homNay=2026-10-24 (ten, homNay không bắt buộc)
app.get('/api/so-chu-dao', boc(req => {
  const ten = req.query.ten;
  if (ten !== undefined && (typeof ten !== 'string' || ten.length > 60)) throw new Loi('ten tối đa 60 ký tự.');
  return SoHoc.tinh(docNgay(req.query.ngaySinh, 'ngaySinh'), req.query.homNay ? docNgay(req.query.homNay, 'homNay') : homNay(), ten);
}));
// Ý nghĩa một số chủ đạo: 2–11 hoặc 22
app.get('/api/y-nghia/:so', (req, res) => {
  const c = SoHoc.SO_CHU_DAO[req.params.so];
  if (!c || !/^\d+$/.test(req.params.so)) return res.status(404).json({ error: 'Số chủ đạo chỉ gồm 2–11 và 22.' });
  res.json(Object.assign({ so: Number(req.params.so), hien: SoHoc.hienSo(Number(req.params.so)) }, c));
});
// Chu kỳ năm cá nhân 1–9
app.get('/api/chu-ky', (req, res) => res.json(SoHoc.CHU_KY));

app.use('/api', (req, res) => res.status(404).json({ error: 'Không có API này.' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Dữ liệu gửi lên không phải JSON hợp lệ.' });
  console.error(err);
  res.status(500).json({ error: 'Máy chủ gặp lỗi.' });
});

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3003;
  app.listen(PORT, () => console.log(`Số chủ đạo đang chạy tại http://localhost:${PORT}`));
}
module.exports = app;
