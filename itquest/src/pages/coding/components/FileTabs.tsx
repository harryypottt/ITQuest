import { useState, type KeyboardEvent } from 'react';

interface FileItem {
  name: string;
  language: string;
}

interface FileTabsProps {
  files: FileItem[];
  activeFile: string;
  onSelectFile: (fileName: string) => void;
  onAddFile?: (fileName: string, language: string) => void;
  onDeleteFile?: (fileName: string) => void;
}

export default function FileTabs({
  files,
  activeFile,
  onSelectFile,
  onAddFile,
  onDeleteFile,
}: FileTabsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleCreateFile = () => {
    const trimmed = newFileName.trim();
    if (!trimmed || !onAddFile) return;

    let language = 'javascript';
    if (trimmed.endsWith('.html')) language = 'html';
    else if (trimmed.endsWith('.css')) language = 'css';
    else if (trimmed.endsWith('.json')) language = 'json';

    onAddFile(trimmed, language);
    setNewFileName('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateFile();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewFileName('');
    }
  };

  return (
    <div className="flex items-center bg-[#12121a] border-b border-quest-border px-2 overflow-x-auto no-scrollbar min-h-[40px] flex-shrink-0">
      {/* File Tabs */}
      <div className="flex items-center gap-1">
        {files.map((file) => {
          const isActive = file.name === activeFile;
          // Bawal i-delete ang main starter file (index.js)
          const isMainFile = file.name === 'index.js';

          return (
            <div
              key={file.name}
              onClick={() => onSelectFile(file.name)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs font-mono cursor-pointer transition-colors border-t-2 select-none ${
                isActive
                  ? 'bg-[#0d0d14] text-quest-primary border-quest-primary font-semibold'
                  : 'text-quest-textDim border-transparent hover:text-quest-text hover:bg-quest-card/50'
              }`}
            >
              <i
                className={`text-sm ${
                  file.name.endsWith('.html')
                    ? 'ri-html5-line text-orange-400'
                    : file.name.endsWith('.css')
                    ? 'ri-css3-line text-blue-400'
                    : 'ri-javascript-line text-yellow-400'
                }`}
              />
              <span>{file.name}</span>

              {/* X / Delete Button para sa mga bagong gawang file */}
              {!isMainFile && onDeleteFile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.name);
                  }}
                  className="opacity-70 group-hover:opacity-100 hover:text-rose-400 transition-opacity ml-1 p-0.5 rounded"
                  title="Delete file"
                >
                  <i className="ri-close-line text-xs" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* New File Input / Button */}
      {isAdding ? (
        <div className="flex items-center gap-1 ml-2">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="solution.js / style.css"
            autoFocus
            className="px-2 py-1 bg-quest-bg border border-quest-primary text-xs font-mono text-quest-text rounded outline-none w-36"
          />
          <button
            onClick={handleCreateFile}
            className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
            title="Confirm"
          >
            <i className="ri-check-line text-xs" />
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="p-1 text-quest-textDim hover:bg-quest-card rounded"
            title="Cancel"
          >
            <i className="ri-close-line text-xs" />
          </button>
        </div>
      ) : (
        onAddFile && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-2.5 py-1 ml-2 rounded text-xs text-quest-textDim hover:text-quest-primary hover:bg-quest-card/50 transition-colors whitespace-nowrap border border-dashed border-quest-border/60"
            title="Add New File"
          >
            <i className="ri-add-line text-sm text-quest-primary" />
            <span>New File</span>
          </button>
        )
      )}
    </div>
  );
}

