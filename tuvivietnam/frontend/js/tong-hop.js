/* Trang chủ: kết hợp tử vi (lá số + 12 con giáp), cung hoàng đạo và số chủ đạo để dự đoán may mắn, tình cảm, sự nghiệp
 * theo hôm nay, tháng này, năm nay. Mỗi hệ cho điểm 1–5, điểm chung là trung bình ba hệ. Dùng chung cho trình duyệt và backend. */
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
  const phay = x => String(x).replace('.', ','); // số thập phân kiểu Việt Nam
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

  // ---------- Câu tổng hợp ----------
  const LINH_VUC = [
    { ma: 'mayMan', ten: 'May mắn', tuVi: 'Tài lộc' },
    { ma: 'tinhCam', ten: 'Tình cảm', tuVi: 'Tình cảm' },
    { ma: 'suNghiep', ten: 'Sự nghiệp', tuVi: 'Công việc' },
  ];
  const KET = {
    mayMan: { cao: 'Vận may đang mở: hãy chủ động nắm bắt cơ hội, thử điều mới và mở lời khi cần giúp đỡ.', vua: 'May mắn ở mức bình thường: kết quả phụ thuộc nhiều vào sự chuẩn bị của chính bạn.', thap: 'Không nên trông chờ vận may: tránh đầu tư liều, giữ tiền dự phòng và làm chắc từng việc.' },
    tinhCam: { cao: 'Tình cảm thuận lợi: thời điểm tốt để bày tỏ, hẹn hò hoặc vun đắp mối quan hệ.', vua: 'Tình cảm êm ả: sự quan tâm đều đặn quan trọng hơn những lời hứa lớn.', thap: 'Tình cảm cần kiên nhẫn: lắng nghe nhiều hơn, tránh nói lời nặng khi đang bực.' },
    suNghiep: { cao: 'Sự nghiệp đang lên: hợp để đề xuất ý tưởng, nhận việc mới hoặc thương lượng.', vua: 'Công việc ổn định: làm chắc từng việc, chuẩn bị cho bước tiến tiếp theo.', thap: 'Công việc nên thận trọng: kiểm tra kỹ giấy tờ, hoãn quyết định lớn nếu chưa cần.' },
  };
  /** Nói rõ hệ nào thuận (≥ 3,5), hệ nào nghịch (≤ 2,5) */
  function dongThuan(ds, ten) {
    const nhom = loc => ten.filter((_, i) => loc(ds[i])), noi = xs => xs.length > 1 ? `${xs.slice(0, -1).join(', ')} và ${xs[xs.length - 1]}` : xs[0];
    const thuan = nhom(x => x >= 3.5), nghich = nhom(x => x <= 2.5), binh = nhom(x => x > 2.5 && x < 3.5);
    if (thuan.length === 3) return 'Cả ba hệ cùng cho tín hiệu tốt.';
    if (nghich.length === 3) return 'Cả ba hệ cùng khuyên thận trọng.';
    if (binh.length === 3) return 'Cả ba hệ đều ở mức bình thường.';
    const cau = [thuan.length && `${noi(thuan)} cho tín hiệu tốt`, nghich.length && `${noi(nghich)} khuyên thận trọng`, binh.length && `${noi(binh)} ở mức bình thường`].filter(Boolean).join(', ');
    return cau.charAt(0).toUpperCase() + cau.slice(1) + '.';
  }
  const mucCua = d => d >= 3.6 ? 'cao' : d <= 2.6 ? 'thap' : 'vua';

  /**
   * v = { ngay, thang, nam, amLich, nhuan, gio (1–12 theo chi), namGioi }
   * homNay = { y, m, d } dương lịch theo giờ Việt Nam
   */
  function duDoan(v, homNay) {
    const L = TuVi.lapLaSo({ ngay: v.ngay, thang: v.thang, nam: v.nam, amLich: !!v.amLich, nhuan: !!v.nhuan, gio: v.gio, namGioi: !!v.namGioi });
    const ds = L.duong, h = homNay;
    // Cung hoàng đạo: giờ giữa canh giờ sinh (Tý = 0 giờ, Sửu = 2 giờ…) theo giờ Việt Nam
    const xd = CT.xacDinhCung({ y: ds.nam, m: ds.thang, d: ds.ngay, h: ((v.gio - 1) * 2) % 24, mi: 0 }), cung = xd.cung;
    const so = SH.tinh({ d: ds.ngay, m: ds.thang, y: ds.nam }, h);
    const scd = so.soChuDao, nghieng = scd.thienHuong;

    const nen = { mayMan: [sucCung(L, 'Tài Bạch'), sucCung(L, 'Phúc Đức')], tinhCam: [sucCung(L, 'Phu Thê')], suNghiep: [sucCung(L, 'Quan Lộc')] };
    const jd = TuVi.jdFromDate(h.d, h.m, h.y), tuoi = L.chiNam;
    const cg = { ngay: ConGiap.tuViNgay(tuoi, jd), thang: ConGiap.tuViThang(tuoi, jd), nam: ConGiap.tuViNam(tuoi, jd, { namSinh: L.am.nam, gioiTinh: v.namGioi ? 'nam' : 'nu' }) };
    const hd = { ngay: CT.tuViNgay(cung.so, h.y, h.m, h.d), thang: CT.tuViThang(cung.so, h.y, h.m), nam: CT.tuViNam(cung.so, h.y) };
    const sh = { ngay: so.ngayCaNhan, thang: so.thangCaNhan, nam: so.namCaNhan };
    const TEN_SO = { ngay: 'Ngày cá nhân', thang: 'Tháng cá nhân', nam: 'Năm cá nhân' };

    const ky = {};
    for (const k of ['ngay', 'thang', 'nam']) {
      const lvHD = ma => hd[k].linhVuc.find(x => x.ma === ma), tb4 = hd[k].linhVuc.reduce((a, x) => a + x.sao, 0) / 4;
      const linhVuc = LINH_VUC.map(({ ma, ten, tuVi }) => {
        const n = nen[ma], diemNen = n.reduce((a, x) => a + x.diem, 0) / n.length;
        const tv = kep(0.4 * diemNen + 0.6 * cg[k].diem);
        const lvz = ma === 'mayMan' ? lvHD('taiChinh') : lvHD(ma === 'tinhCam' ? 'tinhYeu' : 'congViec');
        const z = ma === 'mayMan' ? (lvz.sao + tb4) / 2 : lvz.sao;
        const s = kep(sh[k][ma].diem + nghieng[ma] * 0.5);
        const tong = (tv + z + s) / 3;
        return { ma, ten, diem: tron(tong), sao: Math.round(tong), phanTram: Math.round(tong / 5 * 100), muc: mucCua(tong),
          tongHop: `${dongThuan([tv, z, s], ['tử vi', `cung ${cung.ten}`, 'số chủ đạo'])} ${KET[ma][mucCua(tong)]}`,
          nguon: [
            { he: 'Tử vi', diem: tron(tv), loi: `${n.map(moTaCung).join(' ')} ${cg[k].muc.find(x => x.ten === tuVi).text}` },
            { he: `Cung ${cung.ten}`, diem: tron(z), loi: cauDau(lvz.loi) },
            { he: `Số chủ đạo ${scd.hien}`, diem: tron(s), loi: `${TEN_SO[k]} số ${sh[k].so} (${sh[k].ten}): ${sh[k][ma].loi}` },
          ] };
      });
      const xep = [...linhVuc].sort((a, b) => b.diem - a.diem);
      ky[k] = { tuVi: { tieuDe: cg[k].tieuDe, nhan: cg[k].nhan, ly: cg[k].dong[0] }, linhVuc,
        tomTat: xep[0].diem - xep[2].diem < 0.4 ? `Ba mặt khá cân bằng, quanh mức ${phay(tron((xep[0].diem + xep[2].diem) / 2))}/5.`
          : `Nổi bật nhất là ${xep[0].ten.toLowerCase()} (${phay(xep[0].diem)}/5); ${xep[2].ten.toLowerCase()} cần chú ý hơn (${phay(xep[2].diem)}/5).` };
    }

    const menh = L.cung[L.menh - 1], chinhMenh = menh.sao.filter(s => s.loai === 1);
    return {
      ngaySinh: { duong: `${ds.ngay}/${ds.thang}/${ds.nam}`, am: `${L.am.ngay}/${L.am.thang}${L.am.nhuan ? ' nhuận' : ''}/${L.am.nam}`, gio: `giờ ${TuVi.CHI[v.gio]}`, iso: `${ds.nam}-${String(ds.thang).padStart(2, '0')}-${String(ds.ngay).padStart(2, '0')}` },
      hoSo: {
        tuVi: { canChi: L.canChi.nam, con: ConGiap.CON[L.chiNam], banMenh: L.banMenh, cuc: L.cuc, menhChi: menh.chi,
          menhChinh: chinhMenh.map(s => s.ten + (DT[s.dacTinh] ? ` (${DT[s.dacTinh][0]})` : '')), amDuong: L.amDuong },
        hoangDao: { id: cung.id, ten: cung.ten, kyHieu: cung.kyHieu, en: cung.en, nguyenTo: HD.NGUYEN_TO[cung.nguyenTo].ten, tuKhoa: cung.tuKhoa, nguyenToMa: cung.nguyenTo,
          giaoCung: xd.giaoCung ? `${xd.giaoCung.truoc.ten}/${xd.giaoCung.sau.ten}` : null },
        soHoc: { so: scd.so, hien: scd.hien, ten: scd.ten, tuKhoa: scd.tuKhoa, namCaNhan: { so: so.namCaNhan.so, ten: so.namCaNhan.ten } },
      },
      ky,
      mayMan: {
        mau: cg.ngay.mau, mauHomNay: hd.ngay.mau,
        so: [...new Set([...cg.ngay.so.split(', ').map(Number), scd.so === 22 ? 4 : scd.so % 10 || scd.so, so.ngayCaNhan.so])].sort((a, b) => a - b),
      },
    };
  }

  const TongHop = { duDoan, sucCung };
  if (node) module.exports = TongHop; else root.TongHop = TongHop;
})(typeof window !== 'undefined' ? window : globalThis);
