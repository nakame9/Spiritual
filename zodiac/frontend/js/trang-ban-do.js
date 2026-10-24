/* Trang bản đồ sao: chỉ tính khi bấm nút. Thông tin sinh không lưu, không gửi đi. */
(function () {
  'use strict';
  const { $, theoId, HANH_TINH, NGUYEN_TO, TINH_CHAT, ky, nt, docNgay } = UI;
  const { VIET_NAM, THE_GIOI, MUI_GIO } = DiaDiem;
  const hai = n => String(n).padStart(2, '0');
  const doPhut = x => `${Math.floor(x)}°${hai(Math.floor((x % 1) * 60))}′`;
  const KY_GOC = { hop: '☌', lucHop: '⚹', tamHop: '△', vuong: '□', xung: '☍' };

  $('noi').innerHTML = `<optgroup label="Việt Nam">${VIET_NAM.map((x, i) => `<option value="vn-${i}">${x[0]}</option>`).join('')}</optgroup>
    <optgroup label="Nước ngoài">${THE_GIOI.map((x, i) => `<option value="tg-${i}">${x[0]}</option>`).join('')}</optgroup>
    <option value="khac">Nơi khác: tự nhập tọa độ</option>`;
  $('noi').value = 'vn-0';
  $('mui-gio').innerHTML = MUI_GIO.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  $('mui-gio').value = 'Asia/Bangkok';
  $('noi').addEventListener('change', () => { $('tu-nhap').hidden = $('noi').value !== 'khac'; });
  $('khong-gio').addEventListener('change', () => { ['h', 'mi'].forEach(id => { $(id).disabled = $('khong-gio').checked; if ($('khong-gio').checked) $(id).value = ''; }); });

  function noiSinh() {
    const v = $('noi').value;
    if (v !== 'khac') { const [ten, viDo, kinhDo, tz] = (v[0] === 'v' ? VIET_NAM : THE_GIOI)[Number(v.slice(3))]; return { ten, viDo, kinhDo, tz }; }
    const viDo = Number($('vi-do').value.replace(',', '.')), kinhDo = Number($('kinh-do').value.replace(',', '.'));
    if (!isFinite(viDo) || !isFinite(kinhDo) || $('vi-do').value.trim() === '' || $('kinh-do').value.trim() === '' || Math.abs(viDo) > 66 || Math.abs(kinhDo) > 180)
      return 'Vĩ độ cần từ -66 đến 66 và kinh độ từ -180 đến 180 (số thập phân, ví dụ 21.03).';
    return { ten: `${viDo.toFixed(2)}, ${kinhDo.toFixed(2)}`, viDo, kinhDo, tz: $('mui-gio').value };
  }

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const khongGio = $('khong-gio').checked, ngay = docNgay('', !khongGio), noi = noiSinh();
    const loi = typeof ngay === 'string' ? ngay : typeof noi === 'string' ? noi : '';
    $('loi').hidden = !loi; $('loi').textContent = loi;
    if (loi) return;
    const bd = ChiemTinh.banDoSao({ ...ngay, coGio: !khongGio, tz: noi.tz, viDo: noi.viDo, kinhDo: noi.kinhDo });
    ve(bd, ngay, noi, khongGio);
    $('kq').hidden = false;
    $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  function ve(bd, n, noi, khongGio) {
    $('tom-tat').textContent = `Sinh ngày ${hai(n.d)}/${hai(n.m)}/${n.y}${khongGio ? ' (không rõ giờ)' : ` lúc ${hai(n.h)}:${hai(n.mi)}`} tại ${noi.ten}, ${bd.thoiDiem.lech}.`;
    const b3 = bd.bigThree, the = (nhan, kyHieu, x, them) => {
      if (!x) return `<div class="b3"><span class="nhan">${nhan}</span><h3>Chưa xác định</h3><p>Cần giờ sinh và nơi sinh để biết cung Mọc, vì cung Mọc đổi khoảng 2 giờ một lần.</p></div>`;
      const c = theoId[x.cung];
      return `<div class="b3 ${nt(c)}"><span class="nhan">${kyHieu} ${nhan}</span><h3>${ky(c)}${c.ten}</h3>${them || ''}<p>${x.loi}</p><a class="links" href="cung.html#${c.id}" style="color: var(--tu); font-weight: 600; font-size: 14px">Về cung ${c.ten} →</a></div>`;
    };
    const tm = b3.matTrang.chuaChac ? `<p class="canh-bao">Hôm đó Mặt Trăng chuyển từ ${b3.matTrang.chuaChac[0]} sang ${b3.matTrang.chuaChac[1]}; cần giờ sinh để biết chắc.</p>` : '';
    $('big3').innerHTML = the('Mặt Trời: bản chất', HANH_TINH.matTroi.kyHieu, b3.matTroi) + the('Mặt Trăng: cảm xúc', HANH_TINH.matTrang.kyHieu, b3.matTrang, tm) + the('Cung Mọc: ấn tượng đầu tiên', '↑', b3.cungMoc);
    $('ket-hop').innerHTML = b3.ketHop.map(x => `<span>${x}</span>`).join('');

    $('vong').innerHTML = VeBanDo(bd);
    const dong = s => `<tr><td>${ky({ kyHieu: s.kyHieu })}${s.ten}</td><td class="${nt(theoId[s.cung])}"><span class="ky" style="color: var(--nt)">${theoId[s.cung].kyHieu}</span> ${s.tenCung}</td>
      <td class="do">${doPhut(s.doTrongCung)}${s.nghich ? '<span class="r" title="Nghịch hành">R</span>' : ''}${s.chuaChac ? ' <span class="muted">(?)</span>' : ''}</td><td>${s.nha || '–'}</td></tr>`;
    const truc = (ten, x, nha) => x ? `<tr><td><b>${ten}</b></td><td class="${nt(theoId[x.cung])}"><span class="ky" style="color: var(--nt)">${theoId[x.cung].kyHieu}</span> ${x.tenCung}</td><td class="do">${doPhut(x.doTrongCung)}</td><td>${nha}</td></tr>` : '';
    $('bang-sao').innerHTML = `<thead><tr><th>Thiên thể</th><th>Cung</th><th>Độ</th><th>Nhà</th></tr></thead><tbody>${bd.sao.map(dong).join('')}${truc('Cung Mọc (AC)', bd.cungMoc, 1)}${truc('Thiên đỉnh (MC)', bd.thienDinh, '–')}</tbody>`;
    $('ghi-chu-nha').textContent = bd.cungMoc ? 'Nhà tính theo hệ Whole Sign: cung Mọc là nhà 1, mỗi cung tiếp theo là một nhà. R là hành tinh nghịch hành. Vị trí tính theo hoàng đạo nhiệt đới, sai số dưới 1 phút cung.'
      : 'Không có giờ sinh nên chưa tính được cung Mọc và các nhà. Vị trí lấy lúc 12 giờ trưa; Mặt Trăng có thể lệch tới khoảng 6°. R là hành tinh nghịch hành.';

    $('giai-sao').innerHTML = bd.sao.map(s => `<li>${ky({ kyHieu: s.kyHieu })}${s.loi}</li>`).join('');
    $('giai-goc').innerHTML = bd.gocChieu.length ? bd.gocChieu.map(x => `<li class="${/tamHop|lucHop/.test(x.loai) ? 'hai-hoa' : /vuong|xung/.test(x.loai) ? 'cang' : ''}"><span class="ky" aria-hidden="true">${KY_GOC[x.loai]}&#xFE0E;</span>${x.loi} <span class="muted">(lệch ${x.sai}°)</span></li>`).join('')
      : '<li>Không có góc chiếu chính nào trong biên độ cho phép.</li>';

    const tong = o => Object.values(o).reduce((a, b) => a + b, 0), cot = (o, ten, lop) => `<div class="cot-nt">${Object.entries(o).map(([k, v]) =>
      `<div class="${lop ? lop + k : ''}"><span>${ten[k].ten}</span><div class="thanh"><i style="width:${Math.round(v / tong(o) * 100)}%"></i></div><b>${v}</b></div>`).join('')}</div>`;
    $('can-bang').innerHTML = cot(bd.canBang.nguyenTo, NGUYEN_TO, 'nt-') + cot(bd.canBang.tinhChat, TINH_CHAT, '');
    $('cb-loi').innerHTML = bd.canBang.loi.map(x => `<span>${x}</span>`).join('') + '<span class="muted">Điểm tính từ Mặt Trời, Mặt Trăng (2 điểm mỗi thiên thể), Sao Thủy đến Sao Thổ (1 điểm), và cung Mọc (2 điểm) nếu có giờ sinh.</span>';
  }
})();
