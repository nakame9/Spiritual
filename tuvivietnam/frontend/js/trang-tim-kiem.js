/* Trang tìm kiếm: tìm trong các công cụ (shared/dieu-huong.js) và bài viết (thư viện), không phân biệt dấu. Từ khóa nằm trong ?q= */
(function () {
  'use strict';
  const $ = id => document.getElementById(id), { esc, khongDau } = ThuVien;
  const den = d => '../../' + d; // trang này ở tuvivietnam/frontend/
  const CONG_CU = DieuHuong.NHOM.flatMap(g => (g.muc || []).map(([d, t, m, k]) => ({ d, t, m, nhom: g.ten, chu: khongDau(`${t} ${m} ${k || ''} ${g.ten}`) })));
  function tim(q) {
    const tu = khongDau(q).split(/[^a-z0-9]+/).filter(Boolean);
    const cc = tu.length ? CONG_CU.map(c => [c, tu.filter(t => c.chu.includes(t)).length + (khongDau(c.t).includes(tu.join(' ')) ? 2 : 0)]).filter(x => x[1] >= tu.length).sort((a, b) => b[1] - a[1]).map(x => x[0]) : CONG_CU;
    const bv = tu.length ? ThuVien.timKiem(ThuVien.BAI, { q }) : ThuVien.moiNhat(ThuVien.BAI).slice(0, 6);
    $('kq-cc').innerHTML = cc.map(c => `<li><a href="${esc(den(c.d))}"><span class="nhom-kq">${esc(c.nhom)}</span><b>${esc(c.t)}</b><span>${esc(c.m)}</span></a></li>`).join('');
    $('kq-bv').innerHTML = bv.slice(0, 12).map(b => `<li><a href="${esc(ThuVien.duongDan(b))}"><span class="nhom-kq">${esc(ThuVien.CM[b.chuyenMuc].ten)}</span><b>${esc(b.tieuDe)}</b><span>${esc(b.moTa)}</span></a></li>`).join('');
    $('trong').hidden = !!(cc.length || bv.length);
    $('trong').textContent = `Không tìm thấy công cụ hay bài viết nào cho “${q}”. Thử từ khác, ví dụ “lá số”, “tuổi”, “Tarot”.`;
    document.title = q ? `Tìm “${q}” · Lá Số Tử Vi` : 'Tìm kiếm · Lá Số Tử Vi';
  }
  const q0 = new URLSearchParams(location.search).get('q') || '';
  $('q').value = q0; tim(q0);
  $('f-tim').addEventListener('submit', e => { e.preventDefault(); const q = $('q').value.trim(); history.replaceState(null, '', q ? `?q=${encodeURIComponent(q)}` : location.pathname); tim(q); });
  let hen; $('q').addEventListener('input', () => { clearTimeout(hen); hen = setTimeout(() => tim($('q').value.trim()), 150); });
})();
