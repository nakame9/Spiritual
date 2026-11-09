/* Trang lịch sử trải bài: danh sách các lần đã lưu, xem lại, sửa ghi chú, xóa, chọn hai lần để so sánh. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const { esc } = TarotLichSu, T = Tarot, { theLa } = LaBai;
  const ngayGio = s => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(s));
  let chonSS = []; // id các lần đang chọn để so sánh (tối đa 2)

  function veDs() {
    const ds = TarotLichSu.doc();
    chonSS = chonSS.filter(id => ds.some(x => x.id === id));
    $('trong').hidden = !!ds.length; $('ds-wrap').hidden = !ds.length;
    $('dem').textContent = ds.length ? `${ds.length} lần trải bài đã lưu.` : '';
    $('ds').innerHTML = ds.map(x => {
      const st = T.sacThai(x.chon), k = T.KIEU_TRAI[x.kieu];
      return `<li class="ls" data-id="${x.id}">
        <div class="ls-dau"><label class="check"><input type="checkbox" class="ss" value="${x.id}"${chonSS.includes(x.id) ? ' checked' : ''}${!chonSS.includes(x.id) && chonSS.length >= 2 ? ' disabled' : ''}>So sánh</label>
          <div><b>${k.ten} · ${T.CHU_DE[x.chuDe].ten}</b><span class="muted">${ngayGio(x.luc)} · ${st.nhan}, ${st.thuan}/${st.soLa} lá thuận</span></div></div>
        ${x.cauHoi ? `<p class="cau-hoi-kq"><b>Câu hỏi:</b> ${esc(x.cauHoi)}</p>` : ''}
        <div class="mini">${x.chon.map(c => `<span title="${T.BO_BAI[c.id].ten}${c.nguoc ? ' (ngược)' : ''}">${theLa(T.BO_BAI[c.id], c.nguoc, 'static')}</span>`).join('')}</div>
        <p class="muted">${x.chon.map((c, i) => `${k.viTri[i][0]}: ${T.BO_BAI[c.id].ten}${c.nguoc ? ' ngược' : ''}`).join(' · ')}</p>
        <label class="f"><span>Ghi chú cảm nhận</span><textarea class="gc" rows="2" maxlength="1000">${esc(x.ghiChu)}</textarea></label>
        <div class="actions"><button type="button" class="btn2 xem">Xem lại</button><button type="button" class="btn2 luu-gc">Lưu ghi chú</button><button type="button" class="btn2 xoa">Xóa</button><span class="muted tb" role="status"></span></div>
        <div class="reading xem-lai" hidden></div></li>`;
    }).join('');
    veSoSanh();
  }

  function veSoSanh() {
    const ds = TarotLichSu.doc(), [a, b] = chonSS.map(id => ds.find(x => x.id === id)).sort((x, y) => x.luc < y.luc ? -1 : 1);
    $('ss-goi-y').textContent = chonSS.length === 2 ? '' : `Đánh dấu "So sánh" ở ${2 - chonSS.length} lần trải bài${chonSS.length ? ' nữa' : ''} để so sánh.`;
    if (!b) { $('ss').innerHTML = ''; return; }
    const r = T.soSanh(a, b), cot = (x, s, nhan) => `<div class="ss-cot"><h3>${nhan}: ${ngayGio(x.luc)}</h3><p class="muted">${T.KIEU_TRAI[x.kieu].ten} · ${T.CHU_DE[x.chuDe].ten}${x.cauHoi ? ` · “${esc(x.cauHoi)}”` : ''}</p>
      <dl><dt>Sắc thái</dt><dd>${s.nhan} (${s.thuan}/${s.soLa} lá thuận)</dd><dt>Ẩn Chính</dt><dd>${s.anChinh} lá</dd><dt>Lá ngược</dt><dd>${s.nguoc} lá</dd><dt>Bộ nổi bật</dt><dd>${s.boNoiBat}</dd></dl>
      <p>${x.chon.map(c => `${T.BO_BAI[c.id].ten}${c.nguoc ? ' ngược' : ''}`).join(', ')}</p>${x.ghiChu ? `<p class="muted"><b>Ghi chú:</b> ${esc(x.ghiChu)}</p>` : ''}</div>`;
    $('ss').innerHTML = `<div class="ss-hai">${cot(a, r.a, 'Lần trước')}${cot(b, r.b, 'Lần sau')}</div>
      ${r.lapLai.length ? `<h3>Lá lặp lại</h3><ul>${r.lapLai.map(l => `<li><b>${l.ten}</b>: ${l.chieu}</li>`).join('')}</ul>` : ''}
      <h3>Nhận xét</h3><ul>${r.nhanXet.map(x => `<li>${x}</li>`).join('')}</ul>`;
  }

  $('ds').addEventListener('click', e => {
    const li = e.target.closest('li.ls'); if (!li) return;
    const id = li.dataset.id, x = TarotLichSu.doc().find(y => y.id === id), tb = li.querySelector('.tb');
    if (!x) return veDs();
    if (e.target.closest('.xem')) {
      const kq = li.querySelector('.xem-lai'), mo = kq.hidden;
      if (mo) kq.innerHTML = TarotLichSu.veKetQua(T.docBai(x.kieu, x.chon, x.chuDe, x.cauHoi));
      kq.hidden = !mo; e.target.textContent = mo ? 'Thu gọn' : 'Xem lại';
    } else if (e.target.closest('.luu-gc')) {
      tb.textContent = TarotLichSu.suaGhiChu(id, li.querySelector('.gc').value.trim()) ? 'Đã lưu ghi chú.' : 'Trình duyệt không cho lưu.';
      veSoSanh();
    } else if (e.target.closest('.xoa')) {
      if (e.target.dataset.chac !== '1') { e.target.dataset.chac = '1'; e.target.textContent = 'Bấm lần nữa để xóa'; return; } // xác nhận bằng bấm hai lần, không dùng hộp thoại
      TarotLichSu.xoa(id); veDs();
    }
  });
  $('ds').addEventListener('change', e => {
    if (!e.target.classList.contains('ss')) return;
    const id = e.target.value;
    chonSS = e.target.checked ? [...chonSS, id].slice(-2) : chonSS.filter(x => x !== id);
    veDs();
    if (chonSS.length === 2) $('h-ss').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
  veDs();
})();
