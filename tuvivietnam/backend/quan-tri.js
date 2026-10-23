// API trang quản trị: đăng nhập, bài viết, luận giải, người dùng. Gắn vào /api/admin.
const crypto = require('crypto');
const express = require('express');
const X = require('./lib/xacthuc');

const VAI_TRO = ['admin', 'bientap'];
const congKhai = u => ({ id: u.id, tenDangNhap: u.tenDangNhap, tenHienThi: u.tenHienThi, vaiTro: u.vaiTro, khoa: !!u.khoa, taoLuc: u.taoLuc });
const loi = (res, ma, chu) => res.status(ma).json({ error: chu });
const chuoi = (v, min, max) => typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
const taoSlug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

module.exports = function quanTri({ kho, LuanGiai }) {
  const r = express.Router();
  const dsKhoa = new Set(LuanGiai.danhMuc().map(x => x.khoa));
  const conAdmin = () => kho.data.nguoiDung.filter(u => u.vaiTro === 'admin' && !u.khoa);

  r.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    // Chỉ nhận JSON khi ghi: trình duyệt không gửi được JSON chéo trang mà không bị chặn, kết hợp cookie SameSite là đủ chống CSRF
    if ((req.method === 'POST' || req.method === 'PUT') && !req.is('application/json')) return loi(res, 415, 'Cần gửi dữ liệu dạng JSON.');
    next();
  });

  // ---------- Đăng nhập ----------
  r.post('/dang-nhap', (req, res) => {
    const ip = req.ip, phut = X.biChan(ip);
    if (phut) return loi(res, 429, `Sai mật khẩu quá nhiều lần. Thử lại sau ${phut} phút.`);
    const { tenDangNhap, matKhau } = req.body || {};
    const u = typeof tenDangNhap === 'string' && kho.data.nguoiDung.find(x => x.tenDangNhap === tenDangNhap.trim().toLowerCase());
    const dung = typeof matKhau === 'string' && X.dungMatKhau(matKhau, u ? u.matKhau : 'scrypt$00$00');
    if (!u || !dung) { X.ghiSai(ip); return loi(res, 401, 'Sai tên đăng nhập hoặc mật khẩu.'); }
    if (u.khoa) return loi(res, 403, 'Tài khoản đã bị khóa. Liên hệ quản trị viên.');
    X.xoaSai(ip);
    X.taoPhien(res, req, u.id);
    res.json(congKhai(u));
  });
  r.post('/dang-xuat', (req, res) => { X.xoaPhien(req, res); res.json({ ok: true }); });

  // Mọi API bên dưới cần đăng nhập
  r.use((req, res, next) => {
    const p = X.layPhien(req), u = p && kho.data.nguoiDung.find(x => x.id === p.id);
    if (!u || u.khoa) { X.xoaPhien(req, res); return loi(res, 401, 'Bạn cần đăng nhập.'); }
    req.user = u; next();
  });
  const chiAdmin = (req, res, next) => req.user.vaiTro === 'admin' ? next() : loi(res, 403, 'Chỉ quản trị viên được làm việc này.');

  r.get('/toi', (req, res) => res.json(congKhai(req.user)));
  r.post('/doi-mat-khau', (req, res) => {
    const { matKhauCu, matKhauMoi } = req.body || {};
    if (typeof matKhauCu !== 'string' || !X.dungMatKhau(matKhauCu, req.user.matKhau)) return loi(res, 400, 'Mật khẩu hiện tại không đúng.');
    const e = X.kiemMatKhau(matKhauMoi); if (e) return loi(res, 400, e);
    kho.sua(() => { req.user.matKhau = X.bamMatKhau(matKhauMoi); });
    X.xoaPhienCua(req.user.id); X.taoPhien(res, req, req.user.id); // đăng xuất các máy khác
    res.json({ ok: true });
  });

  // ---------- Bài viết ----------
  function docBai(b, cu) {
    if (!chuoi(b.tieuDe, 1, 200)) throw new Error('Tiêu đề cần từ 1 đến 200 ký tự.');
    if (typeof b.noiDung !== 'string' || b.noiDung.length > 100000) throw new Error('Nội dung tối đa 100.000 ký tự.');
    const slug = taoSlug(b.slug || b.tieuDe);
    if (!slug) throw new Error('Đường dẫn bài viết chỉ gồm chữ không dấu, số và dấu gạch ngang.');
    if (kho.data.baiViet.some(x => x.slug === slug && x !== cu)) throw new Error(`Đường dẫn "${slug}" đã có bài khác dùng.`);
    if (b.trangThai !== 'xuatban' && b.trangThai !== 'nhap') throw new Error('Trạng thái cần là xuất bản hoặc nháp.');
    const phut = b.phutDoc === undefined || b.phutDoc === '' ? Math.max(1, Math.round(b.noiDung.split(/\s+/).length / 200)) : Number(b.phutDoc);
    if (!Number.isInteger(phut) || phut < 1 || phut > 120) throw new Error('Thời gian đọc cần từ 1 đến 120 phút.');
    if (b.chuyenMuc !== undefined && !chuoi(b.chuyenMuc, 0, 60)) throw new Error('Chuyên mục tối đa 60 ký tự.');
    if (b.tomTat !== undefined && (typeof b.tomTat !== 'string' || b.tomTat.length > 400)) throw new Error('Tóm tắt tối đa 400 ký tự.');
    return { slug, tieuDe: b.tieuDe.trim(), chuyenMuc: (b.chuyenMuc || 'Kiến thức').trim() || 'Kiến thức', tomTat: (b.tomTat || '').trim(), phutDoc: phut, noiDung: b.noiDung, trangThai: b.trangThai };
  }
  r.get('/bai-viet', (req, res) => res.json([...kho.data.baiViet].sort((a, b) => b.taoLuc.localeCompare(a.taoLuc))));
  r.post('/bai-viet', (req, res) => {
    let v; try { v = docBai(req.body || {}); } catch (e) { return loi(res, 400, e.message); }
    const now = new Date().toISOString();
    const bai = Object.assign({ id: crypto.randomUUID(), tacGia: req.user.tenHienThi, taoLuc: now, suaLuc: now }, v);
    kho.sua(d => d.baiViet.push(bai));
    res.status(201).json(bai);
  });
  r.put('/bai-viet/:id', (req, res) => {
    const bai = kho.data.baiViet.find(x => x.id === req.params.id);
    if (!bai) return loi(res, 404, 'Không tìm thấy bài viết.');
    let v; try { v = docBai(req.body || {}, bai); } catch (e) { return loi(res, 400, e.message); }
    kho.sua(() => Object.assign(bai, v, { suaLuc: new Date().toISOString() }));
    res.json(bai);
  });
  r.delete('/bai-viet/:id', (req, res) => {
    const i = kho.data.baiViet.findIndex(x => x.id === req.params.id);
    if (i < 0) return loi(res, 404, 'Không tìm thấy bài viết.');
    kho.sua(d => d.baiViet.splice(i, 1));
    res.json({ ok: true });
  });

  // ---------- Nội dung luận giải ----------
  r.get('/luan-giai', (req, res) => res.json({ danhMuc: LuanGiai.danhMuc(), ghiDe: kho.data.luanGiai }));
  r.put('/luan-giai', (req, res) => {
    const { khoa, noiDung } = req.body || {};
    if (!dsKhoa.has(khoa)) return loi(res, 400, 'Không có đoạn luận giải này.');
    if (noiDung !== null && !chuoi(noiDung, 1, 2000)) return loi(res, 400, 'Nội dung cần từ 1 đến 2.000 ký tự (hoặc khôi phục mặc định).');
    kho.sua(d => { if (noiDung === null) delete d.luanGiai[khoa]; else d.luanGiai[khoa] = noiDung.trim(); });
    LuanGiai.apDung(kho.data.luanGiai);
    res.json({ khoa, noiDung: kho.data.luanGiai[khoa] ?? null });
  });

  // ---------- Người dùng (chỉ quản trị viên) ----------
  r.get('/nguoi-dung', chiAdmin, (req, res) => res.json(kho.data.nguoiDung.map(congKhai)));
  r.post('/nguoi-dung', chiAdmin, (req, res) => {
    const b = req.body || {}, ten = typeof b.tenDangNhap === 'string' ? b.tenDangNhap.trim().toLowerCase() : '';
    if (!/^[a-z0-9._-]{3,32}$/.test(ten)) return loi(res, 400, 'Tên đăng nhập 3–32 ký tự: chữ thường không dấu, số, dấu chấm, gạch.');
    if (kho.data.nguoiDung.some(x => x.tenDangNhap === ten)) return loi(res, 400, 'Tên đăng nhập đã có người dùng.');
    if (!chuoi(b.tenHienThi, 1, 60)) return loi(res, 400, 'Tên hiển thị cần từ 1 đến 60 ký tự.');
    if (!VAI_TRO.includes(b.vaiTro)) return loi(res, 400, 'Vai trò cần là quản trị viên hoặc biên tập viên.');
    const e = X.kiemMatKhau(b.matKhau); if (e) return loi(res, 400, e);
    const u = { id: crypto.randomUUID(), tenDangNhap: ten, tenHienThi: b.tenHienThi.trim(), vaiTro: b.vaiTro, khoa: false, matKhau: X.bamMatKhau(b.matKhau), taoLuc: new Date().toISOString() };
    kho.sua(d => d.nguoiDung.push(u));
    res.status(201).json(congKhai(u));
  });
  r.put('/nguoi-dung/:id', chiAdmin, (req, res) => {
    const u = kho.data.nguoiDung.find(x => x.id === req.params.id), b = req.body || {};
    if (!u) return loi(res, 404, 'Không tìm thấy người dùng.');
    const laMinh = u.id === req.user.id;
    if (b.tenHienThi !== undefined && !chuoi(b.tenHienThi, 1, 60)) return loi(res, 400, 'Tên hiển thị cần từ 1 đến 60 ký tự.');
    if (b.vaiTro !== undefined && !VAI_TRO.includes(b.vaiTro)) return loi(res, 400, 'Vai trò không hợp lệ.');
    if (b.matKhau !== undefined) { const e = X.kiemMatKhau(b.matKhau); if (e) return loi(res, 400, e); }
    const haQuyen = (b.vaiTro && b.vaiTro !== 'admin') || b.khoa === true;
    if (laMinh && haQuyen) return loi(res, 400, 'Bạn không thể tự khóa hoặc tự bỏ quyền quản trị của mình.');
    if (haQuyen && u.vaiTro === 'admin' && !u.khoa && conAdmin().length <= 1) return loi(res, 400, 'Cần giữ ít nhất một quản trị viên đang hoạt động.');
    kho.sua(() => {
      if (b.tenHienThi !== undefined) u.tenHienThi = b.tenHienThi.trim();
      if (b.vaiTro !== undefined) u.vaiTro = b.vaiTro;
      if (b.khoa !== undefined) u.khoa = !!b.khoa;
      if (b.matKhau !== undefined) u.matKhau = X.bamMatKhau(b.matKhau);
    });
    if (u.khoa || b.matKhau !== undefined) X.xoaPhienCua(u.id);
    if (laMinh && b.matKhau !== undefined) X.taoPhien(res, req, u.id);
    res.json(congKhai(u));
  });
  r.delete('/nguoi-dung/:id', chiAdmin, (req, res) => {
    const i = kho.data.nguoiDung.findIndex(x => x.id === req.params.id);
    if (i < 0) return loi(res, 404, 'Không tìm thấy người dùng.');
    const u = kho.data.nguoiDung[i];
    if (u.id === req.user.id) return loi(res, 400, 'Bạn không thể tự xóa tài khoản của mình.');
    if (u.vaiTro === 'admin' && !u.khoa && conAdmin().length <= 1) return loi(res, 400, 'Cần giữ ít nhất một quản trị viên đang hoạt động.');
    kho.sua(d => d.nguoiDung.splice(i, 1));
    X.xoaPhienCua(u.id);
    res.json({ ok: true });
  });

  return r;
};

/** Tạo quản trị viên đầu tiên từ biến môi trường ADMIN_USER / ADMIN_PASSWORD khi kho chưa có ai */
module.exports.taoAdminDauTien = function (kho, env) {
  if (kho.data.nguoiDung.length || !env.ADMIN_USER || !env.ADMIN_PASSWORD) return false;
  const ten = env.ADMIN_USER.trim().toLowerCase(), e = X.kiemMatKhau(env.ADMIN_PASSWORD);
  if (!/^[a-z0-9._-]{3,32}$/.test(ten) || e) throw new Error(`ADMIN_USER/ADMIN_PASSWORD không hợp lệ: ${e || 'tên đăng nhập 3–32 ký tự không dấu'}`);
  kho.sua(d => d.nguoiDung.push({ id: crypto.randomUUID(), tenDangNhap: ten, tenHienThi: 'Quản trị viên', vaiTro: 'admin', khoa: false, matKhau: X.bamMatKhau(env.ADMIN_PASSWORD), taoLuc: new Date().toISOString() }));
  return true;
};
