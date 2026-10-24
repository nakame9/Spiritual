// Kiểm tra cách xem ngày và API: npm test. Ngày mẫu đối chiếu với lịch vạn niên đã công bố.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const X = require('../../frontend/js/lich-ngay.js');
const app = require('../server.js');

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => server.close());

test('ngày mẫu khớp lịch vạn niên', () => {
  const a = X.xemNgay(1, 1, 2025); // ngaydep.com, baohatinh.vn
  assert.deepStrictEqual([a.am.chu, a.canChi.ngay, a.canChi.thang, a.canChi.nam], ['2/12/2024', 'Canh Ngọ', 'Đinh Sửu', 'Giáp Thìn']);
  assert.deepStrictEqual([a.hoangDao.than, a.hoangDao.tot, a.truc.ten, a.sao.ten, a.tietKhi.ten], ['Thiên Lao', false, 'Phá', 'Sâm', 'Đông chí']);
  assert.deepStrictEqual(a.gioHoangDao.map(g => g.chi), ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu']);
  assert.strictEqual(a.tuoiXung, 'Tý');
  const b = X.xemNgay(24, 8, 2026); // baohatinh.vn
  assert.deepStrictEqual([b.am.chu, b.canChi.thang, b.hoangDao.than, b.truc.ten, b.sao.ten, b.tietKhi.ten, b.huong.hyThan, b.huong.taiThan],
    ['12/7/2026', 'Bính Thân', 'Bạch Hổ', 'Khai', 'Tâm', 'Xử thử', 'Tây Bắc', 'Tây Nam']);
  assert.strictEqual(X.xemNgay(23, 8, 2026).tietKhi.batDau, true); // Xử thử bắt đầu 23/8/2026
});

test('trực lặp lại vào ngày giao tiết, 28 sao xoay vòng theo thứ', () => {
  // Lập đông 2026 rơi vào 7/11: trực ngày 7/11 trùng trực ngày 6/11
  assert.strictEqual(X.xemNgay(7, 11, 2026).truc.ten, X.xemNgay(6, 11, 2026).truc.ten);
  assert.notStrictEqual(X.xemNgay(8, 11, 2026).truc.ten, X.xemNgay(7, 11, 2026).truc.ten);
  assert.strictEqual(X.xemNgay(1, 1, 2025).sao.ten, X.xemNgay(29, 1, 2025).sao.ten);
});

test('ngày kỵ và tuổi', () => {
  const ds = X.lichThang(2026, 10);
  for (const r of ds) {
    const ten = r.ngayKy.map(k => k.ten);
    assert.strictEqual(ten.includes('Tam nương'), [3, 7, 13, 18, 22, 27].includes(r.am.d), r.duong.chu);
    assert.strictEqual(ten.includes('Nguyệt kỵ'), [5, 14, 23].includes(r.am.d), r.duong.chu);
    assert.ok(r.phanTram >= 0 && r.phanTram <= 100 && r.lyDo.length >= 3);
  }
  const t = X.xemNgay(1, 1, 2025, { namSinh: 1984 }); // ngày Ngọ, tuổi Tý: xung
  assert.strictEqual(t.tuoi.chi, 'Tý');
  assert.ok(t.lyDo.some(l => l.xau && /lục xung/.test(l.text)));
  assert.ok(X.xemNgay(1, 1, 2025).phanTram > t.phanTram);
});

test('chọn ngày theo việc chỉ lấy ngày hoàng đạo, không kỵ việc đó', () => {
  for (const viec of Object.keys(X.VIEC)) {
    const r = X.chonNgay(viec, { d: 1, m: 1, y: 2026 }, { d: 30, m: 6, y: 2026 }, 1990);
    assert.strictEqual(r.soNgay, 181);
    for (const n of r.ngay) assert.ok(n.hoangDao.tot && !n.ngayKy.length && !n.viec.ky && n.phanTram >= 55, `${viec} ${n.duong.chu}`);
    assert.ok(r.ngay.every((n, i) => !i || r.ngay[i - 1].phanTram >= n.phanTram));
  }
  assert.throws(() => X.chonNgay('cuoiHoi', { d: 1, m: 1, y: 2026 }, { d: 1, m: 1, y: 2027 }), /190/);
  assert.throws(() => X.chonNgay('abc', { d: 1, m: 1, y: 2026 }, { d: 2, m: 1, y: 2026 }));
});

test('API', async () => {
  const get = async u => { const r = await fetch(base + u); return [r.status, await r.json()]; };
  const [s, r] = await get('/api/ngay?ngay=2025-01-01&namSinh=1984&viec=cuoiHoi');
  assert.strictEqual(s, 200); assert.strictEqual(r.truc.ten, 'Phá'); assert.strictEqual(r.viec.ky, true);
  assert.strictEqual((await get('/api/thang?nam=2026&thang=2'))[1].length, 28);
  const [s2, c] = await get('/api/chon-ngay?viec=khaiTruong&tu=2026-11-01&den=2026-12-31');
  assert.strictEqual(s2, 200); assert.strictEqual(c.soNgay, 61);
  for (const u of ['/api/ngay?ngay=2026-02-30', '/api/ngay', '/api/ngay?ngay=2026-01-01&namSinh=90', '/api/ngay?ngay=2026-01-01&viec=toString',
    '/api/thang?nam=2026&thang=13', '/api/chon-ngay?viec=cuoiHoi&tu=2026-01-01&den=2027-06-01', '/api/chon-ngay?tu=2026-01-01&den=2026-02-01'])
    assert.strictEqual((await get(u))[0], 400, u);
  assert.strictEqual(Object.keys((await get('/api/viec'))[1]).length, 6);
  for (const p of ['/', '/chon-ngay.html', '/js/lich-ngay.js', '/js/trang-xem-ngay.js', '/shared/site.css', '/tuvivietnam/frontend/js/tuvi.js', '/tuvivietnam/frontend/js/congiap.js'])
    assert.strictEqual((await fetch(base + p)).status, 200, p);
});
