#!/usr/bin/env node
/* Sinh trang tĩnh cho Thư viện bài viết từ tuvivietnam/frontend/js/thu-vien-du-lieu.js:
 *   - tuvivietnam/frontend/bai-viet/<slug>.html: mỗi bài một trang (mục lục, nội dung, ví dụ, hỏi đáp, nguồn, bài liên quan, dữ liệu có cấu trúc cho máy tìm kiếm)
 *   - danh sách thẻ bài, Mới nhất, Phổ biến trong bai-viet.html và "Bài viết mới" ở trang chủ (giữa các dấu <!-- ten:bat-dau --> ... <!-- ten:ket-thuc -->)
 *   - sitemap.xml ở gốc kho
 *   node scripts/bai-viet.js            ghi lại các tệp
 *   node scripts/bai-viet.js --kiem-tra báo lỗi nếu tệp nào chưa cập nhật (npm test ở gốc kho chạy lệnh này) */
const fs = require('fs');
const path = require('path');
const { apDung, GOC } = require('./menu.js');
const TV = require('../tuvivietnam/frontend/js/thu-vien.js');
const Markdown = require('../tuvivietnam/frontend/js/markdown.js');

const SITE = 'https://nakame9.github.io/Spiritual';
const FE = path.join(GOC, 'tuvivietnam/frontend'), THU_MUC = path.join(FE, 'bai-viet');
const { esc, CM, ngayVN } = TV;
const BAI = TV.BAI.map(b => Object.assign({}, b, { phutDoc: TV.phutDoc(b) }));
const url = p => `${SITE}/${p}`;
// Đường dẫn tính từ tuvivietnam/frontend; trong trang bài (ở bai-viet/) thì thêm ../
const tuTrangBai = u => /^https?:/.test(u) ? u : '../' + u;
const json = o => JSON.stringify(o, null, 1).replace(/</g, '\\u003c');

function trangBai(b) {
  const cm = CM[b.chuyenMuc], ml = TV.mucLuc(b.noiDung), lq = TV.lienQuan(b, BAI, 3);
  const dauTrang = `${SITE}/tuvivietnam/frontend/bai-viet/${b.slug}.html`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: b.tieuDe, description: b.moTa, inLanguage: 'vi', articleSection: cm.ten,
      datePublished: b.ngayDang, dateModified: b.capNhat, keywords: b.the.join(', '), mainEntityOfPage: dauTrang,
      author: { '@type': 'Organization', name: 'Lá Số Tử Vi', url: url('') }, publisher: { '@type': 'Organization', name: 'Lá Số Tử Vi', url: url('') } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: b.hoiDap.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bài viết', item: url('tuvivietnam/frontend/bai-viet.html') },
      { '@type': 'ListItem', position: 2, name: cm.ten, item: url(`tuvivietnam/frontend/bai-viet.html#cm=${cm.id}`) },
      { '@type': 'ListItem', position: 3, name: b.tieuDe, item: dauTrang }] },
  ];
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(b.tieuDe)} · Lá Số Tử Vi</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(b.moTa)}">
<meta name="keywords" content="${esc(b.the.join(', '))}">
<link rel="canonical" href="${dauTrang}">
<meta property="og:type" content="article">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="Lá Số Tử Vi">
<meta property="og:title" content="${esc(b.tieuDe)}">
<meta property="og:description" content="${esc(b.moTa)}">
<meta property="og:url" content="${dauTrang}">
<meta property="article:published_time" content="${b.ngayDang}">
<meta property="article:modified_time" content="${b.capNhat}">
<meta property="article:section" content="${esc(cm.ten)}">
<link rel="stylesheet" href="../../../shared/site.css">
<link rel="stylesheet" href="../css/bai-viet.css">
<script type="application/ld+json">${json(ld)}</script>
</head>
<body>
<!-- Trang sinh tự động bởi scripts/bai-viet.js từ js/thu-vien-du-lieu.js. Sửa nội dung ở đó rồi chạy lại lệnh, đừng sửa tệp này. -->
<div class="wrap">
  <header class="site"></header>

  <nav class="duong-dan" aria-label="Đường dẫn"><a href="../bai-viet.html">Bài viết</a><span aria-hidden="true">/</span><a href="../bai-viet.html#cm=${cm.id}">${esc(cm.ten)}</a></nav>
  <header class="dau-bai mot-bai">
    <div>
      <p class="cm-nhan">${esc(cm.ten)}</p>
      <h1>${esc(b.tieuDe)}</h1>
      <p class="lede">${esc(b.moTa)}</p>
      <p class="meta">Cập nhật <time datetime="${b.capNhat}">${ngayVN(b.capNhat)}</time> · ${b.phutDoc} phút đọc</p>
      <button type="button" class="btn2 luu-bai" data-slug="${b.slug}" aria-pressed="false">Lưu vào yêu thích</button>
    </div>
    <figure class="anh anh-dai-dien">${TV.anhBia(b)}</figure>
  </header>

  <div class="layout">
    <nav class="toc" aria-label="Mục lục">
      <p>Mục lục</p>
${ml.map(m => `      <a href="#${m.id}">${esc(m.ten)}</a>`).join('\n')}
      <a href="#vi-du">Ví dụ minh họa</a>
      <a href="#hoi-dap">Câu hỏi thường gặp</a>
      <a href="#nguon">Nguồn tham khảo</a>
    </nav>

    <div class="articles">
      <article class="bai">
${Markdown.render(b.noiDung, { capDau: 2 })}
        <section class="vi-du" id="vi-du" aria-labelledby="h-vi-du">
          <h2 id="h-vi-du">Ví dụ minh họa</h2>
          <h3>${esc(b.viDu.tieuDe)}</h3>
${Markdown.render(b.viDu.noiDung, { capDau: 3 })}
        </section>
        <div class="try"><p>Thử ngay với thông tin của bạn.</p><a class="btn primary" href="${esc(tuTrangBai(b.congCu[1]))}">${esc(b.congCu[0])}</a></div>
        <section id="hoi-dap" aria-labelledby="h-hoi-dap">
          <h2 id="h-hoi-dap">Câu hỏi thường gặp</h2>
${b.hoiDap.map(([q, a]) => `          <details class="hoi"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
        </section>
        <section id="nguon" aria-labelledby="h-nguon">
          <h2 id="h-nguon">Nguồn tham khảo</h2>
          <ol class="nguon">
${b.nguon.map(([ten, u]) => `            <li>${u ? `<a href="${esc(tuTrangBai(u))}"${/^https?:/.test(u) ? ' rel="noopener" target="_blank"' : ''}>${esc(ten)}</a>` : esc(ten)}</li>`).join('\n')}
          </ol>
        </section>
        <p class="cap-nhat">Đăng ngày <time datetime="${b.ngayDang}">${ngayVN(b.ngayDang)}</time> · Cập nhật lần cuối <time datetime="${b.capNhat}">${ngayVN(b.capNhat)}</time>. Nội dung do Lá Số Tử Vi biên soạn, chỉ để tham khảo.</p>
      </article>

      <section class="lien-quan" aria-labelledby="h-lq">
        <h2 id="h-lq">Bài viết liên quan</h2>
        <ul class="the-bai">
${lq.map(x => '          ' + TV.theBai(x, '../')).join('\n')}
        </ul>
        <a class="btn2" href="../bai-viet.html">Tất cả bài viết</a>
      </section>
    </div>
  </div>

  <footer class="foot"></footer>
</div>
<script src="../js/api.js"></script>
<script src="../js/yeu-thich.js"></script>
<script src="../js/trang-bai.js"></script>
</body>
</html>
`;
}

const giua = (s, ten, moi) => {
  const re = new RegExp(`(<!-- ${ten}:bat-dau -->)[\\s\\S]*?(\\s*<!-- ${ten}:ket-thuc -->)`);
  if (!re.test(s)) throw new Error(`Thiếu dấu <!-- ${ten}:bat-dau --> ... <!-- ${ten}:ket-thuc -->`);
  return s.replace(re, (m, a, b) => `${a}\n${moi}${b}`);
};
const muc = (b, goc) => `<li><a href="${goc}bai-viet/${b.slug}.html">${esc(b.tieuDe)}</a><span class="meta">${esc(CM[b.chuyenMuc].ten)} · ${b.phutDoc} phút đọc</span></li>`;

function sitemap() {
  const tinh = fs.readdirSync(GOC, { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(path.join(GOC, d.name, 'frontend')))
    .flatMap(d => fs.readdirSync(path.join(GOC, d.name, 'frontend')).filter(f => f.endsWith('.html')).map(f => `${d.name}/frontend/${f}`))
    .concat(fs.readdirSync(path.join(GOC, 'tuvivietnam/frontend/tra-cuu')).filter(f => f.endsWith('.html')).map(f => `tuvivietnam/frontend/tra-cuu/${f}`))
    .filter(p => !/noindex/.test(fs.readFileSync(path.join(GOC, p), 'utf8'))).sort();
  const dong = [...tinh.map(p => `  <url><loc>${url(p)}</loc></url>`),
    ...BAI.map(b => `  <url><loc>${url(`tuvivietnam/frontend/bai-viet/${b.slug}.html`)}</loc><lastmod>${b.capNhat}</lastmod></url>`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${dong.join('\n')}\n</urlset>\n`;
}

const tep = new Map();
for (const b of BAI) { const f = path.join(THU_MUC, b.slug + '.html'); tep.set(f, apDung(trangBai(b), f)); }
const tv = path.join(FE, 'bai-viet.html'), tc = path.join(FE, 'index.html');
tep.set(tv, [['danh-sach', TV.moiNhat(BAI).map(b => '        ' + TV.theBai(b)).join('\n')],
  ['moi-nhat', TV.moiNhat(BAI).slice(0, 5).map(b => '          ' + muc(b, '')).join('\n')],
  ['pho-bien', TV.phoBien(BAI).slice(0, 5).map(b => '          ' + muc(b, '')).join('\n')]]
  .reduce((s, [ten, moi]) => giua(s, ten, moi), fs.readFileSync(tv, 'utf8')));
tep.set(tc, giua(fs.readFileSync(tc, 'utf8'), 'bai-moi', [...BAI].sort((a, b) => a.noiBat - b.noiBat).filter((b, i, ds) => ds.findIndex(x => x.chuyenMuc === b.chuyenMuc) === i).slice(0, 4).map(b =>
  `      <li><a class="bv" href="bai-viet/${b.slug}.html"><figure class="anh">${TV.anhBia(b)}</figure><h3>${esc(b.tieuDe)}</h3><span class="meta">${esc(CM[b.chuyenMuc].ten)}, ${b.phutDoc} phút đọc</span></a></li>`).join('\n')));
tep.set(path.join(GOC, 'sitemap.xml'), sitemap());

const kiemTra = process.argv.includes('--kiem-tra'), lech = [];
const thua = fs.existsSync(THU_MUC) ? fs.readdirSync(THU_MUC).map(f => path.join(THU_MUC, f)).filter(f => !tep.has(f)) : [];
for (const f of thua) { if (kiemTra) lech.push(`${path.relative(GOC, f)}: không còn bài tương ứng`); else { fs.unlinkSync(f); console.log(`Đã xóa ${path.relative(GOC, f)}`); } }
fs.mkdirSync(THU_MUC, { recursive: true });
for (const [f, s] of tep) {
  if (fs.existsSync(f) && fs.readFileSync(f, 'utf8') === s) continue;
  if (kiemTra) lech.push(`${path.relative(GOC, f)}: chưa cập nhật`);
  else { fs.writeFileSync(f, s); console.log(`Đã ghi ${path.relative(GOC, f)}`); }
}
if (lech.length) { console.error(lech.join('\n') + '\nChạy: node scripts/bai-viet.js'); process.exit(1); }
if (kiemTra) console.log(`Thư viện bài viết khớp: ${BAI.length} bài.`);
