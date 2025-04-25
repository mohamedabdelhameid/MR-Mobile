import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productSlice';
import cartReducer from '../user/cart/cartSlice';
import favouriteReducer from '../user/favourite/favouriteSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer, // ✅ تأكد من أن `cart` هو اسم المفتاح الصحيح
    favourite: favouriteReducer,
  },
});

export default store;

