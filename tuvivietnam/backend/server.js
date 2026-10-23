// Máy chủ Tử Vi Việt Nam: API lập lá số + luận giải, và phục vụ luôn các trang trong ../frontend
const path = require('path');
const express = require('express');
// Dùng chung engine với frontend để trình duyệt và máy chủ luôn ra cùng một kết quả
const TuVi = require('../frontend/js/tuvi.js');
const LuanGiai = require('../frontend/js/luangiai.js');

const FRONTEND = path.join(__dirname, '..', 'frontend');
const app = express();
app.use(express.json({ limit: '10kb' }));

/** Kiểm tra dữ liệu gửi lên, trả về tham số cho TuVi.lapLaSo hoặc ném lỗi tiếng Việt */
function docVao(b) {
  const so = (k, min, max, ten) => {
    const v = Number(b[k]);
    if (!Number.isInteger(v) || v < min || v > max) throw new Error(`${ten} cần là số nguyên từ ${min} đến ${max}.`);
    return v;
  };
  if (b.gioiTinh !== 'nam' && b.gioiTinh !== 'nu') throw new Error('gioiTinh cần là "nam" hoặc "nu".');
  const amLich = b.amLich === true;
  return {
    ngay: so('ngay', 1, amLich ? 30 : 31, 'Ngày sinh'),
    thang: so('thang', 1, 12, 'Tháng sinh'),
    nam: so('nam', 1900, 2100, 'Năm sinh'),
    gio: so('gio', 1, 12, 'Giờ sinh (1 = Tý … 12 = Hợi)'),
    namGioi: b.gioiTinh === 'nam',
    amLich,
    nhuan: b.nhuan === true,
    ten: typeof b.ten === 'string' ? b.ten.trim().slice(0, 100) : '',
  };
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Lập lá số: trả về lá số đầy đủ và luận giải 12 cung (HTML từng cung)
app.post('/api/la-so', (req, res) => {
  let laSo;
  try {
    laSo = TuVi.lapLaSo(docVao(req.body || {}));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  const luanGiai = LuanGiai.THU_TU.map(ten => {
    const c = laSo.cung.find(x => x.ten === ten);
    return { cung: ten, so: c.so, chi: c.chi, html: LuanGiai.luanGiai(laSo, c.so) };
  });
  res.json({ laSo, luanGiai });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Không có API này.' }));
app.use(express.static(FRONTEND));

// Lỗi JSON hỏng hoặc lỗi bất ngờ: trả lời gọn, không lộ chi tiết máy chủ
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Dữ liệu gửi lên không phải JSON hợp lệ.' });
  console.error(err);
  res.status(500).json({ error: 'Máy chủ gặp lỗi.' });
});

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => console.log(`Tử Vi Việt Nam đang chạy tại http://localhost:${PORT}`));
}
module.exports = app;
