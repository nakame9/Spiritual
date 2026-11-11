/* Ngũ hành và bản mệnh: can chi năm sinh, nạp âm, hành của can, chi, nhật chủ; cung phi Bát trạch và 8 du niên;
 * quan hệ hai bản mệnh; Kim lâu; gợi ý phong thủy cá nhân. Dùng chung cho trình duyệt (window.BanMenh) và backend.
 * Mỗi hệ thống trả lời một câu hỏi khác nhau nên được tính và ghi tên riêng, không gộp làm một "mệnh". */
(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const TuVi = node ? require('./tuvi.js') : root.TuVi;
  const ConGiap = node ? require('./congiap.js') : root.ConGiap;

  const CAN = TuVi.CAN, CHI = TuVi.CHI;
  const CON = ['', 'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
  const CAN_HANH = ['', 'Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
  const CHI_HANH = ['', 'Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
  const HANH_TEN = { K: 'Kim', M: 'Mộc', T: 'Thủy', H: 'Hỏa', O: 'Thổ' };
  const SINH = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
  const KHAC = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };
  const sinhBoi = h => Object.keys(SINH).find(k => SINH[k] === h);
  const khacBoi = h => Object.keys(KHAC).find(k => KHAC[k] === h);
  /** Quan hệ của hành a đối với hành b */
  const quanHe = (a, b) => a === b ? 'hoa' : SINH[a] === b ? 'sinh' : SINH[b] === a ? 'duocSinh' : KHAC[a] === b ? 'khac' : 'biKhac';

  const MAU = { Kim: 'trắng, xám, bạc, ánh kim', Mộc: 'xanh lá, xanh rêu', Thủy: 'đen, xanh dương đậm', Hỏa: 'đỏ, cam, hồng, tím', Thổ: 'vàng đất, nâu, be' };
  const PHUONG = { Kim: 'Tây, Tây Bắc', Mộc: 'Đông, Đông Nam', Thủy: 'Bắc', Hỏa: 'Nam', Thổ: 'Đông Bắc, Tây Nam, trung tâm' };
  const SO = { Thủy: '1, 6', Hỏa: '2, 7', Mộc: '3, 8', Kim: '4, 9', Thổ: '5, 0' };
  const NAP_AM_Y = {
    'Hải Trung Kim': 'vàng dưới đáy biển', 'Lư Trung Hỏa': 'lửa trong lò', 'Đại Lâm Mộc': 'gỗ rừng lớn', 'Lộ Bàng Thổ': 'đất ven đường',
    'Kiếm Phong Kim': 'vàng mũi kiếm', 'Sơn Đầu Hỏa': 'lửa trên núi', 'Giản Hạ Thủy': 'nước dưới khe', 'Thành Đầu Thổ': 'đất trên mặt thành',
    'Bạch Lạp Kim': 'vàng chân đèn sáp', 'Dương Liễu Mộc': 'gỗ cây dương liễu', 'Tuyền Trung Thủy': 'nước giữa dòng suối', 'Ốc Thượng Thổ': 'đất trên mái nhà',
    'Tích Lịch Hỏa': 'lửa sấm sét', 'Tùng Bách Mộc': 'gỗ cây tùng bách', 'Trường Lưu Thủy': 'nước chảy dài', 'Sa Trung Kim': 'vàng lẫn trong cát',
    'Sơn Hạ Hỏa': 'lửa dưới chân núi', 'Bình Địa Mộc': 'cây ở đồng bằng', 'Bích Thượng Thổ': 'đất trên vách', 'Kim Bạch Kim': 'vàng pha bạch kim',
    'Phú Đăng Hỏa': 'lửa ngọn đèn', 'Thiên Hà Thủy': 'nước trên trời (mưa)', 'Đại Trạch Thổ': 'đất nền nhà lớn', 'Thoa Xuyến Kim': 'vàng trang sức',
    'Tang Đố Mộc': 'gỗ cây dâu', 'Đại Khê Thủy': 'nước khe lớn', 'Sa Trung Thổ': 'đất lẫn trong cát', 'Thiên Thượng Hỏa': 'lửa trên trời (ánh mặt trời)',
    'Thạch Lựu Mộc': 'gỗ cây lựu', 'Đại Hải Thủy': 'nước biển lớn' };
  // Một số sách xem tuổi coi các nạp âm này "gặp khắc lại thành": chỉ ghi chú, không đổi kết quả sinh khắc
  const NGOAI_LE = {
    'Sa Trung Kim': 'Hỏa', 'Kiếm Phong Kim': 'Hỏa', 'Thiên Hà Thủy': 'Thổ', 'Đại Hải Thủy': 'Thổ', 'Thiên Thượng Hỏa': 'Thủy', 'Tích Lịch Hỏa': 'Thủy' };

  // ---------- Năm can chi theo quy tắc đổi năm ----------
  const QUY_TAC = {
    tet: 'Đổi năm vào Tết Nguyên đán (âm lịch). Cách phổ biến ở Việt Nam khi xem tuổi, xem mệnh, cung phi.',
    lapXuan: 'Đổi năm vào tiết Lập xuân (khoảng 4/2 dương lịch). Cách của Bát tự và nhiều sách phong thủy Trung Hoa.',
  };
  /** Năm dùng để tính can chi cho người sinh ngày d/m/y dương lịch. giaoTiet = sinh đúng ngày Lập xuân (cần giờ sinh) */
  function namTinh(d, m, y, quyTac = 'tet') {
    if (quyTac === 'lapXuan') {
      if (m > 2) return { nam: y, giaoTiet: false };
      const jd = TuVi.jdFromDate(d, m, y), dau = TuVi.kinhDoMatTroi(jd), cuoi = TuVi.kinhDoMatTroi(jd + 1);
      const truoc = x => x > 250 && x < 315;
      return { nam: truoc(cuoi) ? y - 1 : y, giaoTiet: truoc(dau) && !truoc(cuoi) };
    }
    return { nam: TuVi.solar2lunar(d, m, y, 7)[2], giaoTiet: false };
  }
  const canChiNam = y => ({ can: (y + 6) % 10 + 1, chi: (y + 8) % 12 + 1 });

  // ---------- Cung phi Bát trạch ----------
  const QUAI = { 1: ['Khảm', 'Thủy', 'Bắc'], 2: ['Khôn', 'Thổ', 'Tây Nam'], 3: ['Chấn', 'Mộc', 'Đông'], 4: ['Tốn', 'Mộc', 'Đông Nam'],
    6: ['Càn', 'Kim', 'Tây Bắc'], 7: ['Đoài', 'Kim', 'Tây'], 8: ['Cấn', 'Thổ', 'Đông Bắc'], 9: ['Ly', 'Hỏa', 'Nam'] };
  const HUONG = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  const DU_NIEN = ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị', 'Họa Hại', 'Ngũ Quỷ', 'Lục Sát', 'Tuyệt Mệnh'];
  // Hướng của 8 du niên theo thứ tự trên, cho từng quái (bảng Bát trạch Minh cảnh)
  const BANG = {
    1: ['Đông Nam', 'Đông', 'Nam', 'Bắc', 'Tây', 'Đông Bắc', 'Tây Bắc', 'Tây Nam'],
    9: ['Đông', 'Đông Nam', 'Bắc', 'Nam', 'Đông Bắc', 'Tây', 'Tây Nam', 'Tây Bắc'],
    3: ['Nam', 'Bắc', 'Đông Nam', 'Đông', 'Tây Nam', 'Tây Bắc', 'Đông Bắc', 'Tây'],
    4: ['Bắc', 'Nam', 'Đông', 'Đông Nam', 'Tây Bắc', 'Tây Nam', 'Tây', 'Đông Bắc'],
    6: ['Tây', 'Đông Bắc', 'Tây Nam', 'Tây Bắc', 'Đông Nam', 'Đông', 'Bắc', 'Nam'],
    2: ['Đông Bắc', 'Tây', 'Tây Bắc', 'Tây Nam', 'Đông', 'Đông Nam', 'Nam', 'Bắc'],
    8: ['Tây Nam', 'Tây Bắc', 'Tây', 'Đông Bắc', 'Nam', 'Bắc', 'Đông', 'Đông Nam'],
    7: ['Tây Bắc', 'Tây Nam', 'Đông Bắc', 'Tây', 'Bắc', 'Nam', 'Đông Nam', 'Đông'],
  };
  const DU_NIEN_Y = {
    'Sinh Khí': [true, 'tốt nhất: sức sống, tài lộc, thăng tiến'], 'Thiên Y': [true, 'sức khỏe, được giúp đỡ, quý nhân'],
    'Diên Niên': [true, 'hòa thuận, bền vững trong các mối quan hệ, hôn nhân'], 'Phục Vị': [true, 'ổn định, bình an, hợp học hành, tĩnh tâm'],
    'Họa Hại': [false, 'thị phi, rắc rối nhỏ, hao tổn lặt vặt'], 'Ngũ Quỷ': [false, 'cãi vã, tai tiếng, hao tài'],
    'Lục Sát': [false, 'trắc trở tình cảm, kiện tụng, mất đoàn kết'], 'Tuyệt Mệnh': [false, 'xấu nhất: bệnh tật, đổ vỡ, mất mát'] };
  const QUAI_THEO_HUONG = Object.fromEntries(Object.entries(QUAI).map(([k, v]) => [v[2], Number(k)]));
  const DONG = [1, 3, 4, 9];
  const nhom = q => DONG.includes(q) ? 'Đông tứ mệnh' : 'Tây tứ mệnh';
  /** Du niên khi người quái q nhìn về hướng h */
  const duNienHuong = (q, h) => DU_NIEN[BANG[q].indexOf(h)];
  /** Du niên giữa hai quái (dùng cho cung phi hai vợ chồng) */
  const duNien = (a, b) => duNienHuong(a, QUAI[b][2]);
  /** Hướng (8 hướng) từ số độ la bàn */
  const huongTuDo = deg => HUONG[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
  const doiHuong = h => HUONG[(HUONG.indexOf(h) + 4) % 8];

  function cungPhi(y, gioiTinh) {
    let q = gioiTinh === 'nu' ? ((y % 9) + 4) % 9 : (11 - (y % 9)) % 9;
    if (!q) q = 9;
    const trung = q === 5;
    if (trung) q = gioiTinh === 'nu' ? 8 : 2;
    const [ten, hanh, huong] = QUAI[q];
    return { so: trung ? 5 : q, quai: q, ten, hanh, huongQuai: huong, nhom: nhom(q), ghiChu: trung ? `Số 5 không có quái riêng: nam đổi sang Khôn, nữ đổi sang Cấn.` : '',
      huong: DU_NIEN.map((dn, i) => ({ duNien: dn, huong: BANG[q][i], tot: DU_NIEN_Y[dn][0], y: DU_NIEN_Y[dn][1] })) };
  }

  /** Bản mệnh theo ngày sinh dương lịch. opts: quyTac ('tet' | 'lapXuan'), gioiTinh ('nam' | 'nu') */
  function banMenh({ d, m, y }, opts = {}) {
    const quyTac = QUY_TAC[opts.quyTac] ? opts.quyTac : 'tet';
    const nt = namTinh(d, m, y, quyTac), Y = nt.nam, { can, chi } = canChiNam(Y);
    const na = TuVi.napAm(can, chi), menh = HANH_TEN[na.hanh];
    const am = TuVi.solar2lunar(d, m, y, 7), ngay = ConGiap.thongTinNgay(TuVi.jdFromDate(d, m, y));
    const r = {
      duong: { d, m, y }, am: { d: am[0], m: am[1], y: am[2], nhuan: !!am[3] }, quyTac, moTaQuyTac: QUY_TAC[quyTac], giaoTiet: nt.giaoTiet,
      nam: Y, canChi: `${CAN[can]} ${CHI[chi]}`,
      can: { ten: CAN[can], hanh: CAN_HANH[can], amDuong: can % 2 ? 'Dương' : 'Âm' },
      chi: { ten: CHI[chi], con: CON[chi], hanh: CHI_HANH[chi], amDuong: chi % 2 ? 'Dương' : 'Âm', so: chi },
      napAm: { ten: na.ten, hanh: menh, y: NAP_AM_Y[na.ten], ngoaiLe: NGOAI_LE[na.ten] || '' },
      nhatChu: { ten: CAN[ngay.canNgay], hanh: CAN_HANH[ngay.canNgay], canChiNgay: `${CAN[ngay.canNgay]} ${CHI[ngay.chiNgay]}` },
      sinhKhac: { sinhRa: SINH[menh], duocSinhBoi: sinhBoi(menh), khac: KHAC[menh], biKhacBoi: khacBoi(menh) },
      mau: { tuongSinh: { hanh: sinhBoi(menh), mau: MAU[sinhBoi(menh)] }, banMenh: { hanh: menh, mau: MAU[menh] },
        che: { hanh: KHAC[menh], mau: MAU[KHAC[menh]] }, nenTranh: { hanh: khacBoi(menh), mau: MAU[khacBoi(menh)] } },
      phuong: { banMenh: PHUONG[menh], tuongSinh: PHUONG[sinhBoi(menh)] }, so: { banMenh: SO[menh], tuongSinh: SO[sinhBoi(menh)] },
    };
    if (opts.gioiTinh === 'nam' || opts.gioiTinh === 'nu') r.cungPhi = cungPhi(Y, opts.gioiTinh);
    // Các "hành" khác nhau trên cùng một người, mỗi cái thuộc một hệ thống
    r.heThong = [
      { ten: 'Ngũ hành nạp âm của năm sinh', hanh: menh, chiTiet: `${na.ten} (${NAP_AM_Y[na.ten]})`, dung: 'Cái người Việt thường gọi là "mệnh" theo năm sinh: xem tuổi, chọn màu, xem hợp khắc dân gian.' },
      { ten: 'Hành của thiên can năm', hanh: CAN_HANH[can], chiTiet: `can ${CAN[can]}`, dung: 'Dùng khi xét thiên can hợp khắc giữa hai tuổi.' },
      { ten: 'Hành của địa chi (con giáp)', hanh: CHI_HANH[chi], chiTiet: `chi ${CHI[chi]}, con ${CON[chi]}`, dung: 'Dùng khi xét tam hợp, lục hợp, xung giữa các tuổi.' },
      { ten: 'Nhật chủ (Bát tự)', hanh: CAN_HANH[ngay.canNgay], chiTiet: `can ngày ${CAN[ngay.canNgay]}, ngày ${CAN[ngay.canNgay]} ${CHI[ngay.chiNgay]}`, dung: 'Trong Bát tự (Tứ trụ), "bản mệnh" là can của ngày sinh, cần cả bốn trụ năm, tháng, ngày, giờ mới luận được vượng suy. Trang này chỉ ghi để phân biệt.' },
    ];
    if (r.cungPhi) r.heThong.push({ ten: 'Cung phi (Bát trạch)', hanh: r.cungPhi.hanh, chiTiet: `quái ${r.cungPhi.ten}, ${r.cungPhi.nhom}`, dung: 'Dùng trong phong thủy Bát trạch để chọn hướng nhà, hướng bàn, bố trí phòng. Cần giới tính.' });
    return r;
  }

  const MO_TA_QH = { hoa: 'cùng hành', sinh: 'sinh', duocSinh: 'được sinh bởi', khac: 'khắc', biKhac: 'bị khắc bởi' };
  /** Quan hệ hai bản mệnh (kết quả của banMenh) theo từng hệ thống */
  function haiMenh(A, B) {
    const qh = quanHe(A.napAm.hanh, B.napAm.hanh);
    const loiNapAm = { hoa: `Cùng hành ${A.napAm.hanh}: dễ hiểu nhau, nhưng cũng dễ cùng điểm yếu.`,
      sinh: `${A.napAm.hanh} sinh ${B.napAm.hanh}: người thứ nhất nâng đỡ, cho đi nhiều hơn.`, duocSinh: `${B.napAm.hanh} sinh ${A.napAm.hanh}: người thứ hai nâng đỡ người thứ nhất.`,
      khac: `${A.napAm.hanh} khắc ${B.napAm.hanh}: người thứ nhất dễ lấn át, cần tôn trọng nhau.`, biKhac: `${B.napAm.hanh} khắc ${A.napAm.hanh}: người thứ nhất dễ thấy bị áp lực.` }[qh];
    const ngoaiLe = [[A, B], [B, A]].filter(([x, y]) => x.napAm.ngoaiLe === y.napAm.hanh && KHAC[y.napAm.hanh] === x.napAm.hanh)
      .map(([x]) => `Một số sách xem tuổi cho rằng ${x.napAm.ten} gặp ${x.napAm.ngoaiLe} lại tốt (${x.napAm.ten === 'Sa Trung Kim' || x.napAm.ten === 'Kiếm Phong Kim' ? 'kim cần lửa mới thành đồ dùng' : x.napAm.hanh === 'Thủy' ? 'nước trời, nước biển không sợ đất' : 'lửa trời không sợ nước'}).`);
    const chi = ConGiap.quanHe(B.chi.so, A.chi.so);
    const r = { napAm: { quanHe: qh, loi: loiNapAm, ngoaiLe },
      can: { quanHe: quanHe(A.can.hanh, B.can.hanh), loi: `Can ${A.can.ten} (${A.can.hanh}) ${MO_TA_QH[quanHe(A.can.hanh, B.can.hanh)]} can ${B.can.ten} (${B.can.hanh}).` },
      chi: chi.length ? chi.map(q => `${q.ten}: ${q.hieu}`) : [A.chi.ten === B.chi.ten ? `Cùng tuổi ${A.chi.ten}.` : 'Không có tam hợp, lục hợp hay xung, hình, hại, phá.'] };
    if (A.cungPhi && B.cungPhi) {
      const dn = duNien(A.cungPhi.quai, B.cungPhi.quai);
      r.cungPhi = { duNien: dn, tot: DU_NIEN_Y[dn][0], y: DU_NIEN_Y[dn][1], cungNhom: A.cungPhi.nhom === B.cungPhi.nhom,
        loi: `Cung ${A.cungPhi.ten} gặp cung ${B.cungPhi.ten} là ${dn} (${DU_NIEN_Y[dn][0] ? 'tốt' : 'xấu'}: ${DU_NIEN_Y[dn][1]}). ${A.cungPhi.nhom === B.cungPhi.nhom ? `Hai người cùng ${A.cungPhi.nhom}, dễ chọn được hướng nhà hợp cả hai.` : 'Hai người khác nhóm Đông, Tây tứ mệnh, nên chọn hướng nhà theo người trụ cột và bố trí phòng riêng theo hướng tốt của từng người.'}` };
    }
    return r;
  }

  /** Kim lâu: tuổi mụ của người nữ năm cưới chia 9 dư 1, 3, 6, 8 */
  function kimLau(namSinhAm, namCuoi) {
    const tuoi = namCuoi - namSinhAm + 1, du = tuoi % 9;
    const loai = { 1: 'Kim lâu Thân (ảnh hưởng bản thân)', 3: 'Kim lâu Thê (ảnh hưởng người vợ)', 6: 'Kim lâu Tử (ảnh hưởng con cái)', 8: 'Kim lâu Lục súc (ảnh hưởng tài sản, vật nuôi)' }[du];
    return { tuoiMu: tuoi, du, pham: !!loai, loai: loai || '' };
  }

  /** Gợi ý phong thủy cá nhân theo Bát trạch. huongNha: một trong 8 hướng (hướng nhìn ra của cửa chính), có thể bỏ trống */
  function phongThuy(bm, huongNha) {
    const cp = bm.cungPhi; if (!cp) throw new Error('Cần giới tính để tính cung phi.');
    const lay = dn => cp.huong.find(x => x.duNien === dn).huong;
    const r = {
      huongTot: cp.huong.filter(x => x.tot), huongXau: cp.huong.filter(x => !x.tot),
      banLamViec: { quayMat: [lay('Sinh Khí'), lay('Diên Niên'), lay('Thiên Y'), lay('Phục Vị')],
        loi: `Ngồi quay mặt về ${lay('Sinh Khí')} (Sinh Khí) để làm việc, kinh doanh; về ${lay('Phục Vị')} (Phục Vị) khi cần tập trung học, nghiên cứu. Lưng nên dựa vào tường đặc, không quay lưng ra cửa.` },
      phong: [
        ['Cửa chính, phòng khách', `Hợp nhất ở hướng ${lay('Sinh Khí')} (Sinh Khí) hoặc ${lay('Diên Niên')} (Diên Niên).`],
        ['Phòng ngủ', `Đặt ở khu ${lay('Diên Niên')} (Diên Niên) hoặc ${lay('Thiên Y')} (Thiên Y) của ngôi nhà; đầu giường quay về một trong bốn hướng tốt.`],
        ['Bếp', `Theo nguyên tắc "tọa hung hướng cát": bếp đặt ở khu xấu như ${lay('Họa Hại')} (Họa Hại) hoặc ${lay('Lục Sát')} (Lục Sát) để "đốt" cái xấu, mặt bếp (hướng người đứng nấu nhìn vào) nên nhìn về hướng tốt.`],
        ['Nhà vệ sinh, kho', `Đặt ở khu xấu như ${lay('Tuyệt Mệnh')} (Tuyệt Mệnh) hoặc ${lay('Ngũ Quỷ')} (Ngũ Quỷ), tránh khu Sinh Khí.`],
        ['Bàn thờ', `Thường đặt tựa vào khu tốt và nhìn ra hướng ${lay('Sinh Khí')} hoặc ${lay('Diên Niên')}; nhiều gia đình theo hướng nhà và tuổi người trụ cột.`],
      ],
      mau: {
        napAm: { hanh: bm.napAm.hanh, tuongSinh: MAU[sinhBoi(bm.napAm.hanh)], banMenh: MAU[bm.napAm.hanh], nenTranh: MAU[khacBoi(bm.napAm.hanh)] },
        cungPhi: { hanh: cp.hanh, tuongSinh: MAU[sinhBoi(cp.hanh)], banMenh: MAU[cp.hanh], nenTranh: MAU[khacBoi(cp.hanh)] },
      },
    };
    if (huongNha) {
      if (!HUONG.includes(huongNha)) throw new Error('Hướng nhà cần là một trong 8 hướng.');
      const dn = duNienHuong(cp.quai, huongNha), toa = doiHuong(huongNha), qToa = QUAI_THEO_HUONG[toa];
      r.nha = { huong: huongNha, duNien: dn, tot: DU_NIEN_Y[dn][0], y: DU_NIEN_Y[dn][1], toa, trach: QUAI[qToa][0], nhomTrach: DONG.includes(qToa) ? 'Đông tứ trạch' : 'Tây tứ trạch',
        hopTheoToa: DONG.includes(qToa) === DONG.includes(cp.quai) };
    }
    return r;
  }

  const BanMenh = { CAN, CHI, CON, CAN_HANH, CHI_HANH, SINH, KHAC, MAU, PHUONG, SO, NAP_AM_Y, QUY_TAC, QUAI, HUONG, DU_NIEN, DU_NIEN_Y,
    quanHe, namTinh, cungPhi, duNien, duNienHuong, huongTuDo, doiHuong, banMenh, haiMenh, kimLau, phongThuy };
  if (node) module.exports = BanMenh; else root.BanMenh = BanMenh;
})(typeof window !== 'undefined' ? window : globalThis);
