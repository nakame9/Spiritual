// Thư viện bài viết: dữ liệu đủ cấu trúc, tìm kiếm, bài liên quan, lượt đọc
process.env.DATA_DIR = require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'tuvi-tv-'));
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const TV = require('../../frontend/js/thu-vien.js');
const app = require('../server.js');

const FE = path.join(__dirname, '..', '..', 'frontend');
const slugs = ds => ds.map(b => b.slug);

test('mỗi bài đủ 10 phần: tiêu đề, mô tả, ảnh, mục lục, nội dung, ví dụ, hỏi đáp, liên quan, nguồn, ngày cập nhật', () => {
  const thay = new Set();
  for (const b of TV.BAI) {
    assert.match(b.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, b.slug);
    assert.ok(!thay.has(b.slug), `trùng slug ${b.slug}`); thay.add(b.slug);
    assert.ok(TV.CM[b.chuyenMuc], `${b.slug}: chuyên mục ${b.chuyenMuc}`);
    assert.ok(b.tieuDe && b.moTa.length >= 60 && b.moTa.length <= 200, `${b.slug}: mô tả ${b.moTa.length} ký tự`);
    assert.ok(TV.mucLuc(b.noiDung).length >= 3, `${b.slug}: mục lục`);
    assert.ok(b.noiDung.split(/\s+/).length >= 350, `${b.slug}: nội dung ngắn`);
    assert.ok(b.viDu.tieuDe && b.viDu.noiDung.length > 100, `${b.slug}: ví dụ`);
    assert.ok(b.hoiDap.length >= 2 && b.hoiDap.every(x => x[0].endsWith('?') && x[1]), `${b.slug}: hỏi đáp`);
    assert.ok(b.nguon.length >= 1, `${b.slug}: nguồn`);
    for (const [, u] of b.nguon) if (u && !/^https:\/\//.test(u)) assert.ok(fs.existsSync(path.join(FE, u.split('#')[0])), `${b.slug}: nguồn ${u}`);
    assert.ok(fs.existsSync(path.join(FE, b.congCu[1].split('#')[0])), `${b.slug}: công cụ ${b.congCu[1]}`);
    assert.match(b.ngayDang, /^\d{4}-\d{2}-\d{2}$/); assert.ok(b.capNhat >= b.ngayDang);
    assert.match(TV.anhBia(b), /^<svg[^>]+role="img"/);
    assert.ok(b.the.length >= 4);
    assert.ok(fs.existsSync(path.join(FE, 'bai-viet', b.slug + '.html')), `${b.slug}: chưa sinh trang (node scripts/bai-viet.js)`);
  }
});

test('đủ 8 chuyên mục, mỗi chuyên mục có bài, và có các chủ đề mẫu của đặc tả', () => {
  assert.deepStrictEqual(TV.CHUYEN_MUC.map(c => c.ten), ['Tử vi', '12 con giáp', 'Phong thủy', 'Chiêm tinh', 'Thần số học', 'Tarot', 'Lịch vạn niên', 'Kiến thức']);
  for (const c of TV.CHUYEN_MUC) assert.ok(TV.BAI.some(b => b.chuyenMuc === c.id), c.ten);
  for (const s of ['tu-vi-la-gi', '12-cung-la-so-tu-vi', 'dai-han-tieu-han', 'thien-can-dia-chi', 'ngu-hanh-tuong-sinh-tuong-khac', 'ban-do-sao-ca-nhan', 'cach-tinh-so-chu-dao'])
    assert.ok(TV.BAI.some(b => b.slug === s), s);
});

test('tìm kiếm không dấu, nhiều từ, lọc chuyên mục', () => {
  assert.strictEqual(TV.timKiem(TV.BAI, { q: 'tiet khi' })[0].slug, '24-tiet-khi');
  assert.strictEqual(TV.timKiem(TV.BAI, { q: 'Số chủ đạo' })[0].slug, 'cach-tinh-so-chu-dao');
  assert.strictEqual(TV.timKiem(TV.BAI, { q: 'DAI HAN' })[0].slug, 'dai-han-tieu-han');
  assert.deepStrictEqual(TV.timKiem(TV.BAI, { q: 'xyzabc' }), []);
  const tarot = TV.timKiem(TV.BAI, { cm: 'tarot' });
  assert.ok(tarot.length && tarot.every(b => b.chuyenMuc === 'tarot'));
  assert.ok(TV.timKiem(TV.BAI, { q: 'ngũ hành', cm: 'phong-thuy' }).every(b => b.chuyenMuc === 'phong-thuy'));
  assert.strictEqual(TV.timKiem(TV.BAI, {}).length, TV.BAI.length);
});

test('bài liên quan dựa trên nội dung: cùng chủ đề lên trước, không gồm chính nó', () => {
  for (const b of TV.BAI) { const lq = TV.lienQuan(b, TV.BAI, 3); assert.strictEqual(lq.length, 3); assert.ok(!slugs(lq).includes(b.slug)); }
  assert.ok(slugs(TV.lienQuan(TV.BAI.find(b => b.slug === 'cach-tinh-so-chu-dao'), TV.BAI)).includes('nam-ca-nhan'));
  assert.ok(slugs(TV.lienQuan(TV.BAI.find(b => b.slug === 'tu-vi-la-gi'), TV.BAI)).includes('12-cung-la-so-tu-vi'));
  assert.ok(slugs(TV.lienQuan(TV.BAI.find(b => b.slug === '24-tiet-khi'), TV.BAI)).some(s => ['chon-ngay-tot', 'thien-can-dia-chi'].includes(s)));
});

test('mới nhất theo ngày đăng, phổ biến theo lượt đọc rồi thứ tự biên tập', () => {
  const m = TV.moiNhat(TV.BAI);
  for (let i = 1; i < m.length; i++) assert.ok(m[i - 1].ngayDang >= m[i].ngayDang);
  assert.strictEqual(TV.phoBien(TV.BAI)[0].noiBat, 1);
  assert.strictEqual(TV.phoBien(TV.BAI, { 'tarot-78-la-va-cach-trai-bai': 5, '24-tiet-khi': 2 })[0].slug, 'tarot-78-la-va-cach-trai-bai');
});

let server, base;
before(() => new Promise(ok => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => server.close());

test('API lượt đọc: đếm bài có thật, 404 bài không có', async () => {
  const xem = s => fetch(`${base}/api/bai-viet/${s}/xem`, { method: 'POST' });
  assert.strictEqual((await (await xem('24-tiet-khi')).json()).luot, 1);
  assert.strictEqual((await (await xem('24-tiet-khi')).json()).luot, 2);
  assert.strictEqual((await xem('khong-co-bai-nay')).status, 404);
  assert.deepStrictEqual(await (await fetch(base + '/api/bai-viet/luot-xem')).json(), { '24-tiet-khi': 2 });
});

test('trang bài sinh ra có mục lục, dữ liệu có cấu trúc và link hợp lệ', () => {
  const s = fs.readFileSync(path.join(FE, 'bai-viet', 'cach-tinh-so-chu-dao.html'), 'utf8');
  for (const x of ['<h1>Cách tính số chủ đạo</h1>', 'id="vi-du"', 'id="hoi-dap"', 'id="nguon"', '"@type": "FAQPage"', 'rel="canonical"', 'class="lien-quan"', 'Cập nhật lần cuối'])
    assert.ok(s.includes(x), x);
  for (const m of s.matchAll(/href="#([^"]+)"/g)) assert.ok(s.includes(`id="${m[1]}"`), `mục lục trỏ tới #${m[1]}`);
  for (const m of s.matchAll(/(?:href|src)="(\.\.\/[^"#]+)/g)) assert.ok(fs.existsSync(path.join(FE, 'bai-viet', m[1])), m[1]);
});
