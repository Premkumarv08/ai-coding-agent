export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface CodeArtifact {
  id: string;
  language: string;
  code: string;
  filename?: string;
  description?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface SidebarState {
  isOpen: boolean;
  activeView: 'code' | 'preview';
  currentArtifact: CodeArtifact | null;
}

export interface RootState {
  chat: ChatState;
  sidebar: SidebarState;
}

export interface ChatRequest {
  message: string;
  conversationHistory: Message[];
}

export interface ChatResponse {
  message: string;
  codeArtifacts?: CodeArtifact[];
}

export interface StreamingChunk {
  type: 'content' | 'code' | 'end';
  data: string;
  language?: string;
  filename?: string;
}
