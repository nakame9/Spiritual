// Tra cứu: bản mệnh, cung phi Bát trạch, giải mộng, trợ lý AI (dữ liệu do hệ thống tính, AI chỉ diễn giải)
process.env.DATA_DIR = require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'tuvi-tc-'));
process.env.TRO_LY_GIOI_HAN = '8';
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const B = require('../../frontend/js/ban-menh.js');
const G = require('../../frontend/js/giai-mong.js');
const T = require('../../frontend/js/tro-ly.js');
const TuVi = require('../../frontend/js/tuvi.js');
const app = require('../server.js');

test('cung phi theo năm sinh và giới tính khớp bảng tra phổ biến', () => {
  const bang = [[1990, 'nam', 'Khảm'], [1990, 'nu', 'Cấn'], [2000, 'nam', 'Ly'], [2000, 'nu', 'Càn'], [1984, 'nam', 'Đoài'], [1984, 'nu', 'Cấn'],
    [1980, 'nam', 'Khôn'], [1987, 'nam', 'Tốn'], [1987, 'nu', 'Khôn'], [1986, 'nam', 'Khôn'], [1995, 'nu', 'Khảm'], [1976, 'nam', 'Càn']];
  for (const [y, g, q] of bang) assert.strictEqual(B.cungPhi(y, g).ten, q, `${y} ${g}`);
  assert.match(B.cungPhi(1986, 'nam').ghiChu, /Khôn/);
});

test('bảng du niên: mỗi quái đủ 8 hướng, quan hệ hai quái đối xứng', () => {
  for (const q of [1, 2, 3, 4, 6, 7, 8, 9]) {
    assert.strictEqual(new Set(B.DU_NIEN.map(dn => B.duNienHuong(q, B.HUONG.find(h => B.duNienHuong(q, h) === dn)))).size, 8);
    for (const r of [1, 2, 3, 4, 6, 7, 8, 9]) assert.strictEqual(B.duNien(q, r), B.duNien(r, q), `${q}-${r}`);
    assert.strictEqual(B.duNien(q, q), 'Phục Vị');
  }
  // Đông tứ mệnh gặp nhau luôn tốt, Đông gặp Tây luôn xấu
  for (const a of [1, 3, 4, 9]) for (const b of [1, 3, 4, 9]) assert.ok(B.DU_NIEN_Y[B.duNien(a, b)][0]);
  for (const a of [1, 3, 4, 9]) for (const b of [2, 6, 7, 8]) assert.ok(!B.DU_NIEN_Y[B.duNien(a, b)][0]);
});

test('năm can chi đổi theo Tết hoặc Lập xuân; bản mệnh tách riêng các hệ thống', () => {
  assert.strictEqual(B.namTinh(20, 1, 1990).nam, 1989);             // trước Tết Canh Ngọ (27/1/1990)
  assert.strictEqual(B.namTinh(10, 2, 2026, 'tet').nam, 2025);       // Tết Bính Ngọ 17/2/2026
  assert.strictEqual(B.namTinh(10, 2, 2026, 'lapXuan').nam, 2026);   // đã qua Lập xuân 4/2/2026
  assert.ok(B.namTinh(4, 2, 2026, 'lapXuan').giaoTiet);
  const r = B.banMenh({ d: 15, m: 8, y: 1990 }, { gioiTinh: 'nam' });
  assert.strictEqual(r.canChi, 'Canh Ngọ'); assert.strictEqual(r.napAm.ten, 'Lộ Bàng Thổ'); assert.strictEqual(r.chi.hanh, 'Hỏa');
  assert.strictEqual(r.nhatChu.canChiNgay, TuVi.lapLaSo({ ngay: 15, thang: 8, nam: 1990, gio: 1, namGioi: true }).canChi.ngay);
  assert.deepStrictEqual(r.heThong.map(x => x.hanh), ['Thổ', 'Kim', 'Hỏa', 'Thủy', 'Thủy']); // nạp âm, can, chi, nhật chủ, cung phi: không đánh đồng
  assert.strictEqual(r.mau.tuongSinh.hanh, 'Hỏa'); assert.strictEqual(r.mau.nenTranh.hanh, 'Mộc');
  assert.strictEqual(B.banMenh({ d: 15, m: 8, y: 1990 }).cungPhi, undefined); // không giới tính thì không tính cung phi
});

test('quan hệ hai mệnh, Kim lâu, phong thủy cần giới tính và so hai cách xét hướng nhà', () => {
  const a = B.banMenh({ d: 15, m: 8, y: 1990 }, { gioiTinh: 'nam' }), b = B.banMenh({ d: 3, m: 3, y: 1992 }, { gioiTinh: 'nu' });
  const q = B.haiMenh(a, b);
  assert.strictEqual(q.napAm.quanHe, 'sinh'); assert.strictEqual(q.cungPhi.duNien, 'Họa Hại'); assert.strictEqual(q.cungPhi.cungNhom, false);
  assert.deepStrictEqual([B.kimLau(1995, 2026).pham, B.kimLau(1995, 2024).loai], [false, 'Kim lâu Thê (ảnh hưởng người vợ)']); // 32 tuổi mụ dư 5; 30 tuổi mụ dư 3
  assert.throws(() => B.phongThuy(B.banMenh({ d: 1, m: 1, y: 1990 })), /giới tính/);
  const n = B.phongThuy(a, 'Đông Nam').nha;
  assert.deepStrictEqual([n.duNien, n.toa, n.trach, n.hopTheoToa], ['Sinh Khí', 'Tây Bắc', 'Càn', false]);
  assert.strictEqual(B.huongTuDo(350), 'Bắc'); assert.strictEqual(B.huongTuDo(135), 'Đông Nam'); assert.strictEqual(B.huongTuDo(-45), 'Tây Bắc');
});

test('giải mộng: khớp có dấu, không nhầm "mà", "thì", "rồi"; các ví dụ của đặc tả đều có biểu tượng', () => {
  const ma = (t, c) => G.tim(t, c).map(b => b.ma);
  assert.deepStrictEqual(ma('Tôi thì cứ nghĩ mà rồi cũng thôi'), []);
  for (const [t, m] of [['mơ thấy nước', 'nuoc'], ['mơ thấy rắn', 'ran'], ['mơ thấy người thân', 'nguoiThan'], ['mơ thấy mình bay', 'bay'], ['mơ thấy rơi từ trên cao', 'roi']])
    assert.ok(ma(t).includes(m), t);
  assert.deepStrictEqual(ma('mo thay nguoi da mat'), ['nguoiMat']); // gõ không dấu: chỉ khớp cụm nhiều tiếng
  assert.deepStrictEqual(ma('', ['ca']), ['ca']);
  for (const b of G.BIEU_TUONG) assert.ok(b.danGian.length && b.bieuTuong && b.tamLy && b.cauHoi.length >= 2, b.ma);
  assert.ok(!/\b(số đề|lô đề|con số may mắn)\b/i.test(JSON.stringify(G.BIEU_TUONG)));
});

const HS = { d: 15, m: 8, y: 1990, gio: 4, gioiTinh: 'nam' }, HN = { d: 12, m: 11, y: 2026 };
test('trợ lý: hiểu 5 câu hỏi mẫu và dữ liệu lấy đúng từ bộ quy tắc, không tự đặt ra', () => {
  const loai = q => T.phanLoai(q).loai;
  assert.strictEqual(loai('Lá số của tôi có cung Quan Lộc như thế nào?'), 'cung');
  assert.strictEqual(loai('Số chủ đạo của tôi có ý nghĩa gì?'), 'soChuDao');
  assert.strictEqual(loai('Hai tuổi 1990 và 1988 có hợp làm ăn không?'), 'hopTuoi');
  assert.strictEqual(loai('Hôm nay nên chú ý điều gì?'), 'homNay');
  assert.deepStrictEqual(T.phanLoai('Giải thích sao Tử Vi trong cung Mệnh.'), { loai: 'sao', sao: 'Tử Vi', cung: 'Mệnh' });
  assert.strictEqual(loai('Mệnh của tôi hợp màu gì?'), 'menh');
  assert.strictEqual(loai('Nhà tôi nên quay hướng nào?'), 'phongThuy');

  const k = T.tinh('Cung Quan Lộc của tôi?', HS, HN), L = TuVi.lapLaSo({ ngay: 15, thang: 8, nam: 1990, gio: 4, namGioi: true });
  const c = L.cung.find(x => x.ten === 'Quan Lộc');
  assert.strictEqual(k.duLieu.viTri, `${c.can} ${c.chi}`);
  assert.deepStrictEqual(k.duLieu.phuTinh, c.sao.filter(s => s.id > 14).map(s => s.ten));
  // Thiếu giờ sinh: không lập lá số, báo thiếu thay vì đoán
  const t = T.tinh('Cung Quan Lộc của tôi?', { d: 15, m: 8, y: 1990 }, HN);
  assert.strictEqual(t.duLieu, null); assert.match(t.thieu[0], /giờ sinh/);
  assert.match(T.traLoiMau(t)[0], /cần ngày sinh, giờ sinh/);
  // Lời nhắc AI chứa dữ liệu đã tính và nguyên tắc không tự tính
  const p = T.taoPrompt('Cung Quan Lộc của tôi?', k);
  assert.match(p.system, /Không tự tính/); assert.ok(p.user.includes(k.duLieu.viTri)); assert.ok(p.user.includes('<cau_hoi>'));
  assert.strictEqual(T.tinh('Hai tuổi 1990 và 1988 có hợp làm ăn không?', {}, HN).duLieu.danhGia.map(x => x.mucDich).join(), 'Hợp làm ăn,Hợp chọn đối tác');
});

let server, base, ai, aiNhan = [];
before(() => new Promise(ok => {
  ai = http.createServer((req, res) => { let s = ''; req.on('data', c => s += c); req.on('end', () => { aiNhan.push({ headers: req.headers, body: JSON.parse(s) });
    res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ content: [{ type: 'text', text: 'Cung Quan Lộc của bạn vô chính diệu.' }] })); }); });
  ai.listen(0, () => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); });
}));
after(() => { server.close(); ai.close(); });
const hoi = body => fetch(base + '/api/tro-ly', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('API trợ lý: không có khóa AI thì trả lời theo mẫu; có khóa thì gửi dữ liệu đã tính cho AI', async () => {
  delete process.env.ANTHROPIC_API_KEY;
  let r = await (await hoi({ cauHoi: 'Số chủ đạo của tôi có ý nghĩa gì?', hoSo: { d: 15, m: 8, y: 1990 } })).json();
  assert.strictEqual(r.nguon, 'mau'); assert.match(r.traLoi, /Số chủ đạo của bạn là 6/); assert.ok(r.duLieu.length);

  process.env.ANTHROPIC_API_KEY = 'khoa-thu'; process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${ai.address().port}`;
  r = await (await hoi({ cauHoi: 'Lá số của tôi có cung Quan Lộc như thế nào?', hoSo: HS })).json();
  assert.strictEqual(r.nguon, 'ai'); assert.strictEqual(r.traLoi, 'Cung Quan Lộc của bạn vô chính diệu.');
  const gui = aiNhan.pop();
  assert.strictEqual(gui.headers['x-api-key'], 'khoa-thu');
  assert.match(gui.body.system, /Không tự tính/);
  assert.match(gui.body.messages[0].content, /"viTri": "Giáp Thân"/);
  // Thiếu dữ liệu: không gọi AI
  const truoc = aiNhan.length;
  r = await (await hoi({ cauHoi: 'Cung Phu Thê của tôi?', hoSo: { d: 1, m: 1, y: 1990 } })).json();
  assert.strictEqual(r.nguon, 'mau'); assert.strictEqual(aiNhan.length, truoc); assert.match(r.thieu[0], /giờ sinh/);
  // AI lỗi: vẫn trả lời theo mẫu
  process.env.ANTHROPIC_BASE_URL = 'http://127.0.0.1:1';
  r = await (await hoi({ cauHoi: 'Số chủ đạo của tôi?', hoSo: { d: 15, m: 8, y: 1990 } })).json();
  assert.strictEqual(r.nguon, 'mau'); assert.match(r.ghiChu, /tạm thời/);
  delete process.env.ANTHROPIC_API_KEY;
});

test('API trợ lý: kiểm tra đầu vào và giới hạn lượt hỏi', async () => {
  assert.strictEqual((await hoi({ cauHoi: '' })).status, 400);
  assert.strictEqual((await hoi({ cauHoi: 'x'.repeat(501) })).status, 400);
  assert.strictEqual((await hoi({ cauHoi: 'a', hoSo: { d: 31, m: 2, y: 1990 } })).status, 400);
  assert.strictEqual((await hoi({ cauHoi: 'a', hoSo: { gioiTinh: 'khac' } })).status, 400);
  let cuoi; for (let i = 0; i < 6; i++) cuoi = await hoi({ cauHoi: 'Hôm nay thế nào?' });
  assert.strictEqual(cuoi.status, 429);
});
