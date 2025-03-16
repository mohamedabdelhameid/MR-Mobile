import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './productSlice';
import { useParams } from 'react-router-dom';
import loader from './img/mobileLogo.svg';
import "./products.css";
import "./productDetails.css";
import { addToCart } from "./cartSlice";

function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false); // ✅ حالة التحميل
    const [showMessage, setShowMessage] = useState(false); // ✅ حالة الرسالة

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const products = useSelector(state => state.products.items || []);
    const data = products.find(p => p._id === id) || null;

    if (!data) {
        return (
            <div id="loading-spinner" style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", background: "white", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "1000" }}>
                <img src={loader} alt="Loading..." />
            </div>
        );
    }

    const handleAddToCart = async () => {
        setIsLoading(true); // ✅ تفعيل اللودينج
        await dispatch(addToCart(data));

        // ✅ بعد انتهاء التحميل، يتم إيقاف اللودينج أولاً
        setIsLoading(false);

        // ✅ ثم بعد نصف ثانية، تظهر الرسالة
        setTimeout(() => {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000); // ✅ تختفي بعد 3 ثواني
        }, 500);
    };

    return (
        <div className="product-details container">
            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-touch="true">
                <div className="carousel-indicators">
                    {data.images && data.images.length > 0 && data.images.map((_, index) => (
                        <button key={index} type="button" data-bs-target="#carouselExample" data-bs-slide-to={index} className={index === 0 ? "active" : ""} aria-current={index === 0 ? "true" : "false"} aria-label={`Slide ${index + 1}`}></button>
                    ))}
                </div>
                <div className="carousel-inner">
                    {data.images && data.images.length > 0 ? (
                        data.images.map((image, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                <img className="d-block w-100" src={image} alt={`Slide ${index + 1}`} />
                            </div>
                        ))
                    ) : (
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={loader} alt="No images available" />
                        </div>
                    )}
                </div>
            </div>
            <div className="div2flex p-3">
                <p id="title">النوع : {data.title}</p>
                {data.brand?.name && <p>شركة : {data.brand.name}</p>}
                {data.storage && <p>المساحة : {data.storage}</p>}
                {data.ram && <p>الرام : {data.ram}</p>}
                {data.description && <p>المواصفات : {data.description}</p>}
                <p id="Price">السعر : {data.price} جنية</p>
                <div className="btns">
                    <button id="btn-1" onClick={handleAddToCart} className="btn btn-success w-100">
                        {isLoading ? "Loading..." : "إضافة إلى عربة التسوق"} {/* ✅ زر التحميل */}
                    </button>
                    {showMessage && <div className="cart-message">✔ تم إضافة المنتج إلى العربة بنجاح!</div>} {/* ✅ الرسالة */}
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
