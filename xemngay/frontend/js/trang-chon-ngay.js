/* Trang chọn ngày tốt theo việc: chỉ tính khi bấm nút. Năm sinh không lưu, không gửi đi. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const so2 = n => String(n).padStart(2, '0'), iso = (y, m, d) => `${y}-${so2(m)}-${so2(d)}`;
  const [ty, tm, td] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).split('-').map(Number);
  const LOP = { 'Tốt': 'Tot', 'Khá': 'Kha', 'Bình thường': 'Binh', 'Xấu': 'Xau' };
  $('viec').innerHTML = Object.entries(XemNgay.VIEC).map(([k, t]) => `<option value="${k}">${t}</option>`).join('');
  const sau60 = new Date(Date.UTC(ty, tm - 1, td + 60));
  $('tu').value = iso(ty, tm, td); $('den').value = iso(sau60.getUTCFullYear(), sau60.getUTCMonth() + 1, sau60.getUTCDate());

  const ngay = s => { const mo = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); return mo && +mo[1] >= 1900 && +mo[1] <= 2100 ? { y: +mo[1], m: +mo[2], d: +mo[3] } : null; };
  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const tu = ngay($('tu').value), den = ngay($('den').value), n = $('nam').value.trim();
    let loi = !tu || !den ? 'Hãy chọn ngày bắt đầu và ngày kết thúc (năm 1900–2100).' : n && (!/^\d{4}$/.test(n) || +n < 1900 || +n > 2100) ? 'Năm sinh cần là số có 4 chữ số, từ 1900 đến 2100.' : '';
    let r;
    if (!loi) try { r = XemNgay.chonNgay($('viec').value, tu, den, n ? Number(n) : undefined); } catch (err) { loi = err.message; }
    $('loi').hidden = !loi; $('loi').textContent = loi;
    if (loi) return;
    const viec = r.viec.ten.toLowerCase();
    $('kq').innerHTML = `<h2>${r.soNgayTot ? `${r.soNgayTot} ngày tốt cho việc ${viec}` : `Chưa có ngày thật tốt cho việc ${viec}`}</h2>
      <p class="muted">Trong ${r.soNgay} ngày từ ${tu.d}/${tu.m}/${tu.y} đến ${den.d}/${den.m}/${den.y}${n ? `, xét cả tuổi ${TuVi.CHI[XemNgay.chiTuoi(+n)]} (${n})` : ''}. Xếp từ tốt nhất.</p>
      ${r.soNgayTot ? `<ol class="ds-ngay">${r.ngay.map(x => `<li class="${LOP[x.muc]}">
        <div class="ds-dau"><div><b>${x.duong.thu}, ${x.duong.chu}</b><span class="muted">Âm lịch ${x.am.chu} · ${x.canChi.ngay} · ${x.hoangDao.than} hoàng đạo · trực ${x.truc.ten} · sao ${x.sao.ten}</span></div><span class="pt">${x.phanTram}%</span></div>
        <ul class="ly-do">${x.lyDo.filter(l => l.tot || l.xau).map(l => `<li class="${l.tot ? 'tot' : 'xau'}">${l.text}</li>`).join('')}</ul>
        <p class="muted">Giờ hoàng đạo: ${x.gioHoangDao.map(g => `${g.chi} (${g.gio})`).join(', ')}. <a href="index.html#ngay=${iso(x.duong.y, x.duong.m, x.duong.d)}${n ? `&nam=${n}` : ''}">Xem chi tiết →</a></p></li>`).join('')}</ol>`
        : '<p>Hãy thử mở rộng khoảng thời gian, hoặc xem lịch tháng để chọn ngày khá nhất.</p>'}`;
    $('kq').hidden = false;
    $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
})();
