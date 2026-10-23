// Kiểm tra cách tính thần số học và API: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const S = require('../../frontend/js/so-hoc.js');
const app = require('../server.js');

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => server.close());

test('số chủ đạo: cộng mọi chữ số, giữ 10, 11, 22/4; chỉ ra 2–11 và 22', () => {
  assert.deepStrictEqual(S.soChuDao(15, 8, 1990), { so: 6, tong: 33 });
  assert.deepStrictEqual(S.soChuDao(1, 1, 2000), { so: 4, tong: 4 });
  assert.deepStrictEqual(S.soChuDao(9, 9, 1999), { so: 10, tong: 46 });
  assert.deepStrictEqual(S.soChuDao(9, 1, 1990), { so: 11, tong: 29 });
  assert.deepStrictEqual(S.soChuDao(2, 1, 1990), { so: 22, tong: 22 });
  const gap = new Set();
  for (let t = Date.UTC(1900, 0, 1); t < Date.UTC(2100, 0, 1); t += 864e5) { const x = new Date(t); gap.add(S.soChuDao(x.getUTCDate(), x.getUTCMonth() + 1, x.getUTCFullYear()).so); }
  assert.deepStrictEqual([...gap].sort((a, b) => a - b), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22]);
  for (const n of gap) { const c = S.SO_CHU_DAO[n]; assert.ok(c.tongQuan && c.diemManh.length === 4 && c.diemYeu.length === 4 && c.tinhYeu && c.suNghiep && c.nghe.length === 5 && c.loiKhuyen, n); }
});

test('chỉ số ngày sinh, thái độ, năm/tháng/ngày cá nhân', () => {
  assert.strictEqual(S.soNgaySinh(29), 11); assert.strictEqual(S.soNgaySinh(22), 22); assert.strictEqual(S.soNgaySinh(19), 1);
  assert.strictEqual(S.soThaiDo(15, 8), 5);
  assert.strictEqual(S.namCaNhan(15, 8, 2026), 6); // 1+5+8+2+0+2+6 = 24 → 6
  assert.strictEqual(S.thangCaNhan(15, 8, 2026, 10), 7);
  assert.strictEqual(S.ngayCaNhan(15, 8, 2026, 10, 24), 4);
  for (let n = 1; n <= 9; n++) assert.ok(S.CHU_KY[n].tinhCam[0] >= 1 && S.CHU_KY[n].suNghiep[0] <= 5, n);
});

test('chỉ số theo tên: bỏ dấu tiếng Việt, Y là nguyên âm', () => {
  // L(3)+E(5) | T(2)+H(8)+I(9) | T(2)+H(8)+U(3) = 40 → 4; nguyên âm E+I+U = 17 → 8; phụ âm 23 → 5
  assert.deepStrictEqual(S.soTheoTen('Lê Thị Thu'), { suMenh: 4, linhHon: 8, nhanCach: 5 });
  assert.deepStrictEqual(S.soTheoTen('LE THI THU'), S.soTheoTen('Lê Thị Thu'));
  assert.strictEqual(S.soTheoTen('Đặng').suMenh, S.soTheoTen('Dang').suMenh);
  assert.strictEqual(S.soTheoTen('123'), null);
});

test('biểu đồ ngày sinh và mũi tên', () => {
  const b = S.bieuDo(23, 8, 2026);
  assert.deepStrictEqual(b.dem.slice(1), [0, 3, 1, 0, 0, 1, 0, 1, 0]);
  assert.deepStrictEqual(b.muiTenTrong.map(x => x.so.join('')), ['147', '159']);
  assert.deepStrictEqual(b.soThieu, [1, 4, 5, 7, 9]);
  assert.deepStrictEqual(S.bieuDo(15, 8, 1990).muiTen.map(x => x.so.join('')), ['159']);
});

test('API', async () => {
  const get = async u => { const r = await fetch(base + u); return [r.status, await r.json()]; };
  const [s, r] = await get('/api/so-chu-dao?ngaySinh=1990-08-15&homNay=2026-10-24&ten=L%C3%AA%20Th%E1%BB%8B%20Thu');
  assert.strictEqual(s, 200); assert.strictEqual(r.soChuDao.so, 6); assert.strictEqual(r.namCaNhan.so, 6); assert.strictEqual(r.ten.suMenh.so, 4);
  assert.strictEqual((await get('/api/so-chu-dao?ngaySinh=1990-02-30'))[0], 400);
  assert.strictEqual((await get('/api/so-chu-dao'))[0], 400);
  assert.strictEqual((await get('/api/y-nghia/22'))[1].hien, '22/4');
  assert.strictEqual((await get('/api/y-nghia/1'))[0], 404);
  assert.strictEqual(Object.keys((await get('/api/chu-ky'))[1]).length, 9);
  for (const p of ['/', '/js/so-hoc.js', '/js/trang-so-hoc.js']) assert.strictEqual((await fetch(base + p)).status, 200, p);
});
