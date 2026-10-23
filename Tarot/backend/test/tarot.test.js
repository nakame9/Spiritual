// Kiểm tra bộ bài và API Tarot: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const Tarot = require('../../frontend/js/bo-bai.js');
const app = require('../server.js');

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => server.close());

test('bộ bài đủ 78 lá: 22 Ẩn Chính, mỗi bộ 14 lá, đủ ý nghĩa xuôi và ngược', () => {
  assert.strictEqual(Tarot.BO_BAI.length, 78);
  assert.ok(Tarot.BO_BAI.every((l, i) => l.id === i));
  assert.strictEqual(Tarot.BO_BAI.filter(l => l.nhom === 'anChinh').length, 22);
  for (const bo of ['gay', 'coc', 'kiem', 'tien']) assert.strictEqual(Tarot.BO_BAI.filter(l => l.bo === bo).length, 14);
  assert.strictEqual(new Set(Tarot.BO_BAI.map(l => l.ten)).size, 78);
  for (const l of Tarot.BO_BAI) for (const m of [l.xuoi, l.nguoc]) assert.ok(m.tuKhoa.length > 5 && m.y.length > 20, l.ten);
  assert.strictEqual(Tarot.BO_BAI[0].ten, 'Kẻ Khờ'); assert.strictEqual(Tarot.BO_BAI[21].tenEn, 'The World');
  assert.strictEqual(Tarot.BO_BAI[22].tenEn, 'Ace of Wands'); assert.strictEqual(Tarot.BO_BAI[77].tenEn, 'King of Pentacles');
});

test('xáo bài ra đúng một hoán vị; tắt lá ngược thì không có lá ngược; mỗi lá có cơ hội lên đầu', () => {
  const x = Tarot.xaoBai(false);
  assert.deepStrictEqual(x.map(c => c.id).sort((a, b) => a - b), [...Array(78).keys()]);
  assert.ok(x.every(c => !c.nguoc));
  const dau = new Set(); let nguoc = 0;
  for (let i = 0; i < 4000; i++) { const y = Tarot.xaoBai(); dau.add(y[0].id); nguoc += y[0].nguoc; }
  assert.strictEqual(dau.size, 78);
  assert.ok(nguoc > 1700 && nguoc < 2300, `tỉ lệ ngược ${nguoc}/4000`);
});

test('đọc bài: đúng vị trí, ý nghĩa theo chiều lá, có tổng quan', () => {
  const r = Tarot.docBai('3la', [{ id: 19, nguoc: false }, { id: 18, nguoc: true }, { id: 37, nguoc: false }]);
  assert.deepStrictEqual(r.la.map(l => l.viTri), ['Quá khứ', 'Hiện tại', 'Tương lai']);
  assert.strictEqual(r.la[1].y, Tarot.BO_BAI[18].nguoc.y);
  assert.match(r.tongQuan.join(' '), /2\/3 lá Ẩn Chính/);
  assert.match(r.tongQuan.join(' '), /1 lá ngược/);
});

test('API rút bài: đúng số lá, không trùng, từ chối dữ liệu sai', async () => {
  const post = body => fetch(base + '/api/rut-bai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const r = await (await post({ kieu: 'tinhcam', cauHoi: ' Người ấy nghĩ gì? ', nguoc: false })).json();
  assert.strictEqual(r.la.length, 3);
  assert.strictEqual(new Set(r.la.map(l => l.id)).size, 3);
  assert.deepStrictEqual(r.la.map(l => l.viTri), ['Bạn', 'Người ấy', 'Mối quan hệ']);
  assert.ok(r.la.every(l => !l.nguoc));
  assert.strictEqual(r.cauHoi, 'Người ấy nghĩ gì?');
  assert.strictEqual((await (await post({ kieu: '1la' })).json()).la.length, 1);
  for (const body of [{ kieu: '10la' }, { nguoc: 'co' }, { cauHoi: 'x'.repeat(301) }]) assert.strictEqual((await post(body)).status, 400, JSON.stringify(body));
});

test('API tra bài và phục vụ trang', async () => {
  assert.strictEqual((await (await fetch(base + '/api/bo-bai')).json()).length, 78);
  assert.strictEqual((await (await fetch(base + '/api/la-bai/0')).json()).ten, 'Kẻ Khờ');
  assert.strictEqual((await fetch(base + '/api/la-bai/78')).status, 404);
  assert.strictEqual((await fetch(base + '/api/la-bai/abc')).status, 404);
  assert.deepStrictEqual(Object.keys(await (await fetch(base + '/api/kieu-trai')).json()), ['1la', '3la', 'tinhcam']);
  const home = await fetch(base + '/');
  assert.strictEqual(home.status, 200);
  assert.match(await home.text(), /Xem bài Tarot/);
  assert.strictEqual((await fetch(base + '/js/bo-bai.js')).status, 200);
});
