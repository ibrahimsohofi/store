import { create } from 'zustand';

export const useUIStore = create((set) => ({
  locale: 'fr',
  isMobileMenuOpen: false,
  
  setLocale: (locale) => set({ locale }),
  
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
}));
