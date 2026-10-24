// Trang chủ kết hợp tử vi, cung hoàng đạo, số chủ đạo: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const TongHop = require('../../frontend/js/tong-hop.js');
const app = require('../server.js');

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => server.close());
const HOM_NAY = { y: 2026, m: 10, d: 24 };

test('hồ sơ ba hệ đúng: Canh Ngọ, Sư Tử, số chủ đạo 6', () => {
  const r = TongHop.duDoan({ ngay: 15, thang: 8, nam: 1990, gio: 5, namGioi: true }, HOM_NAY);
  assert.strictEqual(r.hoSo.tuVi.canChi, 'Canh Ngọ');
  assert.strictEqual(r.hoSo.hoangDao.id, 'su-tu');
  assert.strictEqual(r.hoSo.soHoc.so, 6);
  assert.strictEqual(r.hoSo.soHoc.namCaNhan.so, 6);
  assert.strictEqual(r.ngaySinh.am, '25/6/1990');
});

test('dự đoán: 3 mốc × 3 mặt, mỗi mặt có điểm 1–5 từ đủ 3 hệ và điểm chung là trung bình', () => {
  const r = TongHop.duDoan({ ngay: 15, thang: 8, nam: 1990, gio: 5, namGioi: true }, HOM_NAY);
  for (const k of ['ngay', 'thang', 'nam']) {
    assert.deepStrictEqual(r.ky[k].linhVuc.map(x => x.ma), ['mayMan', 'tinhCam', 'suNghiep']);
    for (const l of r.ky[k].linhVuc) {
      assert.strictEqual(l.nguon.length, 3);
      for (const n of l.nguon) assert.ok(n.diem >= 1 && n.diem <= 5 && n.loi.length > 20, `${k} ${l.ma} ${n.he}`);
      assert.ok(Math.abs(l.diem - l.nguon.reduce((a, n) => a + n.diem, 0) / 3) <= 0.11, `${k} ${l.ma}`);
      assert.ok(l.tongHop.length > 30);
      for (const x of [l, ...l.nguon]) assert.ok(Number.isInteger(x.phanTram) && x.phanTram >= 0 && x.phanTram <= 100, `${k} ${l.ma} %`);
    }
    assert.match(r.ky[k].tomTat, /\d+%/);
    assert.doesNotMatch(r.ky[k].tomTat, /\/5/);
  }
});

test('nhập âm lịch (cả tháng nhuận) và nhiều ngày sinh ngẫu nhiên không lỗi', () => {
  const a = TongHop.duDoan({ ngay: 1, thang: 2, nam: 2023, amLich: true, nhuan: true, gio: 1, namGioi: false }, HOM_NAY);
  assert.strictEqual(a.ngaySinh.duong, '22/3/2023');
  assert.strictEqual(a.hoSo.hoangDao.id, 'bach-duong');
  for (let i = 0; i < 60; i++) {
    const r = TongHop.duDoan({ ngay: 1 + (i * 7) % 28, thang: 1 + i % 12, nam: 1940 + i, gio: 1 + i % 12, namGioi: i % 2 === 0 }, { y: 2026, m: 1 + i % 12, d: 1 + i % 28 });
    assert.doesNotMatch(JSON.stringify(r), /undefined|NaN/);
  }
});

test('API tổng hợp và trang chủ mới, trang xem nhanh, tài nguyên các phần khác', async () => {
  const post = body => fetch(base + '/api/tong-hop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const r = await (await post({ ngay: 15, thang: 8, nam: 1990, gio: 5, gioiTinh: 'nam', homNay: '2026-10-24' })).json();
  assert.strictEqual(r.hoSo.hoangDao.id, 'su-tu');
  assert.strictEqual(r.ky.nam.linhVuc.length, 3);
  assert.strictEqual((await post({ ngay: 15, thang: 8, nam: 1990, gio: 5, gioiTinh: 'nam', homNay: '2026-02-30' })).status, 400);
  assert.strictEqual((await post({ ngay: 15, thang: 13, nam: 1990, gio: 5, gioiTinh: 'nam' })).status, 400);
  const home = await (await fetch(base + '/')).text();
  assert.match(home, /Một ngày sinh, ba góc nhìn/);
  assert.strictEqual((await fetch(base + '/xem-nhanh.html')).status, 404); // đã bỏ trang Xem tử vi nhanh
  for (const p of ['/js/tong-hop.js', '/js/trang-chu.js', '/shared/site.css', '/tuvivietnam/frontend/index.html', '/numerology/frontend/index.html', '/zodiac/frontend/js/luan-giai.js', '/zodiac/frontend/js/vendor/astronomy.browser.min.js', '/numerology/frontend/js/so-hoc.js', '/Tarot/frontend/index.html'])
    assert.strictEqual((await fetch(base + p)).status, 200, p);
});
