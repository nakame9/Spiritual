/* Trang xem ngày: chi tiết một ngày và lịch tháng. #ngay=YYYY-MM-DD&nam=1990 (nam không bắt buộc). Năm sinh không lưu, không gửi đi. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const so2 = n => String(n).padStart(2, '0'), iso = (y, m, d) => `${y}-${so2(m)}-${so2(d)}`;
  const [ty, tm, td] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).split('-').map(Number);
  const LOP = { 'Tốt': 'Tot', 'Khá': 'Kha', 'Bình thường': 'Binh', 'Xấu': 'Xau' };
  let chon = { y: ty, m: tm, d: td }, namSinh = null, thang = { y: ty, m: tm };

  function docForm() {
    const v = $('ngay').value, n = $('nam').value.trim(), mo = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!mo || Number(mo[1]) < 1900 || Number(mo[1]) > 2100) return 'Hãy chọn một ngày từ năm 1900 đến 2100.';
    if (n && (!/^\d{4}$/.test(n) || Number(n) < 1900 || Number(n) > 2100)) return 'Năm sinh cần là số có 4 chữ số, từ 1900 đến 2100.';
    return { y: Number(mo[1]), m: Number(mo[2]), d: Number(mo[3]), nam: n ? Number(n) : null };
  }

  function veChiTiet() {
    const r = XemNgay.xemNgay(chon.d, chon.m, chon.y, { namSinh: namSinh ?? undefined });
    const o = (nhan, noi, lop = '') => `<div class="o ${lop}"><span class="nhan">${nhan}</span>${noi}</div>`;
    $('chi-tiet').innerHTML = `
      <div class="ngay-dau">
        <div class="to ${LOP[r.muc]}"><span>${r.duong.thu}</span><b>${r.duong.d}</b><span>tháng ${r.duong.m}/${r.duong.y}</span></div>
        <div class="tom">
          <p class="eyebrow">Âm lịch ${r.am.chu} · ngày ${r.canChi.ngay}, tháng ${r.canChi.thang}, năm ${r.canChi.nam}</p>
          <h2 id="h-ngay">${r.hoangDao.tot ? 'Ngày hoàng đạo' : 'Ngày hắc đạo'} ${r.hoangDao.than}</h2>
          <div class="diem-ngay ${LOP[r.muc]}"><b>${r.phanTram}%</b><span>${r.muc}${r.tuoi ? ` với tuổi ${r.tuoi.chi} (${r.tuoi.namSinh})` : ''}</span></div>
          <div class="thanh ${LOP[r.muc]}" aria-hidden="true"><i style="width:${r.phanTram}%"></i></div>
        </div>
      </div>
      <div class="luoi-o">
        ${o('Trực', `<b>${r.truc.ten}</b><p>Nên: ${r.truc.nen}.</p><p>Tránh: ${r.truc.tranh}.</p>`)}
        ${o('Nhị thập bát tú', `<b>Sao ${r.sao.ten} · ${r.sao.tot ? 'sao tốt' : 'sao xấu'}</b><p>${r.sao.loi}</p>`)}
        ${o('Tiết khí', `<b>${r.tietKhi.ten}</b><p>${r.tietKhi.batDau ? `Hôm nay bắt đầu tiết ${r.tietKhi.ten}.` : `Đang trong tiết ${r.tietKhi.ten}.`}</p>`)}
        ${o('Ngày kỵ', r.ngayKy.length ? r.ngayKy.map(k => `<b>${k.ten}</b><p>${k.loi.charAt(0).toUpperCase() + k.loi.slice(1)}.</p>`).join('') : '<b>Không phạm</b><p>Không phải Tam nương, Nguyệt kỵ hay Dương công kỵ nhật.</p>', r.ngayKy.length ? 'xau' : '')}
        ${o('Hướng xuất hành', `<p><b>Hỷ thần:</b> ${r.huong.hyThan} (cầu may, cưới hỏi)</p><p><b>Tài thần:</b> ${r.huong.taiThan} (cầu tài lộc)</p>`)}
        ${o('Tuổi', `<p><b>Xung:</b> tuổi ${r.tuoiXung}</p><p><b>Hợp:</b> tuổi ${r.tuoiHop.join(', ')}</p>`)}
      </div>
      <div><h3 class="nho">Giờ hoàng đạo</h3><div class="gio">${r.gioHoangDao.map(g => `<span><b>${g.chi}</b>${g.gio}</span>`).join('')}</div></div>
      <div><h3 class="nho">Vì sao ngày này ${r.muc.toLowerCase()}</h3><ul class="ly-do">${r.lyDo.map(x => `<li class="${x.tot ? 'tot' : x.xau ? 'xau' : ''}">${x.text}</li>`).join('')}</ul></div>
      <p class="muted"><a href="chon-ngay.html">Cần chọn ngày cho một việc cụ thể? Chọn ngày theo việc →</a></p>`;
  }

  function veLich() {
    const { y, m } = thang, ds = XemNgay.lichThang(y, m, { namSinh: namSinh ?? undefined });
    $('h-lich').textContent = `Tháng ${m}/${y}`;
    const dau = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // thứ Hai là cột đầu
    const tieuDe = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(t => `<div class="thu" role="columnheader">${t}</div>`).join('');
    const o = ds.map(r => {
      const dangChon = r.duong.d === chon.d && m === chon.m && y === chon.y, homNay = r.duong.d === td && m === tm && y === ty;
      const am = r.am.d === 1 ? `${r.am.d}/${r.am.m}${r.am.nhuan ? 'n' : ''}` : r.am.d;
      return `<button type="button" role="gridcell" class="ngay ${LOP[r.muc]}${dangChon ? ' chon' : ''}${homNay ? ' nay' : ''}" data-d="${r.duong.d}" aria-pressed="${dangChon}"
        aria-label="${r.duong.thu} ${r.duong.chu}, âm lịch ${r.am.chu}, ${r.hoangDao.tot ? 'hoàng đạo' : 'hắc đạo'}, ${r.muc} ${r.phanTram}%"><b>${r.duong.d}</b><small>${am}</small><i class="cham ${LOP[r.muc]}"></i></button>`;
    });
    $('lich').innerHTML = tieuDe + '<div class="trong"></div>'.repeat(dau) + o.join('');
  }

  function xem(y, m, d, cuon) {
    chon = { y, m, d }; thang = { y, m };
    $('ngay').value = iso(y, m, d);
    history.replaceState(null, '', `#ngay=${iso(y, m, d)}${namSinh ? `&nam=${namSinh}` : ''}`);
    veChiTiet(); veLich();
    if (cuon) $('chi-tiet').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const v = docForm(), loi = typeof v === 'string' ? v : '';
    $('loi').hidden = !loi; $('loi').textContent = loi;
    if (loi) return;
    namSinh = v.nam; xem(v.y, v.m, v.d, true);
  });
  $('hom-nay').addEventListener('click', () => xem(ty, tm, td, false));
  $('lich').addEventListener('click', e => { const b = e.target.closest('button.ngay'); if (b) xem(thang.y, thang.m, Number(b.dataset.d), true); });
  const doiThang = k => { let { y, m } = thang; m += k; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } if (y >= 1900 && y <= 2100) { thang = { y, m }; veLich(); } };
  $('truoc').addEventListener('click', () => doiThang(-1));
  $('sau').addEventListener('click', () => doiThang(1));

  // Mở với #ngay=YYYY-MM-DD&nam=1990
  const q = new URLSearchParams(location.hash.slice(1)), mo = /^(\d{4})-(\d{2})-(\d{2})$/.exec(q.get('ngay') || ''), n = Number(q.get('nam'));
  if (Number.isInteger(n) && n >= 1900 && n <= 2100) { namSinh = n; $('nam').value = n; }
  if (mo && Number(mo[1]) >= 1900 && Number(mo[1]) <= 2100 && new Date(Date.UTC(+mo[1], +mo[2] - 1, +mo[3])).getUTCDate() === +mo[3]) xem(+mo[1], +mo[2], +mo[3], false);
  else xem(ty, tm, td, false);
})();
