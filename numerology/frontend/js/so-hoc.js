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
      thienHuong: { tinhCam: 1, suNghiep: 0, mayMan: 0 } },
    3: { ten: 'Người sáng tạo', tuKhoa: 'trí tuệ, hài hước, sáng tạo, giao tiếp',
      tongQuan: 'Số 3 là con số của trí tuệ và sự biểu đạt. Bạn suy nghĩ nhanh, giàu ý tưởng, nói chuyện có duyên và thích mang niềm vui cho người khác. Bạn học tốt khi được hứng thú, và cần một nơi để thể hiện bản thân.',
      diemManh: ['Nhanh trí, nhiều ý tưởng', 'Hài hước, giao tiếp có duyên', 'Lạc quan, truyền năng lượng tích cực', 'Có khiếu nghệ thuật và ngôn ngữ'],
      diemYeu: ['Dễ phân tán, khó theo đuổi đến cùng', 'Hay phán xét, nói trước nghĩ sau', 'Thiếu kiên nhẫn với việc lặp lại', 'Che giấu cảm xúc thật sau tiếng cười'],
      tinhYeu: 'Số 3 yêu bằng sự vui vẻ và những cuộc trò chuyện thú vị. Bạn cần một người hiểu sự hài hước của mình, cùng bạn trải nghiệm và không làm cuộc sống trở nên nặng nề.',
      suNghiep: 'Bạn tỏa sáng trong công việc cần sáng tạo, trình bày và truyền đạt. Môi trường quá gò bó sẽ làm mất đi năng lượng tốt nhất của bạn.',
      nghe: ['Truyền thông, báo chí', 'Giáo dục, đào tạo', 'Viết lách, xuất bản', 'Marketing, quảng cáo', 'Nghệ thuật biểu diễn'],
      loiKhuyen: 'Chọn ít việc hơn và làm tới nơi tới chốn; tài năng của bạn cần sự bền bỉ mới thành quả ngọt.',
      thienHuong: { tinhCam: 0, suNghiep: 0, mayMan: 1 } },
    4: { ten: 'Người xây dựng', tuKhoa: 'thực tế, kỷ luật, chăm chỉ, đáng tin',
      tongQuan: 'Số 4 là nền móng vững chắc. Bạn thực tế, có tổ chức, làm việc chăm chỉ và giữ lời hứa. Bạn thích mọi thứ rõ ràng, có kế hoạch, và thành công đến từ sự bền bỉ qua năm tháng.',
      diemManh: ['Kỷ luật, có trách nhiệm', 'Thực tế, giỏi tổ chức', 'Đáng tin, trung thực', 'Bền bỉ với mục tiêu dài hạn'],
      diemYeu: ['Cứng nhắc, ngại thay đổi', 'Quá nghiêm khắc với bản thân và người khác', 'Khó bày tỏ cảm xúc', 'Dễ làm việc quá sức'],
      tinhYeu: 'Số 4 yêu bằng sự chung thủy và trách nhiệm. Bạn thể hiện tình cảm qua việc làm cụ thể, cần sự ổn định và một người đáng tin để cùng xây dựng tương lai.',
      suNghiep: 'Bạn hợp với công việc cần quy trình, độ chính xác và sự kiên trì. Bạn là người biến kế hoạch thành kết quả thực tế.',
      nghe: ['Kỹ thuật, xây dựng', 'Kế toán, tài chính', 'Quản lý vận hành', 'Công nghệ thông tin', 'Hành chính, pháp lý'],
      loiKhuyen: 'Hãy cởi mở với cái mới và cho phép mình nghỉ ngơi; sự linh hoạt sẽ làm nền móng của bạn thêm vững.',
      thienHuong: { tinhCam: 0, suNghiep: 1, mayMan: 0 } },
    5: { ten: 'Người tự do', tuKhoa: 'tự do, trải nghiệm, linh hoạt, yêu thương',
      tongQuan: 'Số 5 là con số của tự do và cảm xúc. Bạn ham trải nghiệm, thích nghi nhanh, yêu thương nồng nhiệt và học nhiều nhất qua những điều đã tự mình trải qua. Bạn cần không gian để là chính mình.',
      diemManh: ['Linh hoạt, thích nghi nhanh', 'Giàu cảm xúc và lòng yêu thương', 'Dám trải nghiệm, ham khám phá', 'Hoạt bát, dễ kết bạn'],
      diemYeu: ['Bốc đồng, dễ chán', 'Ngại cam kết, sợ bị ràng buộc', 'Cảm xúc thất thường', 'Khó duy trì kỷ luật'],
      tinhYeu: 'Số 5 yêu nồng nhiệt và giàu cảm xúc. Bạn cần một người tôn trọng tự do của mình, cùng bạn khám phá cuộc sống thay vì giữ chặt.',
      suNghiep: 'Bạn hợp với công việc nhiều thay đổi, di chuyển và tiếp xúc con người. Công việc đơn điệu lặp lại sẽ khiến bạn mất động lực.',
      nghe: ['Du lịch, khách sạn', 'Kinh doanh, bán hàng', 'Truyền thông, sự kiện', 'Thể thao', 'Nghệ thuật, nhiếp ảnh'],
      loiKhuyen: 'Tự do thật sự đến từ kỷ luật; hãy giữ một vài thói quen cố định để năng lượng của bạn không bị phân tán.',
      thienHuong: { tinhCam: 1, suNghiep: -1, mayMan: 1 } },
    6: { ten: 'Người chăm sóc', tuKhoa: 'yêu thương, trách nhiệm, sáng tạo, gia đình',
      tongQuan: 'Số 6 mang năng lượng của tình yêu thương và trách nhiệm. Bạn sáng tạo, có óc thẩm mỹ, luôn muốn chăm lo cho người thân và cộng đồng. Gia đình và các mối quan hệ là nguồn động lực lớn nhất của bạn.',
      diemManh: ['Giàu lòng yêu thương, biết chăm sóc', 'Có trách nhiệm với gia đình và tập thể', 'Sáng tạo, có óc thẩm mỹ', 'Đáng tin, sẵn lòng giúp đỡ'],
      diemYeu: ['Hay lo lắng, ôm đồm việc của người khác', 'Cầu toàn, khó hài lòng', 'Dễ hy sinh quá mức', 'Có lúc áp đặt vì muốn tốt cho người khác'],
      tinhYeu: 'Số 6 yêu hết lòng và hướng tới gia đình. Bạn chăm sóc người yêu chu đáo, cần sự trân trọng và một mái ấm bình yên.',
      suNghiep: 'Bạn hợp với công việc chăm sóc, giáo dục, sáng tạo và phục vụ cộng đồng; nơi bạn thấy mình có ích cho người khác.',
      nghe: ['Y tế, điều dưỡng', 'Giáo dục', 'Thiết kế, nghệ thuật', 'Nhà hàng, ẩm thực', 'Công tác xã hội'],
      loiKhuyen: 'Chăm sóc người khác bắt đầu từ việc chăm sóc chính mình; hãy để mọi người tự chịu trách nhiệm với cuộc sống của họ.',
      thienHuong: { tinhCam: 1, suNghiep: 0, mayMan: 0 } },
    7: { ten: 'Người tìm kiếm', tuKhoa: 'học hỏi, chiêm nghiệm, độc lập, trải nghiệm',
      tongQuan: 'Số 7 là con số của việc học qua trải nghiệm và chiêm nghiệm. Bạn độc lập, sâu sắc, thích tìm hiểu bản chất sự việc. Cuộc đời bạn thường có những bài học lớn, và mỗi lần vượt qua bạn lại hiểu mình hơn.',
      diemManh: ['Sâu sắc, có óc phân tích', 'Độc lập, tự học giỏi', 'Kiên cường sau thất bại', 'Trực giác và đời sống tinh thần phong phú'],
      diemYeu: ['Khép kín, khó chia sẻ', 'Hoài nghi, khó tin người', 'Dễ cô đơn', 'Hay tự học bằng cách vấp ngã thay vì nghe lời khuyên'],
      tinhYeu: 'Số 7 cần thời gian và sự tin tưởng mới mở lòng. Bạn trân trọng một người tôn trọng không gian riêng và có thể trò chuyện sâu sắc cùng bạn.',
      suNghiep: 'Bạn hợp với công việc chuyên môn sâu, nghiên cứu và giảng dạy; nơi được làm việc độc lập và đào sâu vấn đề.',
      nghe: ['Nghiên cứu khoa học', 'Giảng dạy', 'Tâm lý, triết học', 'Phân tích dữ liệu', 'Viết lách'],
      loiKhuyen: 'Hãy cho phép người khác giúp mình và chia sẻ nhiều hơn; không phải bài học nào cũng cần tự trải qua mới hiểu.',
      thienHuong: { tinhCam: -1, suNghiep: 0, mayMan: 0 } },
    8: { ten: 'Người lãnh đạo', tuKhoa: 'độc lập, quyết đoán, tài chính, quản lý',
      tongQuan: 'Số 8 mang năng lượng của sự độc lập, quyền lực và vật chất. Bạn quyết đoán, có đầu óc kinh doanh, biết quản lý tiền bạc và con người. Bạn cảm nhận tình yêu sâu sắc nhưng thường thể hiện bằng hành động hơn lời nói.',
      diemManh: ['Quyết đoán, tự lập', 'Giỏi quản lý tài chính', 'Có khả năng lãnh đạo', 'Bền bỉ, chịu được áp lực'],
      diemYeu: ['Cứng rắn, ít bộc lộ cảm xúc', 'Quá đặt nặng thành công vật chất', 'Khó nhờ vả người khác', 'Có lúc độc đoán'],
      tinhYeu: 'Số 8 yêu sâu sắc nhưng kín đáo. Bạn cần một người hiểu rằng sự chăm lo thực tế của mình chính là cách nói yêu thương.',
      suNghiep: 'Bạn hợp với vai trò quản lý, kinh doanh và tài chính; càng được tự chủ, bạn càng đạt kết quả lớn.',
      nghe: ['Kinh doanh, khởi nghiệp', 'Tài chính, ngân hàng', 'Quản lý doanh nghiệp', 'Bất động sản', 'Luật'],
      loiKhuyen: 'Thành công trọn vẹn khi có cả cảm xúc; hãy để người thân thấy được sự dịu dàng bên trong bạn.',
      thienHuong: { tinhCam: -1, suNghiep: 1, mayMan: 1 } },
    9: { ten: 'Người lý tưởng', tuKhoa: 'lý tưởng, trách nhiệm, nhân ái, tham vọng',
      tongQuan: 'Số 9 là con số của lý tưởng và lòng nhân ái. Bạn có trách nhiệm, nhiều hoài bão, muốn làm điều có ý nghĩa cho cộng đồng. Bạn thường được người khác tin tưởng giao việc lớn.',
      diemManh: ['Có lý tưởng sống rõ ràng', 'Nhân ái, bao dung', 'Có trách nhiệm, đáng tin', 'Tầm nhìn rộng, nhiều hoài bão'],
      diemYeu: ['Mơ mộng, xa thực tế', 'Ôm đồm quá nhiều trách nhiệm', 'Dễ thất vọng khi người khác không như kỳ vọng', 'Khó buông bỏ quá khứ'],
      tinhYeu: 'Số 9 yêu bao dung và lý tưởng. Bạn cần một người cùng chia sẻ giá trị sống và ủng hộ những hoài bão lớn của mình.',
      suNghiep: 'Bạn hợp với công việc có ý nghĩa xã hội, cần tầm nhìn và khả năng truyền cảm hứng cho nhiều người.',
      nghe: ['Lãnh đạo tổ chức', 'Giáo dục, y tế', 'Hoạt động xã hội', 'Nghệ thuật', 'Luật, chính sách'],
      loiKhuyen: 'Hãy đặt mục tiêu vừa tầm và chăm sóc bản thân; bạn không cần gánh cả thế giới một mình.',
      thienHuong: { tinhCam: 0, suNghiep: 1, mayMan: 0 } },
    10: { ten: 'Người thích nghi', tuKhoa: 'thích nghi, tự tin, hòa đồng, khởi đầu',
      tongQuan: 'Số 10 là sự kết hợp giữa năng lượng khởi đầu của số 1 và vòng tròn trọn vẹn của số 0. Bạn thích nghi nhanh với mọi hoàn cảnh, tự tin, hòa đồng và dễ được yêu mến. Bạn có khả năng bắt đầu lại sau mỗi lần vấp ngã.',
      diemManh: ['Thích nghi nhanh, xoay xở giỏi', 'Tự tin, hòa đồng', 'Lạc quan, dễ bắt đầu lại', 'Làm được nhiều loại việc'],
      diemYeu: ['Thiếu kiên định, dễ đổi hướng', 'Hay chạy theo nhiều mục tiêu cùng lúc', 'Cả nể', 'Có lúc chủ quan vì mọi việc đến dễ dàng'],
      tinhYeu: 'Số 10 yêu cởi mở và vui vẻ. Bạn cần một người đồng hành vững vàng, giúp bạn giữ hướng đi khi có quá nhiều lựa chọn.',
      suNghiep: 'Bạn hợp với môi trường năng động, nhiều cơ hội; khả năng thích nghi giúp bạn thành công ở nhiều lĩnh vực khác nhau.',
      nghe: ['Kinh doanh', 'Quản lý dự án', 'Truyền thông', 'Bán hàng, dịch vụ', 'Nghệ thuật, giải trí'],
      loiKhuyen: 'Chọn một hướng đi chính và theo đuổi đủ lâu; sự linh hoạt của bạn sẽ có giá trị hơn khi có điểm tựa.',
      thienHuong: { tinhCam: 0, suNghiep: 0, mayMan: 1 } },
    11: { ten: 'Người truyền cảm hứng', tuKhoa: 'trực giác mạnh, tâm linh, truyền cảm hứng, nhạy cảm',
      tongQuan: 'Số 11 là con số bậc thầy về trực giác và đời sống tinh thần. Bạn nhạy cảm, có tầm nhìn và khả năng truyền cảm hứng cho người khác. Năng lượng của bạn mạnh nên đôi khi cũng dễ căng thẳng; khi cân bằng được, bạn có thể làm những việc rất ý nghĩa.',
      diemManh: ['Trực giác rất mạnh', 'Truyền cảm hứng, có sức ảnh hưởng', 'Giàu lòng trắc ẩn', 'Có tầm nhìn và lý tưởng'],
      diemYeu: ['Dễ căng thẳng, lo âu', 'Quá nhạy cảm với lời phê bình', 'Hay tự đặt áp lực lớn', 'Khó cân bằng giữa lý tưởng và thực tế'],
      tinhYeu: 'Số 11 yêu sâu sắc và tinh tế, tìm kiếm sự kết nối tâm hồn. Bạn cần một người kiên nhẫn, ổn định và hiểu thế giới nội tâm phong phú của mình.',
      suNghiep: 'Bạn hợp với công việc giúp đỡ, chữa lành và truyền cảm hứng; nơi trực giác và sự thấu cảm của bạn được phát huy.',
      nghe: ['Giáo dục, diễn giả', 'Tư vấn, trị liệu', 'Nghệ thuật', 'Tâm linh, thiền', 'Hoạt động nhân đạo'],
      loiKhuyen: 'Giữ nhịp sống cân bằng, ngủ đủ và có thời gian tĩnh lặng; trực giác của bạn chỉ rõ ràng khi tâm trí bình yên.',
      thienHuong: { tinhCam: 0, suNghiep: 0, mayMan: 1 } },
    22: { ten: 'Kiến trúc sư bậc thầy', tuKhoa: 'tầm nhìn lớn, thực tế, xây dựng, kỷ luật',
      tongQuan: 'Số 22/4 là con số bậc thầy hiếm gặp, kết hợp tầm nhìn lớn với khả năng thực hiện của số 4. Bạn có thể biến những ý tưởng lớn thành hiện thực bền vững. Áp lực đi kèm cũng lớn, vì vậy bạn cần học cách cân bằng.',
      diemManh: ['Tầm nhìn xa, nghĩ lớn', 'Thực tế, biết cách thực hiện', 'Kỷ luật, bền bỉ', 'Có khả năng xây dựng tổ chức'],
      diemYeu: ['Tự tạo áp lực rất lớn', 'Có lúc cực đoan, cầu toàn', 'Khó thư giãn', 'Dễ thất vọng khi tiến độ chậm'],
      tinhYeu: 'Số 22/4 yêu nghiêm túc, chung thủy và có trách nhiệm. Bạn cần một người đồng hành vững vàng, chia sẻ được những mục tiêu lớn của mình.',
      suNghiep: 'Bạn hợp với vai trò lãnh đạo, xây dựng hệ thống và những dự án quy mô lớn có ảnh hưởng lâu dài.',
      nghe: ['Lãnh đạo doanh nghiệp', 'Kiến trúc, xây dựng', 'Quản lý dự án lớn', 'Chính sách công', 'Kỹ thuật'],
      loiKhuyen: 'Chia mục tiêu lớn thành từng bước nhỏ và ăn mừng mỗi bước; con đường dài cần sức bền hơn tốc độ.',
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

  // ---------- Tính toán ----------
  const chuSoNgay = (d, m, y) => `${d}${m}${y}`.split('').map(Number);
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

  /** Toàn bộ chỉ số. ngaySinh = { d, m, y } dương lịch; homNay = { y, m, d } để tính năm/tháng/ngày cá nhân; ten không bắt buộc. */
  function tinh({ d, m, y }, homNay, ten) {
    const cd = soChuDao(d, m, y), t = ten && soTheoTen(ten), h = homNay;
    const nCN = namCaNhan(d, m, h.y);
    return {
      ngaySinh: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`,
      soChuDao: Object.assign({ so: cd.so, hien: hienSo(cd.so), tong: cd.tong, cachTinh: `${chuSoNgay(d, m, y).join(' + ')} = ${cd.tong}${cd.tong !== cd.so ? ` → ${hienSo(cd.so)}` : ''}` }, SO_CHU_DAO[cd.so]),
      ngaySinhSo: coBan(soNgaySinh(d)), thaiDo: coBan(soThaiDo(d, m)),
      ten: t ? { suMenh: t.suMenh && coBan(t.suMenh), linhHon: t.linhHon && coBan(t.linhHon), nhanCach: t.nhanCach && coBan(t.nhanCach) } : null,
      bieuDo: bieuDo(d, m, y),
      namCaNhan: Object.assign({ nam: h.y }, chuKy(nCN, 'năm nay')),
      thangCaNhan: Object.assign({ thang: h.m }, chuKy(thangCaNhan(d, m, h.y, h.m), 'tháng này')),
      ngayCaNhan: chuKy(ngayCaNhan(d, m, h.y, h.m, h.d), 'hôm nay'),
      chuKy9: Array.from({ length: 9 }, (_, i) => ({ nam: h.y + i, so: namCaNhan(d, m, h.y + i), ten: CHU_KY[namCaNhan(d, m, h.y + i)].ten })),
    };
  }

  const SoHoc = { SO_CHU_DAO, SO, CHU_KY, MUI_TEN, rutGon, hienSo, soChuDao, soNgaySinh, soThaiDo, namCaNhan, thangCaNhan, ngayCaNhan, soTheoTen, bieuDo, chuKy, tinh };
  if (typeof module !== 'undefined' && module.exports) module.exports = SoHoc; else root.SoHoc = SoHoc;
})(typeof window !== 'undefined' ? window : globalThis);
