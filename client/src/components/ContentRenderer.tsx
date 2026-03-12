import React, { useMemo } from 'react';

interface ContentRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown-like content with proper formatting.
 * Handles: paragraphs, lists, bold, blockquotes, tables, numbered lists, <br> tags.
 */
export default function ContentRenderer({ content, className = '' }: ContentRendererProps) {
  const rendered = useMemo(() => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: React.JSX.Element[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        i++;
        continue;
      }

      // Code block detection (```mermaid or ```)
      if (trimmed.startsWith('```')) {
        const codeLines: string[] = [];
        const lang = trimmed.replace('```', '').trim();
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) i++; // skip closing ```
        
        if (lang === 'mermaid') {
          // Parse mermaid graph into readable flow steps
          elements.push(renderMermaidAsFlow(codeLines.join('\n'), key++));
        } else {
          elements.push(
            <pre key={key++} className="my-4 p-4 rounded-xl overflow-x-auto text-xs leading-relaxed"
              style={{ background: 'oklch(0.97 0.003 80)', border: '1px solid oklch(0.9 0.004 80)', color: 'oklch(0.3 0.02 250)' }}>
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
        }
        continue;
      }

      // Table detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        elements.push(renderTable(tableLines, key++));
        continue;
      }

      // Blockquote
      if (trimmed.startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
          i++;
        }
        elements.push(
          <blockquote key={key++} className="my-4 pl-4 py-3 pr-4 rounded-r-lg text-sm leading-relaxed"
            style={{ 
              borderLeft: '3px solid oklch(0.5 0.2 25)',
              background: 'oklch(0.975 0.004 80)',
              color: 'oklch(0.28 0.02 250)'
            }}>
            {quoteLines.map((ql, qi) => (
              <p key={qi} className={qi > 0 ? 'mt-2' : ''}>
                {renderInline(ql)}
              </p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Unordered list (- or *)
      if (/^[-*]\s+/.test(trimmed)) {
        const listItems: string[] = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
          i++;
        }
        elements.push(
          <ul key={key++} className="my-3 space-y-1.5 text-sm leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'oklch(0.5 0.2 25)' }} />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered list with sub-items
      if (/^\d+\.\s+/.test(trimmed)) {
        const listItems: Array<{ text: string; subItems: string[] }> = [];
        while (i < lines.length) {
          const currentLine = lines[i];
          const currentTrimmed = currentLine.trim();
          if (/^\d+\.\s+/.test(currentTrimmed)) {
            listItems.push({
              text: currentTrimmed.replace(/^\d+\.\s+/, ''),
              subItems: [],
            });
            i++;
          } else if (/^\s+\*\s+/.test(currentLine) || /^\s+[-]\s+/.test(currentLine)) {
            if (listItems.length > 0) {
              listItems[listItems.length - 1].subItems.push(
                currentTrimmed.replace(/^[-*]\s+/, '')
              );
            }
            i++;
          } else if (currentTrimmed === '') {
            if (i + 1 < lines.length && (/^\d+\.\s+/.test(lines[i + 1].trim()) || /^\s+[*-]\s+/.test(lines[i + 1]))) {
              i++;
            } else {
              break;
            }
          } else {
            break;
          }
        }
        elements.push(
          <ol key={key++} className="my-3 space-y-3 text-sm leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="font-semibold shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs"
                  style={{ background: 'oklch(0.28 0.04 250 / 0.07)', color: 'oklch(0.28 0.04 250)' }}>
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <span>{renderInline(item.text)}</span>
                  {item.subItems.length > 0 && (
                    <ul className="mt-2 space-y-1 ml-1">
                      {item.subItems.map((sub, si) => (
                        <li key={si} className="flex gap-2 text-sm" style={{ color: 'oklch(0.35 0.02 250)' }}>
                          <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ background: 'oklch(0.6 0.015 250)' }} />
                          <span>{renderInline(sub)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Regular paragraph
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('|') && !lines[i].trim().startsWith('>') && !/^[-*]\s+/.test(lines[i].trim()) && !/^\d+\.\s+/.test(lines[i].trim())) {
        paraLines.push(lines[i].trim());
        i++;
      }
      if (paraLines.length > 0) {
        elements.push(
          <p key={key++} className="my-2.5 text-sm leading-relaxed" style={{ color: 'oklch(0.25 0.02 250)' }}>
            {renderInline(paraLines.join(' '))}
          </p>
        );
      }
    }

    return elements;
  }, [content]);

  return <div className={className}>{rendered}</div>;
}

/**
 * Renders inline formatting: **bold**, <br> tags
 */
function renderInline(text: string): React.JSX.Element {
  const parts: React.JSX.Element[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Find the earliest match of any pattern
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const brMatch = remaining.match(/<br\s*\/?>/i);

    // Determine which comes first
    const boldIdx = boldMatch?.index ?? Infinity;
    const brIdx = brMatch?.index ?? Infinity;

    if (boldIdx === Infinity && brIdx === Infinity) {
      // No more patterns
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (boldIdx <= brIdx && boldMatch) {
      // Bold comes first
      if (boldMatch.index! > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index!)}</span>);
      }
      parts.push(
        <strong key={key++} className="font-semibold" style={{ color: 'oklch(0.18 0.02 250)' }}>
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
    } else if (brMatch) {
      // <br> comes first
      if (brMatch.index! > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, brMatch.index!)}</span>);
      }
      parts.push(<br key={key++} />);
      remaining = remaining.slice(brMatch.index! + brMatch[0].length);
    }
  }

  return <>{parts}</>;
}

/**
 * Renders a markdown table with proper styling
 */
/**
 * Renders mermaid graph as a visual flow diagram
 */
function renderMermaidAsFlow(mermaidCode: string, key: number): React.JSX.Element {
  // Extract subgraph titles and node labels
  const stages: Array<{ title: string; steps: string[] }> = [];
  let currentStage: { title: string; steps: string[] } | null = null;

  const lines = mermaidCode.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    const subgraphMatch = trimmed.match(/^subgraph\s+(.+)/);
    if (subgraphMatch) {
      currentStage = { title: subgraphMatch[1], steps: [] };
      stages.push(currentStage);
      continue;
    }
    if (trimmed === 'end') {
      currentStage = null;
      continue;
    }
    // Extract node labels like A[text] or B(text) or C{text}
    const nodeRegex = /[A-Z]\w*[\[\(\{]([^\]\)\}]+)[\]\)\}]/g;
    let nodeMatch: RegExpExecArray | null;
    while ((nodeMatch = nodeRegex.exec(trimmed)) !== null) {
      if (currentStage && nodeMatch[1] && !currentStage.steps.includes(nodeMatch[1])) {
        currentStage.steps.push(nodeMatch[1]);
      }
    }
  }

  if (stages.length === 0) {
    return (
      <pre key={key} className="my-4 p-4 rounded-xl overflow-x-auto text-xs leading-relaxed"
        style={{ background: 'oklch(0.97 0.003 80)', border: '1px solid oklch(0.9 0.004 80)', color: 'oklch(0.3 0.02 250)' }}>
        <code>{mermaidCode}</code>
      </pre>
    );
  }

  const stageColors = [
    { bg: 'oklch(0.28 0.04 250 / 0.06)', border: 'oklch(0.28 0.04 250 / 0.15)', accent: 'oklch(0.28 0.04 250)' },
    { bg: 'oklch(0.5 0.15 160 / 0.06)', border: 'oklch(0.5 0.15 160 / 0.15)', accent: 'oklch(0.4 0.12 160)' },
    { bg: 'oklch(0.65 0.1 70 / 0.06)', border: 'oklch(0.65 0.1 70 / 0.15)', accent: 'oklch(0.55 0.1 70)' },
    { bg: 'oklch(0.5 0.2 25 / 0.05)', border: 'oklch(0.5 0.2 25 / 0.12)', accent: 'oklch(0.5 0.2 25)' },
  ];

  return (
    <div key={key} className="my-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stages.map((stage, si) => {
          const color = stageColors[si % stageColors.length];
          return (
            <div key={si} className="rounded-xl p-4" style={{ background: color.bg, border: `1px solid ${color.border}` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: color.accent }}>
                  {si + 1}
                </span>
                <h5 className="text-sm font-bold" style={{ color: 'oklch(0.18 0.02 250)', fontFamily: "'Noto Serif SC', serif" }}>
                  {stage.title}
                </h5>
              </div>
              <div className="space-y-2">
                {stage.steps.map((step, sti) => (
                  <div key={sti} className="flex items-start gap-2">
                    <div className="flex flex-col items-center shrink-0 mt-0.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold"
                        style={{ background: 'oklch(1 0 0)', border: `1.5px solid ${color.accent}`, color: color.accent }}>
                        {sti + 1}
                      </span>
                      {sti < stage.steps.length - 1 && (
                        <div className="w-px h-3 mt-0.5" style={{ background: color.accent, opacity: 0.3 }} />
                      )}
                    </div>
                    <span className="text-xs leading-relaxed pt-0.5" style={{ color: 'oklch(0.3 0.02 250)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderTable(lines: string[], key: number): React.JSX.Element {
  // Filter out separator rows (e.g., |:---|:---|:---|)
  const isSeparatorRow = (line: string) => {
    const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
    return cells.every(cell => /^[\s:-]+$/.test(cell));
  };

  const rows = lines
    .filter(l => !isSeparatorRow(l))
    .map(l => 
      l.split('|')
        .filter((_, i, arr) => i > 0 && i < arr.length - 1)
        .map(cell => cell.trim())
    );

  if (rows.length === 0) return <div key={key} />;

  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div key={key} className="my-4 overflow-x-auto rounded-xl" style={{ 
      border: '1px solid oklch(0.88 0.004 80)',
      boxShadow: '0 1px 3px oklch(0.5 0.02 250 / 0.04)'
    }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'oklch(0.22 0.03 250)' }}>
            {header.map((cell, ci) => (
              <th key={ci} className="px-4 py-3 text-left font-semibold text-xs"
                style={{ color: 'oklch(0.92 0.01 80)', fontFamily: "'Noto Serif SC', serif" }}>
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} style={{ 
              borderTop: '1px solid oklch(0.93 0.004 80)',
              background: ri % 2 === 0 ? 'oklch(1 0 0)' : 'oklch(0.985 0.003 80)'
            }}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-sm leading-relaxed align-top"
                  style={{ color: 'oklch(0.28 0.02 250)' }}>
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
