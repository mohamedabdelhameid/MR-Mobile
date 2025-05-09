import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../products/productSlice";
import { addToCart } from "../user/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Collapse } from "react-bootstrap";

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
              <Link
                to="https://github.com/abdelrahmanabdelsamie7"
                target="_blank"
              >
                <i className="fa-brands fa-github m-2"></i>
              </Link>
              <Link
                to="https://www.linkedin.com/in/abdelrahman-abdelsamie-hussain-177021221/"
                target="_blank"
              >
                <i className="fa-brands fa-linkedin-in m-2"></i>
              </Link>
              <Link
                to="https://api.whatsapp.com/send/?phone=201129508321"
                target="_blank"
              >
                <i className="fa-brands fa-whatsapp m-2"></i>
              </Link>
              <Link
                to="https://www.facebook.com/profile.php?id=100005529162067"
                target="_blank"
              >
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
              <Link
                to="https://api.whatsapp.com/send/?phone=201280538625"
                target="_blank"
              >
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
              <Link
                to="https://api.whatsapp.com/send/?phone=201120203912"
                target="_blank"
              >
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

const ProductCard = React.memo(
  ({
    product,
    isFavorite,
    openProductId,
    isLoading,
    currentProduct,
    onFavorite,
    onAddToCart,
    onColorSelect,
    onConfirmAdd,
    onDetails,
  }) => {
    const [localSelectedColor, setLocalSelectedColor] = useState(
      product.selectedColor
    );

    // مزامنة اللون المختار مع التحديثات القادمة من المكون الأب
    useEffect(() => {
      setLocalSelectedColor(product.selectedColor);
    }, [product.selectedColor]);

    const handleColorSelection = (color) => {
      setLocalSelectedColor(color);
      onColorSelect(product.id, color);
    };

    return (
      <div className="product-card" style={{ direction: "ltr" }}>
        <div className="product-header">
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(product);
            }}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          >
            <FaHeart className={isFavorite ? "favorite-active" : ""} />
          </button>

          <span
            className={`stock-badge ${
              product.stock_quantity > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.stock_quantity > 0 ? "متوفر" : "غير متوفر"}
          </span>

          <img
            src={
              `http://localhost:8000${product.image_cover}` ||
              "/placeholder-product.png"
            }
            alt={product.title}
            onError={(e) => (e.target.src = "/placeholder-product.png")}
          />
        </div>

        <div className="product-body">
          <h3>{product.title}</h3>
          <p className="price">{product.price} جنيه</p>
        </div>

        <div className="product-actions">
          <button className="details-btn" onClick={onDetails}>
            التفاصيل
          </button>
          <button
            className="cart-btn"
            onClick={onAddToCart}
            disabled={isLoading || product.stock_quantity <= 0}
          >
            {isLoading && currentProduct === product.id ? (
              "جاري الإضافة..."
            ) : (
              <>
                <FaCartPlus /> إضافة للسلة
              </>
            )}
          </button>
        </div>

        <Collapse in={openProductId === product.id}>
          <div className="product-id-collapse">
            {product.colors?.length > 0 && (
              <div className="color-selection" style={{direction:'rtl'}}>
                <h6>اختر اللون:</h6>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <div
                      key={color.id}
                      className={`color-option ${
                        localSelectedColor?.id === color.id ? "selected" : ""
                      }`}
                      onClick={() => handleColorSelection(color)}
                      style={{
                        backgroundColor: color.color || "#ddd",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 5px",
                        cursor: "pointer",
                        border: "1px solid #ddd",
                      }}
                      title={color.name || color.color}
                    >
                      {localSelectedColor?.id === color.id && (
                        <span className="color-check">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="confirm-btn"
              onClick={(e) => {
                e.stopPropagation();
                onConfirmAdd({ ...product, selectedColor: localSelectedColor });
              }}
              disabled={
                isLoading || (product.colors?.length > 0 && !localSelectedColor)
              }
            >
              {isLoading && currentProduct === product.id
                ? "جاري التأكيد..."
                : "تأكيد الشراء"}
            </button>
          </div>
        </Collapse>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // تحسين الأداء بالمقارنة بين الخصائص
    return (
      prevProps.product.selectedColor?.id ===
        nextProps.product.selectedColor?.id &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.openProductId === nextProps.openProductId &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.currentProduct === nextProps.currentProduct
    );
  }
);

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items || []);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [brands, setBrands] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [openProductId, setOpenProductId] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productsWithColors, setProductsWithColors] = useState([]);
  const [randomizedProducts, setRandomizedProducts] = useState([]);

  // API Endpoints
  const BASE_URL = "http://localhost:8000/api";
  const FAVORITE_API = `${BASE_URL}/wishlist`;
  const ADD_TO_CART = `${BASE_URL}/cart-items`;
  const BRAND_API = `${BASE_URL}/brands`;
  const MOBILE_API = `${BASE_URL}/mobiles`;

  // جلب البيانات الأولية
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsFetching(true);
      try {
        await dispatch(fetchProducts());

        const [brandsResponse, favoritesResponse] = await Promise.all([
          fetch(BRAND_API),
          localStorage.getItem("user_token") &&
            fetch(FAVORITE_API, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user_token")}`,
              },
            }),
        ]);

        const brandsData = await brandsResponse.json();
        setBrands(Array.isArray(brandsData.data) ? brandsData.data : []);

        if (favoritesResponse) {
          const favoritesData = await favoritesResponse.json();
          setFavorites(
            Array.isArray(favoritesData.data) ? favoritesData.data : []
          );
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showTempMessage("❌ فشل في تحميل البيانات الأولية", 3000);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // جلب ألوان المنتجات
  useEffect(() => {
    let isMounted = true;

    const fetchColors = async () => {
      try {
        const result = await Promise.all(
          products.map(async (product) => {
            try {
              const res = await fetch(`${MOBILE_API}/${product.id}`);
              const data = await res.json();
              return {
                ...product,
                colors: data.data?.colors || [],
                selectedColor: null,
              };
            } catch (error) {
              console.error(`Error fetching colors for ${product.id}`, error);
              return { ...product, colors: [], selectedColor: null };
            }
          })
        );
        if (isMounted) setProductsWithColors(result);
      } catch (error) {
        console.error("Error fetching product colors:", error);
        if (isMounted) showTempMessage("❌ فشل في تحميل ألوان المنتجات", 3000);
      }
    };

    if (products.length > 0) fetchColors();

    return () => {
      isMounted = false;
    };
  }, [products]);

  // تحديد المنتجات العشوائية
  useEffect(() => {
    if (productsWithColors.length > 0) {
      const uniqueProducts = Array.from(
        new Map(productsWithColors.map((p) => [p.id, p])).values()
      );
      setRandomizedProducts(
        [...uniqueProducts].sort(() => 0.5 - Math.random()).slice(0, 12)
      );
    }
  }, [productsWithColors.length]);

  // عرض رسائل مؤقتة
  const showTempMessage = useCallback((msg, duration, callback) => {
    setMessageText(msg);
    setMessageType(msg.includes("✔") ? "success" : "error");
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      if (callback) callback();
    }, duration);
  }, []);

  // اختيار لون المنتج
  const handleColorSelect = useCallback((productId, color) => {
    setProductsWithColors((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, selectedColor: color }
          : product
      )
    );
  }, []);

  // تأكيد إضافة إلى السلة
  const confirmAddToCart = useCallback(
    async (product) => {
      const userToken = localStorage.getItem("user_token");
      if (!userToken) {
        showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () =>
          navigate("/singeup")
        );
        return;
      }

      setIsLoading(true);
      setCurrentProduct(product.id);

      try {
        const body = {
          product_id: product.id,
          product_type: "mobile",
          quantity: 1,
        };

        if (product.colors?.length > 0) {
          if (!product.selectedColor) {
            showTempMessage("❌ يجب اختيار لون للمنتج!", 3000);
            setIsLoading(false);
            return;
          }
          body.product_color_id = product.selectedColor.id;
        }

        const response = await fetch(ADD_TO_CART, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();
        if (response.ok) {
          showTempMessage("✔ تمت الإضافة إلى السلة بنجاح!", 3000);
          setOpenProductId(null);
        } else {
          showTempMessage(
            `❌ ${result.message || "حدث خطأ أثناء الإضافة!"}`,
            3000
          );
        }
      } catch (error) {
        showTempMessage("❌ فشل الاتصال بالسيرفر!", 3000);
      } finally {
        setIsLoading(false);
        setCurrentProduct(null);
      }
    },
    [navigate, showTempMessage]
  );

  // إدارة المفضلة
  const handleFavorite = useCallback(
    async (product) => {
      const userToken = localStorage.getItem("user_token");
      const userId = localStorage.getItem("user_id");
      if (!userToken || !userId) {
        showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () =>
          navigate("/singeup")
        );
        return;
      }

      const exists = favorites.find((fav) => fav.product_id === product.id);

      try {
        if (exists) {
          const res = await fetch(`${FAVORITE_API}/${exists.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userToken}` },
          });

          if (res.ok) {
            setFavorites(favorites.filter((f) => f.id !== exists.id));
            showTempMessage("✔ تمت الإزالة من المفضلة!", 2000);
          }
        } else {
          const res = await fetch(FAVORITE_API, {
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

          if (res.ok) {
            const newFav = await res.json();
            setFavorites([...favorites, newFav.data]);
            showTempMessage("✔ تمت الإضافة إلى المفضلة!", 2000);
          }
        }
      } catch (err) {
        showTempMessage("❌ خطأ أثناء الاتصال بالسيرفر!", 2000);
      }
    },
    [favorites, navigate, showTempMessage]
  );

  return (
    <div className="container randomProduct my-2" style={{ direction: "rtl" }}>
      <div className="flexable">
        <h1 className="text-center text-ran fw-bold mb-2">منتجات مرشحة</h1>
        <button
          className="btn btn-primary my-3 p-2"
          onClick={() => navigate("/products")}
        >
          رؤية المزيد من المنتجات
        </button>
      </div>

      {isFetching ? (
        <div className="loading-products">⏳ جارٍ تحميل المنتجات...</div>
      ) : (
        <div className="products-grid">
          {randomizedProducts.map((product) => (
            <ProductCard
              key={`${product.id}-${product.selectedColor?.id || "no-color"}`}
              product={product}
              isFavorite={favorites.some(
                (fav) => fav.product_id === product.id
              )}
              openProductId={openProductId}
              isLoading={isLoading}
              currentProduct={currentProduct}
              onFavorite={handleFavorite}
              onAddToCart={() =>
                setOpenProductId((prev) =>
                  prev === product.id ? null : product.id
                )
              }
              onColorSelect={handleColorSelect}
              onConfirmAdd={confirmAddToCart}
              onDetails={() => navigate(`/mobiles/${product.id}`)}
            />
          ))}
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
