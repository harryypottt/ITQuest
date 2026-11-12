import { useMemo } from 'react';

interface LivePreviewProps {
  files: any[];
  activeFile: string;
  code: Record<string, string>;
}

export default function LivePreview({ files, code }: LivePreviewProps) {
  // Pinagsasama-sama ang HTML, CSS, at JS files mula sa workspace code state
  const combinedSrcDoc = useMemo(() => {
    let htmlContent = code['index.html'] || code['index.htm'] || '';
    const cssContent = code['style.css'] || code['styles.css'] || '';
    const jsContent = code['script.js'] || code['index.js'] || code['main.js'] || '';

    // Kung walang index.html, mag-inject ng batayang HTML structure para lumabas pa rin ang JS/DOM console/content
    if (!htmlContent) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: monospace;
                background-color: #0d0d14;
                color: #38bdf8;
                padding: 16px;
                margin: 0;
              }
              ${cssContent}
            </style>
          </head>
          <body>
            <div id="root"></div>
            <div id="app"></div>
            <script>
              try {
                ${jsContent}
              } catch (err) {
                console.error(err);
                document.body.innerHTML += '<pre style="color: #f43f5e; margin-top: 20px;">' + err.toString() + '</pre>';
              }
            </script>
          </body>
        </html>
      `;
    }

    // Kung may index.html, i-inject ang CSS at JS sa loob nito
    let renderedHtml = htmlContent;

    if (cssContent && !renderedHtml.includes(cssContent)) {
      renderedHtml = renderedHtml.replace(
        '</head>',
        `<style>${cssContent}</style></head>`
      );
    }

    if (jsContent) {
      renderedHtml = renderedHtml.replace(
        '</body>',
        `<script>
          try {
            ${jsContent}
          } catch (err) {
            console.error(err);
          }
        </script></body>`
      );
    }

    return renderedHtml;
  }, [code, files]);

  return (
    <div className="h-full flex flex-col bg-[#0d0d14]">
      <div className="flex items-center justify-between px-3 py-2 bg-[#12121a] border-b border-quest-border select-none">
        <span className="text-xs font-semibold text-quest-textDim flex items-center gap-1.5">
          <i className="ri-tv-line text-quest-primary" /> Live Preview
        </span>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Auto-Refreshing
        </span>
      </div>
      <div className="flex-1 bg-white relative">
        <iframe
          title="Live Preview"
          srcDoc={combinedSrcDoc}
          className="w-full h-full border-none bg-white"
          sandbox="allow-scripts allow-modals allow-same-origin"
        />
      </div>
    </div>
  );
}



