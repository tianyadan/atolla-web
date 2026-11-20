import { Marked, type Tokens } from 'marked'

export type Heading = { id: string; text: string; depth: 2 | 3 }
export type Segment = { kind: 'html'; html: string } | { kind: 'demo'; name: string }

const DEMO_RE = /<!--\s*demo:([\w-]+)\s*-->/g

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/&[a-z]+;/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-') || 'section'
  )
}

/** 轻量语法着色：注释 / 字符串 / 选项 / 关键字，够用且不引入高亮库 */
function highlight(code: string, lang: string) {
  const esc = escapeHtml(code)
  if (!/^(bash|sh|shell|zsh|env|ini)$/.test(lang)) return esc
  return esc
    .split('\n')
    .map((line) => {
      if (/^\s*(#|\/\/)/.test(line)) return `<span class="tk-c">${line}</span>`
      return line
        .replace(/(&quot;.*?&quot;|'[^']*')/g, '<span class="tk-s">$1</span>')
        .replace(/(^|\s)(--?[a-zA-Z][\w-]*)/g, '$1<span class="tk-o">$2</span>')
        .replace(/^(\s*)([A-Z][A-Z0-9_]{2,})(=)/, '$1<span class="tk-k">$2</span>$3')
        .replace(/^(\s*)(\$ )/, '$1<span class="tk-p">$2</span>')
    })
    .join('\n')
}

const CALLOUT: Record<string, string> = { NOTE: 'note', TIP: 'tip', WARNING: 'warning', IMPORTANT: 'important' }

/** 解析整页 Markdown：返回 HTML / Demo 片段和 H2/H3 目录 */
export function renderDoc(src: string, labels: { copy: string; callouts: Record<string, string> }) {
  const headings: Heading[] = []
  const seen = new Map<string, number>()
  const md = new Marked({ gfm: true })

  md.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens)
        const base = slugify(token.text)
        const n = seen.get(base) ?? 0
        seen.set(base, n + 1)
        const id = n ? `${base}-${n}` : base
        if (token.depth === 2 || token.depth === 3) {
          headings.push({ id, text: inner.replace(/<[^>]+>/g, ''), depth: token.depth })
        }
        return `<h${token.depth} id="${id}"><a class="md-anchor" href="#${id}" aria-hidden="true">#</a>${inner}</h${token.depth}>\n`
      },
      code(token: Tokens.Code) {
        const lang = (token.lang || 'text').trim().split(/\s+/)[0].toLowerCase()
        return `<div class="md-code"><div class="md-code__bar"><span>${escapeHtml(lang)}</span><button type="button" class="md-copy">${escapeHtml(labels.copy)}</button></div><pre><code class="lang-${escapeHtml(lang)}">${highlight(token.text, lang)}</code></pre></div>\n`
      },
      blockquote(this: { parser: { parse: (t: Tokens.Generic[]) => string } }, token: Tokens.Blockquote) {
        const body = this.parser.parse(token.tokens)
        const m = body.match(/^<p>\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*/)
        if (m) {
          const kind = CALLOUT[m[1]]
          const rest = body.replace(m[0], '<p>')
          return `<div class="md-callout md-callout--${kind}"><div class="md-callout__title">${escapeHtml(labels.callouts[kind] ?? kind)}</div>${rest.replace(/^<p><\/p>\n?/, '')}</div>\n`
        }
        return `<blockquote>${body}</blockquote>\n`
      },
    },
  })

  const segments: Segment[] = []
  let last = 0
  const parts: Array<{ text?: string; demo?: string }> = []
  for (const m of src.matchAll(DEMO_RE)) {
    parts.push({ text: src.slice(last, m.index) })
    parts.push({ demo: m[1] })
    last = (m.index ?? 0) + m[0].length
  }
  parts.push({ text: src.slice(last) })

  for (const p of parts) {
    if (p.demo) segments.push({ kind: 'demo', name: p.demo })
    else if (p.text && p.text.trim()) {
      const html = (md.parse(p.text) as string)
        .replace(/<table>/g, '<div class="md-table"><table>')
        .replace(/<\/table>/g, '</table></div>')
      segments.push({ kind: 'html', html })
    }
  }
  return { segments, headings }
}

/** 纯文本，用于搜索 */
export function plainText(src: string) {
  return src.replace(DEMO_RE, ' ').replace(/[`*_>#|-]/g, ' ').toLowerCase()
}
