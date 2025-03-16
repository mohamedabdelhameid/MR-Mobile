import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "./cartSlice";
import { useDispatch } from "react-redux";
import loader from './img/mobileLogo.svg';
import "./products.css";

export default function Ffetch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [showMessage, setShowMessage] = useState(false); // ✅ التحكم في عرض الرسالة
    const [messageText, setMessageText] = useState(""); // ✅ نص الرسالة
    const [isLoading, setIsLoading] = useState(false); // ✅ تحميل أثناء الإضافة
    const [currentProduct, setCurrentProduct] = useState(null); // ✅ المنتج الجاري إضافته

    useEffect(() => {
        fetch('https://ecommerce.routemisr.com/api/v1/products')
            .then((res) => res.json())
            .then((json) => {
                console.log("Fetched Products:", json.data);
                setProducts(json.data || []);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleAddToCart = async (data) => {
        setIsLoading(true); // ✅ تشغيل اللودينج
        setCurrentProduct(data._id); // ✅ تحديد المنتج الجاري إضافته

        try {
            await dispatch(addToCart(data)); // ✅ إضافة المنتج للسلة
            setShowMessage(true);
            setMessageText(`✔ تم الإضافة بنجاح`); // ✅ عرض الرسالة مع اسم المنتج

            setTimeout(() => {
                setShowMessage(false); // ✅ إخفاء الرسالة بعد 3 ثوانٍ
            }, 3000);
        } catch (error) {
            setShowMessage(true);
            setMessageText("❌ فشل الإضافة! حاول مرة أخرى"); // ✅ عرض رسالة الخطأ
            setTimeout(() => setShowMessage(false), 3000);
        }

        setIsLoading(false); // ✅ إيقاف اللودينج
        setCurrentProduct(null); // ✅ إعادة ضبط المنتج الجاري إضافته
    };

    return (
        <div className="div-0 container" id="pproducct">
            {/* ✅ الرسالة المتحركة */}
            {showMessage && <div className="cart-message">{messageText}</div>}

            {products.length === 0 ? (
                <div id="loading-spinner" style={{position: "fixed", top: "0", left: "0", width: "100%", height: "100%", background: "white", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "1000"}}>
                    <img src={loader} alt="" />
                </div>
            ) : (
                products.map((data) => (
                    <div className="div-1 bblockk" key={data._id}>
                        <img className="imgProduct img-fluid" src={data.imageCover} onClick={() => navigate(`/product/${data._id}`)} alt={data.title} />
                        <div className="div2flex">
                            <p id="title">النوع : {data.title}</p>
                            {data.brand.name && <p>شركة : {data.brand.name}</p>}
                            {data.storage && <p>المساحة : {data.storage}</p>}
                            <p id="Price">السعر : {data.price} جنية</p>
                            <div className="btns">
                                <button id="btn-1" onClick={() => handleAddToCart(data)} className="btn btn-success w-100" disabled={isLoading && currentProduct === data._id}>
                                    {isLoading && currentProduct === data._id ? <span className="loader"></span> : "إضافه الي عربة التسوق"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

