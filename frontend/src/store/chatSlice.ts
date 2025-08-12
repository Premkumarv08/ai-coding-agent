import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, Message, CodeArtifact } from '../types';
import { setCurrentArtifact } from './sidebarSlice';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { getState, dispatch }) => {
    const state = getState() as { chat: ChatState };
    const conversationHistory = state.chat.messages;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    dispatch(addMessage(userMessage));
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    
    dispatch(addMessage(assistantMessage));
    
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let currentCodeArtifacts: CodeArtifact[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'content') {
                accumulatedContent += data.data;
                dispatch(updateStreamingMessage({
                  id: assistantMessage.id,
                  content: accumulatedContent,
                }));
              } else if (data.type === 'code') {
                const codeArtifact: CodeArtifact = {
                  id: Date.now().toString(),
                  language: data.language || 'text',
                  code: data.data,
                  filename: data.filename,
                };
                currentCodeArtifacts.push(codeArtifact);
                
                dispatch(setCurrentArtifact(codeArtifact));
              } else if (data.type === 'end') {
                dispatch(finishStreamingMessage({
                  id: assistantMessage.id,
                  content: accumulatedContent,
                  codeArtifacts: currentCodeArtifacts,
                }));
                return;
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
      dispatch(removeMessage(assistantMessage.id));
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateStreamingMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
      }
    },
    finishStreamingMessage: (state, action: PayloadAction<{ id: string; content: string; codeArtifacts?: CodeArtifact[] }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
        message.isStreaming = false;
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const {
  addMessage,
  updateStreamingMessage,
  finishStreamingMessage,
  removeMessage,
  clearMessages,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;
