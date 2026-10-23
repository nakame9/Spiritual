/* Trang xem bài Tarot: đặt câu hỏi → xáo bài (có hiệu ứng) → rút lá úp → tự lật từng lá → đọc. Cần bo-bai.js và la-bai.js. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const { theLa, esc, soDo } = LaBai;
  const giam = matchMedia('(prefers-reduced-motion: reduce)');
  const co = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  // Ô chọn kiểu trải, xếp theo số lá
  $('spreads').innerHTML = Object.entries(Tarot.KIEU_TRAI).map(([k, t]) => `<label><input type="radio" name="kieu" id="kieu-${k}" value="${k}"${k === '3la' ? ' checked' : ''}>
    <span><em class="so">${t.viTri.length}</em><b>${t.ten}</b><small>${t.viTri.length} lá · ${t.moTa}</small></span></label>`).join('');

  // Mở từ trang chủ với #3la, #10la, #tinhyeu… thì chọn sẵn kiểu trải hoặc chủ đề
  const h = decodeURIComponent(location.hash.slice(1));
  if (co(Tarot.KIEU_TRAI, h)) $('kieu-' + h).checked = true;
  if (co(Tarot.CHU_DE, h)) document.querySelector(`input[name="chude"][value="${h}"]`).checked = true;

  // pha: 'xao' đang xáo → 'rut' chọn lá úp → 'lat' lật từng lá → 'xong'. luot tăng mỗi lần xáo để bỏ các hẹn giờ của lượt cũ.
  const st = { kieu: '3la', chuDe: 'tongquan', nguoc: true, cauHoi: '', xao: [], chon: [], pha: '', luot: 0, bay: [] };
  const kieu = () => Tarot.KIEU_TRAI[st.kieu];
  const soLa = () => kieu().viTri.length;
  const ngang = i => !!(kieu().luoi && kieu().luoi.o[i][2]);
  const cuon = el => el.scrollIntoView({ behavior: giam.matches ? 'auto' : 'smooth', block: 'start' });

  function veDeck() {
    const moiHang = matchMedia('(max-width: 760px)').matches ? 13 : 26, daChon = new Set(st.chon.map(c => c.i));
    const nut = st.xao.map((x, i) => `<button type="button" data-i="${i}" aria-label="Lá úp thứ ${i + 1}"${daChon.has(i) ? ' disabled' : ''}>${theLa(null, false)}</button>`);
    $('deck').innerHTML = [...Array(Math.ceil(nut.length / moiHang)).keys()].map(r => `<div class="row">${nut.slice(r * moiHang, (r + 1) * moiHang).join('')}</div>`).join('');
  }
  matchMedia('(max-width: 760px)').addEventListener('change', () => { if (st.pha === 'rut') veDeck(); });

  // ---------- Các ô trong trải bài ----------
  const tenLa = c => `<span class="ten"><b>${Tarot.BO_BAI[c.id].ten}</b><i class="chip ${c.nguoc ? 'n' : 'x'}">${c.nguoc ? 'Ngược' : 'Xuôi'}</i></span>`;
  const nhanLa = i => { const c = st.chon[i], vt = kieu().viTri[i][0];
    return c.mo ? `${vt}: ${Tarot.BO_BAI[c.id].ten}, ${c.nguoc ? 'ngược' : 'xuôi'}` : `${vt}: lá đang úp, bấm để lật`; };
  function oSlot(i) {
    const k = kieu(), c = st.chon[i], ng = ngang(i);
    const pos = ng ? '' : `<span class="pos">${k.luoi ? `${i + 1}. ` : ''}${k.viTri[i][0]}</span>`;
    if (!c) return `<div class="slot"><div class="empty"></div>${pos}</div>`;
    return `<div class="slot"><button type="button" class="lat" data-o="${i}" aria-label="${nhanLa(i)}"${c.mo || st.pha !== 'lat' ? ' disabled' : ''}>${theLa(Tarot.BO_BAI[c.id], c.nguoc, c.mo ? 'up' : '')}</button>${pos}${c.mo && !ng ? tenLa(c) : ''}</div>`;
  }
  // Bề rộng lá trong sơ đồ: trải càng nhiều lá thì lá càng nhỏ, co theo màn hình
  const BE_RONG = n => n >= 10 ? 'clamp(54px, 13vw, 88px)' : n >= 5 ? 'clamp(64px, 19vw, 108px)' : 'clamp(88px, 27vw, 160px)';
  function veSlots() {
    const k = kieu();
    $('slots').innerHTML = soDo(k, oSlot, BE_RONG(soLa())) + (k.luoi ? `<ol class="chu-giai">${k.viTri.map(([t], i) =>
      `<li id="cg-${i}">${t}${ngang(i) ? ' (lá nằm ngang)' : ''}${ngang(i) && st.chon[i] && st.chon[i].mo ? tenLa(st.chon[i]) : ''}</li>`).join('')}</ol>` : '');
    capNhat();
  }
  const oThu = i => $('slots').querySelectorAll('.sodo > .o')[i];

  function capNhat() {
    const n = soLa(), lat = st.pha === 'lat' || st.pha === 'xong';
    $('ngau-nhien').hidden = lat; $('ngau-nhien').disabled = st.pha !== 'rut';
    $('lat-het').hidden = !lat; $('lat-het').disabled = st.pha !== 'lat';
    $('xao-lai').disabled = st.pha === 'xao';
    $('dem').innerHTML = lat ? `Đã lật <b class="count">${st.chon.filter(c => c.mo).length}/${n}</b>` : `Đã rút <b class="count">${st.chon.length}/${n}</b>`;
  }

  // ---------- Xáo bài: tách đôi bộ bài, trộn xen kẽ 3 lượt, rồi chia ra thành hàng ----------
  const SO_LA_XAO = 16, VONG = 3, MOI_VONG = 700;
  function xaoBai() {
    st.xao = Tarot.xaoBai(st.nguoc); st.chon = []; st.bay = []; st.pha = 'xao'; const luot = ++st.luot;
    veSlots(); $('ket-qua').hidden = true;
    $('deck').hidden = true; $('stage').hidden = false; $('dang-xao').textContent = 'Đang xáo bài…';
    $('stage').innerHTML = Array.from({ length: SO_LA_XAO }, (_, i) => `<div class="sc" style="--i:${i}">${theLa(null)}</div>`).join('');
    const tiep = () => { if (luot === st.luot) xongXao(); };
    if (giam.matches) return tiep();
    const nua = SO_LA_XAO / 2, xep = r => `translate(0, ${(-r * 0.7).toFixed(1)}px)`;
    const anims = [...$('stage').children].map((el, i) => {
      const trai = i < nua, k = i % nua, dx = trai ? -1 : 1;
      const thuTu = 2 * k + (trai ? 0 : 1); // xen kẽ trái, phải như khi trộn bài thật
      const kf = [];
      for (let v = 0; v < VONG; v++) {
        const o = v / VONG, b = 1 / VONG;
        kf.push({ offset: o, transform: `${xep(v ? thuTu : i)} rotate(0deg)` });
        kf.push({ offset: o + b * 0.32, transform: `translate(${dx * (64 + k * 4)}px, ${-k * 1.5}px) rotate(${dx * (8 + k * 1.5)}deg)`, easing: 'cubic-bezier(.3,.6,.3,1)' });
        kf.push({ offset: o + b * (0.5 + thuTu / SO_LA_XAO * 0.4), transform: `${xep(thuTu)} rotate(0deg)` });
      }
      kf.push({ offset: 1, transform: `${xep(thuTu)} rotate(0deg)` });
      return el.animate(kf, { duration: VONG * MOI_VONG, easing: 'ease-in-out', fill: 'forwards' });
    });
    Promise.all(anims.map(a => a.finished)).then(tiep, tiep);
  }
  function xongXao() {
    $('stage').hidden = true; $('deck').hidden = false;
    veDeck();
    const luot = st.luot, xong = () => { if (luot !== st.luot) return; st.pha = 'rut'; capNhat(); $('dang-xao').textContent = `Đã xáo xong. Hãy rút ${soLa()} lá từ bộ bài đang úp.`; };
    if (giam.matches) return xong();
    // Chia bài: từng lá bay từ giữa bộ bài ra đúng chỗ của nó
    const khung = $('deck').getBoundingClientRect(), cx = khung.left + khung.width / 2, cy = khung.top + 60;
    const anims = [...$('deck').querySelectorAll('button')].map((b, i) => {
      const r = b.getBoundingClientRect();
      return b.animate([
        { transform: `translate(${(cx - r.left - r.width / 2).toFixed(0)}px, ${(cy - r.top - r.height / 2).toFixed(0)}px) scale(.9)`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ], { duration: 420, delay: i * 9, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    });
    Promise.all(anims.map(a => a.finished)).then(xong, xong);
  }

  function batDau() {
    st.kieu = document.querySelector('input[name="kieu"]:checked').value;
    st.chuDe = document.querySelector('input[name="chude"]:checked').value;
    st.nguoc = $('nguoc').checked;
    st.cauHoi = $('cau-hoi').value.trim();
    $('chon-moTa').textContent = `Nghĩ về câu hỏi của bạn rồi rút ${soLa()} lá trong bộ bài đang úp. Rút đủ thì lật từng lá để xem.`;
    $('buoc2').hidden = false;
    xaoBai();
    cuon($('buoc2')); // cuộn sau khi đã có sân xáo bài, nếu không trang chưa đủ dài để cuộn tới
  }

  // ---------- Rút bài: lá bay từ bộ bài vào ô của nó ----------
  function bay(o, tu, tre) {
    const vo = oThu(o), el = vo.querySelector('.card');
    if (giam.matches || !tu) return Promise.resolve();
    const den = el.getBoundingClientRect(); // tâm không đổi khi lá nằm ngang, nên so tâm là đủ
    const a = el.animate([
      { translate: `${(tu.left + tu.width / 2 - den.left - den.width / 2).toFixed(0)}px ${(tu.top + tu.height / 2 - den.top - den.height / 2).toFixed(0)}px`,
        scale: String(tu.width / el.offsetWidth), rotate: ngang(o) ? '-90deg' : '0deg' },
      { translate: '0 0', scale: '1', rotate: '0deg' },
    ], { duration: 560, delay: tre, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    vo.classList.add('dang-bay');
    return a.finished.catch(() => {}).then(() => vo.classList.remove('dang-bay'));
  }
  function chon(i, tre = 0) {
    if (st.pha !== 'rut' || st.chon.length >= soLa() || st.chon.some(c => c.i === i)) return;
    const nut = $('deck').querySelector(`[data-i="${i}"]`), tu = nut && nut.getBoundingClientRect(), o = st.chon.length;
    st.chon.push(Object.assign({ i, mo: false }, st.xao[i]));
    if (nut) nut.disabled = true;
    oThu(o).innerHTML = oSlot(o);
    capNhat();
    st.bay.push(bay(o, tu, tre));
    if (st.chon.length === soLa()) { const luot = st.luot; Promise.all(st.bay).then(() => { if (luot === st.luot) moLat(); }); }
  }

  // ---------- Lật bài: người dùng chạm từng lá ----------
  function moLat() {
    st.pha = 'lat';
    $('deck').hidden = true;
    $('slots').querySelectorAll('button.lat').forEach(b => { b.disabled = false; });
    $('dang-xao').textContent = soLa() > 1 ? 'Chạm vào từng lá để lật, hoặc bấm "Lật tất cả".' : 'Chạm vào lá bài để lật.';
    capNhat();
    cuon($('dang-xao'));
    const dau = $('slots').querySelector('button.lat');
    if (dau) dau.focus({ preventScroll: true });
  }
  function latLa(o) {
    const c = st.chon[o];
    if (st.pha !== 'lat' || !c || c.mo) return;
    c.mo = true;
    const nut = $('slots').querySelector(`button.lat[data-o="${o}"]`), dangFocus = document.activeElement === nut;
    nut.disabled = true; nut.setAttribute('aria-label', nhanLa(o));
    nut.querySelector('.card').classList.add('up', 'nhac');
    (ngang(o) ? $('cg-' + o) : nut.parentNode).insertAdjacentHTML('beforeend', tenLa(c));
    const tiep = $('slots').querySelector('button.lat:not(:disabled)');
    if (dangFocus && tiep) tiep.focus({ preventScroll: true });
    capNhat();
    if (st.chon.every(x => x.mo)) {
      st.pha = 'xong'; capNhat();
      $('dang-xao').textContent = 'Đã lật đủ lá. Ý nghĩa ở ngay bên dưới.';
      const luot = st.luot;
      setTimeout(() => { if (luot === st.luot) docKetQua(); }, giam.matches ? 0 : 1100);
    }
  }
  function latHet() {
    const luot = st.luot, buoc = giam.matches ? 0 : (soLa() > 5 ? 180 : 380);
    st.chon.forEach((c, o) => setTimeout(() => { if (luot === st.luot) latLa(o); }, o * buoc));
  }

  function docKetQua() {
    const r = Tarot.docBai(st.kieu, st.chon, st.chuDe);
    $('kq-tieu-de').textContent = `${r.tenKieu} · ${r.tenChuDe}`;
    $('reading').innerHTML = `${st.cauHoi ? `<p class="q"><b>Câu hỏi:</b> ${esc(st.cauHoi)}</p>` : ''}
      ${r.la.map(l => `<div class="item">${theLa(Tarot.BO_BAI[l.id], l.nguoc, 'static')}
        <div><span class="step">${l.viTri}</span><h3>${l.ten}</h3>
        <div class="meta"><span>${l.tenEn}</span><span class="chip ${l.nguoc ? 'n' : 'x'}">${l.nguoc ? 'Ngược' : 'Xuôi'}</span></div>
        <p class="kw">${l.tuKhoa.charAt(0).toUpperCase() + l.tuKhoa.slice(1)}</p><p>${l.y}</p>${l.yChung ? `<p class="hint">Ý nghĩa chung: ${l.yChung}</p>` : ''}
        <p class="hint">Vị trí "${l.viTri}": ${l.yViTri.toLowerCase()}.</p></div></div>`).join('')}
      <div class="sum"><h3>Tổng quan</h3><ul>${r.tongQuan.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
    $('ket-qua').hidden = false;
    cuon($('ket-qua'));
  }

  $('form').addEventListener('submit', e => { e.preventDefault(); batDau(); });
  $('deck').addEventListener('click', e => { const b = e.target.closest('button'); if (b) chon(Number(b.dataset.i)); });
  $('slots').addEventListener('click', e => { const b = e.target.closest('button.lat'); if (b) latLa(Number(b.dataset.o)); });
  $('xao-lai').addEventListener('click', xaoBai);
  $('lat-het').addEventListener('click', latHet);
  $('ngau-nhien').addEventListener('click', () => {
    for (let tre = 0; st.pha === 'rut' && st.chon.length < soLa(); tre += 140) {
      const con = st.xao.map((x, i) => i).filter(i => !st.chon.some(c => c.i === i));
      chon(con[Tarot.ngauNhien(con.length)], tre);
    }
  });
  $('rut-lai').addEventListener('click', batDau);
  $('lam-lai').addEventListener('click', () => {
    st.luot++; st.pha = ''; st.xao = []; st.chon = [];
    $('buoc2').hidden = true; $('ket-qua').hidden = true;
    cuon($('form')); $('cau-hoi').focus({ preventScroll: true });
  });
})();
