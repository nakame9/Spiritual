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

const H = require('../../frontend/js/con-giap-ho-so.js');

test('hồ sơ con giáp: đủ 12 tuổi, năm sinh đúng chi, nạp âm đúng sách', () => {
  for (let t = 1; t <= 12; t++) {
    const h = H.hoSo(t);
    assert.ok(h.nam.length >= 16 && h.nam.every(x => (x.nam + 8) % 12 + 1 === t), `tuổi ${t}`);
    for (const k of ['manh', 'han', 'giaoTiep', 'lamViec', 'tinhCam', 'suNghiep', 'taiChinh', 'tinhDuyen', 'giaDinh', 'xaHoi']) assert.ok(h.tinhCach[k].length > 20, `${t} ${k}`);
    assert.strictEqual(h.tamHop.length, 2); assert.strictEqual(h.tuHanhXung.length, 3);
  }
  assert.strictEqual(H.hoSo(4).con, 'Mèo');
  assert.strictEqual(H.theoNam(1960).napAm, 'Bích Thượng Thổ');   // Canh Tý
  assert.strictEqual(H.theoNam(1984).napAm, 'Hải Trung Kim');     // Giáp Tý
  assert.strictEqual(H.theoNam(1990).napAm, 'Lộ Bàng Thổ');       // Canh Ngọ
  assert.notStrictEqual(H.theoNam(1960).loi, H.theoNam(1984).loi); // cùng tuổi Tý, khác can và nạp âm
});

test('tuổi hợp: xét đủ yếu tố và đánh giá khác nhau theo mục đích', () => {
  const tamHop = H.hopTuoi(1984, 1988);                           // Tý – Thìn tam hợp
  assert.ok(tamHop.quanHe.tamHop && !tamHop.quanHe.xung);
  const xung = H.hopTuoi(1990, 1996);                             // Ngọ – Tý lục xung
  assert.ok(xung.quanHe.xung && xung.quanHe.cungNhomXung);
  assert.deepStrictEqual(xung.mucDich.map(m => m.ma), ['ketHon', 'lamAn', 'sinhCon', 'ketGiao', 'doiTac']);
  assert.ok(xung.mucDich.every(m => m.diem < 0 && m.nghich.length));
  assert.match(H.hopTuoi(1990, 1985).quanHe.can, /ngũ hợp/);     // Canh – Ất ngũ hợp
  assert.match(H.hopTuoi(1990, 1994).quanHe.can, /Canh .*khắc can Giáp/);
  // Cùng một cặp tuổi có thể hợp việc này mà không hợp việc kia
  let khac = 0;
  for (let a = 1950; a < 2010; a += 3) for (let b = 1950; b < 2010; b += 7) {
    const ds = H.hopTuoi(a, b).mucDich.map(m => m.muc);
    if (new Set(ds).size > 1) khac++;
    assert.doesNotMatch(JSON.stringify(H.hopTuoi(a, b)), /undefined|NaN/);
  }
  assert.ok(khac > 50);
});
