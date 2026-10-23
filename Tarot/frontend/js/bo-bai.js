/* Bộ bài Tarot 78 lá (22 Ẩn Chính, 56 Ẩn Phụ) với ý nghĩa xuôi/ngược bằng tiếng Việt, các kiểu trải bài
 * và cách rút bài. Nội dung tự biên soạn. Dùng chung cho trình duyệt và backend. */
(function (root) {
  'use strict';
  const Y = (typeof module !== 'undefined' && module.exports) ? require('./y-nghia-chu-de.js') : root.TarotChuDe;

  // [tên tiếng Anh, tên tiếng Việt, từ khóa xuôi, ý nghĩa xuôi, từ khóa ngược, ý nghĩa ngược]
  const AN_CHINH = [
    ['The Fool', 'Kẻ Khờ', 'khởi đầu mới, tự do, ngây thơ', 'Một chương mới đang mở ra. Hãy bước tới với tâm thế cởi mở, dám thử điều chưa từng làm, nhưng đừng quên nhìn đường.', 'liều lĩnh, thiếu chuẩn bị, chần chừ', 'Bạn đang hoặc quá vội vàng, hoặc sợ đến mức không dám bắt đầu. Cần cân bằng giữa can đảm và cẩn trọng.'],
    ['The Magician', 'Nhà Ảo Thuật', 'ý chí, kỹ năng, hiện thực hóa', 'Bạn có đủ công cụ và năng lực để biến ý tưởng thành hiện thực. Tập trung và hành động ngay.', 'phân tán, thao túng, tài năng bị bỏ phí', 'Năng lượng đang bị phân tán hoặc dùng sai chỗ. Cẩn thận với những lời hứa quá đẹp, kể cả của chính mình.'],
    ['The High Priestess', 'Nữ Tư Tế', 'trực giác, bí ẩn, nội tâm', 'Câu trả lời nằm bên trong bạn. Lắng nghe trực giác, quan sát nhiều hơn nói, chưa cần vội quyết định.', 'phớt lờ trực giác, bí mật, mất kết nối', 'Bạn đang bỏ qua tiếng nói bên trong, hoặc có điều gì đó còn bị che giấu. Hãy dành thời gian tĩnh lặng.'],
    ['The Empress', 'Hoàng Hậu', 'sung túc, nuôi dưỡng, sáng tạo', 'Thời kỳ đơm hoa kết trái, dồi dào về cảm xúc, sáng tạo hoặc vật chất. Chăm sóc bản thân và những gì bạn đang vun đắp.', 'bỏ bê bản thân, phụ thuộc, trì trệ', 'Bạn có thể đang cho đi quá nhiều mà quên mình, hoặc ý tưởng chưa được nuôi dưỡng đủ.'],
    ['The Emperor', 'Hoàng Đế', 'trật tự, quyền lực, kỷ luật', 'Lúc cần kế hoạch rõ ràng và tinh thần trách nhiệm. Đứng vững trên nguyên tắc của mình.', 'độc đoán, cứng nhắc, mất kiểm soát', 'Kiểm soát quá mức hay thiếu kỷ luật đều gây rắc rối. Xem lại cách bạn dùng quyền hạn.'],
    ['The Hierophant', 'Giáo Hoàng', 'truyền thống, học hỏi, niềm tin', 'Đi theo con đường đã được kiểm chứng, tìm người thầy hoặc dựa vào những giá trị chung sẽ có lợi.', 'phá lệ, nghi ngờ khuôn khổ, tự tìm đường', 'Bạn muốn thoát khỏi khuôn mẫu cũ. Điều đó không sai, miễn là bạn hiểu rõ lý do.'],
    ['The Lovers', 'Tình Nhân', 'tình yêu, hòa hợp, lựa chọn', 'Một mối quan hệ hoặc một lựa chọn quan trọng dựa trên giá trị thật của bạn. Hãy chọn bằng cả lý trí và trái tim.', 'mất cân bằng, bất đồng, chọn sai', 'Có sự lệch pha trong mối quan hệ, hoặc giữa điều bạn muốn và điều bạn đang làm.'],
    ['The Chariot', 'Cỗ Xe', 'quyết tâm, chiến thắng, làm chủ', 'Ý chí mạnh mẽ giúp bạn vượt qua trở ngại. Giữ hướng đi và đừng để cảm xúc kéo lệch.', 'mất phương hướng, nóng vội, bị cản trở', 'Bạn đang cố tiến lên nhưng thiếu định hướng, hoặc chính mình đang cản đường mình.'],
    ['Strength', 'Sức Mạnh', 'can đảm, kiên nhẫn, lòng trắc ẩn', 'Sức mạnh thật đến từ sự bình tĩnh và mềm mỏng. Bạn đủ vững vàng để vượt qua thử thách.', 'tự ti, mất kiên nhẫn, nóng giận', 'Nỗi sợ hoặc sự thiếu tự tin đang lấn át. Hãy đối xử với bản thân nhẹ nhàng hơn.'],
    ['The Hermit', 'Ẩn Sĩ', 'suy ngẫm, tìm kiếm, cô tịch', 'Lúc lùi lại một bước để tự vấn. Câu trả lời đến khi bạn tĩnh lặng và đi chậm.', 'cô lập, trốn tránh, lạc lối', 'Rút lui quá lâu có thể khiến bạn tách biệt. Đã đến lúc kết nối lại với mọi người.'],
    ['Wheel of Fortune', 'Bánh Xe Số Phận', 'vận may, chu kỳ, bước ngoặt', 'Bánh xe đang quay theo hướng thuận. Thay đổi đang đến, hãy nắm lấy cơ hội.', 'vận xui, kháng cự thay đổi, lặp lại', 'Giai đoạn chững lại hoặc gặp khó ngoài tầm kiểm soát. Điều gì quay xuống rồi cũng sẽ quay lên.'],
    ['Justice', 'Công Lý', 'công bằng, sự thật, nhân quả', 'Mọi việc được cân nhắc công bằng. Hành động có trách nhiệm sẽ nhận kết quả xứng đáng.', 'bất công, né tránh trách nhiệm, thiên lệch', 'Có điều chưa minh bạch, hoặc bạn đang né tránh hệ quả của một lựa chọn.'],
    ['The Hanged Man', 'Người Treo Ngược', 'tạm dừng, buông bỏ, góc nhìn mới', 'Chờ đợi không phải là thất bại. Nhìn vấn đề từ một góc khác sẽ thấy lối ra.', 'trì hoãn, bế tắc, hy sinh vô ích', 'Bạn đang chần chừ quá lâu, hoặc hy sinh mà không nhận lại điều gì.'],
    ['Death', 'Cái Chết', 'kết thúc, chuyển hóa, làm lại', 'Một giai đoạn khép lại để cái mới bắt đầu. Đây là lá bài của sự thay đổi, hiếm khi mang nghĩa đen.', 'níu kéo, sợ thay đổi, trì trệ', 'Bạn đang cố giữ thứ đã hết thời. Buông tay sẽ nhẹ nhõm hơn.'],
    ['Temperance', 'Tiết Chế', 'cân bằng, điều độ, hòa giải', 'Kiên nhẫn dung hòa những điều đối lập sẽ cho kết quả hài hòa. Đừng vội.', 'thái quá, mất cân bằng, thiếu kiên nhẫn', 'Có điều gì đó đang quá đà. Hãy điều chỉnh nhịp sống và kỳ vọng.'],
    ['The Devil', 'Ác Quỷ', 'ràng buộc, cám dỗ, lệ thuộc', 'Bạn có thể đang bị trói buộc bởi thói quen, tiền bạc hay một mối quan hệ không lành mạnh. Nhận ra là bước đầu để thoát.', 'giải thoát, tỉnh ngộ, phá xiềng', 'Bạn bắt đầu thấy rõ điều gì đang giam giữ mình và có đủ sức để rời đi.'],
    ['The Tower', 'Tòa Tháp', 'biến động bất ngờ, sụp đổ, thức tỉnh', 'Điều được xây trên nền móng yếu đang lung lay. Khó chịu, nhưng giúp bạn xây lại vững hơn.', 'khủng hoảng âm ỉ, sợ thay đổi, thoát nạn', 'Biến động đang bị trì hoãn hoặc diễn ra bên trong. Đối mặt sớm sẽ đỡ đau hơn.'],
    ['The Star', 'Ngôi Sao', 'hy vọng, chữa lành, cảm hứng', 'Sau giông bão là bình yên. Hãy tin vào tương lai và tiếp tục ước mơ.', 'mất niềm tin, chán nản, thiếu cảm hứng', 'Bạn đang mệt mỏi, mất phương hướng. Những niềm vui nhỏ sẽ giúp bạn lấy lại hy vọng.'],
    ['The Moon', 'Mặt Trăng', 'mơ hồ, lo âu, ảo giác', 'Không phải mọi thứ đều như vẻ ngoài. Đi chậm, kiểm chứng thông tin và lắng nghe cảm xúc.', 'sáng tỏ dần, vượt qua nỗi sợ, bí mật lộ ra', 'Màn sương đang tan, sự thật dần hiện rõ.'],
    ['The Sun', 'Mặt Trời', 'niềm vui, thành công, sức sống', 'Một trong những lá bài tích cực nhất: rõ ràng, ấm áp, thành công. Hãy tự tin tỏa sáng.', 'niềm vui bị che khuất, lạc quan quá mức, chậm trễ', 'Mọi thứ vẫn tốt nhưng chưa trọn vẹn. Đừng để tiểu tiết làm mất niềm vui.'],
    ['Judgement', 'Phán Xét', 'thức tỉnh, nhìn lại, tiếng gọi', 'Thời điểm nhìn lại hành trình, tha thứ và bước sang một chặng mới.', 'tự trách, nghi ngờ bản thân, bỏ lỡ cơ hội', 'Bạn quá khắt khe với mình, hoặc chưa dám đáp lại tiếng gọi bên trong.'],
    ['The World', 'Thế Giới', 'hoàn thành, trọn vẹn, thành tựu', 'Một chu kỳ khép lại thành công. Hãy ăn mừng và chuẩn bị cho hành trình kế tiếp.', 'dang dở, chưa khép lại, trì hoãn', 'Còn một mảnh ghép chưa xong. Hoàn tất nó trước khi bắt đầu việc mới.'],
  ];

  // Mỗi bộ 14 lá theo thứ tự Át, 2…10, Tiểu Đồng, Hiệp Sĩ, Hoàng Hậu, Vua: [từ khóa xuôi, ý nghĩa xuôi, từ khóa ngược, ý nghĩa ngược]
  const BO = [
    { ma: 'gay', ten: 'Gậy', en: 'Wands', nguyenTo: 'Lửa', chuDe: 'hành động, đam mê và công việc', la: [
      ['cảm hứng, khởi đầu, nhiệt huyết', 'Một tia lửa mới: ý tưởng, dự án hoặc đam mê đang chờ bạn bắt tay vào.', 'trì hoãn, thiếu động lực, khởi đầu sai', 'Ý tưởng đã có nhưng năng lượng chưa đủ, hoặc thời điểm chưa phù hợp.'],
      ['lập kế hoạch, tầm nhìn, quyết định', 'Bạn đứng trước nhiều hướng đi. Hãy lên kế hoạch dài hạn và chọn con đường lớn hơn.', 'sợ thay đổi, thiếu kế hoạch, an phận', 'Bạn ngại rời vùng an toàn dù biết cần tiến lên.'],
      ['mở rộng, chờ kết quả, nhìn xa', 'Những gì bạn gieo đang bắt đầu có kết quả; cơ hội mở rộng ra bên ngoài.', 'chậm trễ, thất vọng, tầm nhìn hẹp', 'Kết quả đến chậm hơn mong đợi. Xem lại kế hoạch của mình.'],
      ['ăn mừng, ổn định, mái ấm', 'Niềm vui, sự hòa hợp và một cột mốc đáng ăn mừng cùng người thân.', 'thiếu gắn kết, chuyển tiếp, bất ổn trong nhà', 'Không khí gia đình hoặc tập thể chưa thật hòa hợp.'],
      ['cạnh tranh, bất đồng, va chạm', 'Nhiều ý kiến trái chiều. Cạnh tranh có thể lành mạnh nếu biết hợp tác.', 'tránh xung đột, căng thẳng ngầm, hòa giải', 'Mâu thuẫn đang lắng xuống, hoặc đang bị né tránh.'],
      ['chiến thắng, được công nhận, tự tin', 'Nỗ lực của bạn được ghi nhận; thành công và lời khen đang đến.', 'kiêu ngạo, chưa được ghi nhận, vấp ngã nhỏ', 'Bạn chưa nhận được sự ghi nhận mong muốn, hoặc đang quá cần lời khen.'],
      ['giữ lập trường, kiên trì, thử thách', 'Bạn phải đứng vững trước áp lực. Giữ quan điểm sẽ được đền đáp.', 'kiệt sức, nhượng bộ, choáng ngợp', 'Bạn mệt mỏi vì phải chống đỡ. Hãy chọn trận nào đáng đánh.'],
      ['tốc độ, tin tức, tiến triển nhanh', 'Mọi việc chuyển động nhanh; tin tức hoặc cơ hội đến dồn dập.', 'trì hoãn, vội vàng, mất nhịp', 'Mọi thứ hoặc quá chậm, hoặc quá nhanh khiến bạn hụt hơi.'],
      ['bền bỉ, phòng bị, sắp tới đích', 'Bạn đã đi gần hết chặng đường. Mệt nhưng hãy cố thêm chút nữa.', 'kiệt quệ, phòng thủ quá mức, bỏ cuộc', 'Bạn quá mệt mỏi hoặc nghi ngờ mọi thứ. Cần nghỉ ngơi.'],
      ['gánh nặng, trách nhiệm, quá tải', 'Bạn đang ôm quá nhiều việc; thành công đi kèm áp lực.', 'buông bớt, giao việc, quá sức', 'Đã đến lúc chia sẻ gánh nặng trước khi kiệt sức.'],
      ['khám phá, hào hứng, tin vui', 'Một tin vui hoặc ý tưởng mới đầy hào hứng. Hãy tò mò và dám thử.', 'thiếu định hướng, nóng vội, tin không vui', 'Hứng khởi nhanh rồi tắt. Cần kiên trì hơn.'],
      ['phiêu lưu, hành động, nhiệt huyết', 'Lao vào hành động với năng lượng cao; thời điểm của sự táo bạo.', 'bốc đồng, nóng nảy, bỏ dở', 'Hành động thiếu suy nghĩ có thể khiến việc đổ bể.'],
      ['tự tin, ấm áp, quyết đoán', 'Bạn thu hút người khác bằng sự tự tin và nhiệt tình. Hãy dẫn dắt.', 'ghen tị, thiếu tự tin, đòi hỏi', 'Bạn nghi ngờ sức hút của mình, hoặc đang muốn kiểm soát quá nhiều.'],
      ['lãnh đạo, tầm nhìn, dám làm', 'Bạn có tầm nhìn và khả năng truyền cảm hứng. Dẫn đầu bằng hành động.', 'độc đoán, nóng vội, kỳ vọng quá cao', 'Tham vọng lớn nhưng thiếu kiên nhẫn với người khác.'],
    ] },
    { ma: 'coc', ten: 'Cốc', en: 'Cups', nguyenTo: 'Nước', chuDe: 'cảm xúc, tình yêu và các mối quan hệ', la: [
      ['tình cảm mới, yêu thương, cảm xúc dâng trào', 'Một nguồn cảm xúc mới: tình yêu, tình bạn hoặc sự đồng cảm sâu sắc.', 'kìm nén, trống rỗng, khép lòng', 'Bạn đang khép lòng hoặc chưa sẵn sàng đón nhận.'],
      ['kết đôi, hòa hợp, gắn kết', 'Một mối quan hệ cân bằng, tôn trọng lẫn nhau; cũng có thể là một cuộc hợp tác tốt.', 'bất hòa, lệch pha, chia tay', 'Có sự lệch pha giữa hai người. Cần nói chuyện thẳng thắn.'],
      ['tình bạn, ăn mừng, cộng đồng', 'Niềm vui bên bạn bè, những cuộc gặp gỡ và lý do để ăn mừng.', 'quá đà, thị phi, xa cách bạn bè', 'Cuộc vui quá mức hoặc có mâu thuẫn trong nhóm bạn.'],
      ['thờ ơ, chán chường, suy ngẫm', 'Bạn đang lơ đãng trước cơ hội. Hãy nhìn lại những gì đang được trao cho mình.', 'tỉnh ra, đón nhận, thoát chán nản', 'Bạn bắt đầu mở lòng trở lại với cơ hội mới.'],
      ['mất mát, tiếc nuối, buồn bã', 'Bạn đang nhìn vào điều đã mất, trong khi vẫn còn những điều quý giá phía sau.', 'chấp nhận, chữa lành, bước tiếp', 'Nỗi buồn dịu dần; bạn sẵn sàng đi tiếp.'],
      ['hoài niệm, tuổi thơ, giản dị', 'Kỷ niệm đẹp hoặc người cũ quay lại; sự giản dị mang lại niềm vui.', 'mắc kẹt quá khứ, buông kỷ niệm, trưởng thành', 'Sống mãi trong quá khứ khiến bạn bỏ lỡ hiện tại.'],
      ['nhiều lựa chọn, mơ mộng, ảo tưởng', 'Nhiều khả năng hấp dẫn nhưng không phải cái nào cũng thật. Hãy tỉnh táo.', 'rõ ràng, quyết định, thực tế', 'Bạn đã nhìn rõ và sẵn sàng chọn một hướng.'],
      ['rời đi, tìm ý nghĩa, từ bỏ', 'Bạn sẵn sàng rời bỏ điều không còn nuôi dưỡng mình để tìm điều ý nghĩa hơn.', 'sợ rời đi, lưỡng lự, quay lại', 'Bạn biết nên đi nhưng chưa dám buông.'],
      ['toại nguyện, hài lòng, ước mơ thành thật', 'Lá bài của điều ước: mong muốn của bạn có khả năng thành hiện thực.', 'không thỏa mãn, tham lam, tự mãn', 'Đạt được rồi vẫn thấy thiếu. Xem lại điều bạn thật sự cần.'],
      ['hạnh phúc gia đình, viên mãn, hài hòa', 'Hạnh phúc trọn vẹn trong gia đình và các mối quan hệ thân thiết.', 'bất hòa gia đình, kỳ vọng sai, xa cách', 'Hình ảnh hạnh phúc chưa khớp với thực tế; cần vun đắp lại.'],
      ['tin vui tình cảm, nhạy cảm, sáng tạo', 'Một lời mời, một tin nhắn dễ thương hoặc ý tưởng sáng tạo bất ngờ.', 'cảm xúc non nớt, mơ mộng, hụt hẫng', 'Cảm xúc thất thường. Đừng quá nhạy cảm với chuyện nhỏ.'],
      ['lãng mạn, lời mời, theo đuổi', 'Một người hoặc một lời đề nghị lãng mạn đang đến. Hãy theo trái tim.', 'thất thường, hứa suông, ghen tuông', 'Lời ngọt ngào chưa chắc đi kèm hành động.'],
      ['thấu cảm, dịu dàng, trực giác', 'Bạn có khả năng lắng nghe và chữa lành. Hãy tin vào cảm xúc của mình.', 'đa cảm quá mức, phụ thuộc, quên bản thân', 'Bạn đang gánh cảm xúc của người khác mà quên chăm sóc mình.'],
      ['điềm tĩnh, bao dung, cân bằng cảm xúc', 'Bạn làm chủ được cảm xúc, bình tĩnh và đáng tin cậy.', 'kìm nén, thất thường, thao túng cảm xúc', 'Cảm xúc bị dồn nén có thể bùng phát lúc không ngờ.'],
    ] },
    { ma: 'kiem', ten: 'Kiếm', en: 'Swords', nguyenTo: 'Khí', chuDe: 'suy nghĩ, sự thật và những quyết định khó', la: [
      ['sáng suốt, sự thật, đột phá', 'Một ý tưởng rõ ràng hoặc một sự thật được phơi bày giúp bạn đột phá.', 'rối trí, hiểu lầm, lời nói gây tổn thương', 'Suy nghĩ chưa rõ ràng. Cẩn trọng với lời nói.'],
      ['phân vân, bế tắc, né tránh', 'Bạn lưỡng lự giữa hai lựa chọn và đang chọn không nhìn. Cần thêm thông tin.', 'quá tải, buộc phải chọn, sự thật lộ ra', 'Không thể né mãi; đã đến lúc chọn.'],
      ['đau lòng, tổn thương, chia ly', 'Một nỗi đau cảm xúc cần được thừa nhận để chữa lành.', 'hồi phục, tha thứ, nguôi ngoai', 'Vết thương đang lành; bạn bắt đầu buông được nỗi đau.'],
      ['nghỉ ngơi, hồi sức, tĩnh dưỡng', 'Bạn cần lùi lại để nạp năng lượng trước khi tiếp tục.', 'kiệt sức, bồn chồn, trở lại', 'Nghỉ chưa đủ đã vội lao vào, hoặc đã đến lúc quay lại.'],
      ['xung đột, thắng thua, sứt mẻ', 'Thắng một cuộc tranh cãi nhưng có thể mất lòng người. Cân nhắc cái giá.', 'hòa giải, hối hận, bỏ qua', 'Bạn muốn làm lành sau xung đột. Hãy là người mở lời.'],
      ['chuyển tiếp, rời đi, vượt khó', 'Bạn đang rời khỏi giai đoạn khó khăn để đến nơi yên ổn hơn.', 'mắc kẹt, hành trang cũ, chuyển đổi chậm', 'Bạn muốn đi tiếp nhưng vẫn mang theo vấn đề cũ.'],
      ['mưu mẹo, lén lút, chiến thuật', 'Cẩn thận với sự không trung thực, của người khác hoặc của chính bạn.', 'bị lộ, thú nhận, lương tâm', 'Sự thật sắp lộ ra; minh bạch là lựa chọn tốt nhất.'],
      ['tự giới hạn, mắc kẹt, bất lực', 'Bạn thấy mình bị trói buộc, nhưng phần lớn rào cản nằm trong suy nghĩ.', 'giải thoát, góc nhìn mới, tự do', 'Bạn bắt đầu thấy lối ra và lấy lại quyền chủ động.'],
      ['lo âu, mất ngủ, ác mộng', 'Nỗi lo khiến bạn mất ngủ. Thường thì sự việc không tệ như bạn nghĩ.', 'vơi lo âu, chia sẻ, hy vọng', 'Nói ra nỗi lo giúp bạn nhẹ lòng hơn.'],
      ['kết thúc đau đớn, chạm đáy, buông bỏ', 'Một chuyện đã chạm đáy; từ đây chỉ có thể đi lên.', 'hồi phục, đứng dậy, níu kéo', 'Bạn đang dần đứng dậy, hoặc vẫn níu thứ đã kết thúc.'],
      ['tò mò, quan sát, ham học', 'Đặt câu hỏi, tìm hiểu kỹ và giữ đầu óc tỉnh táo.', 'nói không suy nghĩ, tò mò quá mức, thị phi', 'Cẩn thận lời nói và những tin đồn.'],
      ['quyết liệt, thẳng thắn, nhanh nhẹn', 'Bạn lao thẳng tới mục tiêu với lý lẽ sắc bén.', 'hấp tấp, gây hấn, thiếu suy xét', 'Tốc độ không đi kèm suy nghĩ dễ làm tổn thương người khác.'],
      ['sáng suốt, độc lập, thẳng thắn', 'Bạn nhìn rõ sự thật và nói thẳng một cách công bằng.', 'lạnh lùng, cay nghiệt, khép lòng', 'Sự sắc bén đang biến thành khắt khe. Mềm mỏng hơn một chút.'],
      ['lý trí, công minh, hiểu biết', 'Quyết định dựa trên logic và sự công bằng; lời khuyên chuyên môn có giá trị.', 'áp đặt, thao túng, lạnh lùng', 'Lý trí đang bị dùng để áp đặt. Xem lại động cơ của mình.'],
    ] },
    { ma: 'tien', ten: 'Tiền', en: 'Pentacles', nguyenTo: 'Đất', chuDe: 'tiền bạc, công việc và sức khỏe', la: [
      ['cơ hội tài chính, khởi đầu vững, thịnh vượng', 'Một cơ hội cụ thể về tiền bạc, công việc hoặc sức khỏe đang mở ra.', 'lỡ cơ hội, hoang phí, kế hoạch kém', 'Cơ hội có nhưng nền tảng chưa vững.'],
      ['cân bằng, linh hoạt, xoay xở', 'Bạn đang cân đối nhiều việc cùng lúc; linh hoạt là chìa khóa.', 'quá tải, mất cân bằng, rối tài chính', 'Bạn ôm quá nhiều; cần sắp xếp lại ưu tiên.'],
      ['hợp tác, tay nghề, làm việc nhóm', 'Kỹ năng của bạn được ghi nhận; phối hợp tốt sẽ cho kết quả chất lượng.', 'thiếu phối hợp, làm qua loa, bất đồng', 'Làm việc nhóm chưa ăn ý hoặc thiếu chú tâm.'],
      ['giữ của, an toàn, kiểm soát', 'Bạn giữ chặt những gì có được. Ổn định, nhưng coi chừng thành keo kiệt.', 'nới tay, chi tiêu, bất an tài chính', 'Hoặc bạn đang nới lỏng hợp lý, hoặc đang chi tiêu quá tay.'],
      ['khó khăn, thiếu thốn, lẻ loi', 'Giai đoạn chật vật về tiền bạc hoặc sức khỏe. Đừng ngại tìm sự giúp đỡ.', 'hồi phục, được giúp, vượt khó', 'Khó khăn đang qua; có người sẵn lòng hỗ trợ bạn.'],
      ['cho và nhận, rộng lượng, giúp đỡ', 'Sự cân bằng giữa cho và nhận; bạn có thể là người giúp hoặc được giúp.', 'nợ nần, cho có điều kiện, bất công', 'Cẩn thận các khoản nợ hoặc những ơn huệ đi kèm ràng buộc.'],
      ['kiên nhẫn, đầu tư dài hạn, đánh giá', 'Bạn đã gieo hạt; giờ là lúc kiên nhẫn chờ và đánh giá tiến độ.', 'nóng vội, kết quả kém, đầu tư sai', 'Công sức chưa tương xứng. Xem lại hướng đầu tư.'],
      ['chăm chỉ, rèn luyện, tỉ mỉ', 'Tập trung trau dồi tay nghề; từng bước nhỏ sẽ tạo nên sự thành thạo.', 'cầu toàn, nhàm chán, thiếu tập trung', 'Làm máy móc hoặc cầu toàn quá mức khiến bạn chững lại.'],
      ['tự chủ tài chính, tận hưởng, thành quả', 'Bạn tận hưởng thành quả do chính mình làm ra, tự chủ và sung túc.', 'phụ thuộc, tiêu quá khả năng, cô đơn', 'Vẻ ngoài sung túc nhưng bên trong chưa thật vững.'],
      ['gia sản, ổn định lâu dài, gia đình', 'Sự thịnh vượng bền vững, di sản gia đình và nền tảng cho thế hệ sau.', 'tranh chấp tài sản, bất ổn, mất mát', 'Chuyện tiền bạc trong gia đình cần được giải quyết rõ ràng.'],
      ['học hỏi, cơ hội mới, chăm chỉ', 'Một cơ hội học tập hoặc công việc mới. Bắt đầu từ những bước cụ thể.', 'chậm tiến bộ, trì hoãn, mơ mộng', 'Có kế hoạch nhưng chưa hành động.'],
      ['đáng tin, bền bỉ, đều đặn', 'Chậm mà chắc; sự kiên trì đều đặn sẽ đưa bạn tới đích.', 'trì trệ, cứng nhắc, nhàm chán', 'Quá an toàn khiến bạn giậm chân tại chỗ.'],
      ['chu đáo, thực tế, sung túc', 'Bạn chăm lo tốt cho bản thân và gia đình, cân bằng công việc và cuộc sống.', 'lo toan quá mức, mất cân bằng, quên mình', 'Mải lo cho người khác hoặc công việc mà quên chính mình.'],
      ['thịnh vượng, vững vàng, thành đạt', 'Thành công vật chất và sự ổn định nhờ quản lý khôn ngoan.', 'tham lam, cứng nhắc, nặng vật chất', 'Coi tiền bạc là thước đo duy nhất dễ khiến bạn mất điều quan trọng.'],
    ] },
  ];

  const LA_MA = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
  const HANG_VI = ['Át', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Tiểu Đồng', 'Hiệp Sĩ', 'Hoàng Hậu', 'Vua'];
  const HANG_EN = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

  // id 0–21: Ẩn Chính; 22–35 Gậy, 36–49 Cốc, 50–63 Kiếm, 64–77 Tiền (mỗi bộ Át → Vua)
  const BO_BAI = [
    ...AN_CHINH.map(([en, ten, kx, yx, kn, yn], i) => ({ id: i, ten, tenEn: en, nhom: 'anChinh', bo: null, so: LA_MA[i], hang: i,
      xuoi: { tuKhoa: kx, y: yx }, nguoc: { tuKhoa: kn, y: yn } })),
    ...BO.flatMap((b, bi) => b.la.map(([kx, yx, kn, yn], h) => ({ id: 22 + bi * 14 + h, ten: `${HANG_VI[h]} ${b.ten}`, tenEn: `${HANG_EN[h]} of ${b.en}`,
      nhom: 'anPhu', bo: b.ma, so: h < 10 ? HANG_VI[h].replace('Át', 'A') : HANG_VI[h], hang: h + 1,
      xuoi: { tuKhoa: kx, y: yx }, nguoc: { tuKhoa: kn, y: yn } }))),
  ];
  // Chủ đề: chỉ số trong y-nghia-chu-de.js và bộ bài khớp với chủ đề (để nhận xét tổng quan)
  const CHU_DE = {
    tongquan: { ten: 'Tổng quan', moTa: 'Cái nhìn chung về tình hình của bạn' },
    tinhyeu: { ten: 'Tình yêu', moTa: 'Tình cảm, hẹn hò, hôn nhân', i: 0, bo: 'coc' },
    sunghiep: { ten: 'Sự nghiệp', moTa: 'Công việc, học hành, thăng tiến', i: 2, bo: 'gay' },
    taichinh: { ten: 'Tài chính', moTa: 'Tiền bạc, đầu tư, chi tiêu', i: 4, bo: 'tien' },
    banthan: { ten: 'Bản thân', moTa: 'Cảm xúc, sức khỏe tinh thần, phát triển cá nhân', i: 6 },
  };
  BO_BAI.forEach(l => { l.chuDe = Object.fromEntries(Object.entries(CHU_DE).filter(([, c]) => c.i !== undefined).map(([k, c]) => [k, { xuoi: Y[l.id][c.i], nguoc: Y[l.id][c.i + 1] }])); });
  const THONG_TIN_BO = Object.fromEntries(BO.map(b => [b.ma, { ten: b.ten, en: b.en, nguyenTo: b.nguyenTo, chuDe: b.chuDe }]));

  const KIEU_TRAI = {
    '1la': { ten: 'Lá bài hôm nay', moTa: 'Một lá cho thông điệp bạn cần lúc này.', viTri: [['Thông điệp', 'Điều bạn cần lưu ý lúc này']] },
    '3la': { ten: 'Quá khứ, Hiện tại, Tương lai', moTa: 'Ba lá cho dòng chảy của một vấn đề.', viTri: [['Quá khứ', 'Điều đã dẫn tới tình huống hiện tại'], ['Hiện tại', 'Tình hình và năng lượng lúc này'], ['Tương lai', 'Hướng đi nếu mọi việc tiếp diễn như hiện tại']] },
    'tinhcam': { ten: 'Tình cảm', moTa: 'Ba lá cho bạn, người ấy và mối quan hệ.', viTri: [['Bạn', 'Cảm xúc và mong muốn của bạn'], ['Người ấy', 'Cảm xúc và suy nghĩ của người kia'], ['Mối quan hệ', 'Hướng phát triển của mối quan hệ']] },
    // luoi: sơ đồ đặt lá trên lưới [hàng, cột, 'x' nếu lá nằm ngang]
    '5la': { ten: 'Năm lá chữ thập', moTa: 'Năm lá cho nguyên nhân, diễn biến và lời khuyên.', viTri: [
      ['Quá khứ', 'Điều đã dẫn tới tình huống hiện tại'], ['Hiện tại', 'Tình hình và năng lượng lúc này'], ['Tương lai', 'Hướng đi nếu mọi việc tiếp diễn'],
      ['Gốc rễ', 'Nguyên nhân sâu xa của vấn đề'], ['Lời khuyên', 'Điều bạn nên làm hoặc lưu ý']],
      luoi: { cot: 3, o: [[2, 1], [2, 2], [2, 3], [3, 2], [1, 2]] } },
    '10la': { ten: 'Thập tự Celtic', moTa: 'Mười lá cho cái nhìn toàn diện về một vấn đề lớn.', viTri: [
      ['Hiện tại', 'Tình hình cốt lõi của vấn đề'], ['Thử thách', 'Điều đang cản trở hoặc cần vượt qua'], ['Nền tảng', 'Gốc rễ sâu xa, điều nằm bên dưới vấn đề'],
      ['Quá khứ gần', 'Điều vừa qua và đang lùi dần'], ['Mục tiêu', 'Điều bạn mong muốn hoặc đang hướng tới'], ['Tương lai gần', 'Điều sắp đến trong thời gian tới'],
      ['Bản thân', 'Thái độ và cách bạn nhìn vấn đề'], ['Môi trường', 'Người xung quanh và hoàn cảnh bên ngoài'], ['Hy vọng và lo sợ', 'Điều bạn mong và điều bạn ngại'],
      ['Kết quả', 'Kết cục nếu mọi việc tiếp diễn như hiện tại']],
      luoi: { cot: 4, o: [[2, 2], [2, 2, 'x'], [3, 2], [2, 1], [1, 2], [2, 3], [4, 4], [3, 4], [2, 4], [1, 4]] } },
  };

  // Số ngẫu nhiên an toàn trong [0, n): trình duyệt dùng crypto.getRandomValues, Node dùng crypto.randomInt
  function ngauNhien(n) {
    if (typeof module !== 'undefined' && module.exports) return require('crypto').randomInt(n);
    const max = Math.floor(0x100000000 / n) * n, a = new Uint32Array(1);
    do crypto.getRandomValues(a); while (a[0] >= max); // bỏ phần dư để mọi lá có xác suất như nhau
    return a[0] % n;
  }
  /** Xáo bài (Fisher–Yates): trả về mảng id 0–77 theo thứ tự mới; mỗi lá kèm cờ ngược */
  function xaoBai(coNguoc = true, rand = ngauNhien) {
    const ids = BO_BAI.map(l => l.id);
    for (let i = ids.length - 1; i > 0; i--) { const j = rand(i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    return ids.map(id => ({ id, nguoc: coNguoc && rand(2) === 1 }));
  }

  /** Ghép kết quả cho các lá đã chọn: chon = [{ id, nguoc }] theo thứ tự vị trí */
  function docBai(kieu, chon, chuDe = 'tongquan') {
    const k = KIEU_TRAI[kieu], rieng = chuDe !== 'tongquan';
    const la = chon.map((c, i) => {
      const card = BO_BAI[c.id], chieu = c.nguoc ? 'nguoc' : 'xuoi', m = card[chieu];
      return { viTri: k.viTri[i][0], yViTri: k.viTri[i][1], id: card.id, ten: card.ten, tenEn: card.tenEn, so: card.so, nhom: card.nhom, bo: card.bo,
        nguoc: !!c.nguoc, tuKhoa: m.tuKhoa, y: rieng ? card.chuDe[chuDe][chieu] : m.y, yChung: rieng ? m.y : null };
    });
    return { kieu, tenKieu: k.ten, chuDe, tenChuDe: CHU_DE[chuDe].ten, la, tongQuan: tongQuan(la, chuDe) };
  }

  function tongQuan(la, chuDe) {
    const out = [], n = la.length, cd = CHU_DE[chuDe];
    if (cd && cd.bo) {
      const so = la.filter(l => l.bo === cd.bo).length, b = THONG_TIN_BO[cd.bo];
      out.push(!so ? `Không có lá bộ ${b.ten} (bộ gắn với ${cd.ten.toLowerCase()}): chuyện ${cd.ten.toLowerCase()} lúc này chịu ảnh hưởng nhiều từ các mặt khác trong cuộc sống.`
        : so >= Math.ceil(n * 0.3) ? `Có ${so} lá bộ ${b.ten}, bộ gắn với chuyện ${cd.ten.toLowerCase()}: câu trả lời cho câu hỏi của bạn khá rõ ràng.`
        : `Có ${so} lá bộ ${b.ten} (bộ gắn với ${cd.ten.toLowerCase()}): chủ đề này có mặt trong trải bài nhưng chưa phải trọng tâm.`);
    }
    if (n === 1) {
      const l = la[0];
      out.push(l.nhom === 'anChinh' ? `${l.ten} là lá Ẩn Chính: thông điệp hôm nay mang tính bước ngoặt, đáng để bạn dừng lại suy ngẫm.`
        : `${l.ten} thuộc bộ ${THONG_TIN_BO[l.bo].ten} (${THONG_TIN_BO[l.bo].nguyenTo}): hôm nay hãy chú ý chuyện ${THONG_TIN_BO[l.bo].chuDe}.`);
    } else {
      const chinh = la.filter(l => l.nhom === 'anChinh').length;
      if (chinh >= Math.max(2, Math.ceil(n * 0.4))) out.push(`Có ${chinh}/${n} lá Ẩn Chính: đây là giai đoạn có ý nghĩa lớn, mang những bài học quan trọng hơn là chuyện thường ngày.`);
      else if (chinh === 0) out.push('Không có lá Ẩn Chính: vấn đề nằm trong tầm tay bạn, phụ thuộc nhiều vào lựa chọn hằng ngày.');
      const dem = {};
      la.forEach(l => { if (l.bo) dem[l.bo] = (dem[l.bo] || 0) + 1; });
      Object.entries(dem).filter(([, c]) => c >= Math.max(2, Math.ceil(n * 0.4))).forEach(([b, c]) =>
        out.push(`${c} lá bộ ${THONG_TIN_BO[b].ten} (${THONG_TIN_BO[b].nguyenTo}): trọng tâm là ${THONG_TIN_BO[b].chuDe}.`));
    }
    const nguoc = la.filter(l => l.nguoc).length;
    if (n > 1 && nguoc === n) out.push('Tất cả các lá đều ngược: nhiều năng lượng đang bị chặn lại. Hãy nhìn vào bên trong trước khi hành động.');
    else if (n > 1 && nguoc === 0) out.push('Không có lá ngược: năng lượng đang thông suốt, mọi việc dễ diễn ra theo hướng các lá chỉ ra.');
    else if (nguoc) out.push(`${nguoc} lá ngược: chú ý những điểm đang bị trì hoãn hoặc cần nhìn theo cách khác.`);
    return out;
  }

  const Tarot = { BO_BAI, KIEU_TRAI, CHU_DE, THONG_TIN_BO, xaoBai, docBai, ngauNhien };
  if (typeof module !== 'undefined' && module.exports) module.exports = Tarot; else root.Tarot = Tarot;
})(typeof window !== 'undefined' ? window : globalThis);
