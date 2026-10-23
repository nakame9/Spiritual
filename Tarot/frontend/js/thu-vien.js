/* Thư viện 78 lá: tìm không dấu, lọc theo nhóm, mở chi tiết lá qua #la-<id> (chia sẻ được, nút Quay lại đóng hộp). Cần bo-bai.js và la-bai.js. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const { theLa } = LaBai, B = Tarot.BO_BAI, ct = $('ct');
  const hoa = s => s.charAt(0).toUpperCase() + s.slice(1);
  const CHU_DE = Object.entries(Tarot.CHU_DE).filter(([k]) => k !== 'tongquan');
  const NHOM = [
    ['anChinh', 'Ẩn Chính', '22 lá', 'Những bước ngoặt, bài học lớn và hành trình trưởng thành, từ Kẻ Khờ đến Thế Giới.'],
    ...Object.entries(Tarot.THONG_TIN_BO).map(([k, b]) => [k, `Bộ ${b.ten}`, `14 lá · ${b.nguyenTo}`, `${b.en}: ${hoa(b.chuDe)}.`]),
  ];
  const thuocNhom = (l, k) => k === 'anChinh' ? l.nhom === 'anChinh' : l.bo === k;

  $('loc').innerHTML = [['', 'Tất cả', '78']].concat(NHOM.map(([k, t, so]) => [k, t, so.split(' ')[0]])).map(([k, t, so]) =>
    `<label><input type="radio" name="nhom" value="${k}"${k ? '' : ' checked'}><span>${t} <small>${so}</small></span></label>`).join('');
  $('thu-vien').innerHTML = NHOM.map(([k, t, so, y]) => `<section class="nhom" id="nhom-${k}" data-nhom="${k}">
    <h2>${t} <small>${so}</small></h2><p class="muted">${y}</p>
    <div class="lib-grid">${B.filter(l => thuocNhom(l, k)).map(l => `<a class="tile" href="#la-${l.id}" data-id="${l.id}">${theLa(l, false, 'static')}<b>${l.ten}</b><small>${l.tenEn}</small></a>`).join('')}</div></section>`).join('');

  // ---------- Tìm và lọc ----------
  function loc() {
    const q = $('tim').value, nhom = document.querySelector('input[name="nhom"]:checked').value;
    const thay = new Set(Tarot.timLa(q, nhom).map(l => l.id));
    document.querySelectorAll('.tile').forEach(t => { t.hidden = !thay.has(Number(t.dataset.id)); });
    document.querySelectorAll('.nhom').forEach(s => { s.hidden = !s.querySelector('.tile:not([hidden])'); });
    $('so-kq').textContent = thay.size ? `${thay.size} lá${q.trim() ? ` khớp với “${q.trim()}”` : ''}` : `Không có lá nào khớp với “${q.trim()}”. Thử từ khóa khác, ví dụ tên tiếng Anh.`;
  }
  $('tim').addEventListener('input', loc);
  $('loc').addEventListener('change', loc);

  // ---------- Chi tiết một lá ----------
  let dangXem = 0;
  function veLa(id) {
    const c = B[id], b = c.bo && Tarot.THONG_TIN_BO[c.bo], truoc = B[(id + 77) % 78], sau = B[(id + 1) % 78];
    dangXem = id;
    $('ct-nd').innerHTML = `<button class="ct-dong" type="button" aria-label="Đóng">×</button>
      <div class="ct-grid">
        <div class="ct-hinh">${theLa(c, false, 'static')}<button class="btn2" type="button" id="ct-xoay" aria-pressed="false">Xem chiều ngược</button></div>
        <div>
          <p class="eyebrow">${c.nhom === 'anChinh' ? `Ẩn Chính · lá số ${c.so}` : `Bộ ${b.ten} · ${b.nguyenTo} · ${b.chuDe}`}</p>
          <h2 id="ct-ten">${c.ten}</h2><p class="muted">${c.tenEn}</p>
          <div class="ct-hai">${['xuoi', 'nguoc'].map(ch => `<section>
            <h3><span class="chip ${ch === 'xuoi' ? 'x' : 'n'}">${ch === 'xuoi' ? 'Xuôi' : 'Ngược'}</span></h3>
            <p class="kw">${hoa(c[ch].tuKhoa)}</p><p>${c[ch].y}</p>
            <dl>${CHU_DE.map(([k, t]) => `<dt>${t.ten}</dt><dd>${c.chuDe[k][ch]}</dd>`).join('')}</dl></section>`).join('')}</div>
        </div>
      </div>
      <nav class="ct-nav" aria-label="Lá khác"><button class="btn2" type="button" data-di="-1">← ${truoc.ten}</button><button class="btn2" type="button" data-di="1">${sau.ten} →</button></nav>`;
  }
  const sang = di => location.replace('#la-' + ((dangXem + di + 78) % 78)); // thay địa chỉ, không chồng thêm lịch sử
  function theoHash() {
    const m = /^#la-(\d{1,2})$/.exec(location.hash), id = m ? Number(m[1]) : -1;
    if (id >= 0 && id < 78) { veLa(id); if (!ct.open) ct.showModal(); $('ct-nd').scrollTop = 0; return; }
    if (ct.open) ct.close();
    const n = /^#nhom-(\w+)$/.exec(location.hash), o = n && document.querySelector(`input[name="nhom"][value="${n[1]}"]`);
    if (o) { o.checked = true; loc(); }
  }
  ct.addEventListener('close', () => { if (/^#la-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); });
  ct.addEventListener('click', e => {
    if (e.target === ct || e.target.closest('.ct-dong')) return ct.close();
    const nut = e.target.closest('[data-di]');
    if (nut) return sang(Number(nut.dataset.di));
    if (e.target.id === 'ct-xoay') {
      const ngc = e.target.getAttribute('aria-pressed') !== 'true';
      e.target.setAttribute('aria-pressed', String(ngc)); e.target.textContent = ngc ? 'Xem chiều xuôi' : 'Xem chiều ngược';
      ct.querySelector('.ct-hinh .face').classList.toggle('rev', ngc);
    }
  });
  ct.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') sang(e.key === 'ArrowLeft' ? -1 : 1); });
  addEventListener('hashchange', theoHash);

  loc();
  theoHash();
})();
