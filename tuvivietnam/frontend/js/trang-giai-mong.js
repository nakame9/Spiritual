/* Trang Giải mộng: tìm biểu tượng trong mô tả hoặc từ khóa chọn sẵn, hiện diễn giải phổ biến, góc nhìn tâm lý, câu hỏi tự chiêm nghiệm. */
(function () {
  'use strict';
  const { $, esc } = TraCuu, G = GiaiMong;
  const chon = new Set();
  $('tu-khoa').innerHTML = G.BIEU_TUONG.map(b => `<button type="button" data-ma="${b.ma}" aria-pressed="false">${esc(b.ten)}</button>`).join('');
  $('tu-khoa').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    chon.has(b.dataset.ma) ? chon.delete(b.dataset.ma) : chon.add(b.dataset.ma);
    b.setAttribute('aria-pressed', String(chon.has(b.dataset.ma)));
  });

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const moTa = $('mo-ta').value.trim(), ds = G.tim(moTa, [...chon]), cx = $('cam-xuc').value, lap = $('lap-lai').checked;
    if (!moTa && !chon.size) { $('loi').textContent = 'Hãy mô tả giấc mơ hoặc chọn ít nhất một từ khóa.'; $('loi').hidden = false; return; }
    $('loi').hidden = true;
    const chung = [cx && G.CAM_XUC[cx], lap && G.LAP_LAI].filter(Boolean);
    $('kq').innerHTML = `<section class="panel" aria-labelledby="h-bt"><h2 id="h-bt">Biểu tượng xuất hiện</h2>
        ${ds.length ? `<p class="doan">Tìm thấy ${ds.length} biểu tượng: ${ds.map(b => `<b>${esc(b.ten)}</b>${b.tuKhoaKhop.length ? ` (từ “${esc(b.tuKhoaKhop[0])}”)` : ''}`).join(', ')}.</p>`
          : '<p class="doan">Chưa nhận ra biểu tượng nào trong mô tả. Thử viết rõ hơn những hình ảnh chính (con vật, nơi chốn, hành động), gõ có dấu, hoặc chọn từ khóa bên trên.</p>'}
        ${chung.map(x => `<p class="canh-bao">${x}</p>`).join('')}</section>
      ${ds.map(b => `<section class="panel bieu-tuong" aria-labelledby="h-${b.ma}"><h2 id="h-${b.ma}">${esc(b.ten)}</h2>
        <p class="doan">${b.bieuTuong}</p>
        <div class="ba-goc">
          <div><h4>Các cách diễn giải phổ biến</h4><ul>${b.danGian.map(x => `<li>${x}</li>`).join('')}</ul></div>
          <div><h4>Góc nhìn tâm lý</h4><p>${b.tamLy}</p></div>
          <div><h4>Câu hỏi tự chiêm nghiệm</h4><ol>${b.cauHoi.map(x => `<li>${x}</li>`).join('')}</ol></div>
        </div></section>`).join('')}
      <section class="panel" aria-labelledby="h-luu"><h2 id="h-luu">Đọc giấc mơ thế nào</h2>
        <p class="doan">Các cách diễn giải dân gian khác nhau giữa các vùng, có khi trái ngược nhau (mơ đám tang là điềm tốt ở nơi này, điềm xấu ở nơi khác), nên không thể dùng để đoán trước sự việc. Giấc mơ hữu ích nhất khi được đọc như tấm gương: nó cho thấy bạn đang lo gì, mong gì, cảm thấy thế nào. Hãy ghi lại giấc mơ ngay khi thức dậy, kèm cảm xúc, rồi xem nó liên quan tới chuyện gì đang diễn ra trong đời bạn.</p></section>`;
    $('kq').hidden = false;
    $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
})();
