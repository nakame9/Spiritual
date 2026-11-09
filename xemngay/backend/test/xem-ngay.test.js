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

test('ngũ hành, sao tốt xấu, giờ cần tránh, thần sát', () => {
  const a = X.xemNgay(1, 1, 2025); // Canh Ngọ: Lộ Bàng Thổ
  assert.strictEqual(a.nguHanh.napAm, 'Lộ Bàng Thổ');
  assert.strictEqual(a.gioTranh.length, 6);
  assert.ok(a.saoXau.some(x => /Thiên Lao/.test(x)));
  const b = X.xemNgay(1, 1, 2025, { namSinh: 1990 }); // tuổi Ngọ: giờ Tý xung, mà Tý là giờ hoàng đạo
  assert.ok(b.gioTranh.some(g => g.chi === 'Tý' && /xung tuổi Ngọ/.test(g.vi)));
  // Mỗi thần sát xuất hiện đúng theo bảng: trong một tháng âm, ngày có chi (hoặc can) đúng bảng đều có thần sát đó
  for (const r of X.lichThang(2026, 5)) for (const t of X.THAN_SAT) {
    const k = t[5][r.am.m - 1], co = k[0] === 'c' ? r.canChi.ngay.startsWith(require('../../../tuvivietnam/frontend/js/tuvi.js').CAN[+k.slice(1)] + ' ')
      : r.canChi.ngay.endsWith(' ' + require('../../../tuvivietnam/frontend/js/tuvi.js').CHI[+k.slice(1)]);
    assert.strictEqual(r.thanSat.some(x => x.ten === t[0]), co, `${r.duong.chu} ${t[0]}`);
  }
});

test('đánh giá 7 việc và phân loại khi chọn ngày', () => {
  const v = X.danhGiaViec(10, 11, 2026);
  assert.deepStrictEqual(v.map(x => x.ma), ['khaiTruong', 'cuoiHoi', 'dongTho', 'nhapTrach', 'xuatHanh', 'kyKet', 'khoiCong']);
  assert.ok(v.every(x => ['Nên làm', 'Cân nhắc', 'Không nên'].includes(x.nhan) && x.loi.length > 20));
  const c = X.chonNgay('cuoiHoi', { d: 1, m: 11, y: 2026 }, { d: 31, m: 12, y: 2026 }, 1990);
  assert.strictEqual(c.tatCa.length, 61);
  assert.strictEqual(c.soNgayTot + c.soNgayVua + c.soNgayLuuY, 61);
  assert.ok(c.tatCa.every((r, i) => !i || r.duong.d !== c.tatCa[i - 1].duong.d || r.duong.m !== c.tatCa[i - 1].duong.m)); // theo thứ tự lịch
  assert.ok(c.tatCa.filter(r => r.loai === 'luuY').every(r => r.viec.ky || r.ngayKy.length || r.phanTram < 40));
  // Thụ Tử kỵ mọi việc lớn
  const tt = X.lichThang(2026, 11).find(r => r.thanSat.some(t => t.ten === 'Thụ Tử'));
  assert.ok(X.danhGiaViec(tt.duong.d, tt.duong.m, tt.duong.y).every(x => x.nhan === 'Không nên'));
});

test('múi giờ: lịch âm tính lại theo múi giờ đã chọn', () => {
  assert.strictEqual(X.xemNgay(20, 1, 2026).am.chu, '2/12/2025');
  assert.strictEqual(X.xemNgay(20, 1, 2026, { tz: -8 }).am.chu, '3/12/2025');
  assert.strictEqual(X.xemNgay(20, 1, 2026, { tz: 99 }).tz, 7); // múi giờ lạ thì về UTC+7
});

test('API', async () => {
  const get = async u => { const r = await fetch(base + u); return [r.status, await r.json()]; };
  const [s, r] = await get('/api/ngay?ngay=2025-01-01&namSinh=1984&viec=cuoiHoi');
  assert.strictEqual(s, 200); assert.strictEqual(r.truc.ten, 'Phá'); assert.strictEqual(r.viec.ky, true);
  assert.strictEqual((await get('/api/thang?nam=2026&thang=2'))[1].length, 28);
  const [s2, c] = await get('/api/chon-ngay?viec=khaiTruong&tu=2026-11-01&den=2026-12-31');
  assert.strictEqual(s2, 200); assert.strictEqual(c.soNgay, 61); assert.strictEqual(c.tatCa.length, 61);
  assert.strictEqual((await get('/api/ngay?ngay=2026-01-20&tz=-8'))[1].am.chu, '3/12/2025');
  assert.strictEqual((await get('/api/viec-ngay?ngay=2026-11-10'))[1].length, 7);
  for (const u of ['/api/ngay?ngay=2026-02-30', '/api/ngay', '/api/ngay?ngay=2026-01-01&namSinh=90', '/api/ngay?ngay=2026-01-01&viec=toString',
    '/api/thang?nam=2026&thang=13', '/api/chon-ngay?viec=cuoiHoi&tu=2026-01-01&den=2027-06-01', '/api/chon-ngay?tu=2026-01-01&den=2026-02-01', '/api/ngay?ngay=2026-01-01&tz=5', '/api/viec-ngay'])
    assert.strictEqual((await get(u))[0], 400, u);
  assert.strictEqual(Object.keys((await get('/api/viec'))[1]).length, 7);
  for (const p of ['/', '/chon-ngay.html', '/js/lich-ngay.js', '/js/trang-xem-ngay.js', '/shared/site.css', '/tuvivietnam/frontend/js/tuvi.js', '/tuvivietnam/frontend/js/congiap.js'])
    assert.strictEqual((await fetch(base + p)).status, 200, p);
});
