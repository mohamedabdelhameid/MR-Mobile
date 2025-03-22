import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "./cartSlice";
import { useDispatch } from "react-redux";
import "./products.css";
import { Footer } from "./home";
import { FaCartPlus } from "react-icons/fa";
import SearchResult from "./searchItem";

export default function Ffetch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // ✅ متغير جديد لمتابعة تحميل البيانات
    const [currentProduct, setCurrentProduct] = useState(null);

    useEffect(() => {
        setIsFetching(true); // ✅ عند بدء جلب البيانات، يتم تعيين `isFetching` على `true`
        fetch('https://ecommerce.routemisr.com/api/v1/products')
            .then((res) => res.json())
            .then((json) => {
                setProducts(json.data || []);
                extractCategories(json.data || []);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            })
            .finally(() => {
                setIsFetching(false); // ✅ بعد انتهاء الجلب، يتم تعيين `isFetching` على `false`
            });
    }, []);

    const extractCategories = (products) => {
        const uniqueCategories = ["الكل", ...new Set(products.map(p => p.category?.name).filter(Boolean))];
        setCategories(uniqueCategories);
    };

    useEffect(() => {
        if (selectedCategory === "الكل") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category?.name === selectedCategory));
        }
    }, [selectedCategory, products]);

    const handleAddToCart = async (data) => {
        setIsLoading(true);
        setCurrentProduct(data._id);

        try {
            await dispatch(addToCart(data));
            setShowMessage(true);
            setMessageText(`✔ تم الإضافة بنجاح`);
            setTimeout(() => setShowMessage(false), 3000);
        } catch (error) {
            setShowMessage(true);
            setMessageText("❌ فشل الإضافة! حاول مرة أخرى");
            setTimeout(() => setShowMessage(false), 3000);
        }

        setIsLoading(false);
        setCurrentProduct(null);
    };

    return (
        <>
            <SearchResult />

            <div className="Block container">
                <h1>منتجاتنا</h1>
                <div className="category-filter">
                    <label htmlFor="category">اختر الفئة:</label>
                    <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>


            <div className="div-0 container" id="pproducct">
                {showMessage && <div className="cart-message">{messageText}</div>}

                {/* ✅ عرض رسالة التحميل فقط أثناء الجلب */}
                {isFetching ? (
                    <div className="loading-products">⏳ جارٍ تحميل المنتجات...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="no-products">🚫 لا توجد منتجات متاحة</div>
                ) : (
                    filteredProducts.map((data) => (
                        <div className="div-1 product-card bblockk text-center" key={data._id}>
                            <img className="imgProduct img-fluid" src={data.imageCover} onClick={() => navigate(`/product/${data._id}`)} alt={data.title} loading="lazy"/>
                            <div className="div2flex">
                                {data.brand?.name && <p>{data.brand.name}</p>}
                                <p id="title fw-800">{data.title}</p>
                                {data.storage && <p>{data.storage}</p>}
                                <p id="Price">{data.price} جنية</p>
                                <div className="btns">
                                    <button id="btn-1" onClick={() => handleAddToCart(data)} className="btn btn-success w-100" disabled={isLoading && currentProduct === data._id}>
                                        {isLoading && currentProduct === data._id ? (
                                            <span className="loader"></span>
                                        ) : (
                                            <> أضف الى {<FaCartPlus />}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Footer />
        </>
    );
}
