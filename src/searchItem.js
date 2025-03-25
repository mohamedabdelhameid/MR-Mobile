import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "./cartSlice";
import "./home.css";
import "./search.css";
import { FaCartPlus } from "react-icons/fa";

export default function SearchResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const searchResults = location.state?.results || [];
    const [isLoading, setIsLoading] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [showMessage, setShowMessage] = useState(false);

    if (searchResults.length === 0) {
        return null;
    }

    const handleBuyNow = async (product) => {
        setIsLoading(true);
        setCurrentProduct(product._id);

        try {
            await dispatch(addToCart(product));
            setShowMessage(true);

            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        } catch (error) {
            console.error("❌ خطأ أثناء الإضافة:", error);
        }

        setIsLoading(false);
        setCurrentProduct(null);
    };

    return (
        <div className="container my-4 " style={{ direction: "rtl" }}>
            {showMessage && <div className="cart-message">✔ تم الشراء بنجاح!</div>}

            <h2 className="fw-bold">نتائج البحث</h2>
            <div className="div-main div-0">
                {searchResults.map((product) => (
                    <div key={product._id} className="product-card div-1">
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={product.imageCover}
                            width="100%"
                            alt={product.title || "صورة المنتج"}
                            className="product-image rounded-3"
                          />
                        </Link>
                        {product.brand?.name && (
                          <p className="product-pric text-center fw-800">{product.brand.name}</p>
                        )}
                        {product.title && (
                          <p className="product-title text-center fw-bold">
                            {product.title}
                          </p>
                        )}
                        {product.price && (
                          <p className="product-price text-center fw-800">{product.price} جنية</p>
                        )}
          
                        <button
                          className="btn btn-success w-100 my-3"
                          onClick={() => handleBuyNow(product)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                              <span className="loader"></span>
                          ) : (
                              <> أضف الى {<FaCartPlus />}</>
                          )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
