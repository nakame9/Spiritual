/* Lõi thiên văn cho cung hoàng đạo: vị trí các thiên thể trên hoàng đạo nhiệt đới (hoàng đạo thật của ngày),
 * cung Mọc, thiên đỉnh, đổi giờ địa phương sang UTC theo múi giờ IANA (có lịch sử, ví dụ miền Nam trước 1975 dùng UTC+8),
 * nghịch hành, ngày giao cung, trăng non/trăng tròn, nhật/nguyệt thực.
 * Dựa trên Astronomy Engine (MIT, Don Cross). Dùng chung cho trình duyệt và backend. */
(function (root) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./vendor/astronomy.browser.min.js') : root.Astronomy;
  const DO = Math.PI / 180;
  const chuan = x => ((x % 360) + 360) % 360;

  // Thứ tự cố định: mã nội bộ → tên thiên thể trong Astronomy Engine
  const THIEN_THE = { matTroi: 'Sun', matTrang: 'Moon', thuy: 'Mercury', kim: 'Venus', hoa: 'Mars', moc: 'Jupiter', tho: 'Saturn', thienVuong: 'Uranus', haiVuong: 'Neptune', diemVuong: 'Pluto' };

  /** Kinh độ hoàng đạo (độ, 0 = 0° Bạch Dương) của một thiên thể nhìn từ Trái Đất lúc t (Date) */
  function kinhDo(ma, t) {
    if (ma === 'matTroi') return A.SunPosition(t).elon;
    if (ma === 'matTrang') return A.EclipticGeoMoon(t).lon;
    return A.Ecliptic(A.GeoVector(THIEN_THE[ma], t, true)).elon;
  }
  /** Tốc độ (độ/ngày), âm là nghịch hành */
  function tocDo(ma, t) {
    const h = ma === 'matTrang' ? 0.05 : 0.5, a = kinhDo(ma, new Date(+t - h * 864e5)), b = kinhDo(ma, new Date(+t + h * 864e5));
    return (((b - a + 540) % 360) - 180) / (2 * h);
  }
  const cungCua = lon => Math.floor(chuan(lon) / 30); // 0 = Bạch Dương … 11 = Song Ngư

  /** Vị trí mọi thiên thể lúc t: { ma: { lon, cung, doTrongCung, nghich } } */
  function viTriCacSao(t) {
    const out = {};
    for (const ma of Object.keys(THIEN_THE)) {
      const lon = chuan(kinhDo(ma, t));
      out[ma] = { lon, cung: cungCua(lon), doTrongCung: lon % 30, nghich: ma !== 'matTroi' && ma !== 'matTrang' && tocDo(ma, t) < 0 };
    }
    return out;
  }

  /** Cung Mọc (Ascendant) và Thiên đỉnh (MC) lúc t tại vĩ độ, kinh độ (độ, đông và bắc là dương) */
  function truc(t, viDo, kinhDoDiaLy) {
    const ramc = chuan(A.SiderealTime(t) * 15 + kinhDoDiaLy) * DO, e = A.e_tilt(A.MakeTime(t)).tobl * DO, phi = viDo * DO;
    const asc = chuan(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) / DO);
    const mc = chuan(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(e)) / DO);
    return { asc, mc };
  }

  // ---------- Giờ địa phương ↔ UTC theo múi giờ IANA ----------
  const boDinhDang = {};
  /** Độ lệch (phút) của múi giờ tz so với UTC tại thời điểm utcMs */
  function doLech(tz, utcMs) {
    const f = boDinhDang[tz] || (boDinhDang[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', era: 'short' }));
    const p = {}; f.formatToParts(new Date(utcMs)).forEach(x => { p[x.type] = x.value; });
    const y = p.era === 'BC' || p.era === 'B' ? 1 - Number(p.year) : Number(p.year);
    const d = new Date(0); d.setUTCFullYear(y, Number(p.month) - 1, Number(p.day)); d.setUTCHours(Number(p.hour) % 24, Number(p.minute), Number(p.second), 0);
    return Math.round((d.getTime() - Math.floor(utcMs / 1000) * 1000) / 60000);
  }
  /** Giờ địa phương (năm, tháng 1–12, ngày, giờ, phút) ở múi giờ tz → Date (UTC) */
  function sangUTC(y, m, d, h, mi, tz) {
    const gia = new Date(0); gia.setUTCFullYear(y, m - 1, d); gia.setUTCHours(h, mi, 0, 0);
    let t = gia.getTime() - doLech(tz, gia.getTime()) * 60000;
    t = gia.getTime() - doLech(tz, t) * 60000; // lượt hai cho đúng quanh lúc đổi giờ mùa hè
    return new Date(t);
  }
  /** Ngày dương lịch (y, m, d) của thời điểm t theo múi giờ tz */
  function ngayTai(t, tz) {
    const lech = doLech(tz, +t), x = new Date(+t + lech * 60000);
    return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate(), h: x.getUTCHours(), mi: x.getUTCMinutes(), lech };
  }

  // ---------- Tìm sự kiện ----------
  /** Lúc thiên thể ma đổi cung trong [t0, t1): mảng { t, cung } (quét theo bước rồi chia đôi tới ~1 phút) */
  function timGiaoCung(ma, t0, t1, buocNgay) {
    const buoc = (buocNgay || (ma === 'matTrang' ? 0.25 : 1)) * 864e5, out = [];
    let a = +t0, ca = cungCua(kinhDo(ma, new Date(a)));
    for (let b = a + buoc; a < +t1; a = b, b += buoc) {
      const cb = cungCua(kinhDo(ma, new Date(Math.min(b, +t1))));
      if (cb !== ca) {
        let lo = a, hi = Math.min(b, +t1);
        while (hi - lo > 60000) { const g = (lo + hi) / 2; if (cungCua(kinhDo(ma, new Date(g))) === ca) lo = g; else hi = g; }
        out.push({ t: new Date(hi), cung: cb, tu: ca });
        ca = cb;
      }
    }
    return out;
  }
  /** Các đợt nghịch hành của ma giao với [t0, t1): mảng { batDau, ketThuc } (độ chính xác ~1 giờ) */
  function timNghichHanh(ma, t0, t1) {
    const out = [], buoc = 864e5, lui = 60 * 864e5;
    let a = +t0 - lui, na = tocDo(ma, new Date(a)) < 0, dot = na ? { batDau: null } : null;
    const lamMin = (lo, hi, dau) => { while (hi - lo > 3600e3) { const g = (lo + hi) / 2; if ((tocDo(ma, new Date(g)) < 0) === dau) lo = g; else hi = g; } return new Date(hi); };
    for (let b = a + buoc; a < +t1 + lui; a = b, b += buoc) {
      const nb = tocDo(ma, new Date(b)) < 0;
      if (nb !== na) {
        const luc = lamMin(a, b, na);
        if (nb) dot = { batDau: luc }; else if (dot) { dot.ketThuc = luc; out.push(dot); dot = null; }
        na = nb;
      }
    }
    if (dot) out.push(Object.assign(dot, { ketThuc: null }));
    return out.filter(x => (!x.ketThuc || +x.ketThuc >= +t0) && (!x.batDau || +x.batDau < +t1) && x.batDau);
  }
  /** Trăng non (pha 0) và trăng tròn (pha 180) trong [t0, t1) */
  function timTuanTrang(t0, t1) {
    const out = [];
    for (const [pha, loai] of [[0, 'non'], [180, 'tron']]) {
      let t = A.SearchMoonPhase(pha, t0, (t1 - t0) / 864e5 + 1);
      while (t && +t.date < +t1) {
        out.push({ loai, t: t.date, lon: chuan(kinhDo('matTrang', t.date)) });
        t = A.SearchMoonPhase(pha, new Date(+t.date + 864e5), (t1 - t.date) / 864e5);
      }
    }
    return out.sort((a, b) => a.t - b.t);
  }
  /** Nhật thực và nguyệt thực trong [t0, t1) */
  function timThuc(t0, t1) {
    const out = [];
    for (let e = A.SearchLunarEclipse(t0); +e.peak.date < +t1; e = A.NextLunarEclipse(e.peak))
      out.push({ loai: 'nguyet', kieu: e.kind, t: e.peak.date, lon: chuan(kinhDo('matTrang', e.peak.date)) });
    for (let e = A.SearchGlobalSolarEclipse(t0); +e.peak.date < +t1; e = A.NextGlobalSolarEclipse(e.peak))
      out.push({ loai: 'nhat', kieu: e.kind, t: e.peak.date, lon: chuan(kinhDo('matTroi', e.peak.date)) });
    return out.sort((a, b) => a.t - b.t);
  }

  /** Góc chiếu chính giữa hai kinh độ: { ma, goc, sai } hoặc null. Sai số cho phép rộng hơn khi có Mặt Trời/Mặt Trăng. */
  const GOC = [['hop', 0, 8], ['xung', 180, 8], ['tamHop', 120, 7], ['vuong', 90, 7], ['lucHop', 60, 5]];
  function gocChieu(l1, l2, rong) {
    const d = Math.abs(((l1 - l2 + 540) % 360) - 180);
    for (const [ma, goc, sai] of GOC) if (Math.abs(d - goc) <= sai + (rong ? 2 : 0)) return { ma, goc, sai: Math.abs(d - goc) };
    return null;
  }

  const ThienVan = { THIEN_THE, chuan, kinhDo, tocDo, cungCua, viTriCacSao, truc, doLech, sangUTC, ngayTai, timGiaoCung, timNghichHanh, timTuanTrang, timThuc, gocChieu };
  if (typeof module !== 'undefined' && module.exports) module.exports = ThienVan; else root.ThienVan = ThienVan;
})(typeof window !== 'undefined' ? window : globalThis);
