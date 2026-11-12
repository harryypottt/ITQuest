// src/pages/lessons/components/LessonContent.tsx
import SyntaxHighlighter from './SyntaxHighlighter';

export interface LessonContentBlock {
  type: 'heading' | 'text' | 'code' | 'tip' | 'list' | 'video';
  content?: string;
  language?: string;
  items?: string[];
  videoUrl?: string;
  videoTitle?: string;
}

interface LessonContentProps {
  blocks: LessonContentBlock[] | string;
}

export default function LessonContent({ blocks }: LessonContentProps) {
  let parsedBlocks: LessonContentBlock[] = [];

  if (typeof blocks === 'string') {
    try {
      parsedBlocks = JSON.parse(blocks);
    } catch {
      parsedBlocks = [];
    }
  } else if (Array.isArray(blocks)) {
    parsedBlocks = blocks;
  }

  const renderBlock = (block: LessonContentBlock, idx: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <h3
            key={idx}
            id={`section-${idx}`}
            className="text-lg md:text-xl font-bold text-quest-text mt-8 mb-4 first:mt-0 scroll-mt-24"
          >
            {block.content}
          </h3>
        );

      case 'text':
        return (
          <p key={idx} className="text-sm leading-relaxed text-quest-textMuted mb-5">
            {block.content}
          </p>
        );

      case 'code':
        return (
          <div key={idx} className="mb-6">
            <SyntaxHighlighter code={block.content || ''} language={block.language || 'javascript'} />
          </div>
        );

      case 'tip':
        return (
          <div key={idx} className="mb-5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <i className="ri-lightbulb-line text-amber-400 text-sm" />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Pro Tip</div>
              <p className="text-sm text-amber-300/80 leading-relaxed">{block.content}</p>
            </div>
          </div>
        );

      case 'list':
        return (
          <ul key={idx} className="mb-5 space-y-2">
            {block.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-quest-textMuted leading-relaxed">
                <i className="ri-arrow-right-s-line text-quest-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );

      case 'video':
        return (
          <div key={idx} className="mb-6">
            {block.videoTitle && (
              <p className="text-xs font-semibold text-quest-textMuted mb-2 flex items-center gap-1.5">
                <i className="ri-play-circle-line text-quest-primary text-sm" />
                {block.videoTitle}
              </p>
            )}
            <div className="relative w-full rounded-xl overflow-hidden bg-[#0d0d14] border border-quest-border aspect-video">
              <iframe
                src={block.videoUrl}
                title={block.videoTitle || 'Lesson video'}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {parsedBlocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
}