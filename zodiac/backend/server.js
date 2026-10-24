// Máy chủ cung hoàng đạo: API cho 10 chức năng và phục vụ luôn các trang trong ../frontend
const path = require('path');
const express = require('express');
// Dùng chung mã với frontend để trang web và API luôn ra cùng kết quả
const HD = require('../frontend/js/cung-hoang-dao.js');
const LG = require('../frontend/js/luan-giai.js');
const TV = require('../frontend/js/thien-van.js');
const DD = require('../frontend/js/dia-diem.js');

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));

app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method !== 'OPTIONS') return next();
  res.set({ 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.sendStatus(204);
});

// ---------- Kiểm tra dữ liệu vào ----------
class Loi extends Error {}
function docNgay(s, ten = 'ngay') {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  const y = m && Number(m[1]), mo = m && Number(m[2]), d = m && Number(m[3]);
  if (!m || y < 1900 || y > 2100 || new Date(Date.UTC(y, mo - 1, d)).getUTCDate() !== d || mo < 1 || mo > 12) throw new Loi(`${ten} cần dạng YYYY-MM-DD, năm 1900–2100.`);
  return { y, m: mo, d };
}
function docGio(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s));
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) throw new Loi('gio cần dạng HH:mm (00:00 đến 23:59).');
  return { h: Number(m[1]), mi: Number(m[2]) };
}
function docTz(tz) {
  if (tz === undefined) return LG.VN;
  try { new Intl.DateTimeFormat('en-US', { timeZone: String(tz) }); return String(tz); } catch { throw new Loi('tz cần là tên múi giờ IANA, ví dụ Asia/Ho_Chi_Minh hoặc Etc/GMT-7.'); }
}
const cungSo = id => { const c = HD.CUNG.find(x => x.id === id); if (!c) throw new Loi(`Không có cung "${id}". Dùng một trong: ${HD.CUNG.map(x => x.id).join(', ')}.`); return c.so; };
const homNay = () => { const x = TV.ngayTai(new Date(), LG.VN); return { y: x.y, m: x.m, d: x.d }; };
const boc = fn => (req, res) => { try { res.json(fn(req)); } catch (e) { if (e instanceof Loi) res.status(400).json({ error: e.message }); else throw e; } };

// ---------- API ----------
app.get('/api/health', (req, res) => res.json({ ok: true }));
// 2. Tổng quan 12 cung, nguyên tố, tính chất, hành tinh, 12 nhà
app.get('/api/cung', (req, res) => res.json(HD.CUNG));
app.get('/api/cung/:id', (req, res) => {
  const c = HD.CUNG.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Không có cung này.' });
  res.json(c);
});
app.get('/api/tong-quan', (req, res) => res.json({ nguyenTo: HD.NGUYEN_TO, tinhChat: HD.TINH_CHAT, hanhTinh: HD.HANH_TINH, nha: HD.NHA }));
// 1. Xác định cung Mặt Trời theo ngày sinh (giờ sinh và múi giờ không bắt buộc)
app.get('/api/xac-dinh', boc(req => {
  const n = docNgay(req.query.ngay), g = req.query.gio ? docGio(req.query.gio) : {}, r = LG.xacDinhCung({ ...n, ...g, tz: docTz(req.query.tz) });
  return { cung: r.cung.id, tenCung: r.cung.ten, coGio: r.coGio, theoBang: r.theoBang && r.theoBang.id,
    giaoCung: r.giaoCung ? { truoc: r.giaoCung.truoc.id, sau: r.giaoCung.sau.id, luc: r.giaoCung.luc } : null };
}));
// 3, 4. Tử vi ngày, tuần, tháng, năm (giờ Việt Nam)
app.get('/api/tu-vi/:cung', boc(req => {
  const s = cungSo(req.params.cung), ky = req.query.ky || 'ngay', n = req.query.ngay ? docNgay(req.query.ngay) : homNay();
  if (ky === 'ngay') return LG.tuViNgay(s, n.y, n.m, n.d);
  if (ky === 'tuan') return LG.tuViTuan(s, n.y, n.m, n.d);
  if (ky === 'thang') return LG.tuViThang(s, n.y, n.m);
  if (ky === 'nam') return LG.tuViNam(s, n.y);
  throw new Loi('ky cần là ngay, tuan, thang hoặc nam.');
}));
// 6, 7. Độ tương hợp hai cung
app.get('/api/tuong-hop', boc(req => LG.tuongHop(cungSo(req.query.a), cungSo(req.query.b))));
// 9, 10. Bản đồ sao và Big Three
app.post('/api/ban-do-sao', boc(req => {
  const b = req.body || {}, n = docNgay(b.ngay), coGio = b.gio !== undefined && b.gio !== null && b.gio !== '';
  const g = coGio ? docGio(b.gio) : {}, tz = docTz(b.tz);
  const coToaDo = b.viDo !== undefined || b.kinhDo !== undefined;
  if (coToaDo && !(typeof b.viDo === 'number' && typeof b.kinhDo === 'number' && Math.abs(b.viDo) <= 66 && Math.abs(b.kinhDo) <= 180))
    throw new Loi('viDo cần là số từ -66 đến 66, kinhDo là số từ -180 đến 180.');
  return LG.banDoSao({ ...n, ...g, coGio, tz, viDo: coToaDo ? b.viDo : undefined, kinhDo: coToaDo ? b.kinhDo : undefined });
}));
app.get('/api/dia-diem', (req, res) => res.json(DD));

app.use('/api', (req, res) => res.status(404).json({ error: 'Không có API này.' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/shared', express.static(path.join(__dirname, '..', '..', 'shared'))); // CSS dùng chung của cả site

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Dữ liệu gửi lên không phải JSON hợp lệ.' });
  console.error(err);
  res.status(500).json({ error: 'Máy chủ gặp lỗi.' });
});

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3002;
  app.listen(PORT, () => console.log(`Cung hoàng đạo đang chạy tại http://localhost:${PORT}`));
}
module.exports = app;
