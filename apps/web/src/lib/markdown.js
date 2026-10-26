/**
 * Minimal, dependency-free Markdown renderer for editorial article bodies.
 *
 * Content is authored by admins, but we still escape raw HTML before applying
 * formatting so a stray `<script>` in the CMS can never become stored XSS.
 */

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(text) {
  return text
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded-xl border border-line bg-paper-2 px-1 py-0.5 font-mono text-[0.88em] text-royal-dark">$1</code>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
}

export function renderArticleContent(markdown = '') {
  const lines = escapeHtml(markdown).replace(/\r\n/g, '\n').split('\n');
  const html = [];

  let paragraph = [];
  let listItems = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(
      `<p class="mt-3 leading-relaxed text-ink-soft">${renderInline(paragraph.join(' '))}</p>`
    );
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    html.push(
      `<ul class="mt-3 space-y-1.5 list-disc pl-5 text-ink-soft">${listItems
        .map((item) => `<li>${renderInline(item)}</li>`)
        .join('')}</ul>`
    );
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading3 = line.match(/^###\s+(.*)$/);
    if (heading3) {
      flushParagraph();
      flushList();
      html.push(
        `<h3 class="text-lg font-extrabold text-ink mt-6 mb-2">${renderInline(heading3[1])}</h3>`
      );
      continue;
    }

    const heading2 = line.match(/^##\s+(.*)$/);
    if (heading2) {
      flushParagraph();
      flushList();
      html.push(
        `<h2 class="text-2xl font-extrabold tracking-[-0.02em] text-ink mt-8 mb-3">${renderInline(heading2[1])}</h2>`
      );
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.*)$/);
    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();

  return html.join('');
}
