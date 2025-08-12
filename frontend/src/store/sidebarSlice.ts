import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SidebarState, CodeArtifact } from '../types';

const initialState: SidebarState = {
  isOpen: false,
  activeView: 'code',
  currentArtifact: null,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    openSidebar: (state, action: PayloadAction<CodeArtifact>) => {
      state.isOpen = true;
      state.currentArtifact = action.payload;
      state.activeView = 'code';
    },
    closeSidebar: (state) => {
      state.isOpen = false;
      state.currentArtifact = null;
    },
    toggleSidebar: (state, action: PayloadAction<CodeArtifact | null>) => {
      if (state.isOpen && state.currentArtifact?.id === action.payload?.id) {
        state.isOpen = false;
        state.currentArtifact = null;
      } else {
        state.isOpen = true;
        state.currentArtifact = action.payload;
        state.activeView = 'code';
      }
    },
    setActiveView: (state, action: PayloadAction<'code' | 'preview'>) => {
      state.activeView = action.payload;
    },
    setCurrentArtifact: (state, action: PayloadAction<CodeArtifact | null>) => {
      state.currentArtifact = action.payload;
      if (action.payload) {
        state.isOpen = true;
      }
    },
  },
});

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  setActiveView,
  setCurrentArtifact,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
