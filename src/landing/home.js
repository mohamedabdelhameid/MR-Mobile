import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../products/productSlice";
import { addToCart } from "../user/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export function Footer() {
  return (
    <div className="rtl container text-center mt-4">
      <p>
        &copy; {"   "}
        <b>
          <Link
            className="Mo"
            to={"https://www.facebook.com/profile.php?id=100063776365288"}
            target="_blank"
          >
            مستر موبايل
          </Link>
        </b>
        2025.
      </p>
      <p>*كل ما هو جديد في عالم الهواتف الذكيه*</p>
      <div>
        <p>تم التصميم بواسطه : </p>
        <div className="GRIDING my-3">
          <div className="hoverShow">
            <span className="fw-bold"> عبدالرحمن عبدالسميع </span>
            <div className="socialMedia m-3">
              <Link target="_blank">
                <i className="fa-brands fa-github m-2"></i>
              </Link>
              <Link target="_blank">
                <i className="fa-brands fa-linkedin-in m-2"></i>
              </Link>
              <Link target="_blank">
                <i className="fa-brands fa-whatsapp m-2"></i>
              </Link>
              <Link target="_blank">
                <i className="fa-brands fa-facebook-f m-2"></i>
              </Link>
            </div>
          </div>
          <br />
          <div className="hoverShow">
            <span className="fw-bold"> محمد محمود حامد </span>
            <div className="socialMedia m-3">
              <Link to="https://github.com/mohamedmahmoudhamid" target="_blank">
                <i className="fa-brands fa-github m-2"></i>
              </Link>
              <Link
                to="https://www.linkedin.com/in/mohamed-mahmoud-hamid-2b1b44313?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
              >
                <i className="fa-brands fa-linkedin-in m-2"></i>
              </Link>
              <Link to="https://wa.me/201280538625" target="_blank">
                <i className="fa-brands fa-whatsapp m-2"></i>
              </Link>
              <Link
                to="https://www.facebook.com/profile.php?id=100022375840375&mibextid=ZbWKwL"
                target="_blank"
              >
                <i className="fa-brands fa-facebook-f m-2"></i>
              </Link>
            </div>
          </div>
          <br />
          <div className="hoverShow">
            <span className="fw-bold"> محمد عبدالحميد </span>
            <div className="socialMedia m-3">
              <Link to="https://github.com/mohamedabdelhameid" target="_blank">
                <i className="fa-brands fa-github m-2"></i>
              </Link>
              <Link
                to="https://www.linkedin.com/in/mohamed-abdel-hameed-6b36732b8"
                target="_blank"
              >
                <i className="fa-brands fa-linkedin-in m-2"></i>
              </Link>
              <Link to="https://wa.me/+201120203912" target="_blank">
                <i className="fa-brands fa-whatsapp m-2"></i>
              </Link>
              <Link
                to="https://www.facebook.com/share/167YmfNBi2/"
                target="_blank"
              >
                <i className="fa-brands fa-facebook-f m-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [brands, setBrands] = useState([]);
  // const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success"); // success | error | info

  const FAVORITE_API = "http://localhost:8000/api/wishlist";
  const ADD_TO_CART = "http://localhost:8000/api/cart-items";
  const BRAND_API = "http://localhost:8000/api/brands";
  const navigate = useNavigate();

  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchProducts()).then(() => setIsFetching(false));

    fetch(BRAND_API)
      .then((response) => response.json())
      .then((responseData) => {
        if (Array.isArray(responseData.data)) {
          setBrands(responseData.data);
        } else {
          console.error("❌ البيانات المسترجعة ليست مصفوفة", responseData);
          setBrands([]);
        }
      })
      .catch((error) => console.error("⚠️ فشل جلب البراندات", error));

    const userToken = localStorage.getItem("user_token");

    if (userToken) {
      fetch(FAVORITE_API, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (Array.isArray(responseData.data)) {
            setFavorites(responseData.data);
          } else {
            setFavorites([]);
          }
        })
        .catch((error) => console.error("⚠️ فشل جلب المفضلة", error));
    }
  }, [dispatch]);

  const products = useSelector((state) => state.products.items || []);
  const randomProducts = [...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  const handleAddToCart = async (product) => {
    if (isLoading) return;

    const userToken = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");

    if (!userToken || !userId) {
      setMessageText("❌ يجب تسجيل الدخول لإضافة المنتجات إلى السلة!");
      setMessageType("error");
      setShowMessage(true);
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }

    setIsLoading(true);
    setMessageText("⏳ جارٍ إضافة المنتج...");
    setMessageType("info");
    setShowMessage(true);

    try {
      const response = await fetch(ADD_TO_CART, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id,
          product_type: product.type || "mobile",
          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("فشل في إضافة المنتج إلى السلة");

      setMessageText("✔ تم إضافة المنتج إلى السلة بنجاح! 🎉");
      setMessageType("success");
    } catch (error) {
      setMessageText("❌ حدث خطأ، حاول مرة أخرى!");
      setMessageType("error");
    }

    setShowMessage(true);
    setIsLoading(false);
  };

  const handleFavorite = async (product) => {
    const userToken = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");

    if (!userToken || !userId) {
      setMessageText("❌ يجب تسجيل الدخول لإضافة المنتجات إلى المفضلة!");
      setMessageType("error");
      setShowMessage(true);
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }

    const existingFavorite = favorites.find(
      (fav) => fav.product_id === product.id && fav.product_type === "mobile"
    );

    try {
      if (existingFavorite) {
        const response = await fetch(`${FAVORITE_API}/${existingFavorite.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (!response.ok) throw new Error("فشل في إزالة المنتج من المفضلة");

        setFavorites(favorites.filter((fav) => fav.id !== existingFavorite.id));
        setMessageText("✔ تمت إزالة المنتج من المفضلة!");
        setMessageType("success");
      } else {
        const response = await fetch(FAVORITE_API, {
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

        if (!response.ok) throw new Error("فشل في إضافة المنتج إلى المفضلة");

        const newFavorite = await response.json();
        setFavorites([...favorites, newFavorite.data]);
        setMessageText("✔ تمت إضافة المنتج إلى المفضلة!");
        setMessageType("success");
      }
    } catch (error) {
      setMessageText("❌ حدث خطأ أثناء الإضافة!");
      setMessageType("error");
    }

    setShowMessage(true);
  };

  const fetchWishlist = async (token) => {
    try {
      const response = await fetch(FAVORITE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("فشل في جلب قائمة المفضلة");
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
  };

  return (
    <div className="container randomProduct my-2">
      <div className="flexable">
        <h1 className="text-center text-ran fw-bold mb-2">منتجات مرشحة</h1>
        <button
          className="btn btn-primary my-3 p-2"
          onClick={() => navigate("/products")}
        >
          رؤية المزيد من المنتجات
        </button>
      </div>

      {isFetching && (
        <div className="loading-products">⏳ جارٍ تحميل المنتجات...</div>
      )}
      {isLoading && <div className="loading-spinner">⏳ جارٍ المعالجة...</div>}
      {message && <div className="message-box">{message}</div>}

      {!isFetching && (
        <div className="product-list div-0">
          {randomProducts.map((product) => {
            const isFavorite = favorites.some(
              (fav) =>
                fav.product_id === product.id && fav.product_type === "mobile"
            );

            return (
              <div key={product.id} className="product-card div-1">
                {/* <Link to={`/mobiles/${product.id}`}> */}
                  <img
                    src={
                      `http://localhost:8000${product.image_cover}` ||
                      "https://via.placeholder.com/300"
                    }
                    width="100%"
                    alt={product.title || "صورة المنتج"}
                    className="imgProduct rounded-3"
                  />
                {/* </Link> */}

                <div
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(product);
                  }}
                >
                  <FaHeart
                    style={{
                      color: isFavorite ? "red" : "gray",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  />
                </div>

                {/* {brands.length > 0 && product.brand_id && (
                  <p className="product-pric text-center fw-800">
                    {brands.find((brand) => brand.id === product.brand_id)
                      ?.name || "غير معروف"}
                  </p>
                )} */}

                {product.title && (
                  <p className="product-title text-center fw-bold text-success">
                    {product.title}
                  </p>
                )}

                {product.price && (
                  <p className="product-price text-center fw-800">
                    {product.price} جنية
                  </p>
                )}

                <div className="row justify-content-between align-items-center px-4">
                  <button
                    className="btn btn-success col-12 rounded-pill"
                    onClick={() => navigate(`/mobiles/${product.id}`)}
                    disabled={isLoading}
                  >
                    {/* {isLoading ? (
                      <span className="loader"></span>
                    ) : (
                      <> أضف الى {<FaCartPlus />} </>
                    )} */}
                    عرض التفاصيل
                  </button>
                  {/* <div
                    className="favorite-btn col-1"
                    onClick={() => handleFavorite(product)}
                  >
                    <FaHeart
                      style={{
                        color: isFavorite ? "red" : "gray",
                        fontSize: "30px",
                        cursor: "pointer",
                      }}
                    />
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Snackbar
        open={showMessage}
        autoHideDuration={3000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity={messageType}
          sx={{ width: "100%" }}
        >
          {messageText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Home;
