import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "./productSlice";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../user/cart/cartSlice";
import { Footer } from "../landing/home";
import MyNavbar from "../landing/navbar";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  Badge,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Swal from "sweetalert2";

const IMAGE_COVER_API = "http://localhost:8000/api/mobiles";
const ADD_TO_USER_CART = "http://localhost:8000/api/cart-items";
const BRAND_API = `http://localhost:8000/api/brands`;

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const COLOR_API = `http://localhost:8000/api/mobiles/${id}`;

  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [imageCover, setImageCover] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [brands, setBrands] = useState({});

  const products = useSelector((state) => state.products.items || []);
  const data = products.find((p) => p.id.toString() === id) || null;

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);

    if (isNaN(newQuantity)) return;

    // التحقق من أن الكمية بين 1 والمخزون المتاح
    if (newQuantity >= 1 && newQuantity <= data.stock_quantity) {
      setQuantity(newQuantity);
    } else if (newQuantity > data.stock_quantity) {
      setQuantity(data.stock_quantity);
      Swal.fire(
        "تنبيه",
        `الحد الأقصى للكمية المتاحة هو ${data.stock_quantity}`,
        "info"
      );
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

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
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${IMAGE_COVER_API}/${id}`);
        const json = await response.json();

        if (json.data) {
          setProductDetails(json.data);
          if (json.data.image_cover) {
            setImageCover(`http://localhost:8000${json.data.image_cover}`);
          }
        }
      } catch (error) {
        console.error("خطأ في جلب بيانات المنتج:", error);
      }
    };

    const fetchColors = async () => {
      try {
        const response = await fetch(COLOR_API);
        const json = await response.json();

        if (json.data?.colors) {
          setColors(json.data.colors);
        } else {
          setColors([]);
        }
      } catch (error) {
        console.error("خطأ في جلب الألوان:", error);
      }
    };

    fetchProductData();
    fetchColors();
  }, [id]);

  useEffect(() => {
    if (selectedColor?.image) {
      setMainImage(`http://localhost:8000${selectedColor.image}`);
    } else if (imageCover) {
      setMainImage(imageCover);
    } else if (data?.images?.length > 0) {
      setMainImage(data.images[0]);
    }
  }, [data, imageCover, selectedColor]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");

    if (quantity > data.stock_quantity) {
      Swal.fire(
        "خطأ",
        `الكمية المطلوبة (${quantity}) تتجاوز المخزون المتاح (${data.stock_quantity})`,
        "error"
      );
      return;
    }

    if (!token || !userId) {
      setMessageText("❌ يجب تسجيل الدخول أولاً!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(ADD_TO_USER_CART, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: id, // سيرسل الـ id الموجود في الـ URL
          product_type: "mobile", // ثابت كما طلبت
          product_color_id: selectedColor
            ? selectedColor.id
            : "a27c4023-5051-4364-a581-72cc5311db57", // إما اللون المحدد أو القيمة الافتراضية
          quantity: quantity, // الكمية المحددة من قبل المستخدم
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في إضافة المنتج إلى السلة");
      }

      setMessageText("✅ تم إضافة المنتج إلى العربة بنجاح!");
      setShowMessage(true);
    } catch (error) {
      console.error("خطأ في إضافة المنتج:", error);
      setMessageText("❌ حدث خطأ أثناء إضافة المنتج");
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  if (!data) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.paper",
          zIndex: 1000,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <MyNavbar />
      <Box
        sx={{
          marginTop: "85px",
          direction: "rtl",
          minHeight: "80vh",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            m: 3,
            position: "relative",
            marginTop: "85px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 100,
              color: "error.main",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
              border: "1px solid #ddd",
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>

          <Grid
            container
            spacing={3}
            style={{ alignItems: "center" }}
            sx={{ maxWidth: "1200px" }}
          >
            <Grid item xs={12} md={6}>
              <Paper
                style={{ color: "unset", backgroundColor: "unset" }}
                elevation={3}
                sx={{
                  p: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {mainImage ? (
                  <Box
                    component="img"
                    src={mainImage}
                    alt={data.title}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      borderRadius: 2,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: "100%",
                      height: 300,
                      fontSize: "3rem",
                    }}
                  >
                    لا توجد صورة
                  </Avatar>
                )}

                {data.images?.length > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 2,
                      overflowX: "auto",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {data.images.map((img, index) => (
                      <Box
                        key={index}
                        onClick={() => setMainImage(img)}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: "hidden",
                          cursor: "pointer",
                          border:
                            mainImage === img
                              ? "2px solid #1976d2"
                              : "1px solid #ddd",
                        }}
                      >
                        <img
                          src={img}
                          alt={`صورة ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                style={{ color: "unset", backgroundColor: "unset" }}
                sx={{ height: "100%" }}
              >
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {data.title}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h4" color="primary">
                      {data.price} جنيه
                    </Typography>
                  </Box>

                  <Typography variant="body1" paragraph>
                    {data.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    {/* {brands.name && ( */}
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        <strong>الشركة:</strong>{" "}
                        {brands[data.brand_id]?.name || "غير معروف"}
                      </Typography>
                    </Grid>
                    {/* )} */}
                    {data.storage && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>المساحة:</strong> {data.storage} جيجا بايت
                        </Typography>
                      </Grid>
                    )}
                    {data.display && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الشاشة:</strong> {data.display}
                        </Typography>
                      </Grid>
                    )}
                    {data.camera && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الكاميرا:</strong> {data.camera} ميجا بايت
                        </Typography>
                      </Grid>
                    )}
                    {data.processor && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>المعالج:</strong> {data.processor}
                        </Typography>
                      </Grid>
                    )}
                    {data.operating_system && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>نظام التشغيل:</strong> {data.operating_system}
                        </Typography>
                      </Grid>
                    )}
                    {data.network_support && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الشبكة:</strong> {data.network_support}
                        </Typography>
                      </Grid>
                    )}
                    {data.battery && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>البطارية:</strong> {data.battery} مللي أمبير
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {/* عرض الألوان */}
                  {colors.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        الألوان المتاحة
                      </Typography>
                      {/* <Box sx={{ 
                        display: "flex", 
                        gap: 2, 
                        flexWrap: "wrap",
                        justifyContent: 'flex-end'
                      }}>
                        {colors.map((color) => (
                          <Badge
                            key={color.id}
                            color="primary"
                            badgeContent={selectedColor?.id === color.id ? "✓" : ""}
                            overlap="circular"
                          >
                            <Chip
                              label={color.color}
                              onClick={() => handleColorSelect(color)}
                              sx={{
                                backgroundColor: selectedColor?.id === color.id ? "primary.main" : "grey.200",
                                color: selectedColor?.id === color.id ? "primary.contrastText" : "text.primary",
                                "&:hover": {
                                  backgroundColor: "primary.light",
                                  color: "primary.contrastText"
                                },
                                minWidth: 80,
                              }}
                            />
                          </Badge>
                        ))}
                      </Box> */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        {colors.map((color) => (
                          <Badge
                            key={color.id}
                            color="primary"
                            badgeContent={
                              selectedColor?.id === color.id ? "✓" : ""
                            }
                            overlap="circular"
                          >
                            <Box
                              onClick={() => handleColorSelect(color)}
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: color.color, // هنا نستخدم لون color مباشرة
                                border:
                                  selectedColor?.id === color.id
                                    ? "2px solid primary.main"
                                    : "2px solid transparent",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                  cursor: "pointer",
                                },
                                transition: "all 0.2s ease-in-out",
                              }}
                            />
                          </Badge>
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    {/* <TextField
                      type="number"
                      size="small"
                      label="الكمية"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{ min: 1 }}
                      sx={{
                        width: 100,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.23)"
                                : "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover fieldset": {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.5)"
                                : "rgba(0, 0, 0, 0.5)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.7)"
                              : "rgba(0, 0, 0, 0.6)",
                        },
                      }}
                    /> */}
                    <TextField
                      type="number"
                      size="small"
                      label="الكمية"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{
                        min: 1,
                        max: data.stock_quantity, // الحد الأقصى حسب المخزون
                        style: {
                          textAlign: "center",
                          color: "green",
                        },
                      }}
                      sx={{
                        width: 100,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "green",
                          },
                          "&:hover fieldset": {
                            borderColor: "darkgreen",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "green",
                        },
                        "& .Mui-focused": {
                          color: "darkgreen",
                        },
                      }}
                    />
                    {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddToCart}
                      disabled={
                        isLoading || (colors.length > 0 && !selectedColor)
                      }
                      sx={{ flexGrow: 1 }}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                    >
                      {isLoading ? "جاري الإضافة..." : "إضافة إلى عربة التسوق"}
                    </Button> */}

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddToCart}
                      disabled={
                        isLoading ||
                        (colors.length > 0 && !selectedColor) ||
                        data.stock_quantity <= 0 // تعطيل الزر إذا لم يكن هناك مخزون
                      }
                      sx={{ flexGrow: 1 }}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                    >
                      {data.stock_quantity <= 0
                        ? "غير متوفر"
                        : isLoading
                        ? "جاري الإضافة..."
                        : "إضافة إلى عربة التسوق"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Snackbar
            open={showMessage}
            autoHideDuration={3000}
            onClose={handleCloseMessage}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseMessage}
              severity="success"
              sx={{ width: "100%" }}
              icon={<CheckCircleIcon fontSize="inherit" />}
            >
              تم إضافة المنتج إلى العربة بنجاح!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default ProductDetails;











// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchProducts } from "./productSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import { addToCart } from "../user/cart/cartSlice";
// import { Footer } from "../landing/home";
// import MyNavbar from "../landing/navbar";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   CircularProgress,
//   Divider,
//   Grid,
//   Paper,
//   Avatar,
//   IconButton,
//   TextField,
//   Snackbar,
//   Alert,
//   Badge,
//   useTheme,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import BatteryFullIcon from "@mui/icons-material/BatteryFull";
// import BoltIcon from "@mui/icons-material/Bolt";
// import Swal from "sweetalert2";
// import { selectAllCartItems } from "../user/cart/cartSlice";

// const IMAGE_COVER_API = "http://localhost:8000/api/mobiles";
// const ADD_TO_USER_CART = "http://localhost:8000/api/cart-items";
// const BRAND_API = `http://localhost:8000/api/brands`;
// const GET_CART_ITEMS_API = "http://localhost:8000/api/cart";

// function ProductDetails() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const COLOR_API = `http://localhost:8000/api/mobiles/${id}`;

//   const [isLoading, setIsLoading] = useState(false);
//   const [showMessage, setShowMessage] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [colors, setColors] = useState([]);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [mainImage, setMainImage] = useState(null);
//   const [imageCover, setImageCover] = useState(null);
//   const [productDetails, setProductDetails] = useState(null);
//   const [messageText, setMessageText] = useState("");
//   const [brands, setBrands] = useState({});
//   const [cartQuantity, setCartQuantity] = useState(0);

//   const cartItems = useSelector(selectAllCartItems);
//   const products = useSelector((state) => state.products.items || []);
//   const data = products.find((p) => p.id.toString() === id) || null;

//   useEffect(() => {
//     if (cartItems.length > 0 && data) {
//       const currentProductInCart = cartItems.filter(
//         (item) =>
//           item.product_id.toString() === id && item.product_type === "mobile"
//       );

//       const totalQuantity = currentProductInCart.reduce(
//         (total, item) => total + item.quantity,
//         0
//       );

//       setCartQuantity(totalQuantity);

//       if (totalQuantity >= data.stock_quantity) {
//         setMessageText(
//           `⚠ لقد وصلت للحد الأقصى لهذا المنتج (${data.stock_quantity} قطعة)`
//         );
//         setShowMessage(true);
//       }
//     }
//   }, [cartItems, data, id]);

//   const fetchCartQuantity = async () => {
//     const token = localStorage.getItem("user_token");
//     if (!token) {
//       setCartQuantity(0);
//       return;
//     }

//     try {
//       const response = await fetch(GET_CART_ITEMS_API, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("user_token");
//           setCartQuantity(0);
//           return;
//         }
//         throw new Error("Failed to fetch cart items");
//       }

//       const responseData = await response.json();

//       if (
//         responseData.data &&
//         responseData.data.cart_items &&
//         Array.isArray(responseData.data.cart_items)
//       ) {
//         const cartItem = responseData.data.cart_items.find(
//           (item) => item.product_id.toString() === id
//         );
//         setCartQuantity(cartItem ? cartItem.quantity : 0);
//       } else {
//         console.error("Cart data structure is not as expected:", responseData);
//         setCartQuantity(0);
//       }
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//       setCartQuantity(0);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("user_token");
//     if (token) {
//       fetchCartQuantity();
//     }
//   }, [id]);

//   useEffect(() => {
//     if (products.length === 0) {
//       dispatch(fetchProducts());
//     }
//   }, [dispatch, products.length]);

//   useEffect(() => {
//     if (products.length <= 0) return;
//     fetch(BRAND_API)
//       .then((res) => res.json())
//       .then((json) => {
//         const brandMap = {};
//         json.data.forEach((brand) => {
//           brandMap[brand.id] = {
//             name: brand.name,
//             image: brand.image ? `http://localhost:8000${brand.image}` : null,
//           };
//         });
//         setBrands(brandMap);
//       })
//       .catch((error) => console.error("Error fetching brands:", error));
//   }, [products]);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         const response = await fetch(`${IMAGE_COVER_API}/${id}`);
//         const json = await response.json();

//         if (json.data) {
//           setProductDetails(json.data);
//           if (json.data.image_cover) {
//             setImageCover(`http://localhost:8000${json.data.image_cover}`);
//           }
//         }
//       } catch (error) {
//         console.error("خطأ في جلب بيانات المنتج:", error);
//       }
//     };

//     const fetchColors = async () => {
//       try {
//         const response = await fetch(COLOR_API);
//         const json = await response.json();

//         if (json.data?.colors) {
//           setColors(json.data.colors);
//         } else {
//           setColors([]);
//         }
//       } catch (error) {
//         console.error("خطأ في جلب الألوان:", error);
//       }
//     };

//     fetchProductData();
//     fetchColors();
//   }, [id]);

//   useEffect(() => {
//     if (selectedColor?.image) {
//       setMainImage(`http://localhost:8000${selectedColor.image}`);
//     } else if (imageCover) {
//       setMainImage(imageCover);
//     } else if (data?.images?.length > 0) {
//       setMainImage(data.images[0]);
//     }
//   }, [data, imageCover, selectedColor]);

//   const handleQuantityChange = (e) => {
//     const newQuantity = parseInt(e.target.value, 10);

//     if (isNaN(newQuantity)) return;

//     if (!data) return;

//     if (newQuantity >= 1 && newQuantity <= data.stock_quantity) {
//       setQuantity(newQuantity);
//     } else if (newQuantity > data.stock_quantity) {
//       setQuantity(data.stock_quantity);
//       Swal.fire(
//         "تنبيه",
//         `الحد الأقصى للكمية المتاحة هو ${data.stock_quantity}`,
//         "info"
//       );
//     }
//   };

//   const handleAddToCart = async () => {
//     const token = localStorage.getItem("user_token");
//     const userId = localStorage.getItem("user_id");

//     if (!data) {
//       setMessageText("❌ حدث خطأ في تحميل بيانات المنتج");
//       setShowMessage(true);
//       return;
//     }

//     const availableQuantity = data.stock_quantity - cartQuantity;

//     if (quantity + cartQuantity > data.stock_quantity) {
//       Swal.fire(
//         "تنبيه",
//         `لقد وصلت للحد الأقصى لهذا المنتج (${data.stock_quantity} قطعة)`,
//         "info"
//       );
//       return;
//     }

//     if (quantity > availableQuantity) {
//       Swal.fire(
//         "خطأ",
//         `الكمية المطلوبة (${quantity}) تتجاوز الكمية المتاحة (${availableQuantity})`,
//         "error"
//       );
//       return;
//     }

//     if (!token || !userId) {
//       setMessageText("❌ يجب تسجيل الدخول أولاً!");
//       setShowMessage(true);
//       setTimeout(() => setShowMessage(false), 3000);
//       setTimeout(() => navigate("/singeup"), 3000);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch(ADD_TO_USER_CART, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           product_id: id,
//           product_type: "mobile",
//           product_color_id: selectedColor
//             ? selectedColor.id
//             : "a27c4023-5051-4364-a581-72cc5311db57",
//           quantity: quantity,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("فشل في إضافة المنتج إلى السلة");
//       }

//       setMessageText("✅ تم تحديث الكمية بنجاح");
//       setShowMessage(true);
//       await fetchCartQuantity();
//     } catch (error) {
//       console.error("خطأ في إضافة المنتج:", error);
//       setMessageText("❌ حدث خطأ أثناء إضافة المنتج");
//       setShowMessage(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCloseMessage = () => {
//     setShowMessage(false);
//   };

//   const handleColorSelect = (color) => {
//     setSelectedColor(color);
//   };

//   if (!data) {
//     return (
//       <Box
//         sx={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "background.paper",
//           zIndex: 1000,
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <MyNavbar />
//       <Box
//         sx={{
//           marginTop: "85px",
//           direction: "rtl",
//           minHeight: "80vh",
//           justifyContent: "center",
//           alignContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Box
//           sx={{
//             m: 3,
//             position: "relative",
//             marginTop: "85px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <IconButton
//             onClick={() => navigate(-1)}
//             sx={{
//               position: "absolute",
//               top: 15,
//               right: 15,
//               zIndex: 100,
//               color: "error.main",
//               backgroundColor: "rgba(255, 255, 255, 0.7)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//               },
//               border: "1px solid #ddd",
//             }}
//           >
//             <CloseIcon fontSize="large" />
//           </IconButton>

//           <Grid
//             container
//             spacing={3}
//             style={{ alignItems: "center" }}
//             sx={{ maxWidth: "1200px" }}
//           >
//             <Grid item xs={12} md={6}>
//               <Paper
//                 style={{ color: "unset", backgroundColor: "unset" }}
//                 elevation={3}
//                 sx={{
//                   p: 2,
//                   textAlign: "center",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                 }}
//               >
//                 {mainImage ? (
//                   <Box
//                     component="img"
//                     src={mainImage}
//                     alt={data.title}
//                     sx={{
//                       maxWidth: "100%",
//                       maxHeight: "400px",
//                       borderRadius: 2,
//                       objectFit: "contain",
//                     }}
//                   />
//                 ) : (
//                   <Avatar
//                     variant="rounded"
//                     sx={{
//                       width: "100%",
//                       height: 300,
//                       fontSize: "3rem",
//                     }}
//                   >
//                     لا توجد صورة
//                   </Avatar>
//                 )}

//                 {data.images?.length > 1 && (
//                   <Box
//                     sx={{
//                       display: "flex",
//                       gap: 2,
//                       mt: 2,
//                       overflowX: "auto",
//                       justifyContent: "center",
//                       width: "100%",
//                     }}
//                   >
//                     {data.images.map((img, index) => (
//                       <Box
//                         key={index}
//                         onClick={() => setMainImage(img)}
//                         sx={{
//                           width: 80,
//                           height: 80,
//                           borderRadius: 1,
//                           overflow: "hidden",
//                           cursor: "pointer",
//                           border:
//                             mainImage === img
//                               ? "2px solid #1976d2"
//                               : "1px solid #ddd",
//                         }}
//                       >
//                         <img
//                           src={img}
//                           alt={`صورة ${index + 1}`}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </Box>
//                     ))}
//                   </Box>
//                 )}
//               </Paper>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Card
//                 style={{ color: "unset", backgroundColor: "unset" }}
//                 sx={{ height: "100%" }}
//               >
//                 <CardContent>
//                   <Typography variant="h4" gutterBottom>
//                     {data.title}
//                   </Typography>

//                   <Box display="flex" alignItems="center" mb={2}>
//                     <Typography variant="h4" color="primary">
//                       {data.price} جنيه
//                     </Typography>
//                   </Box>

//                   <Typography variant="body1" paragraph>
//                     {data.description}
//                   </Typography>

//                   <Divider sx={{ my: 2 }} />

//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Typography variant="subtitle1">
//                         <strong>الشركة:</strong>{" "}
//                         {brands[data.brand_id]?.name || "غير معروف"}
//                       </Typography>
//                     </Grid>
//                     {data.storage && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>المساحة:</strong> {data.storage} جيجا بايت
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.display && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>الشاشة:</strong> {data.display}
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.camera && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>الكاميرا:</strong> {data.camera} ميجا بايت
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.processor && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>المعالج:</strong> {data.processor}
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.operating_system && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>نظام التشغيل:</strong> {data.operating_system}
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.network_support && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>الشبكة:</strong> {data.network_support}
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.battery && (
//                       <Grid item xs={6}>
//                         <Box display="flex" alignItems="center">
//                           <BatteryFullIcon color="primary" sx={{ mr: 1 }} />
//                           <Typography variant="subtitle1">
//                             <strong>البطارية:</strong> {data.battery} مللي أمبير
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     )}
//                     {data.speed && (
//                       <Grid item xs={6}>
//                         <Box display="flex" alignItems="center">
//                           <BoltIcon color="warning" sx={{ mr: 1 }} />
//                           <Typography variant="subtitle1">
//                             <strong>سرعة الشحن:</strong> {data.speed} واط
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     )}
//                   </Grid>

//                   {colors.length > 0 && (
//                     <Box sx={{ mt: 3 }}>
//                       <Typography variant="h6" gutterBottom>
//                         الألوان المتاحة
//                       </Typography>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           gap: 2,
//                           flexWrap: "wrap",
//                           justifyContent: "flex-end",
//                         }}
//                       >
//                         {colors.map((color) => (
//                           <Badge
//                             key={color.id}
//                             color="primary"
//                             badgeContent={
//                               selectedColor?.id === color.id ? "✓" : ""
//                             }
//                             overlap="circular"
//                           >
//                             <Box
//                               onClick={() => handleColorSelect(color)}
//                               sx={{
//                                 width: 40,
//                                 height: 40,
//                                 borderRadius: "50%",
//                                 backgroundColor: color.color,
//                                 border:
//                                   selectedColor?.id === color.id
//                                     ? "2px solid primary.main"
//                                     : "2px solid transparent",
//                                 "&:hover": {
//                                   transform: "scale(1.1)",
//                                   cursor: "pointer",
//                                 },
//                                 transition: "all 0.2s ease-in-out",
//                               }}
//                             />
//                           </Badge>
//                         ))}
//                       </Box>
//                     </Box>
//                   )}

//                   <Box
//                     sx={{
//                       mt: 3,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 2,
//                       justifyContent: "flex-end",
//                     }}
//                   >
//                     <TextField
//                       type="number"
//                       size="small"
//                       label="الكمية"
//                       value={quantity}
//                       onChange={handleQuantityChange}
//                       inputProps={{
//                         min: 1,
//                         max: data.stock_quantity,
//                         style: {
//                           textAlign: "center",
//                           color: "green",
//                         },
//                       }}
//                       sx={{
//                         width: 100,
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": {
//                             borderColor: "green",
//                           },
//                           "&:hover fieldset": {
//                             borderColor: "darkgreen",
//                           },
//                         },
//                         "& .MuiInputLabel-root": {
//                           color: "green",
//                         },
//                         "& .Mui-focused": {
//                           color: "darkgreen",
//                         },
//                       }}
//                     />
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleAddToCart}
//                       disabled={
//                         isLoading ||
//                         (colors.length > 0 && !selectedColor) ||
//                         data.stock_quantity <= 0 ||
//                         cartQuantity >= data.stock_quantity
//                       }
//                       sx={{ flexGrow: 1 }}
//                       startIcon={
//                         isLoading ? (
//                           <CircularProgress size={20} color="inherit" />
//                         ) : null
//                       }
//                     >
//                       {data.stock_quantity <= 0
//                         ? "غير متوفر"
//                         : cartQuantity >= data.stock_quantity
//                         ? "وصلت للحد الأقصى"
//                         : isLoading
//                         ? "جاري الإضافة..."
//                         : "إضافة إلى عربة التسوق"}
//                     </Button>
//                   </Box>
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle1" sx={{ mt: 1 }}>
//                       <strong>الكمية المتاحة:</strong>{" "}
//                       <span
//                         style={{
//                           color: "green",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {data.stock_quantity - cartQuantity} قطعة
//                       </span>
//                     </Typography>
//                     <Typography variant="subtitle1" sx={{ mt: 1 }}>
//                       <strong>الكمية في السلة:</strong>{" "}
//                       <span
//                         style={{
//                           color: "blue",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {cartQuantity} قطعة
//                       </span>
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           <Snackbar
//             open={showMessage}
//             autoHideDuration={3000}
//             onClose={handleCloseMessage}
//             anchorOrigin={{ vertical: "top", horizontal: "center" }}
//           >
//             <Alert
//               onClose={handleCloseMessage}
//               severity="success"
//               sx={{ width: "100%" }}
//               icon={<CheckCircleIcon fontSize="inherit" />}
//             >
//               {messageText}
//             </Alert>
//           </Snackbar>
//         </Box>
//       </Box>
//       <Footer />
//     </>
//   );
// }

// export default ProductDetails;