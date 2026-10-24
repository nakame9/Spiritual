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
  for (const n of gap) { const c = S.SO_CHU_DAO[n]; assert.ok(c.tongQuan && c.diemManh.length === 4 && c.diemYeu.length === 4 && c.tinhYeu && c.giaoTiep && c.camXuc && c.suNghiep && c.lamViec && c.nghe.length === 5 && c.baiHoc && c.cauHoi.length === 3 && c.loiKhuyen, n); }
});

test('cách tính từng bước dừng đúng chỗ', () => {
  assert.deepStrictEqual(S.buocSoChuDao(15, 8, 1990).slice(1), ['Cộng tất cả các chữ số: 1 + 5 + 8 + 1 + 9 + 9 + 0 = 33.', '33 lớn hơn 11 nên cộng tiếp các chữ số: 3 + 3 = 6.', 'Dừng ở 6 vì kết quả đã nằm trong khoảng 2 đến 11.']);
  assert.match(S.buocSoChuDao(2, 1, 1990).at(-1), /22\/4/);
  assert.match(S.buocSoChuDao(9, 1, 1990).at(-1), /Dừng ở 11/);
});

test('năm cá nhân theo hai cách tính', () => {
  const h = { y: 2026, m: 10, d: 24 };
  assert.strictEqual(S.tinh({ d: 15, m: 8, y: 1990 }, h, '', 'sinhNhat').namCaNhan.nam, 2026); // đã qua sinh nhật
  const truoc = S.tinh({ d: 15, m: 12, y: 1990 }, h, '', 'sinhNhat'), dl = S.tinh({ d: 15, m: 12, y: 1990 }, h);
  assert.deepStrictEqual([truoc.namCaNhan.nam, truoc.namCaNhan.so, truoc.chuKy9[0].nam], [2025, 9, 2025]);
  assert.deepStrictEqual([dl.namCaNhan.nam, dl.namCaNhan.so, dl.namCaNhan.truongPhai], [2026, 1, 'duongLich']);
  assert.match(dl.namCaNhan.cachTinh, /6 \+ 3 \+ 10 = 19, rút gọn 1 \+ 9 = 10, rút gọn 1 \+ 0 = 1\./);
});

test('bốn đỉnh cao', () => {
  const r = S.dinhCao(15, 8, 1990, { y: 2026, m: 10, d: 24 }); // ngày 6, tháng 8, năm 1; số chủ đạo 6
  assert.deepStrictEqual(r.dinh.map(x => [x.so, x.tuoi, x.nam, x.trangThai]), [[5, 30, 2020, 'qua'], [7, 39, 2029, 'toi'], [3, 48, 2038, 'sau'], [9, 57, 2047, 'sau']]);
  assert.deepStrictEqual(S.dinhCao(9, 1, 1990, { y: 2026, m: 1, d: 1 }).dinh.map(x => x.tuoi), [34, 43, 52, 61]); // số 11 tính là 2
  assert.deepStrictEqual(S.dinhCao(9, 1, 1991, { y: 2026, m: 1, d: 1 }).dinh.map(x => x.so), [1, 11, 3, 3]); // ngày 9 + năm 2 = 11 được giữ
  for (let t = Date.UTC(1900, 0, 1); t < Date.UTC(2100, 0, 1); t += 7 * 864e5) {
    const x = new Date(t); for (const d of S.dinhCao(x.getUTCDate(), x.getUTCMonth() + 1, x.getUTCFullYear(), { y: 2026, m: 1, d: 1 }).dinh) assert.ok(S.DINH[d.so], d.so);
  }
});

test('so sánh hai số chủ đạo: đối xứng, theo lưới 3 × 3', () => {
  const muc = (a, b) => [S.tuongHop(a, b).muc, S.tuongHop(a, b).phanTram];
  assert.deepStrictEqual(muc(6, 9), ['Hợp tự nhiên', 85]); // cùng hàng 3-6-9
  assert.deepStrictEqual(muc(6, 6), ['Đồng điệu', 75]);
  assert.deepStrictEqual(muc(2, 3), ['Bổ trợ', 70]); // cùng mũi tên 1-2-3
  assert.deepStrictEqual(muc(3, 4), ['Cần dung hòa', 55]);
  assert.deepStrictEqual(muc(11, 2), ['Đồng điệu', 75]);
  assert.deepStrictEqual(muc(22, 7), ['Hợp tự nhiên', 85]);
  const cac = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22];
  for (const a of cac) for (const b of cac) { const r = S.tuongHop(a, b); assert.strictEqual(r.phanTram, S.tuongHop(b, a).phanTram); assert.ok(r.moTa.length > 60 && r.loiKhuyen, `${a}-${b}`); }
  assert.strictEqual(S.tuongHop(1, 5), null);
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
  assert.strictEqual((await get('/api/so-chu-dao?ngaySinh=1990-12-15&homNay=2026-10-24&truongPhai=sinhNhat'))[1].namCaNhan.nam, 2025);
  assert.strictEqual((await get('/api/so-chu-dao?ngaySinh=1990-12-15&truongPhai=abc'))[0], 400);
  assert.strictEqual((await get('/api/so-chu-dao?ngaySinh=1990-12-15&truongPhai=toString'))[0], 400);
  const [s2, th] = await get('/api/tuong-hop?a=6&b=9');
  assert.strictEqual(s2, 200); assert.strictEqual(th.phanTram, 85);
  for (const q of ['a=1&b=9', 'a=6', 'a=6&b=x', 'a=06&b=9']) assert.strictEqual((await get('/api/tuong-hop?' + q))[0], 400, q);
  for (const p of ['/', '/tuong-hop.html', '/js/so-hoc.js', '/js/trang-so-hoc.js', '/js/trang-tuong-hop.js']) assert.strictEqual((await fetch(base + p)).status, 200, p);
});
