/* Tiện ích giao diện dùng chung cho các trang cung hoàng đạo. */
(function (root) {
  'use strict';
  const { CUNG, HANH_TINH, NGUYEN_TO, TINH_CHAT } = root.HoangDao;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const theoId = Object.fromEntries(CUNG.map(c => [c.id, c]));
  const sao = n => `<span class="sao-diem" role="img" aria-label="${n} trên 5 sao">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;
  const ngayNgan = c => `${c.tu[1]}/${c.tu[0]} – ${c.den[1]}/${c.den[0]}`;
  const chuTinh = c => c.chuTinh.length > 1 ? `${HANH_TINH[c.chuTinh[0]].ten} (hiện đại), ${HANH_TINH[c.chuTinh[1]].ten} (cổ điển)` : HANH_TINH[c.chuTinh[0]].ten;
  const ky = (c, lop = '') => `<span class="ky ${lop}" aria-hidden="true">${c.kyHieu}</span>`;
  const nt = c => `nt-${c.nguyenTo}`;
  /** Đọc ô ngày/giờ dạng số; trả về { y, m, d, h, mi } hoặc chuỗi lỗi */
  function docNgay(p, canGio) {
    const so = id => { const v = ($(p + id) || {}).value; return v === undefined || String(v).trim() === '' ? null : Number(v); };
    const d = so('d'), m = so('m'), y = so('y'), h = so('h'), mi = so('mi');
    if (![d, m, y].every(Number.isInteger)) return 'Hãy nhập đủ ngày, tháng, năm sinh bằng số.';
    if (y < 1900 || y > 2100) return 'Năm sinh cần trong khoảng 1900–2100.';
    const t = new Date(Date.UTC(y, m - 1, d));
    if (m < 1 || m > 12 || t.getUTCDate() !== d) return 'Ngày tháng không hợp lệ.';
    if (h === null && mi === null) return canGio ? 'Hãy nhập giờ sinh, hoặc đánh dấu "không rõ giờ sinh".' : { y, m, d };
    if (!Number.isInteger(h) || h < 0 || h > 23 || (mi !== null && (!Number.isInteger(mi) || mi < 0 || mi > 59))) return 'Giờ sinh cần từ 0 đến 23, phút từ 0 đến 59.';
    return { y, m, d, h, mi: mi || 0 };
  }
  const homNay = () => { const x = root.ThienVan.ngayTai(new Date(), root.ChiemTinh.VN); return { y: x.y, m: x.m, d: x.d }; };
  root.UI = { $, esc, CUNG, theoId, HANH_TINH, NGUYEN_TO, TINH_CHAT, sao, ngayNgan, chuTinh, ky, nt, docNgay, homNay };
})(window);
