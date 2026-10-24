// Máy chủ Tarot: API rút bài, tra 78 lá, và phục vụ luôn các trang trong ../frontend
const path = require('path');
const express = require('express');
// Dùng chung bộ bài với frontend để trang web và API luôn giống nhau
const Tarot = require('../frontend/js/bo-bai.js');

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));

// API công khai, cho phép gọi từ trang khác (ví dụ frontend đặt ở GitHub Pages)
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method !== 'OPTIONS') return next();
  res.set({ 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.sendStatus(204);
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
// Không có tham số thì trả cả bộ; ?q= tìm không dấu theo tên, tên tiếng Anh, từ khóa; ?nhom=anChinh|gay|coc|kiem|tien
app.get('/api/bo-bai', (req, res) => {
  const { q = '', nhom = '' } = req.query;
  if (typeof q !== 'string' || q.length > 100) return res.status(400).json({ error: 'q cần là chuỗi tối đa 100 ký tự.' });
  if (nhom && !Tarot.NHOM.includes(nhom)) return res.status(400).json({ error: `nhom cần là ${Tarot.NHOM.join(', ')}.` });
  res.json(Tarot.timLa(q, nhom));
});
app.get('/api/la-bai/:id', (req, res) => {
  const id = Number(req.params.id), la = Number.isInteger(id) && Tarot.BO_BAI[id];
  if (!la) return res.status(404).json({ error: 'Không có lá bài này (id từ 0 đến 77).' });
  res.json(la);
});
app.get('/api/kieu-trai', (req, res) => res.json(Tarot.KIEU_TRAI));
app.get('/api/chu-de', (req, res) => res.json(Object.fromEntries(Object.entries(Tarot.CHU_DE).map(([k, c]) => [k, { ten: c.ten, moTa: c.moTa }]))));

// Rút bài: máy chủ xáo cả bộ rồi lấy các lá trên cùng theo kiểu trải
app.post('/api/rut-bai', (req, res) => {
  const b = req.body || {}, kieu = b.kieu || '3la', chuDe = b.chuDe || 'tongquan';
  if (!Tarot.KIEU_TRAI[kieu]) return res.status(400).json({ error: `kieu cần là ${Object.keys(Tarot.KIEU_TRAI).join(', ')}.` });
  if (!Object.prototype.hasOwnProperty.call(Tarot.CHU_DE, chuDe)) return res.status(400).json({ error: `chuDe cần là ${Object.keys(Tarot.CHU_DE).join(', ')}.` });
  if (b.nguoc !== undefined && typeof b.nguoc !== 'boolean') return res.status(400).json({ error: 'nguoc cần là true hoặc false.' });
  const n = Tarot.KIEU_TRAI[kieu].viTri.length;
  const ketQua = Tarot.docBai(kieu, Tarot.xaoBai(b.nguoc !== false).slice(0, n), chuDe);
  res.json(ketQua);
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Không có API này.' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/shared', express.static(path.join(__dirname, '..', '..', 'shared'))); // CSS dùng chung của cả site

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Dữ liệu gửi lên không phải JSON hợp lệ.' });
  console.error(err);
  res.status(500).json({ error: 'Máy chủ gặp lỗi.' });
});

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3001;
  app.listen(PORT, () => console.log(`Tarot đang chạy tại http://localhost:${PORT}`));
}
module.exports = app;
