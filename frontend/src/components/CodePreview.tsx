import React, { useRef, useEffect } from 'react';
import { CodeArtifact } from '../types';

interface CodePreviewProps {
  artifact: CodeArtifact;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ artifact }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const processAICode = (code: string): string => {
    let processedCode = code;

    processedCode = processedCode.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '');
    processedCode = processedCode.replace(/import\s+['"][^'"]*['"];?\s*/g, '');
    
    processedCode = processedCode.replace(/export\s+default\s+\w+;?\s*$/gm, '');
    processedCode = processedCode.replace(/export\s+\{[^}]*\}\s*;?\s*$/gm, '');
    processedCode = processedCode.replace(/export\s+(const|let|var|function|class)\s+/g, '$1 ');

    const componentMatches = [
      ...processedCode.matchAll(/(?:function|class)\s+([A-Z]\w*)/g),
      ...processedCode.matchAll(/const\s+([A-Z]\w*)\s*=\s*(?:\([^)]*\)\s*=>|React\.memo|forwardRef)/g)
    ];

    const componentNames = componentMatches.map(match => match[1]);

    if (componentNames.length > 0) {
      const globalAssignments = componentNames
        .map(name => `window.${name} = ${name};`)
        .join('\n');
      
      processedCode += '\n\n' + globalAssignments;
    }

    const arrowComponentMatches = [...processedCode.matchAll(/const\s+([A-Z]\w*)\s*=\s*\([^)]*\)\s*=>/g)];
    if (arrowComponentMatches.length > 0) {
      arrowComponentMatches.forEach(match => {
        const name = match[1];
        if (!componentNames.includes(name)) {
          processedCode += `\nwindow.${name} = ${name};`;
        }
      });
    }

    return processedCode;
  };

  const fixCommonIssues = (code: string): string => {
    let fixedCode = code;

    fixedCode = fixedCode.replace(/(\/\/.*?)`([^`]*?)`(.*?)$/gm, '$1"$2"$3');
    fixedCode = fixedCode.replace(/(\/\*[\s\S]*?)`([^`]*?)`([\s\S]*?\*\/)/g, '$1"$2"$3');
    
    fixedCode = fixedCode.replace(/(\/\/.*?)`([^`\n]*?)$/gm, '$1"$2"');
    
    const reactHooks = ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect'];
    
    reactHooks.forEach(hook => {
      const regex = new RegExp(`\\b${hook}\\b(?!\\s*:)`, 'g');
      fixedCode = fixedCode.replace(regex, `React.${hook}`);
    });

    const reactRefs = ['Component', 'PureComponent', 'Fragment', 'createElement', 'cloneElement', 'memo', 'forwardRef'];
    reactRefs.forEach(ref => {
      const regex = new RegExp(`\\b${ref}\\b(?!\\s*[:=])`, 'g');
      fixedCode = fixedCode.replace(regex, `React.${ref}`);
    });

    fixedCode = fixedCode.replace(/const\s*\{\s*([^}]+)\s*\}\s*=\s*React;?\s*/g, '');

    fixedCode = fixedCode.replace(/(\/\/.*?)\$\{([^}]*?)\}(.*?)$/gm, '$1${$2}$3');

    fixedCode = fixedCode.replace(/(\/\/.*?)[\u2018\u2019]/gm, '$1\'');
    fixedCode = fixedCode.replace(/(\/\/.*?)[\u201C\u201D]/gm, '$1"');

    return fixedCode;
  };

  useEffect(() => {
    if (iframeRef.current && ['html', 'css', 'javascript', 'jsx', 'tsx', 'react'].includes(artifact.language.toLowerCase())) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        let htmlContent = '';
        
        if (artifact.language.toLowerCase() === 'html') {
          htmlContent = artifact.code;
        } else if (artifact.language.toLowerCase() === 'css') {
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>${artifact.code}</style>
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background: #f8fafc;
                }
                .preview-content {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
              </style>
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
                <div class="container">
                  <div class="item">Item 1</div>
                  <div class="item">Item 2</div>
                  <div class="item">Item 3</div>
                </div>
              </div>
            </body>
            </html>
          `;
        } else if (['javascript', 'jsx', 'tsx', 'react'].includes(artifact.language.toLowerCase())) {
          let processedCode = processAICode(artifact.code);
          processedCode = fixCommonIssues(processedCode);

          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>AI Code Preview</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              
              <!-- React and ReactDOM -->
              <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              
              <!-- Babel for JSX transformation -->
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              
              <!-- Basic styling -->
              <style>
                * {
                  box-sizing: border-box;
                }
                
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                  margin: 0;
                  padding: 20px;
                  background: #f8fafc;
                  color: #1a202c;
                  line-height: 1.6;
                }
                
                #root { 
                  min-height: 200px;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  padding: 20px;
                  max-width: 1200px;
                  margin: 0 auto;
                }
                
                /* Common element styles */
                button {
                  background: #4F46E5;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  padding: 8px 16px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 500;
                  transition: background-color 0.2s;
                }
                
                button:hover {
                  background: #4338CA;
                }
                
                button:disabled {
                  background: #9CA3AF;
                  cursor: not-allowed;
                }
                
                input, textarea, select {
                  border: 1px solid #D1D5DB;
                  border-radius: 4px;
                  padding: 8px 12px;
                  font-size: 14px;
                  transition: border-color 0.2s;
                }
                
                input:focus, textarea:focus, select:focus {
                  outline: none;
                  border-color: #4F46E5;
                  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
                }
                
                .error-message {
                  color: #ef4444;
                  padding: 16px;
                  background: #fef2f2;
                  border: 1px solid #fecaca;
                  border-radius: 6px;
                  margin: 16px 0;
                  font-family: 'Courier New', monospace;
                  white-space: pre-wrap;
                  font-size: 13px;
                }
                
                .loading {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 200px;
                  color: #6B7280;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div id="root">
                <div class="loading">Loading React component...</div>
              </div>
              
              <script type="text/babel">
                try {
                  // Store previous components to avoid conflicts
                  window._prevComponents = window._prevComponents || [];
                  
                  // Clear previous components safely
                  window._prevComponents.forEach(name => {
                    try {
                      if (window[name]) {
                        window[name] = undefined;
                      }
                    } catch (e) {
                      // Ignore deletion errors
                    }
                  });
                  window._prevComponents = [];
                  
                  // Execute the processed code
                  ${processedCode}
                  
                  // Find the main component to render
                  const findComponent = () => {
                    // Try common component names first
                    const commonNames = ['App', 'Component', 'Main', 'Index', 'Counter', 'TodoApp', 'Calculator'];
                    for (const name of commonNames) {
                      if (window[name] && typeof window[name] === 'function') {
                        console.log('Found component:', name);
                        window._prevComponents.push(name);
                        return window[name];
                      }
                    }
                    
                    // Find any function starting with capital letter
                    const componentKeys = Object.keys(window).filter(key => 
                      typeof window[key] === 'function' && 
                      /^[A-Z]/.test(key) && 
                      !['Object', 'Array', 'String', 'Number', 'Boolean', 'Date', 'RegExp', 'Error', 'Promise', 'Symbol'].includes(key)
                    );
                    
                    console.log('Available components:', componentKeys);
                    
                    if (componentKeys.length > 0) {
                      const componentName = componentKeys[0];
                      window._prevComponents.push(componentName);
                      return window[componentName];
                    }
                    
                    return null;
                  };

                  const AppComponent = findComponent();
                  
                  if (AppComponent) {
                    console.log('Rendering component:', AppComponent.name || 'Anonymous');
                    
                    // Create root and render (React 18 style, with fallback to React 17)
                    if (ReactDOM.createRoot) {
                      const root = ReactDOM.createRoot(document.getElementById('root'));
                      root.render(React.createElement(AppComponent));
                    } else {
                      ReactDOM.render(React.createElement(AppComponent), document.getElementById('root'));
                    }
                  } else {
                    const availableFunctions = Object.keys(window).filter(k => typeof window[k] === 'function' && /^[A-Z]/.test(k));
                    throw new Error('No React component found to render.\\n\\nDebugging info:\\n- Make sure your component name starts with a capital letter\\n- Available functions: ' + availableFunctions.join(', '));
                  }
                } catch (error) {
                  console.error('Preview Error:', error);
                  
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'error-message';
                  
                  const codePreview = \`${processedCode}\`.substring(0, 300);
                  
                  errorDiv.innerHTML = 
                    '<strong>Error rendering component:</strong><br>' +
                    error.message + '<br><br>' +
                    '<strong>Common fixes:</strong><br>' +
                    '• Remove import/export statements (not supported in browser preview)<br>' +
                    '• Make sure your component name starts with a capital letter<br>' +
                    '• Check for syntax errors in your JSX<br>' +
                    '• Use React.useState instead of useState<br>' +
                    '• Use React.useEffect instead of useEffect<br><br>' +
                    '<strong>Processed code preview:</strong><br>' +
                    '<code style="font-size: 11px; opacity: 0.7; white-space: pre-wrap;">' + 
                    codePreview.replace(/</g, '&lt;').replace(/>/g, '&gt;') + 
                    '...</code>';
                  
                  const root = document.getElementById('root');
                  root.innerHTML = '';
                  root.appendChild(errorDiv);
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
  }, [artifact.code, artifact.language]);

  const isPreviewable = ['html', 'css', 'javascript', 'jsx', 'tsx', 'react'].includes(artifact.language.toLowerCase());

  if (!isPreviewable) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-md">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-sm font-medium">Preview not available for {artifact.language} files</p>
          <p className="text-xs mt-1 text-gray-400">
            Supported: HTML, CSS, JavaScript, JSX, TSX, React
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">Live Preview</span>
          <span className="text-xs text-gray-500 ml-2">({artifact.language})</span>
        </div>
      </div>
      
      <div className="flex-1 border rounded-md overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          title="AI Code Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
        />
      </div>
    </div>
  );
};

export default CodePreview;