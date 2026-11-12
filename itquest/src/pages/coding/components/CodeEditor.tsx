import { useRef, useEffect, type KeyboardEvent } from 'react';

interface CodeEditorProps {
  code: string;
  language?: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = (code || '').split('\n');
  const lineCount = lines.length;

  useEffect(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="flex h-full bg-[#0d0d14]">
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className="select-none overflow-hidden py-4 text-right pr-3 text-xs text-quest-textDim leading-6 min-w-[44px] border-r border-quest-border/50 font-mono"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="h-6">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Clean Editor */}
      <div className="flex-1 relative overflow-hidden">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="w-full h-full py-4 px-4 text-xs leading-6 font-mono bg-[#0d0d14] text-[#38bdf8] caret-emerald-400 resize-none outline-none overflow-auto whitespace-pre break-normal border-none"
        />
      </div>
    </div>
  );
}
