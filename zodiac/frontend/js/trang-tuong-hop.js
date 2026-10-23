/* Trang độ tương hợp: #a=bach-duong&b=thien-binh. Chọn cung hoặc nhập ngày sinh, xem điểm 3 mặt và bảng hợp với 12 cung. */
(function () {
  'use strict';
  const { $, CUNG, theoId, ky, nt, nho, ngayNgan } = UI;
  const opt = CUNG.map(c => `<option value="${c.id}">${c.kyHieu} ${c.ten} (${ngayNgan(c)})</option>`).join('');
  $('a').innerHTML = opt; $('b').innerHTML = opt;
  const q = new URLSearchParams(location.hash.slice(1));
  $('a').value = theoId[q.get('a')] ? q.get('a') : (nho.lay() || 'bach-duong');
  $('b').value = theoId[q.get('b')] ? q.get('b') : 'thien-binh';

  function ve() {
    const A = theoId[$('a').value], B = theoId[$('b').value], r = LuanGiai.tuongHop(A.so, B.so);
    history.replaceState(null, '', `#a=${A.id}&b=${B.id}`);
    $('kq').innerHTML = `<div class="th-dau"><div class="ben ${nt(A)}">${ky(A)}<b>${A.ten}</b></div>
        <div class="vong" style="--p:${r.diem.tong}"><span>${r.diem.tong}%</span></div><div class="ben ${nt(B)}">${ky(B)}<b>${B.ten}</b></div></div>
      <p class="chu-de"><b>${r.khoang.ten}:</b> ${r.khoang.moTa}</p>
      <div class="lv-grid ba">${r.mat.map(x => `<div class="lv"><div class="lv-dau"><b>${x.ten}</b><span>${x.diem}%</span></div>
        <div class="thanh"><i style="width:${x.diem}%"></i></div><p><b>${x.nhan}.</b> ${x.loi}</p></div>`).join('')}</div>
      <h3 style="margin: 4px 0 0; font-family: var(--f-display); font-size: 20px">Phong cách yêu của mỗi người</h3>
      <div class="hai-cot">${[A, B].map(X => `<div class="o-nho ${nt(X)}" style="border-top: 3px solid var(--nt)"><h3>${X.kyHieu} ${X.ten}</h3><p>${X.tinhYeu.phongCach}</p><p style="margin-top: 8px"><b>Cần:</b> ${X.tinhYeu.canGi.replace(/^Họ cần /, '')}</p></div>`).join('')}</div>
      <p class="ket-hop">${r.loiKhuyen}</p>`;
    const ds = CUNG.map(x => ({ x, r: LuanGiai.tuongHop(A.so, x.so) })).sort((u, v) => v.r.diem.tong - u.r.diem.tong);
    $('bang').innerHTML = `<h2 id="h-bang">${A.ten} hợp với cung nào?</h2><p class="muted">Xếp từ hợp nhất. Bấm vào một cung để xem chi tiết.</p>
      <div style="overflow-x: auto"><table class="bang-hop"><thead><tr><th>Cung</th><th>Tình yêu</th><th>Tình bạn</th><th>Công việc</th><th>Chung</th></tr></thead><tbody>
      ${ds.map(({ x, r: k }) => `<tr class="${nt(x)}"><td><a href="#a=${A.id}&b=${x.id}">${ky(x)}${x.ten}</a></td><td class="so">${k.diem.tinhYeu}%</td><td class="so">${k.diem.banBe}%</td><td class="so">${k.diem.congViec}%</td><td class="so">${k.diem.tong}%</td></tr>`).join('')}
      </tbody></table></div>`;
  }
  const theoNgay = (o, el) => { const [y, m, d] = o.value.split('-').map(Number); if (y >= 1900) { el.value = LuanGiai.cungTheoBang(m, d).id; ve(); } };
  $('a').addEventListener('change', () => { nho.dat($('a').value); ve(); });
  $('b').addEventListener('change', ve);
  $('na').addEventListener('change', e => theoNgay(e.target, $('a')));
  $('nb').addEventListener('change', e => theoNgay(e.target, $('b')));
  addEventListener('hashchange', () => { const p = new URLSearchParams(location.hash.slice(1)); if (theoId[p.get('a')]) $('a').value = p.get('a'); if (theoId[p.get('b')]) $('b').value = p.get('b'); ve(); });
  ve();
})();
