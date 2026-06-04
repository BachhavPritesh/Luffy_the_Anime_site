import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  authModal: null,
  searchOverlay: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, action) { state.sidebarOpen = action.payload; },
    openAuthModal(state, action) { state.authModal = action.payload; },
    closeAuthModal(state) { state.authModal = null; },
    toggleSearchOverlay(state) { state.searchOverlay = !state.searchOverlay; },
  },
});

export const {
  toggleSidebar, setSidebarOpen,
  openAuthModal, closeAuthModal,
  toggleSearchOverlay,
} = uiSlice.actions;

export default uiSlice.reducer;
