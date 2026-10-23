// Kiểm tra dữ liệu 12 cung, thiên văn, luận giải và API: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const HD = require('../../frontend/js/cung-hoang-dao.js');
const TV = require('../../frontend/js/thien-van.js');
const LG = require('../../frontend/js/luan-giai.js');
const app = require('../server.js');

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => server.close());
const lech = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
const chu = o => typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(chu) : []; // mọi chuỗi chữ trong kết quả

test('12 cung đủ nội dung, không trùng, ngày nối liền nhau', () => {
  assert.strictEqual(HD.CUNG.length, 12);
  const texts = [];
  for (const c of HD.CUNG) {
    for (const k of ['tuKhoa', 'phongCach', 'tongQuan', 'giaoTiep', 'camXuc', 'matTrang', 'cungMoc']) assert.ok(c[k] && c[k].length > 15, `${c.ten}.${k}`);
    assert.strictEqual(c.diemManh.length, 5); assert.strictEqual(c.diemYeu.length, 5);
    assert.ok(c.tinhYeu.phongCach && c.tinhYeu.canGi && c.tinhYeu.luuY, c.ten);
    assert.ok(c.suNghiep.dacDiem && c.suNghiep.kyNang.length === 5 && c.suNghiep.nghe.length === 6 && c.suNghiep.moiTruong, c.ten);
    texts.push(c.tongQuan, c.matTrang, c.cungMoc, c.giaoTiep, c.camXuc, c.tinhYeu.phongCach, c.suNghiep.dacDiem);
  }
  assert.strictEqual(new Set(texts).size, texts.length);
  // Bốn nguyên tố, ba tính chất chia đều
  for (const k of Object.keys(HD.NGUYEN_TO)) assert.strictEqual(HD.CUNG.filter(c => c.nguyenTo === k).length, 3);
  for (const k of Object.keys(HD.TINH_CHAT)) assert.strictEqual(HD.CUNG.filter(c => c.tinhChat === k).length, 4);
  // Mỗi ngày trong năm thuộc đúng một cung theo bảng
  for (let i = 0; i < 366; i++) { const d = new Date(Date.UTC(2024, 0, 1 + i)); assert.ok(LG.cungTheoBang(d.getUTCMonth() + 1, d.getUTCDate()), d.toISOString()); }
});

test('vị trí hành tinh và cung Mọc khớp Swiss Ephemeris (sai dưới 0,01°)', () => {
  const REF = [
    ['1990-04-10T03:30:00Z', 21.028, 105.854, { matTroi: 20.0087, matTrang: 200.0972, thuy: 38.9042, kim: 333.8951, hoa: 321.9411, moc: 93.8303, tho: 294.8374, thienVuong: 279.5831, haiVuong: 284.5633, diemVuong: 227.1228, asc: 95.5133, mc: 356.1461 }],
    ['1968-07-15T14:05:00Z', 10.776, 106.701, { matTroi: 113.1183, matTrang: 2.7473, thuy: 92.8891, kim: 120.0564, hoa: 106.2126, moc: 154.9478, tho: 25.1179, thienVuong: 175.8939, haiVuong: 233.8703, diemVuong: 170.7019, asc: 338.1516, mc: 252.8763 }],
    ['1955-11-30T20:00:00Z', 59.9, 10.75, { matTroi: 247.8408, matTrang: 83.8417, thuy: 245.7445, kim: 270.8456, hoa: 211.146, moc: 151.022, tho: 235.4508, thienVuong: 122.1103, haiVuong: 209.374, diemVuong: 148.6128, asc: 136.5787, mc: 21.2805 }],
  ];
  for (const [iso, viDo, kinhDo, ref] of REF) {
    const t = new Date(iso), v = TV.viTriCacSao(t), tr = TV.truc(t, viDo, kinhDo);
    for (const k of Object.keys(TV.THIEN_THE)) assert.ok(lech(v[k].lon, ref[k]) < 0.01, `${iso} ${k}: ${v[k].lon} ≠ ${ref[k]}`);
    assert.ok(lech(tr.asc, ref.asc) < 0.01 && lech(tr.mc, ref.mc) < 0.01, `${iso} asc/mc`);
  }
});

test('giờ địa phương theo múi giờ có lịch sử: miền Nam 1968 là UTC+8, Hà Nội UTC+7, giờ mùa hè', () => {
  assert.strictEqual(TV.sangUTC(1968, 7, 15, 20, 5, 'Asia/Ho_Chi_Minh').toISOString(), '1968-07-15T12:05:00.000Z');
  assert.strictEqual(TV.sangUTC(1980, 7, 15, 20, 5, 'Asia/Ho_Chi_Minh').toISOString(), '1980-07-15T13:05:00.000Z');
  assert.strictEqual(TV.sangUTC(1968, 7, 15, 20, 5, 'Asia/Bangkok').toISOString(), '1968-07-15T13:05:00.000Z');
  assert.strictEqual(TV.sangUTC(2021, 7, 1, 9, 0, 'America/New_York').toISOString(), '2021-07-01T13:00:00.000Z');
});

test('sự kiện thiên văn: nghịch hành, giao cung, nhật nguyệt thực 2026', () => {
  const nh = TV.timNghichHanh('thuy', new Date('2024-01-01'), new Date('2025-01-01')).map(x => x.batDau.toISOString().slice(0, 10));
  assert.deepStrictEqual(nh, ['2023-12-13', '2024-04-01', '2024-08-05', '2024-11-26']);
  const xuan = TV.timGiaoCung('matTroi', new Date('2026-03-19'), new Date('2026-03-22'))[0];
  assert.strictEqual(xuan.cung, 0); assert.ok(Math.abs(xuan.t - new Date('2026-03-20T14:46Z')) < 3 * 60e3);
  assert.deepStrictEqual(TV.timThuc(new Date('2026-01-01'), new Date('2027-01-01')).map(x => `${x.loai}/${x.kieu}`), ['nhat/annular', 'nguyet/total', 'nhat/total', 'nguyet/partial']);
});

test('xác định cung: theo bảng, theo vị trí thật, ngày giao cung', () => {
  assert.strictEqual(LG.xacDinhCung({ y: 1990, m: 4, d: 10 }).cung.id, 'bach-duong');
  assert.strictEqual(LG.xacDinhCung({ y: 2000, m: 1, d: 1 }).cung.id, 'ma-ket');
  const giao = LG.xacDinhCung({ y: 2026, m: 3, d: 20 });
  assert.strictEqual(giao.giaoCung.truoc.id, 'song-ngu'); assert.strictEqual(giao.giaoCung.sau.id, 'bach-duong'); assert.strictEqual(giao.giaoCung.luc, '21:45');
  assert.strictEqual(LG.xacDinhCung({ y: 2026, m: 3, d: 20, h: 21, mi: 0 }).cung.id, 'song-ngu');
  assert.strictEqual(LG.xacDinhCung({ y: 2026, m: 3, d: 20, h: 22, mi: 0 }).cung.id, 'bach-duong');
});

test('tử vi: đủ 4 lĩnh vực, sao 1–5, cố định theo ngày, không lỗi ghép câu', () => {
  const bad = /undefined|NaN|\{|\}|\s\s/;
  for (let s = 0; s < 12; s++) {
    const n = LG.tuViNgay(s, 2026, 10, 24);
    assert.deepStrictEqual(n.linhVuc.map(x => x.ma), ['tinhYeu', 'congViec', 'taiChinh', 'sucKhoe']);
    assert.ok(n.linhVuc.every(x => x.sao >= 1 && x.sao <= 5 && x.loi.length > 20));
    assert.deepStrictEqual(LG.tuViNgay(s, 2026, 10, 24), n);
    for (const r of [n, LG.tuViTuan(s, 2026, 10, 24), LG.tuViThang(s, 2026, 11), LG.tuViNam(s, 2026)]) chu(r).forEach(x => assert.doesNotMatch(x, bad, `${s} ${r.loai}: ${x}`));
  }
  const t = LG.tuViTuan(7, 2026, 10, 24);
  assert.strictEqual(t.tu, '19/10/2026'); assert.strictEqual(t.den, '25/10/2026');
  assert.ok(t.nghichHanh.some(x => x.sao === 'Sao Thủy' && x.tu === '24/10/2026'));
  const nam = LG.tuViNam(7, 2026);
  assert.deepStrictEqual(nam.moc.map(x => x.cung), ['Cự Giải', 'Sư Tử']);
  assert.strictEqual(nam.tho[1].tu, '14/02');
});

test('tương hợp: đối xứng, trong khoảng, tam hợp cao hơn vuông góc', () => {
  for (let a = 0; a < 12; a++) for (let b = 0; b < 12; b++) {
    const x = LG.tuongHop(a, b), y = LG.tuongHop(b, a);
    assert.deepStrictEqual(x.diem, y.diem);
    for (const v of Object.values(x.diem)) assert.ok(v >= 35 && v <= 97);
  }
  assert.ok(LG.tuongHop(0, 4).diem.tinhYeu > LG.tuongHop(0, 3).diem.tinhYeu); // Bạch Dương: Sư Tử hơn Cự Giải
  assert.match(LG.tuongHop(0, 6).khoang.ten, /Xung đối/);
});

test('bản đồ sao: nhà Whole Sign, góc chiếu, Big Three; không giờ sinh thì không có cung Mọc', () => {
  const b = LG.banDoSao({ y: 1990, m: 4, d: 10, h: 10, mi: 30, tz: 'Asia/Bangkok', viDo: 21.028, kinhDo: 105.854 });
  assert.strictEqual(b.cungMoc.cung, 'cu-giai');
  assert.strictEqual(b.sao.find(s => s.ma === 'matTroi').nha, 10);
  assert.ok(b.gocChieu.some(g => g.a === 'matTroi' && g.b === 'matTrang' && g.loai === 'xung'));
  assert.strictEqual(b.bigThree.matTroi.cung, 'bach-duong'); assert.strictEqual(b.bigThree.matTrang.cung, 'thien-binh');
  assert.ok(b.bigThree.ketHop.length >= 2);
  const k = LG.banDoSao({ y: 1990, m: 4, d: 10, coGio: false, tz: 'Asia/Bangkok' });
  assert.strictEqual(k.cungMoc, null); assert.strictEqual(k.bigThree.cungMoc, null);
  assert.ok(k.sao.every(s => s.nha === null));
});

test('API', async () => {
  const get = async u => { const r = await fetch(base + u); return [r.status, await r.json()]; };
  assert.strictEqual((await get('/api/cung'))[1].length, 12);
  assert.strictEqual((await get('/api/cung/bo-cap'))[1].ten, 'Bọ Cạp');
  assert.strictEqual((await get('/api/cung/khong-co'))[0], 404);
  assert.strictEqual((await get('/api/xac-dinh?ngay=1990-04-10'))[1].cung, 'bach-duong');
  assert.strictEqual((await get('/api/xac-dinh?ngay=2026-03-20'))[1].giaoCung.luc, '21:45');
  assert.strictEqual((await get('/api/xac-dinh?ngay=1990-02-30'))[0], 400);
  assert.strictEqual((await get('/api/tu-vi/bo-cap?ky=tuan&ngay=2026-10-24'))[1].tu, '19/10/2026');
  assert.strictEqual((await get('/api/tu-vi/bo-cap'))[1].loai, 'ngay');
  assert.strictEqual((await get('/api/tu-vi/bo-cap?ky=gio'))[0], 400);
  assert.strictEqual((await get('/api/tuong-hop?a=bach-duong&b=thien-binh'))[1].diem.tong, LG.tuongHop(0, 6).diem.tong);
  assert.strictEqual((await get('/api/tuong-hop?a=bach-duong'))[0], 400);
  const post = body => fetch(base + '/api/ban-do-sao', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const bd = await (await post({ ngay: '1990-04-10', gio: '10:30', tz: 'Asia/Bangkok', viDo: 21.028, kinhDo: 105.854 })).json();
  assert.strictEqual(bd.cungMoc.cung, 'cu-giai');
  for (const body of [{ ngay: '1990-04-10', tz: 'Sao/Hoa' }, { ngay: '1990-04-10', gio: '25:00' }, { ngay: '1990-04-10', viDo: 95, kinhDo: 10 }]) assert.strictEqual((await post(body)).status, 400, JSON.stringify(body));
  assert.strictEqual((await get('/api/dia-diem'))[1].VIET_NAM.length > 60, true);
  for (const p of ['/', '/cung.html', '/tu-vi.html', '/tuong-hop.html', '/ban-do-sao.html', '/js/vendor/astronomy.browser.min.js']) assert.strictEqual((await fetch(base + p)).status, 200, p);
});
