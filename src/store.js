import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer, // ✅ تأكد من أن `cart` هو اسم المفتاح الصحيح
  },
});

export default store;

