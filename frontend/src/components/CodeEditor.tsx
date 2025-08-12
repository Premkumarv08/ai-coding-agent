import React from 'react';
import Editor from '@monaco-editor/react';
import { CodeArtifact } from '../types';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { downloadFile } from '../lib/utils';

interface CodeEditorProps {
  artifact: CodeArtifact;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ artifact }) => {
  const handleDownload = () => {
    if (artifact.filename) {
      downloadFile(artifact.code, artifact.filename);
    } else {
      downloadFile(artifact.code, `code.${getFileExtension(artifact.language)}`);
    }
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      jsx: 'jsx',
      tsx: 'tsx',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      swift: 'swift',
      kotlin: 'kt',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
      json: 'json',
      xml: 'xml',
      yaml: 'yml',
      yml: 'yml',
      markdown: 'md',
      md: 'md',
      sql: 'sql',
      bash: 'sh',
      shell: 'sh',
      sh: 'sh',
    };

    return extensions[language.toLowerCase()] || 'txt';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{artifact.filename || `${artifact.language} code`}</span>
          <span className="text-xs text-muted-foreground">({artifact.language})</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-1"
        >
          <Download className="w-3 h-3" />
          Download
        </Button>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={artifact.language}
          value={artifact.code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};
