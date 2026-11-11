/* Markdown rút gọn cho bài viết: đoạn văn, ## / ### tiêu đề, danh sách - và 1., bảng | a | b |, **đậm**, *nghiêng*, [chữ](link).
 * Mọi HTML người viết gõ vào đều bị escape, nên nội dung từ trang quản trị không chèn được mã độc. */
(function (root) {
  'use strict';
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Chỉ nhận link http(s), đường dẫn trong site (/..., #..., trang .html, kể cả ../thu-muc/trang.html) — chặn javascript: và các giao thức lạ
  const linkAnToan = u => /^(https?:\/\/|\/|#|(\.\.\/)*[\w-]+(\/[\w-]+)*\.html(#[\w=&-]*)?$)/i.test(u);

  function inline(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, chu, url) => {
        const goc = url.replace(/&amp;/g, '&');
        if (!linkAnToan(goc)) return chu;
        const ngoai = /^https?:/i.test(goc);
        return `<a href="${url}"${ngoai ? ' target="_blank" rel="noopener noreferrer"' : ''}>${chu}</a>`;
      })
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>');
  }

  const slug = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').split(/[^a-z0-9]+/).filter(Boolean).join('-');
  /** opts.capDau = 2: ## thành <h2 id> (trang bài viết riêng); mặc định ## thành <h3> (bài nằm trong trang khác) */
  function render(md, opts = {}) {
    const out = [], lech = opts.capDau ? opts.capDau - 2 : 1;
    String(md || '').replace(/\r\n?/g, '\n').split(/\n{2,}/).forEach(khoi => {
      let dong = khoi.split('\n').filter(x => x.trim());
      const h = dong.length && /^(#{2,3})\s+(.*)$/.exec(dong[0]);
      if (h) { const c = h[1].length + lech; out.push(`<h${c}${opts.capDau && h[1].length === 2 ? ` id="${slug(h[2])}"` : ''}>${inline(h[2])}</h${c}>`); dong = dong.slice(1); }
      if (!dong.length) return;
      if (dong.length > 1 && dong.every(x => /^\s*\|.*\|\s*$/.test(x))) {
        const o = x => x.trim().slice(1, -1).split('|').map(c => inline(c.trim()));
        const than = dong.slice(1).filter(x => !/^\s*\|[\s|:-]+\|\s*$/.test(x));
        out.push(`<div class="table-wrap"><table><thead><tr>${o(dong[0]).map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${than.map(x => `<tr>${o(x).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); return;
      }
      if (dong.every(x => /^\s*[-*]\s+/.test(x))) { out.push(`<ul>${dong.map(x => `<li>${inline(x.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`); return; }
      if (dong.every(x => /^\s*\d+[.)]\s+/.test(x))) { out.push(`<ol>${dong.map(x => `<li>${inline(x.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`); return; }
      out.push(`<p>${dong.map(inline).join('<br>')}</p>`);
    });
    return out.join('\n');
  }

  const Markdown = { render };
  if (typeof module !== 'undefined' && module.exports) module.exports = Markdown; else root.Markdown = Markdown;
})(typeof window !== 'undefined' ? window : globalThis);
