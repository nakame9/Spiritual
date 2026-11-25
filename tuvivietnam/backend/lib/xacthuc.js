// Mật khẩu, phiên đăng nhập và chặn đoán mật khẩu cho trang quản trị
const crypto = require('crypto');

const COOKIE = 'tv_phien';
const HAN_PHIEN = 8 * 60 * 60 * 1000; // 8 giờ
const SAI_TOI_DA = 5, KHOA_TRONG = 15 * 60 * 1000;

function bamMatKhau(mk) {
  const muoi = crypto.randomBytes(16);
  return `scrypt$${muoi.toString('hex')}$${crypto.scryptSync(mk, muoi, 64).toString('hex')}`;
}
function dungMatKhau(mk, luu) {
  const [kieu, muoi, bam] = String(luu || '').split('$');
  if (kieu !== 'scrypt' || !muoi || !bam) return false;
  const a = crypto.scryptSync(mk, Buffer.from(muoi, 'hex'), 64), b = Buffer.from(bam, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const kiemMatKhau = mk => typeof mk === 'string' && mk.length >= 8 && mk.length <= 200 ? null : 'Mật khẩu cần từ 8 đến 200 ký tự.';

// shortcut: phiên lưu trong bộ nhớ, khởi động lại máy chủ thì mọi người đăng nhập lại; nhiều máy chủ thì chuyển sang lưu chung
const phien = new Map();
function taoPhien(res, req, nguoiDungId) {
  const now = Date.now();
  for (const [t, p] of phien) if (p.het < now) phien.delete(t); // dọn phiên hết hạn để Map không lớn mãi
  const token = crypto.randomBytes(32).toString('hex');
  phien.set(token, { id: nguoiDungId, het: Date.now() + HAN_PHIEN });
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${HAN_PHIEN / 1000}${req.secure ? '; Secure' : ''}`);
}
function docToken(req) {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})`).exec(req.headers.cookie || '');
  return m && m[1];
}
function layPhien(req) {
  const t = docToken(req), p = t && phien.get(t);
  if (!p) return null;
  if (p.het < Date.now()) { phien.delete(t); return null; }
  return p;
}
function xoaPhien(req, res) {
  const t = docToken(req);
  if (t) phien.delete(t);
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
const xoaPhienCua = id => { for (const [t, p] of phien) if (p.id === id) phien.delete(t); };

// Chặn đoán mật khẩu: sai 5 lần trong 15 phút (theo IP) thì tạm khóa đến hết 15 phút
const sai = new Map();
function biChan(ip) {
  const s = sai.get(ip);
  if (s && s.den < Date.now()) { sai.delete(ip); return 0; }
  return s && s.dem >= SAI_TOI_DA ? Math.ceil((s.den - Date.now()) / 60000) : 0;
}
function ghiSai(ip) {
  const now = Date.now();
  if (sai.size > 1000) for (const [k, s] of sai) if (s.den < now) sai.delete(k);
  const s = sai.get(ip) || { dem: 0, den: now + KHOA_TRONG };
  s.dem++; sai.set(ip, s);
}
const xoaSai = ip => sai.delete(ip);

/** Giá trị cho app.set('trust proxy'). req.ip (chặn đoán mật khẩu, giới hạn trợ lý AI) và cookie Secure dựa vào đây.
 *  Tin nhầm proxy thì ai cũng giả được IP bằng header X-Forwarded-For.
 *  TRUST_PROXY theo cú pháp của Express: số lớp proxy ("1"), "true"/"false", hoặc dải IP ("loopback, uniquelocal").
 *  Không đặt: trên Render, Railway, Heroku, Fly tin đúng 1 lớp proxy của nền tảng; nơi khác chỉ tin proxy cùng máy (nginx → 127.0.0.1). */
function proxyTinCay(env) {
  const v = env.TRUST_PROXY;
  if (v === undefined || v === '') return env.RENDER || env.RAILWAY_ENVIRONMENT || env.DYNO || env.FLY_APP_NAME ? 1 : 'loopback';
  if (/^\d+$/.test(v)) return Number(v);
  return v === 'true' ? true : v === 'false' ? false : v;
}

module.exports = { bamMatKhau, dungMatKhau, kiemMatKhau, taoPhien, layPhien, xoaPhien, xoaPhienCua, biChan, ghiSai, xoaSai, proxyTinCay };
