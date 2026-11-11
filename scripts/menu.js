#!/usr/bin/env node
/* Header và chân trang của cả site, sinh từ một nguồn (shared/dieu-huong.js).
 *   node scripts/menu.js            ghi lại header, chân trang và thẻ script dùng chung vào mọi trang trong các thư mục frontend
 *   node scripts/menu.js --kiem-tra báo lỗi nếu trang nào lệch (npm test ở gốc kho chạy lệnh này)
 * Thêm mục menu: sửa shared/dieu-huong.js. Thêm trang mới: chỉ cần có <header class="site"></header> và <footer class="foot"></footer>;
 * các dòng <p class="small"> riêng của trang trong chân trang (ghi công ảnh, ghi chú phương pháp) được giữ nguyên. */
const fs = require('fs');
const path = require('path');
const DH = require('../shared/dieu-huong.js');

const GOC = path.join(__dirname, '..');
const THU_MUC_CON = ['tuvivietnam/frontend/bai-viet', 'tuvivietnam/frontend/tra-cuu'];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Biểu tượng vẽ tay, cùng nét 1.6
const ICON = {
  logo: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17.5" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="20" cy="20" r="12.5" fill="none" stroke="currentColor" stroke-width="0.9" opacity=".7"/>'
    + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, c = Math.cos(a), s = Math.sin(a); return `<line x1="${(20 + 12.5 * c).toFixed(2)}" y1="${(20 + 12.5 * s).toFixed(2)}" x2="${(20 + 17.5 * c).toFixed(2)}" y2="${(20 + 17.5 * s).toFixed(2)}" stroke="currentColor" stroke-width="0.9" opacity=".7"/>`; }).join('')
    + '<path d="M20 11.5l1.9 6.6 6.6 1.9-6.6 1.9L20 28.5l-1.9-6.6-6.6-1.9 6.6-1.9z" fill="currentColor"/></svg>',
  tim: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M15.5 15.5 20.5 20.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  nguoi: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  dong: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  xuong: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const tuGocCua = trang => path.relative(GOC, trang).split(path.sep).join('/');
const den = (trang, dich) => { const [p, h] = dich.split('#'); return path.relative(path.dirname(trang), path.join(GOC, p)).split(path.sep).join('/') + (h ? '#' + h : ''); };

function headerCho(trang) {
  const tg = tuGocCua(trang), dangO = DH.nhomCua(tg), r = d => esc(den(trang, d));
  const muc = DH.NHOM.map(g => g.href
    ? `<li class="menu-muc${g.id === dangO ? ' dang-o' : ''}"><a href="${r(g.href)}"${tg === g.href ? ' aria-current="page"' : ''}>${g.ten}</a></li>`
    : `<li class="menu-muc${g.id === dangO ? ' dang-o' : ''}"><button type="button" aria-expanded="false" aria-controls="tha-${g.id}">${g.ten}${ICON.xuong}</button>`
      + `<div class="tha" id="tha-${g.id}"><ul>${g.muc.map(([d, t, m]) => `<li><a href="${r(d)}"${tg === d ? ' aria-current="page"' : ''}><b>${t}</b><span>${m}</span></a></li>`).join('')}</ul></div></li>`).join('');
  return `<header class="site">
    <div class="site-in">
      <a class="brand" href="${r(DH.TRANG.trangChu)}">${ICON.logo}<span class="brand-chu"><span class="brand-ten">Lá Số Tử Vi</span><span class="brand-phu">Tử vi, chiêm tinh, thần số học</span></span></a>
      <nav class="menu" id="menu-chinh" aria-label="Menu chính">
        <div class="menu-dau"><span>Lá Số Tử Vi</span><button type="button" class="nut-tron dong-menu" aria-label="Đóng menu">${ICON.dong}</button></div>
        <ul>${muc}</ul>
      </nav>
      <div class="site-phai">
        <a class="nut-tron mo-tim" href="${r(DH.TRANG.tim)}" aria-label="Tìm kiếm">${ICON.tim}</a>
        <a class="nut-tron" href="${r(DH.TRANG.taiKhoan)}" aria-label="Hồ sơ của tôi"${tg === DH.TRANG.taiKhoan ? ' aria-current="page"' : ''}>${ICON.nguoi}</a>
        <button type="button" class="nut-tron mo-menu" aria-label="Mở menu" aria-controls="menu-chinh" aria-expanded="false">${ICON.menu}</button>
      </div>
      <div class="o-tim" hidden><form action="${r(DH.TRANG.tim)}" role="search"><label class="visually-hidden" for="o-tim-q">Tìm công cụ hoặc bài viết</label><input type="search" id="o-tim-q" name="q" placeholder="Tìm công cụ, bài viết" autocomplete="off"><button class="go" type="submit">Tìm</button></form></div>
      <button type="button" class="menu-dong" tabindex="-1" aria-hidden="true"></button>
    </div>
  </header>`;
}

function footerCho(trang, ghiChu = []) {
  const r = d => esc(den(trang, d));
  const cot = (ten, ds) => `<div class="foot-cot"><h2>${ten}</h2><ul>${ds.map(([d, t]) => `<li><a href="${r(d)}">${t}</a></li>`).join('')}</ul></div>`;
  return `<footer class="foot">
    <div class="foot-in">
      <div class="foot-gioi-thieu">
        <a class="brand" href="${r(DH.TRANG.trangChu)}">${ICON.logo}<span class="brand-chu"><span class="brand-ten">Lá Số Tử Vi</span><span class="brand-phu">Tử vi, chiêm tinh, thần số học</span></span></a>
        <p>Nền tảng huyền học tổng hợp: tử vi phái Việt, lịch vạn niên, chiêm tinh phương Tây, thần số học và Tarot. Mỗi hệ tính theo phương pháp công khai, ngay trên máy bạn.</p>
      </div>
      <nav class="foot-cot-ds" aria-label="Chân trang">${DH.NHOM.filter(g => g.muc).map(g => cot(g.ten, g.muc)).join('')}${cot('Thông tin', DH.THONG_TIN)}</nav>
    </div>
    <div class="foot-duoi">
      <p class="tuyen-bo">Nội dung huyền học trên trang chỉ mang tính tham khảo, không thay thế tư vấn y tế, pháp lý hoặc tài chính chuyên môn.</p>
      ${ghiChu.join('\n      ')}
    </div>
  </footer>`;
}

const THE_HEADER = /<header class="site">[\s\S]*?<\/header>/;
const THE_FOOTER = /<footer class="foot">[\s\S]*?<\/footer>/;
/** Ghi header, chân trang và thẻ shared/site.js vào nội dung một trang */
function apDung(html, trang) {
  if (!THE_HEADER.test(html)) throw new Error(`${tuGocCua(trang)}: thiếu <header class="site">`);
  if (!THE_FOOTER.test(html)) throw new Error(`${tuGocCua(trang)}: thiếu <footer class="foot">`);
  const ghiChu = (html.match(THE_FOOTER)[0].match(/<p class="small"[\s\S]*?<\/p>/g) || []);
  let s = html.replace(THE_HEADER, () => headerCho(trang)).replace(THE_FOOTER, () => footerCho(trang, ghiChu));
  const js = den(trang, 'shared/site.js');
  if (!s.includes(`src="${js}"`)) s = s.replace(/(<link rel="stylesheet" href="[^"]*shared\/site\.css">)/, `$1\n<script src="${js}" defer></script>`);
  return s;
}

function cacTrang() {
  const html = d => fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.html')).map(f => path.join(d, f)) : [];
  return fs.readdirSync(GOC, { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(path.join(GOC, d.name, 'frontend')))
    .flatMap(d => html(path.join(GOC, d.name, 'frontend'))).concat(THU_MUC_CON.flatMap(d => html(path.join(GOC, d))));
}

module.exports = { headerCho, footerCho, apDung, GOC };
if (require.main !== module) return;

const kiemTra = process.argv.includes('--kiem-tra'), lech = [];
for (const trang of cacTrang()) {
  const s = fs.readFileSync(trang, 'utf8'), ten = tuGocCua(trang);
  let moi; try { moi = apDung(s, trang); } catch (e) { lech.push(e.message); continue; }
  if (moi === s) continue;
  if (kiemTra) lech.push(`${ten}: header hoặc chân trang khác với scripts/menu.js`);
  else { fs.writeFileSync(trang, moi); console.log(`Đã cập nhật: ${ten}`); }
}
// Mọi đường dẫn trong menu phải trỏ tới trang có thật
for (const g of DH.NHOM) for (const d of [g.href, ...(g.muc || []).map(m => m[0])].filter(Boolean)) if (!fs.existsSync(path.join(GOC, d))) lech.push(`shared/dieu-huong.js: không có trang ${d}`);
for (const [d] of DH.THONG_TIN) if (!fs.existsSync(path.join(GOC, d.split('#')[0]))) lech.push(`shared/dieu-huong.js: không có trang ${d}`);
if (lech.length) { console.error(lech.join('\n') + (kiemTra ? '\nChạy: node scripts/menu.js' : '')); process.exit(1); }
if (kiemTra) console.log(`Header và chân trang khớp trên ${cacTrang().length} trang.`);
