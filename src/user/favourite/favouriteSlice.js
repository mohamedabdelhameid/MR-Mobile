import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  count: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {
    // إضافة منتج للمفضلات
    addToFavourite: (state, action) => {
      const product = action.payload;
      if (!state.items.find(item => item.id === product.id)) {
        state.items.push(product);
        state.count = state.items.length;
      }
    },

    // إزالة منتج من المفضلات
    removeFromFavourite: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      state.count = state.items.length;
    },

    // تعيين منتجات المفضلات من السيرفر
    setFavouriteItems: (state, action) => {
      state.items = action.payload;
      state.count = action.payload.length;
      state.status = 'succeeded';
    },

    // تحديث حالة المفضلات عند جلب البيانات
    setFavouriteLoading: (state) => {
      state.status = 'loading';
    },

    // تعيين خطأ عند فشل جلب البيانات
    setFavouriteError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },

    // مسح المفضلات بالكامل
    clearFavourite: (state) => {
      state.items = [];
      state.count = 0;
      state.status = 'idle';
      state.error = null;
    }
  }
});

// Selectors ميموايزة لتحسين الأداء
export const selectAllFavouriteItems = (state) => state.favourite.items;
export const selectFavouriteCount = (state) => state.favourite.count;
export const selectFavouriteStatus = (state) => state.favourite.status;
export const selectFavouriteError = (state) => state.favourite.error;

// تصدير الـ actions
export const {
  addToFavourite,
  removeFromFavourite,
  setFavouriteItems,
  setFavouriteLoading,
  setFavouriteError,
  clearFavourite
} = favouriteSlice.actions;

// تصدير الـ reducer
export default favouriteSlice.reducer; 