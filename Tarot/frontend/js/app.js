/* Trang xem bài Tarot: đặt câu hỏi → xáo bài (có hiệu ứng) → chọn lá → lật bài và đọc. Cần bo-bai.js và la-bai.js. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const { theLa, esc } = LaBai;
  const giam = matchMedia('(prefers-reduced-motion: reduce)');
  const co = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  // Mở từ trang chủ với #3la, #tinhcam, #tinhyeu… thì chọn sẵn kiểu trải hoặc chủ đề
  const h = decodeURIComponent(location.hash.slice(1));
  if (co(Tarot.KIEU_TRAI, h)) $('kieu-' + h).checked = true;
  if (co(Tarot.CHU_DE, h)) document.querySelector(`input[name="chude"][value="${h}"]`).checked = true;

  const st = { kieu: '3la', chuDe: 'tongquan', nguoc: true, cauHoi: '', xao: [], chon: [], dangXao: false };
  const soLa = () => Tarot.KIEU_TRAI[st.kieu].viTri.length;
  const cuon = el => el.scrollIntoView({ behavior: giam.matches ? 'auto' : 'smooth', block: 'start' });

  function veDeck() {
    const moiHang = matchMedia('(max-width: 760px)').matches ? 13 : 26, daChon = new Set(st.chon.map(c => c.i));
    const nut = st.xao.map((x, i) => `<button type="button" data-i="${i}" aria-label="Lá úp thứ ${i + 1}"${daChon.has(i) ? ' disabled' : ''}>${theLa(null, false)}</button>`);
    $('deck').innerHTML = [...Array(Math.ceil(nut.length / moiHang)).keys()].map(r => `<div class="row">${nut.slice(r * moiHang, (r + 1) * moiHang).join('')}</div>`).join('');
  }
  matchMedia('(max-width: 760px)').addEventListener('change', () => { if (st.xao.length && !st.dangXao) veDeck(); });

  function veSlots() {
    const k = Tarot.KIEU_TRAI[st.kieu];
    $('slots').style.setProperty('--n', k.viTri.length);
    $('slots').innerHTML = k.viTri.map((v, i) => {
      const c = st.chon[i];
      return `<div class="slot"><span class="pos">${v[0]}</span>${c ? theLa(Tarot.BO_BAI[c.id], c.nguoc) : '<div class="empty"></div>'}</div>`;
    }).join('');
    $('count').textContent = `${st.chon.length}/${k.viTri.length}`;
  }
  function capNhatNut() {
    $('ngau-nhien').disabled = st.dangXao || st.chon.length >= soLa();
    $('xao-lai').disabled = st.dangXao || st.chon.length >= soLa();
  }

  // ---------- Xáo bài: tách đôi bộ bài, trộn xen kẽ 3 lượt, rồi chia ra thành hàng ----------
  const SO_LA_XAO = 16, VONG = 3, MOI_VONG = 700;
  function xaoBai() {
    st.xao = Tarot.xaoBai(st.nguoc); st.chon = []; st.dangXao = true;
    veSlots(); capNhatNut();
    $('deck').hidden = true; $('stage').hidden = false; $('dang-xao').textContent = 'Đang xáo bài…';
    $('stage').innerHTML = Array.from({ length: SO_LA_XAO }, (_, i) => `<div class="sc" style="--i:${i}">${theLa(null)}</div>`).join('');
    if (giam.matches) return xongXao();
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
    Promise.all(anims.map(a => a.finished)).then(xongXao, xongXao);
  }
  function xongXao() {
    $('stage').hidden = true; $('deck').hidden = false;
    veDeck();
    const xong = () => { st.dangXao = false; capNhatNut(); $('dang-xao').textContent = `Đã xáo xong. Hãy chọn ${soLa()} lá.`; };
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
    $('chon-moTa').textContent = `Nghĩ về câu hỏi của bạn rồi chọn ${soLa()} lá trong bộ bài.`;
    $('ket-qua').hidden = true; $('buoc2').hidden = false;
    cuon($('buoc2'));
    xaoBai();
  }

  function chon(i) {
    if (st.dangXao || st.chon.length >= soLa() || st.chon.some(c => c.i === i)) return;
    st.chon.push(Object.assign({ i }, st.xao[i]));
    const nut = $('deck').querySelector(`[data-i="${i}"]`); if (nut) nut.disabled = true;
    veSlots(); capNhatNut();
    if (st.chon.length === soLa()) lat();
  }

  function lat() {
    const cards = [...$('slots').querySelectorAll('.card')], buoc = giam.matches ? 0 : 450;
    cards.forEach((el, i) => setTimeout(() => el.classList.add('up'), 250 + i * buoc));
    setTimeout(docKetQua, 250 + cards.length * buoc + (giam.matches ? 0 : 500));
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
  $('xao-lai').addEventListener('click', xaoBai);
  $('ngau-nhien').addEventListener('click', () => {
    while (!st.dangXao && st.chon.length < soLa()) {
      const con = st.xao.map((x, i) => i).filter(i => !st.chon.some(c => c.i === i));
      chon(con[Tarot.ngauNhien(con.length)]);
    }
  });
  $('rut-lai').addEventListener('click', batDau);
  $('lam-lai').addEventListener('click', () => {
    $('buoc2').hidden = true; $('ket-qua').hidden = true; st.xao = []; st.chon = [];
    cuon($('form')); $('cau-hoi').focus({ preventScroll: true });
  });
})();
