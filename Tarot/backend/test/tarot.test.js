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
  const r = await (await post({ kieu: 'tinhcam', nguoc: false })).json();
  assert.strictEqual(r.la.length, 3);
  assert.strictEqual(new Set(r.la.map(l => l.id)).size, 3);
  assert.deepStrictEqual(r.la.map(l => l.viTri), ['Bạn', 'Người ấy', 'Mối quan hệ']);
  assert.ok(r.la.every(l => !l.nguoc));
  assert.strictEqual((await (await post({ kieu: '1la' })).json()).la.length, 1);
  const r5 = await (await post({ kieu: '5la' })).json();
  assert.deepStrictEqual(r5.la.map(l => l.viTri), ['Quá khứ', 'Hiện tại', 'Tương lai', 'Gốc rễ', 'Lời khuyên']);
  const r10 = await (await post({ kieu: '10la', chuDe: 'sunghiep' })).json();
  assert.strictEqual(new Set(r10.la.map(l => l.id)).size, 10);
  assert.deepStrictEqual(r10.la.slice(0, 2).map(l => l.viTri), ['Hiện tại', 'Thử thách']);
  assert.strictEqual(r10.la[9].viTri, 'Kết quả');
  for (const body of [{ kieu: '7la' }, { nguoc: 'co' }]) assert.strictEqual((await post(body)).status, 400, JSON.stringify(body));
});

test('API tra bài và phục vụ trang', async () => {
  assert.strictEqual((await (await fetch(base + '/api/bo-bai')).json()).length, 78);
  assert.strictEqual((await (await fetch(base + '/api/la-bai/0')).json()).ten, 'Kẻ Khờ');
  assert.strictEqual((await fetch(base + '/api/la-bai/78')).status, 404);
  assert.strictEqual((await fetch(base + '/api/la-bai/abc')).status, 404);
  assert.deepStrictEqual(Object.keys(await (await fetch(base + '/api/kieu-trai')).json()), ['1la', '3la', 'tinhcam', '5la', '10la']);
  const home = await fetch(base + '/');
  assert.strictEqual(home.status, 200);
  assert.match(await home.text(), /Các kiểu trải bài/);
  const xem = await fetch(base + '/xem-bai.html');
  assert.strictEqual(xem.status, 200);
  assert.match(await xem.text(), /Xáo bài, rút và lật lá/);
  for (const f of ['bo-bai.js', 'la-bai.js', 'app.js', 'y-nghia-chu-de.js']) assert.strictEqual((await fetch(base + '/js/' + f)).status, 200, f);
});

test('chủ đề: mỗi lá có 4 chủ đề × xuôi/ngược, không trùng nhau; đọc bài theo chủ đề', () => {
  const ds = Tarot.BO_BAI.flatMap(l => ['tinhyeu', 'sunghiep', 'taichinh', 'banthan'].flatMap(k => [l.chuDe[k].xuoi, l.chuDe[k].nguoc]));
  assert.strictEqual(ds.length, 624);
  assert.ok(ds.every(x => typeof x === 'string' && x.length > 10));
  assert.strictEqual(new Set(ds).size, 624);
  const r = Tarot.docBai('1la', [{ id: 6, nguoc: true }], 'tinhyeu');
  assert.strictEqual(r.tenChuDe, 'Tình yêu');
  assert.strictEqual(r.la[0].y, Tarot.BO_BAI[6].chuDe.tinhyeu.nguoc);
  assert.strictEqual(r.la[0].yChung, Tarot.BO_BAI[6].nguoc.y);
  assert.match(r.tongQuan[0], /bộ Cốc/);
  const tq = Tarot.docBai('1la', [{ id: 6, nguoc: false }]);
  assert.strictEqual(tq.la[0].y, Tarot.BO_BAI[6].xuoi.y);
  assert.strictEqual(tq.la[0].yChung, null);
});

test('API theo chủ đề', async () => {
  const post = body => fetch(base + '/api/rut-bai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const r = await (await post({ kieu: '3la', chuDe: 'taichinh' })).json();
  assert.strictEqual(r.tenChuDe, 'Tài chính');
  r.la.forEach(l => assert.strictEqual(l.y, Tarot.BO_BAI[l.id].chuDe.taichinh[l.nguoc ? 'nguoc' : 'xuoi']));
  assert.strictEqual((await post({ chuDe: 'suckhoe' })).status, 400);
  assert.strictEqual((await post({ chuDe: 'toString' })).status, 400);
  assert.deepStrictEqual(Object.keys(await (await fetch(base + '/api/chu-de')).json()), ['tongquan', 'tinhyeu', 'sunghiep', 'taichinh', 'banthan']);
});

test('ý nghĩa theo vị trí: theo chiều thuận/nghịch của lá, ghép từ khóa', () => {
  const r = Tarot.docBai('3la', [{ id: 16, nguoc: false }, { id: 52, nguoc: true }, { id: 19, nguoc: false }]);
  assert.match(r.la[0].yTheoViTri, /^Chuyện đã qua để lại biến động bất ngờ, sụp đổ và thức tỉnh\./); // Tòa Tháp xuôi: nghịch
  assert.match(r.la[1].yTheoViTri, /^Lúc này, năng lượng chính quanh vấn đề là hồi phục/); // 3 Kiếm ngược: thuận
  assert.match(r.la[2].yTheoViTri, /phía trước là niềm vui, thành công và sức sống\.$/);
  const viTri = new Set(Object.values(Tarot.KIEU_TRAI).flatMap(k => k.viTri.map(v => v[0])));
  for (const v of viTri) assert.doesNotMatch(Tarot.docBai('1la', [{ id: 0 }]).la[0].yTheoViTri, /\{k\}/, v);
});

test('tổng hợp luận giải: bài đọc liền mạch cho mọi kiểu trải và chủ đề, nhắc đủ các lá', () => {
  for (const kieu of Object.keys(Tarot.KIEU_TRAI)) for (const chuDe of Object.keys(Tarot.CHU_DE)) for (let i = 0; i < 60; i++) {
    const n = Tarot.KIEU_TRAI[kieu].viTri.length, r = Tarot.docBai(kieu, Tarot.xaoBai().slice(0, n), chuDe);
    const txt = r.luanGiai.join(' ') + r.la.map(l => l.yTheoViTri).join(' ');
    assert.doesNotMatch(txt, /undefined|NaN|\{|\}|\s\s/, `${kieu} ${chuDe}`);
    r.la.forEach(l => assert.ok(txt.includes(l.ten), `${kieu}: thiếu ${l.ten}`));
    if (n > 1) { assert.match(r.luanGiai[0], /^Nhìn chung/); assert.match(r.luanGiai.at(-1), /^Lời nhắn chung/); }
  }
  assert.strictEqual(Tarot.docBai('10la', Tarot.xaoBai().slice(0, 10)).luanGiai.length, 6);
  const tc = Tarot.docBai('tinhcam', [{ id: 41 }, { id: 46, nguoc: true }, { id: 6 }], 'tinhyeu').luanGiai.join(' ');
  assert.match(tc, /bạn cởi mở hơn, còn người ấy vẫn đang vướng bận/);
  assert.match(tc, /Hai lá cùng bộ Cốc/);
});

test('tìm lá: không dấu, tên tiếng Anh, từ khóa, lọc theo nhóm', () => {
  assert.deepStrictEqual(Tarot.timLa('ngoi sao').map(l => l.ten), ['Ngôi Sao']);
  assert.deepStrictEqual(Tarot.timLa('The Star').map(l => l.id), [17]);
  assert.strictEqual(Tarot.timLa('', 'anChinh').length, 22);
  assert.strictEqual(Tarot.timLa('', 'coc').length, 14);
  const dong = Tarot.timLa('Đồng').map(l => l.ten); // có dấu: không lẫn "động lực", "biến động"
  assert.ok(dong.includes('Tiểu Đồng Kiếm') && dong.includes('5 Gậy') && !dong.includes('Át Gậy') && !dong.includes('Tòa Tháp'), dong.join());
  assert.ok(Tarot.timLa('dong').some(l => l.ten === 'Át Gậy')); // không dấu: khớp rộng
  assert.strictEqual(Tarot.timLa('khong co la nao').length, 0);
});

test('API thư viện và trang thư viện', async () => {
  const get = async u => (await fetch(base + u)).json();
  assert.strictEqual((await get('/api/bo-bai?q=ngoi%20sao'))[0].ten, 'Ngôi Sao');
  assert.strictEqual((await get('/api/bo-bai?nhom=coc')).length, 14);
  assert.strictEqual((await fetch(base + '/api/bo-bai?nhom=abc')).status, 400);
  assert.strictEqual((await fetch(base + '/api/bo-bai?q=' + 'x'.repeat(101))).status, 400);
  const r = await (await fetch(base + '/api/rut-bai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kieu: '5la' }) })).json();
  assert.ok(Array.isArray(r.luanGiai) && r.luanGiai.length >= 3 && r.la.every(l => l.yTheoViTri.length > 20));
  const tv = await fetch(base + '/thu-vien.html');
  assert.strictEqual(tv.status, 200);
  assert.match(await tv.text(), /Thư viện 78 lá Tarot/);
  assert.strictEqual((await fetch(base + '/js/thu-vien.js')).status, 200);
});
