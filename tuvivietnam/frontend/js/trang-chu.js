/* Trang chủ: form ngày giờ sinh → dự đoán may mắn, tình cảm, sự nghiệp từ tử vi, cung hoàng đạo và số chủ đạo.
 * Chỉ tính khi bấm nút. Ngày giờ sinh nhớ chung khóa với trang lá số để mở "Xem lá số đầy đủ" là có sẵn. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const CHI = TuVi.CHI;
  const GIO = ['23h–1h', '1h–3h', '3h–5h', '5h–7h', '7h–9h', '9h–11h', '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'];
  $('q-gio').innerHTML = GIO.map((r, i) => `<option value="${i + 1}">${CHI[i + 1]} (${r})</option>`).join('');

  const KEY = 'laso-tuvi-input';
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* trình duyệt chặn lưu trữ */ }
  const v0 = Object.assign({ nam: true, am: false, nhuan: false, ngay: '', thang: '', namSinh: '', gio: 1 }, saved || {});
  $(v0.nam ? 'q-nam' : 'q-nu').checked = true;
  $(v0.am ? 'q-am' : 'q-duong').checked = true;
  $('q-nhuan').checked = !!v0.nhuan;
  $('q-ngay').value = v0.ngay; $('q-thang').value = v0.thang; $('q-namsinh').value = v0.namSinh; $('q-gio').value = v0.gio;
  const syncNhuan = () => { $('q-nhuan-wrap').hidden = !$('q-am').checked; };
  syncNhuan();

  function read() {
    const n = id => Number($(id).value);
    const v = { nam: $('q-nam').checked, am: $('q-am').checked, nhuan: $('q-nhuan').checked, ngay: n('q-ngay'), thang: n('q-thang'), namSinh: n('q-namsinh'), gio: n('q-gio') };
    if (!Number.isInteger(v.namSinh) || v.namSinh < 1900 || v.namSinh > 2100) throw new Error('Năm sinh cần trong khoảng 1900–2100.');
    if (!Number.isInteger(v.thang) || v.thang < 1 || v.thang > 12) throw new Error('Tháng sinh cần từ 1 đến 12.');
    if (!Number.isInteger(v.ngay) || v.ngay < 1 || v.ngay > (v.am ? 30 : 31)) throw new Error(`Ngày sinh cần từ 1 đến ${v.am ? 30 : 31}.`);
    return v;
  }
  const [ny, nm, nd] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).split('-').map(Number);
  const HOM_NAY = { y: ny, m: nm, d: nd };
  const so = x => String(x).replace('.', ',');
  const sao = n => `<span class="sao-diem" role="img" aria-label="${n} trên 5 sao">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;
  let kq = null, ky = 'ngay';

  function veKy() {
    document.querySelectorAll('#ky-tab button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ky === ky)));
    const p = kq.ky[ky];
    const moc = { ngay: `Hôm nay ${HOM_NAY.d}/${HOM_NAY.m}/${HOM_NAY.y}`, thang: `Tháng ${HOM_NAY.m}/${HOM_NAY.y}`, nam: `Năm ${HOM_NAY.y}` }[ky];
    $('ky-info').textContent = `${moc}. ${p.tuVi.tieuDe}: ${p.tuVi.nhan.toLowerCase()}. ${p.tuVi.ly}`;
    $('tom-tat').textContent = p.tomTat;
    $('du-doan').innerHTML = p.linhVuc.map(l => `<article class="lv-the ${l.muc}">
      <header><h3>${l.ten}</h3><span class="diem">${so(l.diem)}<small>/5</small></span></header>
      <div class="thanh" role="img" aria-label="${l.phanTram}%"><i style="width:${l.phanTram}%"></i></div>
      <p class="tong-hop">${l.tongHop}</p>
      ${l.ma === 'mayMan' ? `<p class="them"><b>Màu hợp:</b> ${kq.mayMan.mau}${ky === 'ngay' ? `; theo Mặt Trăng hôm nay thêm màu ${kq.mayMan.mauHomNay}` : ''}.<br><b>Số may mắn:</b> ${kq.mayMan.so.join(', ')}.</p>` : ''}
      <ul class="nguon">${l.nguon.map(x => `<li><span class="dau"><span>${x.he}</span>${sao(Math.round(x.diem))}</span>${x.loi}</li>`).join('')}</ul></article>`).join('');
  }

  function show() {
    let v;
    try {
      v = read();
      kq = TongHop.duDoan({ ngay: v.ngay, thang: v.thang, nam: v.namSinh, amLich: v.am, nhuan: v.nhuan, gio: v.gio, namGioi: v.nam }, HOM_NAY);
    } catch (e) {
      $('q-err').textContent = e.message; $('q-err').hidden = false; return;
    }
    $('q-err').hidden = true;
    try { localStorage.setItem(KEY, JSON.stringify(Object.assign({}, saved || {}, v, { xem: HOM_NAY.y }))); } catch (e) { /* bỏ qua */ }
    const h = kq.hoSo, t = h.tuVi, z = h.hoangDao, s = h.soHoc;
    $('sinh').textContent = `${v.nam ? 'Nam' : 'Nữ'}, sinh ngày ${kq.ngaySinh.duong} dương lịch (${kq.ngaySinh.am} âm lịch), ${kq.ngaySinh.gio}.`;
    $('ho-so').innerHTML = `
      <a class="hs" href="la-so.html"><span class="nhan">Tử vi</span><b>${t.canChi} · tuổi ${t.con}</b><p>Mệnh ${t.banMenh} · ${t.cuc}</p>
        <p>Cung Mệnh tại ${t.menhChi}: ${t.menhChinh.length ? t.menhChinh.join(', ') : 'Vô chính diệu'}</p><span class="more">Xem lá số đầy đủ →</span></a>
      <a class="hs" href="../../zodiac/frontend/cung.html#${z.id}"><span class="nhan">Cung hoàng đạo</span><b><span class="ky-zodiac" aria-hidden="true">${z.kyHieu}</span> ${z.ten} <span style="font: 500 14px var(--f-ui); color: var(--soft)">${z.en}</span></b>
        <p>Nguyên tố ${z.nguyenTo} · ${z.tuKhoa}</p>${z.giaoCung ? `<p>Sinh đúng ngày giao cung ${z.giaoCung}; đã tính theo giờ sinh.</p>` : ''}<span class="more">Tính cách, tình yêu, sự nghiệp →</span></a>
      <a class="hs" href="../../numerology/frontend/index.html#ngay=${kq.ngaySinh.iso}"><span class="nhan">Số chủ đạo</span><b>${s.hien} · ${s.ten}</b><p>${s.tuKhoa}</p>
        <p>Năm cá nhân ${HOM_NAY.y}: số ${s.namCaNhan.so} (${s.namCaNhan.ten})</p><span class="more">Xem đủ các chỉ số →</span></a>`;
    veKy();
    $('kq').hidden = false;
    $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  $('q-form').addEventListener('submit', e => { e.preventDefault(); show(); });
  $('q-form').addEventListener('change', e => { if (e.target.name === 'q-lich') syncNhuan(); });
  $('ky-tab').addEventListener('click', e => { const b = e.target.closest('button'); if (b && kq) { ky = b.dataset.ky; veKy(); } });

  // Có backend thì "Bài viết mới" lấy 3 bài mới nhất từ trang quản trị
  layApi('/api/bai-viet').then(ds => {
    if (!ds.length) return;
    document.querySelector('.posts').innerHTML = ds.slice(0, 3).map(b => `<a class="post" href="bai-viet.html#${escHtml(b.slug)}">
      <p class="eyebrow">${escHtml(b.chuyenMuc)}</p><h3>${escHtml(b.tieuDe)}</h3><p>${escHtml(b.tomTat)}</p>
      <span class="meta"><span>${b.phutDoc} phút đọc</span><b>Đọc bài →</b></span></a>`).join('');
  }).catch(() => {});
})();
