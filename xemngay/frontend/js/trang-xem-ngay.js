/* Trang xem ngày: chi tiết một ngày và lịch tháng. #ngay=YYYY-MM-DD&nam=1990&tz=7 (nam, tz không bắt buộc). Năm sinh không lưu, không gửi đi. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const so2 = n => String(n).padStart(2, '0'), iso = (y, m, d) => `${y}-${so2(m)}-${so2(d)}`;
  const [ty, tm, td] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).split('-').map(Number);
  const LOP = { 'Tốt': 'Tot', 'Khá': 'Kha', 'Bình thường': 'Binh', 'Xấu': 'Xau' };
  let chon = { y: ty, m: tm, d: td }, namSinh = null, thang = { y: ty, m: tm }, tz = 7;
  $('tz').innerHTML = XemNgay.MUI_GIO.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  $('chon-thang').innerHTML = [...Array(12).keys()].map(i => `<option value="${i + 1}">Tháng ${i + 1}</option>`).join('');

  function docForm() {
    const v = $('ngay').value, n = $('nam').value.trim(), mo = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!mo || Number(mo[1]) < 1900 || Number(mo[1]) > 2100) return 'Hãy chọn một ngày từ năm 1900 đến 2100.';
    if (n && (!/^\d{4}$/.test(n) || Number(n) < 1900 || Number(n) > 2100)) return 'Năm sinh cần là số có 4 chữ số, từ 1900 đến 2100.';
    return { y: Number(mo[1]), m: Number(mo[2]), d: Number(mo[3]), nam: n ? Number(n) : null };
  }

  const VIEC_LOP = { 'Nên làm': 'Tot', 'Cân nhắc': 'Binh', 'Không nên': 'Xau' };
  const dauHoa = t => t.charAt(0).toUpperCase() + t.slice(1);
  function veChiTiet() {
    const opts = { namSinh: namSinh ?? undefined, tz };
    const r = XemNgay.xemNgay(chon.d, chon.m, chon.y, opts), viec = XemNgay.danhGiaViec(chon.d, chon.m, chon.y, opts);
    const dong = (nhan, noi) => `<div><dt>${nhan}</dt><dd>${noi}</dd></div>`;
    const ds = xs => xs.length ? xs.join(', ') : 'Không có';
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
      <div class="hai-cot">
        <section><h3 class="nho">Thông tin ngày</h3><dl class="bang-tt">
          ${dong('Dương lịch', `${r.duong.thu}, ${r.duong.chu}`)}
          ${dong('Âm lịch', `${r.am.chu}${tz !== 7 ? ` (tính theo UTC${tz >= 0 ? '+' : '−'}${Math.abs(tz)})` : ''}`)}
          ${dong('Can chi', `Ngày ${r.canChi.ngay}, tháng ${r.canChi.thang}, năm ${r.canChi.nam}`)}
          ${dong('Ngũ hành', `Ngày ${r.nguHanh.napAm} (hành ${r.nguHanh.hanh}); ${r.nguHanh.can}, ${r.nguHanh.chi}`)}
          ${dong('Tiết khí', r.tietKhi.batDau ? `Bắt đầu tiết ${r.tietKhi.ten}` : `Trong tiết ${r.tietKhi.ten}`)}
          ${dong('Trực', `<b>${r.truc.ten}</b>: nên ${r.truc.nen}; tránh ${r.truc.tranh}`)}
        </dl></section>
        <section><h3 class="nho">Đánh giá ngày</h3><dl class="bang-tt">
          ${dong('Tính chất', `${r.hoangDao.tot ? 'Hoàng đạo' : 'Hắc đạo'} ${r.hoangDao.than}, ${r.muc.toLowerCase()} (${r.phanTram}%)`)}
          ${dong('Sao tốt', ds(r.saoTot))}
          ${dong('Sao xấu', ds(r.saoXau))}
          ${dong('Ngày kỵ', r.ngayKy.length ? r.ngayKy.map(k => `${k.ten} (${k.loi})`).join('; ') : 'Không phạm Tam nương, Nguyệt kỵ, Dương công kỵ nhật')}
          ${dong('Hướng xuất hành', `Hỷ thần ${r.huong.hyThan}, Tài thần ${r.huong.taiThan}`)}
          ${dong('Tuổi', `Xung tuổi ${r.tuoiXung}; hợp tuổi ${r.tuoiHop.join(', ')}`)}
        </dl></section>
      </div>
      ${r.thanSat.length ? `<ul class="ly-do">${r.thanSat.map(t => `<li class="${t.tot ? 'tot' : 'xau'}"><b>${t.ten}</b>: ${t.loi}.</li>`).join('')}</ul>` : ''}
      <div><h3 class="nho">Giờ tốt (hoàng đạo)</h3><div class="gio">${r.gioHoangDao.map(g => `<span><b>${g.chi}</b>${g.gio}</span>`).join('')}</div></div>
      <div><h3 class="nho">Giờ cần tránh</h3><div class="gio tranh">${r.gioTranh.map(g => `<span><b>${g.chi}</b>${g.gio} <small>${g.vi}</small></span>`).join('')}</div>
        <p class="muted">Giờ hắc đạo theo 12 thần khởi từ chi ngày${namSinh ? ', thêm giờ xung tuổi của bạn' : ''}. Giờ tính theo đồng hồ nơi bạn ở.</p></div>
      <div><h3 class="nho">Việc nên làm và nên cân nhắc</h3>
        <div class="viec-luoi">${viec.map(v => `<div class="viec ${VIEC_LOP[v.nhan]}"><div class="viec-dau"><b>${v.ten}</b><span class="nhan-viec">${v.nhan}</span></div><p>${v.loi}</p></div>`).join('')}</div>
        <p class="muted">Cần ngày khác cho một việc cụ thể? <a href="chon-ngay.html">Chọn ngày theo việc</a></p></div>
      <div><h3 class="nho">Vì sao ngày này ${r.muc.toLowerCase()}</h3><ul class="ly-do">${r.lyDo.map(x => `<li class="${x.tot ? 'tot' : x.xau ? 'xau' : ''}">${x.text}</li>`).join('')}</ul></div>
      <details class="pp"><summary>Phương pháp tính: theo hệ thống lịch nào</summary><dl class="bang-tt">${XemNgay.PHUONG_PHAP.map(([a, b]) => dong(a, b)).join('')}</dl></details>`;
  }

  function veLich() {
    const { y, m } = thang, ds = XemNgay.lichThang(y, m, { namSinh: namSinh ?? undefined, tz });
    $('h-lich').textContent = `Tháng ${m}/${y}`;
    const a0 = ds[0].am, a1 = ds[ds.length - 1].am;
    $('lich-am').textContent = `Âm lịch: ${a0.d}/${a0.m}${a0.nhuan ? ' nhuận' : ''} đến ${a1.d}/${a1.m}${a1.nhuan ? ' nhuận' : ''} năm ${a1.y}${a0.y !== a1.y ? ` (từ năm ${a0.y})` : ''}`;
    $('chon-thang').value = m; $('chon-nam').value = y;
    const dau = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // thứ Hai là cột đầu
    const tieuDe = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(t => `<div class="thu" role="columnheader">${t}</div>`).join('');
    const o = ds.map(r => {
      const dangChon = r.duong.d === chon.d && m === chon.m && y === chon.y, homNay = r.duong.d === td && m === tm && y === ty;
      const am = r.am.d === 1 ? `${r.am.d}/${r.am.m}${r.am.nhuan ? 'n' : ''}` : r.am.d;
      const goi = `${r.duong.thu} ${r.duong.chu}, âm lịch ${r.am.chu}, ngày ${r.canChi.ngay}, ${r.hoangDao.tot ? 'hoàng đạo' : 'hắc đạo'} ${r.hoangDao.than}, trực ${r.truc.ten}${r.tietKhi.batDau ? `, bắt đầu tiết ${r.tietKhi.ten}` : ''}. Sao tốt: ${r.saoTot.join(', ') || 'không'}. Sao xấu: ${r.saoXau.join(', ') || 'không'}. Giờ hoàng đạo: ${r.gioHoangDao.map(g => g.chi).join(', ')}. ${r.muc} ${r.phanTram}%`;
      return `<button type="button" role="gridcell" class="ngay ${LOP[r.muc]}${dangChon ? ' chon' : ''}${homNay ? ' nay' : ''}" data-d="${r.duong.d}" aria-pressed="${dangChon}" title="${goi}" aria-label="${goi}">
        <span class="o-dau"><b>${r.duong.d}</b>${r.hoangDao.tot ? '<span class="hd" aria-hidden="true">HĐ</span>' : ''}</span><small class="am">${am}</small>
        <span class="cc">${r.canChi.ngay}</span><span class="tr">${r.truc.ten}</span>${r.tietKhi.batDau ? `<span class="tk">${r.tietKhi.ten}</span>` : ''}<i class="cham ${LOP[r.muc]}"></i></button>`;
    });
    $('lich').innerHTML = tieuDe + '<div class="trong"></div>'.repeat(dau) + o.join('');
  }

  function xem(y, m, d, cuon) {
    chon = { y, m, d }; thang = { y, m };
    $('ngay').value = iso(y, m, d);
    history.replaceState(null, '', `#ngay=${iso(y, m, d)}${namSinh ? `&nam=${namSinh}` : ''}${tz !== 7 ? `&tz=${tz}` : ''}`);
    veChiTiet(); veLich();
    if (cuon) $('chi-tiet').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const v = docForm(), loi = typeof v === 'string' ? v : '';
    $('loi').hidden = !loi; $('loi').textContent = loi;
    if (loi) return;
    namSinh = v.nam; tz = Number($('tz').value); xem(v.y, v.m, v.d, true);
  });
  $('hom-nay').addEventListener('click', () => xem(ty, tm, td, false));
  $('lich').addEventListener('click', e => { const b = e.target.closest('button.ngay'); if (b) xem(thang.y, thang.m, Number(b.dataset.d), true); });
  const doiThang = k => { let { y, m } = thang; m += k; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } if (y >= 1900 && y <= 2100) { thang = { y, m }; veLich(); } };
  $('truoc').addEventListener('click', () => doiThang(-1));
  $('sau').addEventListener('click', () => doiThang(1));
  const nhayThang = () => { const y = Number($('chon-nam').value), m = Number($('chon-thang').value); if (Number.isInteger(y) && y >= 1900 && y <= 2100) { thang = { y, m }; veLich(); } };
  $('chon-thang').addEventListener('change', nhayThang);
  $('chon-nam').addEventListener('change', nhayThang);

  // Mở với #ngay=YYYY-MM-DD&nam=1990
  const q = new URLSearchParams(location.hash.slice(1)), mo = /^(\d{4})-(\d{2})-(\d{2})$/.exec(q.get('ngay') || ''), n = Number(q.get('nam'));
  if (Number.isInteger(n) && n >= 1900 && n <= 2100) { namSinh = n; $('nam').value = n; }
  const tzQ = Number(q.get('tz'));
  if (q.has('tz') && XemNgay.MUI_GIO.some(x => x[0] === tzQ)) tz = tzQ;
  $('tz').value = tz;
  if (mo && Number(mo[1]) >= 1900 && Number(mo[1]) <= 2100 && new Date(Date.UTC(+mo[1], +mo[2] - 1, +mo[3])).getUTCDate() === +mo[3]) xem(+mo[1], +mo[2], +mo[3], false);
  else xem(ty, tm, td, false);
})();
