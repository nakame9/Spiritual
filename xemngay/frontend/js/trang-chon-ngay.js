/* Trang chọn ngày theo việc: chỉ tính khi bấm nút và khi đã chọn việc. Ngày sinh không lưu, không gửi đi. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const so2 = n => String(n).padStart(2, '0'), iso = (y, m, d) => `${y}-${so2(m)}-${so2(d)}`;
  const [ty, tm, td] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).split('-').map(Number);
  const LOP = { tot: 'Tot', vua: 'Binh', luuY: 'Xau' };
  // Không chọn sẵn việc nào: chưa biết việc thì không có "ngày tốt nhất"
  $('viec').innerHTML = '<option value="">Chọn việc</option>' + Object.entries(XemNgay.VIEC).map(([k, t]) => `<option value="${k}">${t}</option>`).join('');
  $('tz').innerHTML = XemNgay.MUI_GIO.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  const sau60 = new Date(Date.UTC(ty, tm - 1, td + 60));
  $('tu').value = iso(ty, tm, td); $('den').value = iso(sau60.getUTCFullYear(), sau60.getUTCMonth() + 1, sau60.getUTCDate());

  const ngay = s => { const mo = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); return mo && +mo[1] >= 1900 && +mo[1] <= 2100 ? { y: +mo[1], m: +mo[2], d: +mo[3] } : null; };
  /** "1990" là năm âm lịch; "15/8/1990" là ngày sinh dương lịch, đổi sang năm âm lịch. Trả { nam, ghi } hoặc chuỗi lỗi */
  function docSinh(s) {
    if (!s) return { nam: undefined, ghi: '' };
    if (/^\d{4}$/.test(s)) return +s >= 1900 && +s <= 2100 ? { nam: +s, ghi: `năm âm lịch ${s}` } : 'Năm sinh cần từ 1900 đến 2100.';
    const mo = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(s);
    if (!mo) return 'Nhập ngày sinh dạng 15/8/1990 hoặc năm sinh dạng 1990.';
    const [d, m, y] = [+mo[1], +mo[2], +mo[3]];
    if (y < 1900 || y > 2100 || m < 1 || m > 12 || new Date(Date.UTC(y, m - 1, d)).getUTCDate() !== d) return 'Ngày sinh không hợp lệ.';
    const am = TuVi.solar2lunar(d, m, y);
    return { nam: am[2], ghi: `sinh ${d}/${m}/${y} dương lịch, tức ${am[0]}/${am[1]}/${am[2]} âm lịch` };
  }

  let kq = null, xemTot = true, sinh = null, tz = 7;
  function ve() {
    const r = kq, viec = r.viec.ten.toLowerCase(), q = `${sinh.nam ? `&nam=${sinh.nam}` : ''}${tz !== 7 ? `&tz=${tz}` : ''}`;
    const ds = xemTot ? r.ngay : r.tatCa;
    $('ds-kq').innerHTML = ds.length ? `<div class="cuon-bang"><table class="bang-ngay"><thead><tr><th>Ngày</th><th>Đánh giá</th><th>Nội dung</th></tr></thead><tbody>${ds.map(x => `<tr class="${LOP[x.loai]}">
        <td><b>${x.duong.thu}, ${x.duong.chu}</b><span class="muted">Âm lịch ${x.am.chu} · ${x.canChi.ngay}</span><a href="index.html#ngay=${iso(x.duong.y, x.duong.m, x.duong.d)}${q}">Xem chi tiết</a></td>
        <td><span class="danh-gia">${x.danhGia}</span><span class="muted">${x.phanTram}%</span></td>
        <td>${x.noiDung}<span class="muted">${x.hoangDao.than} ${x.hoangDao.tot ? 'hoàng đạo' : 'hắc đạo'} · trực ${x.truc.ten} · sao ${x.sao.ten}. Giờ hoàng đạo: ${x.gioHoangDao.map(g => `${g.chi} (${g.gio})`).join(', ')}.</span></td></tr>`).join('')}</tbody></table></div>`
      : `<p>Chưa có ngày nào tốt theo tiêu chí cho việc ${viec}. Hãy mở rộng khoảng thời gian, hoặc xem tab "Tất cả ngày" để chọn ngày trung bình.</p>`;
    document.querySelectorAll('#tab-kq button').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.tab === 'tot') === xemTot)));
  }

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const tu = ngay($('tu').value), den = ngay($('den').value), viec = $('viec').value;
    sinh = docSinh($('nam').value.trim()); tz = Number($('tz').value);
    let loi = !viec ? 'Hãy chọn việc cần làm trước: mỗi việc có tiêu chí chọn ngày khác nhau.' : !tu || !den ? 'Hãy chọn ngày bắt đầu và ngày kết thúc (năm 1900–2100).' : typeof sinh === 'string' ? sinh : '';
    if (!loi) try { kq = XemNgay.chonNgay(viec, tu, den, sinh.nam, tz); } catch (err) { loi = err.message; }
    $('loi').hidden = !loi; $('loi').textContent = loi;
    if (loi) return;
    const r = kq, v = r.viec.ten.toLowerCase(), mg = XemNgay.MUI_GIO.find(x => x[0] === tz)[1];
    xemTot = r.soNgayTot > 0;
    $('kq').innerHTML = `<h2>Đánh giá ${r.soNgay} ngày cho việc ${v}</h2>
      <p class="muted">Từ ${tu.d}/${tu.m}/${tu.y} đến ${den.d}/${den.m}/${den.y}${sinh.nam ? `, xét cả tuổi ${TuVi.CHI[XemNgay.chiTuoi(sinh.nam)]} (${sinh.ghi})` : ''}. Lịch âm tính theo ${mg}.</p>
      <div class="tong-loai"><span class="Tot"><b>${r.soNgayTot}</b> tốt theo tiêu chí</span><span class="Binh"><b>${r.soNgayVua}</b> trung bình</span><span class="Xau"><b>${r.soNgayLuuY}</b> cần lưu ý</span></div>
      <div class="seg-tab" id="tab-kq" role="group" aria-label="Cách xem"><button type="button" data-tab="tot">Ngày tốt theo tiêu chí, xếp từ tốt nhất</button><button type="button" data-tab="all">Tất cả ngày theo lịch</button></div>
      <div id="ds-kq"></div>
      <details class="pp"><summary>Tiêu chí đánh giá</summary><p><b>Tốt theo tiêu chí:</b> ngày hoàng đạo, không phạm Tam nương, Nguyệt kỵ, Dương công kỵ nhật; trực, nhị thập bát tú và thần sát không kỵ việc ${v}; điểm từ 55%. <b>Cần lưu ý:</b> trực, sao hoặc thần sát kỵ việc ${v}, phạm ngày kỵ, hoặc điểm dưới 40%. <b>Trung bình:</b> các ngày còn lại.</p>
      <dl class="bang-tt">${XemNgay.PHUONG_PHAP.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl></details>`;
    $('tab-kq').addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) { xemTot = b.dataset.tab === 'tot'; ve(); } });
    ve();
    $('kq').hidden = false;
    $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
})();
