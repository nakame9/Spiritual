/* Dùng chung cho các trang Tra cứu: đọc ngày sinh từ ba ô ngày/tháng/năm, nhớ hồ sơ trên máy (localStorage), escape HTML. */
(function (root) {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /** Đọc ngày sinh dương lịch từ các ô <p>d, <p>m, <p>y. Sai thì ném lỗi tiếng Việt */
  function docNgay(p = '') {
    const [d, m, y] = ['d', 'm', 'y'].map(k => Number(($(p + k).value || '').trim()));
    if (![d, m, y].every(Number.isInteger) || !d || !m || !y) throw new Error('Nhập đủ ngày, tháng, năm sinh dương lịch.');
    if (y < 1900 || y > 2100) throw new Error('Năm sinh cần từ 1900 đến 2100.');
    const t = new Date(Date.UTC(y, m - 1, d));
    if (t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) throw new Error(`Ngày ${d}/${m}/${y} không có trên lịch.`);
    return { d, m, y };
  }
  const dienNgay = (p, n) => { if (n) ['d', 'm', 'y'].forEach(k => { if ($(p + k)) $(p + k).value = n[k]; }); };
  const KEY = 'tra-cuu-ho-so';
  const hoSo = {
    doc() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } },
    ghi(x) { try { localStorage.setItem(KEY, JSON.stringify(x)); } catch (e) { /* trình duyệt chặn lưu trữ */ } },
  };
  const ngayVN = n => `${String(n.d).padStart(2, '0')}/${String(n.m).padStart(2, '0')}/${n.y}`;
  root.TraCuu = { $, esc, docNgay, dienNgay, hoSo, ngayVN };
})(window);
