/* Vẽ vòng bản đồ sao bằng SVG: cung Mọc nằm bên trái (9 giờ), kinh độ tăng ngược chiều kim đồng hồ như bản đồ sao thông thường. */
(function (root) {
  'use strict';
  const { CUNG } = root.HoangDao;
  const R = 258, R0 = 232, R1 = 196, R2 = 174, RS = 150, RD = 126, R3 = 106;
  const MAU_GOC = { tamHop: 'var(--hoa-hop)', lucHop: 'var(--hoa-hop)', vuong: 'var(--cang)', xung: 'var(--cang)' };

  function veBanDo(bd) {
    const asc = bd.cungMoc ? bd.cungMoc.lon : 0;
    const g = lon => (180 + lon - asc) * Math.PI / 180;
    const xy = (lon, r) => `${(r * Math.cos(g(lon))).toFixed(1)} ${(-r * Math.sin(g(lon))).toFixed(1)}`;
    const p = [];
    // 12 cung: dải màu theo nguyên tố và ký hiệu
    CUNG.forEach((c, i) => {
      const a = i * 30, b = a + 30;
      p.push(`<path d="M${xy(a, R0)} A${R0} ${R0} 0 0 0 ${xy(b, R0)} L${xy(b, R1)} A${R1} ${R1} 0 0 1 ${xy(a, R1)} Z" style="fill: var(--${c.nguyenTo}); fill-opacity: .1; stroke: var(--line)"/>`);
      const [x, y] = xy(a + 15, (R0 + R1) / 2).split(' ');
      p.push(`<text class="ky-svg" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="21" style="fill: var(--${c.nguyenTo})">${c.kyHieu}</text>`);
    });
    // Vạch chia độ: 10° dài, 5° ngắn
    for (let d = 0; d < 360; d += 5) p.push(`<path d="M${xy(d, R1)} L${xy(d, R1 - (d % 10 ? 4 : 7))}" style="stroke: var(--soft); stroke-opacity: .6"/>`);
    p.push(`<circle r="${R2}" style="fill: none; stroke: var(--line)"/><circle r="${R3}" style="fill: var(--paper); stroke: var(--line)"/>`);
    // Nhà Whole Sign: số nhà giữa mỗi cung, bắt đầu từ cung Mọc
    if (bd.cungMoc) {
      const goc0 = Math.floor(asc / 30) * 30;
      for (let n = 0; n < 12; n++) {
        const [x, y] = xy(goc0 + n * 30 + 15, (R1 + R2) / 2).split(' ');
        p.push(`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="10.5" style="fill: var(--soft)">${n + 1}</text>`);
        p.push(`<path d="M${xy(goc0 + n * 30, R1)} L${xy(goc0 + n * 30, R2)}" style="stroke: var(--line)"/>`);
      }
      for (const [lon, nhan] of [[asc, 'AC'], [asc + 180, 'DC'], [bd.thienDinh.lon, 'MC'], [bd.thienDinh.lon + 180, 'IC']]) {
        p.push(`<path d="M${xy(lon, R0)} L${xy(lon, R3)}" style="stroke: var(--tu); stroke-width: ${nhan === 'AC' || nhan === 'MC' ? 2.2 : 1.2}"/>`);
        const [x, y] = xy(lon, R0 + 14).split(' '); // nhãn trục nằm ngoài vòng để không đè lên hành tinh
        p.push(`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" style="fill: var(--tu)">${nhan}</text>`);
      }
    }
    // Góc chiếu (bỏ góc hợp vì hai điểm trùng nhau)
    const lon = Object.fromEntries(bd.sao.map(s => [s.ma, s.lon]));
    bd.gocChieu.filter(x => MAU_GOC[x.loai]).forEach(x => p.push(`<path d="M${xy(lon[x.a], R3)} L${xy(lon[x.b], R3)}" style="stroke: ${MAU_GOC[x.loai]}; stroke-opacity: .75; stroke-width: 1.3${x.loai === 'lucHop' || x.loai === 'xung' ? '; stroke-dasharray: 4 3' : ''}"/>`));
    // Hành tinh: giãn các ký hiệu đứng quá sát nhau, giữ vạch ở đúng vị trí thật
    const ds = bd.sao.map(s => ({ s, a: s.lon })).sort((u, v) => u.a - v.a), CACH = 9;
    for (let lap = 0; lap < 40; lap++) {
      let doi = false;
      ds.forEach((u, i) => { const v = ds[(i + 1) % ds.length], k = (v.a - u.a + 360) % 360; if (ds.length > 1 && k < CACH) { u.a -= (CACH - k) / 2; v.a += (CACH - k) / 2; doi = true; } });
      if (!doi) break;
    }
    ds.forEach(({ s, a }) => {
      p.push(`<path d="M${xy(s.lon, R2)} L${xy(s.lon, R2 - 7)}" style="stroke: var(--ink); stroke-width: 1.6"/><circle cx="${xy(s.lon, R3).split(' ')[0]}" cy="${xy(s.lon, R3).split(' ')[1]}" r="2.4" style="fill: var(--ink)"/>`);
      if (Math.abs(((a - s.lon + 540) % 360) - 180) > 1.5) p.push(`<path d="M${xy(s.lon, R2 - 7)} L${xy(a, RS + 12)}" style="stroke: var(--soft); stroke-opacity: .6"/>`);
      const [x, y] = xy(a, RS).split(' '), [x2, y2] = xy(a, RD).split(' ');
      p.push(`<text class="ky-svg" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="18" style="fill: ${s.nghich ? 'var(--cang)' : 'var(--ink)'}">${s.kyHieu}</text>`);
      p.push(`<text x="${x2}" y="${y2}" text-anchor="middle" dominant-baseline="central" font-size="9.5" style="fill: var(--soft)">${Math.floor(s.doTrongCung)}°${s.nghich ? 'R' : ''}</text>`);
    });
    const moTa = `Bản đồ sao: ${bd.cungMoc ? `cung Mọc ${bd.cungMoc.tenCung}, ` : ''}${bd.sao.map(s => `${s.ten} ở ${s.tenCung}`).join(', ')}.`;
    return `<svg class="vong-sao" viewBox="${-R} ${-R} ${2 * R} ${2 * R}" role="img" aria-label="${moTa}"><circle r="${R0}" style="fill: var(--cell); stroke: var(--line)"/>${p.join('')}</svg>`;
  }
  root.VeBanDo = veBanDo;
})(window);
