// Kiểm tra tử vi 12 con giáp: npm test
const { test } = require('node:test');
const assert = require('node:assert');
const T = require('../../frontend/js/tuvi.js');
const CG = require('../../frontend/js/congiap.js');

const jd = (d, m, y) => T.jdFromDate(d, m, y);

test('quan hệ địa chi đối xứng và đúng các cặp quen thuộc', () => {
  for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++)
    assert.deepStrictEqual(CG.quanHe(a, b).map(q => q.loai), CG.quanHe(b, a).map(q => q.loai));
  assert.deepStrictEqual(CG.quanHe(1, 7).map(q => q.loai), ['xung']);           // Tý – Ngọ
  assert.deepStrictEqual(CG.quanHe(9, 1).map(q => q.loai), ['tamHop']);         // Thân – Tý
  assert.deepStrictEqual(CG.quanHe(6, 9).map(q => q.loai), ['lucHop', 'hinh', 'pha']); // Tỵ – Thân
  assert.deepStrictEqual(CG.quanHe(7, 7).map(q => q.loai), ['tuHinh']);
});

test('giờ hoàng đạo ngày Tý: Tý, Sửu, Mão, Ngọ, Thân, Dậu', () => {
  assert.deepStrictEqual(CG.gioHoangDao(1), [1, 2, 4, 7, 9, 10]);
});

test('sao chiếu mệnh: nữ 1970 năm 2029 là La Hầu, nam 1990 năm 2026 là La Hầu', () => {
  assert.strictEqual(CG.tuViNam(11, jd(1, 6, 2029), { namSinh: 1970, gioiTinh: 'nu' }).sao.ten, 'La Hầu');
  assert.strictEqual(CG.tuViNam(7, jd(1, 6, 2026), { namSinh: 1990, gioiTinh: 'nam' }).sao.ten, 'La Hầu');
});

test('năm Bính Ngọ 2026: tuổi Ngọ phạm Thái Tuế, tuổi Tý xung, tuổi Hợi gặp Tam tai', () => {
  const d = jd(23, 10, 2026);
  assert.match(CG.tuViNam(7, d).dong.join(' '), /phạm Thái Tuế/);
  assert.match(CG.tuViNam(1, d).dong.join(' '), /lục xung/);
  assert.match(CG.tuViNam(12, d).dong.join(' '), /Tam tai năm thứ 2\/3/);
  assert.doesNotMatch(CG.tuViNam(9, d).dong.join(' '), /Tam tai/);
});

test('tuần bắt đầu từ Thứ Hai và có đủ 7 ngày', () => {
  const w = CG.tuViTuan(1, jd(23, 10, 2026)); // Thứ Sáu
  assert.strictEqual(w.tuan.length, 7);
  assert.strictEqual(w.tuan[0].thu, 'Thứ Hai');
  assert.strictEqual(w.tuan[0].duong, '19/10/2026');
  assert.ok(w.tuan[4].hienTai);
});

test('mọi tuổi, mọi kỳ đều ra nội dung đầy đủ', () => {
  for (let t = 1; t <= 12; t++) for (let i = 0; i < 400; i += 37) {
    const d = jd(1, 1, 2025) + i;
    for (const r of [CG.tuViNgay(t, d), CG.tuViTuan(t, d), CG.tuViThang(t, d), CG.tuViNam(t, d, { namSinh: 1984 + t, gioiTinh: 'nu' })]) {
      const s = JSON.stringify(r);
      assert.ok(!/undefined|NaN/.test(s), s.slice(0, 200));
      assert.strictEqual(r.muc.length, 4);
      assert.ok(r.diem >= 1 && r.diem <= 5);
      assert.ok(r.nhan && r.loiKhuyen && r.mau && r.so);
    }
  }
});
