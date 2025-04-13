import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./products.css";
import { Footer } from "../landing/home";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import SearchResult from "./search/searchItem";
import MyNavbar from "../landing/navbar";
import { ScrollToHashElement } from "../landing/Slider";

export default function Ffetch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);

  const BRAND_API = `http://localhost:8000/api/brands`;
  const WISHLIST_API = `http://localhost:8000/api/wishlist`;
  const ACCESSORIES_API = `http://localhost:8000/api/accessories`;

  useEffect(() => {
    setIsFetching(true);
    fetch("http://localhost:8000/api/mobiles")
      .then((res) => res.json())
      .then((json) => {
        setProducts(json.data || []);
        setFilteredProducts(json.data || []);
      })
      .catch((error) => console.error("Error fetching products:", error));

    fetch(ACCESSORIES_API)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        const accessoriesWithBrand =
          json.data?.map((item) => ({
            ...item,
            brand_id: item.brand_id || null,
            product_type: "accessory", // إضافة نوع المنتج للتمييز
          })) || []; // استخدام nullish coalescing للتعامل مع بيانات غير متوقعة
        setAccessories(accessoriesWithBrand);
      })
      .catch((error) => {
        console.error("Error fetching accessories:", error);
        setAccessories([]); // تعيين مصفوفة فارغة في حالة الخطأ
      })

      .finally(() => setIsFetching(false));

    // جلب قائمة المفضلة من السيرفر عند التحميل
    const userToken = localStorage.getItem("user_token");
    if (userToken) {
      fetch(WISHLIST_API, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            setFavorites(data.data);
          }
        })
        .catch((error) => console.error("Error fetching wishlist:", error));
    }
  }, []);

  useEffect(() => {
    if (products.length <= 0) return;
    fetch(BRAND_API)
      .then((res) => res.json())
      .then((json) => {
        const brandMap = {};
        json.data.forEach((brand) => {
          brandMap[brand.id] = {
            name: brand.name,
            image: brand.image ? `http://localhost:8000${brand.image}` : null,
          };
        });
        setBrands(brandMap);
      })
      .catch((error) => console.error("Error fetching brands:", error));
  }, [products]);

  useEffect(() => {
    if (selectedCategory === "الكل") {
      setFilteredProducts(products);
      setFilteredAccessories(accessories);
    } else {
      setFilteredProducts(products.filter(p => p.brand_id === selectedCategory));
      setFilteredAccessories(accessories.filter(a => a.brand_id === selectedCategory));
    }
  }, [selectedCategory, products, accessories]);

  const handleAddToCart = async (product) => {
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      setMessageText("❌ يجب تسجيل الدخول أولاً!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }

    setIsLoading(true);
    setCurrentProduct(product.id);

    const productType =
      product.product_type === "accessories" ? "accessory" : "mobile";

    try {
      const response = await fetch("http://localhost:8000/api/cart-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          product_type: productType,
          quantity: 1,
        }),
      });

      const result = await response.json();
      setShowMessage(true);
      setMessageText(
        response.ok
          ? "✔ تم الإضافة إلى السلة بنجاح!"
          : `❌ خطأ: ${result.message || "حدث خطأ!"}`
      );
    } catch (error) {
      setShowMessage(true);
      setMessageText("❌ فشل الإضافة! حاول مرة أخرى.");
    }

    setTimeout(() => setShowMessage(false), 3000);
    setIsLoading(false);
    setCurrentProduct(null);
  };

  const handleFavorite = async (product) => {
    const userToken = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");

    if (!userToken || !userId) {
      setShowMessage(true);
      setMessageText("❌ يجب تسجيل الدخول أولاً!");
      setTimeout(() => setShowMessage(false), 3000);
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }

    const isAccessory = product.image ? true : false; // أو أي خاصية أخرى تميز الإكسسوارات
    const productType = isAccessory ? "accessory" : "mobile";

    const existingFavorite = favorites.find(
      (fav) => fav.product_id === product.id && fav.product_type === productType
    );

    try {
      if (existingFavorite) {
        // الحذف
        const response = await fetch(`${WISHLIST_API}/${existingFavorite.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.ok) {
          setFavorites(
            favorites.filter((fav) => fav.id !== existingFavorite.id)
          );
          setMessageText("❌ تمت الإزالة من المفضلة!");
        } else {
          setMessageText("❌ فشل الحذف! حاول مرة أخرى.");
        }
      } else {
        const response = await fetch(WISHLIST_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: product.id,
            product_type: productType,
          }),
        });

        if (response.ok) {
          const newFavorite = await response.json();
          setFavorites([...favorites, newFavorite.data]);
          setMessageText("✔ تمت الإضافة إلى المفضلة!");
        } else {
          setMessageText("❌ فشل الإضافة! حاول مرة أخرى.");
        }
      }
    } catch (error) {
      setMessageText("❌ خطأ أثناء الاتصال بالسيرفر!");
    }

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <>
      <MyNavbar />
      <div className="Block container" style={{ marginTop: "85px" }}>
        <div className="brand-filter">
          <div
            className={`brand-circle ${
              selectedCategory === "الكل" ? "selected" : ""
            }`}
            onClick={() => setSelectedCategory("الكل")}
          >
            <p>الكل</p>
          </div>
          {Object.keys(brands).map((brandId) => (
            <div
              key={brandId}
              className={`brand-circle ${
                selectedCategory === brandId ? "selected" : ""
              }`}
              onClick={() => setSelectedCategory(brandId)}
            >
              {brands[brandId].image ? (
                <img
                  src={brands[brandId].image}
                  alt={brands[brandId].name}
                  className="brand-image"
                />
              ) : (
                <p>{brands[brandId].name}</p>
              )}
            </div>
          ))}
        </div>
        <h1 className="" style={{ direction: "rtl" }}>
          موبايلات
        </h1>
      </div>

      <div className="div-0 container" id="pproducct">
        {showMessage && <div className="cart-message">{messageText}</div>}

        {isFetching ? (
          <div className="loading-products">⏳ جارٍ تحميل المنتجات...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">🚫 لا توجد منتجات متاحة</div>
        ) : (
          filteredProducts.map((data) => {
            const isFavorite = favorites.some(
              (fav) => fav.product_id === data.id
            );

            return (
              <div className="div-1 product-card text-center" key={data.id}>
                <div
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(data);
                  }}
                >
                  <FaHeart style={{ color: isFavorite ? "red" : "gray" }} />
                </div>
                <img
                  className="imgProduct img-fluid"
                  width="100%"
                  src={`http://localhost:8000${data.image_cover}`}
                  alt={data.title}
                />
                <div className="div2flex">
                  <p id="title" className="text-success fw-bolder">
                    {data.title}
                  </p>
                  <p id="Price">{data.price} جنية</p>
                  <div className="row justify-content-between align-items-center pl-4">
                    <button
                      onClick={() => navigate(`/mobiles/${data.id}`)}
                      className="btn btn-success w-100 rounded-pill"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="Block container" id="accessory">
        <h1 style={{ direction: "rtl" }}>إكسسوارات</h1>
      </div>
      <div className="div-0 container" id="accessory">
        {isFetching ? (
          <div className="loading-products">⏳ جارٍ تحميل الإكسسوارات...</div>
        ) : filteredAccessories.length === 0 ? (
          <div className="no-products">🚫 لا توجد إكسسوارات متاحة</div>
        ) : (
          filteredAccessories.map((data) => {
            const isFavorite = favorites.some(
              (fav) => fav.product_id === data.id
            );

            return (
              <div className="div-1 product-card text-center" key={data.id}>
                <div
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(data);
                  }}
                >
                  <FaHeart style={{ color: isFavorite ? "red" : "gray" }} />
                </div>
                <img
                  className="imgProduct img-fluid"
                  width="100%"
                  src={`http://localhost:8000${data.image}`}
                  alt={data.title}
                />
                <div className="div2flex">
                  <p id="title" className="text-success fw-bolder">
                    {data.title}
                  </p>
                  <p id="Price">{data.price} جنية</p>
                  <div className="row justify-content-between align-items-center px-1">
                    <button
                      className="btn btn-success w-100 rounded-pill"
                      onClick={() => navigate(`/accessories/${data.id}`)}
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <ScrollToHashElement />
      <Footer />
    </>
  );
}
