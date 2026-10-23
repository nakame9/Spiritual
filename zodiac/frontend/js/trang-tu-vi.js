/* Trang tử vi theo cung: ngày, tuần, tháng, năm. Địa chỉ #bo-cap hoặc #bo-cap/tuan để chia sẻ. */
(function () {
  'use strict';
  const { $, CUNG, theoId, sao, ky, nt, nho, homNay } = UI;
  const KY = ['ngay', 'tuan', 'thang', 'nam'];
  const hai = n => String(n).padStart(2, '0');
  const [h1, h2] = decodeURIComponent(location.hash.slice(1)).split('/');
  const st = { cung: theoId[h1] ? h1 : (nho.lay() || 'bach-duong'), ky: KY.includes(h2) ? h2 : 'ngay', ngay: homNay() };

  $('chon').innerHTML = CUNG.map(c => `<label class="${nt(c)}"><input type="radio" name="cung" value="${c.id}"><span>${ky(c)}${c.ten}</span></label>`).join('');
  const NGHICH = { 'Sao Thủy': 'giao tiếp, giấy tờ, máy móc dễ trục trặc; hợp để xem lại việc cũ', 'Sao Kim': 'tình cảm và chi tiêu cần chậm lại; người cũ dễ quay lại', 'Sao Hỏa': 'năng lượng hành động chững lại; tránh nóng vội và tranh cãi' };
  const lvGrid = ds => `<div class="lv-grid">${ds.map(l => `<div class="lv"><div class="lv-dau"><b>${l.ten}</b>${sao(l.sao)}</div><p>${l.loi}</p></div>`).join('')}</div>`;
  const suKien = (tieuDe, ds) => ds.length ? `<div><h3 class="muted" style="margin: 0 0 8px">${tieuDe}</h3><ul class="su-kien">${ds.map(([t, x]) => `<li><time>${t}</time><span>${x}</span></li>`).join('')}</ul></div>` : '';
  const nghich = ds => suKien('Hành tinh nghịch hành', ds.map(x => [`${x.tu.slice(0, 5)} → ${x.den ? x.den.slice(0, 5) : '…'}`, `${x.sao} nghịch hành${x.den ? ` tới ${x.den}` : ''}: ${NGHICH[x.sao]}.`]));

  function ve() {
    const c = theoId[st.cung], s = c.so, { y, m, d } = st.ngay;
    document.querySelector(`input[name="cung"][value="${st.cung}"]`).checked = true;
    document.querySelectorAll('#ky button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ky === st.ky)));
    $('ngay').value = `${y}-${hai(m)}-${hai(d)}`;
    nho.dat(st.cung);
    history.replaceState(null, '', `#${st.cung}${st.ky === 'ngay' ? '' : '/' + st.ky}`);
    let tieuDe, than;
    if (st.ky === 'ngay') {
      const r = LuanGiai.tuViNgay(s, y, m, d), dc = r.matTrang.doiCung;
      tieuDe = `${r.thu}, ${r.ngay}`;
      than = `<p class="chu-de">${r.chuDe}${dc ? ` Mặt Trăng vào ${dc.cung} (nhà ${dc.nha} của bạn) lúc ${dc.luc}.` : ` Mặt Trăng ở ${r.matTrang.cung} cả ngày.`}</p>
        ${r.luuY ? `<p class="canh-bao">${r.luuY}</p>` : ''}${lvGrid(r.linhVuc)}
        <div class="hai-cot"><div class="o-nho"><h3>Nên làm</h3><ul>${r.nenLam.map(x => `<li>${x}</li>`).join('')}</ul></div>
        <div class="o-nho"><h3>Màu hợp hôm nay</h3><p>${r.mau.charAt(0).toUpperCase() + r.mau.slice(1)}, theo nguyên tố của cung Mặt Trăng đang đi qua (${r.matTrang.cung}).</p></div></div>`;
      tieuDe += ` <span class="muted" style="font-family: var(--f-ui); font-size: 14px; font-weight: 500">Tổng quan</span> ${sao(Math.round(r.tong))}`;
    } else if (st.ky === 'tuan') {
      const r = LuanGiai.tuViTuan(s, y, m, d);
      tieuDe = `Tuần ${r.tu.slice(0, 5)} – ${r.den}`;
      than = `<p class="chu-de">${r.chuDe}</p>${lvGrid(r.linhVuc)}
        <div class="hai-cot"><div class="o-nho manh"><h3>Ngày nổi bật</h3><ul>${r.ngayTot.map(x => `<li><b>${x.ngay}:</b> ${x.ly}</li>`).join('')}</ul></div>
        <div class="o-nho yeu"><h3>Ngày nên chậm lại</h3><ul>${r.ngayCham.map(x => `<li><b>${x.ngay}:</b> ${x.ly}</li>`).join('')}</ul></div></div>
        ${suKien('Mặt Trăng đổi cung trong tuần', r.trangDiQua.map(x => [`${x.ngay} ${x.gio}`, `Mặt Trăng vào ${x.cung}, nhà ${x.nha} của bạn.`]))}${nghich(r.nghichHanh)}`;
    } else if (st.ky === 'thang') {
      const r = LuanGiai.tuViThang(s, y, m);
      tieuDe = `Tháng ${r.thang}`;
      than = `${suKien('Chủ đề chính trong tháng', r.chuDe.map(x => [`Từ ${x.tu}`, x.loi]))}${lvGrid(r.linhVuc)}
        ${suKien('Trăng non và trăng tròn', r.tuanTrang.map(x => [`${x.ngay.slice(0, 5)} ${x.gio}`, x.loi]))}
        ${suKien('Hành tinh đổi cung', r.giaoCung.map(x => [x.ngay.slice(0, 5), `${x.sao} vào ${x.cung}, nhà ${x.nha} của bạn.`]))}${nghich(r.nghichHanh)}
        <div class="hai-cot"><div class="o-nho manh"><h3>Ngày thuận lợi</h3><p>${r.ngayTot.join(', ')}</p></div><div class="o-nho yeu"><h3>Ngày nên chậm lại</h3><p>${r.ngayCham.join(', ')}</p></div></div>`;
    } else {
      const r = LuanGiai.tuViNam(s, y);
      tieuDe = `Năm ${r.nam}`;
      than = `${suKien('Sao Mộc: may mắn và mở rộng', r.moc.map(x => [`${x.tu} → ${x.den}`, `Ở ${x.cung}. ${x.loi}`]))}
        ${suKien('Sao Thổ: bài học và trách nhiệm', r.tho.map(x => [`${x.tu} → ${x.den}`, `Ở ${x.cung}. ${x.loi}`]))}${lvGrid(r.linhVuc)}
        ${suKien('Nhật thực và nguyệt thực', r.thuc.map(x => [x.ngay.slice(0, 5), `${x.loai} ${x.kieu} ở ${x.cung}, nhà ${x.nha} của bạn: ${x.loi}.`]))}${nghich(r.nghichHanh)}`;
    }
    $('kq').innerHTML = `<div class="tv-dau ${nt(c)}"><h2>${ky(c)}${c.ten}</h2><span style="font-family: var(--f-display); font-size: 18px; font-weight: 700">${tieuDe}</span></div>${than}`;
  }

  function buoc(k) {
    const { y, m, d } = st.ngay, x = st.ky === 'ngay' ? new Date(Date.UTC(y, m - 1, d + k)) : st.ky === 'tuan' ? new Date(Date.UTC(y, m - 1, d + 7 * k))
      : st.ky === 'thang' ? new Date(Date.UTC(y, m - 1 + k, 1)) : new Date(Date.UTC(y + k, 0, 1));
    if (x.getUTCFullYear() < 1900 || x.getUTCFullYear() > 2100) return;
    st.ngay = { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate() }; ve();
  }
  $('chon').addEventListener('change', e => { st.cung = e.target.value; ve(); });
  $('ky').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { st.ky = b.dataset.ky; ve(); } });
  $('ngay').addEventListener('change', e => { const [y, m, d] = e.target.value.split('-').map(Number); if (y >= 1900 && y <= 2100) { st.ngay = { y, m, d }; ve(); } });
  $('lui').addEventListener('click', () => buoc(-1));
  $('toi').addEventListener('click', () => buoc(1));
  $('hom-nay').addEventListener('click', () => { st.ngay = homNay(); ve(); });
  addEventListener('hashchange', () => { const [a, b] = location.hash.slice(1).split('/'); if (theoId[a]) { st.cung = a; st.ky = KY.includes(b) ? b : 'ngay'; ve(); } });
  ve();
})();
