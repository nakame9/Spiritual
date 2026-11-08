/* Trang chủ: kết hợp tử vi (lá số + 12 con giáp), cung hoàng đạo và số chủ đạo thành tổng quan vận trình gồm
 * tổng quan, công việc, tài chính, tình cảm, sức khỏe, vận may theo hôm nay, tuần này, tháng này, năm nay.
 * Mỗi hệ tính theo cách riêng và cho điểm 1–5; điểm chung là trung bình các hệ. Dùng chung cho trình duyệt và backend. */
(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const TuVi = node ? require('./tuvi.js') : root.TuVi;
  const ConGiap = node ? require('./congiap.js') : root.ConGiap;
  const CT = node ? require('../../../zodiac/frontend/js/luan-giai.js') : root.ChiemTinh;
  const HD = node ? require('../../../zodiac/frontend/js/cung-hoang-dao.js') : root.HoangDao;
  const SH = node ? require('../../../numerology/frontend/js/so-hoc.js') : root.SoHoc;
  const kep = x => Math.max(1, Math.min(5, x));
  const tron = x => Math.round(x * 10) / 10;
  const pt = d => Math.round((d - 1) / 4 * 100); // điểm 1–5 ra phần trăm: 1 = 0%, 3 = 50%, 5 = 100%
  const cauDau = s => (s.match(/^.*?[.!?](\s|$)/) || [s])[0].trim();

  // ---------- Tử vi: độ vững của cung trên lá số ----------
  const DT = { M: ['miếu', 1], V: ['vượng', 1], 'Đ': ['đắc', 0.5], B: ['bình', 0], H: ['hãm', -1] };
  // Cát tinh và hung tinh chính (theo nhóm phụ tinh trong phần luận giải)
  const CAT = new Set([61, 62, 57, 58, 59, 60, 27, 94, 93, 92, 100, 101, 67, 68, 65, 66, 84, 85, 76, 63, 64, 79, 80, 71, 72, 83, 81, 82, 98]);
  const HUNG = new Set([51, 52, 53, 54, 55, 56, 95, 73, 104, 99, 36, 30, 90, 91, 69, 70, 17, 23]);
  function sucCung(L, ten) {
    const c = L.cung.find(x => x.ten === ten), chinh = c.sao.filter(s => s.loai === 1);
    let d = 3 + (chinh.length ? chinh.reduce((a, s) => a + (DT[s.dacTinh] ? DT[s.dacTinh][1] : 0), 0) / chinh.length : -0.5);
    const cat = c.sao.filter(s => CAT.has(s.id)), hung = c.sao.filter(s => HUNG.has(s.id));
    d += Math.min(1.5, cat.length * 0.4) - Math.min(1.5, hung.length * 0.5);
    if (c.tuan || c.triet) d = 3 + (d - 3) * 0.7; // Tuần, Triệt làm sao tốt bớt tốt, sao xấu bớt xấu
    return { ten, chi: c.chi, diem: kep(d), chinh: chinh.map(s => s.ten + (DT[s.dacTinh] ? ` (${DT[s.dacTinh][0]})` : '')), cat: cat.map(s => s.ten), hung: hung.map(s => s.ten) };
  }
  const nenCung = k => k.diem >= 3.6 ? 'nền tốt' : k.diem <= 2.4 ? 'nền cần vun đắp thêm' : 'nền ở mức trung bình';
  const moTaCung = k => `Cung ${k.ten} có ${k.chinh.length ? k.chinh.join(', ') : 'Vô chính diệu'}${k.cat.length ? `, cát tinh ${k.cat.slice(0, 2).join(', ')}` : ''}${k.hung.length ? `, hung tinh ${k.hung.slice(0, 2).join(', ')}` : ''}: ${nenCung(k)}.`;

  // ---------- Câu chữ ----------
  const MUC_TEN = { cao: 'Thuận lợi', vua: 'Bình thường', thap: 'Cần thận trọng' };
  const KET = {
    congViec: { cao: p => `Công việc ${p} đang thuận, dễ có cơ hội hợp tác hoặc được ghi nhận.`, vua: p => `Công việc ${p} ổn định, ít biến động lớn.`, thap: p => `Công việc ${p} có thử thách, cần thận trọng với giấy tờ và các quyết định.` },
    taiChinh: { cao: p => `Tài chính ${p} khá thuận, thu nhập có cơ hội tăng.`, vua: p => `Tài chính ${p} cân bằng, thu chi ở mức bình thường.`, thap: p => `Tài chính ${p} dễ hao hụt, nên kiểm soát chi tiêu.` },
    tinhCam: { cao: p => `Tình cảm ${p} êm ấm, thuận để bày tỏ và gắn kết.`, vua: p => `Tình cảm ${p} bình lặng, cần sự quan tâm đều đặn.`, thap: p => `Tình cảm ${p} dễ có hiểu lầm, cần kiên nhẫn lắng nghe.` },
    sucKhoe: { cao: p => `Sức khỏe ${p} tốt, tinh thần sảng khoái.`, vua: p => `Sức khỏe ${p} bình thường, chú ý nghỉ ngơi hợp lý.`, thap: p => `Sức khỏe ${p} cần chú ý, dễ mệt mỏi.` },
    vanMay: { cao: p => `Vận may ${p} đang mở.`, vua: p => `Vận may ${p} ở mức trung bình.`, thap: p => `Vận may ${p} không cao, nên dựa vào sức mình.` },
  };
  const KHUYEN = {
    tongQuan: { cao: 'Thời điểm thuận để bắt đầu việc quan trọng.', vua: 'Giữ nhịp ổn định, ưu tiên việc cần làm trước.', thap: 'Chậm lại một nhịp, ưu tiên giữ gìn hơn mở rộng.' },
    congViec: { cao: 'Chủ động đề xuất ý tưởng, nhận thêm trách nhiệm; công sức lúc này dễ được ghi nhận.', vua: 'Làm chắc việc đang có, ghi chép tiến độ rõ ràng; chuẩn bị kỹ trước khi mở việc mới.', thap: 'Kiểm tra kỹ điều khoản, giấy tờ trước khi quyết định; hoãn thay đổi lớn nếu chưa cần.' },
    taiChinh: { cao: 'Có thể tính khoản đầu tư đã tìm hiểu kỹ, nhưng vẫn giữ quỹ dự phòng.', vua: 'Rà lại các khoản chi cố định, để dành đều một phần thu nhập.', thap: 'Ưu tiên kiểm soát chi tiêu, tránh vay mượn và đầu tư theo phong trào.' },
    tinhCam: { cao: 'Dành thời gian cho người thương, nói ra điều mình nghĩ; người độc thân nên mở rộng giao lưu.', vua: 'Quan tâm bằng việc nhỏ: hỏi han, lắng nghe, giữ lời hứa.', thap: 'Trò chuyện bình tĩnh để gỡ hiểu lầm; tránh nói lời nặng khi đang bực.' },
    sucKhoe: { cao: 'Thể trạng tốt; tận dụng để tập luyện đều và ngủ đúng giờ.', vua: 'Giữ nếp ăn ngủ điều độ, uống đủ nước, vận động nhẹ mỗi ngày.', thap: 'Nghỉ ngơi nhiều hơn, đừng làm quá sức; có dấu hiệu bất thường thì nên đi khám.' },
    vanMay: { cao: 'Mạnh dạn thử điều mới, mở lời nhờ giúp đỡ; cơ hội đến thì nắm lấy.', vua: 'Kết quả phụ thuộc vào sự chuẩn bị: lên kế hoạch kỹ hơn là trông vào may rủi.', thap: 'Đừng trông chờ vận may; làm chắc từng việc, tránh quyết định liều.' },
  };
  /** Nói rõ hệ nào thuận (≥ 3,5), hệ nào nghịch (≤ 2,5) */
  function dongThuan(ds, ten) {
    const nhom = loc => ten.filter((_, i) => loc(ds[i])), noi = xs => xs.length > 1 ? `${xs.slice(0, -1).join(', ')} và ${xs[xs.length - 1]}` : xs[0];
    const thuan = nhom(x => x >= 3.5), nghich = nhom(x => x <= 2.5), binh = nhom(x => x > 2.5 && x < 3.5);
    const n = ds.length, tat = n === 2 ? 'Cả hai hệ' : 'Cả ba hệ';
    if (thuan.length === n) return `${tat} cùng cho tín hiệu tốt.`;
    if (nghich.length === n) return `${tat} cùng khuyên thận trọng.`;
    if (binh.length === n) return `${tat} đều ở mức bình thường.`;
    const cau = [thuan.length && `${noi(thuan)} cho tín hiệu tốt`, nghich.length && `${noi(nghich)} khuyên thận trọng`, binh.length && `${noi(binh)} ở mức bình thường`].filter(Boolean).join(', ');
    return cau.charAt(0).toUpperCase() + cau.slice(1) + '.';
  }
  const mucCua = d => d >= 3.6 ? 'cao' : d <= 2.6 ? 'thap' : 'vua';
  const tb = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
  const hai = n => String(n).padStart(2, '0');
  const chuDeHD = x => typeof x.chuDe === 'string' ? x.chuDe
    : (x.chuDe || x.moc || []).map(c => `Từ ${c.tu}${c.den ? ` đến ${c.den}` : ''}: ${c.loi}`).join(' ');

  const MAT = [
    { ma: 'congViec', ten: 'Công việc', cung: ['Quan Lộc'], cg: 'Công việc', hd: 'congViec', sh: 'suNghiep' },
    { ma: 'taiChinh', ten: 'Tài chính', cung: ['Tài Bạch', 'Điền Trạch'], cg: 'Tài lộc', hd: 'taiChinh', sh: 'mayMan' },
    { ma: 'tinhCam', ten: 'Tình cảm', cung: ['Phu Thê'], cg: 'Tình cảm', hd: 'tinhYeu', sh: 'tinhCam' },
    { ma: 'sucKhoe', ten: 'Sức khỏe', cung: ['Tật Ách'], cg: 'Sức khỏe', hd: 'sucKhoe', sh: null }, // thần số học không có phần sức khỏe
    { ma: 'vanMay', ten: 'Vận may', cung: ['Phúc Đức'], cg: null, hd: null, sh: 'vanMay' },
  ];
  const KY = ['ngay', 'tuan', 'thang', 'nam'];
  const CHU_KY = { ngay: 'hôm nay', tuan: 'tuần này', thang: 'tháng này', nam: 'năm nay' };
  const TEN_SO = { ngay: 'Ngày cá nhân', tuan: 'Ngày cá nhân trong tuần', thang: 'Tháng cá nhân', nam: 'Năm cá nhân' };
  const shTB = c => (c.tinhCam.diem + c.suNghiep.diem + c.mayMan.diem) / 3;

  /**
   * v = { ngay, thang, nam, amLich, nhuan, gio (1–12 theo chi), namGioi, noi?: { ten, viDo, kinhDo, tz } }
   * homNay = { y, m, d } dương lịch theo giờ Việt Nam
   */
  function duDoan(v, homNay) {
    const L = TuVi.lapLaSo({ ngay: v.ngay, thang: v.thang, nam: v.nam, amLich: !!v.amLich, nhuan: !!v.nhuan, gio: v.gio, namGioi: !!v.namGioi });
    const ds = L.duong, h = homNay;
    const noi = v.noi || { ten: 'Hà Nội', viDo: 21.028, kinhDo: 105.854, tz: CT.VN };
    // Chiêm tinh tính theo giờ giữa canh giờ sinh (Tý = 0 giờ, Sửu = 2 giờ…) ở múi giờ nơi sinh
    const gioTay = { y: ds.nam, m: ds.thang, d: ds.ngay, h: ((v.gio - 1) * 2) % 24, mi: 0, tz: noi.tz };
    const xd = CT.xacDinhCung(gioTay), cung = xd.cung;
    const mt = CT.banDoSao({ ...gioTay, coGio: true, viDo: noi.viDo, kinhDo: noi.kinhDo }).sao.find(x => x.ma === 'matTrang');
    const so = SH.tinh({ d: ds.ngay, m: ds.thang, y: ds.nam }, h);
    const scd = so.soChuDao, nghieng = scd.thienHuong;
    const nghiengTB = (nghieng.tinhCam + nghieng.suNghiep + nghieng.mayMan) / 3;

    const jd = TuVi.jdFromDate(h.d, h.m, h.y), tuoi = L.chiNam;
    const dau = jd - ((jd + 1) % 7 + 6) % 7; // thứ Hai đầu tuần, như ConGiap.tuViTuan
    const ngayCua = j => { const [d, m, y] = TuVi.jdToDate(j); return { d, m, y }; };
    const cg = { ngay: ConGiap.tuViNgay(tuoi, jd), tuan: ConGiap.tuViTuan(tuoi, jd), thang: ConGiap.tuViThang(tuoi, jd),
      nam: ConGiap.tuViNam(tuoi, jd, { namSinh: L.am.nam, gioiTinh: v.namGioi ? 'nam' : 'nu' }) };
    const hd = { ngay: CT.tuViNgay(cung.so, h.y, h.m, h.d), tuan: CT.tuViTuan(cung.so, h.y, h.m, h.d), thang: CT.tuViThang(cung.so, h.y, h.m), nam: CT.tuViNam(cung.so, h.y) };

    // Số học: ngày, tháng, năm có sẵn; tuần là 7 ngày cá nhân từ thứ Hai
    const ckNgay = x => SH.chuKy(SH.ngayCaNhan(ds.ngay, ds.thang, x.y, x.m, x.d), 'ngày đó');
    const tuan7 = [...Array(7).keys()].map(i => { const x = ngayCua(dau + i); return { x, ck: ckNgay(x), cg: cg.tuan.tuan[i] }; });
    const shMat = (k, ma) => {
      if (k === 'tuan') {
        const lay = ma === 'vanMay' ? shTB : c => c[ma].diem;
        const tot = tuan7.reduce((a, b) => lay(b.ck) > lay(a.ck) ? b : a);
        return { diem: kep(tb(tuan7.map(t => lay(t.ck))) + (ma === 'vanMay' ? nghiengTB : nghieng[ma]) * 0.5),
          loi: `${TEN_SO.tuan}: ${tuan7.map(t => t.ck.so).join(', ')}. Thuận nhất là ${tot.cg.thu} ${tot.x.d}/${tot.x.m} (số ${tot.ck.so}, ${tot.ck.ten}): ${ma === 'vanMay' ? tot.ck.moTa : tot.ck[ma].loi}` };
      }
      const c = { ngay: so.ngayCaNhan, thang: so.thangCaNhan, nam: so.namCaNhan }[k];
      if (ma === 'vanMay') return { diem: kep(shTB(c) + nghiengTB * 0.5), loi: `${TEN_SO[k]} số ${c.so} (${c.ten}): ${c.moTa}` };
      return { diem: kep(c[ma].diem + nghieng[ma] * 0.5), loi: `${TEN_SO[k]} số ${c.so} (${c.ten}): ${c[ma].loi}` };
    };

    // Ngày (giờ, tháng) phù hợp: cộng điểm ba hệ cho từng ngày trong khoảng
    const diemNgay = x => ConGiap.tuViNgay(tuoi, TuVi.jdFromDate(x.d, x.m, x.y)).diem + CT.diemNgay(cung.so, x.y, x.m, x.d).tong + shTB(ckNgay(x));
    const top = (ds2, n) => ds2.sort((a, b) => b.d - a.d).slice(0, n).sort((a, b) => a.i - b.i);
    const soNgayThang = new Date(Date.UTC(h.y, h.m, 0)).getUTCDate();
    const ngayHop = {
      ngay: `Giờ tốt: ${cg.ngay.gioTot.slice(0, 4).join(', ')}`,
      tuan: `Ngày hợp nhất: ${top(tuan7.map((t, i) => ({ i, t, d: t.cg.diem + CT.diemNgay(cung.so, t.x.y, t.x.m, t.x.d).tong + shTB(t.ck) })), 2).map(o => `${o.t.cg.thu} ${o.t.x.d}/${o.t.x.m}`).join(', ')}`,
      thang: `Ngày hợp nhất: ${top([...Array(soNgayThang).keys()].map(i => ({ i, d: diemNgay({ d: i + 1, m: h.m, y: h.y }) })), 3).map(o => `${o.i + 1}/${h.m}`).join(', ')}`,
      nam: `Tháng hợp nhất: ${top([...Array(12).keys()].map(i => ({ i, d: ConGiap.tuViThang(tuoi, TuVi.jdFromDate(15, i + 1, h.y)).diem
        + tb([5, 15, 25].map(d => CT.diemNgay(cung.so, h.y, i + 1, d).tong)) + shTB(SH.chuKy(SH.thangCaNhan(ds.ngay, ds.thang, h.y, i + 1), '')) })), 3).map(o => `tháng ${o.i + 1}`).join(', ')} (dương lịch)`,
    };
    const cuoi = ngayCua(dau + 6);
    const apDung = {
      ngay: `Hôm nay, ${h.d}/${h.m}/${h.y}`,
      tuan: `Tuần từ thứ Hai ${tuan7[0].x.d}/${tuan7[0].x.m} đến Chủ nhật ${cuoi.d}/${cuoi.m}/${cuoi.y}`,
      thang: `Tháng ${h.m}/${h.y} dương lịch; vận theo tuổi tính theo ${cg.thang.tieuDe.replace(/^Tử vi tuổi \S+ /, '')}`,
      nam: `Năm ${h.y}; vận theo tuổi tính theo năm âm lịch ${cg.nam.tieuDe.replace(/^Tử vi tuổi \S+ năm /, '')}`,
    };

    const nenCuaMat = {};
    MAT.forEach(m => { nenCuaMat[m.ma] = m.cung.map(t => sucCung(L, t)); });

    const ky = {};
    for (const k of KY) {
      const p = CHU_KY[k], cgk = cg[k], hdk = hd[k];
      const tb4 = tb(hdk.linhVuc.map(x => x.sao));
      const linhVuc = MAT.map(m => {
        const n = nenCuaMat[m.ma], diemNen = tb(n.map(x => x.diem));
        const tv = kep(0.4 * diemNen + 0.6 * cgk.diem);
        const lvz = m.hd && hdk.linhVuc.find(x => x.ma === m.hd);
        const z = lvz ? lvz.sao : tb4;
        const nguon = [
          { he: 'Tử vi', diem: tv, loi: `${n.map(moTaCung).join(' ')} ${m.cg ? cgk.muc.find(x => x.ten === m.cg).text : cgk.dong[0]}` },
          { he: `Cung ${cung.ten}`, diem: z, loi: lvz ? lvz.loi : `Trung bình bốn mặt tình yêu, công việc, tài chính, sức khỏe theo cung ${cung.ten}${k === 'ngay' ? `; màu hợp hôm nay: ${hdk.mau}` : ''}.` },
        ];
        if (m.sh) { const s = shMat(k, m.sh); nguon.push({ he: `Số chủ đạo ${scd.hien}`, diem: s.diem, loi: s.loi }); }
        return ketMat(m.ma, m.ten, nguon, p, apDung[k]);
      });
      // Tổng quan: trung bình năm mặt, mỗi hệ một nhận định chung
      const heTB = i => tb(linhVuc.filter(l => l.nguon[i]).map(l => l.nguon[i].diem));
      const tq = ketMat('tongQuan', 'Tổng quan', [
        { he: 'Tử vi', diem: heTB(0), loi: `${cgk.tieuDe}: ${cgk.nhan.toLowerCase()}. ${cgk.dong.join(' ')}` },
        { he: `Cung ${cung.ten}`, diem: heTB(1), loi: chuDeHD(hdk) || hdk.linhVuc[0].loi },
        { he: `Số chủ đạo ${scd.hien}`, diem: heTB(2), loi: shMat(k, 'vanMay').loi },
      ], p, apDung[k]);
      tq.diem = tron(tb(linhVuc.map(l => l.diem))); tq.phanTram = pt(tq.diem); tq.muc = mucCua(tq.diem); tq.nhan = MUC_TEN[tq.muc];
      const xep = [...linhVuc].sort((a, b) => b.diem - a.diem);
      tq.nhanDinh = xep[0].phanTram - xep[4].phanTram < 10 ? `Các mặt ${p} khá cân bằng, quanh mức ${tq.phanTram}%.`
        : `${p.charAt(0).toUpperCase() + p.slice(1)} nổi bật nhất là ${xep[0].ten.toLowerCase()} (${xep[0].phanTram}%); ${xep[4].ten.toLowerCase()} cần chú ý hơn (${xep[4].phanTram}%).`;
      tq.loiKhuyen = [KHUYEN.tongQuan[tq.muc], cgk.loiKhuyen, k === 'ngay' && hdk.luuY].filter(Boolean).join(' ');
      const vm = linhVuc[4];
      vm.mau = k === 'ngay' ? `${cgk.mau}; theo Mặt Trăng hôm nay thêm màu ${hdk.mau}` : cgk.mau;
      const sk = { ngay: so.ngayCaNhan.so, tuan: tuan7[(jd - dau)].ck.so, thang: so.thangCaNhan.so, nam: so.namCaNhan.so }[k];
      vm.so = [...new Set([...cgk.so.split(', ').map(Number), scd.so === 22 ? 4 : scd.so % 10 || scd.so, sk])].sort((a, b) => a - b);
      vm.ngayHop = ngayHop[k];
      ky[k] = { apDung: apDung[k], tuVi: { tieuDe: cgk.tieuDe, nhan: cgk.nhan }, linhVuc: [tq, ...linhVuc] };
    }

    const menh = L.cung[L.menh - 1], chinhMenh = menh.sao.filter(s => s.loai === 1);
    const namAmNay = TuVi.solar2lunar(h.d, h.m, h.y)[2];
    return {
      ngaySinh: { duong: `${ds.ngay}/${ds.thang}/${ds.nam}`, am: `${L.am.ngay}/${L.am.thang}${L.am.nhuan ? ' nhuận' : ''}/${L.am.nam}`, gio: `giờ ${TuVi.CHI[v.gio]}`,
        iso: `${ds.nam}-${hai(ds.thang)}-${hai(ds.ngay)}`, gioGiua: `${hai(gioTay.h)}:00` },
      noiSinh: noi,
      hoSo: {
        tuVi: { canChi: L.canChi.nam, con: ConGiap.CON[L.chiNam], banMenh: L.banMenh, cuc: L.cuc, menhChi: menh.chi, tuoiAm: namAmNay - L.am.nam + 1,
          menhChinh: chinhMenh.map(s => s.ten + (DT[s.dacTinh] ? ` (${DT[s.dacTinh][0]})` : '')), amDuong: L.amDuong, menhChu: L.menhChu, thanChu: L.thanChu },
        hoangDao: { id: cung.id, ten: cung.ten, kyHieu: cung.kyHieu, en: cung.en, nguyenTo: HD.NGUYEN_TO[cung.nguyenTo].ten, tuKhoa: cung.tuKhoa, nguyenToMa: cung.nguyenTo,
          giaoCung: xd.giaoCung ? `${xd.giaoCung.truoc.ten}/${xd.giaoCung.sau.ten}` : null, matTrang: mt.tenCung },
        soHoc: { so: scd.so, hien: scd.hien, ten: scd.ten, tuKhoa: scd.tuKhoa, namCaNhan: { so: so.namCaNhan.so, ten: so.namCaNhan.ten },
          ngaySinh: so.ngaySinhSo.hien, thaiDo: so.thaiDo.hien },
      },
      ky,
    };
  }

  /** Gộp điểm các hệ thành một mặt: điểm, mức, nhận định ngắn, phân tích từng hệ, lời khuyên, thời gian áp dụng */
  function ketMat(ma, ten, nguon, p, apDung) {
    const d = tb(nguon.map(x => x.diem)), muc = mucCua(d);
    return { ma, ten, diem: tron(d), phanTram: pt(d), muc, nhan: MUC_TEN[muc], apDung,
      nhanDinh: KET[ma] ? `${KET[ma][muc](p)} ${dongThuan(nguon.map(x => x.diem), nguon.map(x => x.he.replace(/^Số chủ đạo.*/, 'số chủ đạo').replace(/^\S/, c => c.toLowerCase())))}` : '',
      nguon: nguon.map(x => ({ he: x.he, diem: tron(x.diem), phanTram: pt(x.diem), loi: x.loi })),
      loiKhuyen: KHUYEN[ma][muc] };
  }

  const TongHop = { duDoan, sucCung };
  if (node) module.exports = TongHop; else root.TongHop = TongHop;
})(typeof window !== 'undefined' ? window : globalThis);
