import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './productSlice';
import { useParams } from 'react-router-dom';
import loader from './img/mobileLogo.svg';
import { useNavigate } from "react-router-dom";
import "./products.css";
import "./productDetails.css";
import { addToCart } from "./cartSlice";
import { Footer } from './home';
import { AiOutlineClose } from "react-icons/ai";
// import { Link, useNavigate } from "react-router-dom";

function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [quantity, setQuantity] = useState(1); // ✅ تخزين الكمية
    const navigate = useNavigate();
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

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };
  

    const handleAddToCart = async () => {
        setIsLoading(true);

        for (let i = 0; i < quantity; i++) {
            await dispatch(addToCart(data));
        }

        setIsLoading(false);
        setTimeout(() => {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }, 500);
    };

    return (
        <>
       
      <AiOutlineClose className="close-icon" onClick={() => navigate(-1)} />
  
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
                                <img className="d-block w-100" src={image} alt={`Slide ${index + 1}`} loading="lazy"/>
                            </div>
                        ))
                    ) : (
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={loader} alt="No images available" loading="lazy"/>
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
                
                <div className="btns row align-items-baseline">
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="quantity-input col-2 p-3"
                    />

                    <button id="btn-1" onClick={handleAddToCart} className="btn btn-success col-9">
                        {isLoading ? "Loading..." : "إضافة إلى عربة التسوق"}
                    </button>

                    {showMessage && <div className="cart-message">✔ تم إضافة المنتج إلى العربة بنجاح!</div>}
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default ProductDetails;
