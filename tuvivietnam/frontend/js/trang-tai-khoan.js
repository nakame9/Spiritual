/* Hồ sơ của tôi: gom dữ liệu các trang đã lưu trong trình duyệt (localStorage), cho xem và xóa từng mục. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id), { esc } = ThuVien;
  const doc = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const ghi = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* trình duyệt chặn lưu trữ */ } };
  const CHI = ['', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const KHOA = ['laso-tuvi-input', 'laso-ho-so', 'tarot-lich-su', 'thu-vien-yeu-thich', 'tra-cuu-ho-so', 'congiap-chon'];
  const trong = (chu, link, nhan) => `<p class="trong-tk">${chu} <a href="${link}">${nhan}</a></p>`;

  function ve() {
    const v = doc('laso-tuvi-input'), t = doc('tra-cuu-ho-so');
    $('hs').innerHTML = v && v.namSinh ? `<ul class="ds-tk"><li><span>${v.nam ? 'Nam' : 'Nữ'}, sinh ${esc(v.ngay)}/${esc(v.thang)}/${esc(v.namSinh)}${v.am ? ' âm lịch' : ' dương lịch'}, giờ ${CHI[v.gio] || ''}<span class="muted">Dùng cho trang chủ, lá số, bản đồ sao</span></span><button type="button" class="nut-xoa" data-xoa="laso-tuvi-input">Xóa</button></li>
      ${t && t.y ? `<li><span>Hồ sơ tra cứu: ${esc(t.d)}/${esc(t.m)}/${esc(t.y)}${t.gioiTinh ? `, ${t.gioiTinh === 'nam' ? 'nam' : 'nữ'}` : ''}<span class="muted">Dùng cho ngũ hành, phong thủy, trợ lý</span></span><button type="button" class="nut-xoa" data-xoa="tra-cuu-ho-so">Xóa</button></li>` : ''}</ul>`
      : trong('Chưa có hồ sơ ngày sinh.', 'index.html#q-form', 'Lập hồ sơ vận mệnh');
    const ls = doc('laso-ho-so') || [];
    $('ls').innerHTML = ls.length ? `<ul class="ds-tk">${ls.map((x, i) => `<li><span>${esc(x.ten || 'Không tên')}<span class="muted">${x.nam ? 'Nam' : 'Nữ'}, ${esc(x.ngay)}/${esc(x.thang)}/${esc(x.namSinh)}${x.am ? ' âm lịch' : ''}, giờ ${CHI[x.gio] || ''}</span></span><button type="button" class="nut-xoa" data-ls="${i}">Xóa</button></li>`).join('')}</ul><p><a class="btn2" href="la-so.html">Mở trang lập lá số</a></p>`
      : trong('Chưa lưu lá số nào.', 'la-so.html', 'Lập lá số');
    const tr = doc('tarot-lich-su') || [];
    $('tr').innerHTML = tr.length ? `<p>${tr.length} lần trải bài đã lưu, gần nhất ngày ${new Date(tr[0].luc).toLocaleDateString('vi-VN')}.</p><p><a class="btn2" href="../../Tarot/frontend/lich-su.html">Xem lịch sử và ghi chú</a></p>`
      : trong('Chưa có lần trải bài nào được lưu.', '../../Tarot/frontend/index.html', 'Trải bài Tarot');
    const yt = (doc('thu-vien-yeu-thich') || []).map(s => ThuVien.BAI.find(b => b.slug === s)).filter(Boolean);
    $('yt').innerHTML = yt.length ? `<ul class="ds-tk">${yt.map(b => `<li><a href="${esc(ThuVien.duongDan(b))}">${esc(b.tieuDe)}</a><button type="button" class="nut-xoa" data-yt="${esc(b.slug)}">Bỏ lưu</button></li>`).join('')}</ul>`
      : trong('Chưa lưu bài nào.', 'bai-viet.html', 'Mở thư viện bài viết');
  }
  $('tk').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.xoa) ghi(b.dataset.xoa, null);
    if (b.dataset.ls) { const ds = doc('laso-ho-so') || []; ds.splice(Number(b.dataset.ls), 1); ghi('laso-ho-so', ds); }
    if (b.dataset.yt) ghi('thu-vien-yeu-thich', (doc('thu-vien-yeu-thich') || []).filter(s => s !== b.dataset.yt));
    ve();
  });
  // Xác nhận bằng bấm hai lần, không dùng hộp thoại
  $('xoa-het').addEventListener('click', e => {
    if (e.target.dataset.chac !== '1') { e.target.dataset.chac = '1'; e.target.textContent = 'Bấm lần nữa để xóa'; return; }
    KHOA.forEach(k => ghi(k, null)); e.target.dataset.chac = ''; e.target.textContent = 'Xóa tất cả dữ liệu trên máy này';
    $('tb').className = 'thanh-cong'; $('tb').textContent = 'Đã xóa toàn bộ dữ liệu trên máy này.'; ve();
  });
  ve();
})();
