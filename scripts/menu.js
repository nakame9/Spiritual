#!/usr/bin/env node
/* Menu chính của cả site khai báo ở đây, một chỗ duy nhất.
 *   node scripts/menu.js            ghi lại menu vào mọi trang trong các thư mục frontend
 *   node scripts/menu.js --kiem-tra báo lỗi nếu trang nào lệch (npm test ở gốc kho chạy lệnh này)
 * Thêm mục menu: thêm một dòng vào MENU. Thêm trang mới: chỉ cần có <nav aria-label="Menu chính"></nav> trong trang.
 * Trang nào có <nav aria-label="Chân trang"></nav> thì chân trang cũng nhận cùng danh sách này. */
const fs = require('fs');
const path = require('path');

const GOC = path.join(__dirname, '..');
// [đường dẫn tính từ gốc kho, nhãn, thư mục hoặc trang được tô đậm khi đang ở đó]
const MENU = [
  ['tuvivietnam/frontend/index.html', 'Trang chủ'],
  ['tuvivietnam/frontend/la-so.html', 'Lập lá số'],
  ['tuvivietnam/frontend/con-giap.html', '12 con giáp'],
  ['xemngay/frontend/index.html', 'Xem ngày', 'xemngay/frontend/'],
  ['Tarot/frontend/index.html', 'Tarot', 'Tarot/frontend/'],
  ['zodiac/frontend/index.html', 'Hoàng đạo', 'zodiac/frontend/'],
  ['numerology/frontend/index.html', 'Số chủ đạo', 'numerology/frontend/'],
  ['tuvivietnam/frontend/tra-cuu/index.html', 'Tra cứu', 'tuvivietnam/frontend/tra-cuu/'],
  ['tuvivietnam/frontend/bai-viet.html', 'Bài viết', 'tuvivietnam/frontend/bai-viet'],
];
const THE_NAV = /<nav aria-label="Menu chính">[\s\S]*?<\/nav>/;
const THE_CHAN = /<nav aria-label="Chân trang">[\s\S]*?<\/nav>/;

// Trang ở thư mục con của frontend cũng có menu (trang bài viết sinh bởi scripts/bai-viet.js)
const THU_MUC_CON = ['tuvivietnam/frontend/bai-viet', 'tuvivietnam/frontend/tra-cuu'];
function cacTrang() {
  const html = d => fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.html')).map(f => path.join(d, f)) : [];
  return fs.readdirSync(GOC, { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(path.join(GOC, d.name, 'frontend')))
    .flatMap(d => html(path.join(GOC, d.name, 'frontend'))).concat(THU_MUC_CON.flatMap(d => html(path.join(GOC, d))));
}
function menuCho(trang, nhan = 'Menu chính') {
  const tuGoc = path.relative(GOC, trang).split(path.sep).join('/'), thuMuc = path.dirname(trang);
  const links = MENU.map(([dich, ten, vung]) => {
    const dangO = nhan === 'Menu chính' && (vung ? tuGoc.startsWith(vung) : tuGoc === dich);
    return `<a href="${path.relative(thuMuc, path.join(GOC, dich)).split(path.sep).join('/')}"${dangO ? ' aria-current="page"' : ''}>${ten}</a>`;
  });
  return `<nav aria-label="${nhan}">${links.join('')}</nav>`;
}

module.exports = { menuCho, MENU, GOC };
if (require.main !== module) return;

const kiemTra = process.argv.includes('--kiem-tra'), lech = [];
for (const trang of cacTrang()) {
  const s = fs.readFileSync(trang, 'utf8'), ten = path.relative(GOC, trang);
  if (!THE_NAV.test(s)) { lech.push(`${ten}: thiếu <nav aria-label="Menu chính">`); continue; }
  const moi = s.replace(THE_NAV, menuCho(trang)).replace(THE_CHAN, menuCho(trang, 'Chân trang'));
  if (moi === s) continue;
  if (kiemTra) lech.push(`${ten}: menu khác với scripts/menu.js`);
  else { fs.writeFileSync(trang, moi); console.log(`Đã cập nhật menu: ${ten}`); }
}
if (lech.length) { console.error(lech.join('\n') + (kiemTra ? '\nChạy: node scripts/menu.js' : '')); process.exit(1); }
if (kiemTra) console.log(`Menu khớp trên ${cacTrang().length} trang.`);
