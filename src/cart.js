import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  addToCart,
  clearCart,
  clearFinallyCart,
} from "./cartSlice";
import { selectCartItems } from "./cartSlice";
import "./cart.css";
import Swal from "sweetalert2";
import { Footer } from "./home";
import { useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";

function Cart() {
  
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const [messages, setMessages] = useState([]); 
  const [isMessageActive, setIsMessageActive] = useState(false); 
  const navigate = useNavigate();

  const isCartEmpty = cart.length === 0; // ✅ التحقق من حالة السلة
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const showMessage = (message, type = "success", isLoading = false, duration = 5000) => {
    if (isMessageActive) return;
    setIsMessageActive(true);

    const id = Date.now();
    setMessages((prevMessages) => [...prevMessages, { id, message, type, isLoading }]);

    if (!isLoading) {
      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
        setIsMessageActive(false);
      }, duration);
    }
  };

  const handleAddToCart = async (item) => {
    if (isMessageActive) return;

    const loadingMessageId = Date.now();
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: loadingMessageId, message: " جاري إضافة المنتج...", type: "info", isLoading: true }
    ]);

    try {
      await dispatch(addToCart(item));

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== loadingMessageId)
      );

      showMessage("✔ تمت إضافة المنتج بنجاح!", "success", false, 3000);
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== loadingMessageId)
      );

      showMessage("❌ فشل الإضافة! حاول مرة أخرى", "error", false, 3000);
    }
  };

  const handleDeleteItem = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا المنتج!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف المنتج!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearCart(id));
        showMessage("✔ تم حذف المنتج بنجاح", "error");
      }
    });
  };

  const handleDeleteAll = () => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف جميع المنتجات من عربة التسوق!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف الكل!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearFinallyCart());
        showMessage("✔ تم حذف جميع المنتجات بنجاح", "error");
      }
    });
  };
  

  return (

    
    <div className="container" >
      <MyNavbar/>
      <div className="messages-container" >
        {messages.map((msg) => (
          <div key={msg.id} className={`cart-message ${msg.type === "error" ? "delete-message" : ""}`}>
            {msg.isLoading ? (
              <>
                <span className="loader"></span> {msg.message}
              </>
            ) : (
              msg.message
            )}
          </div>
        ))}
      </div>
      <h1 className="my-3"> محتويات سلة</h1>
      {isCartEmpty ? (
        <h1 className="text-danger container" style={{minHeight:'60vh',direction: "rtl"}}>السلة فارغة</h1>
      ) : (
        <ol className="container row">
          {cart.map((item) => (
            <li key={item._id}>
              <div className="image-container">
                <img src={item.imageCover} alt={item.title} loading="lazy"/>
              </div>
              <div className="content">
                <p>النوع : {item.title}</p>
                <p>السعر : {item.price} جنية</p>
                <p>الكمية : {item.quantity} قطعة</p>
              </div>
              {!isCartEmpty && ( // ✅ إخفاء div.block إذا كانت السلة فارغة
                <div className="block">
                  <button onClick={() => dispatch(removeFromCart(item._id))} className="btn btn-warning mx-1">-</button>
                  <button onClick={() => handleDeleteItem(item._id)} className="btn btn-danger mx-1">حذف</button>
                  <button onClick={() => handleAddToCart(item)} className="btn btn-success mx-1">+</button>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
      {!isCartEmpty && ( // ✅ إخفاء الأزرار عند فراغ السلة
        <div className="Div-buttons-buy-delete"style={{ direction: "rtl" }} >
          <h3>السعر الكلي: {totalPrice} جنية</h3>
          <button className="btn btn-success mx-1" onClick={()=>{
            navigate('/PaymentForm', { state: { totalPrice } });
          }}>شراء الآن</button>
          <button onClick={handleDeleteAll} className="btn btn-danger mx-1">حذف كل المنتجات</button>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Cart;
