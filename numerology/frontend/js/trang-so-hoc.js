/* Trang số chủ đạo: chỉ tính khi bấm nút (hoặc khi mở từ trang chủ với #ngay=YYYY-MM-DD). Tên không lưu, không gửi đi. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sao = n => `<span class="sao-diem" role="img" aria-label="${n} trên 5 sao">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;
  const ds = xs => `<ul>${xs.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const [ny, nm, nd] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).split('-').map(Number);
  const HOM_NAY = { y: ny, m: nm, d: nd };

  function docNgay() {
    const so = id => { const v = $(id).value.trim(); return v === '' ? NaN : Number(v); };
    const d = so('d'), m = so('m'), y = so('y');
    if (![d, m, y].every(Number.isInteger)) return 'Hãy nhập đủ ngày, tháng, năm sinh bằng số.';
    if (y < 1900 || y > 2100) return 'Năm sinh cần trong khoảng 1900–2100.';
    if (m < 1 || m > 12 || new Date(Date.UTC(y, m - 1, d)).getUTCDate() !== d) return 'Ngày tháng không hợp lệ.';
    return { d, m, y };
  }

  function ve(ns, ten) {
    const r = SoHoc.tinh(ns, HOM_NAY, ten), c = r.soChuDao;
    $('so-lon').innerHTML = `<span class="so${c.hien.length > 2 ? ' nho' : ''}">${c.hien}</span><p class="eyebrow">Số chủ đạo của ${ten ? esc(ten) : 'bạn'} · sinh ${r.ngaySinh}</p>
      <h2 id="h-scd">Số ${c.hien}: ${c.ten}</h2><p class="muted">${c.tuKhoa}</p><p class="cach-tinh">Cách tính: ${c.cachTinh}</p>`;
    $('tong-quan').textContent = c.tongQuan;
    $('manh-yeu').innerHTML = `<div class="o-nho manh"><h3>Điểm mạnh</h3>${ds(c.diemManh)}</div><div class="o-nho yeu"><h3>Điểm cần cải thiện</h3>${ds(c.diemYeu)}</div>`;
    $('yeu-nghiep').innerHTML = `<div class="o-nho"><h3>Tình yêu</h3><p>${c.tinhYeu}</p></div>
      <div class="o-nho"><h3>Sự nghiệp</h3><p>${c.suNghiep}</p><div class="nghe" style="margin-top: 10px">${c.nghe.map(x => `<span>${x}</span>`).join('')}</div></div>`;
    $('loi-khuyen').innerHTML = `<b>Lời khuyên:</b> ${c.loiKhuyen}`;

    const the = (nhan, x, khung) => x ? `<div><span class="nhan">${nhan}</span><b>${x.hien}</b><small>${x.tuKhoa}</small><p>${khung} ${x.moTa}</p></div>` : '';
    $('chi-so').innerHTML = the('Chỉ số ngày sinh', r.ngaySinhSo, 'Năng lực bẩm sinh:') + the('Chỉ số thái độ', r.thaiDo, 'Ấn tượng ban đầu và thái độ sống:')
      + (r.ten ? the('Chỉ số sứ mệnh (cả tên)', r.ten.suMenh, 'Điều bạn đến để làm:') + the('Chỉ số linh hồn (nguyên âm)', r.ten.linhHon, 'Khao khát sâu bên trong:') + the('Chỉ số nhân cách (phụ âm)', r.ten.nhanCach, 'Cách người khác nhìn thấy bạn:')
        : '<div><span class="nhan">Chỉ số theo tên</span><p>Nhập họ tên để xem chỉ số sứ mệnh, linh hồn và nhân cách.</p></div>');

    const b = r.bieuDo;
    $('luoi').setAttribute('aria-label', `Biểu đồ ngày sinh: ${b.luoi.flat().map(o => `số ${o.so} xuất hiện ${o.lan} lần`).join(', ')}`);
    $('luoi').innerHTML = b.luoi.flat().map(o => `<div class="${o.lan ? '' : 'trong'}"><span>${o.so}</span>${o.lan ? String(o.so).repeat(o.lan) : '–'}</div>`).join('');
    const mt = b.muiTen.map(x => `<li class="manh"><b>${x.ten} (${x.so.join('-')}):</b> ${x.loi}</li>`).concat(b.muiTenTrong.map(x => `<li class="trong"><b>${x.ten} (${x.so.join('-')}):</b> ${x.loi}</li>`));
    $('mui-ten').innerHTML = (mt.length ? mt.join('') : '<li>Biểu đồ của bạn không có mũi tên nào: các năng lượng phân bố đều, không quá nổi trội cũng không thiếu hụt rõ rệt.</li>')
      + (b.soThieu.length ? `<li>Số còn thiếu: <b>${b.soThieu.join(', ')}</b>. Đây là những bài học bạn sẽ dần bổ sung qua trải nghiệm.</li>` : '');

    const n = r.namCaNhan, t = r.thangCaNhan, g = r.ngayCaNhan;
    const lv = x => ['tinhCam', 'suNghiep', 'mayMan'].map((k, i) => `<div class="lv"><div class="lv-dau"><b>${['Tình cảm', 'Sự nghiệp', 'May mắn'][i]}</b>${sao(x[k].diem)}</div><p>${x[k].loi}</p></div>`).join('');
    $('nam-ca-nhan').innerHTML = `<div class="so-lon" style="margin-bottom: 14px"><span class="so">${n.so}</span><p class="eyebrow">Năm ${n.nam}</p><h2>Năm cá nhân số ${n.so}: ${n.ten}</h2><p>${n.moTa}</p></div>
      <div class="ba-cot">${lv(n)}</div>
      <div class="hai-cot" style="margin-top: 14px"><div class="o-nho"><h3>Tháng cá nhân (tháng ${t.thang}): số ${t.so}, ${t.ten}</h3><p>${t.moTa}</p></div><div class="o-nho"><h3>Ngày cá nhân hôm nay: số ${g.so}, ${g.ten}</h3><p>${g.moTa}</p></div></div>
      <h3 class="muted" style="margin: 16px 0 8px">Chu kỳ 9 năm của bạn</h3><div class="chu-ky">${r.chuKy9.map((x, i) => `<div class="${i ? '' : 'nay'}"><b>${x.so}</b>${x.nam}<br>${x.ten}</div>`).join('')}</div>`;
    $('kq').hidden = false;
  }

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const v = docNgay(), loi = typeof v === 'string' ? v : '';
    $('loi').hidden = !loi; $('loi').textContent = loi;
    if (loi) return;
    ve(v, $('ten').value.trim());
    $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  // Mở từ trang chủ: #ngay=YYYY-MM-DD điền sẵn và tính luôn
  const q = new URLSearchParams(location.hash.slice(1)), mo = /^(\d{4})-(\d{2})-(\d{2})$/.exec(q.get('ngay') || '');
  if (mo) { $('y').value = Number(mo[1]); $('m').value = Number(mo[2]); $('d').value = Number(mo[3]); const v = docNgay(); if (typeof v !== 'string') ve(v, ''); }

  // Ý nghĩa từng số
  const CAC_SO = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22];
  $('chon-so').innerHTML = CAC_SO.map(n => `<button type="button" data-so="${n}" aria-pressed="false">${SoHoc.hienSo(n)}</button>`).join('');
  function xem(n) {
    const c = SoHoc.SO_CHU_DAO[n];
    document.querySelectorAll('#chon-so button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.so) === n)));
    $('y-nghia').innerHTML = `<div class="so-lon"><span class="so${n === 22 ? ' nho' : ''}">${SoHoc.hienSo(n)}</span><h2>Số ${SoHoc.hienSo(n)}: ${c.ten}</h2><p class="muted">${c.tuKhoa}</p></div>
      <p class="doan">${c.tongQuan}</p><div class="hai-cot"><div class="o-nho"><h3>Tình yêu</h3><p>${c.tinhYeu}</p></div><div class="o-nho"><h3>Sự nghiệp</h3><p>${c.suNghiep}</p></div></div>`;
  }
  $('chon-so').addEventListener('click', e => { const b = e.target.closest('button'); if (b) xem(Number(b.dataset.so)); });
  xem(2);
})();
