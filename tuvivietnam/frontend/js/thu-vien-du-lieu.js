/* Thư viện kiến thức huyền học: chuyên mục và nội dung bài viết.
 * Mỗi bài: slug, tieuDe, moTa, chuyenMuc, the (từ khóa), ngayDang, capNhat (YYYY-MM-DD), noiBat (thứ tự biên tập chọn, nhỏ là trước),
 * noiDung (markdown: ## mục, ### mục con, danh sách, bảng |), viDu { tieuDe, noiDung }, hoiDap [[hỏi, đáp]], nguon [[tên, url?]],
 * congCu [nhãn, đường dẫn tính từ tuvivietnam/frontend/].
 * Thêm bài: thêm một phần tử vào BAI rồi chạy `node scripts/bai-viet.js` ở gốc kho để sinh trang tĩnh. */
(function (root) {
  'use strict';
  const CHUYEN_MUC = [
    { id: 'tu-vi', ten: 'Tử vi', moTa: 'Tử vi đẩu số, 12 cung, chính tinh và phụ tinh, đại hạn, tiểu hạn.' },
    { id: 'con-giap', ten: '12 con giáp', moTa: 'Tính cách từng tuổi, tam hợp, lục hợp, tứ hành xung, ngũ hành của năm sinh.' },
    { id: 'phong-thuy', ten: 'Phong thủy', moTa: 'Ngũ hành, màu sắc, phương hướng và cách dùng cho đúng chừng mực.' },
    { id: 'chiem-tinh', ten: 'Chiêm tinh', moTa: '12 cung hoàng đạo, hành tinh, nhà, góc chiếu và bản đồ sao cá nhân.' },
    { id: 'than-so-hoc', ten: 'Thần số học', moTa: 'Số chủ đạo, các chỉ số theo tên, năm, tháng và ngày cá nhân.' },
    { id: 'tarot', ten: 'Tarot', moTa: 'Cấu trúc 78 lá, ý nghĩa các nhóm lá và cách trải bài.' },
    { id: 'lich-van-nien', ten: 'Lịch vạn niên', moTa: 'Âm lịch, can chi, tiết khí, ngày hoàng đạo và cách chọn ngày.' },
    { id: 'kien-thuc', ten: 'Kiến thức', moTa: 'Thuật ngữ chung và phương pháp luận: đọc các môn huyền học sao cho tỉnh táo.' },
  ];

  const BAI = [
    {
      slug: 'tu-vi-la-gi', tieuDe: 'Tử vi đẩu số là gì?', chuyenMuc: 'tu-vi', ngayDang: '2026-10-31', capNhat: '2026-11-12', noiBat: 1,
      moTa: 'Lá số tử vi gồm những gì, vì sao có 12 cung và hơn một trăm sao, phái Việt khác sách Trung Hoa ở đâu.',
      the: ['tử vi đẩu số', 'lá số', 'chính tinh', 'phụ tinh', 'thiên bàn', 'phái Việt', 'âm lịch', 'giờ sinh'],
      noiDung: `Tử vi đẩu số là một môn lý số phương Đông. Từ giờ, ngày, tháng và năm sinh theo âm lịch, người ta lập ra một bảng gọi là lá số, rồi dựa vào vị trí các sao trên bảng để bàn về tính cách và các giai đoạn trong đời người. Tên gọi lấy từ sao Tử Vi, ngôi sao đứng đầu hệ thống; "đẩu số" là phép tính dựa trên các chòm sao Bắc Đẩu và Nam Đẩu. Theo truyền thuyết, môn này do Trần Đoàn (Hi Di tiên sinh), một đạo sĩ thời Ngũ Đại sang đầu nhà Tống, hệ thống hóa.

## Lá số gồm những gì

Lá số là một hình vuông chia làm 12 ô bao quanh một ô lớn ở giữa. Mỗi ô ứng với một địa chi, từ Tý đến Hợi, và mang tên một cung nói về một mặt của đời sống:

- **Mệnh** và **Thân**: bản thân, tính cách, hướng đi chung.
- **Phụ Mẫu, Huynh Đệ, Phu Thê, Tử Tức**: cha mẹ, anh chị em, vợ chồng, con cái.
- **Tài Bạch, Quan Lộc, Điền Trạch**: tiền bạc, công việc, nhà cửa.
- **Phúc Đức, Tật Ách, Thiên Di, Nô Bộc**: phúc phần dòng họ, sức khỏe, việc đi xa, bạn bè và người cộng tác.

Ô giữa gọi là thiên bàn, ghi thông tin người xem: ngày sinh âm dương, can chi của năm, tháng, ngày, giờ, bản mệnh theo ngũ hành nạp âm và cục.

## Các sao

Trên lá số có 14 chính tinh chia làm hai chòm:

- **Chòm Tử Vi** (6 sao): Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh.
- **Chòm Thiên Phủ** (8 sao): Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân.

Ngoài ra còn hơn một trăm phụ tinh. Mỗi nhóm sao được an theo một yếu tố riêng: có sao theo can năm sinh (Lộc Tồn, Kình Dương, Đà La, Tứ Hóa), có sao theo chi năm, có sao theo tháng (Tả Phù, Hữu Bật), theo giờ (Văn Xương, Văn Khúc, Địa Không, Địa Kiếp). Vì thế hai người sinh cùng ngày nhưng khác giờ vẫn có lá số khác nhau.

## Thông tin cần có để lập lá số

1. Ngày, tháng, năm sinh. Có thể nhập dương lịch; công cụ sẽ đổi sang âm lịch.
2. Giờ sinh, quy về một trong 12 canh giờ (Tý từ 23 giờ đến 1 giờ, Sửu từ 1 đến 3 giờ, và cứ thế mỗi giờ hai tiếng).
3. Giới tính, vì chiều đi của đại hạn phụ thuộc vào âm dương năm sinh và nam hay nữ.

Giờ sinh là chỗ hay sai nhất. Nếu không chắc, hãy lập thử hai lá số ở hai canh giờ liền nhau và so xem lá nào khớp với những gì bạn đã trải qua.

## Phái Việt

Tử vi ở Việt Nam có một số khác biệt so với sách Trung Hoa, ví dụ cách an Tứ Hóa của vài tuổi, cách đánh giá độ sáng của sao và cách dùng Tuần, Triệt khi luận giải. Sách của các tác giả như Vân Đằng Thái Thứ Lang và Thiên Lương được nhiều người Việt dùng làm chuẩn. Trang Lá Số Tử Vi an sao theo hướng này.

## Đọc lá số với thái độ nào

Lá số là một khung để suy ngẫm về bản thân, không phải lời phán định. Hãy đọc nó như đọc một bản đồ: biết mình đang ở đâu để tự chọn đường đi. Những lời như "số khổ", "số giàu" tách khỏi toàn bộ lá số và hoàn cảnh sống thì gần như không có giá trị.`,
      viDu: { tieuDe: 'Hai người sinh cùng ngày, khác giờ', noiDung: `Hai bạn cùng sinh ngày 15/8/1990 dương lịch (tức 26/6 năm Canh Ngọ âm lịch). Một bạn sinh lúc 6 giờ sáng (giờ Mão), một bạn sinh lúc 14 giờ (giờ Mùi). Năm, tháng, ngày giống nhau nên các sao an theo năm như Lộc Tồn, Tứ Hóa nằm ở cùng ô. Nhưng cung Mệnh tính từ tháng và giờ sinh, nên hai lá số có cung Mệnh ở hai ô khác nhau, kéo theo cả 11 cung còn lại xoay theo. Các sao an theo giờ như Văn Xương, Văn Khúc, Địa Không, Địa Kiếp cũng đổi chỗ.` },
      hoiDap: [
        ['Tử vi và cung hoàng đạo có giống nhau không?', 'Không. Tử vi đẩu số là môn của phương Đông, dùng âm lịch và các sao mang tính quy ước. Cung hoàng đạo thuộc chiêm tinh phương Tây, dựa trên vị trí thật của Mặt Trời và các hành tinh lúc sinh.'],
        ['Không biết giờ sinh thì có lập lá số được không?', 'Lập được nhưng cung Mệnh và nhiều sao sẽ không chắc chắn. Bạn có thể xem phần chỉ phụ thuộc năm sinh, hoặc lập thử nhiều canh giờ rồi đối chiếu với các sự kiện đã xảy ra.'],
        ['Lá số có thay đổi theo thời gian không?', 'Lá số gốc cố định. Thứ thay đổi là đại hạn (mười năm) và tiểu hạn (từng năm), được đọc chồng lên lá số gốc.'],
      ],
      nguon: [['Vân Đằng Thái Thứ Lang, Tử vi đẩu số tân biên'], ['Ziwei doushu (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Ziwei_doushu'], ['Hồ Ngọc Đức, Lịch Việt Nam: thuật toán đổi âm dương lịch', 'https://www.informatik.uni-leipzig.de/~duc/amlich/']],
      congCu: ['Lập lá số của bạn', 'la-so.html'],
    },
    {
      slug: '12-cung-la-so-tu-vi', cu: ['doc-la-so'], tieuDe: '12 cung trong lá số tử vi có ý nghĩa như thế nào?', chuyenMuc: 'tu-vi', ngayDang: '2026-10-31', capNhat: '2026-11-12', noiBat: 2,
      moTa: 'Ý nghĩa từng cung từ Mệnh đến Phụ Mẫu, cách an cung Mệnh và cung Thân, và vì sao phải xem tam phương tứ chính.',
      the: ['12 cung', 'cung Mệnh', 'cung Thân', 'tam phương tứ chính', 'tam hợp', 'xung chiếu', 'vô chính diệu', 'độ sáng'],
      noiDung: `Người mới thường nhìn vào cả 12 ô cùng lúc và thấy rối. Cách dễ hơn là hiểu mỗi cung nói về điều gì, rồi đọc theo một thứ tự cố định.

## Ý nghĩa của từng cung

Các cung được xếp theo chiều nghịch kim đồng hồ, bắt đầu từ cung Mệnh:

| Thứ tự | Cung | Nói về |
|---|---|---|
| 1 | Mệnh | Bản chất, tính cách, hướng đi chung của cả đời |
| 2 | Huynh Đệ | Anh chị em, người ngang hàng thân thiết |
| 3 | Phu Thê | Hôn nhân, người bạn đời, cách mình yêu |
| 4 | Tử Tức | Con cái, học trò, những gì mình tạo ra |
| 5 | Tài Bạch | Cách kiếm tiền, giữ tiền và tiêu tiền |
| 6 | Tật Ách | Sức khỏe, bệnh tật, những rủi ro cho thân thể |
| 7 | Thiên Di | Đi xa, ra ngoài xã hội, cách người khác nhìn mình |
| 8 | Nô Bộc | Bạn bè, cấp dưới, người cộng tác |
| 9 | Quan Lộc | Công việc, sự nghiệp, cách làm việc |
| 10 | Điền Trạch | Nhà cửa, đất đai, tài sản cố định |
| 11 | Phúc Đức | Phúc phần dòng họ, đời sống tinh thần |
| 12 | Phụ Mẫu | Cha mẹ, cấp trên, giấy tờ |

## Cung Mệnh và cung Thân được an thế nào

Cả hai đều tính từ tháng và giờ sinh âm lịch:

1. Bắt đầu ở ô Dần, đếm thuận (Dần, Mão, Thìn...) đến tháng sinh: tháng Giêng ở Dần, tháng Hai ở Mão.
2. Từ ô vừa tìm được, coi đó là giờ Tý. Đếm **nghịch** đến giờ sinh để được cung Mệnh, đếm **thuận** đến giờ sinh để được cung Thân.

Cung Thân luôn trùng với một trong sáu cung Mệnh, Phúc Đức, Quan Lộc, Thiên Di, Tài Bạch hoặc Phu Thê. Theo quan niệm phổ biến, cung Mệnh nói về nửa đầu đời, cung Thân ảnh hưởng rõ hơn ở nửa sau.

## Tam phương tứ chính

Một cung không đứng một mình. Khi xem một cung, người ta xem cùng lúc bốn cung:

- Chính cung đang xem.
- Hai cung tam hợp, cách chính cung bốn ô về hai phía. Với cung Mệnh, đó là Tài Bạch và Quan Lộc.
- Cung xung chiếu nằm đối diện. Với cung Mệnh, đó là Thiên Di.

Bốn cung này gộp lại mới cho ra bức tranh đầy đủ. Trên trang lập lá số, bạn bấm vào bất kỳ cung nào thì ba cung còn lại sẽ được tô sáng.

## Chính tinh, độ sáng và cung vô chính diệu

Chính tinh quyết định tính chất chủ đạo của một cung. Mỗi chính tinh có độ sáng thay đổi theo ô nó đóng: Miếu, Vượng, Đắc là sáng, Bình là trung bình, Hãm là tối. Cùng một sao nhưng sáng thì phát huy mặt tốt, tối thì dễ lộ mặt xấu.

Cung không có chính tinh nào gọi là **vô chính diệu**. Khi đó người ta mượn chính tinh của cung xung chiếu để xem, và chú ý nhiều hơn tới các phụ tinh trong cung.

## Phụ tinh và Tứ Hóa

Phụ tinh làm rõ thêm hoặc làm lệch đi tính chất của chính tinh. Nhóm cát tinh hay gặp gồm Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt và Lộc Tồn. Nhóm sát tinh gồm Kình Dương, Đà La, Địa Không, Địa Kiếp, Hỏa Tinh và Linh Tinh. Tứ Hóa gồm Hóa Lộc, Hóa Quyền, Hóa Khoa và Hóa Kỵ, an theo can năm sinh và bám vào bốn sao cụ thể; ba hóa đầu thường được xem là thuận lợi, Hóa Kỵ thường được xem là trở ngại.`,
      viDu: { tieuDe: 'An cung Mệnh cho người sinh tháng 3, giờ Thìn', noiDung: `Tháng 3 âm lịch: đếm thuận từ Dần thì Dần là tháng 1, Mão là tháng 2, Thìn là tháng 3. Ô Thìn được coi là giờ Tý.

Giờ Thìn là canh giờ thứ năm (Tý, Sửu, Dần, Mão, Thìn). Đếm nghịch từ Thìn: Thìn (Tý), Mão (Sửu), Dần (Dần), Sửu (Mão), Tý (Thìn). Vậy **cung Mệnh ở Tý**.

Đếm thuận từ Thìn: Thìn (Tý), Tỵ (Sửu), Ngọ (Dần), Mùi (Mão), Thân (Thìn). Vậy **cung Thân ở Thân**.

Các cung xếp nghịch từ Mệnh: Tý là Mệnh, Hợi là Huynh Đệ, Tuất là Phu Thê, Dậu là Tử Tức, Thân là Tài Bạch. Vậy người này có Thân cư Tài Bạch; theo cách đọc phổ biến, nửa sau cuộc đời họ đặt nặng chuyện tiền bạc. Tam hợp của Mệnh tại Tý là Thân (Tài Bạch) và Thìn (Quan Lộc), xung chiếu là Ngọ (Thiên Di).` },
      hoiDap: [
        ['Cung Mệnh vô chính diệu có xấu không?', 'Không hẳn. Cung vô chính diệu mượn sao ở cung xung chiếu, và người có Mệnh vô chính diệu thường được mô tả là dễ thích nghi, chịu ảnh hưởng nhiều của môi trường. Tốt hay xấu còn tùy các sao chiếu về và phụ tinh trong cung.'],
        ['Cung Thân trùng cung Mệnh nghĩa là gì?', 'Người sinh giờ Tý hoặc giờ Ngọ có cung Thân trùng cung Mệnh. Cách đọc phổ biến cho rằng tính cách người đó ít thay đổi giữa nửa đầu và nửa sau cuộc đời.'],
        ['Có nên chỉ xem cung Phu Thê để biết chuyện tình cảm?', 'Nên xem cả tam phương tứ chính của cung Phu Thê (Quan Lộc, Thiên Di và cung xung chiếu), cùng cung Mệnh của chính mình, vì cách mình yêu bắt nguồn từ tính cách.'],
      ],
      nguon: [['Vân Đằng Thái Thứ Lang, Tử vi đẩu số tân biên'], ['Nguyễn Phát Lộc, Tử vi hàm số'], ['Ziwei doushu (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Ziwei_doushu']],
      congCu: ['Mở lá số và bấm vào cung Mệnh', 'la-so.html'],
    },
    {
      slug: 'dai-han-tieu-han', tieuDe: 'Đại hạn và tiểu hạn khác nhau ra sao?', chuyenMuc: 'tu-vi', ngayDang: '2026-10-31', capNhat: '2026-11-12', noiBat: 4,
      moTa: 'Đại hạn chia đời người thành từng mười năm bắt đầu từ số cục; tiểu hạn đổi cung mỗi năm theo chi năm sinh. Cách tính và cách đọc chồng lên nhau.',
      the: ['đại hạn', 'tiểu hạn', 'vận hạn', 'cục', 'tuổi mụ', 'âm dương', 'lưu niên'],
      noiDung: `Lá số gốc mô tả cả cuộc đời. Để xem từng giai đoạn, tử vi dùng đại hạn cho từng mười năm và tiểu hạn cho từng năm. Hai loại hạn khác nhau ở độ dài, điểm khởi đầu và chiều đi.

## Đại hạn: mỗi cung giữ mười năm

Đại hạn đầu tiên luôn bắt đầu tại cung Mệnh. Tuổi bắt đầu bằng số cục của lá số:

| Cục | Đại hạn đầu |
|---|---|
| Thủy nhị cục | 2 đến 11 tuổi |
| Mộc tam cục | 3 đến 12 tuổi |
| Kim tứ cục | 4 đến 13 tuổi |
| Thổ ngũ cục | 5 đến 14 tuổi |
| Hỏa lục cục | 6 đến 15 tuổi |

Sau đó cứ mười năm lại sang cung kế tiếp. Chiều đi phụ thuộc vào âm dương của năm sinh và giới tính. Năm có can Giáp, Bính, Mậu, Canh, Nhâm là năm Dương; năm có can Ất, Đinh, Kỷ, Tân, Quý là năm Âm.

- **Dương Nam và Âm Nữ** đi thuận, theo chiều Tý, Sửu, Dần.
- **Âm Nam và Dương Nữ** đi nghịch, theo chiều Tý, Hợi, Tuất.

## Tiểu hạn: mỗi năm một cung

Tiểu hạn đổi cung mỗi năm. Cung khởi đầu phụ thuộc vào chi năm sinh:

- Tuổi Dần, Ngọ, Tuất khởi tại Thìn.
- Tuổi Thân, Tý, Thìn khởi tại Tuất.
- Tuổi Tỵ, Dậu, Sửu khởi tại Mùi.
- Tuổi Hợi, Mão, Mùi khởi tại Sửu.

Năm một tuổi nằm ở cung khởi, sau đó nam đi thuận, nữ đi nghịch, mỗi năm một cung. Mỗi ô trên lá số ghi sẵn chi của những năm tiểu hạn đi qua ô đó.

## So sánh nhanh

| | Đại hạn | Tiểu hạn |
|---|---|---|
| Độ dài | 10 năm | 1 năm |
| Khởi đầu | Cung Mệnh, tuổi bằng số cục | Thìn, Tuất, Mùi hoặc Sửu theo nhóm tuổi |
| Chiều đi | Theo âm dương năm sinh và giới tính | Nam thuận, nữ nghịch |
| Vai trò | Bối cảnh lớn của một giai đoạn | Điểm nhấn của từng năm |

## Đọc chồng các lớp hạn

Thứ tự thường dùng là: lá số gốc cho biết tiềm năng, đại hạn cho biết mười năm này "đang ở cung nào" của đời mình, tiểu hạn và lưu niên cho biết năm nay việc gì nổi lên. Một năm tiểu hạn đẹp trong đại hạn xấu thường chỉ là khoảng nghỉ; ngược lại, một năm tiểu hạn xấu trong đại hạn tốt thường là trở ngại có thể vượt qua.

## Tuổi dùng để tính

Tử vi dùng tuổi âm, hay còn gọi là tuổi mụ: lấy năm đang xem trừ năm sinh âm lịch rồi cộng thêm một. Trên trang lập lá số, bạn nhập "Năm xem hạn"; ô có đại hạn đang chạy và ô tiểu hạn của năm đó sẽ được tô màu.`,
      viDu: { tieuDe: 'Nam sinh năm Canh Ngọ, Thổ ngũ cục, Mệnh tại Mão', noiDung: `Canh là can Dương, người này là nam nên đại hạn đi thuận: 5 đến 14 tuổi ở Mão, 15 đến 24 tuổi ở Thìn, 25 đến 34 tuổi ở Tỵ, 35 đến 44 tuổi ở Ngọ.

Năm 2026 người này 37 tuổi mụ (2026 − 1990 + 1), tức đang ở đại hạn 35 đến 44 tại Ngọ.

Tuổi Ngọ khởi tiểu hạn tại Thìn. Nam đi thuận: 1 tuổi ở Thìn, 2 tuổi ở Tỵ... Cứ 12 năm tiểu hạn quay về chỗ cũ, nên 37 tuổi cũng nằm ở Thìn (vì 37 = 36 + 1). Năm 2026, tiểu hạn tại Thìn, đại hạn tại Ngọ.` },
      hoiDap: [
        ['Đại hạn đổi vào ngày nào?', 'Đại hạn đổi theo tuổi mụ, tức tính theo năm âm lịch. Phần lớn sách coi Tết Nguyên đán là mốc chuyển.'],
        ['Tiểu hạn và lưu niên có giống nhau không?', 'Không. Tiểu hạn đi theo bảng khởi cung của chi năm sinh. Lưu niên (thái tuế) là cung mang chi của chính năm đang xem, ví dụ năm Ngọ thì lưu niên ở ô Ngọ. Nhiều người xem cả hai.'],
        ['Hai người cùng năm sinh có cùng tiểu hạn không?', 'Cùng năm sinh và cùng giới tính thì tiểu hạn nằm ở cùng ô địa chi, nhưng ô đó mang tên cung khác nhau tùy lá số, nên ý nghĩa vẫn khác.'],
      ],
      nguon: [['Vân Đằng Thái Thứ Lang, Tử vi đẩu số tân biên'], ['Nguyễn Phát Lộc, Tử vi hàm số']],
      congCu: ['Xem đại hạn và tiểu hạn năm nay', 'la-so.html'],
    },
    {
      slug: 'thien-can-dia-chi', tieuDe: 'Thiên can và địa chi là gì?', chuyenMuc: 'lich-van-nien', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 3,
      moTa: '10 thiên can, 12 địa chi, vòng 60 năm Lục thập hoa giáp, cách tính can chi năm sinh và can chi của tháng, ngày, giờ.',
      the: ['thiên can', 'địa chi', 'can chi', 'lục thập hoa giáp', 'nạp âm', 'âm dương', 'năm sinh', 'giờ'],
      noiDung: `Can chi là hệ đếm thời gian dùng chung cho âm lịch, tử vi, chọn ngày và phong thủy. Mỗi năm, tháng, ngày, giờ đều được gọi bằng một cặp gồm một thiên can và một địa chi, ví dụ năm Bính Ngọ, ngày Giáp Tý.

## 10 thiên can

| Can | Âm dương | Ngũ hành |
|---|---|---|
| Giáp, Ất | Giáp dương, Ất âm | Mộc |
| Bính, Đinh | Bính dương, Đinh âm | Hỏa |
| Mậu, Kỷ | Mậu dương, Kỷ âm | Thổ |
| Canh, Tân | Canh dương, Tân âm | Kim |
| Nhâm, Quý | Nhâm dương, Quý âm | Thủy |

## 12 địa chi

Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi. Chi ở vị trí lẻ (Tý, Dần, Thìn, Ngọ, Thân, Tuất) là dương, chi ở vị trí chẵn là âm. Về ngũ hành: Dần, Mão thuộc Mộc; Tỵ, Ngọ thuộc Hỏa; Thân, Dậu thuộc Kim; Hợi, Tý thuộc Thủy; Thìn, Tuất, Sửu, Mùi thuộc Thổ.

Mỗi chi cũng là một canh giờ dài hai tiếng: giờ Tý từ 23 giờ đến 1 giờ, giờ Sửu từ 1 đến 3 giờ, giờ Ngọ từ 11 đến 13 giờ.

## Vòng 60: Lục thập hoa giáp

Can và chi ghép lần lượt: Giáp Tý, Ất Sửu, Bính Dần... Can dương chỉ đi với chi dương, can âm đi với chi âm, nên chỉ có 60 cặp (bội chung nhỏ nhất của 10 và 12), không phải 120. Sau 60 năm vòng lặp lại, vì vậy người ta gọi tuổi 61 là tuổi "hoàn giáp".

## Tính can chi năm sinh

- **Can** theo chữ số cuối của năm dương lịch: 0 Canh, 1 Tân, 2 Nhâm, 3 Quý, 4 Giáp, 5 Ất, 6 Bính, 7 Đinh, 8 Mậu, 9 Kỷ.
- **Chi**: lấy năm trừ 4, chia cho 12, lấy số dư: 0 Tý, 1 Sửu, 2 Dần... 11 Hợi.

Lưu ý quan trọng: năm can chi bắt đầu từ Tết Nguyên đán (tử vi, xem tuổi) hoặc từ tiết Lập xuân (bát tự, chọn ngày), không bắt đầu từ 1 tháng 1. Người sinh tháng 1 hoặc đầu tháng 2 dương lịch cần kiểm tra lại.

## Can chi của tháng, ngày, giờ

- **Tháng**: tháng Giêng luôn là tháng Dần. Can của tháng Giêng theo can năm: năm Giáp, Kỷ là Bính Dần; Ất, Canh là Mậu Dần; Bính, Tân là Canh Dần; Đinh, Nhâm là Nhâm Dần; Mậu, Quý là Giáp Dần.
- **Ngày**: can chi ngày xoay vòng 60 ngày liên tục, không phụ thuộc tháng hay năm, nên phải tra lịch hoặc tính từ một mốc.
- **Giờ**: giờ Tý của ngày Giáp hoặc Kỷ là Giáp Tý, rồi lần lượt tăng.

## Nạp âm

Mỗi cặp can chi còn có một hành nạp âm, chia 60 cặp thành 30 đôi. Ví dụ Giáp Tý, Ất Sửu là Hải Trung Kim; Canh Ngọ, Tân Mùi là Lộ Bàng Thổ; Bính Ngọ, Đinh Mùi là Thiên Hà Thủy. Khi người ta nói "mệnh Thổ" theo năm sinh, họ thường nói hành nạp âm này.`,
      viDu: { tieuDe: 'Năm 2026 và người sinh 20/1/1990', noiDung: `Năm 2026: chữ số cuối 6 là Bính; (2026 − 4) chia 12 dư 6 là Ngọ. Vậy 2026 là năm **Bính Ngọ**, nạp âm Thiên Hà Thủy.

Người sinh 20/1/1990: tính theo công thức thì 1990 là Canh Ngọ. Nhưng Tết năm Canh Ngọ rơi vào 27/1/1990, nên ngày 20/1/1990 vẫn thuộc năm **Kỷ Tỵ** âm lịch. Khi xem tuổi, người này tuổi Tỵ, không phải tuổi Ngọ.` },
      hoiDap: [
        ['Vì sao không có năm Giáp Sửu?', 'Giáp là can dương, Sửu là chi âm. Can chi chỉ ghép dương với dương, âm với âm, nên Giáp chỉ đi với Tý, Dần, Thìn, Ngọ, Thân, Tuất.'],
        ['Hành của can, chi và nạp âm khác nhau thì dùng cái nào?', 'Tùy mục đích. Xem mệnh theo năm sinh thường dùng nạp âm. Bát tự và chọn ngày chủ yếu dùng hành của can và chi. Hai cách không mâu thuẫn, chúng trả lời các câu hỏi khác nhau.'],
        ['Tuổi mụ là gì?', 'Tuổi tính theo năm âm lịch, cộng một từ lúc sinh ra và cộng thêm một mỗi khi qua Tết: tuổi mụ = năm đang xem − năm sinh âm lịch + 1.'],
      ],
      nguon: [['Hồ Ngọc Đức, Lịch Việt Nam', 'https://www.informatik.uni-leipzig.de/~duc/amlich/'], ['Sexagenary cycle (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Sexagenary_cycle']],
      congCu: ['Tra can chi của một ngày bất kỳ', '../../xemngay/frontend/index.html'],
    },
    {
      slug: 'ngu-hanh-tuong-sinh-tuong-khac', tieuDe: 'Ngũ hành tương sinh, tương khắc', chuyenMuc: 'phong-thuy', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 5,
      moTa: 'Kim, Mộc, Thủy, Hỏa, Thổ sinh và khắc nhau theo vòng nào, phản sinh và phản khắc là gì, và cách đọc "mệnh hợp, mệnh khắc" cho đúng.',
      the: ['ngũ hành', 'tương sinh', 'tương khắc', 'kim', 'mộc', 'thủy', 'hỏa', 'thổ', 'mệnh', 'nạp âm'],
      noiDung: `Ngũ hành là năm trạng thái vận động mà người xưa dùng để xếp loại mọi thứ: Kim, Mộc, Thủy, Hỏa, Thổ. Chữ "hành" nghĩa là đi, là vận hành, nên ngũ hành không phải năm loại vật chất mà là năm kiểu biến đổi nối tiếp nhau. Tử vi, chọn ngày, bát tự và phong thủy đều dựa trên hai quan hệ cơ bản: tương sinh và tương khắc.

## Vòng tương sinh

Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc. Cách nhớ dân gian:

- Gỗ cháy thành lửa (Mộc sinh Hỏa).
- Lửa đốt mọi thứ thành tro đất (Hỏa sinh Thổ).
- Kim loại nằm trong lòng đất (Thổ sinh Kim).
- Kim loại lạnh làm hơi nước đọng lại (Kim sinh Thủy).
- Nước nuôi cây (Thủy sinh Mộc).

Hành sinh ra gọi là "mẹ", hành được sinh gọi là "con". Mẹ cho đi nên hao bớt, con được nhận nên mạnh thêm.

## Vòng tương khắc

Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc. Rễ cây xuyên đất, đất ngăn nước, nước dập lửa, lửa nung chảy kim loại, dao rìu chặt cây.

Khắc không có nghĩa là xấu tuyệt đối. Khắc vừa phải giữ cho hệ thống cân bằng: không có Kim khắc thì Mộc mọc tràn lan, không có Thủy khắc thì Hỏa cháy quá mức.

## Phản sinh và phản khắc

Khi một hành quá mạnh hoặc quá yếu, quan hệ có thể đảo chiều:

- **Phản sinh**: sinh quá mức thành hại. Nhiều nước quá thì cây úng (Thủy nhiều, Mộc trôi); lửa quá to thì đất khô cằn.
- **Phản khắc** (còn gọi là phản vũ): hành bị khắc quá mạnh quay lại làm hại hành khắc mình. Lửa lớn làm nước sôi cạn; cây cứng làm mẻ lưỡi rìu.

Vì vậy không thể chỉ nhìn "sinh" là tốt, "khắc" là xấu; cần biết hành nào đang mạnh, hành nào đang yếu.

## Bảng tra nhanh

| Hành | Sinh cho | Được sinh bởi | Khắc | Bị khắc bởi |
|---|---|---|---|---|
| Mộc | Hỏa | Thủy | Thổ | Kim |
| Hỏa | Thổ | Mộc | Kim | Thủy |
| Thổ | Kim | Hỏa | Thủy | Mộc |
| Kim | Thủy | Thổ | Mộc | Hỏa |
| Thủy | Mộc | Kim | Hỏa | Thổ |

## "Mệnh" theo năm sinh là hành nào

Khi nói một người "mệnh Kim" hay "mệnh Thổ" theo năm sinh, người ta thường dùng hành **nạp âm** của can chi năm sinh, không phải hành của con giáp. Ví dụ người sinh năm Canh Ngọ: chi Ngọ thuộc Hỏa, nhưng nạp âm Canh Ngọ là Lộ Bàng Thổ, nên người đó "mệnh Thổ". Phong thủy nhà ở theo Bát trạch lại dùng một hệ khác là cung phi (quái số), tính từ năm sinh và giới tính. Ba cách này trả lời ba câu hỏi khác nhau, đừng trộn lẫn.`,
      viDu: { tieuDe: 'Hai người sinh năm 1990 và 1984', noiDung: `Người A sinh năm 1990 (Canh Ngọ), nạp âm Lộ Bàng Thổ. Người B sinh năm 1984 (Giáp Tý), nạp âm Hải Trung Kim.

Thổ sinh Kim: A "sinh" cho B. Theo cách xem tuổi dân gian, đây là quan hệ tương sinh, thường được coi là hợp. A ở vai người cho, nên được khuyên chú ý đừng để mình kiệt sức vì chăm lo cho người kia.

Nếu xét theo con giáp thì Ngọ và Tý là cặp lục xung. Hai cách xem cho hai kết luận khác nhau; đó là lý do không nên dựa vào một tiêu chí duy nhất.` },
      hoiDap: [
        ['Mệnh khắc nhau thì có nên lấy nhau không?', 'Xem tuổi chỉ là một tham khảo dân gian. Khắc trong ngũ hành không phải lời tiên tri về hôn nhân; tính cách, giá trị sống và cách hai người cư xử với nhau quan trọng hơn nhiều.'],
        ['Vì sao Thổ lại ở giữa?', 'Trong cách xếp theo phương vị, Thổ đứng ở trung tâm và gắn với mười tám ngày cuối mỗi mùa, làm cầu nối giữa các hành. Trong vòng tương sinh, Thổ đứng sau Hỏa và trước Kim.'],
        ['Ngũ hành có liên quan đến năm nguyên tố của chiêm tinh phương Tây không?', 'Không. Chiêm tinh phương Tây dùng bốn nguyên tố Lửa, Đất, Khí, Nước, có gốc từ triết học Hy Lạp. Hai hệ hình thành độc lập.'],
      ],
      nguon: [['Wuxing, Chinese philosophy (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Wuxing_(Chinese_philosophy)'], ['Hoàng Đế Nội Kinh, phần Tố Vấn (thiên Âm dương ứng tượng đại luận)']],
      congCu: ['Xem mệnh và tuổi hợp theo năm sinh', 'con-giap.html'],
    },
    {
      slug: 'mau-sac-phuong-huong-ngu-hanh', tieuDe: 'Màu sắc và phương hướng theo ngũ hành', chuyenMuc: 'phong-thuy', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 9,
      moTa: 'Mỗi hành ứng với màu, hướng, mùa và con số nào; cách chọn màu bản mệnh, màu tương sinh và những điều nên dùng ở mức vừa phải.',
      the: ['phong thủy', 'màu sắc', 'phương hướng', 'màu hợp mệnh', 'bát quái', 'ngũ hành', 'hướng nhà'],
      noiDung: `Phong thủy dùng ngũ hành để gắn các thứ quanh ta với nhau: màu, hướng, mùa, hình dáng, con số. Khi biết một hành ứng với những gì, bạn có thể chọn màu hay bố trí không gian theo nguyên tắc tương sinh.

## Bảng tương ứng

| Hành | Màu | Hướng | Mùa | Hình dáng | Số (Hà Đồ) |
|---|---|---|---|---|---|
| Mộc | Xanh lá, xanh rêu | Đông, Đông Nam | Xuân | Dài, đứng thẳng | 3, 8 |
| Hỏa | Đỏ, cam, hồng, tím | Nam | Hạ | Nhọn, tam giác | 2, 7 |
| Thổ | Vàng đất, nâu, be | Trung tâm, Đông Bắc, Tây Nam | Cuối mỗi mùa | Vuông, phẳng | 5, 10 |
| Kim | Trắng, xám, ánh kim | Tây, Tây Bắc | Thu | Tròn | 4, 9 |
| Thủy | Đen, xanh dương đậm | Bắc | Đông | Uốn lượn | 1, 6 |

Hướng ở đây theo Hậu thiên bát quái: Chấn (Đông) và Tốn (Đông Nam) thuộc Mộc, Ly (Nam) thuộc Hỏa, Khôn (Tây Nam) và Cấn (Đông Bắc) thuộc Thổ, Đoài (Tây) và Càn (Tây Bắc) thuộc Kim, Khảm (Bắc) thuộc Thủy.

## Chọn màu theo mệnh

Cách phổ biến chia màu thành bốn nhóm so với hành của bạn:

1. **Màu tương sinh** (màu của hành sinh ra mình): được coi là tốt nhất, như được nâng đỡ.
2. **Màu bản mệnh** (cùng hành): tốt, giúp ổn định.
3. **Màu mình khắc**: dùng được, nhưng mình phải "bỏ sức" để chế ngự.
4. **Màu khắc mình**: nên hạn chế ở những món dùng hằng ngày.

Ví dụ mệnh Mộc: màu tương sinh là đen, xanh dương (Thủy sinh Mộc); màu bản mệnh là xanh lá; nên hạn chế trắng, xám (Kim khắc Mộc).

## Hướng: đừng nhầm với hướng nhà Bát trạch

Bảng trên cho biết mỗi hướng mang hành gì, dùng để bài trí: đặt cây xanh (Mộc) ở phía Đông, đồ gốm, đá (Thổ) ở Đông Bắc hoặc Tây Nam. Còn câu hỏi "tôi hợp nhà hướng nào" trong phong thủy Bát trạch dùng cung phi tính theo năm sinh và giới tính, chia người thành Đông tứ mệnh và Tây tứ mệnh. Đó là một phép tính khác, không suy ra từ màu bản mệnh.

## Dùng ở mức vừa phải

Phong thủy là tri thức kinh nghiệm về cách bố trí nơi ở, không phải khoa học thực nghiệm. Một chiếc ví hay ốp điện thoại đúng màu không thay đổi được công việc hay sức khỏe. Phần có giá trị thực tế của phong thủy thường là những điều trùng với lẽ thường: nhà thoáng, đủ ánh sáng, lối đi gọn, không đặt giường dưới xà ngang nặng nề.`,
      viDu: { tieuDe: 'Chọn màu cho người mệnh Kim', noiDung: `Người sinh năm 1984 (Giáp Tý) có nạp âm Hải Trung Kim, tức mệnh Kim.

- Màu tương sinh: vàng, nâu, be (Thổ sinh Kim).
- Màu bản mệnh: trắng, xám, bạc.
- Màu mình khắc: xanh lá (Kim khắc Mộc), dùng được.
- Màu nên hạn chế: đỏ, cam, hồng (Hỏa khắc Kim).

Nếu người này rất thích màu đỏ, cách dung hòa phổ biến là dùng đỏ ở điểm nhấn nhỏ và đặt cạnh màu vàng đất, vì Hỏa sinh Thổ rồi Thổ sinh Kim, biến quan hệ khắc thành một chuỗi sinh.` },
      hoiDap: [
        ['Màu xanh dương thuộc Thủy hay Mộc?', 'Xanh dương đậm, xanh nước biển thường xếp vào Thủy. Xanh lá cây xếp vào Mộc. Với các sắc xanh lơ, xanh ngọc, các sách xếp không thống nhất.'],
        ['Mệnh tính theo năm âm hay năm dương?', 'Theo năm âm lịch. Người sinh trước Tết thuộc năm âm lịch trước, nên có thể khác mệnh với những người sinh cùng năm dương lịch.'],
        ['Có cần đổi màu xe, màu nhà theo mệnh không?', 'Không bắt buộc. Nếu thích thì chọn màu hợp mệnh như một sở thích; không có bằng chứng cho thấy màu sắc theo mệnh ảnh hưởng đến an toàn hay may mắn.'],
      ],
      nguon: [['Feng shui (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Feng_shui'], ['Wuxing, Chinese philosophy (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Wuxing_(Chinese_philosophy)']],
      congCu: ['Tra mệnh, màu và hướng theo năm sinh', 'con-giap.html'],
    },
    {
      slug: 'ban-do-sao-ca-nhan', tieuDe: 'Bản đồ sao cá nhân là gì?', chuyenMuc: 'chiem-tinh', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 6,
      moTa: 'Bản đồ sao ghi vị trí Mặt Trời, Mặt Trăng và các hành tinh lúc bạn sinh ra. Cách đọc hành tinh, cung, nhà, góc chiếu và bộ ba Mặt Trời, Mặt Trăng, cung Mọc.',
      the: ['bản đồ sao', 'birth chart', 'cung Mọc', 'ascendant', 'nhà', 'góc chiếu', 'hành tinh', 'big three', 'giờ sinh'],
      noiDung: `Bản đồ sao (birth chart, natal chart) là hình vẽ bầu trời nhìn từ nơi bạn sinh, đúng vào thời điểm bạn sinh ra. Nó ghi lại mỗi hành tinh đang nằm ở cung hoàng đạo nào và ở vị trí nào so với đường chân trời. "Cung hoàng đạo" mà mọi người hay nói chỉ là một chi tiết trong đó: vị trí của Mặt Trời.

## Bốn lớp thông tin

1. **Hành tinh**: mỗi hành tinh tượng trưng cho một phần của con người. Mặt Trời là bản ngã, Mặt Trăng là cảm xúc, Sao Thủy là cách nghĩ và nói, Sao Kim là cách yêu và thưởng thức, Sao Hỏa là hành động, Sao Mộc là sự mở rộng, Sao Thổ là kỷ luật và giới hạn. Ba hành tinh xa Thiên Vương, Hải Vương, Diêm Vương đi chậm, mang dấu ấn của cả một thế hệ.
2. **Cung**: hành tinh đó thể hiện "theo kiểu nào". Sao Kim ở Bạch Dương yêu nhanh và thẳng; Sao Kim ở Ma Kết yêu chậm và chắc.
3. **Nhà**: bầu trời được chia làm 12 nhà tính từ cung Mọc, mỗi nhà là một lĩnh vực đời sống: nhà 1 bản thân, nhà 2 tiền bạc, nhà 7 quan hệ đôi lứa, nhà 10 sự nghiệp... Hành tinh nằm ở nhà nào thì năng lượng của nó dồn vào lĩnh vực đó.
4. **Góc chiếu**: khoảng cách góc giữa hai hành tinh. Trùng tụ 0°, lục hợp 60°, vuông 90°, tam hợp 120°, đối đỉnh 180°. Lục hợp, tam hợp thường hài hòa; vuông và đối đỉnh tạo căng thẳng, cũng là động lực.

## Bộ ba quan trọng nhất

- **Mặt Trời**: bạn muốn trở thành ai.
- **Mặt Trăng**: bạn cần gì để thấy an toàn.
- **Cung Mọc** (Ascendant): cung đang mọc ở chân trời phía đông lúc bạn sinh, là ấn tượng đầu tiên bạn tạo ra và cách bạn bước vào mọi việc.

Cung Mọc đổi khoảng hai giờ một lần, nên muốn biết nó phải có **giờ sinh và nơi sinh**. Mặt Trăng đi hết một cung trong khoảng hai ngày rưỡi, nên người sinh vào ngày Mặt Trăng đổi cung cũng cần giờ sinh.

## Vì sao cần tính thật, không tra bảng

Ngày Mặt Trời đổi cung xê dịch một ngày tùy năm, các hành tinh có lúc nghịch hành, và cung Mọc phụ thuộc vĩ độ nơi sinh. Trang Bản đồ sao của Lá Số Tử Vi tính vị trí các thiên thể bằng thư viện thiên văn Astronomy Engine, dùng hoàng đạo nhiệt đới (Bạch Dương bắt đầu từ điểm xuân phân) và chia nhà theo kiểu nguyên cung (Whole Sign): cung chứa cung Mọc là nhà 1, cung kế tiếp là nhà 2.`,
      viDu: { tieuDe: 'Sinh lúc mặt trời mọc ngày 15/8', noiDung: `Ngày 15/8, Mặt Trời ở cung Sư Tử (khoảng 23/7 đến 22/8). Người sinh đúng lúc mặt trời mọc có Mặt Trời nằm ngay trên đường chân trời phía đông, nên cung Mọc cũng là Sư Tử và Mặt Trời ở nhà 1. Chiêm tinh mô tả người này là "Sư Tử kép": tính cách Sư Tử lộ rõ ngay từ ấn tượng đầu tiên.

Một người khác sinh cùng ngày nhưng lúc giữa trưa có Mặt Trời ở gần thiên đỉnh, tức vùng nhà 9, nhà 10, nên Sư Tử thể hiện mạnh qua công việc và vị trí xã hội, còn cung Mọc đã sang Thiên Bình hoặc Bọ Cạp tùy vĩ độ.` },
      hoiDap: [
        ['Không biết giờ sinh thì bản đồ sao còn dùng được không?', 'Vẫn biết được cung của Mặt Trời và các hành tinh, cùng phần lớn góc chiếu. Nhưng không có cung Mọc và các nhà, và Mặt Trăng có thể chưa chắc chắn.'],
        ['Hoàng đạo nhiệt đới và hoàng đạo thiên văn khác gì nhau?', 'Hoàng đạo nhiệt đới gắn với các mùa (Bạch Dương bắt đầu ở xuân phân), được chiêm tinh phương Tây dùng. Hoàng đạo thiên văn (sidereal) gắn với chòm sao thật, hiện lệch khoảng 24 độ do tuế sai, được chiêm tinh Ấn Độ dùng.'],
        ['Sao Thủy nghịch hành có thật không?', 'Đó là hiện tượng biểu kiến có thật: nhìn từ Trái Đất, Sao Thủy có lúc trông như đi lùi trên bầu trời. Còn ý nghĩa "dễ trục trặc giao tiếp" là cách diễn giải của chiêm tinh.'],
      ],
      nguon: [['Horoscope (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Horoscope'], ['Don Cross, Astronomy Engine', 'https://github.com/cosinekitty/astronomy']],
      congCu: ['Vẽ bản đồ sao của bạn', '../../zodiac/frontend/ban-do-sao.html'],
    },
    {
      slug: '12-cung-hoang-dao', tieuDe: '12 cung hoàng đạo: nguyên tố, tính chất và hành tinh chủ quản', chuyenMuc: 'chiem-tinh', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 10,
      moTa: 'Ngày của 12 cung, bốn nguyên tố Lửa, Đất, Khí, Nước, ba tính chất Tiên phong, Kiên định, Linh hoạt và hành tinh cai quản mỗi cung.',
      the: ['cung hoàng đạo', '12 cung', 'nguyên tố', 'tính chất', 'hành tinh chủ quản', 'bạch dương', 'bọ cạp', 'song ngư'],
      noiDung: `Vòng hoàng đạo là đường Mặt Trời đi qua trên bầu trời trong một năm, chia đều thành 12 cung, mỗi cung 30 độ. Mỗi cung được mô tả bằng ba thông tin: nguyên tố, tính chất và hành tinh chủ quản. Ghép ba thông tin này lại, bạn hiểu được vì sao mỗi cung có tính cách như người ta vẫn nói.

## Ngày của 12 cung

| Cung | Ngày (gần đúng) | Nguyên tố | Tính chất | Hành tinh chủ quản |
|---|---|---|---|---|
| Bạch Dương | 21/3 – 19/4 | Lửa | Tiên phong | Sao Hỏa |
| Kim Ngưu | 20/4 – 20/5 | Đất | Kiên định | Sao Kim |
| Song Tử | 21/5 – 20/6 | Khí | Linh hoạt | Sao Thủy |
| Cự Giải | 21/6 – 22/7 | Nước | Tiên phong | Mặt Trăng |
| Sư Tử | 23/7 – 22/8 | Lửa | Kiên định | Mặt Trời |
| Xử Nữ | 23/8 – 22/9 | Đất | Linh hoạt | Sao Thủy |
| Thiên Bình | 23/9 – 22/10 | Khí | Tiên phong | Sao Kim |
| Bọ Cạp | 23/10 – 21/11 | Nước | Kiên định | Sao Hỏa, Diêm Vương |
| Nhân Mã | 22/11 – 21/12 | Lửa | Linh hoạt | Sao Mộc |
| Ma Kết | 22/12 – 19/1 | Đất | Tiên phong | Sao Thổ |
| Bảo Bình | 20/1 – 18/2 | Khí | Kiên định | Sao Thổ, Thiên Vương |
| Song Ngư | 19/2 – 20/3 | Nước | Linh hoạt | Sao Mộc, Hải Vương |

Ngày đổi cung xê dịch một ngày tùy năm và tùy múi giờ. Người sinh sát ngày giao cung nên tính chính xác theo giờ sinh.

## Bốn nguyên tố

- **Lửa** (Bạch Dương, Sư Tử, Nhân Mã): nhiệt huyết, hành động, cần cảm hứng.
- **Đất** (Kim Ngưu, Xử Nữ, Ma Kết): thực tế, bền bỉ, cần kết quả cụ thể.
- **Khí** (Song Tử, Thiên Bình, Bảo Bình): ý tưởng, giao tiếp, cần trao đổi.
- **Nước** (Cự Giải, Bọ Cạp, Song Ngư): cảm xúc, trực giác, cần sự gắn bó.

Lửa và Khí thường hợp nhau (khí giúp lửa cháy), Đất và Nước thường hợp nhau (nước làm đất màu mỡ).

## Ba tính chất

- **Tiên phong** (cardinal): bắt đầu mỗi mùa, giỏi khởi xướng.
- **Kiên định** (fixed): giữa mùa, giỏi duy trì, khó thay đổi.
- **Linh hoạt** (mutable): cuối mùa, giỏi thích nghi, chuyển tiếp.

## Hành tinh chủ quản

Mỗi cung có một hành tinh "cai quản" theo truyền thống. Sau khi phát hiện Thiên Vương, Hải Vương và Diêm Vương, chiêm tinh hiện đại gán thêm ba hành tinh này cho Bảo Bình, Song Ngư và Bọ Cạp, còn chiêm tinh truyền thống vẫn giữ Sao Thổ, Sao Mộc và Sao Hỏa.`,
      viDu: { tieuDe: 'Vì sao Bạch Dương và Bọ Cạp đều "nóng" theo hai kiểu khác nhau', noiDung: `Cả hai cung cùng được Sao Hỏa cai quản theo truyền thống, nên đều mạnh mẽ và có tính chiến đấu. Nhưng Bạch Dương là Lửa, Tiên phong: lao vào ngay, nóng nhanh nguội nhanh. Bọ Cạp là Nước, Kiên định: cảm xúc âm ỉ ở bên trong, giữ lâu, khó buông. Cùng một hành tinh, khác nguyên tố và tính chất, cho ra hai kiểu tính cách khác hẳn.` },
      hoiDap: [
        ['Có cung thứ 13 là Xà Phu không?', 'Chòm sao Xà Phu có nằm trên đường Mặt Trời đi qua, nhưng chiêm tinh phương Tây chia vòng hoàng đạo thành 12 phần bằng nhau gắn với các mùa, không theo ranh giới chòm sao. Vì vậy không có cung thứ 13.'],
        ['Sinh ngày giao cung thì thuộc cung nào?', 'Cần biết giờ sinh và múi giờ để xem Mặt Trời đã sang cung mới chưa. Trang Cung hoàng đạo sẽ báo đúng giờ Mặt Trời đổi cung trong năm bạn sinh.'],
        ['Cung Mặt Trời có nói hết về một người không?', 'Không. Đó chỉ là một trong mười thiên thể trên bản đồ sao. Mặt Trăng và cung Mọc thường giải thích được những điểm "không giống cung của mình".'],
      ],
      nguon: [['Astrological sign (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Astrological_sign'], ['Horoscope (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Horoscope']],
      congCu: ['Xem cung hoàng đạo của bạn', '../../zodiac/frontend/index.html'],
    },
    {
      slug: 'cach-tinh-so-chu-dao', tieuDe: 'Cách tính số chủ đạo', chuyenMuc: 'than-so-hoc', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 7,
      moTa: 'Cộng các chữ số của ngày sinh rồi rút gọn. Khi nào giữ 11, 22, 33; vì sao cách phổ biến ở Việt Nam giữ cả số 10; và các chỉ số tính từ họ tên.',
      the: ['thần số học', 'số chủ đạo', 'đường đời', 'pythagoras', 'số bậc thầy', '11', '22', '33', 'họ tên'],
      noiDung: `Số chủ đạo (life path number, còn gọi là số đường đời) là con số quan trọng nhất trong thần số học Pythagoras. Nó được tính hoàn toàn từ ngày sinh dương lịch, nên ai cũng tự tính được trong một phút.

## Cách tính

1. Viết ngày sinh dương lịch đầy đủ dạng ngày, tháng, năm.
2. Cộng tất cả các chữ số lại.
3. Nếu tổng có hai chữ số trở lên, cộng các chữ số của tổng, lặp lại đến khi đạt kết quả theo quy tắc của trường phái bạn chọn.

## Hai quy tắc rút gọn

| | Cách phổ biến ở Việt Nam | Cách quốc tế |
|---|---|---|
| Kết quả | 2 đến 11 và 22/4 | 1 đến 9, 11, 22/4, 33/6 |
| Giữ nguyên | 10, 11, 22 | 11, 22, 33 (số bậc thầy) |
| Tổng là 10 | Số 10 | Rút về 1 |
| Tổng là 33 | Rút về 6 | Số 33/6 |

Cách viết 22/4, 33/6 nhắc rằng số bậc thầy vẫn mang nền của số rút gọn (2 + 2 = 4, 3 + 3 = 6). Cách phổ biến ở Việt Nam bắt nguồn từ các sách thần số học dịch và phổ biến những năm gần đây; cách quốc tế gần với sách tiếng Anh. Không cách nào "đúng" hơn, quan trọng là dùng nhất quán.

## Ngoài số chủ đạo

- **Chỉ số ngày sinh**: chỉ lấy ngày sinh rút gọn. Sinh ngày 14 thì là 5.
- **Chỉ số thái độ**: ngày cộng tháng sinh, rút gọn.
- **Chỉ số sứ mệnh, linh hồn, nhân cách**: tính từ họ tên khai sinh. Mỗi chữ cái đổi thành số theo bảng Pythagoras: A, J, S là 1; B, K, T là 2; C, L, U là 3; D, M, V là 4; E, N, W là 5; F, O, X là 6; G, P, Y là 7; H, Q, Z là 8; I, R là 9. Sứ mệnh dùng mọi chữ cái, linh hồn dùng nguyên âm, nhân cách dùng phụ âm.
- **Số trưởng thành**: số đường đời cộng số sứ mệnh.

## Họ tên tiếng Việt quy đổi thế nào

Bảng Pythagoras được làm cho bảng chữ cái Latinh không dấu, nên tên tiếng Việt cần thống nhất vài quy tắc:

- Dùng họ tên đầy đủ trên giấy khai sinh, không dùng tên gọi ở nhà hay tên đã đổi.
- Bỏ mọi dấu thanh và dấu chữ: "Nguyễn" thành NGUYEN, "Ơ", "Ư" thành O, U.
- Chữ Đ đổi thành D.
- Chữ Y được tính là nguyên âm trong tên tiếng Việt.`,
      viDu: { tieuDe: 'Ba ngày sinh, hai trường phái', noiDung: `**14/07/1995**: 1 + 4 + 0 + 7 + 1 + 9 + 9 + 5 = 36, rồi 3 + 6 = 9. Cả hai cách đều ra **9**, con số của lòng nhân ái và tinh thần phụng sự.

**01/01/2006**: 0 + 1 + 0 + 1 + 2 + 0 + 0 + 6 = 10. Cách Việt Nam giữ **10**; cách quốc tế rút về **1**.

**19/08/1950**: 1 + 9 + 0 + 8 + 1 + 9 + 5 + 0 = 33. Cách quốc tế giữ số bậc thầy **33/6**; cách Việt Nam rút về **6**.

Họ tên "Lê Thị Thu": bỏ dấu thành LE THI THU. L 3, E 5, T 2, H 8, I 9, T 2, H 8, U 3. Tổng 40, rút gọn 4: chỉ số sứ mệnh là 4.` },
      hoiDap: [
        ['Có cách tính rút gọn ngày, tháng, năm riêng rồi mới cộng không?', 'Có. Một số sách rút gọn từng phần trước rồi cộng lại. Thường cho cùng kết quả với cách cộng hết các chữ số, nhưng có thể khác ở các số bậc thầy. Lá Số Tử Vi dùng cách cộng tất cả chữ số và ghi rõ từng bước.'],
        ['Dùng ngày sinh âm lịch được không?', 'Không. Thần số học Pythagoras được xây dựng trên lịch dương (lịch Gregory). Dùng ngày âm sẽ cho kết quả không có ý nghĩa trong hệ này.'],
        ['Đổi tên thì số chủ đạo có đổi không?', 'Không, số chủ đạo chỉ tính từ ngày sinh. Đổi tên chỉ làm đổi các chỉ số tính từ họ tên.'],
      ],
      nguon: [['Numerology (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Numerology'], ['Phần Phương pháp tính trên trang Số chủ đạo của Lá Số Tử Vi', '../../numerology/frontend/index.html']],
      congCu: ['Tính số chủ đạo của bạn', '../../numerology/frontend/index.html'],
    },
    {
      slug: 'nam-ca-nhan', tieuDe: 'Năm cá nhân, tháng cá nhân và chu kỳ 9 năm', chuyenMuc: 'than-so-hoc', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 11,
      moTa: 'Năm cá nhân cho biết bạn đang ở đâu trong chu kỳ 9 năm. Cách tính năm, tháng, ngày cá nhân và chủ đề của từng năm từ 1 đến 9.',
      the: ['năm cá nhân', 'tháng cá nhân', 'ngày cá nhân', 'chu kỳ 9 năm', 'thần số học', 'dự báo năm'],
      noiDung: `Nếu số chủ đạo mô tả con đường cả đời, thì năm cá nhân mô tả "mùa" bạn đang đi qua. Thần số học chia đời người thành các chu kỳ 9 năm lặp lại: năm 1 gieo hạt, năm 9 thu hoạch và dọn dẹp để bắt đầu vòng mới.

## Cách tính

- **Năm cá nhân** = ngày sinh + tháng sinh + năm đang xét, cộng các chữ số rồi rút gọn về 1 đến 9.
- **Tháng cá nhân** = năm cá nhân + số của tháng dương lịch, rút gọn về 1 đến 9.
- **Ngày cá nhân** = tháng cá nhân + ngày dương lịch, rút gọn về 1 đến 9.

Có hai quan niệm về thời điểm đổi năm: đổi vào ngày 1 tháng 1 (phổ biến nhất), hoặc đổi vào ngày sinh nhật. Trang Số chủ đạo cho phép chọn một trong hai.

## Chủ đề từng năm

| Năm | Chủ đề | Gợi ý |
|---|---|---|
| 1 | Khởi đầu | Bắt đầu việc mới, tự quyết, gieo hạt |
| 2 | Hợp tác | Kiên nhẫn, lắng nghe, xây quan hệ |
| 3 | Sáng tạo | Thể hiện bản thân, giao lưu, học kỹ năng |
| 4 | Xây nền | Làm việc chăm chỉ, kỷ luật, sắp xếp tài chính |
| 5 | Thay đổi | Di chuyển, thử điều mới, linh hoạt |
| 6 | Yêu thương | Gia đình, trách nhiệm, chăm sóc |
| 7 | Chiêm nghiệm | Học sâu, nghỉ ngơi, nhìn vào bên trong |
| 8 | Thành tựu | Tiền bạc, công việc, gặt kết quả |
| 9 | Hoàn tất | Kết thúc, buông bỏ, dọn đường cho vòng mới |

## Dùng năm cá nhân thế nào cho hữu ích

Năm cá nhân không báo trước việc gì sẽ xảy ra. Nó giống một gợi ý về nhịp: năm 4 hợp để củng cố hơn là liều lĩnh, năm 7 hợp để học và nghỉ hơn là bung ra. Bạn có thể dùng nó như câu hỏi đầu năm: "Năm nay mình muốn xây nền gì?", rồi chia năm thành ba giai đoạn để xem lại tiến độ.`,
      viDu: { tieuDe: 'Người sinh 14/7, năm 2026', noiDung: `Năm cá nhân 2026: 1 + 4 + 0 + 7 + 2 + 0 + 2 + 6 = 22, rút gọn 2 + 2 = **4**, năm Xây nền.

Tháng 11/2026: 4 + 11 = 15, rút gọn 1 + 5 = **6**, tháng Yêu thương, hợp cho chuyện gia đình.

Năm 2027 sẽ là năm **5**, năm Thay đổi. Vì vậy năm 2026 là lúc chuẩn bị nền móng (tài chính, sức khỏe, kỹ năng) để năm sau có điều kiện thử điều mới.` },
      hoiDap: [
        ['Năm cá nhân có giữ số 11, 22 không?', 'Phần lớn cách tính rút năm cá nhân về 1 đến 9. Một số người đọc thêm "năm 11" hay "năm 22" như sắc thái đặc biệt của năm 2 và năm 4.'],
        ['Năm 9 có phải năm xấu không?', 'Không. Năm 9 là năm khép lại, hợp để hoàn tất việc dang dở và buông những gì không còn phù hợp. Nhiều người thấy năm 9 nặng nề vì phải kết thúc, nhưng đó là chuẩn bị cho năm 1.'],
        ['Hai người cùng ngày tháng sinh có cùng năm cá nhân không?', 'Có. Năm cá nhân chỉ phụ thuộc ngày, tháng sinh và năm đang xét, không phụ thuộc năm sinh.'],
      ],
      nguon: [['Numerology (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Numerology']],
      congCu: ['Xem năm cá nhân và 12 tháng của bạn', '../../numerology/frontend/index.html'],
    },
    {
      slug: '12-con-giap-tuoi-hop', tieuDe: '12 con giáp: tính cách, tuổi hợp và ngũ hành', chuyenMuc: 'con-giap', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 8,
      moTa: 'Mười hai con giáp theo cách gọi Việt Nam, nét tính cách dân gian của từng tuổi, các nhóm tam hợp, lục hợp, tứ hành xung và ngũ hành của năm sinh.',
      the: ['12 con giáp', 'tuổi hợp', 'tam hợp', 'lục hợp', 'tứ hành xung', 'lục xung', 'mèo', 'ngũ hành', 'tính cách'],
      noiDung: `Mười hai con giáp là cách gắn mỗi địa chi với một con vật để dễ nhớ. Người Việt dùng con giáp để gọi tuổi, xem tuổi hợp khi làm ăn, cưới hỏi, và đọc những nét tính cách dân gian.

## Mười hai con giáp

| Chi | Con giáp | Âm dương | Hành của chi | Nét tính cách dân gian |
|---|---|---|---|---|
| Tý | Chuột | Dương | Thủy | Lanh lợi, tháo vát, biết tích lũy |
| Sửu | Trâu | Âm | Thổ | Cần cù, kiên nhẫn, đáng tin |
| Dần | Hổ | Dương | Mộc | Can đảm, thích dẫn đầu |
| Mão | Mèo | Âm | Mộc | Tinh tế, khéo léo, chuộng hòa khí |
| Thìn | Rồng | Dương | Thổ | Tự tin, nhiều hoài bão |
| Tỵ | Rắn | Âm | Hỏa | Sâu sắc, kín đáo, nhạy bén |
| Ngọ | Ngựa | Dương | Hỏa | Nhiệt tình, ưa tự do |
| Mùi | Dê | Âm | Thổ | Hiền hòa, giàu cảm xúc, có khiếu thẩm mỹ |
| Thân | Khỉ | Dương | Kim | Thông minh, linh hoạt, hài hước |
| Dậu | Gà | Âm | Kim | Chỉn chu, thẳng thắn, đúng giờ |
| Tuất | Chó | Dương | Thổ | Trung thành, chính trực |
| Hợi | Lợn | Âm | Thủy | Rộng lượng, chân thành, biết hưởng thụ |

Việt Nam dùng con Mèo cho chi Mão, trong khi Trung Quốc, Hàn Quốc, Nhật Bản dùng con Thỏ. Một số nơi gọi Mùi là Dê, nơi khác gọi là Cừu.

## Các nhóm tuổi hợp

- **Tam hợp** (ba tuổi cách nhau bốn năm, cùng hướng về một hành): Thân, Tý, Thìn (Thủy); Dần, Ngọ, Tuất (Hỏa); Tỵ, Dậu, Sửu (Kim); Hợi, Mão, Mùi (Mộc).
- **Lục hợp** (sáu cặp): Tý và Sửu, Dần và Hợi, Mão và Tuất, Thìn và Dậu, Tỵ và Thân, Ngọ và Mùi.

## Các nhóm tuổi xung

- **Lục xung** (hai tuổi đối diện nhau, cách sáu năm): Tý và Ngọ, Sửu và Mùi, Dần và Thân, Mão và Dậu, Thìn và Tuất, Tỵ và Hợi.
- **Tứ hành xung** gộp hai cặp lục xung thành nhóm bốn: Tý, Ngọ, Mão, Dậu; Dần, Thân, Tỵ, Hợi; Thìn, Tuất, Sửu, Mùi.

Ngoài ra còn tương hình, tương hại, tương phá, ít được dùng hơn.

## Ngũ hành: của con giáp hay của năm sinh?

Mỗi con giáp có hành của chi (cột thứ tư trong bảng). Nhưng "mệnh" của một người theo năm sinh thường là hành nạp âm của cả cặp can chi. Ví dụ cùng tuổi Ngọ: Giáp Ngọ (1954, 2014) là Sa Trung Kim, Bính Ngọ (1966, 2026) là Thiên Hà Thủy, Mậu Ngọ (1978) là Thiên Thượng Hỏa, Canh Ngọ (1990) là Lộ Bàng Thổ, Nhâm Ngọ (2002) là Dương Liễu Mộc. Cùng con giáp nhưng năm hành khác nhau, nên đừng đoán mệnh chỉ từ con giáp.`,
      viDu: { tieuDe: 'Xem tuổi hợp cho người tuổi Thìn', noiDung: `Người tuổi Thìn:

- Tam hợp với **Thân** và **Tý**.
- Lục hợp với **Dậu**.
- Lục xung với **Tuất**, cùng nhóm tứ hành xung với Sửu, Mùi.

Nếu người này sinh năm 2000 (Canh Thìn, nạp âm Bạch Lạp Kim) và người kia sinh năm 2004 (Giáp Thân, nạp âm Tuyền Trung Thủy): Thìn và Thân tam hợp, Kim sinh Thủy, nên theo cách xem tuổi dân gian là một cặp hợp cả về chi lẫn mệnh.` },
      hoiDap: [
        ['Tuổi xung thì không làm ăn, kết hôn được à?', 'Xem tuổi là phong tục tham khảo. Nhiều cặp tuổi xung vẫn sống hòa hợp. Điều thực sự quyết định là cách hai người tôn trọng và hiểu nhau.'],
        ['Sinh tháng 1 dương lịch thì tính con giáp năm nào?', 'Tính theo năm âm lịch, tức đổi tuổi vào Tết Nguyên đán. Người sinh trước Tết thuộc con giáp của năm trước.'],
        ['Tính cách con giáp có cơ sở khoa học không?', 'Không có nghiên cứu nào cho thấy năm sinh quyết định tính cách. Những nét tính cách trong bảng là quan niệm dân gian, nên đọc như văn hóa và để tự soi lại mình.'],
      ],
      nguon: [['Chinese zodiac (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Chinese_zodiac'], ['Sexagenary cycle (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Sexagenary_cycle']],
      congCu: ['Xem hồ sơ con giáp và tuổi hợp', 'con-giap.html'],
    },
    {
      slug: 'tarot-78-la-va-cach-trai-bai', tieuDe: 'Tarot: 78 lá bài và cách trải bài', chuyenMuc: 'tarot', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 12,
      moTa: 'Bộ Tarot gồm 22 lá Ẩn Chính và 56 lá Ẩn Phụ chia bốn bộ. Ý nghĩa từng nhóm, lá xuôi và lá ngược, cách đặt câu hỏi và trải bài ba lá.',
      the: ['tarot', '78 lá', 'ẩn chính', 'ẩn phụ', 'major arcana', 'minor arcana', 'trải bài', 'lá ngược', 'rider waite'],
      noiDung: `Tarot là bộ bài 78 lá, xuất hiện ở Ý vào thế kỷ 15 như một trò chơi bài, rồi từ thế kỷ 18 được dùng để bói và chiêm nghiệm. Bộ phổ biến nhất hiện nay là Rider–Waite–Smith, do Arthur Edward Waite soạn và Pamela Colman Smith vẽ, xuất bản năm 1909. Trang Tarot của Lá Số Tử Vi dùng hệ ý nghĩa của bộ này.

## Cấu trúc bộ bài

### 22 lá Ẩn Chính (Major Arcana)

Đánh số từ 0 (The Fool, Kẻ Khờ) đến 21 (The World, Thế Giới). Các lá này nói về những bài học lớn, những bước ngoặt. Đọc nối nhau, chúng kể hành trình của Kẻ Khờ đi qua các giai đoạn trưởng thành. Khi một trải bài có nhiều lá Ẩn Chính, người ta hiểu là chuyện đang hỏi có tầm quan trọng lớn.

### 56 lá Ẩn Phụ (Minor Arcana)

Chia bốn bộ, mỗi bộ 14 lá: Át đến 10 và bốn lá hoàng gia (Page, Knight, Queen, King).

| Bộ | Nguyên tố | Lĩnh vực |
|---|---|---|
| Gậy (Wands) | Lửa | Đam mê, hành động, dự định |
| Cốc (Cups) | Nước | Cảm xúc, tình yêu, các mối quan hệ |
| Kiếm (Swords) | Khí | Suy nghĩ, xung đột, quyết định |
| Tiền (Pentacles) | Đất | Tiền bạc, công việc, sức khỏe, vật chất |

Lá Ẩn Phụ nói về chuyện thường ngày. Số trên lá cũng có ý nghĩa: Át là khởi đầu, 5 là xáo trộn, 10 là kết thúc một chu kỳ.

## Lá xuôi và lá ngược

Lá rút ra đúng chiều gọi là xuôi; lộn đầu gọi là ngược. Lá ngược thường được đọc là năng lượng của lá bị chặn lại, đi chậm, hướng vào trong, hoặc thái quá. Không phải người đọc bài nào cũng dùng lá ngược.

## Đặt câu hỏi

Tarot hợp với câu hỏi mở về chính mình: "Mình nên chú ý điều gì trong công việc tháng này?" hơn là câu hỏi có hoặc không về người khác: "Anh ấy có quay lại không?". Câu hỏi càng cụ thể, bài đọc càng dễ áp dụng.

## Trải bài ba lá

Đây là kiểu trải đơn giản và linh hoạt nhất:

1. Xáo bài trong lúc nghĩ về câu hỏi.
2. Rút ba lá, đặt từ trái sang phải.
3. Đọc mỗi lá theo vị trí của nó: **Quá khứ**, **Hiện tại**, **Tương lai** (nếu mọi việc tiếp diễn như hiện tại).

Các biến thể khác: Tình huống, Trở ngại, Lời khuyên; hoặc Bạn, Người ấy, Mối quan hệ cho câu hỏi tình cảm. Sau khi đọc từng lá, hãy đọc cả ba lá cùng nhau: chúng có cùng bộ không, có nhiều lá ngược không, câu chuyện chuyển từ đâu sang đâu.`,
      viDu: { tieuDe: 'Trải ba lá cho câu hỏi về công việc', noiDung: `Câu hỏi: "Mình nên chú ý điều gì khi chuyển việc?"

- **Quá khứ: 8 Kiếm** (xuôi). Cảm giác bị trói buộc, nghĩ rằng mình không có lựa chọn.
- **Hiện tại: Át Gậy** (xuôi). Một cảm hứng, một cơ hội mới vừa xuất hiện.
- **Tương lai: 4 Tiền** (ngược). Nếu cứ bám vào sự an toàn cũ, cơ hội có thể trôi qua; hoặc ngược lại, đừng tiêu xài quá tay khi bắt đầu việc mới.

Đọc chung: câu chuyện đi từ Khí (suy nghĩ tự trói buộc) sang Lửa (hành động) rồi Đất (vật chất). Lời nhắn là dám bước sang việc mới nhưng lên kế hoạch tài chính cẩn thận.` },
      hoiDap: [
        ['Có cần được tặng bộ bài thì mới dùng được không?', 'Đó là một quan niệm phổ biến nhưng không có quy định nào như vậy. Bạn có thể tự mua bộ bài mình thích.'],
        ['Tarot có đoán trước được tương lai không?', 'Tarot hữu ích nhất như một công cụ gợi suy nghĩ: các hình ảnh giúp bạn nhìn vấn đề từ góc khác. Không có bằng chứng nào cho thấy lá bài dự báo được sự kiện.'],
        ['Một ngày rút bài cho cùng câu hỏi nhiều lần có được không?', 'Rút lại liên tục để tìm câu trả lời mình muốn nghe thường làm bài đọc mất ý nghĩa. Hãy ghi lại lần rút đầu, suy ngẫm, và chỉ hỏi lại khi tình huống thay đổi.'],
      ],
      nguon: [['A. E. Waite, The Pictorial Key to the Tarot (1910), bản trên sacred-texts.com', 'https://sacred-texts.com/tarot/pkt/index.htm'], ['Rider–Waite Tarot (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot']],
      congCu: ['Trải bài Tarot', '../../Tarot/frontend/index.html'],
    },
    {
      slug: '24-tiet-khi', tieuDe: '24 tiết khí là gì và tính thế nào?', chuyenMuc: 'lich-van-nien', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 13,
      moTa: 'Tiết khí chia năm theo vị trí Mặt Trời, mỗi tiết 15 độ. Danh sách 24 tiết, ngày dương lịch gần đúng, và vai trò của trung khí trong việc xếp tháng nhuận.',
      the: ['tiết khí', 'lập xuân', 'xuân phân', 'hạ chí', 'đông chí', 'trung khí', 'tháng nhuận', 'âm lịch', 'kinh độ mặt trời'],
      noiDung: `Âm lịch Việt Nam thật ra là âm dương lịch: tháng theo Mặt Trăng, còn mùa theo Mặt Trời. Phần "dương" đó chính là 24 tiết khí. Vì tiết khí bám theo Mặt Trời, chúng rơi vào ngày dương lịch gần như cố định mỗi năm, nhưng xê dịch nhiều so với ngày âm.

## Cách chia

Mỗi năm Mặt Trời đi hết một vòng 360 độ trên hoàng đạo. Chia vòng này thành 24 phần, mỗi phần 15 độ, ta có 24 tiết khí. Mốc 0 độ là Xuân phân. Mỗi tiết dài khoảng 15 ngày; tiết mùa đông ngắn hơn một chút vì lúc đó Trái Đất ở gần Mặt Trời và chạy nhanh hơn.

## Danh sách 24 tiết

| Tiết | Kinh độ Mặt Trời | Ngày dương lịch (gần đúng) |
|---|---|---|
| Lập xuân | 315° | 4/2 |
| Vũ thủy | 330° | 19/2 |
| Kinh trập | 345° | 6/3 |
| Xuân phân | 0° | 21/3 |
| Thanh minh | 15° | 5/4 |
| Cốc vũ | 30° | 20/4 |
| Lập hạ | 45° | 6/5 |
| Tiểu mãn | 60° | 21/5 |
| Mang chủng | 75° | 6/6 |
| Hạ chí | 90° | 21/6 |
| Tiểu thử | 105° | 7/7 |
| Đại thử | 120° | 23/7 |
| Lập thu | 135° | 8/8 |
| Xử thử | 150° | 23/8 |
| Bạch lộ | 165° | 8/9 |
| Thu phân | 180° | 23/9 |
| Hàn lộ | 195° | 8/10 |
| Sương giáng | 210° | 23/10 |
| Lập đông | 225° | 7/11 |
| Tiểu tuyết | 240° | 22/11 |
| Đại tuyết | 255° | 7/12 |
| Đông chí | 270° | 22/12 |
| Tiểu hàn | 285° | 6/1 |
| Đại hàn | 300° | 20/1 |

Ngày cụ thể có thể lệch một ngày tùy năm và múi giờ.

## Tiết và trung khí

24 tiết xen kẽ hai loại. Các tiết ở vị trí lẻ (Lập xuân, Kinh trập, Thanh minh...) gọi là **tiết**, đánh dấu đầu tháng theo tiết khí: Lập xuân mở đầu tháng Dần, Kinh trập mở đầu tháng Mão. Các tiết ở vị trí chẵn (Vũ thủy, Xuân phân, Cốc vũ...) gọi là **trung khí**.

Trung khí quyết định tháng nhuận. Một năm âm lịch có 12 hoặc 13 tháng. Khi có 13 tháng, tháng đầu tiên không chứa trung khí nào sẽ là tháng nhuận. Tháng 11 âm lịch luôn chứa Đông chí. Đây là cách tính trong thuật toán của Hồ Ngọc Đức mà các trang của Lá Số Tử Vi dùng.

## Tiết khí dùng vào việc gì

- **Nông lịch**: tiết khí ra đời để canh thời vụ: Cốc vũ là mưa cho lúa, Mang chủng là lúc gieo hạt có râu.
- **Chọn ngày**: thập nhị trực tính theo tháng tiết khí, ví dụ trực Kiến rơi vào ngày cùng chi với tháng.
- **Bát tự**: năm và tháng trong bát tự đổi vào ngày giao tiết (năm mới bắt đầu từ Lập xuân, không phải Tết).`,
      viDu: { tieuDe: 'Lập xuân và Tết năm 2026', noiDung: `Năm 2026, Mặt Trời đạt kinh độ 315° vào ngày **4/2/2026**, tức tiết Lập xuân. Còn Tết Bính Ngọ rơi vào **17/2/2026**. Một em bé sinh ngày 10/2/2026:

- Theo âm lịch (dùng cho tử vi, tuổi con giáp), em vẫn thuộc năm **Ất Tỵ**, vì chưa qua Tết.
- Theo tiết khí (dùng cho bát tự), em đã thuộc năm **Bính Ngọ**, vì đã qua Lập xuân.

Năm 2025 có tháng 6 nhuận (từ 25/7 đến 22/8/2025) vì tháng đó không chứa trung khí nào.` },
      hoiDap: [
        ['Tiết Thanh minh có phải lúc nào cũng vào tháng 3 âm lịch?', 'Thường rơi vào tháng 2 hoặc tháng 3 âm lịch, vì tiết khí theo Mặt Trời còn tháng âm theo Mặt Trăng. Theo dương lịch thì Thanh minh luôn vào khoảng 4 hoặc 5 tháng 4.'],
        ['Vì sao Lập xuân ở Việt Nam không ấm?', 'Tiết khí được đặt theo khí hậu lưu vực sông Hoàng Hà ở Trung Quốc. Ở Việt Nam, đặc biệt miền Nam, tên gọi của tiết không khớp hoàn toàn với thời tiết.'],
        ['Tiết khí có phải là âm lịch không?', 'Không. Tiết khí thuộc phần dương lịch của âm dương lịch, nên ngày dương lịch của chúng gần như cố định.'],
      ],
      nguon: [['Hồ Ngọc Đức, Lịch Việt Nam: thuật toán tính tiết khí và tháng nhuận', 'https://www.informatik.uni-leipzig.de/~duc/amlich/'], ['Solar term (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Solar_term']],
      congCu: ['Xem tiết khí trên lịch tháng', '../../xemngay/frontend/index.html'],
    },
    {
      slug: 'chon-ngay-tot', tieuDe: 'Ngày hoàng đạo và cách chọn ngày tốt', chuyenMuc: 'lich-van-nien', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 14,
      moTa: 'Ngày hoàng đạo, hắc đạo, thập nhị trực, nhị thập bát tú, ngày kỵ và giờ hoàng đạo: mỗi yếu tố nói gì và cách kết hợp chúng khi chọn ngày cho một việc cụ thể.',
      the: ['ngày tốt', 'hoàng đạo', 'hắc đạo', 'thập nhị trực', 'nhị thập bát tú', 'tam nương', 'nguyệt kỵ', 'giờ hoàng đạo', 'chọn ngày'],
      noiDung: `Chọn ngày là phong tục lâu đời: trước khi cưới hỏi, khai trương, động thổ, người ta xem lịch để tránh ngày xấu. Một cuốn lịch vạn niên ghi rất nhiều thông tin cho mỗi ngày; hiểu từng thông tin giúp bạn không bị "ngày hoàng đạo" đánh lừa.

## Hoàng đạo và hắc đạo

Có 12 vị thần trực ngày, luân phiên theo chi của ngày và bắt đầu khác nhau theo tháng âm lịch:

- **Hoàng đạo** (tốt): Thanh Long, Minh Đường, Kim Quỹ, Kim Đường (còn gọi Bảo Quang), Ngọc Đường, Tư Mệnh.
- **Hắc đạo** (xấu): Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao, Nguyên Vũ, Câu Trận.

Vì có sáu thần tốt, sáu thần xấu, nên khoảng một nửa số ngày trong tháng là ngày hoàng đạo. Hoàng đạo chỉ là điều kiện đầu tiên, chưa đủ để gọi là ngày tốt.

## Thập nhị trực

Mười hai trực: Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế. Mỗi trực hợp với một số việc và kỵ một số việc khác. Ví dụ trực Thành, Khai hợp khai trương; trực Phá hợp phá dỡ nhưng kỵ cưới hỏi; trực Bế hợp đắp đê, lấp hố nhưng kỵ khai trương. Trực Kiến rơi vào ngày cùng chi với tháng tiết khí.

## Nhị thập bát tú

28 sao xoay vòng mỗi ngày một sao, mỗi sao tốt hoặc xấu cho từng loại việc. Ví dụ sao Phòng tốt cho cưới hỏi, sao Ngưu kỵ cưới hỏi và xây dựng.

## Ngày kỵ

- **Tam nương**: ngày âm lịch 3, 7, 13, 18, 22, 27.
- **Nguyệt kỵ**: ngày 5, 14, 23 âm lịch.
- **Dương công kỵ nhật**: 13 ngày cố định trong năm âm lịch.
- **Ngày xung tuổi**: ngày có chi đối diện chi tuổi của người làm việc.

## Giờ hoàng đạo

Mỗi ngày có 12 canh giờ, trong đó 6 giờ hoàng đạo. Khi không chọn được ngày đẹp hoàn toàn, nhiều người chọn giờ hoàng đạo để bắt đầu việc.

## Kết hợp lại

Cách làm hợp lý là đi từ việc cụ thể: muốn khai trương thì tìm ngày hoàng đạo, trực hợp khai trương, sao không kỵ khai trương, không phạm ngày kỵ, không xung tuổi người chủ. Rất hiếm ngày đạt hết, nên các lịch thường chấm điểm và chọn ngày có nhiều điểm tốt nhất. Cũng cần nhớ rằng các sách lịch (như Ngọc Hạp Thông Thư) khác nhau ở một số bảng tra, nên hai cuốn lịch có thể đánh giá cùng một ngày khác nhau.`,
      viDu: { tieuDe: 'Ngày 20/11/2026 có tốt cho khai trương không?', noiDung: `Ngày 20/11/2026 dương lịch là ngày 12 tháng 10 năm Bính Ngọ, can chi **Mậu Tuất**.

- Thần trực ngày: **Kim Quỹ**, hoàng đạo. Điểm cộng.
- Trực: **Bế**. Hợp đắp đê, xây tường rào; kỵ khai trương, cưới hỏi, đi xa.
- Sao: **Ngưu**, kỵ cưới hỏi, xây dựng, khai trương.
- Ngày 12 âm lịch không phạm Tam nương, Nguyệt kỵ.
- Xung với tuổi Thìn.

Kết luận: dù là ngày hoàng đạo, trực Bế và sao Ngưu đều kỵ khai trương, nên đây không phải ngày nên chọn để khai trương. Ví dụ này cho thấy vì sao không nên chỉ nhìn chữ "hoàng đạo".` },
      hoiDap: [
        ['Ngày hoàng đạo có phải ngày tốt cho mọi việc?', 'Không. Hoàng đạo chỉ là một tiêu chí. Ngày hoàng đạo vẫn có thể có trực hoặc sao kỵ đúng việc bạn định làm.'],
        ['Không chọn được ngày đẹp thì sao?', 'Nhiều người chọn ngày trung bình và giờ hoàng đạo, hoặc ưu tiên điều kiện thực tế như thời tiết, lịch của khách mời. Chọn ngày là phong tục để yên tâm, không nên để nó làm lỡ việc.'],
        ['Vì sao các trang lịch khác nhau đánh giá khác nhau?', 'Mỗi trang dựa theo một sách lịch và cách chấm điểm riêng. Trang Xem ngày của Lá Số Tử Vi ghi rõ phương pháp tính để bạn đối chiếu.'],
      ],
      nguon: [['Ngọc Hạp Thông Thư (sách lịch dân gian)'], ['Hiệp Kỷ Biện Phương Thư (sách lịch đời Thanh, 1739)'], ['Phần Phương pháp tính trên trang Xem ngày của Lá Số Tử Vi', '../../xemngay/frontend/index.html']],
      congCu: ['Chọn ngày theo việc', '../../xemngay/frontend/chon-ngay.html'],
    },
    {
      slug: 'thuat-ngu-huyen-hoc', tieuDe: 'Thuật ngữ huyền học thường gặp', chuyenMuc: 'kien-thuc', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 15,
      moTa: 'Giải thích ngắn các từ hay gặp khi xem tử vi, chọn ngày, chiêm tinh, thần số học và Tarot, từ can chi, nạp âm, cục đến cung Mọc, số bậc thầy, Ẩn Chính.',
      the: ['thuật ngữ', 'từ điển', 'can chi', 'nạp âm', 'cục', 'miếu hãm', 'cung mọc', 'góc chiếu', 'số bậc thầy', 'ẩn chính'],
      noiDung: `Mỗi môn huyền học có vốn từ riêng, và nhiều từ trùng tên nhưng khác nghĩa giữa các môn (ví dụ "cung" trong tử vi và "cung" trong chiêm tinh). Bảng dưới đây giải thích ngắn những từ bạn sẽ gặp trên Lá Số Tử Vi.

## Lịch và can chi

- **Âm dương lịch**: lịch dùng tháng theo Mặt Trăng và mùa theo Mặt Trời. Âm lịch Việt Nam thuộc loại này.
- **Can chi**: cặp thiên can và địa chi dùng để gọi năm, tháng, ngày, giờ.
- **Nạp âm**: hành gắn với mỗi cặp can chi, ví dụ Lộ Bàng Thổ. Thường dùng khi nói "mệnh" theo năm sinh.
- **Tiết khí**: 24 mốc chia năm theo kinh độ Mặt Trời.
- **Tuổi mụ**: tuổi tính theo năm âm lịch, bằng năm đang xem trừ năm sinh âm lịch cộng một.

## Tử vi

- **Lá số**: bảng 12 cung lập từ giờ, ngày, tháng, năm sinh âm lịch.
- **Cung**: một trong 12 ô của lá số, mỗi ô nói về một mặt đời sống.
- **Chính tinh, phụ tinh**: 14 sao chính quyết định tính chất cung; các sao phụ bổ sung hoặc làm lệch đi.
- **Miếu, Vượng, Đắc, Bình, Hãm**: độ sáng của sao theo vị trí, từ sáng nhất đến tối nhất.
- **Cục**: số từ 2 đến 6, tính từ nạp âm của cung Mệnh, quyết định tuổi bắt đầu đại hạn.
- **Tam phương tứ chính**: chính cung, hai cung tam hợp và cung xung chiếu, xem cùng nhau.
- **Tứ Hóa**: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ, an theo can năm.
- **Tuần, Triệt**: hai vòng "cắt" làm giảm tác dụng của sao trong cung.

## Chọn ngày

- **Hoàng đạo, hắc đạo**: 12 thần trực ngày, sáu tốt và sáu xấu.
- **Trực**: 12 trực từ Kiến đến Bế, mỗi trực hợp và kỵ một số việc.
- **Xung tuổi**: ngày có chi đối diện chi tuổi, cách 6 năm.

## Chiêm tinh

- **Cung hoàng đạo**: 1/12 vòng hoàng đạo, mỗi cung 30 độ.
- **Cung Mọc** (Ascendant): cung đang mọc ở chân trời phía đông lúc sinh.
- **Nhà**: 12 vùng của bầu trời tính từ cung Mọc, mỗi nhà một lĩnh vực đời sống.
- **Góc chiếu** (aspect): khoảng cách góc giữa hai thiên thể, như trùng tụ, vuông, tam hợp.
- **Nghịch hành**: hành tinh trông như đi lùi khi nhìn từ Trái Đất.

## Thần số học

- **Số chủ đạo**: tổng các chữ số ngày sinh, rút gọn.
- **Số bậc thầy** (master number): 11, 22, 33, được giữ nguyên không rút gọn trong nhiều trường phái.
- **Năm cá nhân**: vị trí của bạn trong chu kỳ 9 năm.

## Tarot

- **Ẩn Chính** (Major Arcana): 22 lá từ Kẻ Khờ đến Thế Giới.
- **Ẩn Phụ** (Minor Arcana): 56 lá chia bốn bộ Gậy, Cốc, Kiếm, Tiền.
- **Trải bài** (spread): cách bày lá theo các vị trí có ý nghĩa định sẵn.`,
      viDu: { tieuDe: 'Một chữ "cung", ba nghĩa', noiDung: `- "Cung Mệnh của tôi ở Dần": **cung** là một ô trên lá số tử vi.
- "Tôi cung Sư Tử": **cung** là cung hoàng đạo, ở đây là cung của Mặt Trời trên bản đồ sao.
- "Tôi cung Khảm, Đông tứ mệnh": **cung** là cung phi trong phong thủy Bát trạch.

Ba câu dùng cùng một chữ nhưng thuộc ba hệ khác nhau và không thể suy ra nhau.` },
      hoiDap: [
        ['"Mệnh" trong tử vi và "mệnh" theo năm sinh có giống nhau không?', 'Không. Cung Mệnh trong tử vi là một ô trên lá số, tính từ tháng và giờ sinh. "Mệnh Kim, mệnh Thổ" theo năm sinh là hành nạp âm của can chi năm sinh.'],
        ['Sao trong tử vi có phải ngôi sao thật không?', 'Phần lớn là sao quy ước, được an theo công thức từ ngày giờ sinh, không ứng với thiên thể thật. Ngược lại, hành tinh trong chiêm tinh là vị trí thật trên bầu trời.'],
      ],
      nguon: [['Các bài trong Thư viện kiến thức của Lá Số Tử Vi'], ['Vân Đằng Thái Thứ Lang, Tử vi đẩu số tân biên'], ['Horoscope (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Horoscope']],
      congCu: ['Lập lá số để thấy các thuật ngữ trên thực tế', 'la-so.html'],
    },
    {
      slug: 'doc-huyen-hoc-tinh-tao', tieuDe: 'Phương pháp luận: đọc huyền học sao cho tỉnh táo', chuyenMuc: 'kien-thuc', ngayDang: '2026-11-12', capNhat: '2026-11-12', noiBat: 16,
      moTa: 'Dữ liệu đầu vào cần chính xác đến đâu, vì sao các trường phái cho kết quả khác nhau, hiệu ứng Barnum, và cách dùng lá số, lá bài như công cụ suy ngẫm.',
      the: ['phương pháp luận', 'trường phái', 'hiệu ứng barnum', 'giờ sinh', 'múi giờ', 'tham khảo', 'tư duy phản biện'],
      noiDung: `Lá Số Tử Vi tính toán mọi thứ bằng công thức công khai: lịch âm theo thuật toán Hồ Ngọc Đức, vị trí hành tinh theo thiên văn học, số chủ đạo theo quy tắc ghi rõ. Phần tính toán có thể đúng hoặc sai một cách kiểm chứng được. Phần luận giải thì khác: đó là truyền thống diễn giải, không phải định luật. Bài này nói về cách đọc phần thứ hai cho tỉnh táo.

## Đầu vào quyết định đầu ra

- **Giờ sinh**: tử vi và bản đồ sao rất nhạy với giờ sinh. Lệch một canh giờ là đổi cung Mệnh; lệch hai giờ là đổi cung Mọc.
- **Lịch**: tử vi, con giáp dùng âm lịch; thần số học, chiêm tinh dùng dương lịch. Nhập nhầm loại lịch cho ra kết quả vô nghĩa.
- **Múi giờ**: âm lịch Việt Nam tính theo UTC+7. Người sinh ở nước ngoài cần chọn đúng múi giờ nơi sinh, vì ngày đầu tháng âm và tiết khí có thể lệch một ngày.
- **Ranh giới năm**: năm âm lịch đổi ở Tết, năm trong bát tự đổi ở Lập xuân, năm cá nhân có thể đổi ở 1/1 hoặc sinh nhật.

## Vì sao các trường phái cho kết quả khác nhau

Mỗi môn có nhiều trường phái: tử vi phái Việt và phái Trung Hoa khác nhau ở vài cách an sao; thần số học có cách giữ số 10 và cách giữ số 33; chiêm tinh có nhiều cách chia nhà. Không có trường phái nào "đúng" theo nghĩa kiểm chứng được. Điều quan trọng là biết mình đang dùng cách nào và dùng nhất quán. Các trang của Lá Số Tử Vi luôn ghi rõ cách tính để bạn đối chiếu.

## Hiệu ứng Barnum

Năm 1948, nhà tâm lý học Bertram Forer phát cho sinh viên một bản "phân tích tính cách" mà họ tưởng viết riêng cho mình; thật ra ai cũng nhận cùng một đoạn văn. Phần lớn sinh viên chấm bản phân tích là rất đúng. Những câu như "bạn bề ngoài vui vẻ nhưng bên trong đôi khi bất an" đúng với hầu hết mọi người. Khi đọc một lời luận giải thấy "đúng quá", hãy tự hỏi: câu này có đúng với bạn bè mình không?

## Dùng như công cụ suy ngẫm

Cách dùng có ích nhất của tử vi, chiêm tinh, thần số học hay Tarot là làm khung để đặt câu hỏi về chính mình:

1. Đọc lời luận giải như một giả thuyết, không như một phán quyết.
2. Đối chiếu với những gì bạn đã thực sự trải qua.
3. Giữ lại điều giúp bạn hiểu mình hơn hoặc hành động tốt hơn, bỏ qua phần còn lại.
4. Không dùng để quyết định thay cho thông tin thực tế trong những việc hệ trọng như sức khỏe, tài chính, pháp lý.

## Khi nào nên dừng lại

Nếu bạn thấy mình phải xem bói liên tục mới dám quyết định, hoặc lo lắng kéo dài vì một lời "phán", đó là lúc nên tạm dừng và nói chuyện với người thân hoặc chuyên gia tâm lý.`,
      viDu: { tieuDe: 'Tự kiểm tra một lời luận giải', noiDung: `Lời luận giải: "Bạn sống tình cảm, đôi khi quá cả nể, nên dễ chịu thiệt."

1. Câu này có đúng với ít nhất ba người bạn của bạn không? Nếu có, nó gần như không mang thông tin riêng về bạn.
2. Có sự kiện cụ thể nào trong một năm qua cho thấy điều đó không?
3. Nếu đúng, bạn muốn làm gì khác đi? Ví dụ: tập từ chối một lời nhờ vả mỗi tuần.

Lời luận giải chỉ có giá trị khi đi đến bước 3.` },
      hoiDap: [
        ['Lá Số Tử Vi có lưu thông tin ngày sinh của tôi không?', 'Các trang tính trên máy bạn. Lịch sử và hồ sơ (nếu bạn lưu) nằm trong trình duyệt của bạn, không gửi lên máy chủ.'],
        ['Kết quả trên trang này khác trang khác thì tin trang nào?', 'Trước hết kiểm tra phần tính toán (âm lịch, vị trí hành tinh) có khớp không. Nếu khớp mà luận giải khác, đó là khác biệt trường phái và cách diễn giải.'],
        ['Huyền học có phải là khoa học không?', 'Không. Các môn này là truyền thống văn hóa và công cụ chiêm nghiệm. Phần tính lịch và thiên văn là khoa học, phần luận giải thì không được kiểm chứng bằng thực nghiệm.'],
      ],
      nguon: [['Forer, B. R. (1949). The fallacy of personal validation: a classroom demonstration of gullibility. Journal of Abnormal and Social Psychology, 44(1), 118–123.'], ['Barnum effect (Wikipedia tiếng Anh)', 'https://en.wikipedia.org/wiki/Barnum_effect'], ['Hồ Ngọc Đức, Lịch Việt Nam', 'https://www.informatik.uni-leipzig.de/~duc/amlich/']],
      congCu: ['Về trang chủ', 'index.html'],
    },
  ];

  const ThuVienDuLieu = { CHUYEN_MUC, BAI };
  if (typeof module !== 'undefined' && module.exports) module.exports = ThuVienDuLieu; else root.ThuVienDuLieu = ThuVienDuLieu;
})(typeof window !== 'undefined' ? window : globalThis);
