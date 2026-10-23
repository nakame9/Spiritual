/* Trang chủ cung hoàng đạo: xác định cung Mặt Trời, lưới 12 cung, nguyên tố và tính chất. */
(function () {
  'use strict';
  const { $, CUNG, NGUYEN_TO, TINH_CHAT, ngayNgan, chuTinh, ky, nt, nho, docNgay } = UI;

  $('luoi').innerHTML = CUNG.map(c => `<a class="cung-the ${nt(c)}" href="cung.html#${c.id}">${ky(c)}<b>${c.ten}</b><small>${ngayNgan(c)}</small>
    <span class="chip">${NGUYEN_TO[c.nguyenTo].ten} · ${chuTinh(c).split(' (')[0]}</span></a>`).join('');
  $('nguyen-to').innerHTML = Object.entries(NGUYEN_TO).map(([k, n]) => `<div class="nt-${k}"><h3>${n.ten}</h3><p class="muted">${n.moTa}</p>
    <p>${CUNG.filter(c => c.nguyenTo === k).map(c => `<a href="cung.html#${c.id}" style="color: var(--nt)">${c.ten}</a>`).join(', ')}</p></div>`).join('');
  $('tinh-chat').innerHTML = Object.entries(TINH_CHAT).map(([k, t]) => `<div><h3 style="color: var(--tu)">${t.ten}</h3><p class="muted">${t.moTa}</p>
    <p>${CUNG.filter(c => c.tinhChat === k).map(c => c.ten).join(', ')}</p></div>`).join('');

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const v = docNgay('', false);
    $('loi').hidden = typeof v !== 'string'; $('loi').textContent = typeof v === 'string' ? v : '';
    if (typeof v === 'string') return;
    const r = LuanGiai.xacDinhCung(v), c = r.cung;
    nho.dat(c.id);
    const nhanNgay = `${v.d}/${v.m}/${v.y}`;
    let ghiChu = '';
    if (r.giaoCung) ghiChu = `<p class="canh-bao">Ngày ${nhanNgay} là ngày giao cung: Mặt Trời chuyển từ ${r.giaoCung.truoc.ten} sang ${r.giaoCung.sau.ten} lúc ${r.giaoCung.luc} (giờ Việt Nam). Sinh trước giờ này là ${r.giaoCung.truoc.ten}, từ giờ này trở đi là ${r.giaoCung.sau.ten}. Nhập giờ sinh để biết chính xác.</p>`;
    else if (r.theoBang && r.theoBang.id !== c.id) ghiChu = `<p class="canh-bao">Theo bảng ngày phổ biến, ngày ${v.d}/${v.m} thuộc ${r.theoBang.ten}; nhưng năm ${v.y} Mặt Trời đổi cung lệch một chút, nên vị trí thật của Mặt Trời lúc bạn sinh nằm ở ${c.ten}.</p>`;
    $('kq').innerHTML = `${ghiChu}<div class="ket-qua-cung ${nt(c)}">${ky(c)}
      <h3>${c.ten} <span class="muted" style="font-family: var(--f-ui); font-size: 15px">${c.en}</span></h3>
      <p class="muted">${ngayNgan(c)} · ${NGUYEN_TO[c.nguyenTo].ten} · ${TINH_CHAT[c.tinhChat].ten} · ${chuTinh(c)}</p>
      <p>${c.tongQuan.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.')}</p>
      <div class="links"><a href="cung.html#${c.id}">Tính cách, tình yêu, sự nghiệp →</a><a href="tu-vi.html#${c.id}">Tử vi hôm nay →</a><a href="tuong-hop.html#a=${c.id}">Độ tương hợp →</a><a href="ban-do-sao.html">Bản đồ sao đầy đủ →</a></div></div>`;
  });
})();
