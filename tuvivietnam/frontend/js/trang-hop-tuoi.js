/* Trang Xem tuổi kết hôn và làm ăn: báo cáo tương hợp hai người. Trạng thái nằm trong địa chỉ để gửi lại hoặc in. */
(function () {
  'use strict';
  const { $, esc, docNgay, dienNgay, hoSo, ngayVN } = TraCuu, B = BanMenh;
  const gt = p => $(p + 'nam').checked ? 'nam' : $(p + 'nu').checked ? 'nu' : '';
  const MD = { ketHon: ['ketHon'], lamAn: ['lamAn', 'doiTac'], tatCa: ['ketHon', 'lamAn', 'doiTac', 'ketGiao'] };
  const lop = d => d >= 1 ? 'tot' : d > -1 ? 'vua' : 'xau';
  const NAM_NAY = new Date().getFullYear();

  function nguoi(r, ten, nhan) {
    return `<div class="o"><span class="nhan">${nhan}</span><span class="lon">${esc(ten || r.canChi)}</span>
      <p>Sinh ${ngayVN(r.duong)} dương lịch, tức ${r.am.d}/${r.am.m}${r.am.nhuan ? ' nhuận' : ''}/${r.am.y} âm lịch.</p>
      <p>Tuổi <b>${r.canChi}</b> (năm ${r.nam}), ${NAM_NAY - r.nam + 1} tuổi mụ năm ${NAM_NAY}.</p>
      <p>Thiên can ${r.can.ten} (${r.can.hanh} ${r.can.amDuong.toLowerCase()}), địa chi ${r.chi.ten} (con ${r.chi.con}, hành ${r.chi.hanh}).</p>
      <p>Mệnh nạp âm <b>${r.napAm.ten}</b> (${r.napAm.hanh}).${r.cungPhi ? ` Cung phi <b>${r.cungPhi.ten}</b>, ${r.cungPhi.nhom}.` : ''}</p></div>`;
  }

  function xem(e) {
    if (e) e.preventDefault();
    try {
      const a = docNgay('a'), b = docNgay('b'), ga = gt('a'), gb = gt('b'), md = $('muc-dich').value;
      const nc = $('nam-cuoi').value.trim(), namCuoi = nc ? Number(nc) : 0;
      if (nc && (!Number.isInteger(namCuoi) || namCuoi < 1900 || namCuoi > 2200)) throw new Error('Năm dự định cưới cần là số từ 1900 đến 2200.');
      const A = B.banMenh(a, { gioiTinh: ga }), Bm = B.banMenh(b, { gioiTinh: gb });
      const tenA = $('aten').value.trim() || 'Người thứ nhất', tenB = $('bten').value.trim() || 'Người thứ hai';
      const hop = ConGiapHoSo.hopTuoi(A.nam, Bm.nam), q = B.haiMenh(A, Bm);
      const mucDich = hop.mucDich.filter(m => MD[md].includes(m.ma));

      // Kim lâu: xét cho người nữ (cô dâu); không chọn giới tính thì xét cả hai và ghi rõ
      let kimLau = '';
      if (namCuoi && md !== 'lamAn') {
        const xet = [[A, ga, tenA], [Bm, gb, tenB]].filter(([, g]) => g === 'nu');
        const ds = (xet.length ? xet : [[A, ga, tenA], [Bm, gb, tenB]]).map(([r, , t]) => { const k = B.kimLau(r.nam, namCuoi); return `<p><b>${esc(t)}</b>: năm ${namCuoi} là ${k.tuoiMu} tuổi mụ, chia 9 dư ${k.du}. ${k.pham ? `Phạm <b>${k.loai}</b>.` : 'Không phạm Kim lâu.'}</p>`; });
        kimLau = `<section class="panel" aria-labelledby="h-kl"><h2 id="h-kl">Kim lâu năm ${namCuoi}</h2>${ds.join('')}
          <p class="muted">Theo phong tục, tuổi mụ của cô dâu năm cưới chia 9 dư 1, 3, 6 hoặc 8 là phạm Kim lâu. ${xet.length ? '' : 'Chưa chọn giới tính nên trang xét cho cả hai người. '}Nhiều gia đình hóa giải bằng cách xin dâu, hoặc tính theo tuổi mụ của người mẹ; đây là tục lệ, không phải quy luật.</p></section>`;
      }

      const yeuTo = [
        ['Địa chi', q.chi.map(esc).join(' '), hop.quanHe.tamHop || hop.quanHe.lucHop ? 'tot' : hop.quanHe.xung ? 'xau' : 'vua'],
        ['Thiên can', hop.quanHe.can.replace(/^./, c => c.toUpperCase()) + '.', /ngũ hợp|sinh/.test(hop.quanHe.can) ? 'tot' : /khắc/.test(hop.quanHe.can) ? 'xau' : 'vua'],
        ['Ngũ hành nạp âm', q.napAm.loi + (q.napAm.ngoaiLe.length ? ' ' + q.napAm.ngoaiLe.join(' ') : ''), ['sinh', 'duocSinh', 'hoa'].includes(q.napAm.quanHe) ? 'tot' : 'xau'],
        ['Cung phi (Bát trạch)', q.cungPhi ? q.cungPhi.loi : 'Chọn giới tính cho cả hai người để xét cung phi.', q.cungPhi ? (q.cungPhi.tot ? 'tot' : 'xau') : 'vua'],
      ];
      $('kq').innerHTML = `<section class="panel" aria-labelledby="h-bc">
          <h2 id="h-bc">Báo cáo tương hợp: ${esc(tenA)} và ${esc(tenB)}</h2>
          <p class="muted">Lập ngày ${ngayVN({ d: new Date().getDate(), m: new Date().getMonth() + 1, y: NAM_NAY })}. Năm can chi đổi vào Tết Nguyên đán.</p>
          <div class="hai-nguoi">${nguoi(A, $('aten').value.trim(), 'Người thứ nhất')}${nguoi(Bm, $('bten').value.trim(), 'Người thứ hai')}</div>
          <div class="cong-cu-bc"><button type="button" class="btn2" id="in">In hoặc lưu PDF</button><button type="button" class="btn2" id="chep">Sao chép đường dẫn báo cáo</button><span class="muted" id="chep-tb" role="status"></span></div></section>
        <section class="panel" aria-labelledby="h-yt"><h2 id="h-yt">Các yếu tố tương hợp, tương xung</h2>
          <div class="luoi">${yeuTo.map(([t, l, c]) => `<div class="o ${c}"><span class="nhan">${t}</span><p>${l}</p></div>`).join('')}</div>
          <p class="muted">Địa chi xét tam hợp, lục hợp, lục xung (tứ hành xung), tương hình, lục hại, lục phá. Thiên can xét ngũ hợp (Giáp Kỷ, Ất Canh, Bính Tân, Đinh Nhâm, Mậu Quý) và sinh khắc. Nạp âm xét sinh khắc giữa hai mệnh. Cung phi xét du niên giữa hai quái.</p></section>
        <section class="panel" aria-labelledby="h-md"><h2 id="h-md">Đánh giá theo mục đích</h2>
          <div class="luoi">${mucDich.map(m => `<div class="o ${lop(m.diem)}"><span class="nhan">${m.ten}</span><p><span class="muc ${lop(m.diem)}">${m.muc}</span></p>
            ${m.thuan.length ? `<p><b>Thuận:</b> ${m.thuan.join('; ')}.</p>` : ''}${m.nghich.length ? `<p><b>Cần lưu ý:</b> ${m.nghich.join('; ')}.</p>` : ''}
            ${m.ma === 'ketHon' && q.cungPhi ? `<p><b>Cung phi:</b> ${q.cungPhi.duNien} (${q.cungPhi.tot ? 'tốt' : 'xấu'}), xét riêng, không cộng vào mức trên.</p>` : ''}
            <p>${m.loiKhuyen}</p></div>`).join('')}</div>
          <p class="muted">Mức đánh giá cộng điểm các yếu tố địa chi, thiên can và nạp âm với trọng số riêng cho từng mục đích (ví dụ khi làm ăn, mệnh người kia khắc mệnh mình bị trừ nặng hơn). Cách tính giống phần Tra tuổi hợp ở trang <a href="../con-giap.html#tuoi-hop">12 con giáp</a>.</p></section>
        ${kimLau}
        <section class="panel" aria-labelledby="h-lu"><h2 id="h-lu">Đọc báo cáo thế nào</h2>
          <p class="doan">Xem tuổi là phong tục tham khảo, không phải dự báo. Các hệ thống (địa chi, thiên can, nạp âm, cung phi) thường cho kết luận khác nhau, và hiếm cặp nào "hợp" ở mọi mặt. Với hôn nhân, sự tôn trọng, cách giải quyết bất đồng và giá trị sống chung quan trọng hơn. Với làm ăn, năng lực, uy tín và thỏa thuận rõ ràng bằng văn bản mới là nền tảng.</p></section>`;
      $('kq').hidden = false; $('loi').hidden = true;
      const p = new URLSearchParams({ a: `${a.y}-${a.m}-${a.d}${ga ? '-' + ga : ''}`, b: `${b.y}-${b.m}-${b.d}${gb ? '-' + gb : ''}`, md });
      if ($('aten').value.trim()) p.set('ta', $('aten').value.trim()); if ($('bten').value.trim()) p.set('tb', $('bten').value.trim()); if (namCuoi) p.set('cuoi', namCuoi);
      history.replaceState(null, '', '#' + p);
      hoSo.ghi(Object.assign(hoSo.doc() || {}, a, ga ? { gioiTinh: ga } : {}));
      $('in').addEventListener('click', () => print());
      $('chep').addEventListener('click', () => navigator.clipboard.writeText(location.href).then(() => { $('chep-tb').textContent = 'Đã sao chép.'; }, () => { $('chep-tb').textContent = 'Không sao chép được, hãy chép địa chỉ trên thanh trình duyệt.'; }));
      if (e) $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } catch (err) { $('loi').textContent = err.message; $('loi').hidden = false; }
  }
  $('form').addEventListener('submit', xem);
  $('muc-dich').addEventListener('change', () => { $('o-cuoi').hidden = $('muc-dich').value === 'lamAn'; });

  // Mở từ đường dẫn báo cáo, hoặc điền sẵn hồ sơ đã lưu
  const p = new URLSearchParams(location.hash.slice(1));
  const dien = (k, v) => { const [y, m, d, g] = (v || '').split('-'); if (!d) return false; dienNgay(k, { d, m, y }); if (g === 'nam' || g === 'nu') $(k + g).checked = true; return true; };
  if (dien('a', p.get('a')) & dien('b', p.get('b'))) {
    if (MD[p.get('md')]) $('muc-dich').value = p.get('md');
    $('aten').value = p.get('ta') || ''; $('bten').value = p.get('tb') || ''; $('nam-cuoi').value = p.get('cuoi') || '';
    $('o-cuoi').hidden = $('muc-dich').value === 'lamAn';
    xem();
  } else { const hs = hoSo.doc(); if (hs && hs.y) { dienNgay('a', hs); if (hs.gioiTinh) $('a' + hs.gioiTinh).checked = true; } }
})();
