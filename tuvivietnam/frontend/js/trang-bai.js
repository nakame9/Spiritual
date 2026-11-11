/* Trang một bài viết: nút lưu yêu thích, đếm lượt đọc, tô mục lục theo đoạn đang đọc. */
(function () {
  'use strict';
  const nut = document.querySelector('.luu-bai'), slug = nut.dataset.slug;
  const ve = () => { const co = YeuThich.doc().includes(slug); nut.setAttribute('aria-pressed', String(co)); nut.textContent = co ? 'Đã lưu vào yêu thích' : 'Lưu vào yêu thích'; };
  nut.addEventListener('click', () => { YeuThich.doi(slug); ve(); });
  ve();
  YeuThich.demLuot(slug);

  // Mục lục: tô mục của đoạn đang đọc
  const links = [...document.querySelectorAll('.toc a')], muc = links.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window && muc.length) {
    const io = new IntersectionObserver(() => {
      const dang = muc.filter(m => m.getBoundingClientRect().top < innerHeight * 0.35).pop() || muc[0];
      links.forEach(a => a.setAttribute('aria-current', String(a.hash === '#' + dang.id)));
    }, { rootMargin: '0px 0px -60% 0px' });
    muc.forEach(m => io.observe(m));
  }
  // Nút lưu trên thẻ bài liên quan
  document.querySelectorAll('.lien-quan .the').forEach(li => li.querySelector('.luu').setAttribute('aria-pressed', String(YeuThich.doc().includes(li.dataset.slug))));
  document.querySelector('.lien-quan').addEventListener('click', e => {
    const b = e.target.closest('.luu'); if (!b) return;
    b.setAttribute('aria-pressed', String(YeuThich.doi(b.closest('.the').dataset.slug)));
  });
})();
