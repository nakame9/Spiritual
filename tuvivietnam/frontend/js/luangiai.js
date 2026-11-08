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
  // Hai chính tinh đồng cung (khóa: id nhỏ-id lớn)
  const CAP = {
    '1-7': 'Tử Phủ đồng cung: hai sao lãnh đạo ở chung, vừa có uy vừa có của. Ổn định, biết giữ gìn, nhưng dễ bảo thủ và khó nhận mình sai.',
    '1-9': 'Tử Tham đồng cung (cách "Đào hoa phạm chủ"): tài giao tiếp và ham hưởng thụ đi cùng quyền lực. Gặp Tả Hữu, Xương Khúc thì có tài tổ chức; gặp sao xấu dễ sa vào ăn chơi.',
    '1-11': 'Tử Tướng đồng cung: uy quyền cộng trách nhiệm, hợp quản lý, hành chính. Gặp Tuần, Triệt hoặc Kình Dương thì vất vả, hay phải gánh việc cho người khác.',
    '1-13': 'Tử Sát đồng cung: quyết đoán, dám làm, có uy nghiêm. Hợp vị trí điều hành cần cứng rắn; cần tránh độc đoán.',
    '1-14': 'Tử Phá đồng cung: có chí lớn, thích cải tổ, không chịu ngồi yên. Đời có giai đoạn thay đổi mạnh; nên chọn hướng rõ ràng rồi theo đến cùng.',
    '2-7': 'Liêm Phủ đồng cung: Thiên Phủ làm dịu tính nóng của Liêm Trinh. Có nguyên tắc mà biết giữ gìn, hợp hành chính, tài chính.',
    '2-9': 'Liêm Tham đồng cung: hai sao đào hoa gặp nhau, nhiều ham muốn và sức hút. Cần giữ mình trước cám dỗ tiền bạc, tình cảm; gặp sao tốt thì giỏi giao tế.',
    '2-11': 'Liêm Tướng đồng cung: chính trực, có trách nhiệm, hợp ngành pháp luật, kỷ luật. Gặp Kình Dương, Thiên Hình dễ vướng chuyện kiện tụng.',
    '2-13': 'Liêm Sát đồng cung: mạnh mẽ, chịu khó, làm việc lớn bằng sức mình. Dễ va chạm, chấn thương; nên cẩn thận khi di chuyển và làm việc nặng.',
    '2-14': 'Liêm Phá đồng cung: quyết liệt, không ngại phá cách cũ. Đời dễ thăng trầm; hợp kỹ thuật, quân sự, sản xuất.',
    '4-7': 'Vũ Phủ đồng cung: tài tinh gặp kho trời, rất lợi cho tiền bạc và tích lũy. Tính thực tế, chắc chắn, làm giàu bền.',
    '4-9': 'Vũ Tham đồng cung: giỏi kiếm tiền nhưng thường phát muộn, sách cổ nói tuổi trẻ khó phát. Kiên nhẫn qua tuổi 30 thì khá lên rõ.',
    '4-11': 'Vũ Tướng đồng cung: có tài chính lại có uy tín, hợp tài chính, ngân hàng, quản lý. Thẳng thắn, đáng tin.',
    '4-13': 'Vũ Sát đồng cung: cứng rắn, dám mạo hiểm về tiền bạc. Kiếm tiền vất vả, được mất lớn; nên có kế hoạch dự phòng.',
    '4-14': 'Vũ Phá đồng cung: tiền bạc biến động, dám đầu tư mạnh. Có thể làm lớn nhưng dễ hao; hợp kỹ thuật, cơ khí, khởi nghiệp.',
    '3-8': 'Đồng Âm đồng cung: hiền hòa, tình cảm, thích cuộc sống êm ả. Ở Tý (hai sao sáng) rất đẹp; ở Ngọ (hai sao hãm) dễ đa sầu, thiếu quyết đoán.',
    '3-10': 'Đồng Cự đồng cung: vui vẻ ngoài mặt nhưng trong lòng hay bất mãn, dễ vướng chuyện lời qua tiếng lại. Nên bày tỏ thẳng mà nhẹ nhàng.',
    '3-12': 'Đồng Lương đồng cung: có phúc, hiền lành, thích giúp người. Hợp giáo dục, y tế, công tác xã hội; đời ít sóng gió lớn.',
    '5-8': 'Nhật Nguyệt đồng cung (ở Sửu hoặc Mùi): một sao sáng một sao tối, tính cách có hai mặt, hay thay đổi. Gặp Hóa Lộc, Hóa Khoa hoặc Tuần, Triệt thì tốt hơn nhiều.',
    '5-10': 'Cự Nhật đồng cung: lời nói có sức nặng, hợp nghề dùng lời nói, ngoại giao, giảng dạy. Ở Dần (Thái Dương sáng) tốt hơn ở Thân.',
    '5-12': 'Nhật Lương đồng cung: có danh, có lòng nhân, hợp phục vụ cộng đồng, giáo dục, y tế. Ở Mão (Thái Dương sáng) rất đẹp.',
    '6-8': 'Cơ Nguyệt đồng cung: thông minh, khéo léo, nhạy cảm; hợp việc tỉ mỉ, tham mưu, văn phòng. Hay thay đổi chỗ làm, chỗ ở.',
    '6-10': 'Cơ Cự đồng cung: lý luận sắc, giỏi phân tích, ăn nói hay. Cẩn thận thị phi; có tài kinh doanh.',
    '6-12': 'Cơ Lương đồng cung: mưu trí cộng lòng nhân, giỏi tham mưu, giảng dạy, tư vấn. Thích bàn luận, đôi khi lý thuyết hơn thực hành.',
  };
  // Tứ Hóa theo lĩnh vực của cung
  const HOA_LV = {
    'Hóa Lộc': { than: 'Ở đây Lộc làm người khác dễ có thiện cảm, cơ hội tự tìm đến; hợp nghề giao tiếp, kinh doanh.',
      tien: 'Ở đây tiền vào thông suốt, có nhiều nguồn thu; nên giữ lại một phần để lộc thành của để dành.',
      viec: 'Ở đây công việc thuận, dễ tăng thu nhập, có lợi khi làm kinh doanh hoặc dịch vụ.',
      tinh: 'Ở đây người trong cung này mang lại niềm vui hoặc lợi lộc cho mình; quan hệ có duyên.',
      benh: 'Ở đây bệnh tật được hóa giải bớt, có thầy có thuốc; nên tránh ăn uống quá độ.' },
    'Hóa Quyền': { than: 'Ở đây Quyền cho chủ kiến mạnh, thích tự quyết; dễ được giao vai trò dẫn dắt.',
      tien: 'Ở đây bạn tự chủ tài chính, giỏi điều phối tiền; chỉ nên tránh ôm hết mọi quyết định chi tiêu.',
      viec: 'Ở đây có thực quyền trong công việc, hợp vị trí quản lý hoặc chuyên gia đầu ngành.',
      tinh: 'Ở đây một bên dễ muốn làm chủ trong quan hệ; nên bàn bạc để tránh áp đặt.',
      benh: 'Ở đây bệnh đến thường rõ rệt nhưng sức chống đỡ tốt; nên khám định kỳ.' },
    'Hóa Khoa': { than: 'Ở đây Khoa cho học thức và tiếng tốt; gặp khó dễ có người đứng ra giúp.',
      tien: 'Ở đây tiền đến nhờ uy tín, bằng cấp; tài chính ổn định, ít rủi ro lớn.',
      viec: 'Ở đây lợi cho thi cử, bằng cấp, danh tiếng nghề nghiệp; hợp nghề chuyên môn, học thuật.',
      tinh: 'Ở đây người trong cung này lịch sự, có học; quan hệ êm đẹp, giữ được thể diện cho nhau.',
      benh: 'Ở đây Khoa là sao giải: bệnh dễ gặp thầy giỏi, chữa có kết quả.' },
    'Hóa Kỵ': { than: 'Ở đây Kỵ khiến hay lo nghĩ, dễ bị hiểu lầm; bù lại có chiều sâu và rất kiên trì khi đã quyết.',
      tien: 'Ở đây tiền vào ra trắc trở, dễ vướng nợ hoặc tranh chấp; nên giữ giấy tờ rõ ràng, hạn chế vay mượn.',
      viec: 'Ở đây công việc dễ gặp thị phi, trở ngại giấy tờ; làm kỹ, chậm mà chắc thì qua.',
      tinh: 'Ở đây quan hệ dễ có hiểu lầm, khúc mắc khó nói; nên nói thẳng sớm, đừng để dồn nén.',
      benh: 'Ở đây dễ có bệnh dai dẳng, khó chẩn đoán; đừng chủ quan với dấu hiệu nhỏ.' },
  };
  // Vòng Tràng Sinh: khí của cung đang ở giai đoạn nào
  const TRANG_SINH = {
    39: 'khí đang sinh: việc của cung này dễ nảy nở, có sức sống',
    40: 'khí như lúc tắm gội: chưa ổn định, dễ thay đổi, có phần lãng mạn',
    41: 'khí bắt đầu trưởng thành: có định hướng, đang chuẩn bị cho thành công',
    42: 'khí đang lên: có năng lực và chỗ đứng',
    43: 'khí cực thịnh: sức mạnh lớn nhất, nhưng cũng nên phòng thịnh quá hóa suy',
    44: 'khí bắt đầu suy: nên giữ gìn hơn là mở rộng',
    45: 'khí yếu: việc của cung này dễ trục trặc nhỏ',
    46: 'khí đã tắt: cung kém sinh khí, cần chủ động vun đắp',
    47: 'khí được cất giữ: lợi cho tích lũy, tính kín đáo',
    48: 'khí cạn: dễ đứt đoạn, cần kiên nhẫn làm lại',
    49: 'khí như mầm mới: nhiều ý tưởng nhưng chưa chắc chắn',
    50: 'khí được nuôi dưỡng: có người chăm lo, đang chuẩn bị lớn lên',
  };
  // Điểm tham khảo của sao khi ở trong cung; sao chiếu từ tam phương tính một nửa
  const DIEM = { 27: 2, 94: 2, 93: 1.5, 92: 1.5, 95: -2, 61: 1, 62: 1, 57: 1, 58: 1, 59: 1, 60: 1, 98: 0.5,
    52: -1.5, 51: -1.5, 53: -1.5, 54: -1.5, 55: -1, 56: -1, 73: -0.5, 74: -0.5, 104: -0.5, 99: -0.5, 69: -0.5, 70: -0.5,
    17: -0.5, 23: -0.5, 63: 0.5, 64: 0.5, 65: 0.5, 66: 0.5, 67: 0.5, 68: 0.5, 84: 0.5, 85: 0.5, 76: 0.5, 79: 0.5, 80: 0.5,
    71: 0.5, 72: 0.5, 81: 0.5, 82: 0.5, 83: 0.5, 100: 0.5, 101: 0.5 };
  const CHIEU = [27, 94, 93, 92, 61, 62, 57, 58, 59, 60, 98, 52, 51, 53, 54, 56, 55, 95]; // sao đáng kể khi chiếu
  const DIEM_DT = { M: 2, V: 2, Đ: 1, B: 0, H: -2 };
  const LOI_KHUYEN = {
    'Mệnh': ['Nền tảng bản thân tốt; hãy đặt mục tiêu dài hạn và dùng thế mạnh sẵn có.', 'Bạn phải tự rèn luyện nhiều hơn người; kiên trì, giữ sức khỏe và học kỹ năng sẽ bù được phần thiếu.'],
    'Phụ Mẫu': ['Được cha mẹ, người trên giúp đỡ; nên giữ liên lạc và học hỏi họ.', 'Quan hệ với cha mẹ, cấp trên cần nhẫn nại; giấy tờ, hợp đồng nên kiểm tra kỹ.'],
    'Phúc Đức': ['Phúc phần dày, tinh thần an ổn; làm việc thiện giúp giữ phúc lâu dài.', 'Tinh thần dễ bất an; nên giữ nếp sống điều độ, chăm lo gia đình, dòng họ và đời sống tinh thần.'],
    'Điền Trạch': ['Có duyên với nhà đất; có thể tính chuyện mua nhà, tích lũy tài sản cố định.', 'Nhà cửa dễ biến động; thận trọng khi mua bán đất và kiểm tra pháp lý kỹ.'],
    'Quan Lộc': ['Sự nghiệp có điểm tựa; nên mạnh dạn nhận trách nhiệm lớn hơn.', 'Công việc dễ trắc trở; nên chọn nghề hợp sở trường và tích lũy chuyên môn trước khi đổi việc.'],
    'Nô Bộc': ['Được bạn bè, đồng nghiệp hỗ trợ; nên mở rộng quan hệ, làm việc nhóm.', 'Dễ gặp người không hợp hoặc bị phụ lòng; nên chọn bạn mà chơi, rõ ràng chuyện tiền bạc với người ngoài.'],
    'Thiên Di': ['Ra ngoài gặp nhiều cơ hội; đi xa, làm ăn xa nhà có lợi.', 'Ra ngoài dễ gặp trở ngại; đi lại cẩn thận, giữ ý lời nói ở chỗ đông người.'],
    'Tật Ách': ['Sức khỏe nền khá; duy trì thói quen sống tốt là đủ.', 'Cần chú ý sức khỏe nhiều hơn; khám định kỳ và đừng bỏ qua dấu hiệu nhỏ.'],
    'Tài Bạch': ['Tài lộc thuận; nên lập kế hoạch tích lũy, đầu tư để giữ của.', 'Tiền bạc dễ hao; nên chi tiêu có kế hoạch, tránh vay mượn và đầu tư theo phong trào.'],
    'Tử Tức': ['Có duyên con cái, con cái là niềm vui; dạy con bằng sự gần gũi.', 'Việc con cái cần nhiều tâm sức; kiên nhẫn lắng nghe con và chăm lo sức khỏe sinh sản.'],
    'Phu Thê': ['Hôn nhân có nền tảng tốt; vun đắp bằng sự tôn trọng và chia sẻ.', 'Tình cảm dễ sóng gió; nên tìm hiểu kỹ trước khi cưới và học cách nhường nhịn.'],
    'Huynh Đệ': ['Anh chị em hòa thuận, giúp được nhau.', 'Anh chị em dễ bất đồng; tránh chung vốn làm ăn khi chưa rõ ràng.'],
  };
  const SINH = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
  const KHAC = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };
  /** Ngũ hành của sao so với hành của cung */
  function nguHanh(s, c) {
    const a = s.hanh, b = c.hanh;
    if (a === b) return `cùng hành ${a} với cung, sao ở đúng chỗ, phát huy ổn định`;
    if (SINH[b] === a) return `cung ${b} sinh sao ${a}, sao được nuôi dưỡng nên phát huy tốt hơn`;
    if (SINH[a] === b) return `sao ${a} sinh cung ${b}, sao phải bỏ sức cho cung nên hơi hao`;
    if (KHAC[a] === b) return `sao ${a} khắc cung ${b}, sao vẫn mạnh nhưng hay gây xáo trộn`;
    return `cung ${b} khắc sao ${a}, sao bị kìm, khó phát huy hết`;
  }
  const DT = { M: 'miếu', V: 'vượng', Đ: 'đắc', B: 'bình', H: 'hãm' };
  const HC = { Kim: 'K', Mộc: 'M', Thủy: 'T', Hỏa: 'H', Thổ: 'O' };

  const lech = (so, n) => ((so - 1 + n) % 12 + 12) % 12 + 1;
  const chinhCua = c => c.sao.filter(s => s.loai === 1);
  const tenSao = s => `<b class="${HC[s.hanh]}">${s.ten}</b>`;
  const dsChinh = c => chinhCua(c).map(s => s.ten).join(', ') || 'Vô chính diệu';
  const cungTai = (L, so) => L.cung[so - 1];

  function doanChinh(s, lv, muon, c) {
    const d = CHINH[s.id];
    const sang = s.dacTinh ? (/[MVĐ]/.test(s.dacTinh) ? ` Sao đang sáng (${DT[s.dacTinh]}) nên ${d.tot}.`
      : s.dacTinh === 'H' ? ` Sao đang hãm nên ${d.xau}.` : ' Sao ở mức bình hòa, tốt xấu tùy các sao đi cùng.') : '';
    return `<p>${tenSao(s)}${s.dacTinh ? ` <span class="lg-dt">${DT[s.dacTinh]}</span>` : ''}${s.hoa ? ` <span class="lg-dt">${s.hoa}</span>` : ''}: ${d.tinh}${muon ? '' : sang} ${d[lv === 'tinh' ? 'tinh2' : lv]}${c && s.hanh && c.hanh ? ` Về ngũ hành: ${nguHanh(s, c)}.` : ''}</p>`;
  }

  /** Đánh giá chung một cung: cộng điểm tham khảo từ độ sáng chính tinh, phụ tinh, sao chiếu; nêu lý do và lời khuyên */
  function danhGia(L, so, c, tpc) {
    // ponytail: thang điểm đơn giản để tóm tắt, không thay cách luận đầy đủ của thầy tử vi
    let diem = 0; const cong = [], tru = [];
    const ghi = (ten, d) => { if (d > 0) cong.push(ten); else if (d < 0) tru.push(ten); diem += d; };
    let chinh = chinhCua(c), heSo = 1;
    if (!chinh.length) { ghi('Vô chính diệu', -1); chinh = chinhCua(cungTai(L, lech(so, 6))); heSo = 0.5; }
    chinh.forEach(s => s.dacTinh && ghi(`${s.ten} ${DT[s.dacTinh]}${heSo < 1 ? ' (mượn)' : ''}`, DIEM_DT[s.dacTinh] * heSo));
    c.sao.forEach(s => DIEM[s.id] && ghi(s.ten, DIEM[s.id]));
    tpc.forEach(t => t.sao.forEach(s => CHIEU.includes(s.id) && ghi(`${s.ten} chiếu`, DIEM[s.id] / 2)));
    if (c.triet) diem *= 0.6; else if (c.tuan) diem *= 0.8;
    diem = Math.round(diem * 2) / 2;
    const muc = diem >= 5 ? 'Rất thuận' : diem >= 2 ? 'Khá tốt' : diem > -2 ? 'Trung bình, tốt xấu đan xen' : 'Nhiều thử thách';
    const lk = LOI_KHUYEN[c.ten];
    const khuyen = diem >= 0.5 ? lk[0] : lk[1];
    return `<h4>Đánh giá chung</h4><p><b>${muc}</b> <span class="lg-dt">điểm tham khảo ${diem > 0 ? '+' : ''}${String(diem).replace('.', ',')}</span></p><ul>`
      + (cong.length ? `<li>Điểm cộng: ${cong.join(', ')}.</li>` : '')
      + (tru.length ? `<li>Điểm trừ: ${tru.join(', ')}.</li>` : '')
      + (c.triet ? '<li>Có Triệt nên cả tốt lẫn xấu đều bị giảm bớt.</li>' : c.tuan ? '<li>Có Tuần nên cả tốt lẫn xấu đều giảm nhẹ.</li>' : '')
      + `</ul><p class="lg-note"><b>Lời khuyên:</b> ${khuyen}</p>`;
  }

  /** Trả về HTML luận giải của cung số `so` (1 = Tý) trên lá số L */
  function luanGiai(L, so) {
    const c = cungTai(L, so), lv = LINH_VUC[c.ten];
    const h = [];
    h.push(`<header><h3>Cung ${c.ten}${c.than ? ' <span class="than">Thân</span>' : ''}</h3><span class="lg-pos">tại ${c.chi} · hành ${c.hanh} · đại hạn ${c.daiHan}–${c.daiHan + 9} tuổi</span></header>`);
    h.push(`<p class="lg-intro">${CUNG_Y[c.ten]}</p>`);

    const chinh = chinhCua(c);
    h.push('<h4>Chính tinh</h4>');
    if (chinh.length) {
      chinh.forEach(s => h.push(doanChinh(s, lv, false, c)));
      if (chinh.length === 2) h.push(`<p>${CAP[chinh.map(s => s.id).sort((a, b) => a - b).join('-')]}</p>`);
      if (chinh.some(s => s.dacTinh)) h.push('<p class="lg-intro">Độ sáng của sao theo vị trí: miếu, vượng, đắc là sáng (mặt tốt nổi lên); bình là trung tính; hãm là tối (mặt xấu dễ lộ ra).</p>');
    }
    else {
      const xung = cungTai(L, lech(so, 6)), muon = chinhCua(xung);
      h.push(`<p>Cung không có chính tinh (Vô chính diệu), nên mượn sao của cung xung chiếu ${xung.ten} tại ${xung.chi}. Ảnh hưởng của sao mượn yếu hơn, vì vậy các phụ tinh trong cung có vai trò lớn hơn.</p>`);
      muon.forEach(s => h.push(doanChinh(s, lv, true)));
      if (c.tuan || c.triet || c.sao.some(s => s.id === 53 || s.id === 54))
        h.push('<p>Sách cổ cho rằng cung Vô chính diệu gặp Tuần, Triệt hoặc Địa Không, Địa Kiếp lại thuận hơn bình thường.</p>');
    }

    const ids = new Set(c.sao.map(s => s.id));
    const ten = id => c.sao.find(s => s.id === id).ten;
    const HOA = [94, 93, 92, 95].filter(id => ids.has(id));
    if (HOA.length) h.push(`<h4>Tứ Hóa</h4><ul>${HOA.map(id => {
      const t = ten(id), mang = c.sao.find(s => s.hoa === t), g = PHU.find(x => x[0].includes(id));
      return `<li><b>${t}</b>${mang ? ` (đi theo ${mang.ten})` : ''}: ${g[2]}. ${HOA_LV[t][lv]}</li>`;
    }).join('')}</ul>`);
    const nhom = tot => PHU.filter(g => g[1] === tot && g[0].some(id => ids.has(id) && !HOA.includes(id)))
      .map(g => `<li><b>${g[0].filter(id => ids.has(id)).map(ten).join(', ')}</b>: ${g[2]}.</li>`);
    const tot = nhom(true), xau = nhom(false);
    if (tot.length) h.push(`<h4>Sao hỗ trợ</h4><ul>${tot.join('')}</ul>`);
    if (xau.length) h.push(`<h4>Sao cần lưu ý</h4><ul>${xau.join('')}</ul>`);
    if (c.triet) h.push('<p class="lg-note"><b>Triệt</b> đóng ở cung này: sức của các sao bị chặn bớt, rõ nhất ở nửa đầu đời (trước khoảng 30 tuổi). Sao tốt bớt tốt, sao xấu cũng bớt xấu.</p>');
    if (c.tuan) h.push('<p class="lg-note"><b>Tuần</b> đóng ở cung này: tác dụng giống Triệt nhưng nhẹ hơn, rõ hơn ở nửa sau cuộc đời.</p>');

    const ts = c.sao.find(s => TRANG_SINH[s.id]);
    if (ts) h.push(`<p>Vòng Tràng Sinh: cung gặp <b>${ts.ten}</b>, ${TRANG_SINH[ts.id]}.</p>`);

    const tpc = [4, 8, 6].map(n => cungTai(L, lech(so, n)));
    const chieu = tot => tpc.flatMap(t => t.sao.filter(s => CHIEU.includes(s.id) && (DIEM[s.id] > 0) === tot).map(s => `${s.ten} (${t.ten})`));
    const ct = chieu(true), cx = chieu(false);
    if (ct.length || cx.length) h.push(`<h4>Sao chiếu từ tam phương tứ chính</h4><p>Ảnh hưởng yếu hơn sao nằm trong cung, khoảng một nửa.${ct.length ? ` Sao tốt chiếu về: <b>${ct.join(', ')}</b>.` : ''}${cx.length ? ` Sao xấu chiếu về: <b>${cx.join(', ')}</b>.` : ''}</p>`);

    if (c.ten === 'Mệnh') {
      const than = L.cung[L.than - 1];
      const ex = [THAN_CU[than.ten], `Bản mệnh ${L.banMenh}, ${L.cuc}: ${L.sinhKhac.toLowerCase()}, ${SINH_KHAC[L.sinhKhac]}.`,
        `${L.thuanLy}: ${L.thuanLy.endsWith('thuận lý') ? 'tuổi và cung Mệnh cùng âm dương, mọi việc dễ xuôi hơn.' : 'tuổi và cung Mệnh khác âm dương, hay phải xoay xở nhiều hơn.'}`];
      ex.push(`Mệnh chủ <b>${L.menhChu}</b> là sao chủ về tính cách gốc; Thân chủ <b>${L.thanChu}</b> là sao chủ về cách bạn hành xử khi đã trưởng thành. Hai sao này mạnh ở đâu trên lá số thì phần đời đó của bạn nổi bật.`);
      const quanh = [0, 4, 8, 6].flatMap(n => chinhCua(cungTai(L, lech(so, n))).map(s => s.id));
      CACH.forEach(([ids2, ten2, y]) => { if (ids2.every(id => quanh.includes(id))) ex.push(`Tam phương tứ chính hội đủ bộ <b>${ten2}</b>: ${y}`); });
      h.push(`<h4>Tổng quan</h4><ul>${ex.map(x => `<li>${x}</li>`).join('')}</ul>`);
    }
    h.push(danhGia(L, so, c, tpc));
    if (c.ten === 'Tật Ách') h.push('<p class="lg-note">Phần sức khỏe là liên hệ theo sách cổ, không thay cho lời khuyên của bác sĩ.</p>');

    const tp = [4, 8].map(n => cungTai(L, lech(so, n))), xc = cungTai(L, lech(so, 6));
    h.push(`<p class="lg-tp">Nên xem cùng tam hợp ${tp.map(t => `<b>${t.ten}</b> (${dsChinh(t)})`).join(' và ')}, xung chiếu <b>${xc.ten}</b> (${dsChinh(xc)}).</p>`);
    return h.join('\n');
  }

  const THU_TU = ['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Phu Thê', 'Thiên Di', 'Phúc Đức', 'Điền Trạch', 'Tật Ách', 'Tử Tức', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'];

  // ---------- Nội dung sửa được từ trang quản trị ----------
  const TEN_CHINH = { 1: 'Tử Vi', 2: 'Liêm Trinh', 3: 'Thiên Đồng', 4: 'Vũ Khúc', 5: 'Thái Dương', 6: 'Thiên Cơ', 7: 'Thiên Phủ',
    8: 'Thái Âm', 9: 'Tham Lang', 10: 'Cự Môn', 11: 'Thiên Tướng', 12: 'Thiên Lương', 13: 'Thất Sát', 14: 'Phá Quân' };
  const TRUONG = { tinh: 'Bản chất', tot: 'Khi sáng (nối sau "Sao đang sáng nên")', xau: 'Khi hãm (nối sau "Sao đang hãm nên")',
    than: 'Ở cung Mệnh, Phúc Đức', tien: 'Ở cung Tài Bạch, Điền Trạch', viec: 'Ở cung Quan Lộc, Thiên Di, Nô Bộc',
    tinh2: 'Ở cung Phu Thê, Tử Tức, Phụ Mẫu, Huynh Đệ', benh: 'Ở cung Tật Ách' };
  const PHU_TEN = ['Tả Phù, Hữu Bật', 'Văn Xương, Văn Khúc', 'Thiên Khôi, Thiên Việt', 'Lộc Tồn', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa',
    'Thiên Mã', 'Thiên Quan, Thiên Phúc', 'Ân Quang, Thiên Quý', 'Tam Thai, Bát Tọa', 'Thai Phụ, Phong Cáo', 'Quốc Ấn',
    'Long Trì, Phượng Các', 'Hồng Loan, Thiên Hỷ', 'Thiên Đức, Nguyệt Đức, Giải Thần, Thiên Giải, Địa Giải', 'Thiên Trù',
    'Kình Dương, Đà La', 'Địa Không, Địa Kiếp', 'Hỏa Tinh, Linh Tinh', 'Hóa Kỵ', 'Thiên Hình', 'Thiên Riêu, Đào Hoa',
    'Cô Thần, Quả Tú', 'Thiên Khốc, Thiên Hư', 'Tang Môn, Bạch Hổ', 'Kiếp Sát', 'Phá Toái', 'Đại Hao, Tiểu Hao', 'Thiên La, Địa Võng'];
  const MAC_DINH = JSON.parse(JSON.stringify({ CUNG_Y, CHINH, PHU }));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** Danh sách các đoạn chữ sửa được: [{ khoa, nhom, nhan, macDinh }] */
  function danhMuc() {
    const out = [];
    Object.keys(MAC_DINH.CUNG_Y).forEach(t => out.push({ khoa: `cung.${t}`, nhom: '12 cung', nhan: `Cung ${t}`, macDinh: MAC_DINH.CUNG_Y[t] }));
    Object.keys(MAC_DINH.CHINH).forEach(id => Object.keys(TRUONG).forEach(f =>
      out.push({ khoa: `chinh.${id}.${f}`, nhom: TEN_CHINH[id], nhan: TRUONG[f], macDinh: MAC_DINH.CHINH[id][f] })));
    MAC_DINH.PHU.forEach((g, i) => out.push({ khoa: `phu.${i}`, nhom: 'Phụ tinh', nhan: `${PHU_TEN[i]} (${g[1] ? 'hỗ trợ' : 'cần lưu ý'})`, macDinh: g[2] }));
    return out;
  }
  /** Dùng các đoạn đã sửa { khoa: chữ }; khóa vắng mặt thì về mặc định. Chữ sửa được escape vì sẽ chèn vào HTML. */
  function apDung(ghiDe) {
    const g = ghiDe || {}, lay = (k, md) => Object.prototype.hasOwnProperty.call(g, k) ? esc(g[k]) : md;
    Object.keys(CUNG_Y).forEach(t => { CUNG_Y[t] = lay(`cung.${t}`, MAC_DINH.CUNG_Y[t]); });
    Object.keys(CHINH).forEach(id => Object.keys(TRUONG).forEach(f => { CHINH[id][f] = lay(`chinh.${id}.${f}`, MAC_DINH.CHINH[id][f]); }));
    PHU.forEach((p, i) => { p[2] = lay(`phu.${i}`, MAC_DINH.PHU[i][2]); });
  }

  const LuanGiai = { luanGiai, THU_TU, danhMuc, apDung };
  if (typeof module !== 'undefined' && module.exports) module.exports = LuanGiai; else root.LuanGiai = LuanGiai;
})(typeof window !== 'undefined' ? window : globalThis);
