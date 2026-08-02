import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  total: 0,
  
  addItem: (product, qty = 1) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === product.id
            ? { ...item, qty: Math.min(item.qty + qty, 99) }
            : item
        ),
        total: state.total + product.price * qty,
      };
    }
    
    return {
      items: [...state.items, { ...product, qty }],
      total: state.total + product.price * qty,
    };
  }),
  
  removeItem: (productId) => set((state) => {
    const item = state.items.find((i) => i.id === productId);
    return {
      items: state.items.filter((i) => i.id !== productId),
      total: state.total - (item?.price * item.qty || 0),
    };
  }),
  
  updateQty: (productId, qty) => set((state) => {
    const item = state.items.find((i) => i.id === productId);
    if (!item) return state;
    
    const qtyDiff = qty - item.qty;
    return {
      items: state.items.map((i) =>
        i.id === productId ? { ...i, qty } : i
      ),
      total: state.total + item.price * qtyDiff,
    };
  }),
  
  clearCart: () => set({ items: [], total: 0 }),
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  
  openCart: () => set({ isOpen: true }),
  
  closeCart: () => set({ isOpen: false }),
  
  getItemCount: () => get().items.reduce((sum, item) => sum + item.qty, 0),
}));
