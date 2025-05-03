// // import React, { useEffect, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useDispatch } from "react-redux";
// // import "./products.css";
// // import { Footer } from "../landing/home";
// // import { FaCartPlus, FaHeart } from "react-icons/fa";
// // import SearchResult from "./search/searchItem";
// // import MyNavbar from "../landing/navbar";
// // import { ScrollToHashElement } from "../landing/Slider";

// // export default function Ffetch() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const [products, setProducts] = useState([]);
// //   const [filteredProducts, setFilteredProducts] = useState([]);
// //   const [brands, setBrands] = useState({});
// //   const [selectedCategory, setSelectedCategory] = useState("الكل");
// //   const [showMessage, setShowMessage] = useState(false);
// //   const [messageText, setMessageText] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isFetching, setIsFetching] = useState(true);
// //   const [currentProduct, setCurrentProduct] = useState(null);
// //   const [favorites, setFavorites] = useState([]);
// //   const location = useLocation();
// //   const searchParams = new URLSearchParams(location.search);
// //   const searchQuery = searchParams.get("search");
// //   const [accessories, setAccessories] = useState([]);
// //   const [filteredAccessories, setFilteredAccessories] = useState([]);

// //   const BRAND_API = `http://localhost:8000/api/brands`;
// //   const WISHLIST_API = `http://localhost:8000/api/wishlist`;
// //   const ACCESSORIES_API = `http://localhost:8000/api/accessories`;

// //   useEffect(() => {
// //     setIsFetching(true);
// //     fetch("http://localhost:8000/api/mobiles")
// //       .then((res) => res.json())
// //       .then((json) => {
// //         setProducts(json.data || []);
// //         setFilteredProducts(json.data || []);
// //       })
// //       .catch((error) => console.error("Error fetching products:", error));

// //     fetch(ACCESSORIES_API)
// //       .then((res) => {
// //         if (!res.ok) {
// //           throw new Error("Network response was not ok");
// //         }
// //         return res.json();
// //       })
// //       .then((json) => {
// //         const accessoriesWithBrand =
// //           json.data?.map((item) => ({
// //             ...item,
// //             brand_id: item.brand_id || null,
// //             product_type: "accessory", // إضافة نوع المنتج للتمييز
// //           })) || []; // استخدام nullish coalescing للتعامل مع بيانات غير متوقعة
// //         setAccessories(accessoriesWithBrand);
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching accessories:", error);
// //         setAccessories([]); // تعيين مصفوفة فارغة في حالة الخطأ
// //       })

// //       .finally(() => setIsFetching(false));

// //     // جلب قائمة المفضلة من السيرفر عند التحميل
// //     const userToken = localStorage.getItem("user_token");
// //     if (userToken) {
// //       fetch(WISHLIST_API, {
// //         headers: {
// //           Authorization: `Bearer ${userToken}`,
// //         },
// //       })
// //         .then((res) => res.json())
// //         .then((data) => {
// //           if (data.data) {
// //             setFavorites(data.data);
// //           }
// //         })
// //         .catch((error) => console.error("Error fetching wishlist:", error));
// //     }
// //   }, []);

// //   useEffect(() => {
// //     // if (products.length <= 0) return;
// //     fetch(BRAND_API)
// //       .then((res) => res.json())
// //       .then((json) => {
// //         const brandMap = {};
// //         json.data.forEach((brand) => {
// //           brandMap[brand.id] = {
// //             name: brand.name,
// //             image: brand.image ? `http://localhost:8000${brand.image}` : null,
// //           };
// //         });
// //         setBrands(brandMap);
// //       })
// //       .catch((error) => console.error("Error fetching brands:", error));
// //   }, [products]);

// //   useEffect(() => {
// //     if (selectedCategory === "الكل") {
// //       setFilteredProducts(products);
// //       setFilteredAccessories(accessories);
// //     } else {
// //       setFilteredProducts(
// //         products.filter((p) => p.brand_id === selectedCategory)
// //       );
// //       setFilteredAccessories(
// //         accessories.filter((a) => a.brand_id === selectedCategory)
// //       );
// //     }
// //   }, [selectedCategory, products, accessories]);

// //   const handleAddToCart = async (product) => {
// //     const userToken = localStorage.getItem("user_token");

// //     if (!userToken) {
// //       setMessageText("❌ يجب تسجيل الدخول أولاً!");
// //       setShowMessage(true);
// //       setTimeout(() => setShowMessage(false), 3000);
// //       setTimeout(() => navigate("/singeup"), 3000);
// //       return;
// //     }

// //     setIsLoading(true);
// //     setCurrentProduct(product.id);

// //     const productType =
// //       product.product_type === "accessories" ? "accessory" : "mobile";

// //     try {
// //       const response = await fetch("http://localhost:8000/api/cart-items", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${userToken}`,
// //         },
// //         body: JSON.stringify({
// //           product_id: product.id,
// //           product_type: productType,
// //           quantity: 1,
// //         }),
// //       });

// //       const result = await response.json();
// //       setShowMessage(true);
// //       setMessageText(
// //         response.ok
// //           ? "✔ تم الإضافة إلى السلة بنجاح!"
// //           : `❌ خطأ: ${result.message || "حدث خطأ!"}`
// //       );
// //     } catch (error) {
// //       setShowMessage(true);
// //       setMessageText("❌ فشل الإضافة! حاول مرة أخرى.");
// //     }

// //     setTimeout(() => setShowMessage(false), 3000);
// //     setIsLoading(false);
// //     setCurrentProduct(null);
// //   };

// //   const handleFavorite = async (product) => {
// //     const userToken = localStorage.getItem("user_token");
// //     const userId = localStorage.getItem("user_id");

// //     if (!userToken || !userId) {
// //       setShowMessage(true);
// //       setMessageText("❌ يجب تسجيل الدخول أولاً!");
// //       setTimeout(() => setShowMessage(false), 3000);
// //       setTimeout(() => navigate("/singeup"), 3000);
// //       return;
// //     }

// //     const isAccessory = product.image ? true : false; // أو أي خاصية أخرى تميز الإكسسوارات
// //     const productType = isAccessory ? "accessory" : "mobile";

// //     const existingFavorite = favorites.find(
// //       (fav) => fav.product_id === product.id && fav.product_type === productType
// //     );

// //     try {
// //       if (existingFavorite) {
// //         // الحذف
// //         const response = await fetch(`${WISHLIST_API}/${existingFavorite.id}`, {
// //           method: "DELETE",
// //           headers: { Authorization: `Bearer ${userToken}` },
// //         });

// //         if (response.ok) {
// //           setFavorites(
// //             favorites.filter((fav) => fav.id !== existingFavorite.id)
// //           );
// //           setMessageText("❌ تمت الإزالة من المفضلة!");
// //         } else {
// //           setMessageText("❌ فشل الحذف! حاول مرة أخرى.");
// //         }
// //       } else {
// //         const response = await fetch(WISHLIST_API, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${userToken}`,
// //           },
// //           body: JSON.stringify({
// //             user_id: userId,
// //             product_id: product.id,
// //             product_type: productType,
// //           }),
// //         });

// //         if (response.ok) {
// //           const newFavorite = await response.json();
// //           setFavorites([...favorites, newFavorite.data]);
// //           setMessageText("✔ تمت الإضافة إلى المفضلة!");
// //         } else {
// //           setMessageText("❌ فشل الإضافة! حاول مرة أخرى.");
// //         }
// //       }
// //     } catch (error) {
// //       setMessageText("❌ خطأ أثناء الاتصال بالسيرفر!");
// //     }

// //     setShowMessage(true);
// //     setTimeout(() => setShowMessage(false), 2000);
// //   };

// //   return (
// //     <>
// //       <MyNavbar />
// //       <div className="Block container" style={{ marginTop: "85px" }}>
//         // <div className="brand-filter">
//         //   <div
//         //     className={`brand-circle ${
//         //       selectedCategory === "الكل" ? "selected" : ""
//         //     }`}
//         //     onClick={() => setSelectedCategory("الكل")}
//         //   >
//         //     <p>الكل</p>
//         //   </div>
//         //   {Object.keys(brands).map((brandId) => (
//         //     <div
//         //       key={brandId}
//         //       className={`brand-circle ${
//         //         selectedCategory === brandId ? "selected" : ""
//         //       }`}
//         //       onClick={() => setSelectedCategory(brandId)}
//         //     >
//         //       {brands[brandId].image ? (
//         //         <img
//         //           src={brands[brandId].image}
//         //           alt={brands[brandId].name}
//         //           className="brand-image"
//         //         />
//         //       ) : (
//         //         <p>{brands[brandId].name}</p>
//         //       )}
//         //     </div>
//         //   ))}
//         // </div>
// //         <h1 className="" style={{ direction: "rtl" }}>
// //           موبايلات
// //         </h1>
// //       </div>

// //       <div className="div-0 container" id="pproducct">
// //         {showMessage && <div className="cart-message">{messageText}</div>}

// //         {isFetching ? (
// //           <div className="loading-products">⏳ جارٍ تحميل المنتجات...</div>
// //         ) : filteredProducts.length === 0 ? (
// //           <div className="no-products">🚫 لا توجد منتجات متاحة</div>
// //         ) : (
// //           filteredProducts.map((data) => {
// //             const isFavorite = favorites.some(
// //               (fav) => fav.product_id === data.id
// //             );

// //             return (
// //               <div className="div-1 product-card text-center" key={data.id}>
// //                 <div
// //                   className="favorite-btn"
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     handleFavorite(data);
// //                   }}
// //                 >
// //                   <FaHeart style={{ color: isFavorite ? "red" : "gray" }} />
// //                 </div>

// //                 {/* الحالة */}
// //                 <div className={`stock-badge ${data.stock_quantity > 0 ? 'available' : 'not-available'}`}>
// //                   <span className="stock-badge-span" style={{fontSize: "15px",fontWeight: "lighter"}}>
// //                     {data.stock_quantity > 0 ? "متوفر" : "غير متوفر"}
// //                   </span>
// //                 </div>

// //                 <img
// //                   className="imgProduct img-fluid"
// //                   width="100%"
// //                   src={`http://localhost:8000${data.image_cover}`}
// //                   alt={data.title}
// //                 />
// //                 <div className="div2flex">
// //                   <p id="title" className="text-success fw-bolder">
// //                     {data.title}
// //                   </p>
// //                   <p id="Price">{data.price} جنية</p>
// //                   <div className="row justify-content-between align-items-center pl-4">
// //                     <button
// //                       onClick={() => navigate(`/mobiles/${data.id}`)}
// //                       className="btn btn-success w-100 rounded-pill"
// //                     >
// //                       عرض التفاصيل
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             );
// //           })
// //         )}
// //       </div>

// //       <div className="Block container" id="accessory">
// //         <h1 style={{ direction: "rtl" }}>إكسسوارات</h1>
// //       </div>
// //       <div className="div-0 container" id="accessory">
// //         {isFetching ? (
// //           <div className="loading-products">⏳ جارٍ تحميل الإكسسوارات...</div>
// //         ) : filteredAccessories.length === 0 ? (
// //           <div className="no-products">🚫 لا توجد إكسسوارات متاحة</div>
// //         ) : (
// //           filteredAccessories.map((data) => {
// //             const isFavorite = favorites.some(
// //               (fav) => fav.product_id === data.id
// //             );

// //             return (
// //               <div className="div-1 product-card text-center" key={data.id}>
// //                 <div
// //                   className="favorite-btn"
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     handleFavorite(data);
// //                   }}
// //                 >
// //                   <FaHeart style={{ color: isFavorite ? "red" : "gray" }} />
// //                 </div>
// //                 <div
// //                   className="status-btn"
// //                 >

// //                 {/* الحالة */}
// //                 <div className={`stock-badge ${data.stock_quantity > 0 ? 'available' : 'not-available'}`}>
// //                   <span className="stock-badge-span" style={{fontSize: "15px",fontWeight: "lighter"}}>
// //                     {data.stock_quantity > 0 ? "متوفر" : "غير متوفر"}
// //                   </span>
// //                 </div>

// //                 </div>
// //                 <img
// //                   className="imgProduct img-fluid"
// //                   width="100%"
// //                   src={`http://localhost:8000${data.image}`}
// //                   alt={data.title}
// //                 />
// //                 <div className="div2flex">
// //                   <p id="title" className="text-success fw-bolder">
// //                     {data.title}
// //                   </p>
// //                   <p id="Price">{data.price} جنية</p>
// //                   <div className="row justify-content-between align-items-center px-1">
// //                     <button
// //                       className="btn btn-success w-100 rounded-pill"
// //                       onClick={() => navigate(`/accessories/${data.id}`)}
// //                     >
// //                       عرض التفاصيل
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>

// //             );
// //           })
// //         )}
// //       </div>
// //       <ScrollToHashElement />
// //       <Footer />
// //     </>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import "./products.css";
// import { Footer } from "../landing/home";
// import { FaCartPlus, FaHeart, FaTimes } from "react-icons/fa";
// import MyNavbar from "../landing/navbar";
// import { ScrollToHashElement } from "../landing/Slider";

// export default function ProductsPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // States
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [brands, setBrands] = useState({});
//   const [selectedCategory, setSelectedCategory] = useState("الكل");
//   const [showMessage, setShowMessage] = useState(false);
//   const [messageText, setMessageText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetching, setIsFetching] = useState(true);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [favorites, setFavorites] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [filteredAccessories, setFilteredAccessories] = useState([]);

//   // APIs
//   const BASE_URL = "http://localhost:8000/api";
//   const BRAND_API = `${BASE_URL}/brands`;
//   const WISHLIST_API = `${BASE_URL}/wishlist`;
//   const ACCESSORIES_API = `${BASE_URL}/accessories`;

//   // Fetch data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsFetching(true);
//       try {
//         const [productsRes, accessoriesRes, brandsRes] = await Promise.all([
//           fetch(`${BASE_URL}/mobiles`),
//           fetch(ACCESSORIES_API),
//           fetch(BRAND_API)
//         ]);

//         if (!productsRes.ok || !accessoriesRes.ok || !brandsRes.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const productsData = await productsRes.json();
//         const accessoriesData = await accessoriesRes.json();
//         const brandsData = await brandsRes.json();

//         setProducts(productsData.data || []);
//         setFilteredProducts(productsData.data || []);

//         const accessoriesWithType = (accessoriesData.data || []).map(item => ({
//           ...item,
//           product_type: "accessory"
//         }));

//         setAccessories(accessoriesWithType);
//         setFilteredAccessories(accessoriesWithType);

//         const brandMap = {};
//         (brandsData.data || []).forEach(brand => {
//           brandMap[brand.id] = {
//             name: brand.name,
//             image: brand.image ? `http://localhost:8000${brand.image}` : null
//           };
//         });
//         setBrands(brandMap);

//         // Fetch wishlist if user is logged in
//         const userToken = localStorage.getItem("user_token");
//         if (userToken) {
//           const wishlistRes = await fetch(WISHLIST_API, {
//             headers: { Authorization: `Bearer ${userToken}` }
//           });

//           if (wishlistRes.ok) {
//             const wishlistData = await wishlistRes.json();
//             setFavorites(wishlistData.data || []);
//           }
//         }

//       } catch (error) {
//         console.error("Error fetching data:", error);
//         showTempMessage("❌ فشل في تحميل البيانات!", 3000);
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter products by category
//   useEffect(() => {
//     if (selectedCategory === "الكل") {
//       setFilteredProducts(products);
//       setFilteredAccessories(accessories);
//     } else {
//       setFilteredProducts(products.filter(p => p.brand_id == selectedCategory));
//       setFilteredAccessories(accessories.filter(a => a.brand_id == selectedCategory));
//     }
//   }, [selectedCategory, products, accessories]);

//   // Handle add to cart
//   const handleAddToCart = async (product) => {
//     const userToken = localStorage.getItem("user_token");
//     if (!userToken) {
//       showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () => navigate("/login"));
//       return;
//     }

//     setIsLoading(true);
//     setCurrentProduct(product.id);

//     try {
//       const productType = product.product_type || "mobile";
//       const response = await fetch(`${BASE_URL}/cart-items`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userToken}`,
//         },
//         body: JSON.stringify({
//           product_id: product.id,
//           product_type: productType,
//           quantity: 1,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         showTempMessage("✔ تمت الإضافة إلى السلة بنجاح!", 3000);
//       } else {
//         showTempMessage(`❌ ${result.message || "حدث خطأ أثناء الإضافة!"}`, 3000);
//       }
//     } catch (error) {
//       showTempMessage("❌ فشل الاتصال بالسيرفر!", 3000);
//     } finally {
//       setIsLoading(false);
//       setCurrentProduct(null);
//     }
//   };

//   // Handle favorite
//   const handleFavorite = async (product) => {
//     const userToken = localStorage.getItem("user_token");
//     const userId = localStorage.getItem("user_id");

//     if (!userToken || !userId) {
//       showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () => navigate("/login"));
//       return;
//     }

//     const productType = product.product_type || "mobile";
//     const existingFavorite = favorites.find(
//       fav => fav.product_id === product.id && fav.product_type === productType
//     );

//     try {
//       if (existingFavorite) {
//         const response = await fetch(`${WISHLIST_API}/${existingFavorite.id}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${userToken}` }
//         });

//         if (response.ok) {
//           setFavorites(favorites.filter(fav => fav.id !== existingFavorite.id));
//           showTempMessage("❌ تمت الإزالة من المفضلة!", 2000);
//         }
//       } else {
//         const response = await fetch(WISHLIST_API, {
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
//           showTempMessage("✔ تمت الإضافة إلى المفضلة!", 2000);
//         }
//       }
//     } catch (error) {
//       showTempMessage("❌ خطأ أثناء الاتصال بالسيرفر!", 2000);
//     }
//   };

//   // Helper function to show temporary messages
//   const showTempMessage = (message, duration, callback) => {
//     setMessageText(message);
//     setShowMessage(true);
//     setTimeout(() => {
//       setShowMessage(false);
//       if (callback) callback();
//     }, duration);
//   };

//   // Render product card
//   const renderProductCard = (product, isAccessory = false) => {
//     const isFavorite = favorites.some(fav =>
//       fav.product_id === product.id &&
//       fav.product_type === (isAccessory ? "accessory" : "mobile")
//     );

//     const imageUrl = isAccessory
//       ? product.image
//         ? `http://localhost:8000${product.image}`
//         : "/placeholder-product.png"
//       : product.image_cover
//         ? `http://localhost:8000${product.image_cover}`
//         : "/placeholder-product.png";

//     return (
//       <div className="product-card" key={`${isAccessory ? 'acc-' : 'prod-'}${product.id}`}>
//         <div className="product-header">
//           <button
//             className="favorite-btn"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleFavorite(product);
//             }}
//             aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
//           >
//             <FaHeart className={isFavorite ? "favorite-active" : ""} />
//           </button>

//           <span className={`stock-badge ${
//             product.stock_quantity > 0 ? "in-stock" : "out-of-stock"
//           }`}>
//             {product.stock_quantity > 0 ? "متوفر" : "غير متوفر"}
//           </span>

//           <img
//             src={imageUrl}
//             alt={product.title}
//             onError={(e) => e.target.src = "/placeholder-product.png"}
//           />
//         </div>

//         <div className="product-body">
//           <h3>{product.title}</h3>
//           <p className="price">{product.price} جنيه</p>
//         </div>

//         <div className="product-actions">
//           <button
//             className="details-btn"
//             onClick={() => navigate(`/${isAccessory ? 'accessories' : 'mobiles'}/${product.id}`)}
//           >
//             التفاصيل
//           </button>
//           <button
//             className="cart-btn"
//             onClick={() => handleAddToCart(product)}
//             disabled={isLoading || product.stock_quantity <= 0}
//             aria-disabled={isLoading || product.stock_quantity <= 0}
//           >
//             {isLoading && currentProduct === product.id ? (
//               "جاري الإضافة..."
//             ) : (
//               <>
//                 <FaCartPlus /> إضافة للسلة
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <MyNavbar />
//       <ScrollToHashElement />

//       <main className="products-page">
//       <div className="brand-filter">
//           <div
//             className={`brand-circle ${
//               selectedCategory === "الكل" ? "selected" : ""
//             }`}
//             onClick={() => setSelectedCategory("الكل")}
//           >
//             <p>الكل</p>
//           </div>
//           {Object.keys(brands).map((brandId) => (
//             <div
//               key={brandId}
//               className={`brand-circle ${
//                 selectedCategory === brandId ? "selected" : ""
//               }`}
//               onClick={() => setSelectedCategory(brandId)}
//             >
//               {brands[brandId].image ? (
//                 <img
//                   src={brands[brandId].image}
//                   alt={brands[brandId].name}
//                   className="brand-image"
//                 />
//               ) : (
//                 <p>{brands[brandId].name}</p>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Products Section */}
//         <section className="products-section">
//           <h2>موبايلات</h2>
//           <div className="products-grid">
//             {isFetching ? (
//               <div className="loading">جاري التحميل...</div>
//             ) : filteredProducts.length > 0 ? (
//               filteredProducts.map(product => renderProductCard(product))
//             ) : (
//               <div className="no-products">لا توجد منتجات متاحة</div>
//             )}
//           </div>
//         </section>

//         {/* Accessories Section */}
//         <section className="products-section">
//           <h2>إكسسوارات</h2>
//           <div className="products-grid">
//             {isFetching ? (
//               <div className="loading">جاري التحميل...</div>
//             ) : filteredAccessories.length > 0 ? (
//               filteredAccessories.map(accessory => renderProductCard(accessory, true))
//             ) : (
//               <div className="no-products">لا توجد إكسسوارات متاحة</div>
//             )}
//           </div>
//         </section>

//         {/* Message Notification */}
//         {showMessage && (
//           <div className={`notification ${messageText.includes('✔') ? 'success' : 'error'}`}>
//             <span>{messageText}</span>
//             <button onClick={() => setShowMessage(false)} aria-label="إغلاق">
//               <FaTimes />
//             </button>
//           </div>
//         )}
//       </main>

//       <Footer />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./products.css";
import { Footer } from "../landing/home";
import { FaCartPlus, FaHeart, FaTimes } from "react-icons/fa";
import { Collapse } from "react-bootstrap";
import MyNavbar from "../landing/navbar";
import { ScrollToHashElement } from "../landing/Slider";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // States
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
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [openProductId, setOpenProductId] = useState(null);

  // APIs
  const BASE_URL = "http://localhost:8000/api";
  const BRAND_API = `${BASE_URL}/brands`;
  const WISHLIST_API = `${BASE_URL}/wishlist`;
  const ACCESSORIES_API = `${BASE_URL}/accessories`;

  // Fetch data on component mount
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
                colors: detailsData.data?.colors, // استخدام البيانات الجديدة
                selectedColor: null,
              };
            } catch (error) {
              console.error(
                `Error fetching details for product ${product.id}:`,
                error
              );
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

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === "الكل") {
      setFilteredProducts(products);
      setFilteredAccessories(accessories);
    } else {
      setFilteredProducts(
        products.filter((p) => p.brand_id == selectedCategory)
      );
      setFilteredAccessories(
        accessories.filter((a) => a.brand_id == selectedCategory)
      );
    }
  }, [selectedCategory, products, accessories]);

  // Handle add to cart
  const handleAddToCart = async (product) => {
    setOpenProductId(openProductId === product.id ? null : product.id);
  };

  const confirmAddToCart = async (product) => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () =>
        navigate("/login")
      );
      return;
    }

    setIsLoading(true);
    setCurrentProduct(product.id);

    try {
      const productType = product.product_type || "mobile";
      const response = await fetch(`${BASE_URL}/cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          product_type: productType,
          quantity: 1,
          product_color_id: product.selectedColor?.id || null,
        }),
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
  };

  // Handle favorite
  const handleFavorite = async (product) => {
    const userToken = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");

    if (!userToken || !userId) {
      showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () =>
        navigate("/login")
      );
      return;
    }

    const productType = product.product_type || "mobile";
    const existingFavorite = favorites.find(
      (fav) => fav.product_id === product.id && fav.product_type === productType
    );

    try {
      if (existingFavorite) {
        const response = await fetch(`${WISHLIST_API}/${existingFavorite.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.ok) {
          setFavorites(
            favorites.filter((fav) => fav.id !== existingFavorite.id)
          );
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

  // Handle color selection
  const handleColorSelect = (productId, color) => {
    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedColor: color }
          : product
      )
    );
  };

  // Helper function to show temporary messages
  const showTempMessage = (message, duration, callback) => {
    setMessageText(message);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      if (callback) callback();
    }, duration);
  };

  // Render product card
  const renderProductCard = (product, isAccessory = false) => {
    const isFavorite = favorites.some(
      (fav) =>
        fav.product_id === product.id &&
        fav.product_type === (isAccessory ? "accessory" : "mobile")
    );

    const imageUrl = isAccessory
      ? product.image
        ? `http://localhost:8000${product.image}`
        : "/placeholder-product.png"
      : product.image_cover
      ? `http://localhost:8000${product.image_cover}`
      : "/placeholder-product.png";

    return (
      <div
        className="product-card"
        key={`${isAccessory ? "acc-" : "prod-"}${product.id}`}
      >
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

          <span
            className={`stock-badge ${
              product.stock_quantity > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.stock_quantity > 0 ? "متوفر" : "غير متوفر"}
          </span>

          <img
            src={imageUrl}
            alt={product.title}
            onError={(e) => (e.target.src = "/placeholder-product.png")}
          />
        </div>

        <div className="product-body">
          <h3>{product.title}</h3>
          <p className="price">{product.price} جنيه</p>
        </div>

        <div className="product-actions">
          <button
            className="details-btn"
            onClick={() =>
              navigate(
                `/${isAccessory ? "accessories" : "mobiles"}/${product.id}`
              )
            }
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
                      }}
                      title={color.color}
                    >
                      {product.selectedColor?.id === color.id && (
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
                confirmAddToCart(product);
              }}
              disabled={
                isLoading ||
                (!isAccessory &&
                  product.colors?.length > 0 &&
                  !product.selectedColor)
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
  };

  return (
    <>
      <MyNavbar />
      <ScrollToHashElement />

      <main className="products-page">
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

        {/* Products Section */}
        <section className="products-section">
          <h2>موبايلات</h2>
          <div className="products-grid">
            {isFetching ? (
              <div className="loading">جاري التحميل...</div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => renderProductCard(product))
            ) : (
              <div className="no-products">لا توجد منتجات متاحة</div>
            )}
          </div>
        </section>

        {/* Accessories Section */}
        <section className="products-section">
          <h2>إكسسوارات</h2>
          <div className="products-grid">
            {isFetching ? (
              <div className="loading">جاري التحميل...</div>
            ) : filteredAccessories.length > 0 ? (
              filteredAccessories.map((accessory) =>
                renderProductCard(accessory, true)
              )
            ) : (
              <div className="no-products">لا توجد إكسسوارات متاحة</div>
            )}
          </div>
        </section>

        {/* Message Notification */}
        {showMessage && (
          <div
            className={`notification ${
              messageText.includes("✔") ? "success" : "error"
            }`}
          >
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
