/* Xem ngày tốt xấu theo lịch Việt Nam: âm lịch, can chi, ngũ hành nạp âm, ngày hoàng đạo/hắc đạo, thập nhị trực (theo tiết khí),
 * nhị thập bát tú, thần sát theo tháng âm lịch, ngày kỵ (Tam nương, Nguyệt kỵ, Dương công kỵ nhật), giờ hoàng đạo,
 * giờ cần tránh, hướng xuất hành, tuổi xung hợp; đánh giá 7 việc và chọn ngày theo việc. Mặc định lịch âm Việt Nam (UTC+7).
 * Dùng lại lịch âm (TuVi) và 12 thần hoàng đạo (ConGiap) của phần tử vi. Global XemNgay; Node: require. */
(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const TuVi = node ? require('../../../tuvivietnam/frontend/js/tuvi.js') : root.TuVi;
  const ConGiap = node ? require('../../../tuvivietnam/frontend/js/congiap.js') : root.ConGiap;
  const { CAN, CHI } = TuVi, TZ = 7;

  const VIEC = { khaiTruong: 'Khai trương, mở hàng', cuoiHoi: 'Cưới hỏi', dongTho: 'Động thổ, xây sửa nhà', nhapTrach: 'Nhập trạch (về nhà mới)',
    xuatHanh: 'Xuất hành, đi xa', kyKet: 'Ký kết, giao dịch', khoiCong: 'Khởi công, bắt đầu việc lớn' };

  // Thập nhị trực: [tên, tốt/bình/xấu nói chung, việc nên (mã), việc kỵ (mã), nên làm, nên tránh]
  const TRUC = [
    ['Kiến', 'binh', ['xuatHanh', 'kyKet'], ['dongTho'], 'xuất hành, gặp gỡ, nhậm chức, cầu tài', 'động thổ, đào đất, an táng'],
    ['Trừ', 'tot', [], ['cuoiHoi', 'khaiTruong', 'xuatHanh'], 'dọn dẹp, bỏ cái cũ, chữa bệnh, cúng giải hạn', 'cưới hỏi, khai trương, đi xa'],
    ['Mãn', 'tot', ['khaiTruong', 'xuatHanh', 'kyKet'], [], 'cầu tài, mở cửa hàng, nhập kho, cúng tế', 'an táng, nhậm chức, kiện tụng'],
    ['Bình', 'binh', [], ['dongTho', 'khoiCong'], 'việc nhỏ, sửa đường, sơn sửa, trang trí', 'đào mương, khởi công lớn, tranh chấp'],
    ['Định', 'tot', ['cuoiHoi', 'kyKet', 'nhapTrach', 'khoiCong'], ['xuatHanh'], 'cưới hỏi, ký kết, nhập học, mua bán, về nhà mới', 'kiện tụng, đi xa, chữa bệnh'],
    ['Chấp', 'tot', ['dongTho', 'khoiCong'], ['xuatHanh', 'nhapTrach'], 'xây dựng, tu sửa, trồng trọt, tuyển người', 'xuất hành, chuyển nhà, mở kho'],
    ['Phá', 'xau', [], ['cuoiHoi', 'khaiTruong', 'kyKet', 'nhapTrach', 'dongTho', 'khoiCong'], 'phá dỡ nhà cũ, chữa bệnh', 'hầu hết việc lớn: cưới hỏi, khai trương, ký kết, xây dựng'],
    ['Nguy', 'xau', [], ['xuatHanh', 'dongTho', 'khoiCong'], 'cúng lễ, việc nhỏ trong nhà', 'leo cao, đi đường thủy, việc mạo hiểm, khởi công lớn'],
    ['Thành', 'tot', ['cuoiHoi', 'khaiTruong', 'nhapTrach', 'kyKet', 'dongTho', 'xuatHanh', 'khoiCong'], [], 'hầu hết các việc: cưới hỏi, khai trương, về nhà mới, nhập học, xây dựng', 'kiện tụng, tranh chấp'],
    ['Thu', 'binh', ['kyKet'], ['khaiTruong'], 'thu tiền, thu hoạch, mua hàng, nhập kho', 'khai trương, xuất tiền, an táng'],
    ['Khai', 'tot', ['cuoiHoi', 'khaiTruong', 'xuatHanh', 'nhapTrach', 'kyKet', 'khoiCong'], ['dongTho'], 'khai trương, cưới hỏi, xuất hành, nhập học, về nhà mới', 'động thổ, an táng'],
    ['Bế', 'xau', [], ['khaiTruong', 'xuatHanh', 'cuoiHoi', 'kyKet', 'khoiCong'], 'đắp đê, lấp hố, xây tường rào', 'khai trương, nhậm chức, cưới hỏi, đi xa'],
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
  const TU_KHOA = { cuoiHoi: ['cưới hỏi'], dongTho: ['xây dựng', 'khởi công', 'động thổ'], khaiTruong: ['khai trương'], nhapTrach: ['về nhà mới'], xuatHanh: ['xuất hành', 'đi đường thủy'], kyKet: ['ký kết', 'cầu tài'], khoiCong: ['khởi công', 'xây dựng'] };
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
  // Thần sát theo tháng âm lịch (bảng phổ biến trong Ngọc Hạp Thông Thư). Mỗi bảng 12 phần tử cho tháng 1–12.
  // c: can ngày, k: chi ngày. [tên, tốt?, điểm, lời, việc kỵ ('*' = mọi việc lớn)]
  const THAN_SAT = [
    ['Thiên Đức', 1, 1, 'phúc đức của trời, giải bớt điều xấu, tốt cho mọi việc', [], ['c4', 'k9', 'c9', 'c8', 'k12', 'c1', 'c10', 'k3', 'c3', 'c2', 'k6', 'c7']],
    ['Nguyệt Đức', 1, 1, 'phúc đức của tháng, tốt cho mọi việc, nhất là cưới hỏi, nhập trạch', [], [3, 1, 9, 7, 3, 1, 9, 7, 3, 1, 9, 7].map(c => 'c' + c)],
    ['Sinh Khí', 1, 1, 'sinh khí của tháng, tốt cho động thổ, khởi công, trồng trọt', [], [...Array(12).keys()].map(i => 'k' + (i + 1))],
    ['Thiên Cương', 0, -2, 'hung thần, kỵ khởi công, động thổ, cưới hỏi', ['dongTho', 'khoiCong', 'cuoiHoi'], [6, 1, 8, 3, 10, 5, 12, 7, 2, 9, 4, 11].map(k => 'k' + k)],
    ['Hà Khôi', 0, -2, 'hung thần, kỵ khởi công, động thổ, xây dựng', ['dongTho', 'khoiCong'], [12, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5].map(k => 'k' + k)],
    ['Thụ Tử', 0, -3, 'rất xấu, kỵ mọi việc lớn', ['*'], [11, 5, 12, 6, 1, 7, 2, 8, 3, 9, 4, 10].map(k => 'k' + k)],
    ['Sát Chủ', 0, -2, 'kỵ cưới hỏi, nhập trạch, động thổ, khởi công', ['cuoiHoi', 'nhapTrach', 'dongTho', 'khoiCong'], [1, 6, 8, 4, 9, 11, 2, 12, 7, 10, 3, 5].map(k => 'k' + k)],
  ];
  const TEN_HANH = { K: 'Kim', M: 'Mộc', T: 'Thủy', H: 'Hỏa', O: 'Thổ' };
  const CAN_HANH = ['', 'Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
  const CHI_HANH = ['', 'Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
  // Múi giờ để tính lịch âm và tiết khí; giờ can chi luôn theo đồng hồ nơi ở
  const MUI_GIO = [[7, 'Việt Nam (UTC+7), lịch âm chuẩn Việt Nam'], [8, 'UTC+8: Trung Quốc, Đài Loan, Singapore, Malaysia, Úc (Perth)'], [9, 'UTC+9: Hàn Quốc, Nhật Bản'],
    [10, 'UTC+10: Úc (Sydney, Melbourne giờ chuẩn)'], [12, 'UTC+12: New Zealand (giờ chuẩn)'], [0, 'UTC+0: Anh (giờ chuẩn)'], [1, 'UTC+1: Pháp, Đức, Séc, Ba Lan (giờ chuẩn)'],
    [3, 'UTC+3: Nga (Moskva)'], [-5, 'UTC−5: Mỹ miền Đông, Canada (Toronto) giờ chuẩn'], [-6, 'UTC−6: Mỹ miền Trung (giờ chuẩn)'], [-8, 'UTC−8: Mỹ miền Tây, Canada (Vancouver) giờ chuẩn']];
  const PHUONG_PHAP = [
    ['Lịch', 'Âm lịch Việt Nam theo thuật toán Hồ Ngọc Đức, tính ở múi giờ UTC+7 (có thể đổi múi giờ khi chọn ngày). Can chi tháng theo tháng âm lịch.'],
    ['Hoàng đạo, hắc đạo', '12 thần Thanh Long … Câu Trận, khởi Thanh Long theo chi tháng âm lịch. Giờ hoàng đạo theo cùng quy tắc, khởi từ chi ngày.'],
    ['Trực', 'Thập nhị trực Kiến … Bế, tính theo tháng tiết khí (tháng Dần bắt đầu từ Lập xuân). Ngày giao tiết lặp lại trực hôm trước.'],
    ['Sao', 'Nhị thập bát tú xoay vòng mỗi ngày một sao, và 7 thần sát theo tháng âm lịch: Thiên Đức, Nguyệt Đức, Sinh Khí (tốt); Thiên Cương, Hà Khôi, Thụ Tử, Sát Chủ (xấu), theo bảng phổ biến trong Ngọc Hạp Thông Thư.'],
    ['Ngày kỵ', 'Tam nương, Nguyệt kỵ, Dương công kỵ nhật theo ngày âm lịch.'],
    ['Đánh giá việc', 'Một việc là "Nên làm" khi ngày hoàng đạo, không phạm ngày kỵ, trực và sao không kỵ việc đó và điểm từ 55%; "Không nên" khi trực, sao hoặc thần sát kỵ việc đó, phạm ngày kỵ, hoặc điểm dưới 40%; còn lại là "Cân nhắc".'],
  ];
  const TAI_THAN = ['', 'Đông Nam', 'Đông Nam', 'Chính Đông', 'Chính Đông', 'Chính Bắc', 'Chính Nam', 'Tây Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc'];

  const canChi = (c, k) => `${CAN[c]} ${CHI[k]}`;
  const kep = x => Math.max(0, Math.min(100, x));
  const nhanMuc = p => p >= 70 ? 'Tốt' : p >= 55 ? 'Khá' : p >= 40 ? 'Bình thường' : 'Xấu';
  const chiTuoi = namSinh => (namSinh + 8) % 12 + 1;
  const ddmmyyyy = ([d, m, y]) => `${d}/${m}/${y}`;

  /** Mọi thông tin của một ngày dương lịch. opts = { namSinh (năm âm lịch), viec (mã trong VIEC) } */
  function xemNgay(d, m, y, opts = {}) {
    const tz = MUI_GIO.some(x => x[0] === opts.tz) ? opts.tz : TZ;
    const jd = TuVi.jdFromDate(d, m, y), n = ConGiap.thongTinNgay(jd);
    const [ad, am, ay, nhuan] = TuVi.solar2lunar(d, m, y, tz);
    // Hoàng đạo khởi Thanh Long theo chi tháng âm lịch (tính lại theo múi giờ đã chọn)
    const khoi = c => [9, 11, 1, 3, 5, 7][(c - 1) % 6], chiThangAm = (am + 1) % 12 + 1, thIdx = (n.chiNgay - khoi(chiThangAm) + 12) % 12;
    n.than = ConGiap.THAN[thIdx]; n.hoangDao = !!ConGiap.TOT[thIdx];
    // Tháng theo tiết khí (Dần bắt đầu từ Lập xuân, 315°), xét lúc hết ngày nên ngày giao tiết đã thuộc tháng mới
    const L = TuVi.kinhDoMatTroi(jd + 1, tz), L0 = TuVi.kinhDoMatTroi(jd, tz);
    const chiThangTiet = (Math.floor(((L - 315 + 360) % 360) / 30) + 2) % 12 + 1;
    const truc = TRUC[(n.chiNgay - chiThangTiet + 12) % 12], tu = TU[(jd - TU_GOC) % 28];
    const tiet = Math.floor(L / 15) % 24, batDauTiet = Math.floor(L0 / 15) % 24 !== tiet;
    const ky = [];
    if (TAM_NUONG.includes(ad)) ky.push({ ten: 'Tam nương', loi: 'kỵ cưới hỏi, khai trương, xuất hành, khởi công', diem: -2 });
    if (NGUYET_KY.includes(ad)) ky.push({ ten: 'Nguyệt kỵ', loi: 'kỵ đi xa, khởi sự việc lớn', diem: -2 });
    if (DUONG_CONG[am].includes(ad)) ky.push({ ten: 'Dương công kỵ nhật', loi: 'kỵ khởi sự mọi việc lớn', diem: -3 });
    const thanSat = THAN_SAT.filter(t => t[5][am - 1] === (t[5][am - 1][0] === 'c' ? 'c' + n.canNgay : 'k' + n.chiNgay));

    // Chấm điểm: hoàng đạo ±2, trực (theo việc nếu có), sao ±1, ngày kỵ, quan hệ với tuổi
    const ly = [], viec = VIEC[opts.viec] ? opts.viec : null;
    let diem = 0, kyViec = false;
    const them = (x, text, chung) => { diem += x; ly.push({ tot: x > 0, xau: x < 0, text, ...(chung ? { chung: true } : {}) }); };
    them(n.hoangDao ? 2 : -2, `Ngày ${n.than} ${n.hoangDao ? 'hoàng đạo' : 'hắc đạo'}.`);
    if (viec) {
      if (truc[2].includes(viec)) them(2, `Trực ${truc[0]} hợp việc ${VIEC[viec].toLowerCase()}.`);
      else if (truc[3].includes(viec)) { kyViec = true; them(-3, `Trực ${truc[0]} kỵ việc ${VIEC[viec].toLowerCase()}.`); }
      else them(0, `Trực ${truc[0]} không nói riêng về việc ${VIEC[viec].toLowerCase()}.`);
    } else them({ tot: 1, binh: 0, xau: -1 }[truc[1]], `Trực ${truc[0]}: nên ${truc[4]}; tránh ${truc[5]}.`);
    const sv = viec ? saoVoiViec(tu, viec) : 0;
    if (sv < 0) kyViec = true;
    them(sv ? sv * 2 : tu[1] ? 1 : -1, `Sao ${tu[0]} (${tu[1] ? 'sao tốt' : 'sao xấu'}): ${tu[2]}`, viec && !sv); // sao không nói về việc này: chỉ là tốt xấu chung
    thanSat.forEach(t => {
      const kyNay = viec && (t[4].includes('*') || t[4].includes(viec));
      if (kyNay) kyViec = true;
      them(kyNay ? Math.min(t[2], -2) : t[2], `${t[1] ? 'Sao tốt' : 'Sao xấu'} ${t[0]}: ${t[3]}.`);
    });
    ky.forEach(k => them(k.diem, `Ngày ${k.ten}: ${k.loi}.`));
    let tuoi = null;
    if (Number.isInteger(opts.namSinh)) {
      const t = chiTuoi(opts.namSinh), qh = ConGiap.quanHe(n.chiNgay, t);
      tuoi = { namSinh: opts.namSinh, chi: CHI[t], quanHe: qh.map(q => q.ten) };
      if (qh.length) qh.forEach(q => them(q.diem, `Ngày ${CHI[n.chiNgay]} với tuổi ${CHI[t]}: ${q.ten}, ${q.hieu}.`));
      else ly.push({ tot: false, xau: false, text: `Ngày ${CHI[n.chiNgay]} với tuổi ${CHI[t]}: không xung không hợp.` });
    }
    const phanTram = kep(Math.round(50 + diem * 7));
    const na = TuVi.napAm(n.canNgay, n.chiNgay), gioTot = ConGiap.gioHoangDao(n.chiNgay);
    const saoTot = [n.hoangDao && `${n.than} (hoàng đạo)`, tu[1] && `${tu[0]} (nhị thập bát tú)`, ...thanSat.filter(t => t[1]).map(t => t[0])].filter(Boolean);
    const saoXau = [!n.hoangDao && `${n.than} (hắc đạo)`, !tu[1] && `${tu[0]} (nhị thập bát tú)`, ...thanSat.filter(t => !t[1]).map(t => t[0])].filter(Boolean);
    const xungGio = tuoi ? (chiTuoi(opts.namSinh) + 5) % 12 + 1 : 0;
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
      gioHoangDao: gioTot.map(c => ({ chi: CHI[c], gio: ConGiap.GIO[c] })),
      gioTranh: [...Array(12).keys()].map(i => i + 1).filter(c => !gioTot.includes(c) || c === xungGio)
        .map(c => ({ chi: CHI[c], gio: ConGiap.GIO[c], vi: [!gioTot.includes(c) && `hắc đạo ${ConGiap.THAN[(c - khoi(n.chiNgay) + 12) % 12]}`, c === xungGio && `xung tuổi ${CHI[chiTuoi(opts.namSinh)]}`].filter(Boolean).join(', ') })),
      nguHanh: { napAm: na.ten, hanh: TEN_HANH[na.hanh], can: `${CAN[n.canNgay]} thuộc ${CAN_HANH[n.canNgay]}`, chi: `${CHI[n.chiNgay]} thuộc ${CHI_HANH[n.chiNgay]}` },
      thanSat: thanSat.map(t => ({ ten: t[0], tot: !!t[1], loi: t[3] })), saoTot, saoXau, tz,
      huong: { hyThan: HY_THAN[n.canNgay], taiThan: TAI_THAN[n.canNgay] },
      tuoiXung: CHI[(n.chiNgay + 5) % 12 + 1], tuoiHop: hop.map(c => CHI[c]),
      viec: viec && { ma: viec, ten: VIEC[viec], ky: kyViec }, tuoi,
      diem, phanTram, muc: nhanMuc(phanTram), lyDo: ly,
    };
  }

  /** Phân loại một ngày đã tính theo việc: 'tot' | 'vua' | 'luuY' */
  const phanLoai = r => r.hoangDao.tot && !r.ngayKy.length && !r.viec.ky && r.phanTram >= 55 ? 'tot'
    : r.viec.ky || r.ngayKy.length || r.phanTram < 40 ? 'luuY' : 'vua';
  const TEN_LOAI = { tot: 'Tốt theo tiêu chí', vua: 'Trung bình', luuY: 'Cần lưu ý' };
  const NHAN_VIEC = { tot: 'Nên làm', vua: 'Cân nhắc', luuY: 'Không nên' };
  /** Nội dung ngắn vì sao ngày hợp hay không hợp việc */
  function noiDungViec(r) {
    const l = phanLoai(r), v = r.viec.ten.toLowerCase();
    // Chỉ nêu yếu tố liên quan việc này; sao không nói về việc chỉ là tốt xấu chung nên bỏ qua
    const lay = f => r.lyDo.filter(x => f(x) && !x.chung).map(x => x.text.replace(/\.$/, ''));
    const tot = lay(x => x.tot), xau = lay(x => x.xau);
    if (l === 'tot') return `Thuận cho ${v}: ${tot.join('; ')}.`;
    if (l === 'luuY') return `Không thuận cho ${v}: ${xau.join('; ')}.`;
    return `Cân nhắc thêm. ${tot.length ? `Thuận: ${tot.join('; ')}. ` : ''}${xau.length ? `Chưa thuận: ${xau.join('; ')}.` : ''}`.trim();
  }
  /** Đánh giá 7 việc trong một ngày */
  function danhGiaViec(d, m, y, opts = {}) {
    return Object.keys(VIEC).map(v => {
      const r = xemNgay(d, m, y, { ...opts, viec: v }), l = phanLoai(r);
      return { ma: v, ten: VIEC[v], loai: l, nhan: NHAN_VIEC[l], phanTram: r.phanTram, loi: noiDungViec(r) };
    });
  }

  /** Cả tháng dương lịch, để vẽ lịch */
  function lichThang(y, m, opts = {}) {
    const so = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return Array.from({ length: so }, (_, i) => xemNgay(i + 1, m, y, opts));
  }

  /** Chọn ngày cho một việc trong khoảng [tu, den] (dương lịch {d,m,y}); tối đa 190 ngày.
   *  ngay: ngày tốt theo tiêu chí (hoàng đạo, không phạm ngày kỵ, trực, sao, thần sát không kỵ việc đó, điểm từ 55%), xếp từ tốt nhất.
   *  tatCa: mọi ngày theo thứ tự lịch, mỗi ngày có loai (tot | vua | luuY), danhGia và noiDung. */
  function chonNgay(viec, tu, den, namSinh, tz) {
    if (!VIEC[viec]) throw new Error('Việc không hợp lệ.');
    const a = TuVi.jdFromDate(tu.d, tu.m, tu.y), b = TuVi.jdFromDate(den.d, den.m, den.y);
    if (b < a) throw new Error('Ngày kết thúc phải sau ngày bắt đầu.');
    if (b - a > 189) throw new Error('Chỉ chọn trong khoảng tối đa 190 ngày.');
    const ds = [];
    for (let jd = a; jd <= b; jd++) { const [d, m, y] = TuVi.jdToDate(jd); ds.push(xemNgay(d, m, y, { viec, namSinh, tz })); }
    ds.forEach(r => { r.loai = phanLoai(r); r.danhGia = TEN_LOAI[r.loai]; r.noiDung = noiDungViec(r); });
    const tot = ds.filter(x => x.loai === 'tot').sort((u, v) => v.phanTram - u.phanTram || TuVi.jdFromDate(u.duong.d, u.duong.m, u.duong.y) - TuVi.jdFromDate(v.duong.d, v.duong.m, v.duong.y));
    const dem = l => ds.filter(x => x.loai === l).length;
    return { viec: { ma: viec, ten: VIEC[viec] }, soNgay: ds.length, soNgayTot: tot.length, soNgayVua: dem('vua'), soNgayLuuY: dem('luuY'), ngay: tot, tatCa: ds };
  }

  const XemNgay = { VIEC, TRUC, TU, TIET, THAN_SAT, MUI_GIO, PHUONG_PHAP, TEN_LOAI, xemNgay, lichThang, chonNgay, danhGiaViec, chiTuoi };
  if (node) module.exports = XemNgay; else root.XemNgay = XemNgay;
})(typeof window !== 'undefined' ? window : globalThis);
