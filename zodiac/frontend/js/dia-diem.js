/* Nơi sinh: [tên, vĩ độ, kinh độ, múi giờ IANA]. Các tỉnh từ Quảng Trị trở vào dùng Asia/Ho_Chi_Minh vì giờ miền Nam
 * 1960–1975 là UTC+8; từ Quảng Bình trở ra dùng Asia/Bangkok (UTC+7). Tọa độ lấy ở trung tâm tỉnh lỵ (theo địa giới trước 2025). */
(function (root) {
  'use strict';
  const B = 'Asia/Bangkok', N = 'Asia/Ho_Chi_Minh';
  const VIET_NAM = [
    ['Hà Nội', 21.028, 105.854, B], ['Hải Phòng', 20.845, 106.688, B], ['Hạ Long (Quảng Ninh)', 20.951, 107.08, B], ['Bắc Ninh', 21.186, 106.076, B],
    ['Bắc Giang', 21.273, 106.194, B], ['Hải Dương', 20.937, 106.315, B], ['Hưng Yên', 20.646, 106.051, B], ['Thái Bình', 20.447, 106.336, B],
    ['Nam Định', 20.42, 106.168, B], ['Ninh Bình', 20.251, 105.975, B], ['Phủ Lý (Hà Nam)', 20.541, 105.914, B], ['Vĩnh Yên (Vĩnh Phúc)', 21.31, 105.597, B],
    ['Việt Trì (Phú Thọ)', 21.322, 105.402, B], ['Thái Nguyên', 21.594, 105.848, B], ['Lạng Sơn', 21.853, 106.761, B], ['Cao Bằng', 22.666, 106.258, B],
    ['Hà Giang', 22.823, 104.984, B], ['Tuyên Quang', 21.823, 105.214, B], ['Yên Bái', 21.722, 104.911, B], ['Lào Cai', 22.486, 103.97, B],
    ['Bắc Kạn', 22.147, 105.835, B], ['Điện Biên Phủ', 21.386, 103.023, B], ['Lai Châu', 22.396, 103.458, B], ['Sơn La', 21.327, 103.914, B],
    ['Hòa Bình', 20.817, 105.338, B], ['Thanh Hóa', 19.807, 105.776, B], ['Vinh (Nghệ An)', 18.679, 105.681, B], ['Hà Tĩnh', 18.343, 105.906, B],
    ['Đồng Hới (Quảng Bình)', 17.469, 106.622, B],
    ['Đông Hà (Quảng Trị)', 16.816, 107.1, N], ['Huế', 16.463, 107.59, N], ['Đà Nẵng', 16.054, 108.202, N], ['Tam Kỳ (Quảng Nam)', 15.573, 108.474, N],
    ['Hội An', 15.88, 108.335, N], ['Quảng Ngãi', 15.12, 108.792, N], ['Quy Nhơn (Bình Định)', 13.782, 109.219, N], ['Tuy Hòa (Phú Yên)', 13.096, 109.309, N],
    ['Nha Trang (Khánh Hòa)', 12.239, 109.197, N], ['Phan Rang (Ninh Thuận)', 11.565, 108.988, N], ['Phan Thiết (Bình Thuận)', 10.928, 108.102, N],
    ['Kon Tum', 14.35, 108.0, N], ['Pleiku (Gia Lai)', 13.983, 108.0, N], ['Buôn Ma Thuột (Đắk Lắk)', 12.667, 108.038, N], ['Gia Nghĩa (Đắk Nông)', 12.004, 107.69, N],
    ['Đà Lạt (Lâm Đồng)', 11.94, 108.458, N], ['TP. Hồ Chí Minh', 10.776, 106.701, N], ['Biên Hòa (Đồng Nai)', 10.957, 106.843, N], ['Thủ Dầu Một (Bình Dương)', 10.98, 106.652, N],
    ['Vũng Tàu', 10.346, 107.084, N], ['Tây Ninh', 11.31, 106.098, N], ['Đồng Xoài (Bình Phước)', 11.535, 106.883, N], ['Tân An (Long An)', 10.535, 106.413, N],
    ['Mỹ Tho (Tiền Giang)', 10.36, 106.36, N], ['Bến Tre', 10.243, 106.375, N], ['Trà Vinh', 9.935, 106.345, N], ['Vĩnh Long', 10.254, 105.972, N],
    ['Cao Lãnh (Đồng Tháp)', 10.46, 105.633, N], ['Long Xuyên (An Giang)', 10.386, 105.435, N], ['Cần Thơ', 10.045, 105.747, N], ['Vị Thanh (Hậu Giang)', 9.784, 105.47, N],
    ['Sóc Trăng', 9.603, 105.98, N], ['Rạch Giá (Kiên Giang)', 10.012, 105.081, N], ['Phú Quốc', 10.217, 103.959, N], ['Bạc Liêu', 9.285, 105.724, N], ['Cà Mau', 9.177, 105.15, N],
  ];
  const THE_GIOI = [
    ['Băng Cốc (Thái Lan)', 13.756, 100.502, 'Asia/Bangkok'], ['Viêng Chăn (Lào)', 17.975, 102.633, 'Asia/Vientiane'], ['Phnôm Pênh (Campuchia)', 11.556, 104.928, 'Asia/Phnom_Penh'],
    ['Singapore', 1.352, 103.82, 'Asia/Singapore'], ['Kuala Lumpur (Malaysia)', 3.139, 101.687, 'Asia/Kuala_Lumpur'], ['Bắc Kinh (Trung Quốc)', 39.904, 116.407, 'Asia/Shanghai'],
    ['Thượng Hải (Trung Quốc)', 31.23, 121.474, 'Asia/Shanghai'], ['Hồng Kông', 22.32, 114.17, 'Asia/Hong_Kong'], ['Đài Bắc (Đài Loan)', 25.033, 121.565, 'Asia/Taipei'],
    ['Seoul (Hàn Quốc)', 37.566, 126.978, 'Asia/Seoul'], ['Tokyo (Nhật Bản)', 35.676, 139.65, 'Asia/Tokyo'], ['Osaka (Nhật Bản)', 34.694, 135.502, 'Asia/Tokyo'],
    ['Sydney (Úc)', -33.869, 151.209, 'Australia/Sydney'], ['Melbourne (Úc)', -37.814, 144.963, 'Australia/Melbourne'], ['Paris (Pháp)', 48.857, 2.352, 'Europe/Paris'],
    ['Berlin (Đức)', 52.52, 13.405, 'Europe/Berlin'], ['London (Anh)', 51.507, -0.128, 'Europe/London'], ['Praha (Séc)', 50.075, 14.438, 'Europe/Prague'],
    ['Warszawa (Ba Lan)', 52.23, 21.012, 'Europe/Warsaw'], ['Moskva (Nga)', 55.756, 37.617, 'Europe/Moscow'], ['New York (Mỹ)', 40.713, -74.006, 'America/New_York'],
    ['Washington (Mỹ)', 38.907, -77.037, 'America/New_York'], ['Houston (Mỹ)', 29.76, -95.37, 'America/Chicago'], ['Los Angeles (Mỹ)', 34.052, -118.244, 'America/Los_Angeles'],
    ['San Jose (Mỹ)', 37.338, -121.886, 'America/Los_Angeles'], ['Seattle (Mỹ)', 47.606, -122.332, 'America/Los_Angeles'], ['Toronto (Canada)', 43.653, -79.383, 'America/Toronto'],
    ['Montréal (Canada)', 45.502, -73.567, 'America/Toronto'], ['Vancouver (Canada)', 49.283, -123.121, 'America/Vancouver'],
  ];
  // Múi giờ cho người tự nhập tọa độ. Etc/GMT-7 nghĩa là UTC+7 (dấu ngược theo chuẩn IANA).
  const MUI_GIO = [
    ['Asia/Ho_Chi_Minh', 'Việt Nam, miền Nam (có giờ UTC+8 giai đoạn 1960–1975)'], ['Asia/Bangkok', 'Việt Nam miền Bắc, Thái Lan (UTC+7)'],
    ['Asia/Shanghai', 'Trung Quốc (UTC+8)'], ['Asia/Tokyo', 'Nhật Bản (UTC+9)'], ['Asia/Seoul', 'Hàn Quốc'], ['Australia/Sydney', 'Úc, Sydney'],
    ['Europe/London', 'Anh'], ['Europe/Paris', 'Pháp'], ['Europe/Berlin', 'Đức'], ['Europe/Moscow', 'Nga, Moskva'],
    ['America/New_York', 'Mỹ, miền Đông'], ['America/Chicago', 'Mỹ, miền Trung'], ['America/Denver', 'Mỹ, vùng núi'], ['America/Los_Angeles', 'Mỹ, miền Tây'],
    ...[-10, -8, -7, -6, -5, -4, -3, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => [`Etc/GMT${h > 0 ? '-' : '+'}${Math.abs(h)}`, `Giờ cố định UTC${h >= 0 ? '+' : '-'}${Math.abs(h)}`]),
  ];
  const DiaDiem = { VIET_NAM, THE_GIOI, MUI_GIO };
  if (typeof module !== 'undefined' && module.exports) module.exports = DiaDiem; else root.DiaDiem = DiaDiem;
})(typeof window !== 'undefined' ? window : globalThis);
