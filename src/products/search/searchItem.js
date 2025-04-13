import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../landing/home.css";
import "./search.css";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import MyNavbar from "../../landing/navbar";
import { Footer } from "../../landing/home";

export default function SearchResult() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobiles, setMobiles] = useState([]);
  const [accessories, setAccessories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // جلب الموبايلات
        const mobilesResponse = await fetch(
          "http://localhost:8000/api/mobiles"
        );
        const mobilesData = await mobilesResponse.json();
        setMobiles(mobilesData.data || []);

        // جلب الاكسسوارات
        const accessoriesResponse = await fetch(
          "http://localhost:8000/api/accessories"
        );
        const accessoriesData = await accessoriesResponse.json();
        setAccessories(accessoriesData.data || []);
      } catch (error) {
        console.error("❌ خطأ في جلب المنتجات:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/brands");
        const data = await response.json();
        setBrands(data.data || []);
      } catch (error) {
        console.error("❌ خطأ في جلب البراندات:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // const filteredProducts = products.filter(product => {
  //   const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
  //   const brand = brands.find(b => b.id === product.brand_id);
  //   const matchesBrand = brand ? brand.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;

  //   return matchesSearch || matchesBrand;
  // });

  const filteredProducts = [...mobiles, ...accessories].filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const brand = brands.find((b) => b.id === product.brand_id);
    const matchesBrand = brand
      ? brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      : false;

    return matchesSearch || matchesBrand;
  });

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

    try {
      const response = await fetch("http://localhost:8000/api/cart-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          product_type: "mobile",
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

  useEffect(() => {
    const fetchFavorites = async () => {
      const userToken = localStorage.getItem("user_token");
      if (userToken) {
        try {
          const response = await fetch("http://localhost:8000/api/wishlist", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          const data = await response.json();
          if (data.data) {
            setFavorites(data.data);
          }
        } catch (error) {
          console.error("❌ خطأ في جلب المفضلة:", error);
        }
      }
    };

    fetchFavorites();
  }, []);

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

    const existingFavorite = favorites.find(
      (fav) => fav.product_id === product.id
    );

    try {
      if (existingFavorite) {
        const response = await fetch(
          `http://localhost:8000/api/wishlist/${existingFavorite.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        if (response.ok) {
          setFavorites(
            favorites.filter((fav) => fav.id !== existingFavorite.id)
          );
          setMessageText("❌ تمت الإزالة من المفضلة!");
        } else {
          setMessageText("❌ فشل الحذف! حاول مرة أخرى.");
        }
      } else {
        const response = await fetch("http://localhost:8000/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: product.id,
            product_type: "mobile",
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
      <div
        className="container"
        style={{ direction: "rtl", marginTop: "85px" }}
      >
        {showMessage && <div className="cart-message">{messageText}</div>}

        <div className="search-container mb-4">
          <input
            type="text"
            placeholder="ابحث عن منتج أو ماركة..."
            className="form-control"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <h2 className="fw-bold">
          {searchQuery ? `نتائج البحث ` : "جميع المنتجات"}
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4>لا يوجد منتجات بهذا الاسم</h4>
          </div>
        ) : (
          <div className="div-main div-0">
            {filteredProducts.map((product) => {
              const brand = brands.find((b) => b.id === product.brand_id);
              const isFavorite = favorites.some(
                (fav) => fav.product_id === product.id
              );

              return (
                <div
                  className="div-1 product-card text-center"
                  key={product.id}
                >
                  <div
                    className="favorite-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(product);
                    }}
                  >
                    <FaHeart style={{ color: isFavorite ? "red" : "gray" }} />
                  </div>
                  <img
                    className="imgProduct img-fluid"
                    width="100%"
                    src={`http://localhost:8000${product.image_cover || product.image}`}
                    // onClick={() => navigate(`/mobiles/${product.id}`)}
                    alt={product.title}
                  />
                  <div className="div2flex">
                    {/* <p>{brand ? brand.name : "غير معروف"}</p> */}
                    <p id="title" className="text-success fw-bolder">
                      {product.title}
                    </p>
                    <p id="Price">{product.price} جنية</p>
                    <div className="row justify-content-between align-items-center pl-4">
                      <button
                        // onClick={() => navigate(`/mobiles/${product.id}`)}
                        onClick={() => navigate(product.image ? `/accessories/${product.id}` : `/mobiles/${product.id}`)}
                        className="btn btn-success col-12 rounded-pill"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
