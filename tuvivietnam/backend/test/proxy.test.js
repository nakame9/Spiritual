// Proxy tin cậy: giả IP bằng X-Forwarded-For không vượt được chặn đoán mật khẩu khi không có proxy. npm test
const fs = require('fs'), os = require('os'), path = require('path');
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-proxy-'));
process.env.ADMIN_USER = 'quantri';
process.env.ADMIN_PASSWORD = 'mat-khau-dai-123';
process.env.TRUST_PROXY = 'false'; // như máy chủ mở thẳng ra Internet, không có proxy đứng trước
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { proxyTinCay } = require('../lib/xacthuc');
const app = require('../server.js');

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => { server.close(); fs.rmSync(process.env.DATA_DIR, { recursive: true, force: true }); });

test('TRUST_PROXY: mặc định chỉ tin proxy cùng máy, trên nền tảng hosting tin 1 lớp; đọc đúng cú pháp Express', () => {
  assert.strictEqual(proxyTinCay({}), 'loopback');
  for (const k of ['RENDER', 'RAILWAY_ENVIRONMENT', 'DYNO', 'FLY_APP_NAME']) assert.strictEqual(proxyTinCay({ [k]: 'x' }), 1, k);
  assert.strictEqual(proxyTinCay({ TRUST_PROXY: '2', RENDER: 'true' }), 2);
  assert.strictEqual(proxyTinCay({ TRUST_PROXY: 'false', RENDER: 'true' }), false);
  assert.strictEqual(proxyTinCay({ TRUST_PROXY: 'true' }), true);
  assert.strictEqual(proxyTinCay({ TRUST_PROXY: 'loopback, uniquelocal' }), 'loopback, uniquelocal');
});

test('đổi X-Forwarded-For mỗi lần vẫn bị chặn sau 5 lần sai', async () => {
  const dangNhap = (ip, matKhau) => fetch(base + '/api/admin/dang-nhap', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': ip }, body: JSON.stringify({ tenDangNhap: 'quantri', matKhau }) });
  for (let i = 0; i < 5; i++) assert.strictEqual((await dangNhap(`203.0.113.${i}`, 'doan-' + i)).status, 401);
  assert.strictEqual((await dangNhap('203.0.113.99', 'mat-khau-dai-123')).status, 429);
});
