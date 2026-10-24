/* Xem ngày tốt xấu theo lịch Việt Nam: âm lịch, can chi, ngày hoàng đạo/hắc đạo, thập nhị trực (theo tiết khí),
 * nhị thập bát tú, ngày kỵ (Tam nương, Nguyệt kỵ, Dương công kỵ nhật), giờ hoàng đạo, hướng xuất hành và tuổi xung hợp.
 * Dùng lại lịch âm (TuVi) và 12 thần hoàng đạo (ConGiap) của phần tử vi. Global XemNgay; Node: require. */
(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const TuVi = node ? require('../../../tuvivietnam/frontend/js/tuvi.js') : root.TuVi;
  const ConGiap = node ? require('../../../tuvivietnam/frontend/js/congiap.js') : root.ConGiap;
  const { CAN, CHI } = TuVi, TZ = 7;

  const VIEC = { cuoiHoi: 'Cưới hỏi', dongTho: 'Động thổ, xây sửa nhà', khaiTruong: 'Khai trương, mở hàng', nhapTrach: 'Về nhà mới', xuatHanh: 'Xuất hành, đi xa', kyKet: 'Ký kết, giao dịch' };

  // Thập nhị trực: [tên, tốt/bình/xấu nói chung, việc nên (mã), việc kỵ (mã), nên làm, nên tránh]
  const TRUC = [
    ['Kiến', 'binh', ['xuatHanh', 'kyKet'], ['dongTho'], 'xuất hành, gặp gỡ, nhậm chức, cầu tài', 'động thổ, đào đất, an táng'],
    ['Trừ', 'tot', [], ['cuoiHoi', 'khaiTruong', 'xuatHanh'], 'dọn dẹp, bỏ cái cũ, chữa bệnh, cúng giải hạn', 'cưới hỏi, khai trương, đi xa'],
    ['Mãn', 'tot', ['khaiTruong', 'xuatHanh', 'kyKet'], [], 'cầu tài, mở cửa hàng, nhập kho, cúng tế', 'an táng, nhậm chức, kiện tụng'],
    ['Bình', 'binh', [], ['dongTho'], 'việc nhỏ, sửa đường, sơn sửa, trang trí', 'đào mương, khởi công lớn, tranh chấp'],
    ['Định', 'tot', ['cuoiHoi', 'kyKet', 'nhapTrach'], ['xuatHanh'], 'cưới hỏi, ký kết, nhập học, mua bán, về nhà mới', 'kiện tụng, đi xa, chữa bệnh'],
    ['Chấp', 'tot', ['dongTho'], ['xuatHanh', 'nhapTrach'], 'xây dựng, tu sửa, trồng trọt, tuyển người', 'xuất hành, chuyển nhà, mở kho'],
    ['Phá', 'xau', [], ['cuoiHoi', 'khaiTruong', 'kyKet', 'nhapTrach', 'dongTho'], 'phá dỡ nhà cũ, chữa bệnh', 'hầu hết việc lớn: cưới hỏi, khai trương, ký kết, xây dựng'],
    ['Nguy', 'xau', [], ['xuatHanh', 'dongTho'], 'cúng lễ, việc nhỏ trong nhà', 'leo cao, đi đường thủy, việc mạo hiểm, khởi công lớn'],
    ['Thành', 'tot', ['cuoiHoi', 'khaiTruong', 'nhapTrach', 'kyKet', 'dongTho', 'xuatHanh'], [], 'hầu hết các việc: cưới hỏi, khai trương, về nhà mới, nhập học, xây dựng', 'kiện tụng, tranh chấp'],
    ['Thu', 'binh', ['kyKet'], ['khaiTruong'], 'thu tiền, thu hoạch, mua hàng, nhập kho', 'khai trương, xuất tiền, an táng'],
    ['Khai', 'tot', ['cuoiHoi', 'khaiTruong', 'xuatHanh', 'nhapTrach', 'kyKet'], ['dongTho'], 'khai trương, cưới hỏi, xuất hành, nhập học, về nhà mới', 'động thổ, an táng'],
    ['Bế', 'xau', [], ['khaiTruong', 'xuatHanh', 'cuoiHoi', 'kyKet'], 'đắp đê, lấp hố, xây tường rào', 'khai trương, nhậm chức, cưới hỏi, đi xa'],
  ];
  // Nhị thập bát tú theo thứ tự, mỗi ngày một sao: [tên, tốt?, lời]
  const TU = [
    ['Giác', 1, 'Tốt cho cưới hỏi, xây dựng, thi cử; kỵ an táng.'], ['Cang', 0, 'Kỵ cưới hỏi, xây dựng; dễ vướng thị phi.'],
    ['Đê', 0, 'Kỵ khởi công, cưới hỏi, đi đường thủy.'], ['Phòng', 1, 'Tốt cho cưới hỏi, xây dựng, xuất hành, cầu tài.'],
    ['Tâm', 0, 'Kỵ khởi công, cưới hỏi, kiện tụng.'], ['Vĩ', 1, 'Tốt cho cưới hỏi, xây dựng, khai trương.'],
    ['Cơ', 1, 'Tốt cho xây dựng, khai trương, cầu tài.'], ['Đẩu', 1, 'Tốt cho xây dựng, sửa chữa, khai trương.'],
    ['Ngưu', 0, 'Kỵ cưới hỏi, xây dựng, khai trương.'], ['Nữ', 0, 'Kỵ cưới hỏi, kiện tụng.'],
    ['Hư', 0, 'Kỵ hầu hết việc lớn, nhất là cưới hỏi, khai trương.'], ['Nguy', 0, 'Kỵ xây dựng, leo cao, đi đường thủy.'],
    ['Thất', 1, 'Tốt cho cưới hỏi, xây dựng, về nhà mới.'], ['Bích', 1, 'Tốt cho cưới hỏi, xây dựng, khai trương.'],
    ['Khuê', 0, 'Kỵ khai trương, động thổ; hợp việc học hành.'], ['Lâu', 1, 'Tốt cho cưới hỏi, xây dựng, ký kết.'],
    ['Vị', 1, 'Tốt cho cưới hỏi, xây dựng, cầu tài.'], ['Mão', 0, 'Kỵ cưới hỏi, xây dựng, khai trương.'],
    ['Tất', 1, 'Tốt cho xây dựng, cưới hỏi, khai trương.'], ['Chủy', 0, 'Kỵ hầu hết việc lớn, nhất là xây dựng.'],
    ['Sâm', 1, 'Tốt cho xây dựng, khai trương, cầu tài; kỵ cưới hỏi.'], ['Tỉnh', 1, 'Tốt cho xây dựng, cầu tài, thi cử.'],
    ['Quỷ', 0, 'Kỵ cưới hỏi, xây dựng, khai trương.'], ['Liễu', 0, 'Kỵ cưới hỏi, xây dựng, kiện tụng.'],
    ['Tinh', 0, 'Kỵ cưới hỏi; hợp việc xây dựng nhỏ.'], ['Trương', 1, 'Tốt cho cưới hỏi, khai trương, về nhà mới.'],
    ['Dực', 0, 'Kỵ cưới hỏi, xây dựng, xuất hành.'], ['Chẩn', 1, 'Tốt cho cưới hỏi, xây dựng, xuất hành, về nhà mới.'],
  ];
  // Từ khóa của mỗi việc trong lời sao, để biết sao đó hợp hay kỵ việc đang chọn
  const TU_KHOA = { cuoiHoi: ['cưới hỏi'], dongTho: ['xây dựng', 'khởi công', 'động thổ'], khaiTruong: ['khai trương'], nhapTrach: ['về nhà mới'], xuatHanh: ['xuất hành', 'đi đường thủy'], kyKet: ['ký kết', 'cầu tài'] };
  /** Sao tu hợp (+1), kỵ (−1) hay không nói (0) về việc v */
  function saoVoiViec(tu, v) {
    const phan = tu[2].toLowerCase().split(';').map(x => x.trim()), co = x => x.includes('hầu hết việc lớn') || TU_KHOA[v].some(k => x.includes(k));
    if (phan.some(x => x.startsWith('kỵ') && co(x))) return -1;
    return phan.some(x => (x.startsWith('tốt') || x.startsWith('hợp')) && co(x)) ? 1 : 0;
  }
  const TU_GOC = 2460677 - 20; // ngày 1/1/2025 là sao Sâm (thứ 20, tính từ Giác = 0)
  // 24 tiết khí, mỗi tiết 15°, bắt đầu từ Xuân phân (kinh độ Mặt Trời 0°)
  const TIET = ['Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng', 'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
    'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết', 'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'];
  // Ngày kỵ theo ngày âm lịch
  const TAM_NUONG = [3, 7, 13, 18, 22, 27], NGUYET_KY = [5, 14, 23];
  const DUONG_CONG = { 1: [13], 2: [11], 3: [9], 4: [7], 5: [5], 6: [3], 7: [8, 29], 8: [27], 9: [25], 10: [23], 11: [21], 12: [19] };
  // Hướng xuất hành theo can ngày (Giáp … Quý)
  const HY_THAN = ['', 'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam', 'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam'];
  const TAI_THAN = ['', 'Đông Nam', 'Đông Nam', 'Chính Đông', 'Chính Đông', 'Chính Bắc', 'Chính Nam', 'Tây Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc'];

  const canChi = (c, k) => `${CAN[c]} ${CHI[k]}`;
  const kep = x => Math.max(0, Math.min(100, x));
  const nhanMuc = p => p >= 70 ? 'Tốt' : p >= 55 ? 'Khá' : p >= 40 ? 'Bình thường' : 'Xấu';
  const chiTuoi = namSinh => (namSinh + 8) % 12 + 1;
  const ddmmyyyy = ([d, m, y]) => `${d}/${m}/${y}`;

  /** Mọi thông tin của một ngày dương lịch. opts = { namSinh (năm âm lịch), viec (mã trong VIEC) } */
  function xemNgay(d, m, y, opts = {}) {
    const jd = TuVi.jdFromDate(d, m, y), n = ConGiap.thongTinNgay(jd), [ad, am, ay, nhuan] = n.am;
    // Tháng theo tiết khí (Dần bắt đầu từ Lập xuân, 315°), xét lúc hết ngày nên ngày giao tiết đã thuộc tháng mới
    const L = TuVi.kinhDoMatTroi(jd + 1, TZ), L0 = TuVi.kinhDoMatTroi(jd, TZ);
    const chiThangTiet = (Math.floor(((L - 315 + 360) % 360) / 30) + 2) % 12 + 1;
    const truc = TRUC[(n.chiNgay - chiThangTiet + 12) % 12], tu = TU[(jd - TU_GOC) % 28];
    const tiet = Math.floor(L / 15) % 24, batDauTiet = Math.floor(L0 / 15) % 24 !== tiet;
    const ky = [];
    if (TAM_NUONG.includes(ad)) ky.push({ ten: 'Tam nương', loi: 'kỵ cưới hỏi, khai trương, xuất hành, khởi công', diem: -2 });
    if (NGUYET_KY.includes(ad)) ky.push({ ten: 'Nguyệt kỵ', loi: 'kỵ đi xa, khởi sự việc lớn', diem: -2 });
    if (DUONG_CONG[am].includes(ad)) ky.push({ ten: 'Dương công kỵ nhật', loi: 'kỵ khởi sự mọi việc lớn', diem: -3 });

    // Chấm điểm: hoàng đạo ±2, trực (theo việc nếu có), sao ±1, ngày kỵ, quan hệ với tuổi
    const ly = [], viec = VIEC[opts.viec] ? opts.viec : null;
    let diem = 0, kyViec = false;
    const them = (x, text) => { diem += x; ly.push({ tot: x > 0, xau: x < 0, text }); };
    them(n.hoangDao ? 2 : -2, `Ngày ${n.than} ${n.hoangDao ? 'hoàng đạo' : 'hắc đạo'}.`);
    if (viec) {
      if (truc[2].includes(viec)) them(2, `Trực ${truc[0]} hợp việc ${VIEC[viec].toLowerCase()}.`);
      else if (truc[3].includes(viec)) { kyViec = true; them(-3, `Trực ${truc[0]} kỵ việc ${VIEC[viec].toLowerCase()}.`); }
      else them(0, `Trực ${truc[0]} không nói riêng về việc ${VIEC[viec].toLowerCase()}.`);
    } else them({ tot: 1, binh: 0, xau: -1 }[truc[1]], `Trực ${truc[0]}: nên ${truc[4]}; tránh ${truc[5]}.`);
    const sv = viec ? saoVoiViec(tu, viec) : 0;
    if (sv < 0) kyViec = true;
    them(sv ? sv * 2 : tu[1] ? 1 : -1, `Sao ${tu[0]} (${tu[1] ? 'sao tốt' : 'sao xấu'}): ${tu[2]}`);
    ky.forEach(k => them(k.diem, `Ngày ${k.ten}: ${k.loi}.`));
    let tuoi = null;
    if (Number.isInteger(opts.namSinh)) {
      const t = chiTuoi(opts.namSinh), qh = ConGiap.quanHe(n.chiNgay, t);
      tuoi = { namSinh: opts.namSinh, chi: CHI[t], quanHe: qh.map(q => q.ten) };
      if (qh.length) qh.forEach(q => them(q.diem, `Ngày ${CHI[n.chiNgay]} với tuổi ${CHI[t]}: ${q.ten}, ${q.hieu}.`));
      else ly.push({ tot: false, xau: false, text: `Ngày ${CHI[n.chiNgay]} với tuổi ${CHI[t]}: không xung không hợp.` });
    }
    const phanTram = kep(Math.round(50 + diem * 7));
    const hop = CHI.slice(1).map((_, i) => i + 1).filter(c => ConGiap.quanHe(n.chiNgay, c).some(q => q.loai === 'tamHop' || q.loai === 'lucHop'));
    return {
      duong: { d, m, y, thu: n.thu, chu: ddmmyyyy([d, m, y]) },
      am: { d: ad, m: am, y: ay, nhuan: !!nhuan, chu: `${ad}/${am}${nhuan ? ' nhuận' : ''}/${ay}` },
      canChi: { ngay: canChi(n.canNgay, n.chiNgay), thang: canChi((ay * 12 + am + 3) % 10 + 1, (am + 1) % 12 + 1), nam: canChi((ay + 6) % 10 + 1, (ay + 8) % 12 + 1) },
      hoangDao: { than: n.than, tot: n.hoangDao },
      truc: { ten: truc[0], loai: truc[1], nen: truc[4], tranh: truc[5] },
      sao: { ten: tu[0], tot: !!tu[1], loi: tu[2] },
      tietKhi: { ten: TIET[tiet], batDau: batDauTiet },
      ngayKy: ky.map(k => ({ ten: k.ten, loi: k.loi })),
      gioHoangDao: ConGiap.gioHoangDao(n.chiNgay).map(c => ({ chi: CHI[c], gio: ConGiap.GIO[c] })),
      huong: { hyThan: HY_THAN[n.canNgay], taiThan: TAI_THAN[n.canNgay] },
      tuoiXung: CHI[(n.chiNgay + 5) % 12 + 1], tuoiHop: hop.map(c => CHI[c]),
      viec: viec && { ma: viec, ten: VIEC[viec], ky: kyViec }, tuoi,
      diem, phanTram, muc: nhanMuc(phanTram), lyDo: ly,
    };
  }

  /** Cả tháng dương lịch, để vẽ lịch */
  function lichThang(y, m, opts = {}) {
    const so = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return Array.from({ length: so }, (_, i) => xemNgay(i + 1, m, y, opts));
  }

  /** Các ngày tốt cho một việc trong khoảng [tu, den] (dương lịch {d,m,y}), xếp từ tốt nhất; tối đa 190 ngày.
   *  Chỉ lấy ngày hoàng đạo, không phạm ngày kỵ, trực và sao không kỵ việc đó, điểm từ 55%. */
  function chonNgay(viec, tu, den, namSinh) {
    if (!VIEC[viec]) throw new Error('Việc không hợp lệ.');
    const a = TuVi.jdFromDate(tu.d, tu.m, tu.y), b = TuVi.jdFromDate(den.d, den.m, den.y);
    if (b < a) throw new Error('Ngày kết thúc phải sau ngày bắt đầu.');
    if (b - a > 189) throw new Error('Chỉ chọn trong khoảng tối đa 190 ngày.');
    const ds = [];
    for (let jd = a; jd <= b; jd++) { const [d, m, y] = TuVi.jdToDate(jd); ds.push(xemNgay(d, m, y, { viec, namSinh })); }
    const tot = ds.filter(x => x.phanTram >= 55 && !x.ngayKy.length && x.hoangDao.tot && !x.viec.ky).sort((u, v) => v.phanTram - u.phanTram || TuVi.jdFromDate(u.duong.d, u.duong.m, u.duong.y) - TuVi.jdFromDate(v.duong.d, v.duong.m, v.duong.y));
    return { viec: { ma: viec, ten: VIEC[viec] }, soNgay: ds.length, soNgayTot: tot.length, ngay: tot };
  }

  const XemNgay = { VIEC, TRUC, TU, TIET, xemNgay, lichThang, chonNgay, chiTuoi };
  if (node) module.exports = XemNgay; else root.XemNgay = XemNgay;
})(typeof window !== 'undefined' ? window : globalThis);
