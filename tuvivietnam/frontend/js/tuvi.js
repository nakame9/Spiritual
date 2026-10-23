/* Engine an sao Tử Vi (phái Việt).
 * Lịch âm: thuật toán Hồ Ngọc Đức. Quy tắc an sao chuyển từ lasotuvi (MIT, doanguyen),
 * có sửa: Khôi Việt, Hỏa Linh (Tỵ Dậu Sửu), Phá Toái, Thiên Trù (Quý), Mệnh chủ, thuận/nghịch lý.
 * Cung đánh số 1..12 = Tý..Hợi. */
(function (root) {
  'use strict';
  const INT = Math.trunc, PI = Math.PI, dr = PI / 180;

  // ---------- Lịch âm (Hồ Ngọc Đức) ----------
  function jdFromDate(dd, mm, yy) {
    const a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
    let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    return jd;
  }
  function jdToDate(jd) {
    let b, c;
    if (jd > 2299160) { const a = jd + 32044; b = INT((4 * a + 3) / 146097); c = a - INT(b * 146097 / 4); }
    else { b = 0; c = jd + 32082; }
    const d = INT((4 * c + 3) / 1461), e = c - INT(1461 * d / 4), m = INT((5 * e + 2) / 153);
    return [e - INT((153 * m + 2) / 5) + 1, m + 3 - 12 * INT(m / 10), b * 100 + d - 4800 + INT(m / 10)];
  }
  function newMoon(k) {
    const T = k / 1236.85, T2 = T * T, T3 = T2 * T;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    const deltat = T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
    return Jd1 + C1 - deltat;
  }
  function sunLong(jdn, tz) {
    const T = (jdn - 2451545.5 - tz / 24) / 36525, T2 = T * T;
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    const omega = 125.04 - 1934.136 * T;
    let L = (L0 + DL - 0.00569 - 0.00478 * Math.sin(omega * dr)) * dr;
    L -= PI * 2 * Math.floor(L / (PI * 2));
    return INT(L / PI * 6);
  }
  const newMoonDay = (k, tz) => INT(newMoon(k) + 0.5 + tz / 24);
  function lunarMonth11(yy, tz) {
    const k = INT((jdFromDate(31, 12, yy) - 2415021) / 29.530588853);
    const nm = newMoonDay(k, tz);
    return sunLong(nm, tz) >= 9 ? newMoonDay(k - 1, tz) : nm;
  }
  function leapMonthOffset(a11, tz) {
    const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last, i = 1, arc = sunLong(newMoonDay(k + i, tz), tz);
    do { last = arc; i++; arc = sunLong(newMoonDay(k + i, tz), tz); } while (arc !== last && i < 14);
    return i - 1;
  }
  function solar2lunar(dd, mm, yy, tz = 7) {
    const dayNumber = jdFromDate(dd, mm, yy);
    const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = newMoonDay(k + 1, tz);
    if (monthStart > dayNumber) monthStart = newMoonDay(k, tz);
    let a11 = lunarMonth11(yy, tz), b11 = a11, lunarYear;
    if (a11 >= monthStart) { lunarYear = yy; a11 = lunarMonth11(yy - 1, tz); }
    else { lunarYear = yy + 1; b11 = lunarMonth11(yy + 1, tz); }
    const lunarDay = dayNumber - monthStart + 1, diff = INT((monthStart - a11) / 29);
    let leap = 0, lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      const leapDiff = leapMonthOffset(a11, tz);
      if (diff >= leapDiff) { lunarMonth = diff + 10; if (diff === leapDiff) leap = 1; }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return [lunarDay, lunarMonth, lunarYear, leap];
  }
  function lunar2solar(d, m, y, leap, tz = 7) {
    let a11, b11;
    if (m < 11) { a11 = lunarMonth11(y - 1, tz); b11 = lunarMonth11(y, tz); }
    else { a11 = lunarMonth11(y, tz); b11 = lunarMonth11(y + 1, tz); }
    const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    let off = m - 11; if (off < 0) off += 12;
    if (b11 - a11 > 365) {
      const leapOff = leapMonthOffset(a11, tz);
      let leapM = leapOff - 2; if (leapM < 0) leapM += 12;
      if (leap && m !== leapM) return null;
      if (leap || off >= leapOff) off += 1;
    } else if (leap) return null;
    return jdToDate(newMoonDay(k + off, tz) + d - 1);
  }

  // ---------- Bảng tra ----------
  const CAN = ['', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const HANH = { K: 'Kim', M: 'Mộc', T: 'Thủy', H: 'Hỏa', O: 'Thổ' };
  const CUC = { K: 4, M: 3, T: 2, H: 6, O: 5 };
  const TEN_CUC = { 2: 'Thủy nhị cục', 3: 'Mộc tam cục', 4: 'Kim tứ cục', 5: 'Thổ ngũ cục', 6: 'Hỏa lục cục' };
  const HANH_CUNG = ['', 'T', 'O', 'M', 'M', 'O', 'H', 'H', 'O', 'K', 'K', 'O', 'T'];
  // 30 cặp nạp âm theo thứ tự lục thập hoa giáp
  const NAP_AM = ('Hải Trung Kim,Lư Trung Hỏa,Đại Lâm Mộc,Lộ Bàng Thổ,Kiếm Phong Kim,Sơn Đầu Hỏa,Giản Hạ Thủy,' +
    'Thành Đầu Thổ,Bạch Lạp Kim,Dương Liễu Mộc,Tuyền Trung Thủy,Ốc Thượng Thổ,Tích Lịch Hỏa,Tùng Bách Mộc,' +
    'Trường Lưu Thủy,Sa Trung Kim,Sơn Hạ Hỏa,Bình Địa Mộc,Bích Thượng Thổ,Kim Bạch Kim,Phú Đăng Hỏa,Thiên Hà Thủy,' +
    'Đại Trạch Thổ,Thoa Xuyến Kim,Tang Đố Mộc,Đại Khê Thủy,Sa Trung Thổ,Thiên Thượng Hỏa,Thạch Lựu Mộc,Đại Hải Thủy').split(',');
  const HANH_TEN = { Kim: 'K', Mộc: 'M', Thủy: 'T', Hỏa: 'H', Thổ: 'O' };
  function napAm(can, chi) {
    const n = ((6 * (can - 1) - 5 * (chi - 1)) % 60 + 60) % 60;
    const ten = NAP_AM[n >> 1];
    return { ten, hanh: HANH_TEN[ten.split(' ').pop()] };
  }
  const MENH_CHU = ['', 'Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc', 'Phá Quân', 'Vũ Khúc', 'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'];
  const THAN_CHU = ['', 'Linh Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ'];
  const CUNG_CHU = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];

  // id: [tên, hành, loại]  loại 1 chính tinh, <10 cát, >10 hung (theo lasotuvi)
  const SAO = {
    1: ['Tử Vi', 'O', 1], 2: ['Liêm Trinh', 'H', 1], 3: ['Thiên Đồng', 'T', 1], 4: ['Vũ Khúc', 'K', 1],
    5: ['Thái Dương', 'H', 1], 6: ['Thiên Cơ', 'M', 1], 7: ['Thiên Phủ', 'O', 1], 8: ['Thái Âm', 'T', 1],
    9: ['Tham Lang', 'T', 1], 10: ['Cự Môn', 'T', 1], 11: ['Thiên Tướng', 'T', 1], 12: ['Thiên Lương', 'M', 1],
    13: ['Thất Sát', 'K', 1], 14: ['Phá Quân', 'T', 1],
    15: ['Thái Tuế', 'H', 15], 16: ['Thiếu Dương', 'H', 5], 17: ['Tang Môn', 'M', 12], 18: ['Thiếu Âm', 'T', 5],
    19: ['Quan Phù', 'H', 12], 20: ['Tử Phù', 'K', 12], 21: ['Tuế Phá', 'H', 12], 22: ['Long Đức', 'T', 5],
    23: ['Bạch Hổ', 'K', 12], 24: ['Phúc Đức', 'O', 5], 25: ['Điếu Khách', 'H', 12], 26: ['Trực Phù', 'K', 16],
    27: ['Lộc Tồn', 'O', 3], 109: ['Bác Sỹ', 'T', 5], 28: ['Lực Sĩ', 'H', 2], 29: ['Thanh Long', 'T', 5],
    30: ['Tiểu Hao', 'H', 12], 31: ['Tướng Quân', 'M', 4], 32: ['Tấu Thư', 'K', 3], 33: ['Phi Liêm', 'H', 2],
    34: ['Hỷ Thần', 'H', 5], 35: ['Bệnh Phù', 'O', 12], 36: ['Đại Hao', 'H', 12], 37: ['Phục Binh', 'H', 13],
    38: ['Quan Phủ', 'H', 12],
    39: ['Tràng Sinh', 'T', 5], 40: ['Mộc Dục', 'T', 14], 41: ['Quan Đới', 'K', 4], 42: ['Lâm Quan', 'K', 7],
    43: ['Đế Vượng', 'K', 5], 44: ['Suy', 'T', 12], 45: ['Bệnh', 'H', 12], 46: ['Tử', 'H', 12],
    47: ['Mộ', 'O', 2], 48: ['Tuyệt', 'O', 12], 49: ['Thai', 'O', 14], 50: ['Dưỡng', 'M', 2],
    51: ['Đà La', 'K', 11], 52: ['Kình Dương', 'K', 11], 53: ['Địa Không', 'H', 11], 54: ['Địa Kiếp', 'H', 11],
    55: ['Linh Tinh', 'H', 11], 56: ['Hỏa Tinh', 'H', 11], 57: ['Văn Xương', 'K', 6], 58: ['Văn Khúc', 'T', 6],
    59: ['Thiên Khôi', 'H', 6], 60: ['Thiên Việt', 'H', 6], 61: ['Tả Phù', 'O', 2], 62: ['Hữu Bật', 'O', 2],
    63: ['Long Trì', 'T', 3], 64: ['Phượng Các', 'O', 3], 65: ['Tam Thai', 'M', 7], 66: ['Bát Tọa', 'T', 7],
    67: ['Ân Quang', 'M', 3], 68: ['Thiên Quý', 'O', 3], 69: ['Thiên Khốc', 'T', 12], 70: ['Thiên Hư', 'T', 12],
    71: ['Thiên Đức', 'H', 5], 72: ['Nguyệt Đức', 'H', 5], 73: ['Thiên Hình', 'H', 15], 74: ['Thiên Riêu', 'T', 13],
    75: ['Thiên Y', 'T', 5], 76: ['Quốc Ấn', 'O', 6], 77: ['Đường Phù', 'M', 4], 78: ['Đào Hoa', 'M', 8],
    79: ['Hồng Loan', 'T', 8], 80: ['Thiên Hỷ', 'T', 5], 81: ['Thiên Giải', 'H', 5], 82: ['Địa Giải', 'O', 5],
    83: ['Giải Thần', 'M', 5], 84: ['Thai Phụ', 'K', 6], 85: ['Phong Cáo', 'O', 4], 86: ['Thiên Tài', 'O', 2],
    87: ['Thiên Thọ', 'O', 5], 88: ['Thiên Thương', 'O', 12], 89: ['Thiên Sứ', 'T', 12], 90: ['Thiên La', 'O', 12],
    91: ['Địa Võng', 'O', 12], 92: ['Hóa Khoa', 'T', 5], 93: ['Hóa Quyền', 'T', 4], 94: ['Hóa Lộc', 'M', 3],
    95: ['Hóa Kỵ', 'T', 13], 96: ['Cô Thần', 'O', 13], 97: ['Quả Tú', 'O', 13], 98: ['Thiên Mã', 'H', 3],
    99: ['Phá Toái', 'H', 12], 100: ['Thiên Quan', 'H', 5], 101: ['Thiên Phúc', 'H', 5], 102: ['Lưu Hà', 'T', 12],
    103: ['Thiên Trù', 'O', 5], 104: ['Kiếp Sát', 'H', 11], 105: ['Hoa Cái', 'K', 14], 106: ['Văn Tinh', 'H', 6],
    107: ['Đẩu Quân', 'H', 5], 108: ['Thiên Không', 'T', 11],
  };
  // Miếu (M) Vượng (V) Đắc (Đ) Bình (B) Hãm (H) theo cung Tý..Hợi
  const DAC_TINH = {
    1: 'BĐMBVMMĐMBVB', 2: 'VĐVHMHVĐVHMH', 3: 'VHMĐHĐHHMHHĐ', 4: 'VMVĐMHVMVĐMH', 5: 'HĐVVVMMĐHHHH',
    6: 'ĐĐHMMVĐĐVMMH', 8: 'VĐHHHHHĐVMMM', 9: 'HMĐHVHHMĐHVH', 10: 'VHVMHHVHĐMHĐ', 11: 'VĐMHVĐVĐMHVĐ',
    12: 'VĐVVMHMĐVHMH', 13: 'MĐMHHVMĐMHHV', 14: 'MVHHĐHMVHHĐH', 51: 'HĐHHĐHHĐHHĐH', 52: 'HĐHHĐHHĐHHĐH',
    55: 'HHĐĐĐĐĐHHHHH', 56: 'HHĐĐĐĐĐHHHHH', 57: 'HĐHĐHĐHĐHHĐĐ', 58: 'HĐHĐHĐHĐHHĐĐ', 53: 'HHĐHHĐHHĐHHĐ',
    54: 'HHĐHHĐHHĐHHĐ', 95: '.Đ..Đ..Đ..Đ.', 36: '..ĐĐ....ĐĐ..', 30: '..ĐĐ....ĐĐ..', 69: 'ĐĐ.Đ..ĐĐ.Đ..',
    70: 'ĐĐ.Đ..ĐĐ.Đ..', 98: '..Đ..Đ......', 73: '..ĐĐ....ĐĐ..', 74: '..ĐĐ.....ĐĐ.',
  };
  const VONG_TRANG_SINH = [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];

  const dc = (c, ...d) => { const x = ((d.reduce((s, v) => s + v, c) % 12) + 12) % 12; return x || 12; };
  const kc = (a, b, chieu) => chieu === 1 ? (a - b + 12) % 12 : (b - a + 12) % 12;
  // sinh: K→T→M→H→O→K ; khắc: K→M→O→T→H→K
  const SINH = { K: 'T', T: 'M', M: 'H', H: 'O', O: 'K' }, KHAC = { K: 'M', M: 'O', O: 'T', T: 'H', H: 'K' };
  function sinhKhac(menh, cuc) {
    if (menh === cuc) return 'Cục hòa Bản Mệnh';
    if (SINH[menh] === cuc) return 'Bản Mệnh sinh Cục';
    if (SINH[cuc] === menh) return 'Cục sinh Bản Mệnh';
    if (KHAC[menh] === cuc) return 'Bản Mệnh khắc Cục';
    return 'Cục khắc Bản Mệnh';
  }
  function viTriTuVi(cuc, ngay) {
    let c = cuc, cung = 3;
    while (c < ngay) { c += cuc; cung++; }
    let lech = c - ngay;
    if (lech % 2 === 1) lech = -lech;
    return dc(cung, lech);
  }

  /** opts: {ngay, thang, nam, amLich, nhuan, gio (1=Tý..12=Hợi), namGioi (true=Nam), ten} */
  function lapLaSo(o) {
    let duong, am;
    if (o.amLich) {
      duong = lunar2solar(o.ngay, o.thang, o.nam, o.nhuan ? 1 : 0);
      if (!duong) throw new Error(o.nhuan ? `Năm ${o.nam} âm lịch không có tháng ${o.thang} nhuận.` : 'Ngày âm lịch không hợp lệ.');
      am = [o.ngay, o.thang, o.nam, o.nhuan ? 1 : 0];
      if (o.ngay > 29 && solar2lunar(...duong)[0] !== o.ngay) throw new Error(`Tháng ${o.thang} âm lịch năm ${o.nam} chỉ có 29 ngày.`);
    } else {
      duong = [o.ngay, o.thang, o.nam];
      const t = new Date(o.nam, o.thang - 1, o.ngay);
      if (t.getDate() !== o.ngay || t.getMonth() !== o.thang - 1) throw new Error('Ngày dương lịch không hợp lệ.');
      am = solar2lunar(o.ngay, o.thang, o.nam);
    }
    const [nn, tt, nnnn] = am, gio = o.gio, gt = o.namGioi ? 1 : -1;
    const canNam = (nnnn + 6) % 10 + 1, chiNam = (nnnn + 8) % 12 + 1;
    const canThang = (nnnn * 12 + tt + 3) % 10 + 1;
    const jd = jdFromDate(...duong);
    const canNgay = (jd + 9) % 10 + 1, chiNgay = (jd + 1) % 12 + 1;
    const canGio = ((jd - 1) * 2 % 10 + gio) % 10 || 10;
    const adNam = canNam % 2 ? 1 : -1, thuan = gt * adNam; // Dương Nam, Âm Nữ: thuận

    const cung = [null];
    const canGieng = (canNam * 2 + 1) % 10 || 10;
    for (let i = 1; i <= 12; i++) {
      cung.push({ so: i, chi: CHI[i], can: CAN[(((i - 3 + 12) % 12) + canGieng) % 10 || 10], hanh: HANH[HANH_CUNG[i]], sao: [] });
    }
    const menh = dc(3, tt - 1, -gio + 1), than = dc(3, tt - 1, gio - 1);
    CUNG_CHU.forEach((ten, i) => { cung[dc(menh, i)].ten = ten; });
    cung[than].than = true;
    const cungTen = t => dc(menh, CUNG_CHU.indexOf(t));

    const menhCan = (((menh - 3 + 12) % 12) + canGieng) % 10 || 10;
    const hanhCuc = napAm(menhCan, menh).hanh, cucSo = CUC[hanhCuc];
    for (let i = 1; i <= 12; i++) cung[i].daiHan = cucSo + kc(i, menh, thuan) * 10;
    const ty1 = dc(dc(11, -3 * (chiNam - 1)), -gt * (chiNam - 1));
    for (let i = 1; i <= 12; i++) cung[i].tieuHan = CHI[kc(i, ty1, gt) + 1];

    const pos = {};
    const an = (c, ...ids) => ids.forEach(id => {
      pos[id] = c;
      const [ten, h, loai] = SAO[id];
      const dt = DAC_TINH[id] && DAC_TINH[id][c - 1];
      cung[c].sao.push({ id, ten, hanh: HANH[h], loai, dacTinh: dt && dt !== '.' ? dt : '' });
    });

    // Chính tinh
    const tv = viTriTuVi(cucSo, nn);
    an(tv, 1); an(dc(tv, 4), 2); an(dc(tv, 7), 3); an(dc(tv, 8), 4); an(dc(tv, 9), 5); an(dc(tv, 11), 6);
    const tp = dc(3, 3 - tv);
    an(tp, 7); [8, 9, 10, 11, 12, 13].forEach((id, i) => an(dc(tp, i + 1), id)); an(dc(tp, 10), 14);

    // Vòng Lộc Tồn
    const lt = [0, 3, 4, 6, 7, 6, 7, 9, 10, 12, 1][canNam];
    an(lt, 27, 109);
    [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].forEach((id, i) => an(dc(lt, (i + 1) * thuan), id));
    // Vòng Thái Tuế
    an(chiNam, 15); an(dc(chiNam, 1), 16, 108); an(dc(chiNam, 2), 17); an(dc(chiNam, 3), 18); an(dc(chiNam, 4), 19);
    an(dc(chiNam, 5), 20, 72); an(dc(chiNam, 6), 21); an(dc(chiNam, 7), 22); an(dc(chiNam, 8), 23);
    an(dc(chiNam, 9), 24, 71); an(dc(chiNam, 10), 25); an(dc(chiNam, 11), 26);
    // Vòng Tràng Sinh
    const ts = { 6: 3, 4: 6, 2: 9, 5: 9, 3: 12 }[cucSo];
    VONG_TRANG_SINH.forEach((id, i) => an(dc(ts, i * thuan), id));

    an(dc(lt, -1), 51); const kd = dc(lt, 1); an(kd, 52);
    const kiep = dc(11, gio); an(kiep, 54); an(dc(12, 12 - kiep), 53);
    // Hỏa Linh: Dần Ngọ Tuất (Sửu, Mão); Thân Tý Thìn (Dần, Tuất); Tỵ Dậu Sửu (Mão, Tuất); Hợi Mão Mùi (Dậu, Tuất)
    const [kh, kl] = [[3, 7, 11], [1, 5, 9], [6, 10, 2], [12, 4, 8]].map((g, i) => g.includes(chiNam) && [[2, 4], [3, 11], [4, 11], [10, 11]][i]).find(Boolean);
    an(thuan === 1 ? dc(kh - 1, gio) : dc(kh + 1, -gio), 56);
    an(thuan === 1 ? dc(kl + 1, -gio) : dc(kl - 1, gio), 55);

    const longTri = dc(5, chiNam - 1); an(longTri, 63); an(dc(2, 2 - longTri), 64, 83);
    const taPhu = dc(5, tt - 1); an(taPhu, 61); an(dc(2, 2 - taPhu), 62);
    const vanKhuc = dc(5, gio - 1); an(vanKhuc, 58); const vanXuong = dc(2, 2 - vanKhuc); an(vanXuong, 57);
    const tamThai = dc(5, tt + nn - 2); an(tamThai, 65); an(dc(2, 2 - tamThai), 66);
    const anQuang = dc(vanXuong, nn - 2); an(anQuang, 67); an(dc(2, 2 - anQuang), 68);
    // Khôi Việt: Giáp Mậu Sửu Mùi, Ất Kỷ Tý Thân, Bính Đinh Hợi Dậu, Canh Tân Ngọ Dần, Nhâm Quý Mão Tỵ
    const khoi = [0, 2, 1, 12, 12, 2, 1, 7, 7, 4, 4][canNam]; an(khoi, 59); an(dc(5, 5 - khoi), 60);
    an(dc(7, chiNam - 1), 70); an(dc(7, -chiNam + 1), 69);
    an(dc(menh, chiNam - 1), 86); an(dc(than, chiNam - 1), 87);
    const hongLoan = dc(4, -chiNam + 1); an(hongLoan, 79); an(dc(hongLoan, 6), 80);
    an([0, 8, 5, 6, 3, 4, 10, 12, 10, 11, 7][canNam], 100);
    an([0, 10, 9, 1, 12, 4, 3, 7, 6, 7, 6][canNam], 101);
    const hinh = dc(10, tt - 1); an(hinh, 73); an(dc(hinh, 4), 74, 75);
    const coThan = [0, 3, 3, 6, 6, 6, 9, 9, 9, 12, 12, 12, 3][chiNam]; an(coThan, 96); an(dc(coThan, -4), 97);
    const vanTinh = dc(kd, 2); an(vanTinh, 106); const duongPhu = dc(vanTinh, 2); an(duongPhu, 77); an(dc(duongPhu, 3), 76);
    an(dc(vanKhuc, 2), 84); an(dc(vanKhuc, -2), 85);
    an(dc(9, 2 * tt - 2), 81); an(dc(taPhu, 3), 82);
    an(5, 90); an(11, 91); an(cungTen('Nô Bộc'), 88); an(cungTen('Tật Ách'), 89);
    const ma = [6, 3, 12, 9][chiNam % 4]; an(ma, 98); an(dc(ma, 2), 105); const kiepSat = dc(ma, 3); an(kiepSat, 104); an(dc(kiepSat, 4), 78);
    an([10, 6, 2][chiNam % 3], 99); // Phá Toái: Tý Ngọ Mão Dậu→Tỵ, Dần Thân Tỵ Hợi→Dậu, Thìn Tuất Sửu Mùi→Sửu
    an(dc(chiNam, -tt + gio), 107);

    // Tứ Hóa [Lộc, Quyền, Khoa, Kỵ] theo id sao
    const TU_HOA = [null, [2, 14, 4, 5], [6, 12, 1, 8], [3, 6, 57, 2], [8, 3, 6, 10], [9, 8, 62, 6],
      [4, 9, 12, 58], [5, 4, 3, 8], [10, 5, 58, 57], [12, 1, 7, 4], [14, 10, 8, 9]][canNam];
    const hoa = {};
    [94, 93, 92, 95].forEach((id, i) => { hoa[TU_HOA[i]] = SAO[id][0]; an(pos[TU_HOA[i]], id); });
    for (let i = 1; i <= 12; i++) cung[i].sao.forEach(s => { if (hoa[s.id]) s.hoa = hoa[s.id]; });

    an([0, 10, 11, 8, 5, 6, 7, 9, 4, 12, 3][canNam], 102);
    an([0, 6, 7, 1, 6, 7, 9, 3, 7, 10, 12][canNam], 103);

    const tuan1 = dc(chiNam, 10 - canNam, 1);
    const tuan = [tuan1, dc(tuan1, 1)];
    const triet = [[9, 10], [7, 8], [5, 6], [3, 4], [1, 2]][(canNam - 1) % 5];
    tuan.forEach(c => { cung[c].tuan = true; }); triet.forEach(c => { cung[c].triet = true; });

    const banMenh = napAm(canNam, chiNam);
    return {
      ten: o.ten || '', namGioi: !!o.namGioi,
      duong: { ngay: duong[0], thang: duong[1], nam: duong[2] },
      am: { ngay: nn, thang: tt, nam: nnnn, nhuan: !!am[3] },
      canChi: {
        nam: `${CAN[canNam]} ${CHI[chiNam]}`, thang: `${CAN[canThang]} ${CHI[(tt + 1) % 12 + 1]}`,
        ngay: `${CAN[canNgay]} ${CHI[chiNgay]}`, gio: `${CAN[canGio]} ${CHI[gio]}`,
      },
      amDuong: `${adNam === 1 ? 'Dương' : 'Âm'} ${o.namGioi ? 'Nam' : 'Nữ'}`,
      thuanLy: (menh % 2) === (chiNam % 2) ? 'Âm dương thuận lý' : 'Âm dương nghịch lý',
      banMenh: banMenh.ten, hanhMenh: HANH[banMenh.hanh],
      cuc: TEN_CUC[cucSo], cucSo, hanhCuc: HANH[hanhCuc], sinhKhac: sinhKhac(banMenh.hanh, hanhCuc),
      menhChu: MENH_CHU[menh], thanChu: THAN_CHU[chiNam],
      menh, than, chiNam, canNam, tuan, triet, pos,
      cung: cung.slice(1),
    };
  }

  const TuVi = { lapLaSo, solar2lunar, lunar2solar, jdFromDate, jdToDate, CHI, CAN };
  if (typeof module !== 'undefined' && module.exports) module.exports = TuVi; else root.TuVi = TuVi;
})(typeof window !== 'undefined' ? window : globalThis);
