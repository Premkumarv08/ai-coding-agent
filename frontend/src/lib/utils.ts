import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function detectCodeBlocks(content: string): Array<{ language: string; code: string; start: number; end: number }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string; start: number; end: number }> = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return blocks;
}

export function extractCodeArtifacts(content: string): Array<{ language: string; code: string; filename?: string }> {
  const blocks = detectCodeBlocks(content);
  return blocks.map((block, index) => ({
    language: block.language,
    code: block.code,
    filename: `${block.language || 'file'}_${index + 1}.${getFileExtension(block.language)}`,
  }));
}

export function getFileExtension(language: string): string {
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
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
