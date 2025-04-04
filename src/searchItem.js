// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./home.css";
// import "./search.css";
// import { FaCartPlus, FaHeart } from "react-icons/fa";
// import MyNavbar from "./navbar";

// export default function SearchResult() {
//   const [products, setProducts] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [showMessage, setShowMessage] = useState(false);
//   const [messageText, setMessageText] = useState("");
//   const [favorites, setFavorites] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/mobiles");
//         const data = await response.json();
//         setProducts(data.data || []);
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

//   const filteredProducts = products.filter(product => {
//     const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const brand = brands.find(b => b.id === product.brand_id);
//     const matchesBrand = brand ? brand.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    
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
//               Authorization: `Bearer ${userToken}`
//             }
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

//     const existingFavorite = favorites.find(fav => fav.product_id === product.id);

//     try {
//       if (existingFavorite) {
//         const response = await fetch(`http://localhost:8000/api/wishlist/${existingFavorite.id}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${userToken}` }
//         });

//         if (response.ok) {
//           setFavorites(favorites.filter(fav => fav.id !== existingFavorite.id));
//           setMessageText("❌ تمت الإزالة من المفضلة!");
//         } else {
//           setMessageText("❌ فشل الحذف! حاول مرة أخرى.");
//         }
//       } else {
//         const response = await fetch("http://localhost:8000/api/wishlist", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${userToken}`
//           },
//           body: JSON.stringify({
//             user_id: userId,
//             product_id: product.id,
//             product_type: "mobile"
//           })
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
//     <MyNavbar />
//     <div className="container" style={{ direction: "rtl", marginTop: "85px" }}>
//       {showMessage && <div className="cart-message">{messageText}</div>}

//       <div className="search-container mb-4">
//         <input
//           type="text"
//           placeholder="ابحث عن منتج أو ماركة..."
//           className="form-control"
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />
//       </div>

//       <h2 className="fw-bold">
//         {searchQuery ? `نتائج البحث عن "${searchQuery}"` : "جميع المنتجات"}
//       </h2>
      
//       <div className="div-main div-0">
//         {filteredProducts.map((product) => {
//           const brand = brands.find((b) => b.id === product.brand_id);
//           const isFavorite = favorites.some(fav => fav.product_id === product.id);

//           return (
//             <div key={product.id} className="product-card div-1">
//               <Link to={`/mobiles/${product.id}`}>
//                 <img
//                   src={`http://localhost:8000${product.image_cover}`}
//                   width="100%"
//                   alt={product.title || "صورة المنتج"}
//                   className="product-image rounded-3"
//                 />
//               </Link>

//               <p className="product-brand text-center fw-800">
//                 {brand ? brand.name : "غير معروف"}
//               </p>

//               <p className="product-title text-center fw-bold">
//                 {product.title}
//               </p>
//               <p className="product-price text-center fw-800">
//                 {product.price} جنية
//               </p>

//               <div className="row justify-content-between align-items-center px-3">
//                 <button
//                   className="btn btn-success col-10"
//                   disabled={isLoading && currentProduct === product.id}
//                   onClick={() => handleAddToCart(product)}
//                 >
//                   {isLoading && currentProduct === product.id ? (
//                     <span className="loader"></span>
//                   ) : (
//                     <> أضف الى {<FaCartPlus />}</>
//                   )}
//                 </button>
//                 <div
//                   className="favorite-btn col-1"
//                   onClick={() => handleFavorite(product)}
//                 >
//                   <FaHeart
//                     style={{
//                       color: isFavorite ? "red" : "gray",
//                       fontSize: "30px",
//                       cursor: "pointer",
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//     </>
//   );
// }









import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import "./search.css";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import MyNavbar from "./navbar";
import { Footer } from "./home";

export default function SearchResult() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/mobiles");
        const data = await response.json();
        setProducts(data.data || []);
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const brand = brands.find(b => b.id === product.brand_id);
    const matchesBrand = brand ? brand.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    
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
              Authorization: `Bearer ${userToken}`
            }
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

    const existingFavorite = favorites.find(fav => fav.product_id === product.id);

    try {
      if (existingFavorite) {
        const response = await fetch(`http://localhost:8000/api/wishlist/${existingFavorite.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userToken}` }
        });

        if (response.ok) {
          setFavorites(favorites.filter(fav => fav.id !== existingFavorite.id));
          setMessageText("❌ تمت الإزالة من المفضلة!");
        } else {
          setMessageText("❌ فشل الحذف! حاول مرة أخرى.");
        }
      } else {
        const response = await fetch("http://localhost:8000/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: product.id,
            product_type: "mobile"
          })
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
    <div className="container" style={{ direction: "rtl", marginTop: "85px" }}>
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
      
      <div className="div-main div-0">
        {filteredProducts.map((product) => {
          const brand = brands.find((b) => b.id === product.brand_id);
          const isFavorite = favorites.some(fav => fav.product_id === product.id);

          return (
            <div key={product.id} className="product-card div-1">
              <Link to={`/mobiles/${product.id}`}>
                <img
                  src={`http://localhost:8000${product.image_cover}`}
                  width="100%"
                  alt={product.title || "صورة المنتج"}
                  className="product-image rounded-3"
                />
              </Link>

              <p className="product-brand text-center fw-800">
                {brand ? brand.name : "غير معروف"}
              </p>

              <p className="product-title text-center fw-bold">
                {product.title}
              </p>
              <p className="product-price text-center fw-800">
                {product.price} جنية
              </p>

              <div className="row justify-content-between align-items-center px-3">
                <button
                  className="btn btn-success col-10"
                  disabled={isLoading && currentProduct === product.id}
                  onClick={() => handleAddToCart(product)}
                >
                  {isLoading && currentProduct === product.id ? (
                    <span className="loader"></span>
                  ) : (
                    <> أضف الى {<FaCartPlus />}</>
                  )}
                </button>
                <div
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <Footer />
    </>
  );
}
