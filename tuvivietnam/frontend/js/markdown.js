/* Markdown rút gọn cho bài viết: đoạn văn, ## / ### tiêu đề, danh sách - và 1., **đậm**, *nghiêng*, [chữ](link).
 * Mọi HTML người viết gõ vào đều bị escape, nên nội dung từ trang quản trị không chèn được mã độc. */
(function (root) {
  'use strict';
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Chỉ nhận link http(s), đường dẫn trong site (/..., #..., trang .html) — chặn javascript: và các giao thức lạ
  const linkAnToan = u => /^(https?:\/\/|\/|#|[\w-]+\.html(#[\w-]*)?$)/i.test(u);

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

  function render(md) {
    const out = [];
    String(md || '').replace(/\r\n?/g, '\n').split(/\n{2,}/).forEach(khoi => {
      let dong = khoi.split('\n').filter(x => x.trim());
      const h = dong.length && /^(#{2,3})\s+(.*)$/.exec(dong[0]);
      if (h) { out.push(`<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`); dong = dong.slice(1); }
      if (!dong.length) return;
      if (dong.every(x => /^\s*[-*]\s+/.test(x))) { out.push(`<ul>${dong.map(x => `<li>${inline(x.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`); return; }
      if (dong.every(x => /^\s*\d+[.)]\s+/.test(x))) { out.push(`<ol>${dong.map(x => `<li>${inline(x.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`); return; }
      out.push(`<p>${dong.map(inline).join('<br>')}</p>`);
    });
    return out.join('\n');
  }

  const Markdown = { render };
  if (typeof module !== 'undefined' && module.exports) module.exports = Markdown; else root.Markdown = Markdown;
})(typeof window !== 'undefined' ? window : globalThis);
