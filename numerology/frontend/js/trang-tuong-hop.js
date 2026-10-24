/* Trang so sánh hai số chủ đạo: #a=6&b=9. Chọn số hoặc nhập ngày sinh, xem mức hợp và bảng hợp với các số khác. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const CAC_SO = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22];
  const opt = CAC_SO.map(n => `<option value="${n}">Số ${SoHoc.hienSo(n)}: ${SoHoc.SO_CHU_DAO[n].ten}</option>`).join('');
  $('a').innerHTML = opt; $('b').innerHTML = opt;
  const docHash = () => { const q = new URLSearchParams(location.hash.slice(1)); for (const k of ['a', 'b']) if (SoHoc.SO_CHU_DAO[q.get(k)]) $(k).value = q.get(k); };
  $('a').value = '6'; $('b').value = '9'; docHash();

  function ve() {
    const a = Number($('a').value), b = Number($('b').value), r = SoHoc.tuongHop(a, b);
    history.replaceState(null, '', `#a=${a}&b=${b}`);
    $('kq').innerHTML = `<div class="th-dau"><div class="ben"><b>${r.a.hien}</b><span class="muted">${r.a.ten}</span></div>
        <div class="vong" style="--p:${r.phanTram}"><span>${r.phanTram}%</span></div><div class="ben"><b>${r.b.hien}</b><span class="muted">${r.b.ten}</span></div></div>
      <p class="ket"><b>${r.muc}:</b> ${r.moTa}${r.ghiChu ? ` <span class="muted">${r.ghiChu}</span>` : ''}</p>
      <div class="hai-cot">${[r.a, r.b].map((x, i) => `<div class="o-nho"><h3>${i ? 'Người ấy' : 'Bạn'}: số ${x.hien}, mặt phẳng ${x.matPhang}</h3><p><b>Khi yêu:</b> ${x.tinhYeu}</p><p style="margin-top: 8px"><b>Khi trò chuyện:</b> ${x.giaoTiep}</p></div>`).join('')}</div>
      <p class="ket"><b>Lời khuyên:</b> ${r.loiKhuyen}</p>`;
    const ds = CAC_SO.map(n => SoHoc.tuongHop(a, n)).sort((u, v) => v.phanTram - u.phanTram);
    $('bang').innerHTML = `<h2 id="h-bang">Số ${r.a.hien} hợp với số nào?</h2><p class="muted">Xếp từ hợp nhất. Bấm vào một số để xem chi tiết.</p>
      <div style="overflow-x: auto"><table class="bang-hop"><thead><tr><th>Số chủ đạo</th><th>Mức</th><th>Độ hợp</th></tr></thead><tbody>
      ${ds.map(x => `<tr><td><a href="#a=${a}&b=${x.b.so}">Số ${x.b.hien}: ${x.b.ten}</a></td><td>${x.muc}</td><td class="so">${x.phanTram}%</td></tr>`).join('')}</tbody></table></div>`;
  }
  const theoNgay = (o, el) => { const [y, m, d] = o.value.split('-').map(Number); if (y >= 1900 && y <= 2100) { el.value = SoHoc.soChuDao(d, m, y).so; ve(); } };
  $('a').addEventListener('change', ve);
  $('b').addEventListener('change', ve);
  $('na').addEventListener('change', e => theoNgay(e.target, $('a')));
  $('nb').addEventListener('change', e => theoNgay(e.target, $('b')));
  addEventListener('hashchange', () => { docHash(); ve(); });
  ve();
})();
