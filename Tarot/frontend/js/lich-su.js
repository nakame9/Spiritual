/* Lịch sử trải bài Tarot: vẽ kết quả một lần trải (dùng chung trang xem bài và trang lịch sử),
 * lưu, đọc, sửa ghi chú, xóa trong localStorage của trình duyệt. Chỉ lưu lá đã rút; nội dung giải nghĩa tính lại từ bo-bai.js.
 * Cần bo-bai.js và la-bai.js nạp trước. */
(function (root) {
  'use strict';
  const KEY = 'tarot-lich-su', TOI_DA = 100;
  const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hoa = s => s.charAt(0).toUpperCase() + s.slice(1);

  /** HTML kết quả: từng lá (theo vị trí, theo chủ đề, ý nghĩa đầy đủ), tổng hợp, điểm đáng chú ý */
  function veKetQua(r) {
    const { theLa } = root.LaBai, B = root.Tarot.BO_BAI;
    const nhom = l => l.nhom === 'anChinh' ? 'Ẩn Chính' : `Ẩn Phụ, bộ ${root.Tarot.THONG_TIN_BO[l.bo].ten}`;
    return `${r.cauHoi ? `<p class="cau-hoi-kq"><b>Câu hỏi:</b> ${esc(r.cauHoi)}</p>` : ''}
      ${r.la.map((l, i) => { const c = B[l.id], ch = l.nguoc ? 'nguoc' : 'xuoi';
        return `<div class="item">${theLa(c, l.nguoc, 'static')}
        <div><span class="step">${r.la.length > 1 ? `${i + 1}. ` : ''}${l.viTri}</span><h3>${l.ten}</h3>
        <div class="meta"><span>${l.tenEn}</span><span>${nhom(l)}</span><span class="chip ${l.nguoc ? 'n' : 'x'}">${l.nguoc ? 'Ngược' : 'Xuôi'}</span><a href="thu-vien.html#la-${l.id}" target="_blank" rel="noopener">Tra cứu lá này</a></div>
        <p class="kw">${hoa(l.tuKhoa)}</p>
        <p class="vt"><b>Ở vị trí ${l.viTri}:</b> ${l.yTheoViTri}</p>
        <p><b>${r.chuDe === 'tongquan' ? 'Ý nghĩa' : `Về ${r.tenChuDe.toLowerCase()}`}:</b> ${l.y}</p>
        <p class="lk"><b>Lời khuyên:</b> ${l.loiKhuyen}</p>
        <details class="day-du"><summary>Ý nghĩa đầy đủ của lá</summary><dl>
          <dt>Tổng quát</dt><dd>${c.tongQuat}</dd>
          <dt>${l.nguoc ? 'Ngược (chiều đã rút)' : 'Xuôi (chiều đã rút)'}</dt><dd>${c[ch].y}</dd>
          <dt>${l.nguoc ? 'Xuôi' : 'Ngược'}</dt><dd>${c[l.nguoc ? 'xuoi' : 'nguoc'].y}</dd>
          <dt>Trong tình yêu</dt><dd>${c.chuDe.tinhyeu[ch]}</dd><dt>Trong công việc</dt><dd>${c.chuDe.sunghiep[ch]}</dd><dt>Trong tài chính</dt><dd>${c.chuDe.taichinh[ch]}</dd>
        </dl></details></div></div>`; }).join('')}
      <div class="sum"><h3>Tổng hợp thông điệp</h3>${r.luanGiai.map(p => `<p>${esc(p)}</p>`).join('')}
        <h4>Điểm đáng chú ý</h4><ul>${r.tongQuan.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
  }

  // ---------- Lưu trữ ----------
  function doc() {
    try {
      const ds = JSON.parse(localStorage.getItem(KEY)) || [];
      const T = root.Tarot;
      // Bỏ bản ghi hỏng hoặc không còn khớp bộ bài
      return Array.isArray(ds) ? ds.filter(x => x && T.KIEU_TRAI[x.kieu] && T.CHU_DE[x.chuDe] && Array.isArray(x.chon)
        && x.chon.length === T.KIEU_TRAI[x.kieu].viTri.length && x.chon.every(c => Number.isInteger(c.id) && c.id >= 0 && c.id < 78)) : [];
    } catch (e) { return []; }
  }
  function ghi(ds) { try { localStorage.setItem(KEY, JSON.stringify(ds.slice(0, TOI_DA))); return true; } catch (e) { return false; } }
  /** Lưu mới (id rỗng) hoặc cập nhật ghi chú (id có sẵn). Trả id, hoặc null nếu trình duyệt không cho lưu */
  function luu(b) {
    const ds = doc();
    const cu = b.id && ds.find(x => x.id === b.id);
    if (cu) { cu.ghiChu = String(b.ghiChu || '').slice(0, 1000); return ghi(ds) ? cu.id : null; }
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    ds.unshift({ id, luc: new Date().toISOString(), kieu: b.kieu, chuDe: b.chuDe, cauHoi: String(b.cauHoi || '').slice(0, 200), chon: b.chon, ghiChu: String(b.ghiChu || '').slice(0, 1000) });
    return ghi(ds) ? id : null;
  }
  function xoa(id) { return ghi(doc().filter(x => x.id !== id)); }
  function suaGhiChu(id, ghiChu) { const ds = doc(), x = ds.find(y => y.id === id); if (!x) return false; x.ghiChu = String(ghiChu || '').slice(0, 1000); return ghi(ds); }

  root.TarotLichSu = { veKetQua, doc, luu, xoa, suaGhiChu, esc };
})(window);
