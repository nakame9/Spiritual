/* Thư viện bài viết: tìm kiếm, bài liên quan, mục lục, sắp xếp, ảnh đại diện SVG.
 * Dùng chung cho trình duyệt (window.ThuVien), backend và scripts/bai-viet.js (sinh trang tĩnh). Cần thu-vien-du-lieu.js. */
(function (root) {
  'use strict';
  const D = (typeof module !== 'undefined' && module.exports) ? require('./thu-vien-du-lieu.js') : root.ThuVienDuLieu;
  const CM = Object.fromEntries(D.CHUYEN_MUC.map(c => [c.id, c]));

  /** Chữ thường, bỏ dấu, Đ → d: để tìm "tu vi" ra "Tử vi" */
  const khongDau = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const tach = s => khongDau(s).split(/[^a-z0-9]+/).filter(Boolean);
  const slugHoa = s => tach(s).join('-');
  // Từ quá phổ biến, bỏ khi so nội dung hai bài
  const BO_QUA = new Set(('va la cua co cac nhung mot cho trong khi thi de duoc nay do theo nhu tu ve voi khong nen hay '
    + 'nguoi ban cung moi da se lai ra vao nam ngay thang gio cach hai ba bon nam sau vi neu tung con nhieu it hon rat '
    + 'hoac nhung no minh deu tren duoi o den nhat mot cung').split(' '));

  const chu = b => [b.tieuDe, b.moTa, (b.the || []).join(' '), b.noiDung, b.viDu && b.viDu.noiDung, (b.hoiDap || []).flat().join(' ')].join(' ');
  /** Số phút đọc, 200 chữ một phút */
  const phutDoc = b => Math.max(1, Math.round(chu(b).split(/\s+/).length / 200));

  /** Tìm theo từ khóa (mọi từ đều phải có mặt) và chuyên mục. Có từ khóa thì xếp theo độ khớp: tiêu đề > từ khóa > mô tả > nội dung */
  function timKiem(ds, { q = '', cm = '' } = {}) {
    const tuKhoa = tach(q);
    let kq = ds.filter(b => !cm || b.chuyenMuc === cm);
    if (!tuKhoa.length) return kq;
    const diem = b => {
      const vung = [[khongDau(b.tieuDe), 6], [khongDau((b.the || []).join(' ')), 4], [khongDau(b.moTa), 2], [khongDau(chu(b)), 1]];
      let tong = 0;
      for (const t of tuKhoa) {
        const d = vung.reduce((s, [v, w]) => s + (v.includes(t) ? w : 0), 0);
        if (!d) return 0;
        tong += d;
      }
      // Cả cụm từ khóa nằm liền trong tiêu đề thì cộng thêm
      return tong + (khongDau(b.tieuDe).includes(tuKhoa.join(' ')) ? 5 : 0);
    };
    return kq.map(b => [b, diem(b)]).filter(x => x[1]).sort((a, b) => b[1] - a[1]).map(x => x[0]);
  }

  // Vector tần suất từ của nội dung (bỏ từ ngắn và từ phổ biến), chuẩn hóa để so cosine
  const vecCache = new WeakMap();
  function vec(b) {
    if (vecCache.has(b)) return vecCache.get(b);
    const m = new Map();
    for (const t of tach(chu(b))) if (t.length > 2 && !BO_QUA.has(t)) m.set(t, (m.get(t) || 0) + 1);
    const n = Math.sqrt([...m.values()].reduce((s, x) => s + x * x, 0)) || 1;
    for (const [k, v] of m) m.set(k, v / n);
    vecCache.set(b, m);
    return m;
  }
  const cosine = (a, b) => { let s = 0; for (const [k, v] of a) if (b.has(k)) s += v * b.get(k); return s; };

  /** Bài liên quan dựa trên nội dung đang đọc: từ khóa chung, cùng chuyên mục, độ giống nội dung */
  function lienQuan(bai, ds, n = 3) {
    const theA = new Set((bai.the || []).map(khongDau)), va = vec(bai);
    return ds.filter(b => b.slug !== bai.slug).map(b => {
      const chung = (b.the || []).filter(t => theA.has(khongDau(t))).length;
      return [b, chung * 0.6 + (b.chuyenMuc === bai.chuyenMuc ? 0.5 : 0) + cosine(va, vec(b)) * 3];
    }).sort((a, b) => b[1] - a[1] || a[0].slug.localeCompare(b[0].slug)).slice(0, n).map(x => x[0]);
  }

  /** Mục lục từ các tiêu đề ## của nội dung markdown */
  const mucLuc = md => String(md || '').split('\n').map(l => /^##\s+(.+)$/.exec(l.trim())).filter(Boolean).map(m => ({ id: slugHoa(m[1]), ten: m[1].replace(/\*\*/g, '') }));

  const moiNhat = ds => [...ds].sort((a, b) => (b.ngayDang || '').localeCompare(a.ngayDang || '') || (a.noiBat || 99) - (b.noiBat || 99));
  /** luot = { slug: số lượt đọc }. Chưa có lượt đọc thì theo thứ tự biên tập chọn (noiBat) */
  const phoBien = (ds, luot = {}) => [...ds].sort((a, b) => (luot[b.slug] || 0) - (luot[a.slug] || 0) || (a.noiBat || 99) - (b.noiBat || 99));
  const ngayVN = s => s ? s.split('-').reverse().join('/') : '';

  // ---------- Ảnh đại diện: SVG vẽ theo chuyên mục, chi tiết đổi theo slug để mỗi bài một ảnh ----------
  function hat(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0; return () => (h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0, h / 4294967296); }
  const r1 = x => Math.round(x * 10) / 10;
  const HINH = {
    'tu-vi': (r) => { // lá số 12 ô quanh thiên bàn, tô một ô
      const o = 46, x0 = 392, y0 = 88, k = Math.floor(r() * 12), vi = [[0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3]];
      return vi.map(([c, h], i) => `<rect x="${x0 + c * o}" y="${y0 + h * o}" width="${o}" height="${o}" class="${i === k ? 'nhan' : 'net'}"/>`).join('')
        + `<rect x="${x0 + o}" y="${y0 + o}" width="${2 * o}" height="${2 * o}" class="net"/><circle cx="${x0 + 2 * o}" cy="${y0 + 2 * o}" r="10" class="vang"/>`;
    },
    'con-giap': (r) => { // vòng 12 chi, tô ba tuổi tam hợp
      const k = Math.floor(r() * 4); let s = '<circle cx="484" cy="180" r="96" class="net"/><circle cx="484" cy="180" r="62" class="net"/>';
      for (let i = 0; i < 12; i++) { const a = (i * 30 - 90) * Math.PI / 180, x = 484 + 79 * Math.cos(a), y = 180 + 79 * Math.sin(a); s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="9" class="${i % 4 === k ? 'nhan' : 'net'}"/>`; }
      const p = [0, 4, 8].map(i => { const a = ((i + k) * 30 - 90) * Math.PI / 180; return `${r1(484 + 79 * Math.cos(a))},${r1(180 + 79 * Math.sin(a))}`; });
      return s + `<polygon points="${p.join(' ')}" class="duong"/>`;
    },
    'phong-thuy': (r) => { // ngũ giác tương sinh, ngôi sao tương khắc
      const g = r() * 72, d = [0, 1, 2, 3, 4].map(i => { const a = (i * 72 - 90 + g) * Math.PI / 180; return [r1(484 + 92 * Math.cos(a)), r1(180 + 92 * Math.sin(a))]; });
      return `<polygon points="${d.map(p => p.join(',')).join(' ')}" class="duong"/><polygon points="${[0, 2, 4, 1, 3].map(i => d[i].join(',')).join(' ')}" class="net gach"/>`
        + d.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="15" class="${i === 0 ? 'nhan' : 'nen-net'}"/>`).join('');
    },
    'chiem-tinh': (r) => { // vòng hoàng đạo 12 phần, vài hành tinh
      let s = '<circle cx="484" cy="180" r="100" class="net"/><circle cx="484" cy="180" r="76" class="net"/><circle cx="484" cy="180" r="28" class="net"/>';
      for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; s += `<line x1="${r1(484 + 76 * Math.cos(a))}" y1="${r1(180 + 76 * Math.sin(a))}" x2="${r1(484 + 100 * Math.cos(a))}" y2="${r1(180 + 100 * Math.sin(a))}" class="net"/>`; }
      const hanh = [0, 1, 2, 3].map(() => r() * 360);
      hanh.forEach((g, i) => { const a = g * Math.PI / 180; s += `<circle cx="${r1(484 + 52 * Math.cos(a))}" cy="${r1(180 + 52 * Math.sin(a))}" r="${i ? 5 : 8}" class="${i ? 'vang' : 'nhan'}"/>`; });
      const [a, b] = hanh.map(g => g * Math.PI / 180);
      return s + `<line x1="${r1(484 + 52 * Math.cos(a))}" y1="${r1(180 + 52 * Math.sin(a))}" x2="${r1(484 + 52 * Math.cos(b))}" y2="${r1(180 + 52 * Math.sin(b))}" class="duong"/>`;
    },
    'than-so-hoc': (r) => { // biểu đồ ngày sinh 3 × 3
      const so = [[3, 6, 9], [2, 5, 8], [1, 4, 7]], k = 1 + Math.floor(r() * 9);
      return so.flatMap((h, i) => h.map((n, j) => `<rect x="${406 + j * 52}" y="${102 + i * 52}" width="52" height="52" class="net"/><text x="${432 + j * 52}" y="${137 + i * 52}" class="${n === k ? 'chu-nhan' : 'chu'}">${n}</text>`)).join('');
    },
    'tarot': (r) => { // ba lá bài xòe
      const g = 6 + r() * 8;
      return [-1, 0, 1].map(i => `<g transform="rotate(${r1(i * g)} 484 290)"><rect x="452" y="84" width="64" height="112" rx="4" class="${i === 0 ? 'nen-net' : 'net'}"/>${i === 0 ? '<path d="M484 116l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" class="nhan"/>' : ''}</g>`).join('');
    },
    'lich-van-nien': (r) => { // Mặt Trời với 24 tia tiết khí, trăng khuyết
      let s = '<circle cx="470" cy="180" r="40" class="vang"/>';
      for (let i = 0; i < 24; i++) { const a = i * 15 * Math.PI / 180, l = i % 2 ? 66 : 80; s += `<line x1="${r1(470 + 50 * Math.cos(a))}" y1="${r1(180 + 50 * Math.sin(a))}" x2="${r1(470 + l * Math.cos(a))}" y2="${r1(180 + l * Math.sin(a))}" class="net"/>`; }
      const y = 90 + r() * 40;
      return s + `<path d="M575 ${r1(y)}a26 26 0 1 0 0 52a20 20 0 1 1 0-52z" class="nhan"/>`;
    },
    'kien-thuc': (r) => { // quyển sách mở
      const n = 4 + Math.floor(r() * 3); let s = '<path d="M484 110c-30-14-62-16-92-8v150c30-8 62-6 92 8c30-14 62-16 92-8V102c-30-8-62-6-92 8z" class="nen-net"/><line x1="484" y1="110" x2="484" y2="260" class="net"/>';
      for (let i = 0; i < n; i++) s += `<line x1="406" y1="${136 + i * 20}" x2="468" y2="${140 + i * 20}" class="net"/><line x1="500" y1="${140 + i * 20}" x2="562" y2="${136 + i * 20}" class="${i === 1 ? 'duong' : 'net'}"/>`;
      return s;
    },
  };
  /** SVG ảnh đại diện. Màu lấy từ biến CSS của site nên tự đổi theo chế độ sáng, tối */
  function anhBia(b) {
    const r = hat(b.slug), sao = Array.from({ length: 14 }, () => `<circle cx="${r1(24 + r() * 300)}" cy="${r1(20 + r() * 320)}" r="${r1(1 + r() * 2.2)}"/>`).join('');
    return `<svg class="anh-bia" viewBox="0 0 640 360" role="img" aria-label="Ảnh minh họa chuyên mục ${(CM[b.chuyenMuc] || {}).ten || ''}" preserveAspectRatio="xMidYMid slice">`
      + `<rect width="640" height="360" class="nen"/><g class="sao">${sao}</g><circle cx="484" cy="180" r="140" class="quang"/>${(HINH[b.chuyenMuc] || HINH['kien-thuc'])(r)}</svg>`;
  }

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /** Đường dẫn tới trang của bài, tính từ thư mục goc ('' ở tuvivietnam/frontend, '../' ở trang bài). Bài từ trang quản trị dùng trang đọc chung */
  const duongDan = (b, goc = '') => goc + (b.dong ? `bai-viet-doc.html#${encodeURIComponent(b.slug)}` : `bai-viet/${b.slug}.html`);
  /** Thẻ bài viết dùng ở thư viện và mục bài liên quan */
  function theBai(b, goc = '', yeuThich = false) {
    const cm = CM[b.chuyenMuc] || { ten: b.chuyenMuc };
    return `<li class="the" data-slug="${esc(b.slug)}"><a href="${esc(duongDan(b, goc))}"><figure class="anh">${anhBia(b)}</figure>`
      + `<span class="cm-nhan">${esc(cm.ten)}</span><h3>${esc(b.tieuDe)}</h3><p>${esc(b.moTa)}</p>`
      + `<span class="meta"><time datetime="${esc(b.capNhat || b.ngayDang)}">${ngayVN(b.capNhat || b.ngayDang)}</time> · ${b.phutDoc || phutDoc(b)} phút đọc</span></a>`
      + `<button type="button" class="luu" aria-pressed="${yeuThich}" aria-label="Lưu bài “${esc(b.tieuDe)}” vào yêu thích"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"/></svg></button></li>`;
  }

  const ThuVien = { CHUYEN_MUC: D.CHUYEN_MUC, CM, BAI: D.BAI, khongDau, slugHoa, phutDoc, timKiem, lienQuan, mucLuc, moiNhat, phoBien, ngayVN, anhBia, esc, duongDan, theBai };
  if (typeof module !== 'undefined' && module.exports) module.exports = ThuVien; else root.ThuVien = ThuVien;
})(typeof window !== 'undefined' ? window : globalThis);
