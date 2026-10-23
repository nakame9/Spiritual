/* Luận giải lá số: ghép ý nghĩa truyền thống của cung và sao thành đoạn văn cho từng cung.
 * Nội dung tự biên soạn; dùng cùng tuvi.js (đối tượng trả về từ TuVi.lapLaSo). */
(function (root) {
  'use strict';

  const CUNG_Y = {
    'Mệnh': 'Nói về bản thân: tính cách, năng lực và hướng đi chung của cả cuộc đời.',
    'Phụ Mẫu': 'Nói về cha mẹ, người trên và mối quan hệ với họ; cũng liên quan đến giấy tờ và việc học thời nhỏ.',
    'Phúc Đức': 'Nói về phúc phần dòng họ, đời sống tinh thần, sự an vui và tuổi thọ.',
    'Điền Trạch': 'Nói về nhà cửa, đất đai, tài sản lâu dài và không khí trong gia đình.',
    'Quan Lộc': 'Nói về công việc, sự nghiệp, học hành và cách mình làm việc.',
    'Nô Bộc': 'Nói về bạn bè, đồng nghiệp, cấp dưới và những người cộng tác.',
    'Thiên Di': 'Nói về việc ra ngoài xã hội, đi xa, cơ hội bên ngoài và cách người khác nhìn mình.',
    'Tật Ách': 'Nói về sức khỏe, bệnh tật và những trắc trở có thể gặp.',
    'Tài Bạch': 'Nói về tiền bạc: cách kiếm tiền, cách tiêu và khả năng giữ của.',
    'Tử Tức': 'Nói về con cái, người nhỏ tuổi mình dìu dắt và khả năng sáng tạo.',
    'Phu Thê': 'Nói về hôn nhân, người bạn đời và cách mình yêu thương.',
    'Huynh Đệ': 'Nói về anh chị em và những người thân thiết ngang hàng.',
  };
  const LINH_VUC = {
    'Mệnh': 'than', 'Phúc Đức': 'than', 'Tài Bạch': 'tien', 'Điền Trạch': 'tien',
    'Quan Lộc': 'viec', 'Thiên Di': 'viec', 'Nô Bộc': 'viec',
    'Phu Thê': 'tinh', 'Tử Tức': 'tinh', 'Phụ Mẫu': 'tinh', 'Huynh Đệ': 'tinh', 'Tật Ách': 'benh',
  };

  // tinh: bản chất; tot / xau: khi sáng / khi hãm; than, tien, viec, tinh2, benh: theo lĩnh vực của cung
  const CHINH = {
    1: { tinh: 'Đế tinh, chủ về uy tín, lòng tự trọng và khả năng đứng đầu. Người có Tử Vi thường điềm tĩnh, có tầm nhìn và thích được tôn trọng.',
      tot: 'có uy, dễ được tin cậy và giao việc lớn', xau: 'dễ thấy cô đơn ở vị trí của mình, tự cao hoặc cầu toàn quá mức',
      than: 'Có phong thái của người cầm trịch, thích làm chủ. Cần người giỏi bên cạnh (Tả Phù, Hữu Bật, Thiên Khôi, Thiên Việt) mới phát huy hết.',
      tien: 'Tiền đến từ vị trí và uy tín nhiều hơn là buôn bán nhỏ lẻ; quản lý tài sản khá vững.',
      viec: 'Hợp vai trò quản lý, điều hành, những việc cần ra quyết định và giữ chữ tín.',
      tinh2: 'Người trong cung này có cá tính mạnh, được nể trọng; quan hệ tốt khi hai bên giữ được sự tôn trọng.',
      benh: 'Sách cổ gắn sao này với tì vị và tiêu hóa.' },
    2: { tinh: 'Sao của nguyên tắc, kỷ luật và tham vọng, đồng thời có sức hút riêng. Tính cách mạnh, yêu ghét rõ ràng.',
      tot: 'thẳng thắn, liêm chính, làm việc có phép tắc', xau: 'dễ nóng nảy, vướng thị phi hoặc chuyện pháp lý',
      than: 'Có chính kiến, thích phân định đúng sai; nên học cách mềm mỏng.',
      tien: 'Kiếm tiền bằng chuyên môn và kỷ luật; nên tránh những vụ làm ăn mập mờ.',
      viec: 'Hợp ngành có quy tắc chặt: kỹ thuật, pháp luật, lực lượng vũ trang, quản lý chất lượng.',
      tinh2: 'Quan hệ nhiều cảm xúc, có lúc căng thẳng; cần tránh để cái tôi lấn át.',
      benh: 'Sách cổ gắn sao này với máu huyết và tim mạch.' },
    3: { tinh: 'Phúc tinh, chủ về sự hiền hòa, dễ chịu và khả năng tận hưởng cuộc sống. Người Thiên Đồng lạc quan, thích yên ổn.',
      tot: 'có phúc, gặp khó rồi cũng qua, được nhiều người quý', xau: 'thiếu quyết đoán, ngại thay đổi, hay đổi ý',
      than: 'Tính ôn hòa, giàu cảm xúc; cần mục tiêu rõ ràng để không sa vào an phận.',
      tien: 'Tiền vào từ từ; đời sống thường đủ đầy hơn là giàu đột biến.',
      viec: 'Hợp dịch vụ, giáo dục, chăm sóc, nghệ thuật, môi trường ít tranh đấu.',
      tinh2: 'Người hòa nhã, dễ gần; quan hệ êm đềm nhưng cần chủ động giải quyết vấn đề.',
      benh: 'Sách cổ gắn sao này với thận và đường tiết niệu.' },
    4: { tinh: 'Tài tinh, chủ về tiền bạc, sự cương quyết và óc thực tế. Người Vũ Khúc chăm chỉ, nói ít làm nhiều.',
      tot: 'giỏi tài chính, quyết đoán, làm giàu bằng sức mình', xau: 'cứng nhắc, dễ cô độc và vất vả vì tiền',
      than: 'Thẳng tính, ít khéo nói, coi trọng kết quả hơn lời hứa.',
      tien: 'Rất hợp với cung tiền bạc: có đầu óc kinh doanh, tài chính, đầu tư.',
      viec: 'Hợp tài chính, kế toán, kinh doanh, cơ khí, những việc cần quyết đoán.',
      tinh2: 'Người trong cung này thực tế, cứng cỏi; tình cảm sâu nhưng ít thể hiện.',
      benh: 'Sách cổ gắn sao này với phổi và đường hô hấp.' },
    5: { tinh: 'Mặt Trời, chủ về danh tiếng, sự hào phóng và tinh thần cống hiến. Người Thái Dương nhiệt tình, thích giúp đỡ.',
      tot: 'nổi danh, rộng rãi, có uy tín', xau: 'vất vả, làm nhiều mà ít được ghi nhận',
      than: 'Thẳng thắn, hướng ngoại, thích được công nhận.',
      tien: 'Tiền đến từ danh tiếng và công sức bỏ ra; chi tiêu hào phóng.',
      viec: 'Hợp công việc công khai: quản lý nhà nước, giáo dục, truyền thông, ngoại giao.',
      tinh2: 'Thường ứng với người đàn ông trong nhà (cha, chồng, con trai); quan hệ ấm áp, cởi mở.',
      benh: 'Sách cổ gắn sao này với mắt, đầu và huyết áp.' },
    6: { tinh: 'Sao mưu trí, chủ về sự khéo léo, suy tính và khả năng thích nghi. Người Thiên Cơ nhanh nhạy, giỏi lập kế hoạch.',
      tot: 'thông minh, tháo vát, giỏi tham mưu', xau: 'hay lo nghĩ, thay đổi thất thường, khó kiên định',
      than: 'Đầu óc linh hoạt, thích học hỏi, đôi khi nghĩ quá nhiều.',
      tien: 'Kiếm tiền nhờ chất xám và sự linh hoạt; thu nhập có lúc lên xuống.',
      viec: 'Hợp nghiên cứu, kỹ thuật, tư vấn, lập kế hoạch, công nghệ.',
      tinh2: 'Người khéo léo, nhạy bén; quan hệ cần trao đổi thẳng thắn để tránh nghi ngại.',
      benh: 'Sách cổ gắn sao này với gan mật, thần kinh và tay chân.' },
    7: { tinh: 'Kho trời, chủ về sự ổn định, khả năng tích lũy và lòng bao dung. Người Thiên Phủ chín chắn, biết giữ gìn.',
      tot: 'có của để dành, được tin cậy, sống ổn định', xau: 'dễ thành "kho trống", hao tán',
      than: 'Điềm đạm, thực tế, thích sự an toàn.',
      tien: 'Rất tốt cho tiền bạc và nhà đất: giỏi tích lũy và quản lý. Gặp Địa Không, Địa Kiếp hay Tuần, Triệt thì kho dễ vơi.',
      viec: 'Hợp quản lý tài sản, hành chính, ngân hàng, bất động sản.',
      tinh2: 'Người hiền hậu, biết lo toan; quan hệ vững bền.',
      benh: 'Sách cổ gắn sao này với dạ dày và tiêu hóa.' },
    8: { tinh: 'Mặt Trăng, chủ về sự dịu dàng, tinh tế và tài sản nhà cửa. Người Thái Âm sống nội tâm, giàu cảm xúc.',
      tot: 'giàu có, thanh nhã, được yêu mến', xau: 'đa sầu, dễ hao tài và lo nghĩ',
      than: 'Nhạy cảm, kín đáo, chu đáo.',
      tien: 'Rất tốt cho tích lũy, nhất là nhà đất; tiền đến đều đặn.',
      viec: 'Hợp tài chính, bất động sản, thiết kế, nghệ thuật, công việc tỉ mỉ.',
      tinh2: 'Thường ứng với người phụ nữ trong nhà (mẹ, vợ, con gái); tình cảm sâu sắc.',
      benh: 'Sách cổ gắn sao này với thận, mắt và nội tiết.' },
    9: { tinh: 'Sao của ham muốn và tài giao tiếp, đứng đầu nhóm đào hoa. Người Tham Lang đa tài, ham học hỏi, thích hưởng thụ.',
      tot: 'khéo léo, đa năng, dễ thành công nhờ quan hệ', xau: 'dễ sa vào ham muốn, cờ bạc, rượu chè hoặc tình cảm phức tạp',
      than: 'Năng động, nhiều sở thích, có duyên.',
      tien: 'Kiếm tiền từ kinh doanh, giao tiếp, giải trí. Gặp Hỏa Tinh hoặc Linh Tinh ở cung sáng thì có thể giàu nhanh.',
      viec: 'Hợp kinh doanh, ngoại giao, giải trí, ẩm thực, biểu diễn.',
      tinh2: 'Quan hệ có sức hút, nhiều màu sắc; cần chung thủy và rõ ràng.',
      benh: 'Sách cổ gắn sao này với gan, thận và đường sinh dục.' },
    10: { tinh: 'Ám tinh, chủ về lời nói, tranh luận và sự hoài nghi. Người Cự Môn có tài ăn nói, phân tích sắc bén.',
      tot: 'giỏi biện luận, thành danh nhờ lời nói hoặc chuyên môn sâu', xau: 'dễ vướng thị phi, khẩu thiệt, hiểu lầm',
      than: 'Nói thẳng, hay đặt câu hỏi; nên cẩn trọng lời nói.',
      tien: 'Kiếm tiền bằng lời nói hoặc chuyên môn sâu; nên tránh tranh chấp tiền bạc.',
      viec: 'Hợp luật, giảng dạy, dẫn chương trình, bán hàng, nghiên cứu, y dược.',
      tinh2: 'Dễ bất đồng ý kiến; quan hệ tốt hơn khi chịu lắng nghe.',
      benh: 'Sách cổ gắn sao này với miệng và dạ dày.' },
    11: { tinh: 'Ấn tinh, chủ về sự chính trực, trách nhiệm và lòng trắc ẩn. Người Thiên Tướng đứng đắn, thích bênh vực lẽ phải.',
      tot: 'có chức phận, được tin tưởng, chỉn chu', xau: 'dễ bị lợi dụng lòng tốt, ôm việc của người khác',
      than: 'Lịch sự, có trách nhiệm, coi trọng danh dự.',
      tien: 'Thu nhập ổn định nhờ vị trí, ít khi túng thiếu.',
      viec: 'Hợp hành chính, nhân sự, pháp chế, chăm sóc khách hàng, thời trang.',
      tinh2: 'Người đáng tin, hay che chở; quan hệ hài hòa.',
      benh: 'Sách cổ gắn sao này với da và đường tiết niệu.' },
    12: { tinh: 'Ấm tinh, chủ về sự che chở, sống thọ và đạo đức. Người Thiên Lương nghiêm túc, thích khuyên bảo.',
      tot: 'được che chở, gặp nạn có người giúp, sống thọ', xau: 'cô độc, hay lo chuyện người khác, dễ bị cho là gia trưởng',
      than: 'Chín chắn, có nguyên tắc, như một người anh cả.',
      tien: 'Tiền không quá dồi dào nhưng ít khi thiếu, hay được người giúp.',
      viec: 'Hợp y dược, giáo dục, tư vấn, bảo hiểm, công tác xã hội.',
      tinh2: 'Người trong cung này thường chín chắn hoặc lớn tuổi hơn; quan hệ có sự che chở lẫn nhau.',
      benh: 'Sách cổ gắn sao này với dạ dày, gan, và coi đây là sao giải bệnh.' },
    13: { tinh: 'Tướng tinh, chủ về sự can đảm, quyết liệt và tinh thần khai phá. Người Thất Sát hành động nhanh, không ngại khó.',
      tot: 'có uy, dám làm lớn, lập nghiệp từ hai bàn tay', xau: 'liều lĩnh, cô độc, đời nhiều thăng trầm',
      than: 'Thẳng, mạnh, ghét bị ràng buộc.',
      tien: 'Tiền đến từ những bước đi táo bạo; được lớn thì mất cũng lớn.',
      viec: 'Hợp lực lượng vũ trang, kinh doanh mạo hiểm, khởi nghiệp, kỹ thuật nặng.',
      tinh2: 'Quan hệ mạnh mẽ, dễ va chạm; cần biết nhường nhịn.',
      benh: 'Sách cổ gắn sao này với phổi, xương khớp và chấn thương.' },
    14: { tinh: 'Hao tinh, chủ về phá cũ xây mới, thay đổi và cải cách. Người Phá Quân dám nghĩ dám làm, không thích lối mòn.',
      tot: 'có tài cải cách, vượt khó, làm nên việc lớn sau biến động', xau: 'hao tán, bốc đồng, đời sống bất ổn',
      than: 'Táo bạo, chuộng tự do, hay thay đổi.',
      tien: 'Tiền vào ra mạnh; nên có kế hoạch giữ của.',
      viec: 'Hợp công việc đổi mới, kỹ thuật, sản xuất, khởi nghiệp.',
      tinh2: 'Quan hệ nhiều thay đổi; cần kiên nhẫn để giữ ổn định.',
      benh: 'Sách cổ gắn sao này với thận, đường sinh dục và máu huyết.' },
  };

  // Nhóm phụ tinh: [id..., tốt?, ý nghĩa]
  const PHU = [
    [[61, 62], true, 'có người giúp sức, được bạn bè và đồng nghiệp hỗ trợ'],
    [[57, 58], true, 'lợi cho học hành, thi cử, chữ nghĩa và giấy tờ'],
    [[59, 60], true, 'gặp quý nhân, được người trên nâng đỡ'],
    [[27], true, 'giữ được tài lộc, sống ổn định, có phần thận trọng'],
    [[94], true, 'thuận lợi về tài lộc và cơ hội'],
    [[93], true, 'có quyền hành, chủ động, được nể'],
    [[92], true, 'có danh tiếng, học vấn; giúp nhẹ bớt khó khăn'],
    [[98], true, 'nhiều di chuyển và thay đổi; gặp Lộc Tồn hay Hóa Lộc thì đi xa có lợi'],
    [[100, 101], true, 'có phúc, được che chở'],
    [[67, 68], true, 'được ân huệ, có người giúp đúng lúc'],
    [[65, 66], true, 'có địa vị, được trọng vọng'],
    [[84, 85], true, 'có danh dự, bằng cấp, được khen thưởng'],
    [[76], true, 'có chức vụ, được giao quyền'],
    [[63, 64], true, 'có khiếu thẩm mỹ và nghệ thuật'],
    [[79, 80], true, 'có duyên lành, tin vui, chuyện cưới hỏi'],
    [[71, 72, 83, 81, 82], true, 'giải trừ bớt tai ương'],
    [[103], true, 'có lộc ăn uống'],
    [[52, 51], false, 'cạnh tranh, va chạm (Kình Dương) và trì hoãn, vướng víu (Đà La)'],
    [[53, 54], false, 'hao hụt, biến động bất ngờ; nhưng cũng cho ý tưởng khác người'],
    [[56, 55], false, 'nóng vội, biến cố đến nhanh'],
    [[95], false, 'vướng mắc, thị phi, lo nghĩ'],
    [[73], false, 'kỷ luật, pháp lý; có khi là chuyện mổ xẻ, phẫu thuật'],
    [[74, 78], false, 'đa cảm, sức hút mạnh, dễ vướng chuyện tình cảm'],
    [[96, 97], false, 'thích tự lập nhưng đôi lúc cô đơn'],
    [[69, 70], false, 'buồn phiền, hao tổn tinh thần'],
    [[17, 23], false, 'tang chế, tranh chấp, thăng trầm'],
    [[104], false, 'dễ mất mát hoặc tổn thương bất ngờ'],
    [[99], false, 'hao tốn lặt vặt, việc hay dở dang'],
    [[36, 30], false, 'chi tiêu hao hụt'],
    [[90, 91], false, 'bị bó buộc, khó xoay xở'],
  ];

  const THAN_CU = {
    'Mệnh': 'Thân Mệnh đồng cung: sống đúng bản tính, trước sau như một.',
    'Phúc Đức': 'Thân cư Phúc Đức: coi trọng đời sống tinh thần và gia tộc.',
    'Quan Lộc': 'Thân cư Quan Lộc: nửa sau cuộc đời đặt nặng sự nghiệp.',
    'Thiên Di': 'Thân cư Thiên Di: hay đi xa, hoạt động nhiều bên ngoài.',
    'Tài Bạch': 'Thân cư Tài Bạch: thực tế, coi trọng tiền bạc.',
    'Phu Thê': 'Thân cư Phu Thê: đời sống chịu ảnh hưởng nhiều từ người bạn đời.',
  };
  const SINH_KHAC = {
    'Cục sinh Bản Mệnh': 'được hoàn cảnh nâng đỡ, làm việc gì cũng dễ thuận hơn',
    'Bản Mệnh sinh Cục': 'phải bỏ nhiều công sức cho hoàn cảnh, cho đi nhiều hơn nhận',
    'Bản Mệnh khắc Cục': 'tự lực vượt hoàn cảnh, thành quả do chính mình làm ra',
    'Cục khắc Bản Mệnh': 'hay gặp trở ngại từ hoàn cảnh, cần kiên trì',
    'Cục hòa Bản Mệnh': 'mình và hoàn cảnh cân bằng, không nâng đỡ cũng không cản trở',
  };
  const CACH = [
    [[13, 14, 9], 'Sát Phá Tham', 'đời nhiều biến động, hợp tự lập nghiệp và những việc cần đổi mới.'],
    [[6, 8, 3, 12], 'Cơ Nguyệt Đồng Lương', 'hợp công việc ổn định, làm trong tổ chức, giỏi chuyên môn và tham mưu.'],
    [[1, 7, 4, 11], 'Tử Phủ Vũ Tướng', 'thiên về quyền quý và ổn định, hợp quản lý, tài chính.'],
  ];
  const DT = { M: 'miếu', V: 'vượng', Đ: 'đắc', B: 'bình', H: 'hãm' };
  const HC = { Kim: 'K', Mộc: 'M', Thủy: 'T', Hỏa: 'H', Thổ: 'O' };

  const lech = (so, n) => ((so - 1 + n) % 12 + 12) % 12 + 1;
  const chinhCua = c => c.sao.filter(s => s.loai === 1);
  const tenSao = s => `<b class="${HC[s.hanh]}">${s.ten}</b>`;
  const dsChinh = c => chinhCua(c).map(s => s.ten).join(', ') || 'Vô chính diệu';
  const cungTai = (L, so) => L.cung[so - 1];

  function doanChinh(s, lv, muon) {
    const d = CHINH[s.id];
    const sang = s.dacTinh ? (/[MVĐ]/.test(s.dacTinh) ? ` Sao đang sáng (${DT[s.dacTinh]}) nên ${d.tot}.`
      : s.dacTinh === 'H' ? ` Sao đang hãm nên ${d.xau}.` : ' Sao ở mức bình hòa, tốt xấu tùy các sao đi cùng.') : '';
    return `<p>${tenSao(s)}${s.dacTinh ? ` <span class="lg-dt">${DT[s.dacTinh]}</span>` : ''}${s.hoa ? ` <span class="lg-dt">${s.hoa}</span>` : ''}: ${d.tinh}${muon ? '' : sang} ${d[lv === 'tinh' ? 'tinh2' : lv]}</p>`;
  }

  /** Trả về HTML luận giải của cung số `so` (1 = Tý) trên lá số L */
  function luanGiai(L, so) {
    const c = cungTai(L, so), lv = LINH_VUC[c.ten];
    const h = [];
    h.push(`<header><h3>Cung ${c.ten}${c.than ? ' <span class="than">Thân</span>' : ''}</h3><span class="lg-pos">tại ${c.chi} · hành ${c.hanh} · đại hạn ${c.daiHan}–${c.daiHan + 9} tuổi</span></header>`);
    h.push(`<p class="lg-intro">${CUNG_Y[c.ten]}</p>`);

    const chinh = chinhCua(c);
    h.push('<h4>Chính tinh</h4>');
    if (chinh.length) chinh.forEach(s => h.push(doanChinh(s, lv)));
    else {
      const xung = cungTai(L, lech(so, 6)), muon = chinhCua(xung);
      h.push(`<p>Cung không có chính tinh (Vô chính diệu), nên mượn sao của cung xung chiếu ${xung.ten} tại ${xung.chi}. Ảnh hưởng của sao mượn yếu hơn, vì vậy các phụ tinh trong cung có vai trò lớn hơn.</p>`);
      muon.forEach(s => h.push(doanChinh(s, lv, true)));
      if (c.tuan || c.triet || c.sao.some(s => s.id === 53 || s.id === 54))
        h.push('<p>Sách cổ cho rằng cung Vô chính diệu gặp Tuần, Triệt hoặc Địa Không, Địa Kiếp lại thuận hơn bình thường.</p>');
    }

    const ids = new Set(c.sao.map(s => s.id));
    const ten = id => c.sao.find(s => s.id === id).ten;
    const nhom = tot => PHU.filter(g => g[1] === tot && g[0].some(id => ids.has(id)))
      .map(g => `<li><b>${g[0].filter(id => ids.has(id)).map(ten).join(', ')}</b>: ${g[2]}.</li>`);
    const tot = nhom(true), xau = nhom(false);
    if (tot.length) h.push(`<h4>Sao hỗ trợ</h4><ul>${tot.join('')}</ul>`);
    if (xau.length) h.push(`<h4>Sao cần lưu ý</h4><ul>${xau.join('')}</ul>`);
    if (c.triet) h.push('<p class="lg-note"><b>Triệt</b> đóng ở cung này: sức của các sao bị chặn bớt, rõ nhất ở nửa đầu đời (trước khoảng 30 tuổi). Sao tốt bớt tốt, sao xấu cũng bớt xấu.</p>');
    if (c.tuan) h.push('<p class="lg-note"><b>Tuần</b> đóng ở cung này: tác dụng giống Triệt nhưng nhẹ hơn, rõ hơn ở nửa sau cuộc đời.</p>');

    if (c.ten === 'Mệnh') {
      const than = L.cung[L.than - 1];
      const ex = [THAN_CU[than.ten], `Bản mệnh ${L.banMenh}, ${L.cuc}: ${L.sinhKhac.toLowerCase()}, ${SINH_KHAC[L.sinhKhac]}.`,
        `${L.thuanLy}: ${L.thuanLy.endsWith('thuận lý') ? 'tuổi và cung Mệnh cùng âm dương, mọi việc dễ xuôi hơn.' : 'tuổi và cung Mệnh khác âm dương, hay phải xoay xở nhiều hơn.'}`];
      const quanh = [0, 4, 8, 6].flatMap(n => chinhCua(cungTai(L, lech(so, n))).map(s => s.id));
      CACH.forEach(([ids2, ten2, y]) => { if (ids2.every(id => quanh.includes(id))) ex.push(`Tam phương tứ chính hội đủ bộ <b>${ten2}</b>: ${y}`); });
      h.push(`<h4>Tổng quan</h4><ul>${ex.map(x => `<li>${x}</li>`).join('')}</ul>`);
    }
    if (c.ten === 'Tật Ách') h.push('<p class="lg-note">Phần sức khỏe là liên hệ theo sách cổ, không thay cho lời khuyên của bác sĩ.</p>');

    const tp = [4, 8].map(n => cungTai(L, lech(so, n))), xc = cungTai(L, lech(so, 6));
    h.push(`<p class="lg-tp">Nên xem cùng tam hợp ${tp.map(t => `<b>${t.ten}</b> (${dsChinh(t)})`).join(' và ')}, xung chiếu <b>${xc.ten}</b> (${dsChinh(xc)}).</p>`);
    return h.join('\n');
  }

  const THU_TU = ['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Phu Thê', 'Thiên Di', 'Phúc Đức', 'Điền Trạch', 'Tật Ách', 'Tử Tức', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'];
  const LuanGiai = { luanGiai, THU_TU };
  if (typeof module !== 'undefined' && module.exports) module.exports = LuanGiai; else root.LuanGiai = LuanGiai;
})(typeof window !== 'undefined' ? window : globalThis);
