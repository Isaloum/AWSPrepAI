/**
 * MarkdownRenderer.tsx
 * Lightweight markdown renderer for AI Coach responses.
 * Handles: headers, bold, italic, inline code, code blocks, bullet lists, numbered lists, line breaks.
 * No external dependencies.
 */

interface Props {
  content: string
  style?: React.CSSProperties
}

export default function MarkdownRenderer({ content, style }: Props) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // ── Code block ─────────────────────────────────────────────────────────
    if (line.trimStart().startsWith('```')) {
      const lang = line.replace(/^```/, '').trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre
          key={i}
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            overflowX: 'auto',
            margin: '0.5rem 0',
            fontSize: '0.8rem',
            lineHeight: 1.6,
          }}
        >
          {lang && (
            <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', marginBottom: '4px' }}>
              {lang}
            </span>
          )}
          <code style={{ color: '#93c5fd', fontFamily: 'monospace' }}>
            {codeLines.join('\n')}
          </code>
        </pre>
      )
      i++
      continue
    }

    // ── H1 ─────────────────────────────────────────────────────────────────
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={i} style={{ color: '#f1f5f9', fontSize: '1.05rem', fontWeight: 800, margin: '0.75rem 0 0.25rem', lineHeight: 1.3 }}>
          {renderInline(line.slice(2))}
        </h2>
      )
      i++; continue
    }

    // ── H2 ─────────────────────────────────────────────────────────────────
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 700, margin: '0.65rem 0 0.2rem', lineHeight: 1.3 }}>
          {renderInline(line.slice(3))}
        </h3>
      )
      i++; continue
    }

    // ── H3 ─────────────────────────────────────────────────────────────────
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} style={{ color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 700, margin: '0.5rem 0 0.15rem', lineHeight: 1.3 }}>
          {renderInline(line.slice(4))}
        </h4>
      )
      i++; continue
    }

    // ── Bullet list ────────────────────────────────────────────────────────
    if (/^(\s*[-*+])\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^(\s*[-*+])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*[-*+])\s+/, ''))
        i++
      }
      elements.push(
        <ul key={i} style={{ margin: '0.35rem 0', paddingLeft: '1.25rem', color: '#e2e8f0' }}>
          {items.map((item, j) => (
            <li key={j} style={{ marginBottom: '0.2rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // ── Numbered list ──────────────────────────────────────────────────────
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      elements.push(
        <ol key={i} style={{ margin: '0.35rem 0', paddingLeft: '1.25rem', color: '#e2e8f0' }}>
          {items.map((item, j) => (
            <li key={j} style={{ marginBottom: '0.2rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      )
      continue
    }

    // ── Horizontal rule ────────────────────────────────────────────────────
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />)
      i++; continue
    }

    // ── Empty line ─────────────────────────────────────────────────────────
    if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: '0.4rem' }} />)
      i++; continue
    }

    // ── Normal paragraph ───────────────────────────────────────────────────
    elements.push(
      <p key={i} style={{ margin: '0.1rem 0', fontSize: '0.875rem', lineHeight: 1.65, color: '#e2e8f0' }}>
        {renderInline(line)}
      </p>
    )
    i++
  }

  return <div style={{ ...style }}>{elements}</div>
}

/** Render inline markdown: **bold**, *italic*, `code` */
function renderInline(text: string): React.ReactNode {
  // Split on bold (**), italic (*), and inline code (`)
  const parts: React.ReactNode[] = []
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    // text before match
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    if (match[0].startsWith('**')) {
      parts.push(<strong key={match.index} style={{ color: '#f1f5f9', fontWeight: 700 }}>{match[2]}</strong>)
    } else if (match[0].startsWith('*')) {
      parts.push(<em key={match.index} style={{ color: '#cbd5e1' }}>{match[3]}</em>)
    } else if (match[0].startsWith('`')) {
      parts.push(
        <code
          key={match.index}
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: '1px 5px',
            fontFamily: 'monospace',
            fontSize: '0.82em',
            color: '#93c5fd',
          }}
        >
          {match[4]}
        </code>
      )
    }
    last = match.index + match[0].length
  }

  if (last < text.length) {
    parts.push(text.slice(last))
  }

  return parts.length === 1 ? parts[0] : parts
}
