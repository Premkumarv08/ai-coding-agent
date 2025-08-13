import React from 'react';
import { Message } from '../types';
import { formatTimestamp } from '../lib/utils';
import { User, Bot, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: Message;
}

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group my-3 rounded-md overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-muted px-3 py-2 text-xs border-b border-border">
        <span className="text-muted-foreground font-medium">
          {language || 'code'}
        </span>
        <button
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-background rounded-sm flex items-center gap-1"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-500" />
              <span className="text-green-500 text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-muted/30 p-4">
        <pre className="overflow-x-auto text-sm leading-relaxed">
          <code className="font-mono text-foreground whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
};

const InlineCode: React.FC<{ children: string }> = ({ children }) => (
  <code className="bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded-sm text-sm font-mono border border-border/50">
    {children}
  </code>
);

const MessageContent: React.FC<{ content: string; isStreaming?: boolean }> = ({ 
  content, 
  isStreaming 
}) => {
  const parseContent = (text: string) => {
    const parts = [];
    
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    
    let match;
    const codeBlocks = [];
    while ((match = codeBlockRegex.exec(text)) !== null) {
      codeBlocks.push({
        start: match.index,
        end: match.index + match[0].length,
        language: match[1],
        code: match[2].trim(),
        full: match[0]
      });
    }
    
    let currentIndex = 0;
    let partIndex = 0;
    
    for (const block of codeBlocks) {
      if (currentIndex < block.start) {
        const beforeText = text.slice(currentIndex, block.start);
        parts.push(
          <span key={`text-${partIndex++}`}>
            {renderInlineFormatting(beforeText)}
          </span>
        );
      }
      
      parts.push(
        <CodeBlock 
          key={`code-${partIndex++}`}
          code={block.code} 
          language={block.language}
        />
      );
      
      currentIndex = block.end;
    }
    
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      parts.push(
        <span key={`text-${partIndex++}`}>
          {renderInlineFormatting(remainingText)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : [renderInlineFormatting(text)];
  };
  
  const renderInlineFormatting = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    let partIndex = 0;
    
    const inlineCodeRegex = /`([^`]+)`/g;
    let match;
    
    while ((match = inlineCodeRegex.exec(text)) !== null) {
      if (lastIndex < match.index) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(
          <span key={`inline-${partIndex++}`}>
            {renderBasicFormatting(beforeText)}
          </span>
        );
      }
      
      parts.push(
        <InlineCode key={`inline-code-${partIndex++}`}>
          {match[1]}
        </InlineCode>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(
        <span key={`inline-${partIndex++}`}>
          {renderBasicFormatting(remainingText)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : renderBasicFormatting(text);
  };
  
  const renderBasicFormatting = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    let partIndex = 0;
    
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      if (lastIndex < match.index) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(
          <span key={`text-${partIndex++}`}>
            {renderItalicAndLinks(beforeText)}
          </span>
        );
      }
      
      parts.push(
        <strong key={`bold-${partIndex++}`} className="font-semibold">
          {renderItalicAndLinks(match[1])}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(
        <span key={`text-${partIndex++}`}>
          {renderItalicAndLinks(remainingText)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : renderItalicAndLinks(text);
  };
  
  const renderItalicAndLinks = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    let partIndex = 0;
    
    const italicRegex = /(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g;
    let match;
    
    while ((match = italicRegex.exec(text)) !== null) {
      if (lastIndex < match.index) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(
          <span key={`text-${partIndex++}`}>
            {renderLineBreaks(beforeText)}
          </span>
        );
      }
      
      parts.push(
        <em key={`italic-${partIndex++}`} className="italic">
          {match[1]}
        </em>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(
        <span key={`text-${partIndex++}`}>
          {renderLineBreaks(remainingText)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : renderLineBreaks(text);
  };
  
  const renderLineBreaks = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={`line-${index}`}>
        {index > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  };
  
  const parsedContent = parseContent(content);
  
  return (
    <div className="message-content leading-relaxed">
      {parsedContent}
      {isStreaming && (
        <span className="streaming-dot ml-1 inline-block w-1 h-4 bg-current animate-pulse opacity-70" />
      )}
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-3 text-sm shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-card text-card-foreground border border-border",
          "min-w-0 max-w-full"
        )}>
          <MessageContent 
            content={message.content} 
            isStreaming={message.isStreaming}
          />
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          {formatTimestamp(new Date(message.timestamp as string))}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};