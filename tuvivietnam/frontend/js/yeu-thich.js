/* Bài yêu thích và lượt đọc: lưu trong trình duyệt (localStorage). Lượt đọc gửi thêm lên backend nếu có, để xếp "Phổ biến". */
(function (root) {
  'use strict';
  const KEY = 'thu-vien-yeu-thich';
  const doc = () => { try { const x = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(x) ? x.filter(s => typeof s === 'string') : []; } catch (e) { return []; } };
  const ghi = ds => { try { localStorage.setItem(KEY, JSON.stringify(ds)); return true; } catch (e) { return false; } };
  /** Bật/tắt yêu thích, trả trạng thái mới */
  function doi(slug) { const ds = doc(), co = ds.includes(slug); ghi(co ? ds.filter(x => x !== slug) : [slug, ...ds]); return !co; }
  /** Ghi một lượt đọc lên backend, mỗi bài một lần cho mỗi phiên trình duyệt */
  function demLuot(slug) {
    try { if (sessionStorage.getItem('da-doc:' + slug)) return; sessionStorage.setItem('da-doc:' + slug, '1'); } catch (e) { /* chế độ riêng tư: vẫn gửi */ }
    fetch((root.TUVI_API || '') + '/api/bai-viet/' + encodeURIComponent(slug) + '/xem', { method: 'POST' }).catch(() => {});
  }
  root.YeuThich = { doc, doi, demLuot };
})(window);
