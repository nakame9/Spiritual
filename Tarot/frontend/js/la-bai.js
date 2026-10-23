/* Vẽ lá bài Tarot bằng SVG (viewBox 120 × 200), dùng chung cho trang chủ và trang xem bài.
 * Tự chèn bộ biểu tượng (bộ Gậy, Cốc, Kiếm, Tiền, lưng lá) vào trang. Cần bo-bai.js nạp trước. */
(function (root) {
  'use strict';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SAO4 = 'M12 1.5l2.6 7.9 7.9 2.6-7.9 2.6L12 22.5l-2.6-7.9L1.5 12l7.9-2.6z';

  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="sao4" viewBox="0 0 24 24"><path d="${SAO4}" fill="currentColor"/></symbol>
  <symbol id="g-gay" viewBox="0 0 24 24"><g fill="currentColor"><rect x="10.8" y="1.5" width="2.4" height="21" rx="1.2"/><path d="M13 7c2.6-1.6 5.2-1.2 6.6.8-2.6 1.6-5.2 1.2-6.6-.8zM11 12.5c-2.6-1.6-5.2-1.2-6.6.8 2.6 1.6 5.2 1.2 6.6-.8z"/></g></symbol>
  <symbol id="g-coc" viewBox="0 0 24 24"><path fill="currentColor" d="M5 2.5h14c0 5.2-2.9 8.4-5.8 9.1V18h3.8v2.5H7V18h3.8v-6.4C7.9 10.9 5 7.7 5 2.5z"/></symbol>
  <symbol id="g-kiem" viewBox="0 0 24 24"><g fill="currentColor"><path d="M12 .8l2 3.2v11.2h-4V4z"/><rect x="6.5" y="15" width="11" height="2.2" rx="1.1"/><rect x="11" y="17" width="2" height="4"/><circle cx="12" cy="22" r="1.5"/></g></symbol>
  <symbol id="g-tien" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><polygon fill="currentColor" points="12,5 13.65,9.73 18.66,9.84 14.66,12.87 16.11,17.66 12,14.8 7.89,17.66 9.34,12.87 5.34,9.84 10.35,9.73"/></symbol>
  <symbol id="mat-sau" viewBox="0 0 120 200">
    <rect x=".75" y=".75" width="118.5" height="198.5" rx="9" style="fill: var(--back); stroke: var(--back-2)"/>
    <rect x="7" y="7" width="106" height="186" rx="6" fill="none" style="stroke: var(--back-star)" stroke-opacity=".5"/>
    <g style="stroke: var(--back-2)" stroke-width="1" fill="none">
      <path d="M7 40 L60 7 L113 40 M7 80 L60 47 L113 80 M7 120 L60 87 L113 120 M7 160 L60 127 L113 160 M7 193 L60 167 L113 193"/>
      <path d="M7 60 L60 93 L113 60 M7 20 L60 53 L113 20 M7 100 L60 133 L113 100 M7 140 L60 173 L113 140"/>
    </g>
    <circle cx="60" cy="100" r="26" style="fill: var(--back); stroke: var(--back-star)" stroke-opacity=".7"/>
    <path transform="translate(42 82) scale(1.5)" d="${SAO4}" style="fill: var(--back-star)"/>
  </symbol>
</svg>`);

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
  /** Một lá bài: úp (mặc định), lật lên bằng lớp "up", hoặc ngửa sẵn không hiệu ứng ("static") */
  const theLa = (c, nguoc, lop) => `<div class="card ${lop || ''}"><div class="in"><div class="back">${lungLa}</div>
    <div class="face${nguoc ? ' rev' : ''}">${c ? matLa(c) : ''}</div></div></div>`;

  root.LaBai = { theLa, matLa, esc };
})(window);
