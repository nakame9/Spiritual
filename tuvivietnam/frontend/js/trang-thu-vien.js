/* Trang thư viện bài viết: tìm theo từ khóa, lọc chuyên mục, sắp xếp mới nhất / phổ biến, bài yêu thích.
 * Trạng thái nằm trong địa chỉ (#cm=tu-vi&q=tiet+khi&yt=1) để gửi cho người khác được. Có backend thì thêm bài từ trang quản trị và lượt đọc. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const { CHUYEN_MUC, CM, timKiem, moiNhat, phoBien, theBai, esc, slugHoa } = ThuVien;
  let ds = ThuVien.BAI.slice(), luot = {};
  const st = { q: '', cm: '', yt: false, sap: 'moi' };

  // Link cũ bai-viet.html#tu-vi-la-gi (khi ba bài đầu còn chung một trang): chuyển sang trang riêng của bài
  const chuyenCu = () => {
    const h = decodeURIComponent(location.hash.slice(1)), cu = h && !h.includes('=') && ds.find(b => b.slug === h || (b.cu || []).includes(h));
    if (cu) location.replace(`bai-viet/${cu.slug}.html`);
    return !!cu;
  };
  if (chuyenCu()) return;

  function docHash() {
    const p = new URLSearchParams(location.hash.slice(1));
    st.q = p.get('q') || ''; st.cm = CM[p.get('cm')] ? p.get('cm') : ''; st.yt = p.get('yt') === '1';
    st.sap = ['moi', 'pho-bien', 'khop'].includes(p.get('sap')) ? p.get('sap') : (st.q ? 'khop' : 'moi');
    $('q').value = st.q; $('sap').value = st.sap;
  }
  function ghiHash() {
    const p = new URLSearchParams();
    if (st.cm) p.set('cm', st.cm); if (st.q) p.set('q', st.q); if (st.yt) p.set('yt', '1'); if (st.sap !== (st.q ? 'khop' : 'moi')) p.set('sap', st.sap);
    history.replaceState(null, '', p.toString() ? '#' + p : location.pathname + location.search);
  }

  function ve() {
    const yt = YeuThich.doc();
    // Đếm theo chuyên mục trên kết quả tìm kiếm hiện tại (chưa lọc chuyên mục)
    const theoQ = timKiem(ds, { q: st.q }).filter(b => !st.yt || yt.includes(b.slug));
    $('loc').hidden = false;
    $('loc').innerHTML = [{ id: '', ten: 'Tất cả' }, ...CHUYEN_MUC].map(c => `<button type="button" data-cm="${c.id}" aria-pressed="${st.cm === c.id}">${esc(c.ten)}<span>${theoQ.filter(b => !c.id || b.chuyenMuc === c.id).length}</span></button>`).join('');

    let kq = theoQ.filter(b => !st.cm || b.chuyenMuc === st.cm);
    if (st.sap === 'moi' || (st.sap === 'khop' && !st.q)) kq = moiNhat(kq);
    else if (st.sap === 'pho-bien') kq = phoBien(kq, luot);
    $('ds-bai').innerHTML = kq.map(b => theBai(b, '', yt.includes(b.slug))).join('');

    const cm = CM[st.cm];
    $('h-kq').textContent = st.yt ? 'Bài yêu thích' : st.q ? `Kết quả cho “${st.q}”` : cm ? cm.ten : 'Tất cả bài viết';
    $('cm-mo-ta').hidden = !cm; $('cm-mo-ta').textContent = cm ? cm.moTa : '';
    $('dem').textContent = `${kq.length} bài${cm && (st.q || st.yt) ? ` trong chuyên mục ${cm.ten}` : ''}.`;
    $('chi-yt').hidden = !yt.length && !st.yt;
    $('chi-yt').setAttribute('aria-pressed', String(st.yt)); $('chi-yt').textContent = `Bài yêu thích (${yt.length})`;
    $('trong').hidden = !!kq.length;
    $('trong').textContent = st.yt && !yt.length ? 'Bạn chưa lưu bài nào. Bấm ngôi sao trên một bài để lưu.'
      : `Không có bài nào khớp${st.q ? ` với “${st.q}”` : ''}${cm ? ` trong chuyên mục ${cm.ten}` : ''}. Thử bỏ bớt từ khóa hoặc chọn “Tất cả”.`;
    const muc = b => `<li><a href="${esc(ThuVien.duongDan(b))}">${esc(b.tieuDe)}</a><span class="meta">${esc((CM[b.chuyenMuc] || {}).ten || '')} · ${b.phutDoc || ThuVien.phutDoc(b)} phút đọc</span></li>`;
    $('moi-nhat').innerHTML = moiNhat(ds).slice(0, 5).map(muc).join('');
    $('pho-bien').innerHTML = phoBien(ds, luot).slice(0, 5).map(muc).join('');
  }

  let hen;
  $('q').addEventListener('input', () => { clearTimeout(hen); hen = setTimeout(() => { const coQ = !!st.q; st.q = $('q').value.trim(); if (!!st.q !== coQ && st.sap !== 'pho-bien') st.sap = st.q ? 'khop' : 'moi'; $('sap').value = st.sap; ghiHash(); ve(); }, 150); });
  $('f-tim').addEventListener('submit', e => { e.preventDefault(); clearTimeout(hen); st.q = $('q').value.trim(); ghiHash(); ve(); $('h-kq').scrollIntoView({ block: 'start' }); });
  $('sap').addEventListener('change', () => { st.sap = $('sap').value; ghiHash(); ve(); });
  $('loc').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; st.cm = b.dataset.cm; ghiHash(); ve(); });
  $('chi-yt').addEventListener('click', () => { st.yt = !st.yt; ghiHash(); ve(); });
  $('ds-bai').addEventListener('click', e => {
    const b = e.target.closest('.luu'); if (!b) return;
    YeuThich.doi(b.closest('.the').dataset.slug);
    if (st.yt) ve(); else { b.setAttribute('aria-pressed', String(YeuThich.doc().includes(b.closest('.the').dataset.slug))); $('chi-yt').hidden = false; $('chi-yt').textContent = `Bài yêu thích (${YeuThich.doc().length})`; }
  });
  addEventListener('hashchange', () => { if (!chuyenCu()) { docHash(); ve(); } });
  docHash(); ve();

  // Có backend: lượt đọc cho "Phổ biến" và bài viết thêm từ trang quản trị (bỏ bài trùng với thư viện)
  layApi('/api/bai-viet/luot-xem').then(x => { luot = x || {}; $('pb-ghi-chu').textContent = 'Xếp theo lượt đọc ghi nhận trên máy chủ của trang.'; ve(); }).catch(() => {});
  layApi('/api/bai-viet').then(them => {
    const co = new Set(ds.flatMap(b => [b.slug, ...(b.cu || [])]));
    const cmTheoTen = Object.fromEntries(CHUYEN_MUC.map(c => [slugHoa(c.ten), c.id]));
    const moi = them.filter(b => !co.has(b.slug)).map(b => ({ slug: b.slug, tieuDe: b.tieuDe, moTa: b.tomTat, chuyenMuc: cmTheoTen[slugHoa(b.chuyenMuc)] || 'kien-thuc',
      ngayDang: (b.taoLuc || '').slice(0, 10), capNhat: (b.taoLuc || '').slice(0, 10), phutDoc: b.phutDoc, the: [], noiDung: '', dong: true }));
    if (moi.length) { ds = ds.concat(moi); ve(); }
  }).catch(() => {});
})();
