/* Trang Ngũ hành và bản mệnh */
(function () {
  'use strict';
  const { $, esc, docNgay, dienNgay, hoSo } = TraCuu, B = BanMenh;
  const HANH = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
  const h = x => `<span class="hanh-chu h-${x}">${x}</span>`;
  const gt = p => $(p + 'nam').checked ? 'nam' : $(p + 'nu').checked ? 'nu' : '';

  // Vòng ngũ hành: vòng ngoài tương sinh, ngôi sao bên trong tương khắc
  const diem = HANH.map((x, i) => { const a = (i * 72 - 90) * Math.PI / 180; return [130 + 95 * Math.cos(a), 130 + 95 * Math.sin(a)]; });
  const mui = (a, b, cls) => { const [x1, y1] = diem[a], [x2, y2] = diem[b], dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), k = 28 / l;
    return `<line x1="${(x1 + dx * k).toFixed(1)}" y1="${(y1 + dy * k).toFixed(1)}" x2="${(x2 - dx * k).toFixed(1)}" y2="${(y2 - dy * k).toFixed(1)}" class="${cls}" marker-end="url(#m-${cls})"/>`; };
  $('vong').innerHTML = `<svg class="vong" viewBox="0 0 260 260" role="img" aria-label="Vòng ngũ hành: Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc; Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc">
    <defs>${['sinh', 'khac'].map(c => `<marker id="m-${c}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="${c}" style="fill: currentColor"/></marker>`).join('')}</defs>
    <g style="color: var(--moc)">${HANH.map((x, i) => mui(i, (i + 1) % 5, 'sinh')).join('')}</g>
    <g style="color: var(--color-accent)">${HANH.map((x, i) => mui(i, (i + 2) % 5, 'khac')).join('')}</g>
    ${HANH.map((x, i) => `<g class="h-${x}"><circle cx="${diem[i][0].toFixed(1)}" cy="${diem[i][1].toFixed(1)}" r="24" class="nut"/><text x="${diem[i][0].toFixed(1)}" y="${diem[i][1].toFixed(1)}">${x}</text></g>`).join('')}</svg>
    <p class="chu-giai"><span style="color: var(--moc)">━ tương sinh</span><span style="color: var(--color-accent)">┅ tương khắc</span></p>`;
  $('bang').innerHTML = HANH.map(x => `<tr><td>${h(x)}</td><td>${B.SINH[x]}</td><td>${HANH.find(k => B.SINH[k] === x)}</td><td>${B.KHAC[x]}</td><td>${HANH.find(k => B.KHAC[k] === x)}</td><td>${B.MAU[x]}</td><td>${B.PHUONG[x]}</td></tr>`).join('');

  function veMot(r) {
    const n = r.napAm, cp = r.cungPhi, phai = $('phai-huong').value;
    const huong = phai === 'batTrach'
      ? (cp ? `<p>Theo <b>Bát trạch</b>, cung phi ${cp.ten} (${cp.nhom}). Bốn hướng tốt: ${cp.huong.filter(x => x.tot).map(x => `<b>${x.huong}</b> (${x.duNien})`).join(', ')}. Bốn hướng xấu: ${cp.huong.filter(x => !x.tot).map(x => `${x.huong} (${x.duNien})`).join(', ')}.</p><p class="muted">Xem chi tiết hướng nhà, bàn làm việc ở trang <a href="phong-thuy.html">Phong thủy cá nhân</a>.</p>`
        : '<p class="canh-bao">Bát trạch tính hướng từ cung phi, mà cung phi cần giới tính. Hãy chọn giới tính rồi tra lại; trang không đoán hướng khi thiếu dữ liệu.</p>')
      : `<p>Theo <b>ngũ hành phương vị</b> (Hậu thiên bát quái), hành ${h(n.hanh)} ứng với hướng <b>${r.phuong.banMenh}</b>; hành tương sinh ${h(r.sinhKhac.duocSinhBoi)} ứng với hướng <b>${r.phuong.tuongSinh}</b>. Cách này dùng để bài trí đồ vật theo hành, không dùng để chọn hướng nhà.</p>`;
    return `<section class="panel" aria-labelledby="h-menh">
      <div class="dau-kq"><span class="chu-lon h-${n.hanh}">${n.hanh}</span><div>
        <h2 id="h-menh">Mệnh ${esc(n.ten)}</h2>
        <p class="doan">Năm ${r.canChi} (${r.nam}), nạp âm ${esc(n.ten)}, nghĩa là "${esc(n.y)}". Ngày sinh âm lịch ${r.am.d}/${r.am.m}${r.am.nhuan ? ' (nhuận)' : ''}/${r.am.y}.</p>
        <p class="muted">${esc(r.moTaQuyTac)}</p></div></div>
      ${r.giaoTiet ? '<p class="canh-bao">Bạn sinh đúng ngày Lập xuân: năm can chi phụ thuộc giờ sinh (trước hay sau thời điểm giao tiết). Kết quả dưới đây tính như đã sang năm mới.</p>' : ''}
      ${r.duong.m <= 2 && r.quyTac === 'tet' && r.nam !== r.duong.y ? `<p class="canh-bao">Bạn sinh trước Tết nên thuộc năm ${r.canChi} (${r.nam}), không phải năm ${r.duong.y}.</p>` : ''}
      <div class="luoi">
        <div class="o"><span class="nhan">Thiên can năm</span><span class="lon">${r.can.ten}</span><p>${r.can.amDuong}, hành ${h(r.can.hanh)}</p></div>
        <div class="o"><span class="nhan">Địa chi năm</span><span class="lon">${r.chi.ten}</span><p>Con ${r.chi.con}, ${r.chi.amDuong.toLowerCase()}, hành ${h(r.chi.hanh)}</p></div>
        <div class="o"><span class="nhan">Ngũ hành nạp âm</span><span class="lon">${esc(n.ten)}</span><p>Hành ${h(n.hanh)}: ${esc(n.y)}</p></div>
        ${cp ? `<div class="o"><span class="nhan">Cung phi (Bát trạch)</span><span class="lon">${cp.ten}</span><p>Hành ${h(cp.hanh)}, ${cp.nhom}${cp.ghiChu ? `. ${cp.ghiChu}` : ''}</p></div>` : ''}
      </div></section>
    <section class="panel" aria-labelledby="h-he">
      <h2 id="h-he">Đừng đánh đồng các loại "mệnh"</h2>
      <p class="doan">Cùng một người có thể mang nhiều hành khác nhau, vì mỗi hệ thống luận giải lấy hành từ một chỗ khác nhau. Đây là lý do hai trang web có thể nói bạn "mệnh Thổ" và "mệnh Thủy" mà không trang nào tính sai.</p>
      <div class="table-wrap"><table class="bang"><thead><tr><th>Hệ thống</th><th>Hành</th><th>Lấy từ</th><th>Dùng để</th></tr></thead><tbody>
      ${r.heThong.map(x => `<tr><td>${x.ten}</td><td>${h(x.hanh)}</td><td>${esc(x.chiTiet)}</td><td>${x.dung}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="panel" aria-labelledby="h-sk">
      <h2 id="h-sk">Tương sinh, tương khắc với mệnh ${n.hanh}</h2>
      <div class="luoi">
        <div class="o tot"><span class="nhan">Được sinh bởi</span><span class="lon">${h(r.sinhKhac.duocSinhBoi)}</span><p>${r.sinhKhac.duocSinhBoi} sinh ${n.hanh}: nguồn nâng đỡ, được coi là thuận nhất.</p></div>
        <div class="o vua"><span class="nhan">Sinh ra</span><span class="lon">${h(r.sinhKhac.sinhRa)}</span><p>${n.hanh} sinh ${r.sinhKhac.sinhRa}: mình cho đi, hao bớt sức.</p></div>
        <div class="o vua"><span class="nhan">Khắc</span><span class="lon">${h(r.sinhKhac.khac)}</span><p>${n.hanh} khắc ${r.sinhKhac.khac}: mình chế ngự được, nhưng phải bỏ công.</p></div>
        <div class="o xau"><span class="nhan">Bị khắc bởi</span><span class="lon">${h(r.sinhKhac.biKhacBoi)}</span><p>${r.sinhKhac.biKhacBoi} khắc ${n.hanh}: dễ bị áp chế, nên tiết chế.</p></div>
      </div>
      ${n.ngoaiLe ? `<p class="muted">Ghi chú: một số sách xem tuổi cho rằng ${esc(n.ten)} gặp ${n.ngoaiLe} không bị hại mà lại thành tốt. Trang vẫn tính theo quy tắc sinh khắc chung.</p>` : ''}</section>
    <section class="panel" aria-labelledby="h-mau">
      <h2 id="h-mau">Màu sắc và con số</h2>
      <div class="luoi">
        <div class="o tot"><span class="nhan">Màu tương sinh (${r.mau.tuongSinh.hanh})</span><p>${r.mau.tuongSinh.mau}</p></div>
        <div class="o tot"><span class="nhan">Màu bản mệnh (${r.mau.banMenh.hanh})</span><p>${r.mau.banMenh.mau}</p></div>
        <div class="o vua"><span class="nhan">Màu mình chế ngự (${r.mau.che.hanh})</span><p>${r.mau.che.mau}: dùng được</p></div>
        <div class="o xau"><span class="nhan">Màu nên hạn chế (${r.mau.nenTranh.hanh})</span><p>${r.mau.nenTranh.mau}</p></div>
      </div>
      <p class="muted">Con số theo Hà Đồ: bản mệnh ${r.so.banMenh}; tương sinh ${r.so.tuongSinh}. Màu và số theo mệnh nạp âm là quan niệm dân gian, nên dùng như sở thích.</p></section>
    <section class="panel" aria-labelledby="h-huong"><h2 id="h-huong">Phương hướng</h2>${huong}</section>`;
  }
  function veHai(A, Bm) {
    const q = B.haiMenh(A, Bm);
    return `<section class="panel" aria-labelledby="h-hai"><h2 id="h-hai">Quan hệ hai bản mệnh</h2>
      <p class="doan">Người thứ nhất ${A.canChi}, mệnh ${A.napAm.ten}. Người thứ hai ${Bm.canChi}, mệnh ${Bm.napAm.ten}.</p>
      <div class="luoi">
        <div class="o ${['sinh', 'duocSinh', 'hoa'].includes(q.napAm.quanHe) ? 'tot' : 'xau'}"><span class="nhan">Ngũ hành nạp âm</span><p>${q.napAm.loi}</p>${q.napAm.ngoaiLe.map(x => `<p class="muted">${x}</p>`).join('')}</div>
        <div class="o"><span class="nhan">Thiên can</span><p>${q.can.loi}</p></div>
        <div class="o"><span class="nhan">Địa chi</span>${q.chi.map(x => `<p>${esc(x)}</p>`).join('')}</div>
        ${q.cungPhi ? `<div class="o ${q.cungPhi.tot ? 'tot' : 'xau'}"><span class="nhan">Cung phi</span><p>${q.cungPhi.loi}</p></div>` : '<div class="o"><span class="nhan">Cung phi</span><p>Chọn giới tính cho cả hai người để xét cung phi.</p></div>'}
      </div>
      <p class="muted">Muốn đánh giá theo mục đích kết hôn hay làm ăn, dùng trang <a href="hop-tuoi.html">Xem tuổi hai người</a>.</p></section>`;
  }

  function tra(e) {
    if (e) e.preventDefault();
    try {
      const opts = { quyTac: $('quy-tac').value };
      const A = B.banMenh(docNgay('a'), Object.assign({ gioiTinh: gt('a') }, opts));
      let html = veMot(A);
      if ($('bd').value || $('bm').value || $('by').value) html += veHai(A, B.banMenh(docNgay('b'), Object.assign({ gioiTinh: gt('b') }, opts)));
      $('loi').hidden = true; $('kq').innerHTML = html; $('kq').hidden = false;
      hoSo.ghi(Object.assign(hoSo.doc() || {}, A.duong, gt('a') ? { gioiTinh: gt('a') } : {}));
      if (e) $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } catch (err) { $('loi').textContent = err.message; $('loi').hidden = false; }
  }
  $('form').addEventListener('submit', tra);
  $('phai-huong').addEventListener('change', () => { if (!$('kq').hidden) tra(); });
  const hs = hoSo.doc();
  if (hs && hs.y) { dienNgay('a', hs); if (hs.gioiTinh) $('a' + hs.gioiTinh).checked = true; tra(); }
})();
