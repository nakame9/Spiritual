/* Luận giải cung hoàng đạo: xác định cung, tử vi ngày/tuần/tháng/năm theo vị trí thật của các hành tinh so với từng cung,
 * độ tương hợp, bản đồ sao và Big Three. Cần thien-van.js và cung-hoang-dao.js. Dùng chung cho trình duyệt và backend. */
(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const TV = node ? require('./thien-van.js') : root.ThienVan;
  const HD = node ? require('./cung-hoang-dao.js') : root.HoangDao;
  const { CUNG, NGUYEN_TO, TINH_CHAT, HANH_TINH, NHA } = HD;
  const VN = 'Asia/Ho_Chi_Minh';
  const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const hai = n => String(n).padStart(2, '0');
  const ngayVN = t => { const x = TV.ngayTai(t, VN); return { ...x, chu: `${hai(x.d)}/${hai(x.m)}/${x.y}`, gio: `${hai(x.h)}:${hai(x.mi)}`, ngan: `${hai(x.d)}/${hai(x.m)}` }; };
  const giuaTrua = (y, m, d) => TV.sangUTC(y, m, d, 12, 0, VN);
  const nha = (cungSao, goc) => (cungSao - goc + 12) % 12; // 0 = nhà 1
  // Băm FNV-1a để chọn câu cố định theo ngày và cung (ai xem cũng thấy giống nhau)
  const bam = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const chon = (ds, khoa) => ds[bam(khoa) % ds.length];

  // ---------- 1. Xác định cung Mặt Trời ----------
  /** Theo bảng ngày phổ biến (tháng 1–12, ngày) */
  function cungTheoBang(m, d) {
    return CUNG.find(c => { const [tm, td] = c.tu, [dm, dd] = c.den; return (m === tm && d >= td) || (m === dm && d <= dd); });
  }
  /** Theo vị trí thật của Mặt Trời. Không có giờ sinh mà rơi đúng ngày Mặt Trời đổi cung thì trả về cả lúc giao cung. */
  function xacDinhCung({ y, m, d, h, mi, tz = VN }) {
    if (h !== undefined && h !== null) {
      const t = TV.sangUTC(y, m, d, h, mi || 0, tz), lon = TV.kinhDo('matTroi', t);
      return { cung: CUNG[TV.cungCua(lon)], doTrongCung: TV.chuan(lon) % 30, theoBang: cungTheoBang(m, d), coGio: true };
    }
    const dau = TV.sangUTC(y, m, d, 0, 0, tz), cuoi = TV.sangUTC(y, m, d, 23, 59, tz);
    const ca = TV.cungCua(TV.kinhDo('matTroi', dau)), cb = TV.cungCua(TV.kinhDo('matTroi', cuoi));
    const kq = { cung: CUNG[TV.cungCua(TV.kinhDo('matTroi', TV.sangUTC(y, m, d, 12, 0, tz)))], theoBang: cungTheoBang(m, d), coGio: false };
    if (ca !== cb) {
      const g = TV.timGiaoCung('matTroi', dau, cuoi, 0.25)[0], x = TV.ngayTai(g.t, tz);
      kq.giaoCung = { truoc: CUNG[ca], sau: CUNG[cb], luc: `${hai(x.h)}:${hai(x.mi)}` };
    }
    return kq;
  }

  // ---------- Điểm cho tử vi theo cung ----------
  // Góc giữa cung hành tinh đang đi qua và cung của bạn (theo số cung cách nhau)
  const GOC_CUNG = { 0: ['hop', 1], 1: ['lech', 0], 2: ['lucHop', 1], 3: ['vuong', -1.5], 4: ['tamHop', 2], 5: ['lech', -0.5], 6: ['xung', -1] };
  const gocCung = (a, b) => GOC_CUNG[Math.min((a - b + 12) % 12, (b - a + 12) % 12)];
  // Điểm nền theo nhà Mặt Trăng đi qua (nhà 1 → 12) cho từng lĩnh vực
  const NEN = {
    tinhYeu: [1, 0, 1, 0, 2, -1, 2, 1, 1, 0, 1, -1],
    congViec: [1, 1, 1, -1, 0, 2, 0, 0, 1, 2, 1, -1],
    taiChinh: [0, 2, 0, 0, -1, 1, 0, 1, 0, 1, 2, -1],
    sucKhoe: [2, 0, 0, 1, 1, 1, 0, -1, 1, -1, 1, -1],
  };
  const LINH_VUC = { tinhYeu: 'Tình yêu', congViec: 'Công việc', taiChinh: 'Tài chính', sucKhoe: 'Sức khỏe' };
  const sao = raw => Math.max(1, Math.min(5, Math.round(2.58 + raw * 0.55))); // cân sao quanh mức 3: khoảng 11, 22, 35, 22, 10%
  const muc = s => s >= 4 ? 'cao' : s <= 2 ? 'thap' : 'vua';

  const LOI_NGAY = {
    tinhYeu: {
      cao: ['Tình cảm thuận lợi: lời nói của bạn dễ chạm tới trái tim người khác. Người độc thân có thể gặp ai đó thú vị.', 'Không khí ngọt ngào, hợp để hẹn hò hoặc bày tỏ tình cảm. Các cặp đôi dễ hiểu nhau hơn thường ngày.', 'Sức hút của bạn đang lên. Một cử chỉ quan tâm nhỏ cũng đủ làm người ấy vui cả ngày.'],
      vua: ['Tình cảm bình ổn. Dành chút thời gian trò chuyện để giữ sự gắn kết.', 'Không có biến động lớn trong chuyện tình cảm; sự quan tâm đều đặn quan trọng hơn lời hứa lớn.', 'Mọi chuyện ở mức dễ chịu. Người độc thân nên mở lòng ở những nơi quen thuộc.'],
      thap: ['Cảm xúc dễ nhạy cảm, tránh suy diễn lời nói của người ấy. Hãy hỏi thẳng thay vì đoán.', 'Có thể có chút hiểu lầm nhỏ. Kiên nhẫn và nói nhẹ nhàng sẽ giúp mọi việc êm xuôi.', 'Bạn cần không gian riêng nhiều hơn. Đừng ép mình phải vui vẻ, và cũng đừng ép người khác.'],
    },
    congViec: {
      cao: ['Công việc trôi chảy, bạn dễ được ghi nhận. Hãy đưa ra ý tưởng bạn đã ấp ủ.', 'Năng suất cao, hợp để giải quyết việc khó hoặc bắt đầu dự án mới.', 'Bạn làm việc hiệu quả và được người khác hỗ trợ. Cơ hội tốt để thể hiện năng lực.'],
      vua: ['Công việc ổn định. Làm từng việc một, đừng ôm đồm quá nhiều.', 'Ngày làm việc bình thường; chú ý chi tiết sẽ giúp bạn tránh phải làm lại.', 'Mọi việc tiến triển đều. Hợp để sắp xếp, lên kế hoạch hơn là đột phá.'],
      thap: ['Dễ gặp trục trặc nhỏ hoặc chậm trễ. Kiểm tra kỹ trước khi gửi đi bất cứ thứ gì.', 'Không khí làm việc có thể căng thẳng. Giữ bình tĩnh và tránh tranh cãi không cần thiết.', 'Năng lượng hơi thấp, hãy ưu tiên việc quan trọng và hoãn quyết định lớn nếu được.'],
    },
    taiChinh: {
      cao: ['Tài chính khả quan, có thể có khoản thu bất ngờ hoặc cơ hội kiếm thêm.', 'Hợp để lên kế hoạch tài chính, bàn chuyện tiền bạc hay thương lượng giá.', 'Bạn có con mắt tốt với những món đáng giá; đầu tư cho bản thân lúc này là hợp lý.'],
      vua: ['Tài chính ổn định. Chi tiêu theo kế hoạch là đủ.', 'Không có biến động lớn về tiền bạc; hợp để tiết kiệm một khoản nhỏ.', 'Thu chi cân bằng. Cân nhắc trước những món mua theo cảm hứng.'],
      thap: ['Dễ chi tiêu theo cảm xúc, hãy đợi một ngày trước khi mua món lớn.', 'Không nên cho vay hay ký kết tài chính vội vàng.', 'Có thể phát sinh khoản chi ngoài dự kiến. Giữ một khoản dự phòng.'],
    },
    sucKhoe: {
      cao: ['Năng lượng dồi dào, hợp để vận động và thử thói quen lành mạnh mới.', 'Tinh thần sảng khoái. Một buổi đi bộ hay tập thể dục sẽ giúp bạn còn khỏe hơn.', 'Cơ thể và tâm trí hài hòa, ngủ ngon và làm việc hiệu quả.'],
      vua: ['Sức khỏe ổn. Uống đủ nước và nghỉ ngơi đúng giờ.', 'Không có gì đáng lo, nhưng đừng ngồi một chỗ quá lâu.', 'Thể trạng bình thường. Ăn uống điều độ là đủ.'],
      thap: ['Dễ mệt mỏi hoặc căng thẳng, hãy nghỉ ngơi nhiều hơn.', 'Cẩn thận với việc ăn uống thất thường và thức khuya.', 'Tinh thần dễ dao động. Hít thở sâu, đi bộ nhẹ hoặc ngủ sớm sẽ giúp bạn.'],
    },
  };
  const LOI_KY = {
    tinhYeu: { cao: 'Tình cảm {ky} khá thuận lợi: dễ gặp gỡ, dễ bày tỏ và được đáp lại.', vua: 'Tình cảm {ky} bình ổn; sự quan tâm đều đặn giữ cho mọi thứ ấm áp.', thap: 'Tình cảm {ky} cần nhiều kiên nhẫn hơn; tránh suy diễn và nói chuyện thẳng thắn với nhau.' },
    congViec: { cao: 'Công việc {ky} có nhiều tiến triển, hợp để đẩy mạnh dự án và thể hiện năng lực.', vua: 'Công việc {ky} đều đặn; làm chắc từng việc sẽ hiệu quả hơn ôm đồm.', thap: 'Công việc {ky} có thể chậm hoặc vướng thủ tục; kiểm tra kỹ và giữ bình tĩnh.' },
    taiChinh: { cao: 'Tài chính {ky} khả quan, có cơ hội tăng thu nhập hoặc mua được món đáng giá.', vua: 'Tài chính {ky} ổn định; chi tiêu theo kế hoạch là đủ.', thap: 'Tài chính {ky} cần thận trọng, hạn chế chi tiêu theo cảm hứng và vay mượn.' },
    sucKhoe: { cao: 'Sức khỏe {ky} tốt, năng lượng dồi dào; hợp để xây dựng thói quen lành mạnh.', vua: 'Sức khỏe {ky} ổn định; ngủ đủ và vận động nhẹ là đủ.', thap: 'Sức khỏe {ky} dễ mệt mỏi, căng thẳng; ưu tiên nghỉ ngơi và đừng ôm quá sức.' },
  };
  const CHU_DE_NGAY = [
    'Mặt Trăng đi qua cung của bạn: cảm xúc dâng cao, bạn dễ được chú ý và có động lực chăm sóc bản thân.',
    'Mặt Trăng ở nhà Tiền bạc: chú ý thu chi, tài sản và những gì bạn thật sự coi trọng.',
    'Mặt Trăng ở nhà Giao tiếp: ngày của tin nhắn, cuộc gọi, học hỏi và những chuyến đi ngắn.',
    'Mặt Trăng ở nhà Gia đình: bạn muốn ở gần người thân, chăm chút nhà cửa hoặc nghỉ ngơi.',
    'Mặt Trăng ở nhà Tình yêu và sáng tạo: ngày vui vẻ, hợp để hẹn hò, giải trí và sáng tạo.',
    'Mặt Trăng ở nhà Công việc hằng ngày: tập trung vào việc cần làm, sức khỏe và thói quen.',
    'Mặt Trăng ở nhà Quan hệ đôi lứa: người khác giữ vai trò quan trọng, hợp để hợp tác và lắng nghe.',
    'Mặt Trăng ở nhà Chuyển hóa: cảm xúc sâu hơn, hợp để giải quyết chuyện tài chính chung hoặc buông bỏ điều cũ.',
    'Mặt Trăng ở nhà Mở rộng: tâm trí hướng về điều mới, học hỏi, du lịch hoặc tìm ý nghĩa.',
    'Mặt Trăng ở nhà Sự nghiệp: công việc và hình ảnh của bạn được chú ý, hợp để thể hiện năng lực.',
    'Mặt Trăng ở nhà Bạn bè: ngày hợp để gặp gỡ nhóm bạn, kết nối và nghĩ về ước mơ.',
    'Mặt Trăng ở nhà Nội tâm: năng lượng chậm lại, hợp để nghỉ ngơi, suy ngẫm và hoàn tất việc cũ.',
  ];
  const CHU_DE_THANG = [
    'Mặt Trời đi qua cung của bạn: mùa sinh nhật, thời điểm tỏa sáng và đặt mục tiêu mới cho năm cá nhân.',
    'Mặt Trời ở nhà Tiền bạc: tập trung vào thu nhập, tài sản và sự tự tin vào giá trị của mình.',
    'Mặt Trời ở nhà Giao tiếp: bận rộn với học hỏi, trao đổi, giấy tờ và những chuyến đi ngắn.',
    'Mặt Trời ở nhà Gia đình: hướng về tổ ấm, người thân và nền tảng tinh thần của bạn.',
    'Mặt Trời ở nhà Tình yêu và sáng tạo: vui vẻ cho hẹn hò, giải trí, con cái và các dự án sáng tạo.',
    'Mặt Trời ở nhà Công việc hằng ngày: tập trung vào hiệu suất, sắp xếp lại nhịp sống và sức khỏe.',
    'Mặt Trời ở nhà Quan hệ đôi lứa: các mối quan hệ một-một và hợp tác được chú ý nhiều nhất.',
    'Mặt Trời ở nhà Chuyển hóa: nhìn sâu vào tài chính chung, sự thân mật và những điều cần thay đổi.',
    'Mặt Trời ở nhà Mở rộng: hợp để học tập, đi xa và mở rộng tầm nhìn.',
    'Mặt Trời ở nhà Sự nghiệp: công việc và danh tiếng lên cao điểm, hợp để khẳng định vị trí.',
    'Mặt Trời ở nhà Bạn bè: thời gian của kết nối, cộng đồng và những kế hoạch cho tương lai.',
    'Mặt Trời ở nhà Nội tâm: thời gian lắng lại, nghỉ ngơi và chuẩn bị cho chu kỳ mới.',
  ];
  const MOC_NHA = [
    'Sao Mộc đi qua cung của bạn: thời kỳ của sự tự tin, cơ hội cá nhân và những khởi đầu lớn.',
    'Sao Mộc ở nhà Tiền bạc: thu nhập có cơ hội tăng, hợp để xây dựng tài sản và tin vào giá trị bản thân.',
    'Sao Mộc ở nhà Giao tiếp: thuận lợi cho học tập, viết lách, mạng lưới quan hệ và đi lại.',
    'Sao Mộc ở nhà Gia đình: may mắn đến từ gia đình, nhà cửa; hợp để chuyển nhà hay mở rộng tổ ấm.',
    'Sao Mộc ở nhà Tình yêu và sáng tạo: vui vẻ cho tình yêu, con cái và tài năng sáng tạo.',
    'Sao Mộc ở nhà Công việc hằng ngày: công việc nhiều cơ hội, môi trường làm việc cải thiện, sức khỏe được chăm chút hơn.',
    'Sao Mộc ở nhà Quan hệ đôi lứa: thuận lợi cho hôn nhân, hợp tác và gặp được người hỗ trợ.',
    'Sao Mộc ở nhà Chuyển hóa: có thể nhận hỗ trợ tài chính hoặc trải qua chuyển biến nội tâm tích cực.',
    'Sao Mộc ở nhà Mở rộng: thời điểm tuyệt vời để học cao, đi xa, xuất bản hay mở rộng tầm nhìn.',
    'Sao Mộc ở nhà Sự nghiệp: cơ hội thăng tiến, được công nhận và nâng cao vị thế.',
    'Sao Mộc ở nhà Bạn bè: quý nhân và bạn bè mang lại cơ hội; ước mơ dễ thành hiện thực hơn.',
    'Sao Mộc ở nhà Nội tâm: thời kỳ của chữa lành, đời sống tinh thần và chuẩn bị âm thầm cho chu kỳ mới.',
  ];
  const THO_NHA = [
    'Sao Thổ đi qua cung của bạn: thời kỳ trưởng thành, trách nhiệm cá nhân tăng nhưng giúp bạn vững vàng hơn.',
    'Sao Thổ ở nhà Tiền bạc: cần kỷ luật tài chính, tiết kiệm và xây dựng thu nhập bền vững.',
    'Sao Thổ ở nhà Giao tiếp: học hỏi nghiêm túc, cẩn trọng lời nói và giấy tờ.',
    'Sao Thổ ở nhà Gia đình: trách nhiệm với gia đình, nhà cửa nhiều hơn; hợp để củng cố nền móng.',
    'Sao Thổ ở nhà Tình yêu và sáng tạo: tình cảm cần sự nghiêm túc; sáng tạo đòi hỏi rèn luyện bền bỉ.',
    'Sao Thổ ở nhà Công việc hằng ngày: khối lượng công việc lớn, cần kỷ luật và chăm sóc sức khỏe đều đặn.',
    'Sao Thổ ở nhà Quan hệ đôi lứa: các mối quan hệ được thử thách; cam kết nghiêm túc sẽ bền lâu.',
    'Sao Thổ ở nhà Chuyển hóa: thận trọng với nợ nần, tài chính chung; đối diện những nỗi sợ sâu kín.',
    'Sao Thổ ở nhà Mở rộng: học tập nghiêm túc, xem lại niềm tin và triết lý sống.',
    'Sao Thổ ở nhà Sự nghiệp: áp lực công việc lớn nhưng là lúc gặt hái nếu bạn đã chuẩn bị kỹ.',
    'Sao Thổ ở nhà Bạn bè: chọn lọc bạn bè, xác định lại mục tiêu dài hạn.',
    'Sao Thổ ở nhà Nội tâm: khép lại chu kỳ cũ, nghỉ ngơi và buông bỏ những gì không còn phù hợp.',
  ];
  const MAU = { lua: ['đỏ', 'cam'], dat: ['nâu', 'xanh rêu'], khi: ['vàng nhạt', 'xanh da trời'], nuoc: ['xanh biển', 'bạc'] };
  const THUY_NGHICH = 'Sao Thủy đang nghịch hành: dễ trục trặc giao tiếp, máy móc, giấy tờ. Đọc kỹ trước khi ký; hợp để xem lại việc cũ hơn là bắt đầu việc mới.';
  const tenNha = n => `nhà ${n + 1} (${NHA[n].ten})`;

  /** Điểm một ngày cho cung s (0–11): Mặt Trăng, Sao Kim, Sao Hỏa, Sao Mộc lúc 12 giờ trưa giờ Việt Nam */
  function diemNgay(s, y, m, d) {
    const t = giuaTrua(y, m, d), v = TV.viTriCacSao(t), n = nha(v.matTrang.cung, s), g = x => gocCung(v[x].cung, s)[1];
    const raw = {
      tinhYeu: NEN.tinhYeu[n] + g('matTrang') + g('kim'),
      congViec: NEN.congViec[n] + g('matTrang') + g('hoa') - (v.thuy.nghich ? 1 : 0),
      taiChinh: NEN.taiChinh[n] + g('matTrang') + (g('kim') + g('moc')) / 2,
      sucKhoe: NEN.sucKhoe[n] + g('matTrang') + g('hoa'),
    };
    const diem = Object.fromEntries(Object.entries(raw).map(([k, r]) => [k, sao(r)]));
    return { t, v, n, diem, tong: Object.values(diem).reduce((a, b) => a + b, 0) / 4 };
  }

  // ---------- 3. Tử vi hằng ngày ----------
  function tuViNgay(s, y, m, d) {
    const c = CUNG[s], { t, v, n, diem, tong } = diemNgay(s, y, m, d), khoa = `${y}-${m}-${d}|${s}`;
    const dau = TV.sangUTC(y, m, d, 0, 0, VN), cuoi = TV.sangUTC(y, m, d, 23, 59, VN);
    const doi = TV.timGiaoCung('matTrang', dau, cuoi, 0.25)[0];
    const mt = CUNG[v.matTrang.cung];
    return {
      loai: 'ngay', cung: c.id, tenCung: c.ten, ngay: `${hai(d)}/${hai(m)}/${y}`, thu: THU[new Date(Date.UTC(y, m - 1, d)).getUTCDay()],
      matTrang: { cung: mt.ten, nha: n + 1, doiCung: doi ? { luc: ngayVN(doi.t).gio, cung: CUNG[doi.cung].ten, nha: nha(doi.cung, s) + 1 } : null },
      chuDe: CHU_DE_NGAY[n],
      linhVuc: Object.keys(LINH_VUC).map(k => ({ ma: k, ten: LINH_VUC[k], sao: diem[k], loi: chon(LOI_NGAY[k][muc(diem[k])], khoa + k) })),
      tong: Math.round(tong * 10) / 10,
      nenLam: NHA[n].nenLam,
      mau: chon(MAU[mt.nguyenTo], khoa + 'mau'),
      luuY: v.thuy.nghich ? THUY_NGHICH : null,
    };
  }

  const ngayCong = (y, m, d, k) => { const x = new Date(Date.UTC(y, m - 1, d + k)); return [x.getUTCFullYear(), x.getUTCMonth() + 1, x.getUTCDate()]; };
  const trungBinh = ds => Object.fromEntries(Object.keys(LINH_VUC).map(k => [k, Math.round(ds.reduce((a, x) => a + x.diem[k], 0) / ds.length)]));
  function boiCanh(s, v) {
    const goc = gocCung(v.hoa.cung, s)[0];
    return {
      tinhYeu: `Sao Kim ở ${tenNha(nha(v.kim.cung, s))} của bạn, nên niềm vui và sự gắn kết đến nhiều từ chuyện ${NHA[nha(v.kim.cung, s)].linhVuc}.`,
      congViec: `Sao Hỏa ở ${tenNha(nha(v.hoa.cung, s))}: bạn dồn sức cho chuyện ${NHA[nha(v.hoa.cung, s)].linhVuc}.`,
      taiChinh: `Sao Mộc ở ${tenNha(nha(v.moc.cung, s))}: cơ hội mở rộng nằm ở chuyện ${NHA[nha(v.moc.cung, s)].linhVuc}.`,
      sucKhoe: goc === 'vuong' || goc === 'xung' ? 'Sao Hỏa đang tạo góc căng với cung của bạn: dễ nóng nảy, nên vận động vừa phải để xả bớt năng lượng.'
        : goc === 'tamHop' || goc === 'lucHop' || goc === 'hop' ? 'Sao Hỏa đang hỗ trợ cung của bạn, thể lực và sự quyết tâm đều tốt.' : 'Giữ nhịp sinh hoạt đều đặn là chìa khóa.',
    };
  }
  const linhVucKy = (diem, bc, ky) => Object.keys(LINH_VUC).map(k => ({ ma: k, ten: LINH_VUC[k], sao: diem[k], loi: `${LOI_KY[k][muc(diem[k])].replace('{ky}', ky)} ${bc[k]}` }));
  const nghichTrong = (t0, t1) => ['thuy', 'kim', 'hoa'].flatMap(ma => TV.timNghichHanh(ma, t0, t1).map(x => ({ sao: HANH_TINH[ma].ten, tu: ngayVN(x.batDau).chu, den: x.ketThuc ? ngayVN(x.ketThuc).chu : null })));

  // ---------- 4. Tử vi tuần, tháng, năm ----------
  function tuViTuan(s, y, m, d) {
    const c = CUNG[s], dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(), [y0, m0, d0] = ngayCong(y, m, d, -((dow + 6) % 7));
    const ngay = Array.from({ length: 7 }, (_, i) => { const [a, b, e] = ngayCong(y0, m0, d0, i); return Object.assign(diemNgay(s, a, b, e), { y: a, m: b, d: e }); });
    const giua = ngay[3].v, diem = trungBinh(ngay), xep = [...ngay].sort((a, b) => b.tong - a.tong);
    const ten = x => `${THU[new Date(Date.UTC(x.y, x.m - 1, x.d)).getUTCDay()]} ${hai(x.d)}/${hai(x.m)}`;
    const t0 = TV.sangUTC(y0, m0, d0, 0, 0, VN), t1 = new Date(+t0 + 7 * 864e5);
    return {
      loai: 'tuan', cung: c.id, tenCung: c.ten, tu: `${hai(d0)}/${hai(m0)}/${y0}`, den: (() => { const [a, b, e] = ngayCong(y0, m0, d0, 6); return `${hai(e)}/${hai(b)}/${a}`; })(),
      chuDe: CHU_DE_THANG[nha(giua.matTroi.cung, s)],
      linhVuc: linhVucKy(diem, boiCanh(s, giua), 'tuần này'),
      ngayTot: xep.slice(0, 2).map(x => ({ ngay: ten(x), ly: CHU_DE_NGAY[x.n] })),
      ngayCham: xep.slice(-1).map(x => ({ ngay: ten(x), ly: CHU_DE_NGAY[x.n] })),
      trangDiQua: TV.timGiaoCung('matTrang', t0, t1).map(x => ({ ngay: ngayVN(x.t).ngan, gio: ngayVN(x.t).gio, cung: CUNG[x.cung].ten, nha: nha(x.cung, s) + 1 })),
      nghichHanh: nghichTrong(t0, t1),
    };
  }

  function tuViThang(s, y, m) {
    const c = CUNG[s], soNgay = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const ngay = Array.from({ length: soNgay }, (_, i) => Object.assign(diemNgay(s, y, m, i + 1), { y, m, d: i + 1 }));
    const t0 = TV.sangUTC(y, m, 1, 0, 0, VN), t1 = TV.sangUTC(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, 1, 0, 0, VN);
    const xep = [...ngay].sort((a, b) => b.tong - a.tong);
    const mtDau = ngay[0].v.matTroi.cung, giao = TV.timGiaoCung('matTroi', t0, t1);
    const chuDe = [{ tu: `01/${hai(m)}`, nha: nha(mtDau, s) + 1, loi: CHU_DE_THANG[nha(mtDau, s)] }]
      .concat(giao.map(g => ({ tu: ngayVN(g.t).ngan, nha: nha(g.cung, s) + 1, loi: CHU_DE_THANG[nha(g.cung, s)] })));
    return {
      loai: 'thang', cung: c.id, tenCung: c.ten, thang: `${hai(m)}/${y}`, chuDe,
      linhVuc: linhVucKy(trungBinh(ngay), boiCanh(s, ngay[Math.floor(soNgay / 2)].v), 'tháng này'),
      tuanTrang: TV.timTuanTrang(t0, t1).map(x => { const cc = TV.cungCua(x.lon), n = nha(cc, s);
        return { loai: x.loai, ngay: ngayVN(x.t).chu, gio: ngayVN(x.t).gio, cung: CUNG[cc].ten, nha: n + 1,
          loi: x.loai === 'non' ? `Trăng non ở ${CUNG[cc].ten}, ${tenNha(n)} của bạn: thời điểm tốt để bắt đầu chuyện ${NHA[n].linhVuc}.`
            : `Trăng tròn ở ${CUNG[cc].ten}, ${tenNha(n)} của bạn: chuyện ${NHA[n].linhVuc} đi tới cao điểm, cảm xúc dễ dâng cao.` }; }),
      giaoCung: ['thuy', 'kim', 'hoa'].flatMap(ma => TV.timGiaoCung(ma, t0, t1).map(g => ({ sao: HANH_TINH[ma].ten, ngay: ngayVN(g.t).chu, cung: CUNG[g.cung].ten, nha: nha(g.cung, s) + 1 })))
        .sort((a, b) => a.ngay.split('/').reverse().join('').localeCompare(b.ngay.split('/').reverse().join(''))),
      nghichHanh: nghichTrong(t0, t1),
      ngayTot: xep.slice(0, 3).map(x => `${hai(x.d)}/${hai(x.m)}`).sort(),
      ngayCham: xep.slice(-2).map(x => `${hai(x.d)}/${hai(x.m)}`).sort(),
    };
  }

  // Nhà nào quan trọng cho lĩnh vực nào (dùng cho tử vi năm)
  const NHA_LV = { tinhYeu: [4, 6, 0, 10], congViec: [9, 5, 1, 0], taiChinh: [1, 7, 10, 9], sucKhoe: [0, 5, 11] };
  function tuViNam(s, y) {
    const c = CUNG[s], t0 = TV.sangUTC(y, 1, 1, 0, 0, VN), t1 = TV.sangUTC(y + 1, 1, 1, 0, 0, VN);
    const giaiDoan = ma => { const ds = TV.timGiaoCung(ma, t0, t1, 2), ra = [];
      let cc = TV.cungCua(TV.kinhDo(ma, t0)), tu = '01/01';
      ds.forEach(g => { ra.push({ tu, den: ngayVN(new Date(+g.t - 864e5)).ngan, cung: CUNG[cc].ten, nha: nha(cc, s) + 1, loi: (ma === 'moc' ? MOC_NHA : THO_NHA)[nha(cc, s)] }); cc = g.cung; tu = ngayVN(g.t).ngan; });
      ra.push({ tu, den: '31/12', cung: CUNG[cc].ten, nha: nha(cc, s) + 1, loi: (ma === 'moc' ? MOC_NHA : THO_NHA)[nha(cc, s)] });
      return ra; };
    const moc = giaiDoan('moc'), tho = giaiDoan('tho');
    const nhaMoc = new Set(moc.map(x => x.nha - 1)), nhaTho = new Set(tho.map(x => x.nha - 1));
    const diem = Object.fromEntries(Object.entries(NHA_LV).map(([k, ds]) => [k, Math.max(1, Math.min(5, 3 + ds.filter(n => nhaMoc.has(n)).length * (k === 'sucKhoe' ? 1 : 2) - ds.filter(n => nhaTho.has(n)).length
      + (gocCung(TV.cungCua(TV.kinhDo('moc', TV.sangUTC(y, 7, 1, 0, 0, VN))), s)[1] > 0 ? 1 : 0)))]));
    const bc = Object.fromEntries(Object.entries(NHA_LV).map(([k, ds]) => {
      const m = moc.filter(x => ds.includes(x.nha - 1)), t = tho.filter(x => ds.includes(x.nha - 1));
      return [k, [m.length ? `Từ ${m[0].tu} đến ${m[0].den}, Sao Mộc ở ${tenNha(m[0].nha - 1)} mở ra cơ hội cho chuyện này.` : '',
        t.length ? `Từ ${t[0].tu} đến ${t[0].den}, Sao Thổ ở ${tenNha(t[0].nha - 1)} đòi hỏi bạn kiên nhẫn và nghiêm túc hơn.` : ''].join(' ').trim()];
    }));
    return {
      loai: 'nam', cung: c.id, tenCung: c.ten, nam: y, moc, tho,
      linhVuc: linhVucKy(diem, bc, 'năm nay').map(x => Object.assign(x, { loi: x.loi.trim() })),
      thuc: TV.timThuc(t0, t1).map(x => { const cc = TV.cungCua(x.lon), n = nha(cc, s);
        return { loai: x.loai === 'nhat' ? 'Nhật thực' : 'Nguyệt thực', kieu: { total: 'toàn phần', annular: 'hình khuyên', partial: 'một phần', penumbral: 'nửa tối', hybrid: 'lai' }[x.kieu] || x.kieu,
          ngay: ngayVN(x.t).chu, cung: CUNG[cc].ten, nha: n + 1, loi: `điểm chuyển quan trọng trong chuyện ${NHA[n].linhVuc}` }; }),
      nghichHanh: TV.timNghichHanh('thuy', t0, t1).map(x => ({ sao: 'Sao Thủy', tu: ngayVN(x.batDau).chu, den: x.ketThuc ? ngayVN(x.ketThuc).chu : null })),
    };
  }

  // ---------- 6, 7. Độ tương hợp ----------
  const THU_TU_NT = ['lua', 'dat', 'khi', 'nuoc'];
  const CAP_NT = {
    'lua-lua': ['Hai ngọn lửa gặp nhau tạo nên tình yêu sôi nổi, đam mê và nhiều phiêu lưu; cần nhường nhịn để không tranh phần thắng.', 'Bộ đôi năng động, luôn có kế hoạch vui chơi và thử thách mới.', 'Cùng nhiệt huyết và dám nghĩ dám làm, nhưng dễ va chạm khi cả hai đều muốn dẫn dắt.'],
    'lua-dat': ['Lửa muốn đi nhanh, Đất muốn đi chắc. Mối quan hệ cần sự kiên nhẫn: Lửa mang cảm hứng, Đất mang sự ổn định.', 'Hai người khác nhịp sống nhưng có thể bổ sung: một người khởi xướng, một người giữ chân trên mặt đất.', 'Kết hợp tốt nếu phân vai rõ: Lửa mở đường, Đất hoàn thiện và giữ tiến độ.'],
    'lua-khi': ['Khí thổi bùng ngọn lửa: hai người cuốn hút nhau, nhiều niềm vui, ý tưởng và tiếng cười.', 'Bạn bè lý tưởng, cùng thích khám phá, trò chuyện và mở rộng các mối quan hệ.', 'Ý tưởng của Khí gặp sức hành động của Lửa, rất hợp cho các dự án sáng tạo và khởi nghiệp.'],
    'lua-nuoc': ['Lửa và Nước đều mãnh liệt nhưng theo cách khác nhau: một bên bộc trực, một bên nhạy cảm. Cần nhiều thấu hiểu để không làm tổn thương nhau.', 'Có thể học hỏi nhau nhiều: Lửa giúp Nước can đảm hơn, Nước giúp Lửa tinh tế hơn.', 'Cần tôn trọng nhịp làm việc của nhau: Lửa muốn nhanh, Nước cần cảm nhận và cân nhắc.'],
    'dat-dat': ['Hai người cùng coi trọng sự ổn định và cam kết; tình yêu bền vững nhưng cần thêm chút lãng mạn để không nhàm chán.', 'Tình bạn đáng tin, giúp đỡ nhau bằng những việc thiết thực.', 'Cặp làm việc chắc chắn, có kế hoạch và đáng tin; cẩn thận kẻo cả hai cùng ngại đổi mới.'],
    'dat-khi': ['Đất thực tế, Khí bay bổng. Hai người nhìn cuộc sống khác nhau nên cần học cách trân trọng sự khác biệt.', 'Có những cuộc trò chuyện thú vị, nhưng đôi khi khó hiểu cách nghĩ của nhau.', 'Khí nhiều ý tưởng, Đất biết biến ý tưởng thành thực tế; hợp tác tốt nếu biết lắng nghe nhau.'],
    'dat-nuoc': ['Nước nuôi dưỡng Đất: một mối quan hệ dịu dàng, an toàn và gắn bó sâu sắc.', 'Bạn bè tri kỷ, luôn có mặt khi người kia cần.', 'Đất mang sự ổn định, Nước mang trực giác và sự quan tâm con người; hợp tác hài hòa và bền lâu.'],
    'khi-khi': ['Hai tâm hồn trí tuệ gặp nhau: tình yêu như tình bạn, nhiều trò chuyện và tự do, nhưng cần thêm chiều sâu cảm xúc.', 'Rất hợp nhau, không bao giờ hết chuyện để nói.', 'Nhiều ý tưởng và giao tiếp tốt, nhưng cần ai đó lo phần thực thi.'],
    'khi-nuoc': ['Khí sống bằng lý trí, Nước sống bằng cảm xúc. Có sức hút ban đầu nhưng cần nỗ lực để hiểu ngôn ngữ của nhau.', 'Có thể bổ sung cho nhau: Khí giúp Nước nhìn khách quan, Nước giúp Khí cảm nhận sâu hơn.', 'Hợp tác được nếu Khí kiên nhẫn với cảm xúc của Nước và Nước nói rõ điều mình cần.'],
    'nuoc-nuoc': ['Hai tâm hồn nhạy cảm thấu hiểu nhau không cần lời; tình yêu sâu sắc nhưng dễ cùng chìm trong cảm xúc.', 'Tình bạn gắn bó, chia sẻ và che chở cho nhau.', 'Hiểu ý nhau, làm việc bằng trực giác; cần thêm kỷ luật và ranh giới rõ ràng.'],
  };
  const KHOANG = [
    ['Cùng một cung', 'Hai người hiểu nhau như soi gương, nhưng cũng dễ thấy khuyết điểm của chính mình ở người kia.', 75],
    ['Hai cung liền kề (30°)', 'Khác nguyên tố nên cần thời gian làm quen, nhưng có thể học hỏi nhau rất nhiều.', 58],
    ['Lục hợp (60°)', 'Dễ chịu, hỗ trợ nhau và có nhiều điểm chung để cùng phát triển.', 82],
    ['Vuông góc (90°)', 'Khác nhịp và dễ va chạm, nhưng chính sự cọ xát giúp cả hai trưởng thành.', 52],
    ['Tam hợp (120°)', 'Cùng nguyên tố, hòa hợp tự nhiên và hiểu nhau dễ dàng.', 90],
    ['Lệch nhau (150°)', 'Ít điểm chung, cần nhiều điều chỉnh để bắt nhịp với nhau.', 48],
    ['Xung đối (180°)', 'Hút nhau mạnh mẽ như hai mặt của một đồng xu, bổ sung cho nhau nếu biết cân bằng.', 72],
  ];
  const thuong = x => x.charAt(0).toLowerCase() + x.slice(1);
  const NHAN_XET = d => d >= 85 ? 'Rất hợp' : d >= 72 ? 'Hợp' : d >= 58 ? 'Khá hợp, cần vun đắp' : 'Nhiều thử thách';
  function tuongHop(a, b) {
    const A = CUNG[a], B = CUNG[b], k = Math.min((a - b + 12) % 12, (b - a + 12) % 12);
    const [n1, n2] = [A.nguyenTo, B.nguyenTo].sort((x, y) => THU_TU_NT.indexOf(x) - THU_TU_NT.indexOf(y)), cap = `${n1}-${n2}`;
    const [ten, moTa, nen] = KHOANG[k];
    const tinhYeu = nen + ({ 'lua-khi': 6, 'dat-nuoc': 6, 'lua-nuoc': -6, 'dat-khi': -6, 'lua-dat': -3, 'khi-nuoc': -3 }[cap] || 0);
    const banBe = nen + (k === 3 ? 8 : k === 6 ? 3 : k === 0 ? 6 : 0) + ([A, B].filter(x => x.nguyenTo === 'khi').length * 3);
    const tc = [A.tinhChat, B.tinhChat].sort().join('-');
    const congViec = nen + [A, B].filter(x => x.nguyenTo === 'dat').length * 3 + ({ 'tienPhong-tienPhong': -6, 'kienDinh-kienDinh': -4, 'linhHoat-linhHoat': -2, 'linhHoat-tienPhong': 4, 'kienDinh-tienPhong': 2, 'kienDinh-linhHoat': 2 }[tc] || 0);
    const kep = x => Math.max(35, Math.min(97, x));
    const diem = { tinhYeu: kep(tinhYeu), banBe: kep(banBe), congViec: kep(congViec) };
    const [lyTY, lyBB, lyCV] = CAP_NT[cap];
    return {
      a: A.id, b: B.id, tenA: A.ten, tenB: B.ten, khoang: { ten, moTa },
      diem: Object.assign(diem, { tong: Math.round((diem.tinhYeu + diem.banBe + diem.congViec) / 3) }),
      mat: [
        { ma: 'tinhYeu', ten: 'Tình yêu', diem: diem.tinhYeu, nhan: NHAN_XET(diem.tinhYeu), loi: lyTY },
        { ma: 'banBe', ten: 'Tình bạn', diem: diem.banBe, nhan: NHAN_XET(diem.banBe), loi: lyBB },
        { ma: 'congViec', ten: 'Công việc', diem: diem.congViec, nhan: NHAN_XET(diem.congViec), loi: lyCV },
      ],
      tinhYeuA: A.tinhYeu, tinhYeuB: B.tinhYeu,
      loiKhuyen: a === b ? `Lời khuyên cho hai ${A.ten}: ${thuong(A.tinhYeu.luuY)}`
        : `Lời khuyên cho ${A.ten}: ${thuong(A.tinhYeu.luuY)} Còn với ${B.ten}: ${thuong(B.tinhYeu.luuY)}`,
    };
  }

  // ---------- 9, 10. Bản đồ sao và Big Three ----------
  const NGAN = { matTroi: 'bản ngã', matTrang: 'cảm xúc', thuy: 'tư duy', kim: 'tình cảm', hoa: 'hành động', moc: 'may mắn', tho: 'trách nhiệm', thienVuong: 'sự đổi mới', haiVuong: 'trí tưởng tượng', diemVuong: 'sự chuyển hóa' };
  const GOC = { hop: ['hợp', 'hòa làm một và khuếch đại lẫn nhau'], lucHop: ['lục hợp', 'hỗ trợ nhẹ nhàng, mở ra cơ hội khi bạn chủ động'], tamHop: ['tam hợp', 'chảy trôi hài hòa, là tài năng tự nhiên của bạn'],
    vuong: ['vuông', 'tạo căng thẳng thúc đẩy bạn hành động và trưởng thành'], xung: ['xung đối', 'kéo về hai phía, cần tìm điểm cân bằng'] };
  const hop = (x, y) => x === y || [x, y].sort().join() === 'khi,lua' || [x, y].sort().join() === 'dat,nuoc';

  function banDoSao({ y, m, d, h, mi, coGio = true, tz = VN, viDo, kinhDo }) {
    const t = TV.sangUTC(y, m, d, coGio ? h : 12, coGio ? (mi || 0) : 0, tz), v = TV.viTriCacSao(t);
    const tr = coGio && viDo !== undefined && kinhDo !== undefined ? TV.truc(t, viDo, kinhDo) : null;
    const cungMoc = tr ? TV.cungCua(tr.asc) : null;
    const lech = TV.doLech(tz, +t);
    const out = {
      thoiDiem: { utc: t.toISOString(), lech: `UTC${lech >= 0 ? '+' : '-'}${Math.floor(Math.abs(lech) / 60)}${Math.abs(lech) % 60 ? ':' + hai(Math.abs(lech) % 60) : ''}` },
      coGio, cungMoc: tr ? { lon: tr.asc, cung: CUNG[cungMoc].id, tenCung: CUNG[cungMoc].ten, doTrongCung: tr.asc % 30 } : null,
      thienDinh: tr ? { lon: tr.mc, cung: CUNG[TV.cungCua(tr.mc)].id, tenCung: CUNG[TV.cungCua(tr.mc)].ten, doTrongCung: tr.mc % 30 } : null,
      sao: Object.entries(v).map(([ma, p]) => ({ ma, ten: HANH_TINH[ma].ten, kyHieu: HANH_TINH[ma].kyHieu, lon: p.lon, cung: CUNG[p.cung].id, tenCung: CUNG[p.cung].ten,
        doTrongCung: p.doTrongCung, nghich: p.nghich, nha: tr ? nha(p.cung, cungMoc) + 1 : null,
        loi: `${HANH_TINH[ma].ten} ở ${CUNG[p.cung].ten}: ${HANH_TINH[ma].linhVuc} mang màu sắc ${CUNG[p.cung].phongCach}.`
          + (tr ? ` Nằm ở nhà ${nha(p.cung, cungMoc) + 1}, nó thể hiện rõ nhất trong chuyện ${NHA[nha(p.cung, cungMoc)].linhVuc}.` : '')
          + (p.nghich ? ' Hành tinh này nghịch hành lúc bạn sinh ra, nên năng lượng của nó hướng vào bên trong nhiều hơn.' : '') })),
    };
    // Không có giờ sinh: Mặt Trăng (và hiếm khi Mặt Trời) có thể đổi cung trong ngày
    if (!coGio) {
      const dau = TV.sangUTC(y, m, d, 0, 0, tz), cuoi = TV.sangUTC(y, m, d, 23, 59, tz);
      for (const ma of ['matTroi', 'matTrang']) {
        const ca = TV.cungCua(TV.kinhDo(ma, dau)), cb = TV.cungCua(TV.kinhDo(ma, cuoi));
        if (ca !== cb) out.sao.find(x => x.ma === ma).chuaChac = [CUNG[ca].ten, CUNG[cb].ten];
      }
    }
    // Góc chiếu chính (bỏ cặp hai hành tinh thế hệ vì kéo dài nhiều năm)
    const ds = out.sao;
    out.gocChieu = [];
    for (let i = 0; i < ds.length; i++) for (let j = i + 1; j < ds.length; j++) {
      const p = ds[i], q = ds[j];
      if (HANH_TINH[p.ma].theHe && HANH_TINH[q.ma].theHe) continue;
      if (!coGio && (p.ma === 'matTrang' || q.ma === 'matTrang')) continue; // chưa biết giờ thì vị trí Mặt Trăng lệch tới ±6°
      const g = TV.gocChieu(p.lon, q.lon, /matTroi|matTrang/.test(p.ma + q.ma));
      if (g) out.gocChieu.push({ a: p.ma, b: q.ma, loai: g.ma, sai: Math.round(g.sai * 10) / 10,
        loi: `${p.ten} ${GOC[g.ma][0]} ${q.ten}: ${NGAN[p.ma]} và ${NGAN[q.ma]} ${GOC[g.ma][1]}.` });
    }
    out.gocChieu.sort((x, z) => x.sai - z.sai);
    // Cân bằng nguyên tố và tính chất: 7 hành tinh cá nhân, Mặt Trời, Mặt Trăng, cung Mọc tính 2
    const nt = { lua: 0, dat: 0, khi: 0, nuoc: 0 }, tc = { tienPhong: 0, kienDinh: 0, linhHoat: 0 };
    const cong = (cs, w) => { nt[CUNG[cs].nguyenTo] += w; tc[CUNG[cs].tinhChat] += w; };
    ['matTroi', 'matTrang', 'thuy', 'kim', 'hoa', 'moc', 'tho'].forEach(ma => cong(v[ma].cung, ma === 'matTroi' || ma === 'matTrang' ? 2 : 1));
    if (tr) cong(cungMoc, 2);
    const tongNT = Object.values(nt).reduce((a, b) => a + b, 0);
    const ntTroi = Object.entries(nt).sort((a, b) => b[1] - a[1])[0][0], tcTroi = Object.entries(tc).sort((a, b) => b[1] - a[1])[0][0];
    out.canBang = { nguyenTo: nt, tinhChat: tc,
      loi: [NGUYEN_TO[ntTroi].troi, TINH_CHAT[tcTroi].troi].concat(Object.entries(nt).filter(([, x]) => x / tongNT < 0.1).map(([k]) => NGUYEN_TO[k].thieu)) };
    out.bigThree = bigThree(v.matTroi.cung, v.matTrang.cung, cungMoc, out.sao.find(x => x.ma === 'matTrang').chuaChac);
    return out;
  }

  function bigThree(sS, sM, sR, moonChuaChac) {
    const S = CUNG[sS], M = CUNG[sM], R = sR === null ? null : CUNG[sR];
    const out = {
      matTroi: { cung: S.id, tenCung: S.ten, loi: `Mặt Trời ở ${S.ten} là cốt lõi con người bạn: ${S.phongCach}. ${S.tongQuan.split('. ').slice(1, 3).join('. ').replace(/\.?$/, '.')}` },
      matTrang: { cung: M.id, tenCung: M.ten, loi: M.matTrang, chuaChac: moonChuaChac || null },
      cungMoc: R ? { cung: R.id, tenCung: R.ten, loi: R.cungMoc } : null,
    };
    const ntS = S.nguyenTo, ntM = M.nguyenTo, nt = s => NGUYEN_TO[s].ten;
    const ket = [hop(ntS, ntM) ? `Mặt Trời ${nt(ntS)} và Mặt Trăng ${nt(ntM)} hòa hợp: điều bạn muốn và điều bạn cần để thấy bình yên thường đi cùng hướng.`
      : `Mặt Trời ${nt(ntS)} và Mặt Trăng ${nt(ntM)} khác nhịp: đôi khi điều bạn muốn và điều bạn cần để thấy an toàn kéo về hai phía; nhận ra điều này giúp bạn bớt mâu thuẫn trong lòng.`];
    if (R) {
      const ntR = R.nguyenTo;
      ket.unshift(ntS === ntM && ntM === ntR ? `Cả ba đều thuộc nguyên tố ${nt(ntS)}: con người bạn rất nhất quán, chất ${NGUYEN_TO[ntS].moTa} thể hiện rõ cả bên trong lẫn bên ngoài.`
        : `Người khác lần đầu gặp sẽ thấy bạn ${R.phongCach} (cung Mọc ${R.ten}); sâu bên trong bạn ${S.phongCach} (Mặt Trời ${S.ten}); còn trong cảm xúc, bạn ${M.phongCach} (Mặt Trăng ${M.ten}).`);
      if (ntR !== ntS && ntR !== ntM) ket.push(`Cung Mọc khác hẳn nguyên tố với Mặt Trời và Mặt Trăng, nên ấn tượng đầu tiên về bạn có thể khác xa con người thật; người thân lâu mới thấy hết các lớp của bạn.`);
    }
    out.ketHop = ket;
    return out;
  }

  const LuanGiai = { VN, THU, LINH_VUC, cungTheoBang, xacDinhCung, diemNgay, tuViNgay, tuViTuan, tuViThang, tuViNam, tuongHop, banDoSao, bigThree };
  if (node) module.exports = LuanGiai; else root.LuanGiai = LuanGiai;
})(typeof window !== 'undefined' ? window : globalThis);
