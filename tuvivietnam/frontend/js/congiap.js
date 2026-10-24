/* Tử vi 12 con giáp theo ngày, tuần, tháng, năm.
 * Nội dung tạo tự động từ quan hệ địa chi (tam hợp, lục hợp, xung, hình, hại, phá) giữa tuổi và
 * ngày/tháng/năm, cộng ngày hoàng đạo, Thái Tuế, Tam tai và sao chiếu mệnh theo quan niệm dân gian. */
(function (root) {
  'use strict';
  const TuVi = (typeof module !== 'undefined' && module.exports) ? require('./tuvi.js') : root.TuVi;
  const { CHI, CAN } = TuVi;

  const CON = ['', 'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
  const HAN = ['', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const HANH = ['', 'Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
  const THU = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const GIO = ['', '23h–1h', '1h–3h', '3h–5h', '5h–7h', '7h–9h', '9h–11h', '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'];

  // ---------- Quan hệ địa chi ----------
  const TAM_HOP = [[9, 1, 5], [3, 7, 11], [6, 10, 2], [12, 4, 8]];
  const cap2 = list => list.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`);
  const LUC_HOP = cap2([[1, 2], [3, 12], [4, 11], [5, 10], [6, 9], [7, 8]]);
  const HINH = cap2([[1, 4], [3, 6], [6, 9], [3, 9], [2, 11], [11, 8], [2, 8]]);
  const HAI = cap2([[1, 8], [2, 7], [3, 6], [4, 5], [9, 12], [10, 11]]);
  const PHA = cap2([[1, 10], [7, 4], [9, 6], [3, 12], [5, 2], [11, 8]]);
  const TU_HINH = [5, 7, 10, 12];
  const HIEU = {
    tamHop: ['được quý nhân giúp, việc dễ thành', 2], lucHop: ['nhiều sự hòa hợp, dễ được ủng hộ', 2],
    xung: ['dễ có xáo trộn, nên tránh việc lớn', -2], hinh: ['dễ vướng thị phi, chuyện giấy tờ', -1],
    hai: ['đề phòng tiểu nhân, hiểu lầm', -1], pha: ['kế hoạch dễ dở dang, nên có phương án dự phòng', -1],
    tuHinh: ['dễ tự làm khó mình vì lo nghĩ', -1],
  };

  /** Các quan hệ giữa chi k (ngày/tháng/năm) và chi t (tuổi): [{loai, ten, diem}] */
  function quanHe(k, t) {
    const out = [], key = `${Math.min(k, t)}-${Math.max(k, t)}`;
    const add = (loai, ten) => out.push({ loai, ten, diem: HIEU[loai][1], hieu: HIEU[loai][0] });
    if (k === t) { if (TU_HINH.includes(t)) add('tuHinh', 'cùng chi, thuộc tự hình'); return out; }
    const g = TAM_HOP.find(x => x.includes(k));
    if (g.includes(t)) add('tamHop', `cùng nhóm tam hợp ${g.map(c => CHI[c]).join(' – ')}`);
    if (LUC_HOP.includes(key)) add('lucHop', 'là cặp lục hợp');
    if (Math.abs(k - t) === 6) add('xung', 'xung nhau (lục xung)');
    if (HINH.includes(key)) add('hinh', 'tương hình');
    if (HAI.includes(key)) add('hai', 'lục hại');
    if (PHA.includes(key)) add('pha', 'lục phá');
    return out;
  }
  function moTaQuanHe(noun, k, t, qh) {
    const dau = `${noun} ${CHI[k]} và tuổi ${CHI[t]}`;
    if (!qh.length) return `${dau} ${k === t ? 'cùng chi' : 'không xung không hợp'}, mọi việc ở mức bình thường.`;
    return qh.map(q => `${dau} ${q.ten}: ${q.hieu}.`).join(' ');
  }

  // ---------- Hoàng đạo (12 thần, khởi Thanh Long theo chi tháng hoặc chi ngày) ----------
  const THAN = ['Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Kim Đường', 'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Nguyên Vũ', 'Tư Mệnh', 'Câu Trận'];
  const TOT = [1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0];
  const khoi = c => [9, 11, 1, 3, 5, 7][(c - 1) % 6]; // Tý Ngọ→Thân, Sửu Mùi→Tuất, Dần Thân→Tý, Mão Dậu→Dần, Thìn Tuất→Thìn, Tỵ Hợi→Ngọ
  const than = (goc, c) => (c - khoi(goc) + 12) % 12;
  const gioHoangDao = chiNgay => [...Array(12).keys()].map(i => i + 1).filter(h => TOT[than(chiNgay, h)]);

  // ---------- Ngũ hành ----------
  const SINH_BOI = { Kim: 'Thổ', Mộc: 'Thủy', Thủy: 'Kim', Hỏa: 'Mộc', Thổ: 'Hỏa' };
  const MAU = { Kim: 'trắng, bạc', Mộc: 'xanh lá', Thủy: 'đen, xanh dương', Hỏa: 'đỏ, hồng, tím', Thổ: 'vàng, nâu' };
  const SO = { Thủy: [1, 6], Hỏa: [2, 7], Mộc: [3, 8], Kim: [4, 9], Thổ: [5, 0] };
  function mayMan(t) {
    const h = HANH[t], s = SINH_BOI[h];
    return { mau: `${MAU[s]} (hành ${s} sinh ${h}), ${MAU[h]}`, so: [...SO[s], ...SO[h]].sort((a, b) => a - b).join(', ') };
  }

  // ---------- Câu chữ ----------
  const VAN = {
    'Công việc': {
      tot: ['Công việc {ky} thuận lợi, ý tưởng dễ được cấp trên và đồng nghiệp ủng hộ. Nên chủ động đề xuất hoặc bắt đầu việc mới.',
        'Đây là lúc tốt để giải quyết những việc tồn đọng; làm đến đâu gọn đến đó.',
        'Có người hỗ trợ đúng lúc, việc đang bế tắc có hướng gỡ. Thích hợp ký kết, gặp đối tác.'],
      binh: ['Công việc {ky} ở mức ổn định, không có biến động lớn. Làm theo kế hoạch sẵn có là đủ.',
        'Việc nào cũng cần thêm chút thời gian mới xong; tránh ôm đồm nhiều việc cùng lúc.',
        'Hợp với việc chuẩn bị, sắp xếp, học thêm kỹ năng hơn là khởi động dự án lớn.'],
      xau: ['Công việc {ky} dễ gặp trục trặc nhỏ hoặc bất đồng ý kiến. Kiểm tra kỹ giấy tờ, số liệu trước khi gửi đi.',
        'Nên tạm hoãn những quyết định lớn như đổi việc hay ký hợp đồng quan trọng nếu chưa thật cần.',
        'Dễ bị hiểu lầm trong giao tiếp nơi làm việc; nói ngắn gọn và có văn bản xác nhận sẽ an toàn hơn.'],
    },
    'Tài lộc': {
      tot: ['Tài lộc {ky} khả quan, có thể có khoản thu ngoài dự kiến hoặc được trả công xứng đáng.',
        'Buôn bán, thu hồi công nợ thuận hơn thường lệ. Vẫn nên để dành một phần.',
        'Cơ hội kiếm thêm đến từ các mối quen biết; đừng ngại mở lời.'],
      binh: ['Tài chính {ky} cân bằng, thu chi vừa đủ. Hạn chế mua sắm theo cảm hứng.',
        'Tiền bạc không có biến động đáng kể; thích hợp rà lại các khoản chi cố định.',
        'Nên giữ tiền dự phòng, chưa phải lúc đầu tư mạo hiểm.'],
      xau: ['Tài lộc {ky} dễ hao hụt vì những khoản chi bất ngờ. Tránh cho vay hay đứng ra bảo lãnh.',
        'Không nên đầu tư theo lời rủ rê hoặc mua món lớn vội vàng.',
        'Cẩn thận khi giao dịch trên mạng, giữ kỹ ví và giấy tờ khi ra ngoài.'],
    },
    'Tình cảm': {
      tot: ['Tình cảm {ky} ấm áp, dễ thông cảm với người thân. Người độc thân có cơ hội gặp người hợp ý.',
        'Một lời hỏi han hay một bữa cơm chung sẽ giúp các mối quan hệ gắn bó hơn.',
        'Không khí gia đình vui vẻ; thích hợp gặp gỡ bạn bè, họ hàng.'],
      binh: ['Chuyện tình cảm {ky} êm ả. Dành thời gian lắng nghe sẽ tốt hơn tranh luận đúng sai.',
        'Các mối quan hệ ổn định; đừng để công việc chiếm hết thời gian dành cho người thân.',
        'Người độc thân nên mở rộng giao lưu nhưng chưa cần vội quyết định.'],
      xau: ['Tình cảm {ky} dễ có hiểu lầm vì chuyện nhỏ. Giữ bình tĩnh, tránh lời nói nặng.',
        'Nên nhường nhịn trong gia đình; chuyện chưa rõ thì để lúc khác nói.',
        'Hạn chế xen vào chuyện riêng của người khác để tránh thị phi.'],
    },
    'Sức khỏe': {
      tot: ['Sức khỏe {ky} tốt, tinh thần minh mẫn. Thích hợp bắt đầu thói quen tập luyện mới.',
        'Năng lượng dồi dào; chỉ cần giữ giấc ngủ đều là đủ.',
        'Cơ thể và tâm trạng đều thoải mái, dễ hồi phục sau mệt mỏi.'],
      binh: ['Sức khỏe {ky} bình thường. Chú ý ăn uống điều độ, uống đủ nước.',
        'Dễ mệt nếu làm việc quá sức; nên xen kẽ những quãng nghỉ ngắn.',
        'Không có vấn đề lớn, nhưng nên vận động nhẹ mỗi ngày.'],
      xau: ['Sức khỏe {ky} cần để ý hơn: dễ căng thẳng, mất ngủ hoặc đau mỏi. Nghỉ ngơi hợp lý.',
        'Cẩn thận khi tham gia giao thông và khi dùng dao kéo, điện, nước nóng.',
        'Hạn chế rượu bia, thức khuya; có dấu hiệu bất thường thì nên đi khám.'],
    },
  };
  const KHUYEN = {
    tot: ['Tận dụng {ky} để làm những việc quan trọng bạn đã dự định.', 'Chủ động gặp gỡ, kết nối; người quanh bạn đang sẵn lòng giúp đỡ.', 'Ghi lại những cơ hội vừa đến và lên kế hoạch theo đuổi.'],
    binh: ['Giữ nhịp đều đặn, làm chắc từng việc nhỏ.', 'Ưu tiên việc cần thiết, gác lại những việc có thể chờ.', 'Một chút kiên nhẫn sẽ giúp mọi việc trôi chảy hơn.'],
    xau: ['Chậm lại một nhịp, suy nghĩ kỹ trước khi quyết định.', 'Tránh tranh cãi và những cuộc vui quá đà.', 'Làm việc thiện, giữ tâm an là cách hóa giải nhẹ nhàng nhất.'],
  };
  const NHAN = ['', 'Không thuận', 'Cần thận trọng', 'Bình thường', 'Tốt', 'Rất tốt'];
  const mucTu = d => d >= 3 ? 5 : d === 2 ? 4 : d >= 0 ? 3 : d === -1 ? 2 : 1;
  const giong = muc => muc >= 4 ? 'tot' : muc === 3 ? 'binh' : 'xau';
  const viet = (s, ky) => s.replace('{ky}', ky);
  function noiDung(muc, ky, seed, t) {
    const g = giong(muc);
    const muc4 = Object.entries(VAN).map(([ten, v], i) => ({ ten, text: viet(v[g][(seed + i * 7 + t * 5) % 3], ky) }));
    return { muc: muc4, loiKhuyen: viet(KHUYEN[g][(seed + t) % 3], ky) };
  }

  // ---------- Ngày ----------
  const fmt = ([d, m, y]) => `${d}/${m}/${y}`;
  function thongTinNgay(jd) {
    const duong = TuVi.jdToDate(jd), am = TuVi.solar2lunar(...duong);
    const chiNgay = (jd + 1) % 12 + 1, canNgay = (jd + 9) % 10 + 1, chiThang = (am[1] + 1) % 12 + 1;
    const th = than(chiThang, chiNgay);
    return { jd, duong, am, chiNgay, canNgay, thu: THU[(jd + 1) % 7], than: THAN[th], hoangDao: !!TOT[th] };
  }
  function diemNgay(n, t) {
    const qh = quanHe(n.chiNgay, t);
    return { qh, diem: qh.reduce((s, q) => s + q.diem, 0) + (n.hoangDao ? 1 : 0) };
  }
  const nhanNgay = n => `${n.thu} ${fmt(n.duong)}`;
  const amLich = am => `${am[0]}/${am[1]}${am[3] ? ' nhuận' : ''} âm lịch`;

  function tuViNgay(t, jd) {
    const n = thongTinNgay(jd), { qh, diem } = diemNgay(n, t), muc = mucTu(diem);
    return Object.assign({
      ky: 'ngay', tieuDe: `Tử vi tuổi ${CHI[t]} ngày ${fmt(n.duong)}`,
      phu: `${n.thu}, ${amLich(n.am)} · ngày ${CAN[n.canNgay]} ${CHI[n.chiNgay]}`,
      diem: muc, nhan: NHAN[muc],
      dong: [moTaQuanHe('Ngày', n.chiNgay, t, qh),
        `Đây là ngày ${n.than} ${n.hoangDao ? 'hoàng đạo, thuận cho việc lớn' : 'hắc đạo, nên tránh khởi sự việc lớn'}.`],
      gioTot: gioHoangDao(n.chiNgay).map(h => `${CHI[h]} (${GIO[h]})`),
    }, noiDung(muc, 'hôm nay', jd, t), mayMan(t));
  }

  // ---------- Tuần (Thứ Hai đến Chủ nhật) ----------
  function tuViTuan(t, jd) {
    const dau = jd - ((jd + 1) % 7 + 6) % 7;
    const ngay = [...Array(7).keys()].map(i => {
      const n = thongTinNgay(dau + i), { diem } = diemNgay(n, t);
      return { thu: n.thu, duong: fmt(n.duong), am: `${n.am[0]}/${n.am[1]}`, canChi: `${CAN[n.canNgay]} ${CHI[n.chiNgay]}`, than: n.than, hoangDao: n.hoangDao, diem: mucTu(diem), hienTai: dau + i === jd };
    });
    const tb = Math.round(ngay.reduce((s, x) => s + x.diem, 0) / 7);
    const cao = Math.max(...ngay.map(x => x.diem)), thap = Math.min(...ngay.map(x => x.diem));
    const ds = list => list.map(x => `${x.thu} (${x.duong})`).join(', ');
    const dong = [`Ngày thuận nhất: ${ds(ngay.filter(x => x.diem === cao))}.`];
    if (thap <= 2) dong.push(`Ngày nên thận trọng: ${ds(ngay.filter(x => x.diem === thap))}.`);
    return Object.assign({
      ky: 'tuan', tieuDe: `Tử vi tuổi ${CHI[t]} tuần ${ngay[0].duong} – ${ngay[6].duong}`,
      phu: 'Mức độ từng ngày tính theo quan hệ giữa chi ngày với tuổi và ngày hoàng đạo.',
      diem: tb, nhan: NHAN[tb], dong, tuan: ngay,
    }, noiDung(tb, 'tuần này', Math.floor(dau / 7), t), mayMan(t));
  }

  // ---------- Tháng âm lịch ----------
  function tuViThang(t, jd) {
    const am = TuVi.solar2lunar(...TuVi.jdToDate(jd));
    const dauThang = TuVi.jdFromDate(...TuVi.lunar2solar(1, am[1], am[2], am[3]));
    const soNgay = TuVi.solar2lunar(...TuVi.jdToDate(dauThang + 29))[0] === 30 ? 30 : 29;
    const chiThang = (am[1] + 1) % 12 + 1, canThang = (am[2] * 12 + am[1] + 3) % 10 + 1;
    const qh = quanHe(chiThang, t);
    const ngay = [...Array(soNgay).keys()].map(i => { const n = thongTinNgay(dauThang + i); return { n, muc: mucTu(diemNgay(n, t).diem) }; });
    const tot = ngay.filter(x => x.muc >= 4).length, xau = ngay.filter(x => x.muc <= 2).length;
    const muc = mucTu(qh.reduce((s, q) => s + q.diem, 0) + (tot > xau ? 1 : tot < xau ? -1 : 0));
    const ds = list => list.slice(0, 4).map(x => `${x.n.am[0]}/${x.n.am[1]} âm (${x.n.duong[0]}/${x.n.duong[1]} dương)`).join(', ');
    const dep = ngay.filter(x => x.muc === 5).length ? ngay.filter(x => x.muc === 5) : ngay.filter(x => x.muc === 4);
    const dong = [moTaQuanHe('Tháng', chiThang, t, qh),
      `Trong tháng có ${tot} ngày thuận và ${xau} ngày nên thận trọng với tuổi ${CHI[t]}.`];
    if (dep.length) dong.push(`Ngày đẹp: ${ds(dep)}.`);
    const xauNhat = ngay.filter(x => x.muc === 1);
    if (xauNhat.length) dong.push(`Ngày nên tránh việc lớn: ${ds(xauNhat)}.`);
    return Object.assign({
      ky: 'thang', tieuDe: `Tử vi tuổi ${CHI[t]} tháng ${am[1]}${am[3] ? ' nhuận' : ''} âm lịch năm ${CAN[(am[2] + 6) % 10 + 1]} ${CHI[(am[2] + 8) % 12 + 1]}`,
      phu: `Tháng ${CAN[canThang]} ${CHI[chiThang]}, từ ${fmt(TuVi.jdToDate(dauThang))} đến ${fmt(TuVi.jdToDate(dauThang + soNgay - 1))} dương lịch`,
      diem: muc, nhan: NHAN[muc], dong,
    }, noiDung(muc, 'tháng này', am[2] * 13 + am[1], t), mayMan(t));
  }

  // ---------- Năm âm lịch ----------
  const TAM_TAI = { 1: [3, 4, 5], 5: [3, 4, 5], 9: [3, 4, 5], 3: [9, 10, 11], 7: [9, 10, 11], 11: [9, 10, 11], 2: [12, 1, 2], 6: [12, 1, 2], 10: [12, 1, 2], 4: [6, 7, 8], 8: [6, 7, 8], 12: [6, 7, 8] };
  const CUU_DIEU = {
    nam: ['La Hầu', 'Thổ Tú', 'Thủy Diệu', 'Thái Bạch', 'Thái Dương', 'Vân Hớn', 'Kế Đô', 'Thái Âm', 'Mộc Đức'],
    nu: ['Kế Đô', 'Vân Hớn', 'Mộc Đức', 'Thái Âm', 'Thổ Tú', 'La Hầu', 'Thái Dương', 'Thái Bạch', 'Thủy Diệu'],
  };
  const SAO_Y = {
    'La Hầu': [-1, 'sao xấu, dễ gặp thị phi, chuyện pháp lý, nam giới chịu ảnh hưởng nhiều hơn'],
    'Kế Đô': [-1, 'sao xấu, dễ buồn phiền, hao tổn, nữ giới chịu ảnh hưởng nhiều hơn'],
    'Thái Bạch': [-1, 'sao xấu, dễ hao tài, nên giữ tiền bạc cẩn thận'],
    'Thổ Tú': [-1, 'sao xấu vừa, dễ gặp tiểu nhân và chuyện không vui trong nhà'],
    'Vân Hớn': [-1, 'sao xấu vừa, dễ nóng nảy, va chạm, kiện tụng nhỏ'],
    'Thủy Diệu': [1, 'sao tốt về tài lộc, nhưng nên giữ lời ăn tiếng nói'],
    'Thái Dương': [1, 'sao tốt, nhiều may mắn và sự thăng tiến, nam giới hưởng nhiều hơn'],
    'Thái Âm': [1, 'sao tốt, thuận về tình cảm và tài lộc, nữ giới hưởng nhiều hơn'],
    'Mộc Đức': [1, 'sao tốt, thuận cho hôn nhân, sức khỏe và công việc'],
  };

  /** opts tùy chọn: { namSinh, gioiTinh: 'nam' | 'nu' } để xem sao chiếu mệnh */
  function tuViNam(t, jd, opts) {
    const y = TuVi.solar2lunar(...TuVi.jdToDate(jd))[2];
    const chiNam = (y + 8) % 12 + 1, canChi = `${CAN[(y + 6) % 10 + 1]} ${CHI[chiNam]}`;
    const qh = quanHe(chiNam, t);
    let diem = qh.reduce((s, q) => s + q.diem, 0);
    const dong = [];
    if (chiNam === t) dong.push(`Năm ${canChi} là năm tuổi của người tuổi ${CHI[t]}, dân gian gọi là phạm Thái Tuế: dễ có thay đổi lớn về công việc, chỗ ở hoặc các mối quan hệ, làm gì cũng nên chắc chắn.`);
    if (chiNam === t) diem -= 1;
    if (chiNam !== t || qh.length) dong.push(moTaQuanHe(`Năm ${CAN[(y + 6) % 10 + 1]}`, chiNam, t, qh));
    const tt = TAM_TAI[t].indexOf(chiNam);
    if (tt >= 0) { diem -= 1; dong.push(`Tuổi ${CHI[t]} gặp Tam tai năm thứ ${tt + 1}/3 (các năm ${TAM_TAI[t].map(c => CHI[c]).join(', ')}): nên cẩn trọng việc lớn, giữ sức khỏe.`); }
    let sao = null;
    if (opts && opts.namSinh) {
      const tuoi = y - opts.namSinh + 1;
      if (tuoi >= 1 && (opts.namSinh + 8) % 12 + 1 === t) {
        const ten = CUU_DIEU[opts.gioiTinh === 'nu' ? 'nu' : 'nam'][(tuoi - 1) % 9];
        sao = { ten, tuoi, y: SAO_Y[ten][1] };
        diem += SAO_Y[ten][0];
        dong.push(`${opts.gioiTinh === 'nu' ? 'Nữ' : 'Nam'} sinh năm ${opts.namSinh}, ${tuoi} tuổi âm: sao chiếu mệnh là ${ten}, ${SAO_Y[ten][1]}.`);
      }
    }
    const muc = mucTu(diem);
    return Object.assign({
      ky: 'nam', tieuDe: `Tử vi tuổi ${CHI[t]} năm ${canChi} ${y}`,
      phu: `Tính theo năm âm lịch ${y}, quan hệ giữa tuổi với Thái Tuế ${CHI[chiNam]}, Tam tai${sao ? ' và sao chiếu mệnh' : ''}.`,
      diem: muc, nhan: NHAN[muc], dong, sao,
    }, noiDung(muc, 'năm nay', y, t), mayMan(t));
  }

  const conGiap = t => ({ chi: CHI[t], con: CON[t], han: HAN[t], hanh: HANH[t] });
  const ConGiap = { tuViNgay, tuViTuan, tuViThang, tuViNam, quanHe, gioHoangDao, thongTinNgay, conGiap, CON, GIO, THU, THAN, TOT };
  if (typeof module !== 'undefined' && module.exports) module.exports = ConGiap; else root.ConGiap = ConGiap;
})(typeof window !== 'undefined' ? window : globalThis);
