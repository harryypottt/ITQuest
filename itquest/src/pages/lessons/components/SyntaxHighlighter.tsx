import { useMemo } from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

const KEYWORDS: Record<string, string[]> = {
  html: ['<!DOCTYPE', 'html', 'head', 'meta', 'title', 'body', 'header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'form', 'input', 'label', 'select', 'option', 'textarea', 'button', 'br', 'hr', 'strong', 'em', 'code', 'pre', 'blockquote', 'link', 'script', 'style', 'picture', 'source', 'video', 'audio', 'iframe'],
  javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'throw', 'finally', 'typeof', 'instanceof', 'void', 'delete', 'in', 'of', 'yield', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity', 'console', 'require', 'module'],
  css: ['@media', '@import', '@keyframes', '@font-face', 'display', 'flex', 'grid', 'position', 'absolute', 'relative', 'fixed', 'sticky', 'static', 'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'margin', 'padding', 'border', 'border-radius', 'background', 'color', 'font-size', 'font-weight', 'font-family', 'line-height', 'text-align', 'text-decoration', 'text-transform', 'overflow', 'opacity', 'transform', 'transition', 'animation', 'z-index', 'top', 'right', 'bottom', 'left', 'gap', 'flex-direction', 'justify-content', 'align-items', 'align-self', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas', 'grid-area', 'grid-column', 'grid-row', 'box-shadow', 'box-sizing', 'cursor', 'pointer-events', 'visibility', 'white-space', 'word-break', 'outline', 'resize', 'content', 'filter', 'backdrop-filter', 'clip-path', 'object-fit', 'object-position', 'mix-blend-mode', 'isolation', 'will-change', 'scroll-behavior', 'user-select'],
  sql: ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'CHECK', 'DEFAULT', 'UNIQUE', 'CASCADE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'AS', 'ORDER', 'BY', 'ASC', 'DESC', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'UNION', 'ALL', 'ANY', 'SOME', 'CAST', 'COALESCE', 'NOW', 'gen_random_uuid', 'VARCHAR', 'INT', 'BOOLEAN', 'TIMESTAMP', 'UUID', 'TEXT', 'SERIAL', 'BIGINT', 'NUMERIC', 'DECIMAL', 'FLOAT', 'DOUBLE', 'DATE', 'JSON', 'JSONB', 'ARRAY', 'TRUE', 'FALSE', 'BEGIN', 'COMMIT', 'ROLLBACK', 'GRANT', 'REVOKE', 'EXPLAIN', 'ANALYZE'],
};

function getTokenType(token: string, language: string): string {
  const keywords = KEYWORDS[language] || [];
  if (keywords.includes(token)) return 'keyword';

  if (/^['"`]/.test(token) || /['"`]$/.test(token)) return 'string';
  if (/^\/\//.test(token)) return 'comment-line';
  if (/^\/\*/.test(token)) return 'comment-block';
  if (/^<!--/.test(token)) return 'comment-html';
  if (/^#/.test(token) && language === 'css') return 'hex-color';
  if (/^\d+(\.\d+)?(px|em|rem|%|vh|vw|s|ms|deg)?$/.test(token)) return 'number';
  if (/^(class|id|className|href|src|alt|type|name|placeholder|method|action|target|rel|charset|content|lang|role|aria-)['"]?/.test(token)) return 'attr';
  if (/^[<>/]/.test(token) || token === '=' || token === '/>' || token === '>' || token === '<') return 'tag-bracket';
  if (language === 'html' && /^[a-zA-Z]/.test(token) && !token.startsWith('<')) return 'tag-name';
  if (/^(true|false|null|undefined|NaN)$/.test(token)) return 'boolean';
  if (/^(console|Math|JSON|Object|Array|String|Number|Boolean|Date|RegExp|Error|Promise|Map|Set|Symbol)$/.test(token)) return 'builtin';
  if (/^(document|window|navigator|localStorage|sessionStorage|fetch|setTimeout|setInterval|clearTimeout|clearInterval)$/.test(token)) return 'builtin';
  if (/^(req|res|next|app|router|express)$/.test(token)) return 'builtin';
  if (/^(useState|useEffect|useContext|useReducer|useCallback|useMemo|useRef|useNavigate|useParams|useLocation)$/.test(token)) return 'react-hook';

  return 'plain';
}

function getTokenColor(tokenType: string): string {
  switch (tokenType) {
    case 'keyword': return 'text-rose-400';
    case 'string': return 'text-amber-400';
    case 'comment-line':
    case 'comment-block':
    case 'comment-html': return 'text-quest-textDim italic';
    case 'hex-color': return 'text-cyan-400';
    case 'number': return 'text-cyan-400';
    case 'attr': return 'text-amber-300';
    case 'tag-bracket':
    case 'tag-name': return 'text-sky-400';
    case 'boolean': return 'text-orange-400';
    case 'builtin': return 'text-violet-400';
    case 'react-hook': return 'text-emerald-400';
    default: return 'text-quest-textMuted';
  }
}

function tokenizeLine(line: string, language: string) {
  const tokens: { text: string; color: string }[] = [];

  if (!line.trim()) {
    tokens.push({ text: line || ' ', color: 'text-quest-textMuted' });
    return tokens;
  }

  if (language === 'html') {
    const regex = /(<\/?[\w-]+)|(\s[\w-]+(?:-[\w-]+)*)=|("[^"]*")|('[^']*')|(<!--[\s\S]*?-->)|([>\s/])|([\w-]+)/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ text: line.slice(lastIndex, match.index), color: 'text-quest-textMuted' });
      }
      const full = match[0];
      if (match[1]) tokens.push({ text: full, color: getTokenColor('tag-name') });
      else if (match[2]) tokens.push({ text: full, color: getTokenColor('attr') });
      else if (match[3] || match[4]) tokens.push({ text: full, color: getTokenColor('string') });
      else if (match[5]) tokens.push({ text: full, color: getTokenColor('comment-html') });
      else if (match[6]) tokens.push({ text: full, color: getTokenColor('tag-bracket') });
      else if (match[7]) tokens.push({ text: full, color: getTokenColor('plain') });
      lastIndex = match.index + full.length;
    }
    if (lastIndex < line.length) {
      tokens.push({ text: line.slice(lastIndex), color: 'text-quest-textMuted' });
    }
    return tokens;
  }

  if (language === 'css') {
    const regex = /(@[a-zA-Z-]+)|([.#]?[a-zA-Z-]+(?=[\s:{]))|([a-zA-Z-]+(?=\s*:))|(:[\w-]+(?=[\s;{]))|([\d.]+(?:px|em|rem|%|vh|vw|s|ms|deg)?)|(#[0-9a-fA-F]{3,8})|("[^"]*")|('[^']*')|([:;,])|(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|([a-zA-Z-]+)/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ text: line.slice(lastIndex, match.index), color: 'text-quest-textMuted' });
      }
      const full = match[0];
      if (match[1]) tokens.push({ text: full, color: getTokenColor('keyword') });
      else if (match[2]) tokens.push({ text: full, color: getTokenColor('plain') });
      else if (match[3]) tokens.push({ text: full, color: getTokenColor('attr') });
      else if (match[4]) tokens.push({ text: full, color: getTokenColor('hex-color') });
      else if (match[5]) tokens.push({ text: full, color: getTokenColor('number') });
      else if (match[6]) tokens.push({ text: full, color: getTokenColor('hex-color') });
      else if (match[7] || match[8]) tokens.push({ text: full, color: getTokenColor('string') });
      else if (match[9]) tokens.push({ text: full, color: 'text-quest-textMuted' });
      else if (match[10] || match[11]) tokens.push({ text: full, color: getTokenColor('comment-line') });
      else if (match[12]) tokens.push({ text: full, color: getTokenColor('plain') });
      lastIndex = match.index + full.length;
    }
    if (lastIndex < line.length) {
      tokens.push({ text: line.slice(lastIndex), color: 'text-quest-textMuted' });
    }
    return tokens;
  }

  if (language === 'sql') {
    const words = line.split(/(\s+)/);
    for (const word of words) {
      if (!word.trim()) {
        tokens.push({ text: word, color: 'text-quest-textMuted' });
        continue;
      }
      const upper = word.toUpperCase();
      if (KEYWORDS.sql.includes(upper)) {
        tokens.push({ text: word, color: getTokenColor('keyword') });
      } else if (/^'.*'$/.test(word)) {
        tokens.push({ text: word, color: getTokenColor('string') });
      } else if (/^\d+$/.test(word)) {
        tokens.push({ text: word, color: getTokenColor('number') });
      } else if (/^--/.test(word)) {
        tokens.push({ text: word, color: getTokenColor('comment-line') });
      } else {
        tokens.push({ text: word, color: getTokenColor('plain') });
      }
    }
    return tokens;
  }

  const parts = line.split(/(\s+)/);
  for (const part of parts) {
    if (!part.trim()) {
      tokens.push({ text: part, color: 'text-quest-textMuted' });
      continue;
    }
    const type = getTokenType(part, language);
    tokens.push({ text: part, color: getTokenColor(type) });
  }
  return tokens;
}

export default function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  const lines = useMemo(() => code.split('\n'), [code]);

  return (
    <div className="rounded-xl bg-[#0d0d14] border border-quest-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-quest-border/50 bg-[#0a0a10]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs text-quest-textDim ml-2 font-medium uppercase tracking-wider">{language}</span>
        </div>
        <button
          className="text-xs text-quest-textDim hover:text-quest-textMuted transition-colors flex items-center gap-1 cursor-pointer"
          onClick={() => navigator.clipboard?.writeText(code)}
          title="Copy code"
        >
          <i className="ri-file-copy-line text-sm" />
          Copy
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-sm leading-relaxed">
          <tbody>
            {lines.map((line, lineIndex) => {
              const tokens = tokenizeLine(line, language);
              return (
                <tr key={lineIndex} className="hover:bg-white/[0.02]">
                  <td className="select-none text-right pr-4 pl-4 py-0.5 text-xs text-quest-textDim border-r border-quest-border/30 w-12 align-top">
                    {lineIndex + 1}
                  </td>
                  <td className="pl-4 pr-4 py-0.5">
                    <span className="whitespace-pre-wrap break-words">
                      {tokens.map((token, i) => (
                        <span key={i} className={token.color}>{token.text}</span>
                      ))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}