import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import sidebarReducer from './sidebarSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    sidebar: sidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/sendMessage/fulfilled'],
        ignoredPaths: ['chat.messages'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
