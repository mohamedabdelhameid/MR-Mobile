import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from 'react-redux';
import store from './store';
import Ffetch from './products';
import ProductDetails from './productDetails';
import Cart from './cart';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Contact from "./contact";
import SearchComponent from './searchItem';
import PaymentForm from './cartPay';
import NotFound from './notFound';
import Singup from './singeup'
import Forgot from './forgot-password'
import Login from './login'
import VerifyCode from './VerifyCode';
import Favorites from './fouvrit';

import MyNavbar from './navbar';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      {/* <MyNavbar/> */}

        <Routes>

          <Route path="/" element={<App />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Products" element={<Ffetch />} />
          <Route path="/yourCart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/searchresult" element={<SearchComponent />} />
          <Route path="/PaymentForm" element={<PaymentForm />} />
          <Route path="/singeup" element={<Singup />} />
          <Route path="/forgot-password" element={< Forgot/>} />
          <Route path="/login" element={< Login/>} />
          <Route path="/VerifyCode" element={< VerifyCode/>} />
          <Route path="/fouvrit" element={< Favorites/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();