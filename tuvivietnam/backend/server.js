// Máy chủ Tử Vi Việt Nam: API lập lá số + luận giải, và phục vụ luôn các trang trong ../frontend
const path = require('path');
const express = require('express');
// Dùng chung engine với frontend để trình duyệt và máy chủ luôn ra cùng một kết quả
const TuVi = require('../frontend/js/tuvi.js');
const LuanGiai = require('../frontend/js/luangiai.js');
const ConGiap = require('../frontend/js/congiap.js');
const ConGiapHoSo = require('../frontend/js/con-giap-ho-so.js');
const Markdown = require('../frontend/js/markdown.js');
const ThuVien = require('../frontend/js/thu-vien.js');
const TroLy = require('../frontend/js/tro-ly.js');
// Trang chủ kết hợp tử vi, cung hoàng đạo (../../zodiac) và số chủ đạo (../../numerology)
const TongHop = require('../frontend/js/tong-hop.js');
const { moKho } = require('./lib/kho');
const { proxyTinCay } = require('./lib/xacthuc');
const quanTri = require('./quan-tri');

const FRONTEND = path.join(__dirname, '..', 'frontend');
// DATA_DIR nên trỏ tới ổ đĩa bền vững khi chạy trên máy chủ thật (dữ liệu bài viết, tài khoản nằm ở đây)
const kho = moKho(process.env.DATA_DIR || path.join(__dirname, 'data'));
if (quanTri.taoAdminDauTien(kho, process.env)) console.log(`Đã tạo quản trị viên "${process.env.ADMIN_USER}".`);
LuanGiai.apDung(kho.data.luanGiai);

const app = express();
// Proxy HTTPS của nhà cung cấp hosting: lấy đúng IP và bật cookie Secure. Xem TRUST_PROXY trong lib/xacthuc.js và README
app.set('trust proxy', proxyTinCay(process.env));
app.disable('x-powered-by');
app.use((req, res, next) => { res.set('X-Content-Type-Options', 'nosniff'); next(); });
app.use(express.json({ limit: '300kb' }));

// API công khai cho phép gọi từ trang khác (frontend đặt ở GitHub Pages); API quản trị thì không.
// CORS_ORIGIN (ví dụ https://spiritualvn.id.vn) chỉ cho đúng trang đó gọi từ trình duyệt; để trống là mọi trang
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/admin')) return next();
  res.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
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

/** Hôm nay theo giờ Việt Nam { y, m, d }. Máy chủ thuê thường chạy UTC: dùng new Date() trực tiếp thì 0h–7h sáng bị lùi một ngày */
function homNayVN() {
  const p = {};
  new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(new Date()).forEach(x => { p[x.type] = Number(x.value); });
  return { y: p.year, m: p.month, d: p.day };
}
// Lỗi do code (TypeError…) phải thành 500 để còn thấy mà sửa; lỗi kiểm tra đầu vào là Error thường, trả 400
const loiCode = e => e instanceof TypeError || e instanceof ReferenceError || e instanceof RangeError || e instanceof SyntaxError;

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Lập lá số: trả về lá số đầy đủ, luận giải 12 cung (HTML từng cung) và vận hạn của năm xem
app.post('/api/la-so', (req, res) => {
  const b = req.body || {};
  let laSo, namXem = homNayVN().y;
  try {
    laSo = TuVi.lapLaSo(docVao(b));
    if (b.namXem !== undefined) {
      namXem = Number(b.namXem);
      if (!Number.isInteger(namXem) || namXem < 1900 || namXem > 2200) throw new Error('namXem cần là số nguyên từ 1900 đến 2200.');
    }
  } catch (e) {
    if (loiCode(e)) throw e;
    return res.status(400).json({ error: e.message });
  }
  const luanGiai = LuanGiai.THU_TU.map(ten => {
    const c = laSo.cung.find(x => x.ten === ten);
    return { cung: ten, so: c.so, chi: c.chi, html: LuanGiai.luanGiai(laSo, c.so, namXem) };
  });
  res.json({ laSo, luanGiai, vanHan: LuanGiai.vanHan(laSo, namXem) });
});

// Hồ sơ một con giáp: /api/con-giap/ho-so?tuoi=1..12 (năm sinh 1900–2100, nạp âm, tính cách, tuổi hợp, tuổi xung)
app.get('/api/con-giap/ho-so', (req, res) => {
  const tuoi = Number(req.query.tuoi);
  if (!Number.isInteger(tuoi) || tuoi < 1 || tuoi > 12) return res.status(400).json({ error: 'tuoi cần từ 1 (Tý) đến 12 (Hợi).' });
  res.json(ConGiapHoSo.hoSo(tuoi));
});
// Tra tuổi hợp: /api/tuoi-hop?a=1990&b=1992 (năm sinh âm lịch; a là mình, b là người cần xem)
app.get('/api/tuoi-hop', (req, res) => {
  const a = Number(req.query.a), b = Number(req.query.b);
  if ([a, b].some(y => !Number.isInteger(y) || y < 1900 || y > 2100)) return res.status(400).json({ error: 'a và b cần là năm sinh từ 1900 đến 2100.' });
  res.json(ConGiapHoSo.hopTuoi(a, b));
});

// Tử vi 12 con giáp: /api/con-giap?tuoi=1..12&ky=ngay|tuan|thang|nam&ngay=YYYY-MM-DD[&namSinh=1990&gioiTinh=nam]
const KY = { ngay: ConGiap.tuViNgay, tuan: ConGiap.tuViTuan, thang: ConGiap.tuViThang, nam: ConGiap.tuViNam };
app.get('/api/con-giap', (req, res) => {
  const q = req.query, tuoi = Number(q.tuoi), ky = q.ky || 'ngay';
  if (!Number.isInteger(tuoi) || tuoi < 1 || tuoi > 12) return res.status(400).json({ error: 'tuoi cần từ 1 (Tý) đến 12 (Hợi).' });
  if (!KY[ky]) return res.status(400).json({ error: 'ky cần là ngay, tuan, thang hoặc nam.' });
  const hn = homNayVN();
  let d = [hn.d, hn.m, hn.y];
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
    if (b.homNay === undefined || b.homNay === '') homNay = homNayVN();
    else {
      const mo = typeof b.homNay === 'string' && /^(\d{4})-(\d{2})-(\d{2})$/.exec(b.homNay), y = mo && Number(mo[1]), m = mo && Number(mo[2]), d = mo && Number(mo[3]);
      if (!mo || y < 1900 || y > 2100 || m < 1 || m > 12 || new Date(Date.UTC(y, m - 1, d)).getUTCDate() !== d) throw new Error('homNay cần dạng YYYY-MM-DD, năm 1900–2100.');
      homNay = { y, m, d };
    }
    return res.json(TongHop.duDoan(v, homNay)); // lập lá số trong này cũng báo ngày âm lịch sai bằng Error thường
  } catch (e) {
    if (loiCode(e)) throw e;
    return res.status(400).json({ error: e.message });
  }
});

// ---------- Trợ lý AI huyền học ----------
// Hệ thống tính dữ liệu bằng bộ quy tắc của site (TroLy.tinh); mô hình AI chỉ nhận dữ liệu đã tính để diễn giải.
// Bật AI: đặt ANTHROPIC_API_KEY (tùy chọn ANTHROPIC_MODEL, ANTHROPIC_BASE_URL). Không có khóa thì trả lời theo mẫu.
// ponytail: giới hạn lượt theo IP trong bộ nhớ một tiến trình; nhiều máy chủ thì chuyển sang kho chung (Redis)
/** Trả hàm ip => true khi IP đó đã gọi quá soLan lần trong cuaSo mili giây */
function taoGioiHan(soLan, cuaSo) {
  const luot = new Map();
  return ip => {
    const now = Date.now(), ds = (luot.get(ip) || []).filter(t => now - t < cuaSo);
    ds.push(now); luot.set(ip, ds);
    if (luot.size > 5000) for (const [k, v] of luot) if (!v.some(t => now - t < cuaSo)) luot.delete(k);
    return ds.length > soLan;
  };
}
const quaGioiHan = taoGioiHan(Number(process.env.TRO_LY_GIOI_HAN || 20), 10 * 60 * 1000);
// Trần lượt gọi AI của cả máy chủ trong một ngày (giờ Việt Nam): giới hạn theo IP không chặn được người dùng nhiều IP.
// Hết trần thì trả lời theo mẫu. TRO_LY_TRAN_NGAY đọc mỗi lần gọi để đổi được khi đang chạy (và trong test)
const tranAI = { ngay: '', dem: 0 };
function conLuotAI() {
  const h = homNayVN(), ngay = `${h.y}-${h.m}-${h.d}`, tran = Number(process.env.TRO_LY_TRAN_NGAY || 300);
  if (tranAI.ngay !== ngay) { tranAI.ngay = ngay; tranAI.dem = 0; }
  if (tranAI.dem >= tran) return false;
  tranAI.dem++;
  return true;
}
function docHoSo(h) {
  if (h == null) return {};
  if (typeof h !== 'object') throw new Error('hoSo cần là object.');
  const out = {}, so = (k, min, max) => { if (h[k] === undefined || h[k] === null || h[k] === '') return; const v = Number(h[k]); if (!Number.isInteger(v) || v < min || v > max) throw new Error(`hoSo.${k} cần là số nguyên từ ${min} đến ${max}.`); out[k] = v; };
  so('d', 1, 31); so('m', 1, 12); so('y', 1900, 2100); so('gio', 1, 12);
  if (out.d && out.m && out.y && new Date(Date.UTC(out.y, out.m - 1, out.d)).getUTCDate() !== out.d) throw new Error('Ngày sinh không có trên lịch.');
  if (h.gioiTinh !== undefined && h.gioiTinh !== '' && h.gioiTinh !== 'nam' && h.gioiTinh !== 'nu') throw new Error('hoSo.gioiTinh cần là "nam" hoặc "nu".');
  if (h.gioiTinh) out.gioiTinh = h.gioiTinh;
  if (h.ten !== undefined) { if (typeof h.ten !== 'string' || h.ten.length > 60) throw new Error('hoSo.ten tối đa 60 ký tự.'); out.ten = h.ten.trim(); }
  return out;
}
async function hoiAI(cauHoi, kq) {
  const p = TroLy.taoPrompt(cauHoi, kq), c = new AbortController(), t = setTimeout(() => c.abort(), 30000);
  try {
    const r = await fetch((process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com') + '/v1/messages', { method: 'POST', signal: c.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 900, system: p.system, messages: [{ role: 'user', content: p.user }] }) });
    if (!r.ok) throw new Error(`AI trả mã ${r.status}`);
    const j = await r.json(), text = (j.content || []).filter(x => x.type === 'text').map(x => x.text).join('\n').trim();
    if (!text) throw new Error('AI không trả lời');
    return text;
  } finally { clearTimeout(t); }
}
app.post('/api/tro-ly', async (req, res) => {
  const b = req.body || {}, cauHoi = typeof b.cauHoi === 'string' ? b.cauHoi.trim() : '';
  if (!cauHoi || cauHoi.length > 500) return res.status(400).json({ error: 'cauHoi cần từ 1 đến 500 ký tự.' });
  let hoSo; try { hoSo = docHoSo(b.hoSo); } catch (e) { return res.status(400).json({ error: e.message }); }
  if (quaGioiHan(req.ip)) return res.status(429).json({ error: 'Bạn hỏi hơi nhanh, hãy thử lại sau ít phút.' });
  const kq = TroLy.tinh(cauHoi, hoSo, homNayVN()), mau = () => TroLy.traLoiMau(kq).join('\n\n');
  const goc = { loai: kq.loai, thieu: kq.thieu, duLieu: TroLy.tomTat(kq), ai: !!process.env.ANTHROPIC_API_KEY };
  // Thiếu đầu vào hoặc câu hỏi ngoài phạm vi: không cần gọi AI
  if (!process.env.ANTHROPIC_API_KEY || (kq.thieu.length && !kq.duLieu) || kq.loai === 'khac') return res.json(Object.assign(goc, { traLoi: mau(), nguon: 'mau' }));
  if (!conLuotAI()) return res.json(Object.assign(goc, { traLoi: mau(), nguon: 'mau', ghiChu: 'Trợ lý AI đã hết lượt của hôm nay, đây là câu trả lời theo mẫu.' }));
  try { res.json(Object.assign(goc, { traLoi: await hoiAI(cauHoi, kq), nguon: 'ai' })); }
  catch (e) { console.error('tro-ly:', e.message); res.json(Object.assign(goc, { traLoi: mau(), nguon: 'mau', ghiChu: 'Trợ lý AI tạm thời không phản hồi, đây là câu trả lời theo mẫu.' })); }
});

// Bài viết đã xuất bản và các đoạn luận giải đã sửa, cho web công khai
const daXuatBan = () => kho.data.baiViet.filter(b => b.trangThai === 'xuatban').sort((a, b) => b.taoLuc.localeCompare(a.taoLuc));
app.get('/api/bai-viet', (req, res) => res.json(daXuatBan().map(({ slug, tieuDe, chuyenMuc, tomTat, phutDoc, tacGia, taoLuc }) => ({ slug, tieuDe, chuyenMuc, tomTat, phutDoc, tacGia, taoLuc }))));
// Lượt đọc cho mục "Phổ biến" của thư viện: chỉ nhận bài có thật (thư viện tĩnh hoặc bài đã xuất bản).
// Trình duyệt chỉ gửi một lần mỗi phiên; máy chủ giới hạn theo IP và gom nhiều lượt vào một lần ghi đĩa (kho.suaSau),
// vì mỗi lần ghi là ghi lại cả file dữ liệu
const quaGioiHanXem = taoGioiHan(Number(process.env.LUOT_XEM_GIOI_HAN || 60), 10 * 60 * 1000);
app.get('/api/bai-viet/luot-xem', (req, res) => res.json(kho.data.luotXem || {}));
app.post('/api/bai-viet/:slug/xem', (req, res) => {
  const slug = req.params.slug;
  if (!ThuVien.BAI.some(b => b.slug === slug) && !daXuatBan().some(b => b.slug === slug)) return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
  if (quaGioiHanXem(req.ip)) return res.status(429).json({ error: 'Quá nhiều lượt đọc từ một địa chỉ, hãy thử lại sau.' });
  const luot = kho.suaSau(d => { d.luotXem = d.luotXem || {}; return (d.luotXem[slug] = (d.luotXem[slug] || 0) + 1); });
  res.json({ slug, luot });
});
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
// Phục vụ cả site theo đúng bố cục GitHub Pages (thư mục shared và các phần bên cạnh), để chạy một máy chủ này là đủ cả site
const GOC_KHO = path.join(__dirname, '..', '..');
app.use('/shared', express.static(path.join(GOC_KHO, 'shared')));
for (const p of ['tuvivietnam', 'zodiac', 'numerology', 'xemngay', 'Tarot']) app.use(`/${p}/frontend`, express.static(path.join(GOC_KHO, p, 'frontend')));

// Lỗi JSON hỏng hoặc lỗi bất ngờ: trả lời gọn, không lộ chi tiết máy chủ
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Dữ liệu gửi lên không phải JSON hợp lệ.' });
  // Lỗi 4xx của body-parser (413 quá lớn, 415 sai bảng mã…): trả đúng mã, không ghi stack
  if (err.expose && err.status >= 400 && err.status < 500) return res.status(err.status).json({ error: err.status === 413 ? 'Dữ liệu gửi lên quá lớn.' : 'Yêu cầu không hợp lệ.' });
  console.error(err);
  res.status(500).json({ error: 'Máy chủ gặp lỗi.' });
});

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => console.log(`Tử Vi Việt Nam đang chạy tại http://localhost:${PORT}`));
  // Tắt máy chủ (Ctrl+C, hosting khởi động lại): ghi nốt lượt đọc còn chờ trong bộ nhớ
  const tat = () => { kho.ghiNgay(); process.exit(0); };
  process.once('SIGINT', tat); process.once('SIGTERM', tat);
}
module.exports = app;
