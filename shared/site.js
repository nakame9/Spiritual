/* Hành vi dùng chung của header: menu nhóm thả xuống, drawer trên điện thoại, ô tìm kiếm, trạng thái khi cuộn.
 * Không có JavaScript thì các liên kết vẫn dùng được: nút tìm kiếm mở trang tìm kiếm. */
(function () {
  'use strict';
  const site = document.querySelector('header.site');
  if (!site) return;
  const menu = site.querySelector('.menu'), moMenu = site.querySelector('.mo-menu'), oTim = site.querySelector('.o-tim'), moTim = site.querySelector('.mo-tim');
  const drawer = () => getComputedStyle(moMenu).display !== 'none';
  const nhom = [...site.querySelectorAll('.menu-muc > button')];

  // Trạng thái nền khi cuộn
  const cuon = () => site.toggleAttribute('data-cuon', scrollY > 4);
  addEventListener('scroll', cuon, { passive: true }); cuon();

  // Menu nhóm
  const dongNhom = tru => nhom.forEach(b => { if (b !== tru) b.setAttribute('aria-expanded', 'false'); });
  nhom.forEach(b => {
    const li = b.parentElement; let hen, moLuc = 0;
    // Chuột rê vào đã mở thì cú bấm ngay sau đó giữ menu mở, không đóng lại
    b.addEventListener('click', () => { const mo = b.getAttribute('aria-expanded') !== 'true' || Date.now() - moLuc < 600; if (!drawer()) dongNhom(b); b.setAttribute('aria-expanded', String(mo)); moLuc = 0; });
    li.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse' || drawer()) return; clearTimeout(hen); dongNhom(b); if (b.getAttribute('aria-expanded') !== 'true') moLuc = Date.now(); b.setAttribute('aria-expanded', 'true'); });
    li.addEventListener('pointerleave', e => { if (e.pointerType !== 'mouse' || drawer()) return; hen = setTimeout(() => b.setAttribute('aria-expanded', 'false'), 180); });
    li.addEventListener('focusout', e => { if (!drawer() && !li.contains(e.relatedTarget)) b.setAttribute('aria-expanded', 'false'); });
  });

  // Ô tìm kiếm
  function tim(mo) {
    oTim.hidden = !mo; moTim.setAttribute('aria-expanded', String(mo));
    if (mo) oTim.querySelector('input').focus();
  }
  moTim.setAttribute('aria-expanded', 'false'); moTim.setAttribute('aria-controls', 'o-tim'); oTim.id = 'o-tim';
  moTim.addEventListener('click', e => { e.preventDefault(); tim(oTim.hidden); });

  // Drawer trên điện thoại
  let truocDo = null;
  function drawerMo(mo) {
    site.toggleAttribute('data-mo', mo); moMenu.setAttribute('aria-expanded', String(mo));
    document.documentElement.style.overflow = mo ? 'hidden' : '';
    if (mo) {
      truocDo = document.activeElement; tim(false);
      const dangO = site.querySelector('.menu-muc.dang-o > button'); if (dangO) dangO.setAttribute('aria-expanded', 'true');
      site.querySelector('.dong-menu').focus();
    } else if (truocDo) truocDo.focus();
  }
  moMenu.addEventListener('click', () => drawerMo(true));
  site.querySelector('.dong-menu').addEventListener('click', () => drawerMo(false));
  site.querySelector('.menu-dong').addEventListener('click', () => drawerMo(false));
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !site.hasAttribute('data-mo')) return;
    const f = [...menu.querySelectorAll('a, button')].filter(x => x.offsetParent !== null), dau = f[0], cuoi = f[f.length - 1];
    if (e.shiftKey && document.activeElement === dau) { e.preventDefault(); cuoi.focus(); } else if (!e.shiftKey && document.activeElement === cuoi) { e.preventDefault(); dau.focus(); }
  });
  addEventListener('resize', () => { if (!drawer() && site.hasAttribute('data-mo')) drawerMo(false); });

  // Esc và bấm ra ngoài
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (site.hasAttribute('data-mo')) return drawerMo(false);
    if (!oTim.hidden) { tim(false); moTim.focus(); return; }
    const mo = nhom.find(b => b.getAttribute('aria-expanded') === 'true'); if (mo) { mo.setAttribute('aria-expanded', 'false'); mo.focus(); }
  });
  document.addEventListener('click', e => {
    if (!site.contains(e.target)) { if (!drawer()) dongNhom(); tim(false); }
    else if (!oTim.hidden && !oTim.contains(e.target) && !moTim.contains(e.target)) tim(false);
  });
})();
