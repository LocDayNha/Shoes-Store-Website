import { create } from 'zustand';

const useShareStore = create((set) => ({
  isMenuToggleCollapsed: false,
  setIsMenuToggleCollapsed: (value) => set({ isMenuToggleCollapsed: value }),
}));

export default useShareStore;
