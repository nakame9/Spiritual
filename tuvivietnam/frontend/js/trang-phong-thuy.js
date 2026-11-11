/* Trang Phong thủy cá nhân (Bát trạch): cung phi, la bàn 8 hướng, hướng nhà, bàn làm việc, màu sắc, bố trí. */
(function () {
  'use strict';
  const { $, esc, docNgay, dienNgay, hoSo, ngayVN } = TraCuu, B = BanMenh;
  const gt = () => $('anam').checked ? 'nam' : $('anu').checked ? 'nu' : '';

  // La bàn: Bắc ở trên như bản đồ; mỗi hướng một quạt 45°
  function laBan(cp, huongNha) {
    const goc = h => B.HUONG.indexOf(h) * 45, xy = (r, a) => [170 + r * Math.sin(a * Math.PI / 180), 170 - r * Math.cos(a * Math.PI / 180)].map(x => x.toFixed(1));
    const p = (r, a) => xy(r, a).join(' ');
    return `<svg class="la-ban" viewBox="0 0 340 340" role="img" aria-label="La bàn 8 hướng của cung ${cp.ten}: ${cp.huong.map(x => `${x.huong} ${x.duNien}`).join(', ')}">
      ${cp.huong.map(x => { const a = goc(x.huong), [tx, ty] = xy(150, a), [dx, dy] = xy(84, a);
        return `<path d="M170 170L${p(124, a - 22.5)}A124 124 0 0 1 ${p(124, a + 22.5)}Z" class="${x.tot ? 'tot' : 'xau'}${x.huong === huongNha ? ' nha' : ''}"/>`
          + `<text x="${tx}" y="${ty}">${x.huong}</text><text class="dn" x="${dx}" y="${dy}">${x.duNien}</text>`; }).join('')}
      <circle cx="170" cy="170" r="34"/><text x="170" y="164">${cp.ten}</text><text class="dn" x="170" y="180">${cp.hanh}</text></svg>`;
  }

  function xem(e) {
    if (e) e.preventDefault();
    try {
      const n = docNgay('a'), g = gt();
      if (!g) throw new Error('Bát trạch tính cung phi từ năm sinh và giới tính. Hãy chọn giới tính; trang không suy ra hướng chỉ từ năm sinh.');
      let huongNha = $('huong-nha').value, ghiDo = '';
      const doRaw = $('do').value.trim().replace(',', '.');
      if (doRaw) {
        const d = Number(doRaw);
        if (!Number.isFinite(d) || d < 0 || d >= 360) throw new Error('Số độ la bàn cần từ 0 đến dưới 360.');
        huongNha = B.huongTuDo(d);
        const lech = Math.abs(((d % 45) + 45) % 45 - 22.5);
        ghiDo = `${d}° thuộc hướng ${huongNha}.${lech < 5 ? ` Số đo nằm sát ranh giới hai hướng (cách ${lech.toFixed(1)}°), nên đo lại vài lần ở các điểm khác nhau trước khi kết luận.` : ''}`;
      }
      const bm = B.banMenh(n, { gioiTinh: g, quyTac: $('quy-tac').value }), cp = bm.cungPhi, pt = B.phongThuy(bm, huongNha || '');
      const nha = pt.nha;
      $('kq').innerHTML = `<section class="panel" aria-labelledby="h-pp"><h2 id="h-pp">Phương pháp và dữ liệu đầu vào</h2>
          <div class="table-wrap"><table class="bang"><tbody>
            <tr><td>Trường phái</td><td>Bát trạch (Bát trạch Minh cảnh): chia người theo 8 quái, mỗi quái có 4 hướng tốt và 4 hướng xấu.</td></tr>
            <tr><td>Ngày sinh</td><td>${ngayVN(n)} dương lịch → năm ${bm.canChi} (${bm.nam}). ${esc(bm.moTaQuyTac)}</td></tr>
            <tr><td>Giới tính</td><td>${g === 'nam' ? 'Nam' : 'Nữ'}: công thức cung phi khác nhau cho nam và nữ.</td></tr>
            <tr><td>Cung phi</td><td>Số ${cp.so} → quái <b>${cp.ten}</b>, hành ${cp.hanh}, ${cp.nhom}.${cp.ghiChu ? ` ${cp.ghiChu}` : ''}</td></tr>
            <tr><td>Hướng nhà</td><td>${huongNha ? `${ghiDo || huongNha} (hướng nhìn ra của cửa chính).` : 'Chưa nhập: trang chỉ đưa hướng nên chọn, không đánh giá nhà cụ thể.'}</td></tr>
          </tbody></table></div>
          ${bm.giaoTiet ? '<p class="canh-bao">Bạn sinh đúng ngày Lập xuân: năm (và cung phi) phụ thuộc giờ sinh.</p>' : ''}
          <p class="muted">Bát trạch không xét: năm xây hoặc năm dọn vào nhà và số độ chính xác (phái Huyền không phi tinh cần), địa hình và công trình xung quanh (loan đầu), ánh sáng, gió, kích thước phòng. Nhà nhiều người ở thường lấy tuổi người trụ cột; mỗi người có thể chọn hướng giường, hướng bàn theo cung phi của mình.</p></section>
        <section class="panel" aria-labelledby="h-hg"><h2 id="h-hg">Tám hướng của cung ${cp.ten}</h2>
          <div class="la-ban-wrap">${laBan(cp, huongNha)}
            <div class="table-wrap"><table class="bang"><thead><tr><th>Hướng</th><th>Du niên</th><th>Ý nghĩa</th></tr></thead><tbody>
            ${[...pt.huongTot, ...pt.huongXau].map(x => `<tr><td>${x.huong}</td><td><span class="muc ${x.tot ? 'tot' : 'xau'}">${x.duNien}</span></td><td>${x.y}</td></tr>`).join('')}</tbody></table></div></div>
          <p class="muted">La bàn vẽ Bắc ở trên như bản đồ (nhiều sách phong thủy vẽ Nam ở trên). Xanh là hướng tốt, đỏ là hướng xấu.</p></section>
        <section class="panel" aria-labelledby="h-nha"><h2 id="h-nha">Hướng nhà</h2>
          <p class="doan">Theo cách phổ biến ở Việt Nam (xét hướng cửa chính nhìn ra), người cung ${cp.ten} hợp nhà hướng <b>${pt.huongTot.map(x => x.huong).join(', ')}</b>; tốt nhất là ${pt.huongTot[0].huong} (Sinh Khí).</p>
          ${nha ? `<div class="o ${nha.tot ? 'tot' : 'xau'}"><span class="nhan">Nhà bạn hướng ${nha.huong}</span>
              <p>Theo hướng cửa: <b>${nha.duNien}</b>, ${nha.tot ? 'hướng tốt' : 'hướng xấu'} (${nha.y}).</p>
              <p>Theo tọa (lưng nhà): nhà hướng ${nha.huong} thì tọa ${nha.toa}, là nhà ${nha.trach} thuộc ${nha.nhomTrach}; ${nha.hopTheoToa ? `cùng nhóm với ${cp.nhom}` : `khác nhóm với ${cp.nhom}`}.</p>
              ${nha.tot !== nha.hopTheoToa ? '<p class="canh-bao">Hai cách xét cho kết luận khác nhau. Sách Bát trạch cổ xét nhà theo tọa, còn cách xét theo hướng cửa phổ biến hơn ở Việt Nam. Khi hai cách vênh nhau, nên ưu tiên bố trí phòng ngủ, bếp, bàn làm việc theo hướng tốt của bạn hơn là kết luận cả ngôi nhà tốt hay xấu.</p>' : ''}
              ${nha.tot ? '' : `<p>Nếu không đổi được hướng cửa, cách thường dùng là đặt phòng ngủ, bàn làm việc, bếp theo các hướng tốt bên dưới.</p>`}</div>` : ''}
        </section>
        <section class="panel" aria-labelledby="h-bl"><h2 id="h-bl">Hướng bàn làm việc</h2>
          <p class="doan">${pt.banLamViec.loi}</p>
          <div class="luoi">${['Sinh Khí', 'Diên Niên', 'Thiên Y', 'Phục Vị'].map((dn, i) => `<div class="o tot"><span class="nhan">${dn}</span><span class="lon">${pt.banLamViec.quayMat[i]}</span><p>${B.DU_NIEN_Y[dn][1]}</p></div>`).join('')}</div></section>
        <section class="panel" aria-labelledby="h-kg"><h2 id="h-kg">Không gian sống và bố trí cơ bản</h2>
          <div class="table-wrap"><table class="bang"><tbody>${pt.phong.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table></div>
          <p class="muted">Khu (khu vực) tính từ tâm ngôi nhà theo la bàn. Những nguyên tắc chung không phụ thuộc tuổi: lối vào gọn, đủ ánh sáng và thông gió, không đặt giường dưới xà ngang hay đối diện gương, bàn làm việc không quay lưng ra cửa, bếp không đối diện trực tiếp nhà vệ sinh.</p></section>
        <section class="panel" aria-labelledby="h-ms"><h2 id="h-ms">Màu sắc</h2>
          <p class="doan">Có hai cách chọn màu, dựa trên hai "hành" khác nhau của bạn. Chúng có thể trùng hoặc khác nhau.</p>
          <div class="hai-nguoi">${[['Theo mệnh nạp âm', `${bm.napAm.ten}`, pt.mau.napAm, 'Cách người Việt hay dùng khi chọn màu xe, màu quần áo.'], ['Theo cung phi', `quái ${cp.ten}`, pt.mau.cungPhi, 'Cách dùng trong Bát trạch khi chọn màu sơn, màu nội thất cho phòng của mình.']].map(([t, x, m, dung]) => `<div class="o">
            <span class="nhan">${t} (${x}, hành ${m.hanh})</span><p><b>Tương sinh:</b> ${m.tuongSinh}</p><p><b>Bản mệnh:</b> ${m.banMenh}</p><p><b>Nên hạn chế:</b> ${m.nenTranh}</p><p class="muted">${dung}</p></div>`).join('')}</div></section>`;
      $('kq').hidden = false; $('loi').hidden = true;
      hoSo.ghi(Object.assign(hoSo.doc() || {}, n, { gioiTinh: g }));
      if (e) $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } catch (err) { $('kq').hidden = true; $('loi').textContent = err.message; $('loi').hidden = false; }
  }
  $('form').addEventListener('submit', xem);
  const hs = hoSo.doc();
  if (hs && hs.y) { dienNgay('a', hs); if (hs.gioiTinh) { $('a' + hs.gioiTinh).checked = true; xem(); } }
})();
