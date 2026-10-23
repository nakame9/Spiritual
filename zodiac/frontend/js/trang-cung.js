/* Trang chi tiết một cung: cung.html#bach-duong. Tổng quan, tính cách, tình yêu, sự nghiệp, Mặt Trăng và cung Mọc, tử vi hôm nay. */
(function () {
  'use strict';
  const { $, CUNG, theoId, NGUYEN_TO, TINH_CHAT, sao, ngayNgan, chuTinh, ky, nt, nho, homNay } = UI;
  const MUC = [['s-tinh-cach', 'Tính cách'], ['s-tinh-yeu', 'Tình yêu'], ['s-su-nghiep', 'Sự nghiệp'], ['s-trang-moc', 'Mặt Trăng và cung Mọc'], ['s-tu-vi', 'Tử vi hôm nay']];
  $('toc').innerHTML = MUC.map(([id, t]) => `<button type="button" data-den="${id}">${t}</button>`).join('');
  $('toc').addEventListener('click', e => { const b = e.target.closest('button'); if (b) $(b.dataset.den).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  const ds = (xs, lop) => `<ul${lop ? ` class="${lop}"` : ''}>${xs.map(x => `<li>${x}</li>`).join('')}</ul>`;

  function ve() {
    const id = theoId[location.hash.slice(1)] ? location.hash.slice(1) : (nho.lay() || 'bach-duong'), c = theoId[id], s = c.so;
    nho.dat(id);
    document.title = `${c.ten} (${c.en}) · Cung hoàng đạo · Lá Số Tử Vi`;
    $('chon').innerHTML = CUNG.map(x => `<a class="${nt(x)}" href="#${x.id}"${x.id === id ? ' aria-current="page"' : ''}>${ky(x)}${x.ten}</a>`).join('');
    $('dau').className = `dau-cung ${nt(c)}`;
    $('dau').innerHTML = `${ky(c)}<p class="eyebrow"><a href="index.html">Cung hoàng đạo</a> · ${ngayNgan(c)}</p><h1>${c.ten}</h1>
      <p class="phu">${c.en}${c.tenKhac ? ` · còn gọi là ${c.tenKhac}` : ''} · ${c.tuKhoa}</p>`;
    const facts = [['Biểu tượng', c.bieuTuong], ['Nguyên tố', NGUYEN_TO[c.nguyenTo].ten], ['Tính chất', `${TINH_CHAT[c.tinhChat].ten} (${TINH_CHAT[c.tinhChat].moTa})`],
      ['Hành tinh chủ quản', chuTinh(c)], ['Âm dương', c.amDuong], ['Ngày trong tuần', c.thu], ['Bộ phận cơ thể', c.coThe], ['Màu hợp', c.mau], ['Đá hợp', c.da]];
    $('facts').innerHTML = facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('tong-quan').textContent = c.tongQuan;

    $('s-tinh-cach').innerHTML = `<h2 id="h-tc">Tính cách ${c.ten}</h2>
      <div class="hai-cot"><div class="o-nho manh"><h3>Điểm mạnh</h3>${ds(c.diemManh)}</div><div class="o-nho yeu"><h3>Điểm yếu</h3>${ds(c.diemYeu)}</div></div>
      <div class="hai-cot"><div class="o-nho"><h3>Xu hướng giao tiếp</h3><p>${c.giaoTiep}</p></div><div class="o-nho"><h3>Cảm xúc</h3><p>${c.camXuc}</p></div></div>`;

    const hop = CUNG.filter(x => x.id !== id).map(x => ({ x, d: ChiemTinh.tuongHop(s, x.so).diem.tinhYeu })).sort((a, b) => b.d - a.d);
    const the = ({ x, d }) => `<a class="${nt(x)}" href="tuong-hop.html#a=${id}&b=${x.id}">${ky(x)}${x.ten} <b>${d}%</b></a>`;
    $('s-tinh-yeu').innerHTML = `<h2 id="h-ty">Tình yêu và mối quan hệ</h2><p class="doan">${c.tinhYeu.phongCach}</p>
      <div class="hai-cot"><div class="o-nho"><h3>Trong tình yêu, ${c.ten} cần</h3><p>${c.tinhYeu.canGi}</p></div><div class="o-nho"><h3>Điều nên lưu ý</h3><p>${c.tinhYeu.luuY}</p></div></div>
      <div class="hai-cot"><div><h3 class="muted" style="margin: 0 0 8px">Dễ hợp nhất</h3><div class="hop-list">${hop.slice(0, 3).map(the).join('')}</div></div>
      <div><h3 class="muted" style="margin: 0 0 8px">Cần vun đắp nhiều hơn</h3><div class="hop-list">${hop.slice(-2).map(the).join('')}</div></div></div>`;

    $('s-su-nghiep').innerHTML = `<h2 id="h-sn">Sự nghiệp và công việc</h2><p class="doan">${c.suNghiep.dacDiem}</p>
      <div class="hai-cot"><div class="o-nho"><h3>Kỹ năng nổi bật</h3>${ds(c.suNghiep.kyNang)}</div><div class="o-nho"><h3>Môi trường phù hợp</h3><p>${c.suNghiep.moiTruong}</p></div></div>
      <div><h3 class="muted" style="margin: 0 0 8px">Nghề nghiệp gợi ý theo truyền thống chiêm tinh</h3><div class="nghe">${c.suNghiep.nghe.map(x => `<span>${x}</span>`).join('')}</div></div>`;

    $('s-trang-moc').innerHTML = `<h2 id="h-tm">Khi Mặt Trăng hoặc cung Mọc ở ${c.ten}</h2>
      <p class="muted">Không chỉ cung Mặt Trời: Mặt Trăng và cung Mọc ở ${c.ten} cũng mang màu sắc của cung này. <a href="ban-do-sao.html" style="color: var(--tu)">Lập bản đồ sao</a> để biết Mặt Trăng và cung Mọc của bạn.</p>
      <div class="hai-cot"><div class="o-nho"><h3>Mặt Trăng ở ${c.ten}</h3><p>${c.matTrang}</p></div><div class="o-nho"><h3>Cung Mọc ${c.ten}</h3><p>${c.cungMoc}</p></div></div>`;

    const n = homNay(), tv = ChiemTinh.tuViNgay(s, n.y, n.m, n.d);
    $('s-tu-vi').innerHTML = `<h2 id="h-tv">Tử vi hôm nay, ${tv.thu} ${tv.ngay}</h2><p class="chu-de">${tv.chuDe}</p>
      <div class="lv-grid">${tv.linhVuc.map(l => `<div class="lv"><div class="lv-dau"><b>${l.ten}</b>${sao(l.sao)}</div><p>${l.loi}</p></div>`).join('')}</div>
      <p class="links"><a href="tu-vi.html#${id}">Xem tử vi tuần, tháng, năm của ${c.ten} →</a></p>`;
  }
  addEventListener('hashchange', () => { ve(); scrollTo({ top: 0 }); });
  ve();
})();
