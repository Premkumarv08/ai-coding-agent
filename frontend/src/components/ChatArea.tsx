import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ChatMessage } from './ChatMessage';
import { RootState } from '../store/store';

export const ChatArea: React.FC = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto h-full px-4 py-2"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(156 163 175) transparent' }}
    >
      <div className="flex flex-col min-h-full">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Welcome to AI Coding Agent</h3>
              <p className="text-sm">Start a conversation to begin coding with AI assistance.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
    </div>
  );
};
