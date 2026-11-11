/* Trang chủ: form ngày giờ sinh, nơi sinh, múi giờ → tổng quan vận trình từ tử vi, cung hoàng đạo và số chủ đạo,
 * hoặc mở thẳng lá số, bản đồ sao, số chủ đạo với ngày sinh đó. Chỉ tính khi bấm nút.
 * Ngày giờ sinh nhớ chung khóa với trang lá số để mở "Lập lá số tử vi" là có sẵn. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const CHI = TuVi.CHI;
  const GIO = ['23h–1h', '1h–3h', '3h–5h', '5h–7h', '7h–9h', '9h–11h', '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'];
  $('q-gio').innerHTML = GIO.map((r, i) => `<option value="${i + 1}">${CHI[i + 1]} (${r})</option>`).join('');
  // Nơi sinh và múi giờ: cùng danh sách và cùng mã (vn-0, tg-3) với trang bản đồ sao
  const { VIET_NAM, THE_GIOI, MUI_GIO } = DiaDiem;
  $('q-noi').innerHTML = `<optgroup label="Việt Nam">${VIET_NAM.map((x, i) => `<option value="vn-${i}">${x[0]}</option>`).join('')}</optgroup>
    <optgroup label="Nước ngoài">${THE_GIOI.map((x, i) => `<option value="tg-${i}">${x[0]}</option>`).join('')}</optgroup>`;
  $('q-tz').innerHTML = MUI_GIO.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  const noiCua = ma => { const [ten, viDo, kinhDo, tz] = (ma[0] === 'v' ? VIET_NAM : THE_GIOI)[Number(ma.slice(3))]; return { ten, viDo, kinhDo, tz }; };
  const datTz = tz => { if (![...$('q-tz').options].some(o => o.value === tz)) $('q-tz').add(new Option(tz, tz)); $('q-tz').value = tz; };
  $('q-noi').addEventListener('change', () => datTz(noiCua($('q-noi').value).tz));

  const KEY = 'laso-tuvi-input';
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* trình duyệt chặn lưu trữ */ }
  const v0 = Object.assign({ nam: true, am: false, nhuan: false, ngay: '', thang: '', namSinh: '', gio: 1 }, saved || {});
  $(v0.nam ? 'q-nam' : 'q-nu').checked = true;
  $(v0.am ? 'q-am' : 'q-duong').checked = true;
  $('q-nhuan').checked = !!v0.nhuan;
  $('q-ngay').value = v0.ngay; $('q-thang').value = v0.thang; $('q-namsinh').value = v0.namSinh; $('q-gio').value = v0.gio;
  $('q-noi').value = /^(vn|tg)-\d+$/.test(v0.noi || '') && $('q-noi').querySelector(`[value="${v0.noi}"]`) ? v0.noi : 'vn-0';
  datTz(v0.tz || noiCua($('q-noi').value).tz);
  const syncNhuan = () => { $('q-nhuan-wrap').hidden = !$('q-am').checked; };
  syncNhuan();

  function read() {
    const n = id => Number($(id).value);
    const v = { nam: $('q-nam').checked, am: $('q-am').checked, nhuan: $('q-nhuan').checked, ngay: n('q-ngay'), thang: n('q-thang'), namSinh: n('q-namsinh'), gio: n('q-gio'), noi: $('q-noi').value, tz: $('q-tz').value };
    if (!Number.isInteger(v.namSinh) || v.namSinh < 1900 || v.namSinh > 2100) throw new Error('Năm sinh cần trong khoảng 1900–2100.');
    if (!Number.isInteger(v.thang) || v.thang < 1 || v.thang > 12) throw new Error('Tháng sinh cần từ 1 đến 12.');
    if (!Number.isInteger(v.ngay) || v.ngay < 1 || v.ngay > (v.am ? 30 : 31)) throw new Error(`Ngày sinh cần từ 1 đến ${v.am ? 30 : 31}.`);
    return v;
  }
  const [ny, nm, nd] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).split('-').map(Number);
  const HOM_NAY = { y: ny, m: nm, d: nd };
  let kq = null, ky = 'ngay';

  function theMat(l) {
    const vm = l.ma === 'vanMay' ? `<p class="them"><b>Màu hợp:</b> ${l.mau}.<br><b>Số may mắn:</b> ${l.so.join(', ')}.<br><b>${l.ngayHop.replace(/:.*/, ':')}</b>${l.ngayHop.replace(/^[^:]*:/, '')}.</p>` : '';
    return `<article class="lv-the ${l.muc}${l.ma === 'tongQuan' ? ' rong' : ''}">
      <header><h3>${l.ten}</h3><span class="diem">${l.phanTram}<small>%</small></span></header>
      <div class="thanh" aria-hidden="true"><i style="width:${l.phanTram}%"></i></div>
      <span class="muc-nhan">${l.nhan}</span>
      <p class="tong-hop">${l.nhanDinh}</p>
      <p class="loi-khuyen"><b>Lời khuyên:</b> ${l.loiKhuyen}</p>${vm}
      <p class="ap-dung">Áp dụng: ${l.apDung}</p>
      <details class="chi-tiet"${l.ma === 'tongQuan' ? ' open' : ''}><summary>Phân tích chi tiết từng hệ</summary>
      <ul class="nguon">${l.nguon.map(x => `<li><span class="dau"><span>${x.he}</span><span class="pt">${x.phanTram}%</span></span><span class="thanh mini" aria-hidden="true"><i style="width:${x.phanTram}%"></i></span>${x.loi}</li>`).join('')}</ul></details></article>`;
  }
  function veKy() {
    document.querySelectorAll('#ky-tab button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ky === ky)));
    const p = kq.ky[ky];
    $('ky-info').textContent = `${p.tuVi.tieuDe}: ${p.tuVi.nhan.toLowerCase()}.`;
    $('du-doan').innerHTML = p.linhVuc.map(theMat).join('');
  }

  // Lưu ngày sinh dùng chung với trang lá số; trả về ngày dương lịch dạng YYYY-MM-DD
  function luu(v) {
    try { localStorage.setItem(KEY, JSON.stringify(Object.assign({}, saved || {}, v, { xem: HOM_NAY.y }))); } catch (e) { /* bỏ qua */ }
    const d = TuVi.lapLaSo({ ngay: v.ngay, thang: v.thang, nam: v.namSinh, amLich: v.am, nhuan: v.nhuan, gio: v.gio, namGioi: v.nam }).duong;
    return `${d.nam}-${String(d.thang).padStart(2, '0')}-${String(d.ngay).padStart(2, '0')}`;
  }

  function show() {
    let v;
    try {
      v = read();
      kq = TongHop.duDoan({ ngay: v.ngay, thang: v.thang, nam: v.namSinh, amLich: v.am, nhuan: v.nhuan, gio: v.gio, namGioi: v.nam,
        noi: Object.assign(noiCua(v.noi), { tz: v.tz }) }, HOM_NAY);
    } catch (e) {
      $('q-err').textContent = e.message; $('q-err').hidden = false; return;
    }
    $('q-err').hidden = true;
    luu(v);
    const h = kq.hoSo, t = h.tuVi, z = h.hoangDao, s = h.soHoc;
    $('sinh').textContent = `${v.nam ? 'Nam' : 'Nữ'}, sinh ngày ${kq.ngaySinh.duong} dương lịch (${kq.ngaySinh.am} âm lịch), ${kq.ngaySinh.gio}, tại ${kq.noiSinh.ten} (múi giờ ${kq.noiSinh.tz}).`;
    $('ho-so').innerHTML = `
      <a class="hs" href="la-so.html"><span class="nhan">Tử vi</span><b>${t.canChi}, tuổi ${t.con}</b><p>${t.tuoiAm} tuổi âm lịch năm ${HOM_NAY.y}</p><p>Mệnh ${t.banMenh}, ${t.cuc}</p>
        <p>Cung Mệnh tại ${t.menhChi}: ${t.menhChinh.length ? t.menhChinh.join(', ') : 'Vô chính diệu'}</p><span class="more">Xem lá số đầy đủ</span></a>
      <a class="hs" href="../../zodiac/frontend/cung.html#${z.id}"><span class="nhan">Cung hoàng đạo</span><b><span class="ky-zodiac" aria-hidden="true">${z.kyHieu}</span> ${z.ten} <span class="en">${z.en}</span></b>
        <p>Nguyên tố ${z.nguyenTo}: ${z.tuKhoa}</p><p>Mặt Trăng ở ${z.matTrang}</p>${z.giaoCung ? `<p>Sinh đúng ngày giao cung ${z.giaoCung}; đã tính theo giờ sinh.</p>` : ''}<span class="more">Tính cách, tình yêu, sự nghiệp</span></a>
      <a class="hs" href="../../numerology/frontend/index.html#ngay=${kq.ngaySinh.iso}"><span class="nhan">Số chủ đạo</span><b>Số ${s.hien}: ${s.ten}</b><p>${s.tuKhoa}</p>
        <p>Chỉ số ngày sinh ${s.ngaySinh}, chỉ số thái độ ${s.thaiDo}</p><p>Năm cá nhân ${HOM_NAY.y}: số ${s.namCaNhan.so} (${s.namCaNhan.ten})</p><span class="more">Xem đủ các chỉ số</span></a>`;
    veKy();
    $('kq').hidden = false;
    $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  $('q-form').addEventListener('submit', e => { e.preventDefault(); show(); });
  // Nút mở công cụ: kiểm tra ngày sinh, lưu, rồi mở trang đó với dữ liệu điền sẵn
  document.querySelector('.nut-phu').addEventListener('click', e => {
    const b = e.target.closest('button[data-di]'); if (!b) return;
    let v, iso;
    try { v = read(); iso = luu(v); } catch (er) { $('q-err').textContent = er.message; $('q-err').hidden = false; return; }
    const gio = `${String(((v.gio - 1) * 2) % 24).padStart(2, '0')}:00`; // giữa canh giờ
    location.href = { 'la-so': 'la-so.html', 'so-hoc': `../../numerology/frontend/index.html#ngay=${iso}`,
      'ban-do': `../../zodiac/frontend/ban-do-sao.html#ngay=${iso}&gio=${gio}&noi=${v.noi}&tz=${encodeURIComponent(v.tz)}` }[b.dataset.di];
  });
  $('q-form').addEventListener('change', e => { if (e.target.name === 'q-lich') syncNhuan(); });
  $('ky-tab').addEventListener('click', e => { const b = e.target.closest('button'); if (b && kq) { ky = b.dataset.ky; veKy(); } });

  // Dải lịch trên cùng: hôm nay theo lịch vạn niên (cùng cách tính với trang Xem ngày)
  if (window.XemNgay) {
    const r = XemNgay.xemNgay(HOM_NAY.d, HOM_NAY.m, HOM_NAY.y);
    $('hom-nay').innerHTML = `${r.duong.thu}, ${r.duong.chu}, ngày ${r.am.d}/${r.am.m}${r.am.nhuan ? ' nhuận' : ''} âm lịch, ${r.canChi.ngay}, ${r.hoangDao.tot ? 'hoàng đạo' : 'hắc đạo'} ${r.hoangDao.than}. <a href="../../xemngay/frontend/index.html">Xem ngày hôm nay</a>`;
  }

  // Thẻ xem trước công cụ: bấm hoặc dùng phím mũi tên để đổi màn hình
  const tabs = [...document.querySelectorAll('.mh-tab [role="tab"]')];
  function chonTab(t, focus) {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; });
    if (focus) t.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => chonTab(t));
    t.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); chonTab(tabs[(i + k + tabs.length) % tabs.length], true); }
    });
  });

  // Có backend và trang quản trị có bài mới hơn thư viện thì "Bài viết mới" lấy 3 bài mới nhất từ đó (bỏ bài trùng với thư viện tĩnh)
  layApi('/api/bai-viet').then(ds => {
    const tinh = [...document.querySelectorAll('.posts a')].map(a => a.getAttribute('href'));
    ds = ds.filter(b => !tinh.includes(`bai-viet/${b.slug}.html`) && !['tu-vi-la-gi', 'doc-la-so', 'dai-han-tieu-han'].includes(b.slug));
    if (!ds.length) return;
    document.querySelector('.posts').innerHTML = ds.slice(0, 3).map(b => `<li><a class="post" href="bai-viet-doc.html#${encodeURIComponent(b.slug)}">
      <h3>${escHtml(b.tieuDe)}</h3><p>${escHtml(b.tomTat)}</p><span class="meta">${escHtml(b.chuyenMuc)}, ${b.phutDoc} phút đọc</span></a></li>`).join('');
  }).catch(() => {});
})();
