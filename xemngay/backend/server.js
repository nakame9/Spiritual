// Máy chủ xem ngày tốt xấu: API tra ngày, lịch tháng, chọn ngày theo việc và phục vụ luôn trang trong ../frontend
const path = require('path');
const express = require('express');
// Dùng chung mã với frontend để trang web và API luôn ra cùng kết quả
const XemNgay = require('../frontend/js/lich-ngay.js');

const app = express();
app.set('trust proxy', 1);
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method !== 'OPTIONS') return next();
  res.set({ 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.sendStatus(204);
});

class Loi extends Error {}
function docNgay(s, ten) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')), y = m && Number(m[1]), mo = m && Number(m[2]), d = m && Number(m[3]);
  if (!m || y < 1900 || y > 2100 || mo < 1 || mo > 12 || new Date(Date.UTC(y, mo - 1, d)).getUTCDate() !== d) throw new Loi(`${ten} cần dạng YYYY-MM-DD, năm 1900–2100.`);
  return { y, m: mo, d };
}
function docNam(q, ten) {
  if (q === undefined) return undefined;
  if (typeof q !== 'string' || !/^\d{4}$/.test(q) || Number(q) < 1900 || Number(q) > 2100) throw new Loi(`${ten} là năm 1900–2100.`);
  return Number(q);
}
const docViec = v => { if (v !== undefined && !Object.hasOwn(XemNgay.VIEC, v)) throw new Loi(`viec chỉ nhận: ${Object.keys(XemNgay.VIEC).join(', ')}.`); return v; };
const boc = fn => (req, res) => { try { res.json(fn(req)); } catch (e) { if (e instanceof Loi) res.status(400).json({ error: e.message }); else throw e; } };

app.get('/api/health', (req, res) => res.json({ ok: true }));
// Một ngày: ?ngay=2026-10-24&namSinh=1990&viec=cuoiHoi (namSinh, viec không bắt buộc)
app.get('/api/ngay', boc(req => { const n = docNgay(req.query.ngay, 'ngay'); return XemNgay.xemNgay(n.d, n.m, n.y, { namSinh: docNam(req.query.namSinh, 'namSinh'), viec: docViec(req.query.viec) }); }));
// Lịch tháng: ?nam=2026&thang=10&namSinh=1990
app.get('/api/thang', boc(req => {
  const y = docNam(req.query.nam, 'nam'), m = Number(req.query.thang);
  if (y === undefined || !/^\d{1,2}$/.test(String(req.query.thang)) || m < 1 || m > 12) throw new Loi('Cần nam (1900–2100) và thang (1–12).');
  return XemNgay.lichThang(y, m, { namSinh: docNam(req.query.namSinh, 'namSinh') });
}));
// Chọn ngày: ?viec=khaiTruong&tu=2026-11-01&den=2026-12-31&namSinh=1990
app.get('/api/chon-ngay', boc(req => {
  if (req.query.viec === undefined) throw new Loi('Cần viec.');
  try { return XemNgay.chonNgay(docViec(req.query.viec), docNgay(req.query.tu, 'tu'), docNgay(req.query.den, 'den'), docNam(req.query.namSinh, 'namSinh')); }
  catch (e) { throw e instanceof Loi ? e : new Loi(e.message); }
}));
app.get('/api/viec', (req, res) => res.json(XemNgay.VIEC));

app.use('/api', (req, res) => res.status(404).json({ error: 'Không có API này.' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/shared', express.static(path.join(__dirname, '..', '..', 'shared'))); // CSS dùng chung của cả site
app.use('/tuvivietnam/frontend/js', express.static(path.join(__dirname, '..', '..', 'tuvivietnam', 'frontend', 'js'))); // lịch âm và hoàng đạo dùng chung
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Máy chủ gặp lỗi.' }); });

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3004;
  app.listen(PORT, () => console.log(`Xem ngày đang chạy tại http://localhost:${PORT}`));
}
module.exports = app;
