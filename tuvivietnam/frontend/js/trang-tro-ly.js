/* Trang Trợ lý AI: hồ sơ lưu trên máy, gửi câu hỏi tới /api/tro-ly (backend tính dữ liệu rồi nhờ AI diễn giải).
 * Không có backend (GitHub Pages) thì tính ngay trên máy và trả lời theo mẫu bằng cùng module TroLy. */
(function () {
  'use strict';
  const { $, esc, dienNgay, hoSo } = TraCuu;
  const GOI_Y = ['Lá số của tôi có cung Quan Lộc như thế nào?', 'Số chủ đạo của tôi có ý nghĩa gì?', 'Hai tuổi 1990 và 1992 có hợp làm ăn không?',
    'Hôm nay nên chú ý điều gì?', 'Giải thích sao Tử Vi trong cung Mệnh.', 'Mệnh của tôi là gì, hợp màu gì?', 'Nhà tôi nên quay hướng nào?', 'Tôi mơ thấy rắn đuổi theo mình.'];
  $('goi-y').innerHTML = GOI_Y.map(q => `<button type="button">${esc(q)}</button>`).join('');
  $('goi-y').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { $('cau-hoi').value = b.textContent; hoi(); } });

  // Hồ sơ: điền lại từ máy, lưu mỗi khi đổi
  const hs = hoSo.doc() || {};
  dienNgay('a', hs); if (hs.gio) $('gio').value = hs.gio; if (hs.gioiTinh) $('a' + hs.gioiTinh).checked = true; if (hs.ten) $('ten').value = hs.ten;
  function docHoSo() {
    const so = id => { const v = $(id).value.trim(); return v ? Number(v) : undefined; };
    const h = { d: so('ad'), m: so('am'), y: so('ay'), gio: $('gio').value ? Number($('gio').value) : undefined,
      gioiTinh: $('anam').checked ? 'nam' : $('anu').checked ? 'nu' : undefined, ten: $('ten').value.trim() || undefined };
    if ([h.d, h.m, h.y].some(x => x !== undefined) && !(Number.isInteger(h.d) && Number.isInteger(h.m) && Number.isInteger(h.y) && h.y >= 1900 && h.y <= 2100
      && new Date(Date.UTC(h.y, h.m - 1, h.d)).getUTCDate() === h.d)) throw new Error('Ngày sinh trong hồ sơ chưa đúng (ngày/tháng/năm dương lịch, năm 1900–2100).');
    return h;
  }
  $('ho-so').addEventListener('change', () => { try { const h = docHoSo(); hoSo.ghi(Object.assign(hoSo.doc() || {}, JSON.parse(JSON.stringify(h)))); } catch (e) { /* báo khi hỏi */ } });
  $('ho-so').addEventListener('submit', e => e.preventDefault());

  const tin = (lop, html) => { $('hoi-thoai').insertAdjacentHTML('beforeend', `<div class="tin ${lop}">${html}</div>`); return $('hoi-thoai').lastElementChild; };
  const doan = s => String(s).split(/\n{2,}|\n/).filter(x => x.trim()).map(x => `<p>${esc(x)}</p>`).join('');
  const bangDuLieu = ds => ds.length ? `<details><summary>Dữ liệu hệ thống đã tính</summary><dl>${ds.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></details>` : '';
  const homNay = () => { const d = new Date(Date.now() + 7 * 3600 * 1000); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() }; };

  let dangHoi = false;
  async function hoi(e) {
    if (e) e.preventDefault();
    const cauHoi = $('cau-hoi').value.trim();
    if (!cauHoi || dangHoi) return;
    let h; try { h = docHoSo(); } catch (err) { $('trang-thai').textContent = err.message; return; }
    dangHoi = true; $('gui').disabled = true; $('trang-thai').textContent = 'Đang tính và soạn câu trả lời…';
    tin('nguoi', `<p>${esc(cauHoi)}</p>`); $('cau-hoi').value = '';
    let r;
    try {
      const c = new AbortController(), t = setTimeout(() => c.abort(), 40000);
      const res = await fetch((window.TUVI_API || '') + '/api/tro-ly', { method: 'POST', signal: c.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cauHoi, hoSo: h }) });
      clearTimeout(t);
      if (!(res.headers.get('content-type') || '').includes('json')) throw new Error('khong-co-backend');
      r = await res.json();
      if (!res.ok) { tin('tro-ly', `<p>${esc(r.error || 'Có lỗi, hãy thử lại.')}</p>`); r = null; }
    } catch (err) {
      // Không có máy chủ: tính trên máy, trả lời theo mẫu
      const kq = TroLy.tinh(cauHoi, h, homNay());
      r = { traLoi: TroLy.traLoiMau(kq).join('\n\n'), nguon: 'mau', duLieu: TroLy.tomTat(kq), ghiChu: 'Trang đang chạy không có máy chủ AI, đây là câu trả lời theo mẫu ghép từ dữ liệu đã tính.' };
    }
    if (r) {
      const nhan = r.nguon === 'ai' ? 'Trợ lý AI diễn giải từ dữ liệu hệ thống đã tính' : 'Trả lời theo mẫu, ghép từ dữ liệu hệ thống đã tính';
      const el = tin('tro-ly', `<span class="nguon-tl">${nhan}</span>${doan(r.traLoi)}${r.ghiChu ? `<p class="muted">${esc(r.ghiChu)}</p>` : ''}${bangDuLieu(r.duLieu || [])}`);
      el.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    dangHoi = false; $('gui').disabled = false; $('trang-thai').textContent = '';
  }
  $('f-hoi').addEventListener('submit', hoi);
  $('cau-hoi').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) hoi(e); });
})();
