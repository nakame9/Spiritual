/* Giao diện xem bài Tarot: vẽ lá bài bằng SVG, chọn lá từ bộ bài úp, lật bài và đọc ý nghĩa. Cần bo-bai.js. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const giam = matchMedia('(prefers-reduced-motion: reduce)');

  // ---------- Vẽ lá bài (viewBox 120 × 200) ----------
  const PIP = {
    2: [[60, 56], [60, 128]], 3: [[60, 52], [60, 92], [60, 132]],
    4: [[42, 56], [78, 56], [42, 128], [78, 128]], 5: [[42, 56], [78, 56], [60, 92], [42, 128], [78, 128]],
    6: [[42, 52], [78, 52], [42, 92], [78, 92], [42, 132], [78, 132]], 7: [[42, 52], [78, 52], [60, 72], [42, 92], [78, 92], [42, 132], [78, 132]],
    8: [[42, 52], [78, 52], [60, 72], [42, 92], [78, 92], [60, 112], [42, 132], [78, 132]],
    9: [[42, 50], [78, 50], [42, 77], [78, 77], [60, 92], [42, 107], [78, 107], [42, 134], [78, 134]],
    10: [[42, 50], [78, 50], [60, 63], [42, 77], [78, 77], [42, 107], [78, 107], [60, 121], [42, 134], [78, 134]],
  };
  const dung = (id, x, y, s) => `<use href="#${id}" x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}"/>`;
  function tachDong(t) { // tên dài thì xuống 2 dòng
    if (t.length <= 13) return [t];
    const w = t.split(' '), i = Math.ceil(w.length / 2);
    return [w.slice(0, i).join(' '), w.slice(i).join(' ')];
  }
  function matLa(c) {
    const mau = c.nhom === 'anChinh' ? 'anChinh' : c.bo;
    let giua;
    if (c.nhom === 'anChinh') {
      const vach = [...Array(12).keys()].map(i => { const a = i * Math.PI / 6, x1 = 60 + 30 * Math.cos(a), y1 = 92 + 30 * Math.sin(a), x2 = 60 + 36 * Math.cos(a), y2 = 92 + 36 * Math.sin(a); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; }).join('');
      giua = `<g stroke="currentColor" stroke-width="1.2" fill="none"><circle cx="60" cy="92" r="40"/>${vach}</g>
        ${dung('sao4', 60, 44, 14)}<text x="60" y="${c.so.length > 4 ? 99 : 101}" text-anchor="middle" style="font: 700 ${c.so.length > 4 ? 19 : 26}px var(--f-display); fill: currentColor">${c.so}</text>`;
    } else if (c.hang === 1) giua = dung('g-' + c.bo, 60, 92, 46);
    else if (c.hang <= 10) giua = PIP[c.hang].map(([x, y]) => dung('g-' + c.bo, x, y, 20)).join('');
    else giua = `${dung('g-' + c.bo, 60, 84, 50)}<text x="60" y="138" text-anchor="middle" style="font: 600 10px var(--f-ui); letter-spacing: .12em; fill: currentColor">${c.so.toUpperCase()}</text>`;
    const nhan = c.nhom === 'anChinh' ? c.so : (c.hang <= 10 ? c.so : c.so.split(' ').map(w => w[0]).join(''));
    const dong = tachDong(c.ten);
    return `<svg viewBox="0 0 120 200" role="img" aria-label="${esc(c.ten)}" style="color: var(--s-${mau})">
      <rect x=".75" y=".75" width="118.5" height="198.5" rx="9" style="fill: var(--face); stroke: var(--face-line)"/>
      <rect x="6" y="6" width="108" height="188" rx="6" fill="none" stroke="currentColor" stroke-opacity=".55"/>
      <g fill="currentColor"><text x="13" y="22" style="font: 700 11px var(--f-ui)">${nhan}</text>
      <text x="107" y="178" transform="rotate(180 107 174)" style="font: 700 11px var(--f-ui)">${nhan}</text>${giua}</g>
      <line x1="22" y1="152" x2="98" y2="152" stroke="currentColor" stroke-opacity=".4"/>
      ${dong.map((t, i) => `<text x="60" y="${dong.length > 1 ? 166 + i * 13 : 172}" text-anchor="middle" style="font: 600 11px var(--f-ui); fill: var(--ink)">${esc(t)}</text>`).join('')}
    </svg>`;
  }
  const lungLa = '<svg viewBox="0 0 120 200" aria-hidden="true"><use href="#mat-sau"/></svg>';
  /** Một lá bài: úp (mặc định) hoặc ngửa (up), ngửa sẵn không hiệu ứng (static) */
  const theLa = (c, nguoc, lop) => `<div class="card ${lop || ''}"><div class="in"><div class="back">${lungLa}</div>
    <div class="face${nguoc ? ' rev' : ''}">${c ? matLa(c) : ''}</div></div></div>`;

  // ---------- Trạng thái ----------
  const st = { kieu: '3la', nguoc: true, cauHoi: '', xao: [], chon: [] };
  const soLa = () => Tarot.KIEU_TRAI[st.kieu].viTri.length;
  $('fan').innerHTML = [19, 17, 36].map(id => theLa(Tarot.BO_BAI[id], false, 'static')).join('');

  function veDeck() {
    const moiHang = matchMedia('(max-width: 760px)').matches ? 13 : 26, daChon = new Set(st.chon.map(c => c.i));
    const nut = st.xao.map((x, i) => `<button type="button" data-i="${i}" aria-label="Lá úp thứ ${i + 1}"${daChon.has(i) ? ' disabled' : ''}>${theLa(null, false)}</button>`);
    $('deck').innerHTML = [...Array(Math.ceil(nut.length / moiHang)).keys()].map(r => `<div class="row">${nut.slice(r * moiHang, (r + 1) * moiHang).join('')}</div>`).join('');
  }
  matchMedia('(max-width: 760px)').addEventListener('change', () => { if (st.xao.length) veDeck(); });

  function veSlots() {
    const k = Tarot.KIEU_TRAI[st.kieu];
    $('slots').style.setProperty('--n', k.viTri.length);
    $('slots').innerHTML = k.viTri.map((v, i) => {
      const c = st.chon[i];
      return `<div class="slot"><span class="pos">${v[0]}</span>${c ? theLa(Tarot.BO_BAI[c.id], c.nguoc) : '<div class="empty"></div>'}</div>`;
    }).join('');
    $('count').textContent = `${st.chon.length}/${k.viTri.length}`;
  }

  function batDau() {
    st.kieu = document.querySelector('input[name="kieu"]:checked').value;
    st.nguoc = $('nguoc').checked;
    st.cauHoi = $('cau-hoi').value.trim();
    st.xao = Tarot.xaoBai(st.nguoc); st.chon = [];
    $('chon-moTa').textContent = `Nghĩ về câu hỏi của bạn rồi chọn ${soLa()} lá trong bộ bài.`;
    $('ket-qua').hidden = true; $('buoc2').hidden = false; $('ngau-nhien').disabled = false;
    veDeck(); veSlots();
    $('buoc2').scrollIntoView({ behavior: giam.matches ? 'auto' : 'smooth', block: 'start' });
  }

  function chon(i) {
    if (st.chon.length >= soLa() || st.chon.some(c => c.i === i)) return;
    st.chon.push(Object.assign({ i }, st.xao[i]));
    const nut = $('deck').querySelector(`[data-i="${i}"]`); if (nut) nut.disabled = true;
    veSlots();
    if (st.chon.length === soLa()) { $('ngau-nhien').disabled = true; lat(); }
  }

  function lat() {
    const cards = [...$('slots').querySelectorAll('.card')], buoc = giam.matches ? 0 : 450;
    cards.forEach((el, i) => setTimeout(() => el.classList.add('up'), 250 + i * buoc));
    setTimeout(docKetQua, 250 + cards.length * buoc + (giam.matches ? 0 : 500));
  }

  function docKetQua() {
    const r = Tarot.docBai(st.kieu, st.chon);
    $('kq-tieu-de').textContent = r.tenKieu;
    $('reading').innerHTML = `${st.cauHoi ? `<p class="q"><b>Câu hỏi:</b> ${esc(st.cauHoi)}</p>` : ''}
      ${r.la.map(l => `<div class="item">${theLa(Tarot.BO_BAI[l.id], l.nguoc, 'static')}
        <div><span class="step">${l.viTri}</span><h3>${l.ten}</h3>
        <div class="meta"><span>${l.tenEn}</span><span class="chip ${l.nguoc ? 'n' : 'x'}">${l.nguoc ? 'Ngược' : 'Xuôi'}</span></div>
        <p class="kw">${l.tuKhoa.charAt(0).toUpperCase() + l.tuKhoa.slice(1)}</p><p>${l.y}</p>
        <p class="hint">Vị trí "${l.viTri}": ${l.yViTri.toLowerCase()}.</p></div></div>`).join('')}
      <div class="sum"><h3>Tổng quan</h3><ul>${r.tongQuan.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
    $('ket-qua').hidden = false;
    $('ket-qua').scrollIntoView({ behavior: giam.matches ? 'auto' : 'smooth', block: 'start' });
  }

  $('form').addEventListener('submit', e => { e.preventDefault(); batDau(); });
  $('deck').addEventListener('click', e => { const b = e.target.closest('button'); if (b) chon(Number(b.dataset.i)); });
  $('ngau-nhien').addEventListener('click', () => {
    while (st.chon.length < soLa()) {
      const con = st.xao.map((x, i) => i).filter(i => !st.chon.some(c => c.i === i));
      chon(con[Tarot.ngauNhien(con.length)]);
    }
  });
  $('rut-lai').addEventListener('click', batDau);
  $('lam-lai').addEventListener('click', () => {
    $('buoc2').hidden = true; $('ket-qua').hidden = true; st.xao = []; st.chon = [];
    $('form').scrollIntoView({ behavior: giam.matches ? 'auto' : 'smooth', block: 'start' }); $('cau-hoi').focus({ preventScroll: true });
  });
})();
