import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { clearFinallyCart } from "./cartSlice"; 
import './cartpay.css';
import { Footer } from "./home";
import MyNavbar from "./navbar";

export default function PaymentForm() {
    const location = useLocation();
    const dispatch = useDispatch();
    const cartTotalFromRedux = useSelector(state => state.cart?.totalPrice || 0);
    const cartTotal = location.state?.totalPrice ?? cartTotalFromRedux;

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        paymentMethod: "credit-card",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
        if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "البريد الإلكتروني غير صالح";
        if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setSuccessMessage(`✔ تمت عملية الدفع بنجاح! المبلغ المدفوع: ${cartTotal} جنية`);
            dispatch(clearFinallyCart());
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    return (
        <>
        <MyNavbar/>
            <div className="payment-container">
                <h2 className="fw-bold text-center">تأكيد عملية الشراء</h2>

                {successMessage && <div className="payment-success">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="form-group">
                        <label>الاسم الكامل:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label>رقم الهاتف:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label>البريد الإلكتروني:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>عنوان الشحن:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} />
                        {errors.address && <span className="error-text">{errors.address}</span>}
                    </div>

                    <div className="form-group">
                        <label>المبلغ الكلي:</label>
                        <input type="text" value={`${cartTotal} جنية`} readOnly className="disabled-input" />
                    </div>

                    <div className="form-group">
                        <label>طريقة الدفع:</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                            <option value="credit-card"> انستا باي </option>
                            <option value="vfCash"> محفظة إلكترونية </option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success w-100">إتمام الدفع</button>
                </form>
            </div>
            <Footer />
        </>
    );
}
