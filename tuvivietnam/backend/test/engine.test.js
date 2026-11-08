// Kiểm tra engine lá số và luận giải: npm test
const assert = require('assert'), T = require('../../frontend/js/tuvi.js');
assert.deepStrictEqual(T.solar2lunar(17, 2, 2026), [1, 1, 2026, 0]);   // Tết Bính Ngọ
assert.deepStrictEqual(T.solar2lunar(22, 1, 2023), [1, 1, 2023, 0]);   // Tết Quý Mão
assert.deepStrictEqual(T.solar2lunar(21, 3, 2023), [30, 2, 2023, 0]);
assert.deepStrictEqual(T.solar2lunar(22, 3, 2023), [1, 2, 2023, 1]);   // tháng 2 nhuận Quý Mão
assert.deepStrictEqual(T.solar2lunar(20, 4, 2023), [1, 3, 2023, 0]);
const L = T.lapLaSo({ ngay: 17, thang: 2, nam: 2026, gio: 1, namGioi: true });
assert.strictEqual(L.canChi.nam, 'Bính Ngọ');
assert.strictEqual(L.cung.filter(c => c.sao.some(s => s.loai === 1)).length > 0, true);
assert.strictEqual(L.cung.reduce((n, c) => n + c.sao.filter(s => s.loai === 1).length, 0), 14);
assert.throws(() => T.lapLaSo({ ngay: 1, thang: 3, nam: 2024, amLich: true, nhuan: true, gio: 1, namGioi: true }));
console.log('ok');
// Cung Thân luôn cách Mệnh 0, 2, 4, 6, 8 hoặc 10 cung theo chiều thuận (điều bài viết nói)
for (let g = 1; g <= 12; g++) for (let m = 1; m <= 12; m++) {
  const X = T.lapLaSo({ ngay: 10, thang: m, nam: 2000, gio: g, namGioi: true });
  assert.ok([0, 2, 4, 6, 8, 10].includes((X.than - X.menh + 12) % 12));
}
console.log('ok than');
// Luận giải: mọi cung của nhiều lá số đều ra chữ, không có "undefined"
const LG = require('../../frontend/js/luangiai.js');
let cach = 0;
for (let i = 0; i < 600; i++) {
  const X = T.lapLaSo({ ngay: 1 + i % 28, thang: 1 + i % 12, nam: 1940 + i % 80, gio: 1 + (i * 7) % 12, namGioi: i % 2 === 0 });
  for (let so = 1; so <= 12; so++) {
    const h = LG.luanGiai(X, so);
    assert.ok(!/undefined|NaN/.test(h), h);
    assert.ok(h.includes('<h3>Cung'));
    for (const p of ['1. Tổng quan cung', '2. Phân tích các sao', '3. Tác động của tam phương tứ chính', '4. Các yếu tố hỗ trợ và bất lợi', '5. Luận giải theo từng giai đoạn', '6. Lời khuyên'])
      assert.ok(h.includes(p), p);
    if (so === X.menh && h.includes('hội đủ bộ')) cach++;
  }
}
assert.ok(cach > 0);
console.log('ok luan giai, cach cuc', cach);

// Vận hạn và báo cáo: đủ đại hạn, tiểu hạn đúng chi năm, lưu nguyệt 12 tháng, bốn mặt của năm
for (let i = 0; i < 120; i++) {
  const X = T.lapLaSo({ ngay: 1 + i % 28, thang: 1 + i % 12, nam: 1940 + i % 80, gio: 1 + (i * 5) % 12, namGioi: i % 3 === 0 });
  const nam = 1990 + (i * 7) % 60, v = LG.vanHan(X, nam, { y: nam, m: 6, d: 15 });
  assert.strictEqual(v.daiHan.length, 12);
  assert.strictEqual(X.cung[v.tieuHan.so - 1].tieuHan, T.CHI[(nam + 8) % 12 + 1]);
  assert.strictEqual(v.luuNguyet.length, 12);
  assert.deepStrictEqual(v.mat.map(m => m.ma), ['congViec', 'taiChinh', 'tinhCam', 'giaDinh']);
  assert.ok(v.luu.every(x => x.so >= 1 && x.so <= 12));
  const h = LG.htmlVanHan(X, nam, { y: nam, m: 6, d: 15 }) + (i % 20 === 0 ? LG.baoCao(X, nam) : '');
  assert.ok(!/undefined|NaN/.test(h), h.slice(0, 200));
}
// Lưu Lộc Tồn năm Bính (2026) ở Tỵ, lưu Thái Tuế ở Ngọ
const V = LG.vanHan(T.lapLaSo({ ngay: 15, thang: 8, nam: 1990, gio: 5, namGioi: true }), 2026);
assert.strictEqual(V.luu.find(x => x.ten === 'Lưu Lộc Tồn').so, 6);
assert.strictEqual(V.luu.find(x => x.ten === 'Lưu Thái Tuế').so, 7);
console.log('ok van han');
