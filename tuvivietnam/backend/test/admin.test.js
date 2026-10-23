// Kiểm tra trang quản trị: đăng nhập, phân quyền, bài viết, luận giải, người dùng. npm test
const fs = require('fs'), os = require('os'), path = require('path');
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-test-'));
process.env.ADMIN_USER = 'quantri';
process.env.ADMIN_PASSWORD = 'mat-khau-dai-123';
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../server.js');

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => { server.close(); fs.rmSync(process.env.DATA_DIR, { recursive: true, force: true }); });

// Mỗi "trình duyệt" giữ cookie riêng
function trinhDuyet() {
  let cookie = '';
  const goi = async (method, url, body, kieu = 'application/json') => {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = kieu;
    if (cookie) headers.Cookie = cookie;
    const r = await fetch(base + url, { method, headers, body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
    const sc = r.headers.get('set-cookie');
    if (sc) { goi.setCookie = sc; const c = sc.split(';')[0]; cookie = c.endsWith('=') ? '' : c; }
    return { status: r.status, body: await r.json().catch(() => null) };
  };
  return goi;
}

test('phải đăng nhập mới dùng được API quản trị; cookie an toàn', async () => {
  const b = trinhDuyet();
  assert.strictEqual((await b('GET', '/api/admin/toi')).status, 401);
  assert.strictEqual((await b('GET', '/api/admin/bai-viet')).status, 401);
  assert.strictEqual((await b('POST', '/api/admin/dang-nhap', { tenDangNhap: 'quantri', matKhau: 'sai-mat-khau' })).status, 401);
  const ok = await b('POST', '/api/admin/dang-nhap', { tenDangNhap: 'QuanTri', matKhau: 'mat-khau-dai-123' });
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.body.vaiTro, 'admin');
  assert.ok(!('matKhau' in ok.body));
  assert.match(b.setCookie, /HttpOnly/); assert.match(b.setCookie, /SameSite=Lax/);
  assert.strictEqual((await b('GET', '/api/admin/toi')).body.tenDangNhap, 'quantri');
  // Gửi dạng form (kiểu tấn công CSRF) bị từ chối
  assert.strictEqual((await b('POST', '/api/admin/bai-viet', 'tieuDe=x', 'application/x-www-form-urlencoded')).status, 415);
  await b('POST', '/api/admin/dang-xuat', {});
  assert.strictEqual((await b('GET', '/api/admin/toi')).status, 401);
});

test('bài viết: nháp không hiện ra ngoài, xuất bản thì hiện, nội dung độc bị vô hiệu', async () => {
  const b = trinhDuyet();
  await b('POST', '/api/admin/dang-nhap', { tenDangNhap: 'quantri', matKhau: 'mat-khau-dai-123' });
  assert.strictEqual((await b('GET', '/api/admin/bai-viet')).body.length, 3); // 3 bài mẫu
  const doc = '## Mở đầu\n\n<script>alert(1)</script> **đậm** [xấu](javascript:alert(1)) [tốt](la-so.html)';
  const tao = await b('POST', '/api/admin/bai-viet', { tieuDe: 'Sao Tử Vi ở cung Mệnh', noiDung: doc, trangThai: 'nhap' });
  assert.strictEqual(tao.status, 201);
  assert.strictEqual(tao.body.slug, 'sao-tu-vi-o-cung-menh');
  const pub = () => fetch(base + '/api/bai-viet').then(r => r.json());
  assert.ok(!(await pub()).some(x => x.slug === 'sao-tu-vi-o-cung-menh'));
  assert.strictEqual((await fetch(base + '/api/bai-viet/sao-tu-vi-o-cung-menh')).status, 404);
  const sua = await b('PUT', `/api/admin/bai-viet/${tao.body.id}`, { ...tao.body, trangThai: 'xuatban' });
  assert.strictEqual(sua.status, 200);
  assert.strictEqual((await pub())[0].slug, 'sao-tu-vi-o-cung-menh');
  const html = (await (await fetch(base + '/api/bai-viet/sao-tu-vi-o-cung-menh')).json()).html;
  assert.ok(!html.includes('<script>') && html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('href="javascript'));
  assert.match(html, /<h3>Mở đầu<\/h3>/); assert.match(html, /<b>đậm<\/b>/); assert.match(html, /<a href="la-so.html">tốt<\/a>/);
  assert.strictEqual((await b('POST', '/api/admin/bai-viet', { tieuDe: 'Sao tử vi ở cung Mệnh!', noiDung: 'x', trangThai: 'nhap' })).status, 400); // trùng đường dẫn
  assert.strictEqual((await b('DELETE', `/api/admin/bai-viet/${tao.body.id}`)).status, 200);
  assert.strictEqual((await pub()).length, 3);
});

test('luận giải: sửa một đoạn thì lá số dùng ngay, chữ được escape, khôi phục được', async () => {
  const b = trinhDuyet();
  await b('POST', '/api/admin/dang-nhap', { tenDangNhap: 'quantri', matKhau: 'mat-khau-dai-123' });
  const ds = (await b('GET', '/api/admin/luan-giai')).body;
  assert.strictEqual(ds.danhMuc.length, 154);
  assert.strictEqual((await b('PUT', '/api/admin/luan-giai', { khoa: 'khong.co', noiDung: 'x' })).status, 400);
  assert.strictEqual((await b('PUT', '/api/admin/luan-giai', { khoa: 'cung.Mệnh', noiDung: 'Cung quan trọng nhất <img src=x onerror=alert(1)>' })).status, 200);
  const laSo = () => fetch(base + '/api/la-so', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ngay: 1, thang: 1, nam: 2000, gio: 1, gioiTinh: 'nam' }) }).then(r => r.json());
  let menh = (await laSo()).luanGiai[0].html;
  assert.match(menh, /Cung quan trọng nhất &lt;img/);
  assert.ok(!menh.includes('<img'));
  assert.deepStrictEqual(Object.keys(await (await fetch(base + '/api/luan-giai/ghi-de')).json()), ['cung.Mệnh']);
  await b('PUT', '/api/admin/luan-giai', { khoa: 'cung.Mệnh', noiDung: null });
  menh = (await laSo()).luanGiai[0].html;
  assert.match(menh, /Nói về bản thân/);
});

test('người dùng: biên tập viên không quản lý người dùng; không tự khóa, không xóa admin cuối; khóa thì mất phiên', async () => {
  const ad = trinhDuyet();
  const me = (await ad('POST', '/api/admin/dang-nhap', { tenDangNhap: 'quantri', matKhau: 'mat-khau-dai-123' })).body;
  assert.strictEqual((await ad('POST', '/api/admin/nguoi-dung', { tenDangNhap: 'bt', tenHienThi: 'X', vaiTro: 'bientap', matKhau: '12345678' })).status, 400); // tên quá ngắn
  assert.strictEqual((await ad('POST', '/api/admin/nguoi-dung', { tenDangNhap: 'bientap1', tenHienThi: 'Biên tập 1', vaiTro: 'bientap', matKhau: 'ngan' })).status, 400); // mật khẩu ngắn
  const bt = (await ad('POST', '/api/admin/nguoi-dung', { tenDangNhap: 'bientap1', tenHienThi: 'Biên tập 1', vaiTro: 'bientap', matKhau: 'bien-tap-123' })).body;
  assert.strictEqual(bt.vaiTro, 'bientap');

  const b = trinhDuyet();
  await b('POST', '/api/admin/dang-nhap', { tenDangNhap: 'bientap1', matKhau: 'bien-tap-123' });
  assert.strictEqual((await b('GET', '/api/admin/nguoi-dung')).status, 403);
  assert.strictEqual((await b('GET', '/api/admin/bai-viet')).status, 200);

  assert.strictEqual((await ad('PUT', `/api/admin/nguoi-dung/${me.id}`, { vaiTro: 'bientap' })).status, 400);
  assert.strictEqual((await ad('PUT', `/api/admin/nguoi-dung/${me.id}`, { khoa: true })).status, 400);
  assert.strictEqual((await ad('DELETE', `/api/admin/nguoi-dung/${me.id}`)).status, 400);

  assert.strictEqual((await ad('PUT', `/api/admin/nguoi-dung/${bt.id}`, { khoa: true })).status, 200);
  assert.strictEqual((await b('GET', '/api/admin/bai-viet')).status, 401); // phiên của người bị khóa mất hiệu lực
  assert.strictEqual((await b('POST', '/api/admin/dang-nhap', { tenDangNhap: 'bientap1', matKhau: 'bien-tap-123' })).status, 403);
  assert.strictEqual((await ad('DELETE', `/api/admin/nguoi-dung/${bt.id}`)).status, 200);
  assert.strictEqual((await ad('GET', '/api/admin/nguoi-dung')).body.length, 1);
});

test('đổi mật khẩu, và chặn đoán mật khẩu sau 5 lần sai', async () => {
  const ad = trinhDuyet();
  await ad('POST', '/api/admin/dang-nhap', { tenDangNhap: 'quantri', matKhau: 'mat-khau-dai-123' });
  assert.strictEqual((await ad('POST', '/api/admin/doi-mat-khau', { matKhauCu: 'sai', matKhauMoi: 'mat-khau-moi-456' })).status, 400);
  assert.strictEqual((await ad('POST', '/api/admin/doi-mat-khau', { matKhauCu: 'mat-khau-dai-123', matKhauMoi: 'mat-khau-moi-456' })).status, 200);
  assert.strictEqual((await ad('GET', '/api/admin/toi')).status, 200); // vẫn đăng nhập trên máy đang dùng

  const k = trinhDuyet();
  for (let i = 0; i < 5; i++) await k('POST', '/api/admin/dang-nhap', { tenDangNhap: 'quantri', matKhau: 'doan-' + i });
  const chan = await k('POST', '/api/admin/dang-nhap', { tenDangNhap: 'quantri', matKhau: 'mat-khau-moi-456' });
  assert.strictEqual(chan.status, 429);
  assert.match(chan.body.error, /Thử lại sau/);
});
