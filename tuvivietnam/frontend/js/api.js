/* Kết nối web công khai với backend.
 * TUVI_API: để trống khi web được chính backend phục vụ (npm start). Khi web đặt ở GitHub Pages còn backend ở chỗ khác,
 * điền địa chỉ backend, ví dụ 'https://tuvivietnam.onrender.com'. Không gọi được backend thì trang dùng nội dung có sẵn. */
window.TUVI_API = window.TUVI_API || '';
window.layApi = function (url, ms) {
  const c = new AbortController(), t = setTimeout(() => c.abort(), ms || 4000);
  return fetch(window.TUVI_API + url, { signal: c.signal })
    .then(r => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : Promise.reject(new Error('Không có backend'))))
    .finally(() => clearTimeout(t));
};
window.escHtml = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
