// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { clearCart } from "./cartSlice";
// import './cartpay.css';
// import { Footer } from "./home";
// import MyNavbar from "./navbar";
// import Swal from 'sweetalert2';

// export default function PaymentForm() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const cartItems = useSelector(state => state.cart.apiItems);
//     const cartTotal = location.state?.totalPrice || useSelector(state => state.cart.totalPrice);

//     const [formData, setFormData] = useState({
//         name: "",
//         phone: "",
//         email: "",
//         address: "",
//         paymentMethod: "instapay",
//     });

//     const [errors, setErrors] = useState({});
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     // جلب بيانات الحساب عند تحميل المكون
//     useEffect(() => {
//         const fetchUserAccount = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/api/user/getaccount', {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('user_token')}`
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error('فشل في جلب بيانات الحساب');
//                 }

//                 const userData = await response.json();

//                 // تعبئة النموذج ببيانات المستخدم
//                 setFormData({
//                     name: userData.full_name || "",
//                     phone: userData.phone || "",
//                     email: userData.email || "",
//                     address: userData.address || "",
//                     paymentMethod: "instapay",
//                 });

//             } catch (error) {
//                 Swal.fire({
//                     title: 'تحذير',
//                     text: 'تم جلب بيانات الدفع الأساسية فقط، يرجى مراجعة البيانات',
//                     icon: 'warning',
//                     confirmButtonText: 'حسناً'
//                 });
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchUserAccount();
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const validateForm = () => {
//         let newErrors = {};
//         if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
//         if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
//         if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = "البريد الإلكتروني غير صالح";
//         }
//         if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handlePayment = async () => {
//         setIsProcessing(true);
//         try {
//             const response = await fetch('http://localhost:8000/api/payment/create-checkout-session', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('user_token')}`
//                 },
//                 body: JSON.stringify({
//                     items: cartItems.map(item => ({
//                         id: item.product_id,
//                         name: item.name || `منتج ${item.product_id}`,
//                         price: item.price,
//                         quantity: item.quantity
//                     })),
//                     customerInfo: formData,
//                     totalAmount: cartTotal
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('فشل في إنشاء جلسة الدفع');
//             }

//             const { url } = await response.json();
//             window.location.href = url;

//         } catch (error) {
//             Swal.fire({
//                 title: 'خطأ!',
//                 text: error.message,
//                 icon: 'error',
//                 confirmButtonText: 'حسناً'
//             });
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             if (formData.paymentMethod === "instapay") {
//                 await handlePayment();
//             } else {
//                 Swal.fire({
//                     title: 'تمت العملية بنجاح!',
//                     text: `تم الدفع بنجاح بمبلغ ${cartTotal} جنيه`,
//                     icon: 'success',
//                     confirmButtonText: 'حسناً'
//                 }).then(() => {
//                     dispatch(clearCart());
//                     navigate('/');
//                 });
//             }
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="loading-container">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">جار التحميل...</span>
//                 </div>
//                 <p>جارٍ تحميل بيانات الدفع...</p>
//             </div>
//         );
//     }

//     return (
//         <>
//         <MyNavbar/>
//             <div className="payment-container">
//                 <h2 className="fw-bold text-center">تأكيد عملية الشراء</h2>

//                 {successMessage && <div className="payment-success">{successMessage}</div>}

//                 <form onSubmit={handleSubmit} className="payment-form">
//                     <div className="form-group">
//                         <label>الاسم الكامل:</label>
//                         <input type="text" name="name" value={formData.name} onChange={handleChange} />
//                         {errors.name && <span className="error-text">{errors.name}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>رقم الهاتف:</label>
//                         <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
//                         {errors.phone && <span className="error-text">{errors.phone}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>البريد الإلكتروني:</label>
//                         <input type="email" name="email" value={formData.email} onChange={handleChange} />
//                         {errors.email && <span className="error-text">{errors.email}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>عنوان الشحن:</label>
//                         <input type="text" name="address" value={formData.address} onChange={handleChange} />
//                         {errors.address && <span className="error-text">{errors.address}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>المبلغ الكلي:</label>
//                         <input type="text" value={`${cartTotal} جنية`} readOnly className="disabled-input" />
//                     </div>

//                     <div className="form-group">
//                         <label>طريقة الدفع:</label>
//                         <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
//                             <option value="credit-card"> انستا باي </option>
//                             <option value="vfCash"> محفظة إلكترونية </option>
//                         </select>
//                     </div>

//                     <button type="submit" className="btn btn-success w-100">إتمام الدفع</button>
//                 </form>
//             </div>
//             <Footer />
//         </>
//     );
// }

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "./cartSlice";
import "./cartpay.css";
import { Footer } from "./home";
import MyNavbar from "./navbar";
import Swal from "sweetalert2";

export default function PaymentForm() {
  // العناصر الأساسية
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.apiItems);
  const cartTotal = useSelector((state) => state.cart.totalPrice);

  // حالة النموذج
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "instapay",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const fetchCartId = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات السلة");
        }

        const data = await response.json();
        setCartId(data.cart_id); // ✅ حفظ `cart_id` في `state`
      } catch (error) {
        console.error("خطأ في جلب بيانات السلة:", error);
      }
    };

    fetchCartId();
  }, []);

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/user/getaccount",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الحساب");
        }

        const userData = await response.json();
        setFormData({
          name: userData.full_name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          address: userData.address || "",
          paymentMethod: "instapay",
        });
      } catch (error) {
        Swal.fire({
          title: "ملاحظة",
          text: "سيتم استخدام نموذج الدفع الأساسي",
          icon: "info",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAccount();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "بريد إلكتروني غير صالح";
    }
    if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              id: item.product_id,
              name: item.title || `منتج ${item.product_id}`,
              price: item.price,
              quantity: item.quantity,
            })),
            customer_info: formData,
            total_amount: cartTotal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل في عملية الدفع");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setSuccessMessage(`تم الدفع بنجاح! المبلغ: ${cartTotal} جنيه`);
        dispatch(clearCart());
      }
    } catch (error) {
      Swal.fire({
        title: "خطأ!",
        text: error.message,
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await processPayment();
    }
  };

  if (isLoading) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>جاري تحميل تفاصيل الدفع...</p>
      </div>
    );
  }

  return (
    <>
      <MyNavbar />
      <div className="payment-container">
        <h2>إتمام عملية الدفع</h2>

        {successMessage && (
          <div className="payment-success">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>الاسم الكامل</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>عنوان الشحن</label>
            <textarea name="address" onChange={handleChange} rows="3" />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>المبلغ الإجمالي</label>
            <input
              type="text"
              value={`${cartTotal ? cartTotal.toFixed(2) : "0.00"} جنيه`}
              readOnly
              className="total-amount"
            />
          </div>

          <div className="form-group">
            <label>طريقة الدفع</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="instapay">انستاباي</option>
              <option value="cash">الدفع عند الاستلام</option>
            </select>
          </div>

          <button type="submit" disabled={isProcessing} className="submit-btn">
            {isProcessing ? "جاري المعالجة..." : "إتمام الدفع"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
