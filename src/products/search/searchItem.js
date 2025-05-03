// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../../landing/home.css";
// import "./search.css";
// import { FaCartPlus, FaHeart } from "react-icons/fa";
// import MyNavbar from "../../landing/navbar";
// import { Footer } from "../../landing/home";

// export default function SearchResult() {
//   const [products, setProducts] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [showMessage, setShowMessage] = useState(false);
//   const [messageText, setMessageText] = useState("");
//   const [favorites, setFavorites] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [mobiles, setMobiles] = useState([]);
//   const [accessories, setAccessories] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         // جلب الموبايلات
//         const mobilesResponse = await fetch(
//           "http://localhost:8000/api/mobiles"
//         );
//         const mobilesData = await mobilesResponse.json();
//         setMobiles(mobilesData.data || []);

//         // جلب الاكسسوارات
//         const accessoriesResponse = await fetch(
//           "http://localhost:8000/api/accessories"
//         );
//         const accessoriesData = await accessoriesResponse.json();
//         setAccessories(accessoriesData.data || []);
//       } catch (error) {
//         console.error("❌ خطأ في جلب المنتجات:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/brands");
//         const data = await response.json();
//         setBrands(data.data || []);
//       } catch (error) {
//         console.error("❌ خطأ في جلب البراندات:", error);
//       }
//     };

//     fetchBrands();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // const filteredProducts = products.filter(product => {
//   //   const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
//   //   const brand = brands.find(b => b.id === product.brand_id);
//   //   const matchesBrand = brand ? brand.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;

//   //   return matchesSearch || matchesBrand;
//   // });

//   const filteredProducts = [...mobiles, ...accessories].filter((product) => {
//     const matchesSearch = product.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const brand = brands.find((b) => b.id === product.brand_id);
//     const matchesBrand = brand
//       ? brand.name.toLowerCase().includes(searchQuery.toLowerCase())
//       : false;

//     return matchesSearch || matchesBrand;
//   });

//   const handleAddToCart = async (product) => {
//     const userToken = localStorage.getItem("user_token");

//     if (!userToken) {
//       setMessageText("❌ يجب تسجيل الدخول أولاً!");
//       setShowMessage(true);
//       setTimeout(() => setShowMessage(false), 3000);
//       setTimeout(() => navigate("/singeup"), 3000);
//       return;
//     }

//     setIsLoading(true);
//     setCurrentProduct(product.id);

//     try {
//       const response = await fetch("http://localhost:8000/api/cart-items", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userToken}`,
//         },
//         body: JSON.stringify({
//           product_id: product.id,
//           product_type: "mobile",
//           quantity: 1,
//         }),
//       });

//       const result = await response.json();
//       setShowMessage(true);
//       setMessageText(
//         response.ok
//           ? "✔ تم الإضافة إلى السلة بنجاح!"
//           : `❌ خطأ: ${result.message || "حدث خطأ!"}`
//       );
//     } catch (error) {
//       setShowMessage(true);
//       setMessageText("❌ فشل الإضافة! حاول مرة أخرى.");
//     }

//     setTimeout(() => setShowMessage(false), 3000);
//     setIsLoading(false);
//     setCurrentProduct(null);
//   };

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       const userToken = localStorage.getItem("user_token");
//       if (userToken) {
//         try {
//           const response = await fetch("http://localhost:8000/api/wishlist", {
//             headers: {
//               Authorization: `Bearer ${userToken}`,
//             },
//           });
//           const data = await response.json();
//           if (data.data) {
//             setFavorites(data.data);
//           }
//         } catch (error) {
//           console.error("❌ خطأ في جلب المفضلة:", error);
//         }
//       }
//     };

//     fetchFavorites();
//   }, []);

//   // const handleFavorite = async (product) => {
//   //   const userToken = localStorage.getItem("user_token");
//   //   const userId = localStorage.getItem("user_id");

//   //   if (!userToken || !userId) {
//   //     setShowMessage(true);
//   //     setMessageText("❌ يجب تسجيل الدخول أولاً!");
//   //     setTimeout(() => setShowMessage(false), 3000);
//   //     setTimeout(() => navigate("/singeup"), 3000);
//   //     return;
//   //   }

//   //   const existingFavorite = favorites.find(
//   //     (fav) => fav.product_id === product.id
//   //   );

//   //   try {
//   //     if (existingFavorite) {
//   //       const response = await fetch(
//   //         `http://localhost:8000/api/wishlist/${existingFavorite.id}`,
//   //         {
//   //           method: "DELETE",
//   //           headers: { Authorization: `Bearer ${userToken}` },
//   //         }
//   //       );

//   //       if (response.ok) {
//   //         setFavorites(
//   //           favorites.filter((fav) => fav.id !== existingFavorite.id)
//   //         );
//   //         setMessageText("❌ تمت الإزالة من المفضلة!");
//   //       } else {
//   //         setMessageText("❌ فشل الحذف! حاول مرة أخرى.");
//   //       }
//   //     } else {
//   //       const response = await fetch("http://localhost:8000/api/wishlist", {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${userToken}`,
//   //         },
//   //         body: JSON.stringify({
//   //           user_id: userId,
//   //           product_id: product.id,
//   //           product_type: "mobile",
//   //         }),
//   //       });

//   //       if (response.ok) {
//   //         const newFavorite = await response.json();
//   //         setFavorites([...favorites, newFavorite.data]);
//   //         setMessageText("✔ تمت الإضافة إلى المفضلة!");
//   //       } else {
//   //         setMessageText("❌ فشل الإضافة! حاول مرة أخرى.");
//   //       }
//   //     }
//   //   } catch (error) {
//   //     setMessageText("❌ خطأ أثناء الاتصال بالسيرفر!");
//   //   }

//   //   setShowMessage(true);
//   //   setTimeout(() => setShowMessage(false), 2000);
//   // };

//   const handleFavorite = async (product) => {
//     const userToken = localStorage.getItem("user_token");
//     const userId = localStorage.getItem("user_id");

//     if (!userToken || !userId) {
//       setShowMessage(true);
//       setMessageText("❌ يجب تسجيل الدخول أولاً!");
//       setTimeout(() => setShowMessage(false), 3000);
//       setTimeout(() => navigate("/singeup"), 3000);
//       return;
//     }

//     const existingFavorite = favorites.find(
//       (fav) => fav.product_id === product.id
//     );

//     try {
//       if (existingFavorite) {
//         const response = await fetch(
//           `http://localhost:8000/api/wishlist/${existingFavorite.id}`,
//           {
//             method: "DELETE",
//             headers: { Authorization: `Bearer ${userToken}` },
//           }
//         );

//         if (response.ok) {
//           setFavorites(
//             favorites.filter((fav) => fav.id !== existingFavorite.id)
//           );
//           setMessageText("❌ تمت الإزالة من المفضلة!");
//         } else {
//           setMessageText("❌ فشل الحذف! حاول مرة أخرى.");
//         }
//       } else {
//         const productType =
//           product.product_type === "accessory" ? "accessory" : "mobile";

//         const response = await fetch("http://localhost:8000/api/wishlist", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${userToken}`,
//           },
//           body: JSON.stringify({
//             user_id: userId,
//             product_id: product.id,
//             product_type: productType,
//           }),
//         });

//         if (response.ok) {
//           const newFavorite = await response.json();
//           setFavorites([...favorites, newFavorite.data]);
//           setMessageText("✔ تمت الإضافة إلى المفضلة!");
//         } else {
//           setMessageText("❌ فشل الإضافة! حاول مرة أخرى.");
//         }
//       }
//     } catch (error) {
//       setMessageText("❌ خطأ أثناء الاتصال بالسيرفر!");
//     }

//     setShowMessage(true);
//     setTimeout(() => setShowMessage(false), 2000);
//   };

//   return (
//     <>
//       <MyNavbar />
//       <div
//         className="container"
//         style={{ direction: "rtl", marginTop: "85px" }}
//       >
//         {showMessage && <div className="cart-message">{messageText}</div>}

//         <div className="search-container mb-4">
//           <input
//             type="text"
//             placeholder="ابحث عن منتج أو ماركة..."
//             className="form-control"
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </div>

//         <h2 className="fw-bold">
//           {searchQuery ? `نتائج البحث ` : "جميع المنتجات"}
//         </h2>

//         {filteredProducts.length === 0 ? (
//           <div className="text-center py-5">
//             <h4>لا يوجد منتجات بهذا الاسم</h4>
//           </div>
//         ) : (
//           <div className="div-main div-0">
//             {filteredProducts.map((product) => {
//               const brand = brands.find((b) => b.id === product.brand_id);
//               const isFavorite = favorites.some(
//                 (fav) => fav.product_id === product.id
//               );

//               return (
//                 <div
//                   className="div-1 product-card text-center"
//                   key={product.id}
//                 >
//                   <div
//                     className="favorite-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleFavorite(product);
//                     }}
//                   >
//                     <FaHeart style={{ color: isFavorite ? "red" : "gray" }} />
//                   </div>

//                   {/* الحالة */}
//                   <div
//                     className={`stock-badge ${
//                       product.stock_quantity > 0 ? "available" : "not-available"
//                     }`}
//                   >
//                     <span
//                       className="stock-badge-span"
//                       style={{ fontSize: "15px", fontWeight: "lighter" }}
//                     >
//                       {product.stock_quantity > 0 ? "متوفر" : "غير متوفر"}
//                     </span>
//                   </div>

//                   <img
//                     className="imgProduct img-fluid"
//                     width="100%"
//                     src={`http://localhost:8000${
//                       product.image_cover || product.image
//                     }`}
//                     // onClick={() => navigate(`/mobiles/${product.id}`)}
//                     alt={product.title}
//                   />
//                   <div className="div2flex">
//                     {/* <p>{brand ? brand.name : "غير معروف"}</p> */}
//                     <p id="title" className="text-success fw-bolder">
//                       {product.title}
//                     </p>
//                     <p id="Price">{product.price} جنية</p>
//                     <div className="row justify-content-between align-items-center pl-4">
//                       <button
//                         // onClick={() => navigate(`/mobiles/${product.id}`)}
//                         onClick={() =>
//                           navigate(
//                             product.image
//                               ? `/accessories/${product.id}`
//                               : `/mobiles/${product.id}`
//                           )
//                         }
//                         className="btn btn-success col-12 rounded-pill"
//                       >
//                         عرض التفاصيل
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./search.css";
import { FaCartPlus, FaHeart, FaTimes } from "react-icons/fa";
import { Collapse } from "react-bootstrap";
import MyNavbar from "../../landing/navbar";
import { Footer } from "../../landing/home";
import { ScrollToHashElement } from "../../landing/Slider";

export default function SearchResult() {
  const BASE_URL = "http://localhost:8000/api";
  const ACCESSORIES_API = `${BASE_URL}/accessories`;
  const BRAND_API = `${BASE_URL}/brands`;
  const WISHLIST_API = `${BASE_URL}/wishlist`;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [brands, setBrands] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openProductId, setOpenProductId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const [productsRes, accessoriesRes, brandsRes] = await Promise.all([
          fetch(`${BASE_URL}/mobiles`),
          fetch(ACCESSORIES_API),
          fetch(BRAND_API),
        ]);

        if (!productsRes.ok || !accessoriesRes.ok || !brandsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const accessoriesData = await accessoriesRes.json();
        const brandsData = await brandsRes.json();

        // جلب تفاصيل كل منتج (بما فيها الألوان)
        const productsWithDetails = await Promise.all(
          (productsData.data || []).map(async (product) => {
            try {
              const token = localStorage.getItem("user_token");
              const headers = token ? { Authorization: `Bearer ${token}` } : {};

              const detailsRes = await fetch(
                `${BASE_URL}/mobiles/${product.id}`,
                { headers }
              );

              const detailsData = await detailsRes.json();
              return {
                ...product,
                colors: detailsData.data?.colors || [],
                selectedColor: null,
              };
            } catch (error) {
              console.error(
                `Error fetching details for product ${product.id}:`,
                error
              );
              return {
                ...product,
                colors: [],
                selectedColor: null,
              };
            }
          })
        );

        setProducts(productsWithDetails);
        setFilteredProducts(productsWithDetails);

        const accessoriesWithType = (accessoriesData.data || []).map(
          (item) => ({
            ...item,
            product_type: "accessory",
          })
        );

        setAccessories(accessoriesWithType);
        setFilteredAccessories(accessoriesWithType);

        const brandMap = {};
        (brandsData.data || []).forEach((brand) => {
          brandMap[brand.id] = {
            name: brand.name,
            image: brand.image ? `http://localhost:8000${brand.image}` : null,
          };
        });
        setBrands(brandMap);

        // Fetch wishlist if user is logged in
        const userToken = localStorage.getItem("user_token");
        if (userToken) {
          const wishlistRes = await fetch(WISHLIST_API, {
            headers: { Authorization: `Bearer ${userToken}` },
          });

          if (wishlistRes.ok) {
            const wishlistData = await wishlistRes.json();
            setFavorites(wishlistData.data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showTempMessage("❌ فشل في تحميل البيانات!", 3000);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filteredProds = products.filter(product => 
      product.title.toLowerCase().includes(query) ||
      (brands[product.brand_id]?.name?.toLowerCase().includes(query))
    );
    
    const filteredAccs = accessories.filter(accessory => 
      accessory.title.toLowerCase().includes(query) ||
      (brands[accessory.brand_id]?.name?.toLowerCase().includes(query))
    );
    
    setFilteredProducts(filteredProds);
    setFilteredAccessories(filteredAccs);
  };

  const handleColorSelect = (productId, color) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, selectedColor: color } 
          : product
      )
    );
    
    setFilteredProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, selectedColor: color } 
          : product
      )
    );
  };

  const handleAddToCart = async (product) => {
    setOpenProductId(openProductId === product.id ? null : product.id);
  };

  const confirmAddToCart = async (product) => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () => navigate("/login"));
      return;
    }
  
    // التحقق من أن المنتج موبايل ويتطلب لوناً
    const isMobile = !product.image;
    const requiresColor = isMobile && product.colors && product.colors.length > 0;
    
    if (requiresColor && !product.selectedColor) {
      showTempMessage("❌ يجب اختيار لون للمنتج أولاً!", 3000);
      return;
    }
  
    setIsLoading(true);
    setCurrentProduct(product.id);
  
    try {
      const productType = isMobile ? "mobile" : "accessory";
      const requestBody = {
        product_id: product.id,
        product_type: productType,
        quantity: 1,
      };
  
      // إضافة product_color_id بدلاً من color_id
      if (requiresColor && product.selectedColor) {
        requestBody.product_color_id = product.selectedColor.id; // التعديل هنا
      }
  
      const response = await fetch(`${BASE_URL}/cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json();
      if (response.ok) {
        showTempMessage("✔ تمت الإضافة إلى السلة بنجاح!", 3000);
        setOpenProductId(null);
      } else {
        showTempMessage(`❌ ${result.message || "حدث خطأ أثناء الإضافة!"}`, 3000);
      }
    } catch (error) {
      showTempMessage("❌ فشل الاتصال بالسيرفر!", 3000);
    } finally {
      setIsLoading(false);
      setCurrentProduct(null);
    }
  };

  const handleFavorite = async (product) => {
    const userToken = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");

    if (!userToken || !userId) {
      showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () => navigate("/login"));
      return;
    }

    const productType = product.image ? "accessory" : "mobile";
    const existingFavorite = favorites.find(
      fav => fav.product_id === product.id && fav.product_type === productType
    );

    try {
      if (existingFavorite) {
        const response = await fetch(`${BASE_URL}/wishlist/${existingFavorite.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.ok) {
          setFavorites(favorites.filter(fav => fav.id !== existingFavorite.id));
          showTempMessage("❌ تمت الإزالة من المفضلة!", 2000);
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
          showTempMessage("✔ تمت الإضافة إلى المفضلة!", 2000);
        }
      }
    } catch (error) {
      showTempMessage("❌ خطأ أثناء الاتصال بالسيرفر!", 2000);
    }
  };

  const showTempMessage = (message, duration, callback) => {
    setMessageText(message);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      if (callback) callback();
    }, duration);
  };

  const renderProductCard = (product) => {
    const isAccessory = !!product.image;
    const isFavorite = favorites.some(
      fav => fav.product_id === product.id && 
      fav.product_type === (isAccessory ? "accessory" : "mobile")
    );

    const imageUrl = isAccessory
      ? `http://localhost:8000${product.image}`
      : `http://localhost:8000${product.image_cover}`;

    return (
      <div className="product-card" key={`${isAccessory ? 'acc-' : 'prod-'}${product.id}`} style={{direction:'ltr'}}>
        <div className="product-header">
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite(product);
            }}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          >
            <FaHeart className={isFavorite ? "favorite-active" : ""} />
          </button>

          <span className={`stock-badge ${
            product.stock_quantity > 0 ? "in-stock" : "out-of-stock"
          }`}>
            {product.stock_quantity > 0 ? "متوفر" : "غير متوفر"}
          </span>

          <img
            src={imageUrl}
            alt={product.title}
            onError={(e) => e.target.src = "/placeholder-product.png"}
          />
        </div>

        <div className="product-body">
          <h3>{product.title}</h3>
          <p className="price">{product.price} جنيه</p>
        </div>

        <div className="product-actions">
          <button
            className="details-btn"
            onClick={() => navigate(`/${isAccessory ? 'accessories' : 'mobiles'}/${product.id}`)}
          >
            التفاصيل
          </button>
          <button
            className="cart-btn"
            onClick={() => handleAddToCart(product)}
            disabled={isLoading || product.stock_quantity <= 0}
            aria-disabled={isLoading || product.stock_quantity <= 0}
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

        <Collapse in={openProductId === product.id} style={{direction:'rtl'}}>
          <div className="product-id-collapse">
            {/* عرض الألوان إذا كانت متوفرة */}
            {!isAccessory && product.colors && product.colors.length > 0 && (
              <div className="color-selection">
                <h6>اختر اللون:</h6>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <div
                      key={color.id}
                      className={`color-option ${
                        product.selectedColor?.id === color.id ? "selected" : ""
                      }`}
                      onClick={() => handleColorSelect(product.id, color)}
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
                        border: "1px solid #ddd"
                      }}
                      title={color.name || color.color}
                    >
                      {product.selectedColor?.id === color.id && (
                        <span className="color-check" style={{
                          color: getContrastColor(color.color || "#ddd")
                        }}>✓</span>
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
                confirmAddToCart(product);
              }}
              disabled={isLoading || (!isAccessory && product.colors?.length > 0 && !product.selectedColor)}
            >
              {isLoading && currentProduct === product.id ? "جاري التأكيد..." : "تأكيد الشراء"}
            </button>
          </div>
        </Collapse>
      </div>
    );
  };

  // دالة مساعدة لتحديد لون النص بناءً على لون الخلفية
  const getContrastColor = (hexColor) => {
    // تحويل اللون من HEX إلى RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // حساب السطوع
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // إرجاع اللون الأبيض أو الأسود بناءً على السطوع
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  return (
    <>
      <MyNavbar />
      <ScrollToHashElement />
      
      <main className="products-page" style={{direction:'rtl'}}>
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
          {searchQuery ? `نتائج البحث عن "${searchQuery}"` : "جميع المنتجات"}
        </h2>

        {(filteredProducts.length === 0 && filteredAccessories.length === 0) ? (
          <div className="no-products">لا توجد منتجات مطابقة للبحث</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => renderProductCard(product))}
            {filteredAccessories.map(accessory => renderProductCard(accessory))}
          </div>
        )}

        {showMessage && (
          <div className={`notification ${messageText.includes('✔') ? 'success' : 'error'}`}>
            <span>{messageText}</span>
            <button onClick={() => setShowMessage(false)} aria-label="إغلاق">
              <FaTimes />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}