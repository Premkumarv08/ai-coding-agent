import React, { useRef, useEffect } from 'react';
import { CodeArtifact } from '../types';

interface CodePreviewProps {
  artifact: CodeArtifact;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ artifact }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && (artifact.language === 'html' || artifact.language === 'css' || artifact.language === 'javascript')) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        // Create a basic HTML structure if it's just CSS or JS
        let htmlContent = '';
        
        if (artifact.language === 'html') {
          htmlContent = artifact.code;
        } else if (artifact.language === 'css') {
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>${artifact.code}</style>
            </head>
            <body>
              <div class="preview-content">
                <h1>CSS Preview</h1>
                <p>This is a preview of your CSS styles.</p>
                <button class="btn">Sample Button</button>
                <div class="card">
                  <h2>Sample Card</h2>
                  <p>This card demonstrates your CSS styling.</p>
                </div>
              </div>
            </body>
            </html>
          `;
        } else if (artifact.language === 'javascript') {
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>JavaScript Preview</title>
            </head>
            <body>
              <div class="preview-content">
                <h1>JavaScript Preview</h1>
                <p>Check the console for JavaScript output.</p>
                <button onclick="testFunction()">Test Function</button>
                <div id="output"></div>
              </div>
              <script>
                ${artifact.code}
                
                function testFunction() {
                  console.log('Test function called');
                  document.getElementById('output').innerHTML = 'Function executed! Check console.';
                }
              </script>
            </body>
            </html>
          `;
        }
        
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [artifact]);

  if (artifact.language === 'html' || artifact.language === 'css' || artifact.language === 'javascript') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b">
          <span className="text-sm font-medium">Live Preview</span>
          <span className="text-xs text-muted-foreground ml-2">({artifact.language})</span>
        </div>
        
        <div className="flex-1 border rounded-md overflow-hidden">
          <iframe
            ref={iframeRef}
            title="Code Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <p className="text-sm">Preview not available for {artifact.language} files.</p>
        <p className="text-xs mt-1">Use the Code view to see the syntax-highlighted code.</p>
      </div>
    </div>
  );
};
