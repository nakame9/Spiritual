/* Trang hợp đôi bản đồ sao (synastry): hai người, mỗi người ngày, giờ, nơi sinh. Chỉ tính khi bấm nút; không lưu, không gửi đi. */
(function () {
  'use strict';
  const { $, docNgay } = UI;
  const { VIET_NAM, THE_GIOI } = DiaDiem;
  const hai = n => String(n).padStart(2, '0');
  const noiOpt = `<optgroup label="Việt Nam">${VIET_NAM.map((x, i) => `<option value="vn-${i}">${x[0]}</option>`).join('')}</optgroup>
    <optgroup label="Nước ngoài">${THE_GIOI.map((x, i) => `<option value="tg-${i}">${x[0]}</option>`).join('')}</optgroup>`;
  const khoi = (p, ten) => `<fieldset><legend>${ten}</legend>
    <fieldset class="f"><legend>Ngày sinh (dương lịch)</legend><div class="date"><input type="text" inputmode="numeric" id="${p}d" maxlength="2" placeholder="Ngày" aria-label="Ngày sinh ${ten}"><i>/</i><input type="text" inputmode="numeric" id="${p}m" maxlength="2" placeholder="Tháng" aria-label="Tháng sinh ${ten}"><i>/</i><input type="text" inputmode="numeric" class="y" id="${p}y" maxlength="4" placeholder="Năm" aria-label="Năm sinh ${ten}"></div></fieldset>
    <fieldset class="f"><legend>Giờ sinh</legend><div class="date"><input type="text" inputmode="numeric" id="${p}h" maxlength="2" placeholder="Giờ" aria-label="Giờ sinh ${ten}"><i>:</i><input type="text" inputmode="numeric" id="${p}mi" maxlength="2" placeholder="Phút" aria-label="Phút sinh ${ten}"></div></fieldset>
    <label class="f"><span>Nơi sinh</span><select id="${p}noi">${noiOpt}</select></label>
    <label class="check"><input type="checkbox" id="${p}khong-gio">Không rõ giờ sinh</label></fieldset>`;
  $('hai-nguoi').innerHTML = khoi('a-', 'Người A') + khoi('b-', 'Người B');
  for (const p of ['a-', 'b-']) $(p + 'khong-gio').addEventListener('change', e => { ['h', 'mi'].forEach(id => { $(p + id).disabled = e.target.checked; if (e.target.checked) $(p + id).value = ''; }); });

  function lap(p, ten) {
    const khong = $(p + 'khong-gio').checked, n = docNgay(p, !khong);
    if (typeof n === 'string') return `${ten}: ${n}`;
    const v = $(p + 'noi').value, [noi, viDo, kinhDo, tz] = (v[0] === 'v' ? VIET_NAM : THE_GIOI)[Number(v.slice(3))];
    return { n, noi, khong, bd: ChiemTinh.banDoSao({ ...n, coGio: !khong, tz, viDo, kinhDo }) };
  }
  const tomTat = (x, ten) => `${ten}: ${hai(x.n.d)}/${hai(x.n.m)}/${x.n.y}${x.khong ? ' (không rõ giờ)' : ` lúc ${hai(x.n.h)}:${hai(x.n.mi)}`} tại ${x.noi}; Mặt Trời ${x.bd.bigThree.matTroi.tenCung}, Mặt Trăng ${x.bd.bigThree.matTrang.tenCung}${x.bd.cungMoc ? `, cung Mọc ${x.bd.cungMoc.tenCung}` : ''}`;

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const A = lap('a-', 'Người A'), B = lap('b-', 'Người B'), loi = typeof A === 'string' ? A : typeof B === 'string' ? B : '';
    $('loi').hidden = !loi; $('loi').textContent = loi;
    if (loi) return;
    const r = ChiemTinh.hopDoi(A.bd, B.bd);
    $('diem').innerHTML = `<b>${r.diem}%</b><span>${r.nhan}</span>`;
    $('tom-tat').textContent = `${tomTat(A, 'Người A')}. ${tomTat(B, 'Người B')}.${r.ghiChu ? ' ' + r.ghiChu : ''} Điểm chỉ để tham khảo.`;
    $('nhan-xet').innerHTML = r.nhanXet.map(x => `<li>${x}</li>`).join('');
    $('nguyen-to').innerHTML = r.nguyenTo.map(x => `<li><b>${x.ten}:</b> ${x.a} và ${x.b}, ${x.loi}.</li>`).join('');
    $('goc').innerHTML = r.gocChieu.length ? r.gocChieu.map(g => `<li class="${/tamHop|lucHop/.test(g.loai) ? 'hai-hoa' : /vuong|xung/.test(g.loai) ? 'cang' : ''}">${g.quanTrong ? '★ ' : ''}${g.loi} <span class="muted">(lệch ${g.sai}°)</span></li>`).join('')
      : '<li>Không có góc chiếu nào trong biên độ cho phép giữa các điểm cá nhân của hai người.</li>';
    $('kq').hidden = false;
    $('kq').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
})();
