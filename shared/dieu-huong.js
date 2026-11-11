/* Điều hướng toàn site: các nhóm menu, trang con và mô tả một dòng. Một nguồn duy nhất cho header, chân trang (scripts/menu.js)
 * và trang tìm kiếm (tim-kiem.html). Đường dẫn tính từ gốc kho. */
(function (root) {
  'use strict';
  const NHOM = [
    { id: 'trang-chu', ten: 'Trang chủ', href: 'tuvivietnam/frontend/index.html' },
    { id: 'tu-vi', ten: 'Tử vi', vung: [], muc: [
      ['tuvivietnam/frontend/la-so.html', 'Lập lá số', '12 cung, luận giải, đại hạn, tiểu hạn', 'la so tu vi dau so cung menh quan loc dai han tieu han luu nien'],
      ['tuvivietnam/frontend/con-giap.html', '12 con giáp', 'Tuổi, bản mệnh, vận trình theo ngày, tháng, năm', 'con giap tuoi ty suu dan mao meo thin van trinh tam tai'],
      ['tuvivietnam/frontend/tra-cuu/hop-tuoi.html', 'Xem tuổi hợp', 'Kết hôn, làm ăn, báo cáo hai người', 'tuoi hop xung ket hon lam an vo chong kim lau'] ] },
    { id: 'lich', ten: 'Lịch & phong thủy', vung: ['xemngay/frontend/'], muc: [
      ['xemngay/frontend/index.html', 'Lịch vạn niên', 'Lịch tháng âm dương, xem ngày tốt xấu', 'lich am lich van nien xem ngay hoang dao truc tiet khi gio tot'],
      ['xemngay/frontend/chon-ngay.html', 'Chọn ngày theo việc', 'Khai trương, cưới hỏi, động thổ, nhập trạch', 'chon ngay khai truong cuoi hoi dong tho nhap trach xuat hanh'],
      ['tuvivietnam/frontend/tra-cuu/ngu-hanh.html', 'Ngũ hành, bản mệnh', 'Nạp âm, tương sinh, màu sắc, phương hướng', 'ngu hanh ban menh nap am mau hop menh kim moc thuy hoa tho'],
      ['tuvivietnam/frontend/tra-cuu/phong-thuy.html', 'Phong thủy cá nhân', 'Cung phi, hướng nhà, bàn làm việc', 'phong thuy cung phi bat trach huong nha ban lam viec'] ] },
    { id: 'chiem-tinh', ten: 'Chiêm tinh', vung: ['zodiac/frontend/'], muc: [
      ['zodiac/frontend/index.html', '12 cung hoàng đạo', 'Xác định cung, tính cách, nguyên tố', 'cung hoang dao bach duong kim nguu song tu cu giai su tu xu nu'],
      ['zodiac/frontend/tu-vi.html', 'Tử vi theo cung', 'Ngày, tuần, tháng, năm', 'tu vi hang ngay cung hoang dao tuan thang nam'],
      ['zodiac/frontend/ban-do-sao.html', 'Bản đồ sao', 'Hành tinh, 12 nhà, góc chiếu, luận giải', 'ban do sao birth chart cung moc hanh tinh nha goc chieu'],
      ['zodiac/frontend/tuong-hop.html', 'Độ tương hợp', 'Hai cung hoàng đạo hợp nhau thế nào', 'tuong hop cung hoang dao tinh yeu'],
      ['zodiac/frontend/hop-doi.html', 'Hợp đôi', 'Đối chiếu hai bản đồ sao', 'hop doi synastry hai ban do sao'] ] },
    { id: 'than-so', ten: 'Thần số học', vung: ['numerology/frontend/'], muc: [
      ['numerology/frontend/index.html', 'Số chủ đạo', 'Chỉ số cá nhân, năm, tháng, ngày cá nhân', 'so chu dao than so hoc pythagoras nam ca nhan duong doi'],
      ['numerology/frontend/tuong-hop.html', 'So sánh hai số', 'Tương hợp hai số chủ đạo', 'so sanh tuong hop so chu dao'] ] },
    { id: 'kham-pha', ten: 'Khám phá', vung: ['Tarot/frontend/', 'tuvivietnam/frontend/tra-cuu/index.html'], muc: [
      ['Tarot/frontend/index.html', 'Tarot', 'Chọn chủ đề, trải bài, lật bài', 'tarot trai bai rut bai la bai'],
      ['Tarot/frontend/thu-vien.html', 'Thư viện lá bài', '78 lá, ý nghĩa xuôi và ngược', 'tarot 78 la an chinh an phu y nghia'],
      ['tuvivietnam/frontend/tra-cuu/giai-mong.html', 'Giải mộng', 'Biểu tượng và góc nhìn tâm lý', 'giai mong giac mo chiem bao mo thay'],
      ['tuvivietnam/frontend/tra-cuu/tro-ly.html', 'Trợ lý AI', 'Hỏi về kết quả đã tính', 'tro ly ai hoi dap'] ] },
    { id: 'kien-thuc', ten: 'Kiến thức', vung: ['tuvivietnam/frontend/bai-viet'], muc: [
      ['tuvivietnam/frontend/bai-viet.html', 'Bài viết', 'Thư viện kiến thức huyền học', 'bai viet thu vien kien thuc'],
      ['tuvivietnam/frontend/bai-viet/thuat-ngu-huyen-hoc.html', 'Từ điển huyền học', 'Thuật ngữ thường gặp', 'tu dien thuat ngu'],
      ['tuvivietnam/frontend/bai-viet/doc-huyen-hoc-tinh-tao.html', 'Hướng dẫn đọc kết quả', 'Phương pháp luận, đọc cho tỉnh táo', 'huong dan phuong phap luan'],
      ['tuvivietnam/frontend/gioi-thieu.html', 'Giới thiệu và phương pháp', 'Cách tính, nguồn dữ liệu, liên hệ', 'gioi thieu phuong phap nguon du lieu lien he'] ] },
  ];
  const THONG_TIN = [
    ['tuvivietnam/frontend/gioi-thieu.html', 'Giới thiệu và phương pháp'],
    ['tuvivietnam/frontend/chinh-sach.html', 'Chính sách riêng tư'],
    ['tuvivietnam/frontend/dieu-khoan.html', 'Điều khoản sử dụng'],
    ['tuvivietnam/frontend/gioi-thieu.html#lien-he', 'Liên hệ'],
    ['tuvivietnam/frontend/tai-khoan.html', 'Hồ sơ của tôi'],
  ];
  const TRANG = { tim: 'tuvivietnam/frontend/tim-kiem.html', taiKhoan: 'tuvivietnam/frontend/tai-khoan.html', trangChu: 'tuvivietnam/frontend/index.html' };
  /** Nhóm chứa trang (đường dẫn từ gốc kho): khớp trang con trước, rồi vùng */
  function nhomCua(tuGoc) {
    const n = NHOM.find(g => g.href === tuGoc || (g.muc || []).some(m => m[0] === tuGoc));
    return n ? n.id : (NHOM.find(g => (g.vung || []).some(v => tuGoc.startsWith(v))) || {}).id || '';
  }
  const DieuHuong = { NHOM, THONG_TIN, TRANG, nhomCua };
  if (typeof module !== 'undefined' && module.exports) module.exports = DieuHuong; else root.DieuHuong = DieuHuong;
})(typeof window !== 'undefined' ? window : globalThis);
