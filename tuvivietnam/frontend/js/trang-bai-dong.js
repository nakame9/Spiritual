/* Trang đọc bài viết đăng từ trang quản trị: bai-viet-doc.html#slug. Nội dung HTML do backend dựng từ markdown (đã chặn mã độc). */
(function () {
  'use strict';
  const $ = id => document.getElementById(id), { esc, CM, CHUYEN_MUC, slugHoa } = ThuVien;
  const slug = decodeURIComponent(location.hash.slice(1));
  const tinh = ThuVien.BAI.find(b => b.slug === slug || (b.cu || []).includes(slug));
  if (tinh) { location.replace(`bai-viet/${tinh.slug}.html`); return; }
  const loi = t => { $('tieu-de').textContent = 'Không mở được bài viết'; $('mo-ta').textContent = t; document.querySelector('.layout').hidden = true; };
  if (!slug) return loi('Đường dẫn thiếu tên bài.');

  layApi('/api/bai-viet/' + encodeURIComponent(slug)).then(b => {
    const cmId = (CHUYEN_MUC.find(c => slugHoa(c.ten) === slugHoa(b.chuyenMuc)) || CM['kien-thuc']).id;
    const bai = { slug: b.slug, tieuDe: b.tieuDe, moTa: b.tomTat, chuyenMuc: cmId, the: [], dong: true };
    document.title = `${b.tieuDe} · Lá Số Tử Vi`;
    $('cm').textContent = b.chuyenMuc; $('dd-cm').textContent = CM[cmId].ten; $('dd-cm').href = `bai-viet.html#cm=${cmId}`;
    $('tieu-de').textContent = b.tieuDe; $('mo-ta').textContent = b.tomTat || '';
    const ngay = (b.suaLuc || b.taoLuc || '').slice(0, 10);
    $('meta').innerHTML = `${b.tacGia ? `${esc(b.tacGia)} · ` : ''}Cập nhật <time datetime="${esc(ngay)}">${ThuVien.ngayVN(ngay)}</time> · ${b.phutDoc} phút đọc`;
    $('anh').innerHTML = ThuVien.anhBia(bai);
    // Backend dựng ## thành h3 (dùng chung với trang chủ); ở trang riêng thì nâng lên h2 và gắn id cho mục lục
    const t = document.createElement('template'); t.innerHTML = b.html;
    t.content.querySelectorAll('h3, h4').forEach(h => { const m = document.createElement(h.tagName === 'H3' ? 'h2' : 'h3'); m.innerHTML = h.innerHTML; if (m.tagName === 'H2') m.id = slugHoa(m.textContent); h.replaceWith(m); });
    $('noi-dung').replaceChildren(t.content);
    const muc = [...$('noi-dung').querySelectorAll('h2[id]')];
    if (muc.length) $('toc').insertAdjacentHTML('beforeend', muc.map(h => `<a href="#${h.id}">${esc(h.textContent)}</a>`).join('')); else $('toc').hidden = true;
    // Bài liên quan: so nội dung với thư viện
    bai.noiDung = $('noi-dung').textContent;
    $('lq').innerHTML = ThuVien.lienQuan(bai, ThuVien.BAI, 3).map(x => ThuVien.theBai(x, '', YeuThich.doc().includes(x.slug))).join('');
    const nut = document.querySelector('.luu-bai'); nut.hidden = false; nut.dataset.slug = b.slug;
    const ve = () => { const co = YeuThich.doc().includes(b.slug); nut.setAttribute('aria-pressed', String(co)); nut.textContent = co ? 'Đã lưu vào yêu thích' : 'Lưu vào yêu thích'; };
    nut.addEventListener('click', () => { YeuThich.doi(b.slug); ve(); }); ve();
    YeuThich.demLuot(b.slug);
  }).catch(() => loi('Bài viết không tồn tại, hoặc trang đang chạy không có máy chủ (bài đăng từ trang quản trị cần backend). Xem các bài trong thư viện.'));
  $('lq').addEventListener('click', e => { const b = e.target.closest('.luu'); if (b) b.setAttribute('aria-pressed', String(YeuThich.doi(b.closest('.the').dataset.slug))); });
  addEventListener('hashchange', () => location.reload());
})();
