// Kiểm tra API: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../server.js');

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => server.close());

const post = (body, raw) => fetch(base + '/api/la-so', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: raw ?? JSON.stringify(body),
});

test('lập lá số hợp lệ trả về lá số và luận giải 12 cung', async () => {
  const r = await post({ ngay: 30, thang: 8, nam: 2008, gio: 4, gioiTinh: 'nam', ten: 'Nguyễn Văn Ba' });
  assert.strictEqual(r.status, 200);
  const j = await r.json();
  assert.deepStrictEqual(j.laSo.am, { ngay: 30, thang: 7, nam: 2008, nhuan: false });
  assert.strictEqual(j.laSo.canChi.nam, 'Mậu Tý');
  assert.strictEqual(j.luanGiai.length, 12);
  assert.strictEqual(j.luanGiai[0].cung, 'Mệnh');
  assert.match(j.luanGiai[0].html, /<h3>Cung Mệnh/);
});

test('âm lịch tháng nhuận không tồn tại bị từ chối', async () => {
  const r = await post({ ngay: 1, thang: 3, nam: 2024, gio: 1, gioiTinh: 'nu', amLich: true, nhuan: true });
  assert.strictEqual(r.status, 400);
  assert.match((await r.json()).error, /nhuận/);
});

test('thiếu hoặc sai dữ liệu trả lỗi 400 bằng tiếng Việt', async () => {
  for (const body of [{}, { ngay: 31, thang: 2, nam: 2001, gio: 1, gioiTinh: 'nam' }, { ngay: 1, thang: 1, nam: 1800, gio: 1, gioiTinh: 'nam' }, { ngay: 1, thang: 1, nam: 2000, gio: 13, gioiTinh: 'nam' }]) {
    const r = await post(body);
    assert.strictEqual(r.status, 400, JSON.stringify(body));
    assert.ok((await r.json()).error);
  }
  const hong = await post(null, '{không phải json');
  assert.strictEqual(hong.status, 400);
});

test('phục vụ frontend và API không tồn tại', async () => {
  const home = await fetch(base + '/');
  assert.strictEqual(home.status, 200);
  assert.match(await home.text(), /Lá Số Tử Vi/);
  assert.strictEqual((await fetch(base + '/js/tuvi.js')).status, 200);
  assert.strictEqual((await fetch(base + '/api/khong-co')).status, 404);
  assert.deepStrictEqual(await (await fetch(base + '/api/health')).json(), { ok: true });
});
