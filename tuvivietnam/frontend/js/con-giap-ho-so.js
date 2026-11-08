/* Hồ sơ 12 con giáp: tính cách, các khía cạnh cuộc sống, năm sinh với thiên can và nạp âm,
 * nét riêng theo từng năm sinh, và tra tuổi hợp, tuổi xung theo từng mục đích.
 * Nội dung tự biên soạn theo quan niệm dân gian; dùng chung cho trình duyệt và backend. */
(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const TuVi = node ? require('./tuvi.js') : root.TuVi;
  const ConGiap = node ? require('./congiap.js') : root.ConGiap;
  const { CAN, CHI } = TuVi;
  const MA = ['', 'ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']; // đường dẫn #ty … #hoi

  // ---------- Tính cách và các khía cạnh cuộc sống ----------
  const TINH_CACH = {
    1: { tom: 'Chuột đứng đầu 12 con giáp: lanh lợi, nhạy bén, biết thu vén và luôn tìm ra lối đi trong hoàn cảnh khó.',
      manh: 'Thông minh, nhanh nhạy, giỏi xoay xở và nắm bắt cơ hội; chăm chỉ, biết tích lũy.',
      han: 'Hay lo xa, dễ tính toán quá mức; đôi khi thiếu kiên nhẫn với việc dài hơi.',
      giaoTiep: 'Hoạt bát, khéo ăn nói, dễ làm quen; quan sát người khác rất nhanh.',
      lamViec: 'Tháo vát, linh hoạt, giỏi tìm cách làm nhanh hơn; hợp việc cần ứng biến.',
      tinhCam: 'Chung tình, chu đáo với người mình yêu nhưng ngại bày tỏ cảm xúc sâu kín.',
      suNghiep: 'Hợp kinh doanh, buôn bán, tài chính, nghiên cứu thị trường, công việc cần óc phân tích.',
      taiChinh: 'Giỏi giữ tiền và tìm nguồn thu; nên tránh đầu tư theo cảm giác nhất thời.',
      tinhDuyen: 'Tình duyên đến từ những mối quen biết lâu; hợp người điềm tĩnh, biết lắng nghe.',
      giaDinh: 'Coi trọng gia đình, hay lo cho người thân về vật chất; là chỗ dựa thực tế trong nhà.',
      xaHoi: 'Quan hệ rộng, biết dùng người; nên giữ chữ tín để mối quan hệ bền lâu.' },
    2: { tom: 'Trâu tượng trưng cho sự cần cù, bền bỉ và đáng tin: chậm mà chắc, làm đến nơi đến chốn.',
      manh: 'Kiên nhẫn, chăm chỉ, có trách nhiệm; giữ lời hứa và làm việc rất có phương pháp.',
      han: 'Bảo thủ, chậm thay đổi; khi đã giận thì khó nguôi.',
      giaoTiep: 'Ít nói, thẳng thắn, không thích vòng vo; lời nói có trọng lượng.',
      lamViec: 'Bền bỉ, tỉ mỉ, chịu được áp lực; hợp việc cần sự ổn định và chính xác.',
      tinhCam: 'Chậm mở lòng nhưng đã yêu thì sâu sắc, chung thủy, thể hiện bằng việc làm hơn lời nói.',
      suNghiep: 'Hợp nông nghiệp, kỹ thuật, xây dựng, kế toán, quản lý vận hành, nghề cần tay nghề vững.',
      taiChinh: 'Tích lũy đều đặn, ít khi phung phí; tài sản lớn dần theo thời gian.',
      tinhDuyen: 'Tình duyên thường đến muộn nhưng bền; hợp người vui vẻ, biết làm mềm sự nghiêm túc của mình.',
      giaDinh: 'Trụ cột vững vàng, lo toan chu đáo; đôi khi quá nghiêm khắc với con cái.',
      xaHoi: 'Ít bạn nhưng bạn thân lâu năm; được tin cậy vì đáng tin.' },
    3: { tom: 'Hổ là chúa sơn lâm: mạnh mẽ, can đảm, có khí chất lãnh đạo và tinh thần bảo vệ người yếu.',
      manh: 'Dũng cảm, quyết đoán, giàu nhiệt huyết; dám nghĩ dám làm, có sức hút tự nhiên.',
      han: 'Nóng nảy, bốc đồng, không thích bị ràng buộc; dễ hành động trước khi suy nghĩ kỹ.',
      giaoTiep: 'Thẳng thắn, tự tin, nói là làm; không ngại bảo vệ lẽ phải.',
      lamViec: 'Hợp vai trò dẫn dắt, khởi xướng; làm tốt khi được tự chủ.',
      tinhCam: 'Nồng nhiệt, chủ động, hết lòng; cần không gian riêng và sự tôn trọng.',
      suNghiep: 'Hợp quản lý, khởi nghiệp, quân đội, công an, thể thao, những việc cần sự can đảm.',
      taiChinh: 'Kiếm tiền nhanh nhưng tiêu cũng mạnh tay; nên có kế hoạch dự phòng.',
      tinhDuyen: 'Tình duyên sôi nổi; hợp người mềm mỏng, biết nhường nhịn và cổ vũ mình.',
      giaDinh: 'Che chở người thân hết mực; nên học cách lắng nghe hơn là ra lệnh.',
      xaHoi: 'Được nể phục, nhiều người theo; dễ có đối thủ vì tính thẳng.' },
    4: { tom: 'Mèo (theo 12 con giáp Việt Nam) tượng trưng cho sự tinh tế, mềm mỏng và may mắn: khéo léo, hòa nhã, yêu cái đẹp.',
      manh: 'Tinh tế, lịch sự, khéo léo; có óc thẩm mỹ và trực giác tốt.',
      han: 'Ngại va chạm, dễ né tránh vấn đề; đôi khi thiếu quyết đoán.',
      giaoTiep: 'Nhẹ nhàng, biết nói lời dễ nghe; giỏi giữ hòa khí.',
      lamViec: 'Cẩn thận, chu đáo, làm việc có thẩm mỹ; hợp môi trường yên ổn.',
      tinhCam: 'Lãng mạn, chu đáo, cần cảm giác an toàn; tránh xa những mối quan hệ nhiều sóng gió.',
      suNghiep: 'Hợp thiết kế, nghệ thuật, ngoại giao, tư vấn, chăm sóc khách hàng, y dược.',
      taiChinh: 'Chi tiêu có chừng mực, biết hưởng thụ; tài chính ổn định nếu tránh mua sắm theo cảm xúc.',
      tinhDuyen: 'Dễ được yêu mến; hợp người chín chắn, bao dung.',
      giaDinh: 'Giữ không khí gia đình êm ấm, chăm chút tổ ấm.',
      xaHoi: 'Được nhiều người quý; nên mạnh dạn nói "không" khi cần.' },
    5: { tom: 'Rồng là biểu tượng của quyền uy và thịnh vượng: tự tin, có hoài bão lớn và nhiều năng lượng.',
      manh: 'Tự tin, tham vọng, nhiều ý tưởng lớn; có uy và khả năng truyền cảm hứng.',
      han: 'Kiêu hãnh, cầu toàn, khó chấp nhận ý kiến trái chiều.',
      giaoTiep: 'Nói có sức thuyết phục, thích làm trung tâm; đôi khi hơi áp đặt.',
      lamViec: 'Hợp dự án lớn, vai trò lãnh đạo; làm việc với tầm nhìn xa.',
      tinhCam: 'Nồng nhiệt, hào phóng; cần người hiểu và ngưỡng mộ mình.',
      suNghiep: 'Hợp quản lý, chính trị, kinh doanh lớn, luật, truyền thông, nghệ thuật biểu diễn.',
      taiChinh: 'Có tài kiếm tiền, dễ gặp thời; nên tránh mạo hiểm quá tay vì tự tin.',
      tinhDuyen: 'Nhiều người để ý; hợp người khéo léo, biết khen và biết góp ý nhẹ nhàng.',
      giaDinh: 'Muốn gia đình được tự hào về mình; nên dành thời gian thực sự cho người thân.',
      xaHoi: 'Quan hệ rộng, có sức ảnh hưởng; được tôn trọng khi biết khiêm tốn.' },
    6: { tom: 'Rắn tượng trưng cho trí tuệ và sự sâu sắc: điềm tĩnh, kín đáo, nhìn xa trông rộng.',
      manh: 'Thông minh, sâu sắc, điềm tĩnh; giỏi phân tích và có trực giác nhạy.',
      han: 'Đa nghi, kín đáo quá mức; dễ ôm hận khi bị tổn thương.',
      giaoTiep: 'Nói ít mà chắc, chọn lời cẩn thận; thích trò chuyện có chiều sâu.',
      lamViec: 'Có chiến lược, kiên định với mục tiêu; hợp việc cần suy tính dài hạn.',
      tinhCam: 'Sâu sắc, chung thủy nhưng hay ghen; cần sự minh bạch từ người kia.',
      suNghiep: 'Hợp nghiên cứu, tài chính, tâm lý, luật, y khoa, công việc phân tích chuyên sâu.',
      taiChinh: 'Quản lý tiền khéo, có duyên với đầu tư dài hạn.',
      tinhDuyen: 'Có sức hút bí ẩn; hợp người chân thành, rõ ràng.',
      giaDinh: 'Chăm lo gia đình kỹ lưỡng; ít thể hiện nhưng rất quan tâm.',
      xaHoi: 'Chọn bạn kỹ, giữ khoảng cách với người mới quen; bạn thân thì rất trung thành.' },
    7: { tom: 'Ngựa tượng trưng cho tự do và sức sống: năng động, phóng khoáng, thích khám phá.',
      manh: 'Nhanh nhẹn, nhiệt tình, lạc quan; giao tiếp tốt và không ngại thử thách.',
      han: 'Thiếu kiên nhẫn, dễ chán; ngại ràng buộc và hay thay đổi.',
      giaoTiep: 'Cởi mở, vui vẻ, nói chuyện cuốn hút; dễ hòa vào đám đông.',
      lamViec: 'Làm nhanh, giỏi khởi động; cần môi trường năng động và có mục tiêu rõ.',
      tinhCam: 'Yêu say đắm, sôi nổi; cần người cho mình tự do và cùng chia sẻ sở thích.',
      suNghiep: 'Hợp bán hàng, du lịch, truyền thông, vận tải, thể thao, nghề hay di chuyển.',
      taiChinh: 'Tiền vào nhanh ra nhanh; nên tập thói quen tiết kiệm cố định.',
      tinhDuyen: 'Tình duyên nhiều màu sắc; hợp người điềm đạm, biết giữ nhịp cho mình.',
      giaDinh: 'Mang lại không khí vui vẻ; đôi khi ít ở nhà vì bận rộn bên ngoài.',
      xaHoi: 'Bạn bè đông, được yêu mến vì sự thẳng thắn và nhiệt tình.' },
    8: { tom: 'Dê tượng trưng cho sự hiền hòa và tâm hồn nghệ sĩ: nhân hậu, giàu cảm xúc, yêu cái đẹp.',
      manh: 'Hiền lành, tốt bụng, sáng tạo; biết cảm thông và kiên nhẫn.',
      han: 'Nhạy cảm, dễ lo âu; thiếu quyết đoán và hay phụ thuộc người khác.',
      giaoTiep: 'Mềm mỏng, dễ gần, biết lắng nghe; ngại tranh luận gay gắt.',
      lamViec: 'Cẩn thận, có óc thẩm mỹ; làm tốt khi được hướng dẫn rõ và môi trường hòa hợp.',
      tinhCam: 'Lãng mạn, dịu dàng, cần được che chở và quan tâm thường xuyên.',
      suNghiep: 'Hợp nghệ thuật, thiết kế, giáo dục, chăm sóc sức khỏe, ẩm thực, công tác xã hội.',
      taiChinh: 'Tài chính ổn khi có người cùng quản lý; tránh chi tiêu theo cảm xúc.',
      tinhDuyen: 'Hợp người mạnh mẽ, chín chắn, biết che chở.',
      giaDinh: 'Gắn bó gia đình, hiếu thảo; là người hòa giải trong nhà.',
      xaHoi: 'Được quý vì tính hiền hòa; nên chọn bạn tốt vì dễ bị ảnh hưởng.' },
    9: { tom: 'Khỉ tượng trưng cho trí thông minh và sự hoạt bát: lanh lợi, hài hước, nhiều sáng kiến.',
      manh: 'Thông minh, nhanh trí, linh hoạt; giỏi giải quyết vấn đề và học hỏi nhanh.',
      han: 'Thiếu kiên trì, dễ chủ quan; đôi khi tinh nghịch quá mức.',
      giaoTiep: 'Hài hước, lém lỉnh, khéo thuyết phục; làm không khí vui lên.',
      lamViec: 'Sáng tạo, nhiều mẹo hay; hợp việc đa dạng, thay đổi.',
      tinhCam: 'Vui vẻ, nhiệt tình; cần người đủ thông minh để theo kịp mình.',
      suNghiep: 'Hợp công nghệ, kinh doanh, marketing, giải trí, kỹ thuật, nghề cần ứng biến.',
      taiChinh: 'Kiếm tiền khéo nhưng dễ tiêu vào thú vui; nên có mục tiêu tiết kiệm rõ.',
      tinhDuyen: 'Dễ làm quen; hợp người chín chắn, có chiều sâu.',
      giaDinh: 'Mang tiếng cười cho gia đình; cần thêm sự kiên nhẫn với việc nhà.',
      xaHoi: 'Giao thiệp rộng, được nhiều người thích; nên giữ lời để được tin.' },
    10: { tom: 'Gà tượng trưng cho sự chăm chỉ và đúng giờ: chỉn chu, thẳng thắn, có tinh thần trách nhiệm.',
      manh: 'Cần cù, ngăn nắp, cẩn thận; trung thực và có óc tổ chức.',
      han: 'Cầu toàn, hay bắt bẻ chi tiết; nói thẳng dễ làm người khác phật lòng.',
      giaoTiep: 'Rõ ràng, thẳng thắn, thích nói lý lẽ; nên mềm hơn khi góp ý.',
      lamViec: 'Kỷ luật, đúng giờ, làm việc có quy trình; hợp vai trò kiểm soát chất lượng.',
      tinhCam: 'Chung thủy, chăm sóc chu đáo; mong muốn sự rõ ràng trong quan hệ.',
      suNghiep: 'Hợp kế toán, quản lý, hành chính, quân đội, y tế, thời trang, nghề cần tỉ mỉ.',
      taiChinh: 'Quản lý tiền chặt chẽ, có kế hoạch; tài chính vững dần.',
      tinhDuyen: 'Hợp người bao dung, biết trân trọng sự chu đáo của mình.',
      giaDinh: 'Chăm lo nề nếp gia đình; nên bớt khắt khe với người thân.',
      xaHoi: 'Được tin vì đáng tin; đôi khi khó gần với người mới.' },
    11: { tom: 'Chó tượng trưng cho lòng trung thành và chính trực: tận tâm, có nghĩa, sẵn lòng bảo vệ người khác.',
      manh: 'Trung thành, thật thà, có trách nhiệm; sống có nguyên tắc và giàu lòng trắc ẩn.',
      han: 'Hay lo âu, bi quan; khó tin người mới và dễ cố chấp.',
      giaoTiep: 'Chân thành, thẳng thắn; ghét giả dối và vòng vo.',
      lamViec: 'Tận tụy, đáng tin, làm việc vì tập thể; hợp vị trí cần sự liêm chính.',
      tinhCam: 'Hết lòng, chung thủy; cần cảm giác an toàn và sự trung thực.',
      suNghiep: 'Hợp luật, giáo dục, y tế, công tác xã hội, an ninh, bảo vệ, chăm sóc khách hàng.',
      taiChinh: 'Tiêu xài cẩn thận; giữ được tiền nhưng ít mạo hiểm để làm giàu nhanh.',
      tinhDuyen: 'Hợp người chân thành, ổn định, biết động viên mình.',
      giaDinh: 'Gắn bó và bảo vệ gia đình; luôn có mặt khi người thân cần.',
      xaHoi: 'Bạn ít mà chất; được tin cậy và hay đứng ra giúp người.' },
    12: { tom: 'Lợn tượng trưng cho sự sung túc và lòng tốt: hiền hậu, rộng lượng, biết hưởng thụ cuộc sống.',
      manh: 'Tốt bụng, chân thành, rộng lượng; lạc quan và kiên nhẫn.',
      han: 'Cả tin, dễ bị lợi dụng; đôi khi ham hưởng thụ, thiếu kỷ luật.',
      giaoTiep: 'Hòa nhã, dễ chịu, ít khi gây mâu thuẫn.',
      lamViec: 'Chăm chỉ khi đã nhận việc, đáng tin; hợp môi trường thân thiện.',
      tinhCam: 'Chân thành, chiều chuộng người mình yêu; dễ tha thứ.',
      suNghiep: 'Hợp ẩm thực, dịch vụ, kinh doanh nhỏ, giáo dục, y tế, nghệ thuật.',
      taiChinh: 'Có phúc về tiền bạc, ít khi túng thiếu; nên tránh cho vay dễ dãi.',
      tinhDuyen: 'Hợp người tinh ý, biết giữ mình khỏi người không tốt.',
      giaDinh: 'Coi gia đình là trên hết; tổ ấm thường đầm ấm, đủ đầy.',
      xaHoi: 'Được nhiều người quý; nên tỉnh táo trước lời nhờ vả.' },
  };

  // ---------- Theo từng năm sinh: thiên can và nạp âm ----------
  const HANH_TEN = { K: 'Kim', M: 'Mộc', T: 'Thủy', H: 'Hỏa', O: 'Thổ' };
  const CAN_HANH = ['', 'Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
  const CHI_HANH = ['', 'Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
  const CAN_Y = ['',
    'can Giáp (Mộc dương) như cây lớn: thẳng thắn, có chí tiến thủ, thích dẫn đầu, đôi khi cứng nhắc',
    'can Ất (Mộc âm) như cỏ cây mềm: khéo léo, dẻo dai, giỏi thích nghi, đôi khi thiếu quyết đoán',
    'can Bính (Hỏa dương) như mặt trời: nhiệt tình, hào phóng, thích thể hiện, dễ nóng vội',
    'can Đinh (Hỏa âm) như ngọn đèn: tinh tế, chu đáo, sâu sắc, dễ đa cảm',
    'can Mậu (Thổ dương) như núi: vững vàng, đáng tin, bao dung, có phần bảo thủ',
    'can Kỷ (Thổ âm) như đất ruộng: thực tế, cẩn thận, biết vun vén, đôi khi lo xa',
    'can Canh (Kim dương) như sắt thép: quyết đoán, nghĩa khí, cứng rắn, dễ va chạm',
    'can Tân (Kim âm) như vàng bạc: tinh tế, trọng thể diện, có óc thẩm mỹ, dễ tự ái',
    'can Nhâm (Thủy dương) như sông lớn: thông minh, phóng khoáng, nhiều ý tưởng, đôi khi thiếu kiên định',
    'can Quý (Thủy âm) như mưa móc: nhạy cảm, kín đáo, giàu trực giác, dễ suy nghĩ nhiều'];
  const MENH_Y = {
    Kim: 'coi trọng nguyên tắc, quyết đoán; hợp tài chính, kỹ thuật, quản lý',
    Mộc: 'nhân hậu, thích phát triển; hợp giáo dục, sáng tạo, nghề gắn với con người',
    Thủy: 'linh hoạt, giỏi giao tiếp; hợp kinh doanh, truyền thông, nghề hay di chuyển',
    Hỏa: 'nhiệt huyết, nhanh nhẹn; hợp nghề cần năng lượng, biểu diễn, dẫn dắt',
    Thổ: 'điềm đạm, đáng tin; hợp bất động sản, hành chính, nghề cần bền bỉ',
  };
  const SINH = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
  const KHAC = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };
  const MAU = { Kim: 'trắng, bạc, xám', Mộc: 'xanh lá', Thủy: 'đen, xanh dương', Hỏa: 'đỏ, hồng, tím', Thổ: 'vàng, nâu' };
  const SINH_BOI = h => Object.keys(SINH).find(k => SINH[k] === h);
  /** Quan hệ ngũ hành của a đối với b */
  const quanHeHanh = (a, b) => a === b ? 'hoa' : SINH[a] === b ? 'sinh' : SINH[b] === a ? 'duocSinh' : KHAC[a] === b ? 'khac' : 'biKhac';

  const canChiNam = y => ({ can: (y + 6) % 10 + 1, chi: (y + 8) % 12 + 1 });
  /** Một năm sinh (âm lịch): can chi, nạp âm, nét riêng của năm */
  function theoNam(y) {
    const { can, chi } = canChiNam(y), na = TuVi.napAm(can, chi), menh = HANH_TEN[na.hanh];
    const qh = quanHeHanh(CHI_HANH[chi], menh);
    const lienHe = { hoa: `địa chi ${CHI[chi]} cùng hành ${menh} với mệnh, tính cách nhất quán`,
      sinh: `địa chi ${CHI[chi]} (${CHI_HANH[chi]}) sinh mệnh ${menh}, nền tảng nâng đỡ nên dễ phát huy`,
      duocSinh: `mệnh ${menh} sinh địa chi ${CHI[chi]} (${CHI_HANH[chi]}), hay cho đi, lo cho người khác nhiều hơn`,
      khac: `địa chi ${CHI[chi]} (${CHI_HANH[chi]}) khắc mệnh ${menh}, bên trong có giằng co, cần rèn sự bình tĩnh`,
      biKhac: `mệnh ${menh} khắc địa chi ${CHI[chi]} (${CHI_HANH[chi]}), bản lĩnh mạnh, dễ lấn lướt người khác` }[qh];
    return { nam: y, can: CAN[can], chi: CHI[chi], canChi: `${CAN[can]} ${CHI[chi]}`, napAm: na.ten, menh,
      canHanh: CAN_HANH[can], amDuong: can % 2 ? 'Dương' : 'Âm',
      loi: `Người tuổi ${CAN[can]} ${CHI[chi]} (${y}) mang ${CAN_Y[can]}. Mệnh ${na.ten} (hành ${menh}): ${MENH_Y[menh]}. Về ngũ hành, ${lienHe}.`,
      mau: `${MAU[SINH_BOI(menh)]} (hành ${SINH_BOI(menh)} sinh ${menh}), ${MAU[menh]}` };
  }

  /** Hồ sơ con giáp t (1 = Tý): thông tin cơ bản, các năm sinh trong khoảng, tính cách, tuổi hợp, tuổi xung */
  function hoSo(t, tu = 1900, den = 2100) {
    const nam = []; for (let y = tu; y <= den; y++) if (canChiNam(y).chi === t) nam.push(theoNam(y));
    const tamHop = [[9, 1, 5], [3, 7, 11], [6, 10, 2], [12, 4, 8]].find(g => g.includes(t));
    const tuHanhXung = [[1, 7, 4, 10], [3, 9, 6, 12], [5, 11, 2, 8]].find(g => g.includes(t));
    const lucHop = { 1: 2, 2: 1, 3: 12, 12: 3, 4: 11, 11: 4, 5: 10, 10: 5, 6: 9, 9: 6, 7: 8, 8: 7 }[t];
    const cg = ConGiap.conGiap(t);
    return { t, ma: MA[t], chi: CHI[t], con: cg.con, han: cg.han, hanh: CHI_HANH[t], amDuong: t % 2 ? 'Dương' : 'Âm', thuTu: t,
      nam, tinhCach: TINH_CACH[t],
      tamHop: tamHop.filter(c => c !== t).map(c => CHI[c]), lucHop: CHI[lucHop],
      tuHanhXung: tuHanhXung.filter(c => c !== t).map(c => CHI[c]), xung: CHI[(t + 5) % 12 + 1] };
  }

  // ---------- Tra tuổi hợp, tuổi xung theo mục đích ----------
  const NGU_HOP = ['1-6', '2-7', '3-8', '4-9', '5-10']; // Giáp Kỷ, Ất Canh, Bính Tân, Đinh Nhâm, Mậu Quý
  const MUC_DICH = [
    { ma: 'ketHon', ten: 'Hợp kết hôn', b: 'người ấy' },
    { ma: 'lamAn', ten: 'Hợp làm ăn', b: 'người cùng làm ăn' },
    { ma: 'sinhCon', ten: 'Hợp sinh con', b: 'con', ghiChu: 'Năm sinh thứ hai được xem là năm sinh (dự kiến) của con.' },
    { ma: 'ketGiao', ten: 'Hợp kết giao', b: 'người bạn' },
    { ma: 'doiTac', ten: 'Hợp chọn đối tác', b: 'đối tác' },
  ];
  // Điểm của từng yếu tố theo mục đích: [kết hôn, làm ăn, sinh con, kết giao, đối tác]
  const W = {
    tamHop: [2, 1.5, 2, 2, 1.5], lucHop: [2, 1.5, 2, 2, 1.5], xung: [-2.5, -1.5, -2, -1.5, -2],
    hinh: [-1, -1, -1, -0.5, -1.5], hai: [-1, -1, -1, -1.5, -1.5], pha: [-1, -1.5, -1, -0.5, -1.5], tuHinh: [-0.5, -0.5, -0.5, -0.5, -0.5],
    nguHop: [1.5, 1, 0.5, 1, 1.5], canKhac: [-1, -1, -0.5, -0.5, -1.5],
    bSinhA: [1.5, 2, 2, 1, 1.5], aSinhB: [1.5, 0.5, 1, 1, 0.5], hoa: [0.5, 1, 0.5, 1, 1.5], aKhacB: [-1.5, 0, -1.5, -0.5, -1], bKhacA: [-1.5, -2, -2, -0.5, -1.5],
  };
  // Lý giải từng yếu tố theo mục đích (cùng thứ tự)
  const LY = {
    tamHop: ['hai tuổi tam hợp nên dễ đồng lòng, cùng chí hướng xây dựng gia đình', 'tam hợp nên dễ cùng chí hướng, phối hợp nhịp nhàng', 'cha mẹ và con tam hợp, dễ hiểu nhau, con được nâng đỡ', 'tam hợp nên dễ thân, hiểu ý nhau', 'tam hợp nên dễ thống nhất mục tiêu chung'],
    lucHop: ['lục hợp là cặp hợp đôi, tình cảm hòa thuận, bù trừ cho nhau', 'lục hợp, hai bên bù trừ điểm mạnh yếu', 'lục hợp, cha mẹ con cái gắn bó', 'lục hợp, dễ thành bạn tri kỷ', 'lục hợp, dễ tin tưởng và hỗ trợ nhau'],
    xung: ['lục xung (cùng nhóm tứ hành xung), dễ bất đồng quan điểm, va chạm trong sinh hoạt', 'lục xung, dễ mâu thuẫn khi ra quyết định', 'lục xung, cha mẹ và con dễ khác tính, khó hiểu nhau', 'lục xung, dễ tranh cãi nhưng không nhất thiết là xấu nếu biết nhường', 'lục xung, dễ bất đồng chiến lược, khó đi đường dài'],
    hinh: ['tương hình, dễ làm tổn thương nhau bằng lời nói', 'tương hình, dễ vướng thị phi, chuyện giấy tờ', 'tương hình, dạy con cần mềm mỏng', 'tương hình, dễ hiểu lầm', 'tương hình, dễ vướng tranh chấp, pháp lý khi hợp tác'],
    hai: ['lục hại, dễ có người ngoài chia rẽ', 'lục hại, đề phòng tiểu nhân, thông tin sai lệch', 'lục hại, cần chú ý sức khỏe và tâm lý của con', 'lục hại, dễ bị kẻ khác gây mâu thuẫn', 'lục hại, cần giấy tờ rõ ràng, tránh bị lợi dụng'],
    pha: ['lục phá, kế hoạch chung dễ dở dang', 'lục phá, việc làm ăn dễ đổ vỡ giữa chừng', 'lục phá, nếp nhà dễ bị xáo trộn', 'lục phá, quan hệ dễ đứt quãng', 'lục phá, hợp đồng dễ phải sửa hoặc hủy'],
    tuHinh: ['cùng tuổi thuộc tự hình, dễ cùng lo nghĩ, làm khó nhau', 'cùng tuổi thuộc tự hình, dễ cùng mắc một sai lầm', 'cùng chi thuộc tự hình', 'cùng tuổi thuộc tự hình', 'cùng tuổi thuộc tự hình, dễ cùng điểm yếu'],
    nguHop: ['thiên can ngũ hợp, dễ cảm mến, hòa hợp về cách nghĩ', 'thiên can ngũ hợp, dễ thống nhất cách làm', 'thiên can ngũ hợp', 'thiên can ngũ hợp, dễ hợp tính', 'thiên can ngũ hợp, dễ đồng thuận khi ra quyết định'],
    canKhac: ['thiên can tương khắc, cách nghĩ dễ trái chiều', 'thiên can tương khắc, dễ giành quyền quyết định', 'thiên can tương khắc, cách dạy con cần thống nhất', 'thiên can tương khắc, đôi khi khó chịu nhau', 'thiên can tương khắc, dễ bất đồng ở cấp quyết định'],
    bSinhA: ['mệnh người ấy sinh mệnh bạn, người ấy hay vun đắp cho bạn', 'mệnh người kia sinh mệnh bạn, bạn được lợi, có người góp sức', 'mệnh con sinh mệnh cha mẹ, dân gian cho là con hiếu thuận, mang lộc', 'mệnh người bạn sinh mệnh bạn, được giúp đỡ', 'mệnh đối tác sinh mệnh bạn, đối tác mang lại nguồn lực'],
    aSinhB: ['mệnh bạn sinh mệnh người ấy, bạn hay chăm lo, vun vén', 'mệnh bạn sinh mệnh người kia, bạn phải bỏ công sức nhiều hơn', 'mệnh cha mẹ sinh mệnh con, con được nuôi dưỡng tốt', 'mệnh bạn sinh mệnh người bạn, bạn hay giúp đỡ', 'mệnh bạn sinh mệnh đối tác, bạn góp nhiều hơn nhận'],
    hoa: ['cùng hành mệnh, dễ hiểu nhau nhưng cũng dễ giống điểm yếu', 'cùng hành mệnh, ngang sức ngang tài', 'cùng hành mệnh', 'cùng hành mệnh, hợp tính', 'cùng hành mệnh, phân chia công việc rõ ràng thì tốt'],
    aKhacB: ['mệnh bạn khắc mệnh người ấy, bạn dễ lấn át, cần tôn trọng nhau', 'mệnh bạn khắc mệnh người kia, bạn nắm thế chủ động', 'mệnh cha mẹ khắc mệnh con, con hay vất vả, cha mẹ nên bớt áp đặt', 'mệnh bạn khắc mệnh người bạn, đôi khi bạn lấn át', 'mệnh bạn khắc mệnh đối tác, dễ áp đặt điều kiện'],
    bKhacA: ['mệnh người ấy khắc mệnh bạn, bạn dễ thấy bị áp lực', 'mệnh người kia khắc mệnh bạn, dễ thiệt về quyền lợi', 'mệnh con khắc mệnh cha mẹ, dân gian cho là không thuận, cần hóa giải bằng cách nuôi dạy hòa hợp', 'mệnh người bạn khắc mệnh bạn, dễ bị lấn át', 'mệnh đối tác khắc mệnh bạn, dễ bất lợi khi chia quyền lợi'],
  };
  const KHUYEN_MD = {
    ketHon: ['Nền tảng tuổi tác thuận; vẫn cần hiểu nhau về tính cách, quan điểm sống.', 'Có thuận có nghịch; điều quyết định là cách hai người cư xử, nhường nhịn.', 'Tuổi có nhiều điểm xung; nếu đã thương nhau, hãy thống nhất cách giải quyết bất đồng ngay từ đầu, đừng để tuổi tác quyết định thay.'],
    lamAn: ['Thuận để cùng làm ăn; nên phân rõ vai trò để phát huy thế mạnh.', 'Có thể cùng làm nếu thỏa thuận rõ phần việc và phần lợi.', 'Dễ bất đồng về tiền bạc; nếu hợp tác, mọi thỏa thuận nên có văn bản.'],
    sinhCon: ['Năm sinh này thuận với tuổi cha mẹ theo quan niệm dân gian.', 'Không quá thuận cũng không xấu; sức khỏe và sự chuẩn bị của cha mẹ quan trọng hơn.', 'Theo dân gian không thật thuận; nhưng đây chỉ là một yếu tố tham khảo, sự chăm sóc và giáo dục mới là chính.'],
    ketGiao: ['Dễ thành bạn tốt, có thể tin cậy lâu dài.', 'Làm bạn được; giữ sự tôn trọng ranh giới của nhau.', 'Dễ va chạm; nên giữ khoảng cách vừa phải và tránh chuyện tiền bạc.'],
    doiTac: ['Đối tác tiềm năng; vẫn cần thẩm định năng lực, uy tín.', 'Hợp tác được với điều khoản rõ ràng và kiểm tra định kỳ.', 'Rủi ro bất đồng cao; nên hợp tác ngắn hạn, có điều khoản thoát ra rõ ràng.'],
  };
  const mucMD = d => d >= 3 ? 'Rất hợp' : d >= 1 ? 'Hợp' : d > -1 ? 'Bình thường' : d > -3 ? 'Kém hợp' : 'Xung khắc';

  /** Tra hai năm sinh âm lịch: a là bạn, b là người cần xem. Trả quan hệ chi, can, ngũ hành và đánh giá riêng từng mục đích */
  function hopTuoi(a, b) {
    const A = theoNam(a), B = theoNam(b), ca = canChiNam(a), cb = canChiNam(b);
    const yeuTo = [];
    const qhChi = ConGiap.quanHe(cb.chi, ca.chi);
    qhChi.forEach(q => yeuTo.push(q.loai));
    const capCan = `${Math.min(ca.can, cb.can)}-${Math.max(ca.can, cb.can)}`;
    if (NGU_HOP.includes(capCan)) yeuTo.push('nguHop');
    const qhCan = quanHeHanh(CAN_HANH[ca.can], CAN_HANH[cb.can]);
    if (qhCan === 'khac' || qhCan === 'biKhac') yeuTo.push('canKhac');
    const qhMenh = quanHeHanh(A.menh, B.menh);
    yeuTo.push({ hoa: 'hoa', sinh: 'aSinhB', duocSinh: 'bSinhA', khac: 'aKhacB', biKhac: 'bKhacA' }[qhMenh]);
    const nhom = [[1, 7, 4, 10], [3, 9, 6, 12], [5, 11, 2, 8]];
    const cungNhomXung = ca.chi !== cb.chi && nhom.some(g => g.includes(ca.chi) && g.includes(cb.chi));
    const quanHe = {
      tamHop: yeuTo.includes('tamHop'), lucHop: yeuTo.includes('lucHop'), xung: yeuTo.includes('xung'), cungNhomXung,
      chi: qhChi.length ? qhChi.map(q => `${q.ten}: ${q.hieu}`) : [ca.chi === cb.chi ? 'cùng chi' : 'không tam hợp, lục hợp hay xung'],
      can: NGU_HOP.includes(capCan) ? `${A.can} và ${B.can} là cặp thiên can ngũ hợp` : qhCan === 'khac' ? `can ${A.can} (${CAN_HANH[ca.can]}) khắc can ${B.can} (${CAN_HANH[cb.can]})`
        : qhCan === 'biKhac' ? `can ${B.can} (${CAN_HANH[cb.can]}) khắc can ${A.can} (${CAN_HANH[ca.can]})` : qhCan === 'hoa' ? `hai can cùng hành ${CAN_HANH[ca.can]}`
        : `can ${qhCan === 'sinh' ? `${A.can} sinh ${B.can}` : `${B.can} sinh ${A.can}`} (tương sinh)`,
      menh: { hoa: `cùng mệnh ${A.menh}`, sinh: `${A.menh} sinh ${B.menh} (bạn sinh người kia)`, duocSinh: `${B.menh} sinh ${A.menh} (người kia sinh bạn)`,
        khac: `${A.menh} khắc ${B.menh} (bạn khắc người kia)`, biKhac: `${B.menh} khắc ${A.menh} (người kia khắc bạn)` }[qhMenh],
    };
    const mucDich = MUC_DICH.map((md, i) => {
      const cong = [], tru = [];
      let diem = 0;
      yeuTo.forEach(y => { const w = W[y][i]; diem += w; if (w > 0) cong.push(LY[y][i]); else if (w < 0) tru.push(LY[y][i]); });
      const muc = mucMD(diem), k = KHUYEN_MD[md.ma];
      return { ma: md.ma, ten: md.ten, ghiChu: md.ghiChu || '', diem, muc, thuan: cong, nghich: tru,
        loiKhuyen: diem >= 1 ? k[0] : diem > -1 ? k[1] : k[2] };
    });
    return { a: A, b: B, quanHe, mucDich };
  }

  const ConGiapHoSo = { MA, TINH_CACH, hoSo, theoNam, hopTuoi, MUC_DICH };
  if (node) module.exports = ConGiapHoSo; else root.ConGiapHoSo = ConGiapHoSo;
})(typeof window !== 'undefined' ? window : globalThis);
