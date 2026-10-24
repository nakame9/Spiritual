/* Thần số học Pythagoras theo cách phổ biến ở Việt Nam: số chủ đạo (2–11, 22/4), các chỉ số ngày sinh, thái độ, tên,
 * biểu đồ ngày sinh với 8 mũi tên, năm/tháng/ngày cá nhân. Nội dung tự biên soạn, chỉ để tham khảo.
 * Dùng chung cho trình duyệt (global SoHoc) và backend (require). */
(function (root) {
  'use strict';
  const tongChuSo = n => String(n).split('').reduce((s, c) => s + Number(c), 0);
  /** Rút gọn tới 1–9, giữ lại các số trong `giu` (ví dụ 11, 22) */
  function rutGon(n, giu = []) { while (n > 9 && !giu.includes(n)) n = tongChuSo(n); return n; }
  const hienSo = n => n === 22 ? '22/4' : String(n);

  // ---------- Số chủ đạo ----------
  const SO_CHU_DAO = {
    2: { ten: 'Người kết nối', tuKhoa: 'trực giác, nhạy cảm, hợp tác, hòa giải',
      tongQuan: 'Số 2 mang năng lượng của sự kết nối và cảm nhận. Bạn có trực giác tốt, đọc được cảm xúc của người khác và thường là người giữ hòa khí trong tập thể. Bạn làm việc tốt nhất khi có người đồng hành, và thành công đến từ sự kiên nhẫn hơn là sự vội vàng.',
      diemManh: ['Trực giác nhạy bén, hiểu người khác nhanh', 'Hòa nhã, giỏi hợp tác và hòa giải', 'Chu đáo, để ý chi tiết', 'Kiên nhẫn, biết lắng nghe'],
      diemYeu: ['Dễ tổn thương, hay suy nghĩ quá nhiều', 'Thiếu tự tin khi phải tự quyết', 'Ngại va chạm nên đôi khi chịu thiệt', 'Phụ thuộc vào sự công nhận của người khác'],
      tinhYeu: 'Trong tình yêu, số 2 dịu dàng, tinh tế và hết lòng. Bạn cần cảm giác được quan tâm thường xuyên và một người biết nói lời yêu thương; sự lạnh nhạt làm bạn tổn thương sâu.',
      suNghiep: 'Bạn hợp với công việc cần sự khéo léo, lắng nghe và phối hợp: vai trò cố vấn, trợ lý, người đứng sau giúp tập thể vận hành trơn tru.',
      nghe: ['Tư vấn, tâm lý', 'Ngoại giao, quan hệ khách hàng', 'Nhân sự', 'Chăm sóc sức khỏe', 'Nghệ thuật, âm nhạc'],
      loiKhuyen: 'Hãy tin vào trực giác của mình và tập nói "không" khi cần; giá trị của bạn không phụ thuộc vào việc làm vừa lòng tất cả mọi người.',
      giaoTiep: 'Bạn nói nhẹ nhàng, khéo chọn lời và lắng nghe nhiều hơn nói. Bạn dễ đọc được ẩn ý của người khác nhưng lại ngại nói thẳng điều mình muốn.',
      camXuc: 'Cảm xúc của bạn sâu và dễ dao động theo không khí xung quanh. Một lời nói vô tâm có thể làm bạn buồn cả ngày; một lời ghi nhận nhỏ cũng đủ làm bạn vui.',
      lamViec: 'Bạn làm việc cẩn thận, chu đáo, thích có người đồng hành và hướng dẫn rõ ràng. Bạn là chất keo giữ cho cả nhóm gắn kết.',
      baiHoc: 'Bài học của số 2 là tin vào giá trị của chính mình: hòa hợp thật sự không có nghĩa là lúc nào cũng nhường nhịn.',
      cauHoi: ['Gần đây mình đã nói "có" với điều gì trong khi lòng muốn nói "không"?', 'Nếu không cần ai đồng ý, mình sẽ chọn điều gì cho bản thân?', 'Trực giác của mình đã đúng trong những lần nào mà mình lại bỏ qua?'],
      thienHuong: { tinhCam: 1, suNghiep: 0, mayMan: 0 } },
    3: { ten: 'Người sáng tạo', tuKhoa: 'trí tuệ, hài hước, sáng tạo, giao tiếp',
      tongQuan: 'Số 3 là con số của trí tuệ và sự biểu đạt. Bạn suy nghĩ nhanh, giàu ý tưởng, nói chuyện có duyên và thích mang niềm vui cho người khác. Bạn học tốt khi được hứng thú, và cần một nơi để thể hiện bản thân.',
      diemManh: ['Nhanh trí, nhiều ý tưởng', 'Hài hước, giao tiếp có duyên', 'Lạc quan, truyền năng lượng tích cực', 'Có khiếu nghệ thuật và ngôn ngữ'],
      diemYeu: ['Dễ phân tán, khó theo đuổi đến cùng', 'Hay phán xét, nói trước nghĩ sau', 'Thiếu kiên nhẫn với việc lặp lại', 'Che giấu cảm xúc thật sau tiếng cười'],
      tinhYeu: 'Số 3 yêu bằng sự vui vẻ và những cuộc trò chuyện thú vị. Bạn cần một người hiểu sự hài hước của mình, cùng bạn trải nghiệm và không làm cuộc sống trở nên nặng nề.',
      suNghiep: 'Bạn tỏa sáng trong công việc cần sáng tạo, trình bày và truyền đạt. Môi trường quá gò bó sẽ làm mất đi năng lượng tốt nhất của bạn.',
      nghe: ['Truyền thông, báo chí', 'Giáo dục, đào tạo', 'Viết lách, xuất bản', 'Marketing, quảng cáo', 'Nghệ thuật biểu diễn'],
      loiKhuyen: 'Chọn ít việc hơn và làm tới nơi tới chốn; tài năng của bạn cần sự bền bỉ mới thành quả ngọt.',
      giaoTiep: 'Bạn nói chuyện có duyên, dí dỏm và dễ cuốn người nghe. Lời nói thường nhanh hơn suy nghĩ nên đôi khi bạn vô tình làm người khác tự ái.',
      camXuc: 'Bề ngoài bạn vui vẻ, nhưng bên trong có những nỗi buồn ít khi nói ra. Bạn hay dùng tiếng cười để che đi lúc mình mệt mỏi.',
      lamViec: 'Bạn làm việc theo cảm hứng, nhiều ý tưởng, giỏi khởi động và trình bày. Bạn cần sự đa dạng và một người giúp theo dõi tiến độ.',
      baiHoc: 'Bài học của số 3 là tập trung và bền bỉ: biến những ý tưởng hay thành việc làm trọn vẹn.',
      cauHoi: ['Ý tưởng nào mình đã bắt đầu rồi bỏ dở, và vì sao?', 'Mình đang dùng sự vui vẻ để tránh nói về cảm xúc nào?', 'Một lời nói gần đây của mình có làm ai tổn thương không?'],
      thienHuong: { tinhCam: 0, suNghiep: 0, mayMan: 1 } },
    4: { ten: 'Người xây dựng', tuKhoa: 'thực tế, kỷ luật, chăm chỉ, đáng tin',
      tongQuan: 'Số 4 là nền móng vững chắc. Bạn thực tế, có tổ chức, làm việc chăm chỉ và giữ lời hứa. Bạn thích mọi thứ rõ ràng, có kế hoạch, và thành công đến từ sự bền bỉ qua năm tháng.',
      diemManh: ['Kỷ luật, có trách nhiệm', 'Thực tế, giỏi tổ chức', 'Đáng tin, trung thực', 'Bền bỉ với mục tiêu dài hạn'],
      diemYeu: ['Cứng nhắc, ngại thay đổi', 'Quá nghiêm khắc với bản thân và người khác', 'Khó bày tỏ cảm xúc', 'Dễ làm việc quá sức'],
      tinhYeu: 'Số 4 yêu bằng sự chung thủy và trách nhiệm. Bạn thể hiện tình cảm qua việc làm cụ thể, cần sự ổn định và một người đáng tin để cùng xây dựng tương lai.',
      suNghiep: 'Bạn hợp với công việc cần quy trình, độ chính xác và sự kiên trì. Bạn là người biến kế hoạch thành kết quả thực tế.',
      nghe: ['Kỹ thuật, xây dựng', 'Kế toán, tài chính', 'Quản lý vận hành', 'Công nghệ thông tin', 'Hành chính, pháp lý'],
      loiKhuyen: 'Hãy cởi mở với cái mới và cho phép mình nghỉ ngơi; sự linh hoạt sẽ làm nền móng của bạn thêm vững.',
      giaoTiep: 'Bạn nói thẳng, ngắn gọn và đúng trọng tâm. Bạn tin vào việc làm hơn lời nói, nên đôi khi người khác thấy bạn khô khan.',
      camXuc: 'Bạn giữ cảm xúc khá kín và ổn định. Bạn ít khi bộc lộ, nhưng khi dồn nén lâu có thể bùng lên bất ngờ.',
      lamViec: 'Bạn làm việc có kế hoạch, đúng giờ, chú ý chi tiết và theo quy trình. Bạn là người đảm bảo công việc được hoàn thành.',
      baiHoc: 'Bài học của số 4 là sự linh hoạt: kế hoạch tốt nhất vẫn cần chừa chỗ cho thay đổi và nghỉ ngơi.',
      cauHoi: ['Điều gì sẽ xảy ra nếu mình làm một việc mà không lên kế hoạch trước?', 'Lần gần nhất mình nói cho người thân biết mình cảm thấy thế nào là khi nào?', 'Mình đang khắt khe với ai, và điều đó có thật sự cần thiết không?'],
      thienHuong: { tinhCam: 0, suNghiep: 1, mayMan: 0 } },
    5: { ten: 'Người tự do', tuKhoa: 'tự do, trải nghiệm, linh hoạt, yêu thương',
      tongQuan: 'Số 5 là con số của tự do và cảm xúc. Bạn ham trải nghiệm, thích nghi nhanh, yêu thương nồng nhiệt và học nhiều nhất qua những điều đã tự mình trải qua. Bạn cần không gian để là chính mình.',
      diemManh: ['Linh hoạt, thích nghi nhanh', 'Giàu cảm xúc và lòng yêu thương', 'Dám trải nghiệm, ham khám phá', 'Hoạt bát, dễ kết bạn'],
      diemYeu: ['Bốc đồng, dễ chán', 'Ngại cam kết, sợ bị ràng buộc', 'Cảm xúc thất thường', 'Khó duy trì kỷ luật'],
      tinhYeu: 'Số 5 yêu nồng nhiệt và giàu cảm xúc. Bạn cần một người tôn trọng tự do của mình, cùng bạn khám phá cuộc sống thay vì giữ chặt.',
      suNghiep: 'Bạn hợp với công việc nhiều thay đổi, di chuyển và tiếp xúc con người. Công việc đơn điệu lặp lại sẽ khiến bạn mất động lực.',
      nghe: ['Du lịch, khách sạn', 'Kinh doanh, bán hàng', 'Truyền thông, sự kiện', 'Thể thao', 'Nghệ thuật, nhiếp ảnh'],
      loiKhuyen: 'Tự do thật sự đến từ kỷ luật; hãy giữ một vài thói quen cố định để năng lượng của bạn không bị phân tán.',
      giaoTiep: 'Bạn nói chuyện cởi mở, hoạt bát, dễ bắt chuyện với người lạ. Bạn thích chủ đề mới và nhanh chán những cuộc trò chuyện lặp lại.',
      camXuc: 'Cảm xúc của bạn mạnh và thay đổi nhanh: vui đó rồi buồn đó. Bạn cần được tự do bày tỏ, và dễ ngột ngạt khi bị kiểm soát.',
      lamViec: 'Bạn làm việc linh hoạt, xử lý tình huống nhanh, hợp với việc nhiều thay đổi. Bạn ít hứng thú với giấy tờ và quy trình dài.',
      baiHoc: 'Bài học của số 5 là tự do đi cùng trách nhiệm: dám cam kết với điều mình đã chọn.',
      cauHoi: ['Mình đang né tránh cam kết nào vì sợ mất tự do?', 'Trải nghiệm nào gần đây thật sự làm mình trưởng thành hơn?', 'Một thói quen nhỏ nào có thể giúp cuộc sống của mình ổn định hơn?'],
      thienHuong: { tinhCam: 1, suNghiep: -1, mayMan: 1 } },
    6: { ten: 'Người chăm sóc', tuKhoa: 'yêu thương, trách nhiệm, sáng tạo, gia đình',
      tongQuan: 'Số 6 mang năng lượng của tình yêu thương và trách nhiệm. Bạn sáng tạo, có óc thẩm mỹ, luôn muốn chăm lo cho người thân và cộng đồng. Gia đình và các mối quan hệ là nguồn động lực lớn nhất của bạn.',
      diemManh: ['Giàu lòng yêu thương, biết chăm sóc', 'Có trách nhiệm với gia đình và tập thể', 'Sáng tạo, có óc thẩm mỹ', 'Đáng tin, sẵn lòng giúp đỡ'],
      diemYeu: ['Hay lo lắng, ôm đồm việc của người khác', 'Cầu toàn, khó hài lòng', 'Dễ hy sinh quá mức', 'Có lúc áp đặt vì muốn tốt cho người khác'],
      tinhYeu: 'Số 6 yêu hết lòng và hướng tới gia đình. Bạn chăm sóc người yêu chu đáo, cần sự trân trọng và một mái ấm bình yên.',
      suNghiep: 'Bạn hợp với công việc chăm sóc, giáo dục, sáng tạo và phục vụ cộng đồng; nơi bạn thấy mình có ích cho người khác.',
      nghe: ['Y tế, điều dưỡng', 'Giáo dục', 'Thiết kế, nghệ thuật', 'Nhà hàng, ẩm thực', 'Công tác xã hội'],
      loiKhuyen: 'Chăm sóc người khác bắt đầu từ việc chăm sóc chính mình; hãy để mọi người tự chịu trách nhiệm với cuộc sống của họ.',
      giaoTiep: 'Bạn nói chuyện ân cần, hay hỏi han và khuyên bảo. Đôi khi lời khuyên của bạn đến trước khi người khác cần, khiến họ thấy bị can thiệp.',
      camXuc: 'Bạn giàu cảm xúc và rất gắn bó với người thân. Bạn dễ lo lắng cho người khác, và buồn khi sự quan tâm của mình không được đáp lại.',
      lamViec: 'Bạn làm việc tận tâm, có trách nhiệm, chăm chút để kết quả đẹp và chu đáo. Bạn làm tốt nhất khi thấy công việc có ích cho người khác.',
      baiHoc: 'Bài học của số 6 là yêu thương mà không ôm đồm: chăm sóc chính mình và để người khác tự lớn lên.',
      cauHoi: ['Mình đang gánh việc của ai mà lẽ ra họ nên tự làm?', 'Lần cuối mình dành thời gian chăm sóc bản thân là khi nào?', 'Mình mong được đáp lại điều gì khi giúp đỡ người khác?'],
      thienHuong: { tinhCam: 1, suNghiep: 0, mayMan: 0 } },
    7: { ten: 'Người tìm kiếm', tuKhoa: 'học hỏi, chiêm nghiệm, độc lập, trải nghiệm',
      tongQuan: 'Số 7 là con số của việc học qua trải nghiệm và chiêm nghiệm. Bạn độc lập, sâu sắc, thích tìm hiểu bản chất sự việc. Cuộc đời bạn thường có những bài học lớn, và mỗi lần vượt qua bạn lại hiểu mình hơn.',
      diemManh: ['Sâu sắc, có óc phân tích', 'Độc lập, tự học giỏi', 'Kiên cường sau thất bại', 'Trực giác và đời sống tinh thần phong phú'],
      diemYeu: ['Khép kín, khó chia sẻ', 'Hoài nghi, khó tin người', 'Dễ cô đơn', 'Hay tự học bằng cách vấp ngã thay vì nghe lời khuyên'],
      tinhYeu: 'Số 7 cần thời gian và sự tin tưởng mới mở lòng. Bạn trân trọng một người tôn trọng không gian riêng và có thể trò chuyện sâu sắc cùng bạn.',
      suNghiep: 'Bạn hợp với công việc chuyên môn sâu, nghiên cứu và giảng dạy; nơi được làm việc độc lập và đào sâu vấn đề.',
      nghe: ['Nghiên cứu khoa học', 'Giảng dạy', 'Tâm lý, triết học', 'Phân tích dữ liệu', 'Viết lách'],
      loiKhuyen: 'Hãy cho phép người khác giúp mình và chia sẻ nhiều hơn; không phải bài học nào cũng cần tự trải qua mới hiểu.',
      giaoTiep: 'Bạn ít nói, chọn lọc lời và thích những cuộc trò chuyện có chiều sâu. Bạn hay đặt câu hỏi và cần thời gian trước khi chia sẻ suy nghĩ.',
      camXuc: 'Bạn giữ cảm xúc cho riêng mình và cần không gian yên tĩnh để tự cân bằng. Bạn có thể thấy cô đơn ngay cả khi ở giữa đám đông.',
      lamViec: 'Bạn làm việc độc lập, đào sâu, phân tích kỹ trước khi kết luận. Bạn cần được tự chủ và không thích bị giám sát sát sao.',
      baiHoc: 'Bài học của số 7 là niềm tin: mở lòng với người khác và học từ kinh nghiệm của họ, không chỉ từ vấp ngã của mình.',
      cauHoi: ['Có điều gì mình đang giữ trong lòng mà nên chia sẻ với một người tin cậy?', 'Bài học lớn nhất mình rút ra từ một lần thất bại là gì?', 'Mình có đang nghi ngờ ai chỉ vì chưa hiểu họ?'],
      thienHuong: { tinhCam: -1, suNghiep: 0, mayMan: 0 } },
    8: { ten: 'Người lãnh đạo', tuKhoa: 'độc lập, quyết đoán, tài chính, quản lý',
      tongQuan: 'Số 8 mang năng lượng của sự độc lập, quyền lực và vật chất. Bạn quyết đoán, có đầu óc kinh doanh, biết quản lý tiền bạc và con người. Bạn cảm nhận tình yêu sâu sắc nhưng thường thể hiện bằng hành động hơn lời nói.',
      diemManh: ['Quyết đoán, tự lập', 'Giỏi quản lý tài chính', 'Có khả năng lãnh đạo', 'Bền bỉ, chịu được áp lực'],
      diemYeu: ['Cứng rắn, ít bộc lộ cảm xúc', 'Quá đặt nặng thành công vật chất', 'Khó nhờ vả người khác', 'Có lúc độc đoán'],
      tinhYeu: 'Số 8 yêu sâu sắc nhưng kín đáo. Bạn cần một người hiểu rằng sự chăm lo thực tế của mình chính là cách nói yêu thương.',
      suNghiep: 'Bạn hợp với vai trò quản lý, kinh doanh và tài chính; càng được tự chủ, bạn càng đạt kết quả lớn.',
      nghe: ['Kinh doanh, khởi nghiệp', 'Tài chính, ngân hàng', 'Quản lý doanh nghiệp', 'Bất động sản', 'Luật'],
      loiKhuyen: 'Thành công trọn vẹn khi có cả cảm xúc; hãy để người thân thấy được sự dịu dàng bên trong bạn.',
      giaoTiep: 'Bạn nói chuyện dứt khoát, rõ ràng và có sức thuyết phục. Bạn đi thẳng vào vấn đề, đôi khi khiến người khác thấy áp lực.',
      camXuc: 'Bạn cảm nhận sâu nhưng ít thể hiện, coi trọng sự mạnh mẽ và ngại để lộ điểm yếu. Bạn thể hiện tình cảm bằng cách lo lắng thực tế cho người thân.',
      lamViec: 'Bạn làm việc có mục tiêu, giỏi quản lý nguồn lực và ra quyết định. Bạn hợp với vai trò dẫn dắt và chịu trách nhiệm về kết quả.',
      baiHoc: 'Bài học của số 8 là cân bằng giữa vật chất và tinh thần: thành công trọn vẹn khi đi cùng sự rộng lượng và dịu dàng.',
      cauHoi: ['Ngoài tiền bạc và vị trí, thành công với mình còn nghĩa là gì?', 'Mình đã để ai thấy được lúc mình yếu lòng chưa?', 'Có lúc nào mình quyết định thay người khác mà không hỏi ý họ?'],
      thienHuong: { tinhCam: -1, suNghiep: 1, mayMan: 1 } },
    9: { ten: 'Người lý tưởng', tuKhoa: 'lý tưởng, trách nhiệm, nhân ái, tham vọng',
      tongQuan: 'Số 9 là con số của lý tưởng và lòng nhân ái. Bạn có trách nhiệm, nhiều hoài bão, muốn làm điều có ý nghĩa cho cộng đồng. Bạn thường được người khác tin tưởng giao việc lớn.',
      diemManh: ['Có lý tưởng sống rõ ràng', 'Nhân ái, bao dung', 'Có trách nhiệm, đáng tin', 'Tầm nhìn rộng, nhiều hoài bão'],
      diemYeu: ['Mơ mộng, xa thực tế', 'Ôm đồm quá nhiều trách nhiệm', 'Dễ thất vọng khi người khác không như kỳ vọng', 'Khó buông bỏ quá khứ'],
      tinhYeu: 'Số 9 yêu bao dung và lý tưởng. Bạn cần một người cùng chia sẻ giá trị sống và ủng hộ những hoài bão lớn của mình.',
      suNghiep: 'Bạn hợp với công việc có ý nghĩa xã hội, cần tầm nhìn và khả năng truyền cảm hứng cho nhiều người.',
      nghe: ['Lãnh đạo tổ chức', 'Giáo dục, y tế', 'Hoạt động xã hội', 'Nghệ thuật', 'Luật, chính sách'],
      loiKhuyen: 'Hãy đặt mục tiêu vừa tầm và chăm sóc bản thân; bạn không cần gánh cả thế giới một mình.',
      giaoTiep: 'Bạn nói chuyện bao dung, rộng lượng và thích bàn về lý tưởng, ý nghĩa cuộc sống. Bạn truyền được cảm hứng nhưng đôi khi nói xa thực tế.',
      camXuc: 'Bạn giàu lòng trắc ẩn và dễ xúc động trước nỗi khổ của người khác. Bạn hay giữ lại những tổn thương cũ và khó buông bỏ.',
      lamViec: 'Bạn làm việc với tầm nhìn rộng, quan tâm đến ý nghĩa và ảnh hưởng của công việc. Bạn giỏi dẫn dắt tập thể hướng về một mục tiêu chung.',
      baiHoc: 'Bài học của số 9 là buông bỏ: khép lại những gì đã qua để có chỗ cho điều mới.',
      cauHoi: ['Mình đang giữ lại nỗi buồn hay mối quan hệ nào đã không còn phù hợp?', 'Mục tiêu nào của mình vừa có ý nghĩa vừa làm được ngay trong năm nay?', 'Mình có đang kỳ vọng người khác sống theo lý tưởng của mình?'],
      thienHuong: { tinhCam: 0, suNghiep: 1, mayMan: 0 } },
    10: { ten: 'Người thích nghi', tuKhoa: 'thích nghi, tự tin, hòa đồng, khởi đầu',
      tongQuan: 'Số 10 là sự kết hợp giữa năng lượng khởi đầu của số 1 và vòng tròn trọn vẹn của số 0. Bạn thích nghi nhanh với mọi hoàn cảnh, tự tin, hòa đồng và dễ được yêu mến. Bạn có khả năng bắt đầu lại sau mỗi lần vấp ngã.',
      diemManh: ['Thích nghi nhanh, xoay xở giỏi', 'Tự tin, hòa đồng', 'Lạc quan, dễ bắt đầu lại', 'Làm được nhiều loại việc'],
      diemYeu: ['Thiếu kiên định, dễ đổi hướng', 'Hay chạy theo nhiều mục tiêu cùng lúc', 'Cả nể', 'Có lúc chủ quan vì mọi việc đến dễ dàng'],
      tinhYeu: 'Số 10 yêu cởi mở và vui vẻ. Bạn cần một người đồng hành vững vàng, giúp bạn giữ hướng đi khi có quá nhiều lựa chọn.',
      suNghiep: 'Bạn hợp với môi trường năng động, nhiều cơ hội; khả năng thích nghi giúp bạn thành công ở nhiều lĩnh vực khác nhau.',
      nghe: ['Kinh doanh', 'Quản lý dự án', 'Truyền thông', 'Bán hàng, dịch vụ', 'Nghệ thuật, giải trí'],
      loiKhuyen: 'Chọn một hướng đi chính và theo đuổi đủ lâu; sự linh hoạt của bạn sẽ có giá trị hơn khi có điểm tựa.',
      giaoTiep: 'Bạn nói chuyện tự tin, cởi mở và dễ hòa vào mọi nhóm. Bạn biết điều chỉnh cách nói cho hợp với từng người nghe.',
      camXuc: 'Bạn lạc quan và nhanh lấy lại tinh thần sau chuyện buồn. Tuy vậy, bạn dễ bỏ qua cảm xúc của chính mình để tiếp tục bước tới.',
      lamViec: 'Bạn làm việc linh hoạt, học nhanh và xoay xở tốt trong môi trường mới. Bạn cần mục tiêu rõ ràng để không bị cuốn vào quá nhiều việc.',
      baiHoc: 'Bài học của số 10 là sự kiên định: chọn một hướng đi và theo đuổi đủ lâu để thấy kết quả.',
      cauHoi: ['Trong những việc đang làm, việc nào thật sự quan trọng nhất với mình?', 'Lần đổi hướng gần nhất là vì gặp khó hay vì mình thật sự muốn đổi?', 'Có cảm xúc nào mình đã gạt đi để tiếp tục bận rộn?'],
      thienHuong: { tinhCam: 0, suNghiep: 0, mayMan: 1 } },
    11: { ten: 'Người truyền cảm hứng', tuKhoa: 'trực giác mạnh, tâm linh, truyền cảm hứng, nhạy cảm',
      tongQuan: 'Số 11 là con số bậc thầy về trực giác và đời sống tinh thần. Bạn nhạy cảm, có tầm nhìn và khả năng truyền cảm hứng cho người khác. Năng lượng của bạn mạnh nên đôi khi cũng dễ căng thẳng; khi cân bằng được, bạn có thể làm những việc rất ý nghĩa.',
      diemManh: ['Trực giác rất mạnh', 'Truyền cảm hứng, có sức ảnh hưởng', 'Giàu lòng trắc ẩn', 'Có tầm nhìn và lý tưởng'],
      diemYeu: ['Dễ căng thẳng, lo âu', 'Quá nhạy cảm với lời phê bình', 'Hay tự đặt áp lực lớn', 'Khó cân bằng giữa lý tưởng và thực tế'],
      tinhYeu: 'Số 11 yêu sâu sắc và tinh tế, tìm kiếm sự kết nối tâm hồn. Bạn cần một người kiên nhẫn, ổn định và hiểu thế giới nội tâm phong phú của mình.',
      suNghiep: 'Bạn hợp với công việc giúp đỡ, chữa lành và truyền cảm hứng; nơi trực giác và sự thấu cảm của bạn được phát huy.',
      nghe: ['Giáo dục, diễn giả', 'Tư vấn, trị liệu', 'Nghệ thuật', 'Tâm linh, thiền', 'Hoạt động nhân đạo'],
      loiKhuyen: 'Giữ nhịp sống cân bằng, ngủ đủ và có thời gian tĩnh lặng; trực giác của bạn chỉ rõ ràng khi tâm trí bình yên.',
      giaoTiep: 'Bạn nói chuyện truyền cảm, thường chạm được đến cảm xúc của người nghe. Bạn cảm nhận rất nhanh không khí xung quanh và dễ mệt khi phải giao tiếp nhiều.',
      camXuc: 'Cảm xúc của bạn rất nhạy và mạnh, có lúc phấn chấn, có lúc lo âu. Bạn cần thời gian tĩnh lặng để lắng lại và nghe rõ trực giác của mình.',
      lamViec: 'Bạn làm việc bằng cảm hứng và trực giác, giỏi nhìn ra hướng đi mà người khác chưa thấy. Bạn cần môi trường tôn trọng sự nhạy cảm của mình.',
      baiHoc: 'Bài học của số 11 là giữ cân bằng: đưa trực giác và lý tưởng vào đời sống thực tế mà không tự tạo áp lực cho mình.',
      cauHoi: ['Trực giác của mình đang nói gì về quyết định sắp tới?', 'Điều gì đang làm mình lo âu, và phần nào trong đó nằm ngoài tầm kiểm soát của mình?', 'Mình nạp lại năng lượng bằng cách nào, và gần đây đã làm điều đó chưa?'],
      thienHuong: { tinhCam: 0, suNghiep: 0, mayMan: 1 } },
    22: { ten: 'Kiến trúc sư bậc thầy', tuKhoa: 'tầm nhìn lớn, thực tế, xây dựng, kỷ luật',
      tongQuan: 'Số 22/4 là con số bậc thầy hiếm gặp, kết hợp tầm nhìn lớn với khả năng thực hiện của số 4. Bạn có thể biến những ý tưởng lớn thành hiện thực bền vững. Áp lực đi kèm cũng lớn, vì vậy bạn cần học cách cân bằng.',
      diemManh: ['Tầm nhìn xa, nghĩ lớn', 'Thực tế, biết cách thực hiện', 'Kỷ luật, bền bỉ', 'Có khả năng xây dựng tổ chức'],
      diemYeu: ['Tự tạo áp lực rất lớn', 'Có lúc cực đoan, cầu toàn', 'Khó thư giãn', 'Dễ thất vọng khi tiến độ chậm'],
      tinhYeu: 'Số 22/4 yêu nghiêm túc, chung thủy và có trách nhiệm. Bạn cần một người đồng hành vững vàng, chia sẻ được những mục tiêu lớn của mình.',
      suNghiep: 'Bạn hợp với vai trò lãnh đạo, xây dựng hệ thống và những dự án quy mô lớn có ảnh hưởng lâu dài.',
      nghe: ['Lãnh đạo doanh nghiệp', 'Kiến trúc, xây dựng', 'Quản lý dự án lớn', 'Chính sách công', 'Kỹ thuật'],
      loiKhuyen: 'Chia mục tiêu lớn thành từng bước nhỏ và ăn mừng mỗi bước; con đường dài cần sức bền hơn tốc độ.',
      giaoTiep: 'Bạn nói chuyện điềm tĩnh, có trọng lượng và thường hướng tới giải pháp. Bạn giỏi trình bày kế hoạch lớn nhưng ít khi chia sẻ áp lực của bản thân.',
      camXuc: 'Bạn kiểm soát cảm xúc tốt và có sức chịu đựng cao. Áp lực tự đặt ra có thể tích tụ thành căng thẳng nếu không được giải tỏa.',
      lamViec: 'Bạn làm việc có tầm nhìn và hệ thống, biết biến ý tưởng lớn thành kế hoạch từng bước. Bạn hợp với vai trò xây dựng và dẫn dắt dự án dài hạn.',
      baiHoc: 'Bài học của số 22/4 là kiên nhẫn với chính mình: điều lớn lao được xây từ những bước nhỏ, và nghỉ ngơi cũng là một phần của kế hoạch.',
      cauHoi: ['Mục tiêu lớn của mình có thể chia thành bước nhỏ nào cho tháng này?', 'Mình có đang đòi hỏi bản thân phải hoàn hảo ở mọi việc?', 'Ai có thể cùng mình chia sẻ gánh nặng của việc đang làm?'],
      thienHuong: { tinhCam: 0, suNghiep: 1, mayMan: 0 } },
  };

  // Tính chất chung của các con số, dùng cho chỉ số ngày sinh, thái độ và các chỉ số theo tên
  const SO = {
    1: ['độc lập, tiên phong, tự tin', 'Bạn thích tự quyết, dám đi đầu và có ý chí mạnh mẽ.'],
    2: ['hợp tác, nhạy cảm, hòa giải', 'Bạn tinh tế, giỏi lắng nghe và thường là người giữ hòa khí.'],
    3: ['sáng tạo, vui vẻ, diễn đạt', 'Bạn nhanh trí, giàu ý tưởng và thích chia sẻ niềm vui.'],
    4: ['kỷ luật, thực tế, đáng tin', 'Bạn làm việc có tổ chức, chăm chỉ và giữ lời hứa.'],
    5: ['tự do, linh hoạt, ham trải nghiệm', 'Bạn thích nghi nhanh, yêu sự mới mẻ và không thích bị gò bó.'],
    6: ['yêu thương, trách nhiệm, chăm sóc', 'Bạn quan tâm người khác, coi trọng gia đình và có óc thẩm mỹ.'],
    7: ['sâu sắc, tìm tòi, nội tâm', 'Bạn thích tìm hiểu bản chất, độc lập và có đời sống tinh thần phong phú.'],
    8: ['quyết đoán, quản lý, tài chính', 'Bạn có đầu óc tổ chức, biết quản lý tiền bạc và muốn tự chủ.'],
    9: ['bao dung, lý tưởng, nhân ái', 'Bạn sống có lý tưởng, rộng lượng và muốn đóng góp cho cộng đồng.'],
    11: ['trực giác, truyền cảm hứng', 'Bạn nhạy bén, giàu cảm hứng và có sức ảnh hưởng tới người khác.'],
    22: ['tầm nhìn lớn, xây dựng bền vững', 'Bạn nghĩ lớn và có khả năng biến ý tưởng thành điều thực tế, lâu dài.'],
  };

  // Năm (tháng, ngày) cá nhân 1–9: chủ đề và điểm 1–5 cho tình cảm, sự nghiệp, may mắn; {ky} = năm nay / tháng này / hôm nay
  const CHU_KY = {
    1: { ten: 'Khởi đầu', moTa: 'Mở đầu chu kỳ 9 năm mới: thời điểm gieo hạt, bắt đầu dự án, thay đổi hướng đi và chủ động hơn.',
      tinhCam: [3, 'Tình cảm {ky} thiên về sự độc lập; người độc thân dễ gặp mối quan hệ mới nếu chủ động.'],
      suNghiep: [5, 'Sự nghiệp {ky} rất hợp để khởi động việc mới, nhận vai trò mới hoặc tự mình dẫn dắt.'],
      mayMan: [4, 'Cơ hội đến với người dám bắt đầu; hãy nắm lấy điều mới thay vì chờ đợi.'] },
    2: { ten: 'Hợp tác', moTa: 'Thời gian chậm lại, nuôi dưỡng những gì đã gieo; hợp tác, kiên nhẫn và chú ý các mối quan hệ.',
      tinhCam: [5, 'Tình cảm {ky} được ưu tiên: dễ gắn kết, hòa hợp và hiểu nhau hơn.'],
      suNghiep: [3, 'Sự nghiệp {ky} tiến chậm mà chắc; thành quả đến từ làm việc nhóm hơn là đơn độc.'],
      mayMan: [3, 'May mắn đến qua người khác; một lời giới thiệu hay sự giúp đỡ đúng lúc.'] },
    3: { ten: 'Sáng tạo', moTa: 'Thời gian của niềm vui, giao tiếp và sáng tạo; mở rộng mối quan hệ và thể hiện bản thân.',
      tinhCam: [4, 'Tình cảm {ky} vui vẻ, nhiều dịp gặp gỡ; dễ nảy sinh những rung động mới.'],
      suNghiep: [4, 'Sự nghiệp {ky} thuận cho các ý tưởng, trình bày và những dự án cần sáng tạo.'],
      mayMan: [4, 'Năng lượng tích cực thu hút cơ hội; nói ra mong muốn của mình sẽ giúp nó thành hiện thực.'] },
    4: { ten: 'Xây nền', moTa: 'Thời gian làm việc chăm chỉ, xây nền móng, sắp xếp lại tài chính, sức khỏe và kỷ luật bản thân.',
      tinhCam: [2, 'Tình cảm {ky} dễ bị công việc lấn át; cần chủ động dành thời gian cho người thân.'],
      suNghiep: [4, 'Sự nghiệp {ky} đòi hỏi nhiều công sức nhưng mỗi nỗ lực đều đặt nền cho thành công sau này.'],
      mayMan: [2, 'Ít may mắn bất ngờ; kết quả đến từ chính sự cần cù và kế hoạch rõ ràng.'] },
    5: { ten: 'Thay đổi', moTa: 'Thời gian của thay đổi, tự do và trải nghiệm; có thể chuyển nhà, đổi việc, đi xa.',
      tinhCam: [4, 'Tình cảm {ky} sôi nổi, nhiều cảm xúc; có thể có những gặp gỡ bất ngờ.'],
      suNghiep: [3, 'Sự nghiệp {ky} có biến động; linh hoạt sẽ giúp bạn biến thay đổi thành cơ hội.'],
      mayMan: [4, 'Cơ hội đến từ những điều mới lạ, chuyến đi và người mới quen.'] },
    6: { ten: 'Yêu thương', moTa: 'Thời gian hướng về gia đình, tình yêu và trách nhiệm; thuận cho cưới hỏi, nhà cửa, chăm sóc người thân.',
      tinhCam: [5, 'Tình cảm {ky} ấm áp; thuận cho cam kết, cưới hỏi và hàn gắn.'],
      suNghiep: [3, 'Sự nghiệp {ky} ổn định; trách nhiệm tăng lên nhưng được ghi nhận.'],
      mayMan: [3, 'May mắn gắn với gia đình và nhà cửa; người thân là nguồn hỗ trợ lớn.'] },
    7: { ten: 'Chiêm nghiệm', moTa: 'Thời gian chậm lại để học hỏi, nghỉ ngơi và nhìn vào bên trong; hợp với nghiên cứu, tu dưỡng.',
      tinhCam: [2, 'Tình cảm {ky} cần sự thấu hiểu; bạn muốn có không gian riêng nhiều hơn.'],
      suNghiep: [3, 'Sự nghiệp {ky} hợp để học thêm, đào sâu chuyên môn hơn là mở rộng nhanh.'],
      mayMan: [2, 'Đừng trông chờ vận may; trực giác và sự chuẩn bị kỹ mới là chỗ dựa.'] },
    8: { ten: 'Thành tựu', moTa: 'Thời gian gặt hái về tài chính và địa vị; được công nhận, có quyền quyết định lớn hơn.',
      tinhCam: [3, 'Tình cảm {ky} cần cân bằng với công việc bận rộn; đừng để thành công lấy mất thời gian bên nhau.'],
      suNghiep: [5, 'Sự nghiệp {ky} có cơ hội thăng tiến, tăng thu nhập và khẳng định vị trí.'],
      mayMan: [5, 'Tài lộc thuận lợi; đầu tư đúng chỗ dễ sinh lời.'] },
    9: { ten: 'Hoàn tất', moTa: 'Khép lại chu kỳ 9 năm: hoàn tất việc dang dở, buông bỏ điều không còn phù hợp, chuẩn bị cho khởi đầu mới.',
      tinhCam: [3, 'Tình cảm {ky} là lúc nhìn lại; mối quan hệ nào bền sẽ càng bền, mối quan hệ nào hết duyên sẽ khép lại.'],
      suNghiep: [3, 'Sự nghiệp {ky} hợp để hoàn thành, tổng kết hơn là khởi động việc lớn.'],
      mayMan: [3, 'Cho đi và giúp đỡ người khác sẽ mang lại phúc lành bất ngờ.'] },
  };

  // Biểu đồ ngày sinh: lưới 3 × 3 (hàng trên 3 6 9, giữa 2 5 8, dưới 1 4 7) và 8 mũi tên
  const LUOI = [[3, 6, 9], [2, 5, 8], [1, 4, 7]];
  const MUI_TEN = [
    [[1, 2, 3], 'Kế hoạch', 'Bạn có đầu óc tổ chức, thích lên kế hoạch và làm việc có trình tự.', 'Kế hoạch', 'Bạn dễ làm theo cảm hứng, cần tập lên kế hoạch trước khi hành động.'],
    [[4, 5, 6], 'Ý chí', 'Bạn có ý chí mạnh, đã quyết là làm đến cùng.', 'Uất giận', 'Bạn dễ thất vọng khi mọi việc không như ý; học cách chấp nhận sẽ giúp bạn nhẹ lòng.'],
    [[7, 8, 9], 'Hoạt động', 'Bạn năng động, thích bắt tay vào việc thay vì chỉ nói.', 'Thụ động', 'Bạn dễ trì trệ khi thiếu động lực; một mục tiêu rõ ràng sẽ giúp bạn khởi động.'],
    [[1, 4, 7], 'Thực tế', 'Bạn thực tế, khéo tay và giỏi những việc cụ thể.', 'Thiếu thực tế', 'Bạn dễ nghĩ nhiều hơn làm; hãy biến ý tưởng thành việc nhỏ cụ thể.'],
    [[2, 5, 8], 'Cân bằng cảm xúc', 'Bạn có cảm xúc ổn định, biết thấu hiểu và giữ bình tĩnh.', 'Nhạy cảm', 'Bạn dễ bị tổn thương và ngại bộc lộ cảm xúc; hãy cho mình nơi an toàn để chia sẻ.'],
    [[3, 6, 9], 'Trí tuệ', 'Bạn có trí nhớ tốt và tư duy sắc bén.', 'Trí nhớ ngắn hạn', 'Bạn dễ quên chi tiết; ghi chép và ôn lại thường xuyên sẽ giúp ích nhiều.'],
    [[1, 5, 9], 'Quyết tâm', 'Bạn kiên trì, có quyết tâm cao và bền bỉ với mục tiêu.', 'Trì hoãn', 'Bạn hay trì hoãn; chia việc thành bước nhỏ và bắt đầu ngay bước đầu tiên.'],
    [[3, 5, 7], 'Tâm linh', 'Bạn có trực giác tốt và đời sống tinh thần sâu sắc, thấu hiểu người khác.', 'Hoài nghi', 'Bạn hay nghi ngờ khi chưa thấy bằng chứng; mở lòng hơn sẽ giúp bạn đón nhận cơ hội.'],
  ];

  // Bốn đỉnh cao cuộc đời: chủ đề của số ở mỗi đỉnh
  const DINH = {
    1: ['Tự lập', 'Giai đoạn học cách tự đứng trên đôi chân của mình: chủ động, dám quyết và tự mở con đường riêng.'],
    2: ['Hợp tác', 'Giai đoạn của các mối quan hệ và sự kiên nhẫn: thành công đến qua hợp tác, lắng nghe và hỗ trợ người khác.'],
    3: ['Sáng tạo', 'Giai đoạn mở rộng giao tiếp, thể hiện bản thân và phát triển khả năng sáng tạo; nhiều niềm vui và bạn bè.'],
    4: ['Xây nền', 'Giai đoạn làm việc chăm chỉ, kỷ luật, xây nền tảng vững chắc cho công việc, tài chính và gia đình.'],
    5: ['Thay đổi', 'Giai đoạn nhiều thay đổi, di chuyển và trải nghiệm mới; học cách linh hoạt và dùng tự do một cách khôn ngoan.'],
    6: ['Trách nhiệm', 'Giai đoạn hướng về gia đình, tình yêu và trách nhiệm với người thân, cộng đồng; thuận cho lập gia đình, nhà cửa.'],
    7: ['Chiêm nghiệm', 'Giai đoạn đào sâu hiểu biết, học hỏi và nhìn vào bên trong; hợp với nghiên cứu, chuyên môn và đời sống tinh thần.'],
    8: ['Thành tựu', 'Giai đoạn của sự tự chủ, tài chính và địa vị; công sức bỏ ra dễ được đền đáp bằng thành quả cụ thể.'],
    9: ['Cống hiến', 'Giai đoạn của lòng bao dung và cống hiến; hoàn tất việc lớn, buông bỏ cái cũ và sống vì điều có ý nghĩa.'],
    11: ['Truyền cảm hứng', 'Giai đoạn trực giác và đời sống tinh thần mạnh lên; bạn có thể truyền cảm hứng cho nhiều người nếu giữ được cân bằng.'],
    22: ['Kiến tạo', 'Giai đoạn có thể xây dựng những điều lớn và bền vững; tầm nhìn lớn đi cùng trách nhiệm và áp lực lớn.'],
  };
  // Ba mặt phẳng của biểu đồ ngày sinh (ba hàng ngang), dùng để so sánh hai số chủ đạo
  const MAT_PHANG = [[[3, 6, 9], 'Trí não', 'thiên về suy nghĩ, phân tích và trò chuyện'], [[2, 5, 8], 'Cảm xúc', 'thiên về cảm nhận, trực giác và cảm xúc'], [[1, 4, 7], 'Thể chất', 'thiên về hành động, thực tế và những gì cụ thể']];
  const MUC_HOP = {
    'Hợp tự nhiên': 'Sự dễ chịu ban đầu là lợi thế lớn; hãy cùng nhau thử điều mới để mối quan hệ không rơi vào lối mòn.',
    'Đồng điệu': 'Hãy nhắc nhau về điểm yếu chung và chia vai trò khác nhau, để hai người bổ sung cho nhau chứ không cùng lặp lại một lỗi.',
    'Bổ trợ': 'Tôn trọng thế mạnh của người kia thay vì muốn họ giống mình; khi phân vai hợp lý, hai bạn làm được nhiều hơn mỗi người.',
    'Cần dung hòa': 'Nói rõ mong muốn của mình bằng lời, hỏi lại thay vì đoán ý; kiên nhẫn trong giai đoạn đầu sẽ giúp hai bạn tìm được nhịp chung.',
  };
  const TRUONG_PHAI = {
    duongLich: 'Theo năm dương lịch: số năm cá nhân đổi vào ngày 1/1 hằng năm. Đây là cách phổ biến ở Việt Nam.',
    sinhNhat: 'Theo sinh nhật: số năm cá nhân đổi vào ngày sinh nhật hằng năm, năm cá nhân kéo dài từ sinh nhật năm nay tới sinh nhật năm sau.',
  };

  // ---------- Tính toán ----------
  const chuSoNgay = (d, m, y) => `${d}${m}${y}`.split('').map(Number);
  const cong = n => `${String(n).split('').join(' + ')} = ${tongChuSo(n)}`;
  /** Chuỗi rút gọn để hiển thị, ví dụ 24 → ", rút gọn 2 + 4 = 6" */
  function chuoiRutGon(n, giu = []) { let s = ''; while (n > 9 && !giu.includes(n)) { s += `, rút gọn ${cong(n)}`; n = tongChuSo(n); } return s; }
  /** Từng bước cộng và rút gọn số chủ đạo */
  function buocSoChuDao(d, m, y) {
    const cs = chuSoNgay(d, m, y);
    let n = cs.reduce((a, b) => a + b, 0);
    const buoc = [`Viết ngày sinh ${d}/${m}/${y} thành dãy chữ số: ${cs.join(' ')}.`, `Cộng tất cả các chữ số: ${cs.join(' + ')} = ${n}.`];
    while (n > 11 && n !== 22) { buoc.push(`${n} lớn hơn 11 nên cộng tiếp các chữ số: ${cong(n)}.`); n = tongChuSo(n); }
    buoc.push(n === 22 ? 'Dừng ở 22 vì đây là số bậc thầy, viết là 22/4.' : n === 11 ? 'Dừng ở 11 vì đây là số bậc thầy.' : `Dừng ở ${n} vì kết quả đã nằm trong khoảng 2 đến 11.`);
    return buoc;
  }
  /** Năm đang xét: theo sinh nhật thì trước sinh nhật năm nay vẫn tính là năm trước */
  const namXet = (d, m, h, tp) => tp === 'sinhNhat' && (h.m < m || (h.m === m && h.d < d)) ? h.y - 1 : h.y;
  const buocNamCaNhan = (d, m, nam) => {
    const ph = n => n > 9 ? `${n} → ${cong(n)}` : String(n), t = tongChuSo(d) + tongChuSo(m) + tongChuSo(nam);
    return `Ngày sinh ${ph(d)}; tháng sinh ${ph(m)}; năm ${ph(nam)}. Cộng lại: ${tongChuSo(d)} + ${tongChuSo(m)} + ${tongChuSo(nam)} = ${t}${chuoiRutGon(t)}.`;
  };
  /** Bốn đỉnh cao: ngày, tháng, năm sinh rút về 1–9; đỉnh 1 = tháng + ngày, 2 = ngày + năm, 3 = đỉnh 1 + đỉnh 2, 4 = tháng + năm (giữ 11, 22).
   *  Mốc tuổi đỉnh 1 = 36 − số chủ đạo (10, 11, 22/4 tính là 1, 2, 4), mỗi đỉnh sau cách 9 năm. */
  function dinhCao(d, m, y, h) {
    const T = rutGon(m), N = rutGon(d), Nm = rutGon(y), g = x => rutGon(x, [11, 22]);
    const p1 = g(T + N), p2 = g(N + Nm), lp = rutGon(soChuDao(d, m, y).so), moc1 = 36 - lp;
    const ds = [[p1, `tháng ${T} + ngày ${N}`, T + N], [p2, `ngày ${N} + năm ${Nm}`, N + Nm], [g(p1 + p2), `đỉnh 1 (${p1}) + đỉnh 2 (${p2})`, p1 + p2], [g(T + Nm), `tháng ${T} + năm ${Nm}`, T + Nm]];
    const dinh = ds.map(([so, cach, tong], i) => ({ thu: i + 1, so, hien: hienSo(so), ten: DINH[so][0], moTa: DINH[so][1], tuoi: moc1 + 9 * i, nam: y + moc1 + 9 * i,
      cachTinh: `${cach} = ${tong}${chuoiRutGon(tong, [11, 22])}` }));
    const toi = dinh.findIndex(x => x.nam >= h.y);
    dinh.forEach((x, i) => { x.trangThai = toi === -1 || i < toi ? 'qua' : i === toi ? 'toi' : 'sau'; });
    return { rutGon: { ngay: N, thang: T, nam: Nm }, soChuDaoGoc: lp, tuoiNay: h.y - y, dinh };
  }
  /** So sánh hai số chủ đạo theo vị trí của chúng trên lưới 3 × 3 (10, 11, 22/4 xét theo gốc 1, 2, 4) */
  function tuongHop(a, b) {
    const A = SO_CHU_DAO[a], B = SO_CHU_DAO[b];
    if (!A || !B) return null;
    const x = rutGon(a), y = rutGon(b), mp = n => MAT_PHANG.find(p => p[0].includes(n)), pa = mp(x), pb = mp(y);
    const mt = MUI_TEN.find(([ds]) => ds.includes(x) && ds.includes(y));
    let muc, phanTram, moTa;
    if (x === y) [muc, phanTram, moTa] = ['Đồng điệu', 75, `Hai bạn cùng mang năng lượng số ${x}, nhìn cuộc sống theo cách giống nhau nên hiểu nhau rất nhanh. Điều cần để ý là cả hai cũng dễ cùng mắc một điểm yếu: ${A.diemYeu[0].toLowerCase()}.`];
    else if (pa === pb) [muc, phanTram, moTa] = ['Hợp tự nhiên', 85, `Số ${hienSo(a)} và số ${hienSo(b)} cùng nằm trên mặt phẳng ${pa[1]} của biểu đồ ngày sinh: cả hai ${pa[2]}, nên dễ hiểu nhau mà không cần giải thích nhiều.`];
    else if (mt) [muc, phanTram, moTa] = ['Bổ trợ', 70, `Hai số nằm ở hai mặt phẳng khác nhau nhưng cùng trên mũi tên ${mt[1]} (${mt[0].join('-')}): một người ${pa[2]}, người kia ${pb[2]}. Ghép lại, hai bạn bù cho nhau và cùng có được phẩm chất của mũi tên ${mt[1]}.`];
    else [muc, phanTram, moTa] = ['Cần dung hòa', 55, `Hai số không cùng nằm trên mũi tên nào của biểu đồ ngày sinh: một người ${pa[2]}, người kia ${pb[2]}. Khác biệt này dễ gây hiểu lầm nếu không nói rõ mong muốn, nhưng cũng là cơ hội để hai người học hỏi nhau.`];
    const ghiChu = [a, b].filter((n, i, xs) => n > 9 && xs.indexOf(n) === i).map(n => `Số ${hienSo(n)} được xét theo số gốc ${rutGon(n)}.`).join(' ');
    const nguoi = (n, c) => ({ so: n, hien: hienSo(n), ten: c.ten, tinhYeu: c.tinhYeu, giaoTiep: c.giaoTiep, matPhang: mp(rutGon(n))[1] });
    return { a: nguoi(a, A), b: nguoi(b, B), muc, phanTram, moTa, ghiChu, loiKhuyen: MUC_HOP[muc] };
  }
  function soChuDao(d, m, y) {
    const tong = chuSoNgay(d, m, y).reduce((a, b) => a + b, 0);
    let n = tong;
    while (n > 11 && n !== 22) n = tongChuSo(n);
    return { so: n, tong };
  }
  const soNgaySinh = d => rutGon(d, [11, 22]);
  const soThaiDo = (d, m) => rutGon(tongChuSo(d) + tongChuSo(m), [11, 22]);
  const namCaNhan = (d, m, nam) => rutGon(tongChuSo(d) + tongChuSo(m) + tongChuSo(nam));
  const thangCaNhan = (d, m, nam, thang) => rutGon(namCaNhan(d, m, nam) + thang);
  const ngayCaNhan = (d, m, nam, thang, ngay) => rutGon(thangCaNhan(d, m, nam, thang) + tongChuSo(ngay));

  // Chữ cái → số theo bảng Pythagoras: A J S = 1, B K T = 2, …, I R = 9. Tiếng Việt: bỏ dấu, Đ = D, Y luôn là nguyên âm.
  const boDau = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
  const giaTri = ch => (ch.charCodeAt(0) - 65) % 9 + 1;
  function soTheoTen(ten) {
    const chu = boDau(ten).replace(/[^A-Z]/g, '');
    if (!chu) return null;
    const nguyenAm = c => 'AEIOUY'.includes(c);
    const cong = loc => chu.split('').filter(loc).reduce((s, c) => s + giaTri(c), 0);
    const r = x => x ? rutGon(x, [11, 22]) : null;
    return { suMenh: r(cong(() => true)), linhHon: r(cong(nguyenAm)), nhanCach: r(cong(c => !nguyenAm(c))) };
  }
  function bieuDo(d, m, y) {
    const dem = Array(10).fill(0);
    chuSoNgay(d, m, y).forEach(c => { if (c) dem[c]++; });
    const co = n => dem[n] > 0;
    return {
      dem, luoi: LUOI.map(h => h.map(n => ({ so: n, lan: dem[n] }))),
      muiTen: MUI_TEN.filter(([ds]) => ds.every(co)).map(([ds, ten, y1]) => ({ so: ds, ten: `Mũi tên ${ten}`, loi: y1 })),
      muiTenTrong: MUI_TEN.filter(([ds]) => ds.every(n => !co(n))).map(([ds, , , ten, y2]) => ({ so: ds, ten: `Mũi tên ${ten} (trống)`, loi: y2 })),
      soThieu: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !co(n)),
    };
  }
  const coBan = n => ({ so: n, hien: hienSo(n), tuKhoa: SO[n][0], moTa: SO[n][1] });
  const chuKy = (n, ky) => { const c = CHU_KY[n]; return { so: n, ten: c.ten, moTa: c.moTa,
    tinhCam: { diem: c.tinhCam[0], loi: c.tinhCam[1].replace('{ky}', ky) }, suNghiep: { diem: c.suNghiep[0], loi: c.suNghiep[1].replace('{ky}', ky) },
    mayMan: { diem: c.mayMan[0], loi: c.mayMan[1].replace('{ky}', ky) } }; };

  /** Toàn bộ chỉ số. ngaySinh = { d, m, y } dương lịch; homNay = { y, m, d } để tính năm/tháng/ngày cá nhân; ten không bắt buộc;
   *  truongPhai = 'duongLich' (mặc định) hoặc 'sinhNhat' cho cách tính năm cá nhân. */
  function tinh({ d, m, y }, homNay, ten, truongPhai = 'duongLich') {
    const cd = soChuDao(d, m, y), t = ten && soTheoTen(ten), h = homNay, tp = TRUONG_PHAI[truongPhai] ? truongPhai : 'duongLich', nx = namXet(d, m, h, tp);
    return {
      ngaySinh: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`,
      soChuDao: Object.assign({ so: cd.so, hien: hienSo(cd.so), tong: cd.tong, cachTinh: `${chuSoNgay(d, m, y).join(' + ')} = ${cd.tong}${cd.tong !== cd.so ? ` → ${hienSo(cd.so)}` : ''}`, buoc: buocSoChuDao(d, m, y) }, SO_CHU_DAO[cd.so]),
      ngaySinhSo: coBan(soNgaySinh(d)), thaiDo: coBan(soThaiDo(d, m)),
      ten: t ? { suMenh: t.suMenh && coBan(t.suMenh), linhHon: t.linhHon && coBan(t.linhHon), nhanCach: t.nhanCach && coBan(t.nhanCach) } : null,
      bieuDo: bieuDo(d, m, y),
      namCaNhan: Object.assign({ nam: nx, truongPhai: tp, moTaTruongPhai: TRUONG_PHAI[tp], cachTinh: buocNamCaNhan(d, m, nx) }, chuKy(namCaNhan(d, m, nx), 'năm nay')),
      thangCaNhan: Object.assign({ thang: h.m }, chuKy(thangCaNhan(d, m, nx, h.m), 'tháng này')),
      ngayCaNhan: chuKy(ngayCaNhan(d, m, nx, h.m, h.d), 'hôm nay'),
      chuKy9: Array.from({ length: 9 }, (_, i) => ({ nam: nx + i, so: namCaNhan(d, m, nx + i), ten: CHU_KY[namCaNhan(d, m, nx + i)].ten })),
      dinhCao: dinhCao(d, m, y, h),
    };
  }

  const SoHoc = { SO_CHU_DAO, SO, CHU_KY, MUI_TEN, DINH, TRUONG_PHAI, rutGon, hienSo, soChuDao, buocSoChuDao, soNgaySinh, soThaiDo, namCaNhan, thangCaNhan, ngayCaNhan, soTheoTen, bieuDo, chuKy, dinhCao, tuongHop, tinh };
  if (typeof module !== 'undefined' && module.exports) module.exports = SoHoc; else root.SoHoc = SoHoc;
})(typeof window !== 'undefined' ? window : globalThis);
