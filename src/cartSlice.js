import { createSlice, createSelector } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return cart ? cart : [];
  } catch (error) {
    return [];
  }
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromLocalStorage(),
  },
  reducers: {
    setCartFromLocalStorage: (state) => {
      state.items = loadCartFromLocalStorage();
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCartToLocalStorage(state.items);
    },
    
    removeFromCart: (state, action) => {
      const index = state.items.findIndex((item) => item._id === action.payload);

      if (index !== -1) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity -= 1; // ✅ تقليل الكمية إذا كانت أكثر من 1
        } else {
          const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");
          if (confirmDelete) {
            state.items = state.items.filter((item) => item._id !== action.payload);
          }
        }
      }
      saveCartToLocalStorage(state.items);
    },

    clearCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveCartToLocalStorage(state.items);
    },

    clearFinallyCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
  },
});

export const selectCartItems = createSelector(
  (state) => state.cart.items,
  (items) => [...items]
);

export const selectCartCount = (state) =>
  state.cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;


export const { setCartFromLocalStorage, addToCart, removeFromCart, clearCart, clearFinallyCart } = cartSlice.actions;
export default cartSlice.reducer;