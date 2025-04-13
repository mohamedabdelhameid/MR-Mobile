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
  Divider,
  Grid,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const IMAGE_COVER_API = "http://localhost:8000/api/accessories";
const ADD_TO_USER_CART = "http://localhost:8000/api/cart-items";
const BRAND_API = `http://localhost:8000/api/brands`;

function AccessoryDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState({});

  const products = useSelector((state) => state.products.items || []);
  const data = products.find((p) => p.id.toString() === id) || null;

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
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${IMAGE_COVER_API}/${id}`);
        const json = await response.json();

        if (json.data) {
          setProductDetails(json.data);
          // تعيين الصورة الرئيسية الأولى
          if (json.data.images && json.data.images.length > 0) {
            setMainImage(`http://localhost:8000${json.data.images[0]}`);
          } else if (json.data.image) {
            setMainImage(`http://localhost:8000${json.data.image}`);
          }
        }
      } catch (error) {
        console.error("خطأ في جلب بيانات المنتج:", error);
        setError("فشل في تحميل بيانات المنتج");
      }
    };

    fetchProductData();
  }, [id]);

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Button
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
        >
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  if (!data && !productDetails) {
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

  // دمج البيانات من المصدرين
  const mergedData = { ...data, ...productDetails };

  // الحصول على جميع الصور المتاحة
  const allImages = mergedData.images || [];
  if (mergedData.image && !allImages.includes(mergedData.image)) {
    allImages.unshift(mergedData.image);
  }

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= 5) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("user_token");

    if (!token) {
      setMessageText("❌ يجب تسجيل الدخول أولاً!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }

    setIsLoading(true);
    try {
      // إضافة إلى سلة المستخدم عبر API

      if (token) {
        const response = await fetch(ADD_TO_USER_CART, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: id,
            product_type: "accessory",
            quantity: quantity,
          }),
        });

        const responseData = await response.json();
        console.log("بيانات الاستجابة:", responseData); // اطبع بيانات الاستجابة

        if (!response.ok) {
          throw new Error(
            responseData.message || "فشل في إضافة المنتج إلى السلة"
          );
        }
      }

      setMessageText("✅ تم إضافة المنتج إلى العربة بنجاح!");
      setShowMessage(true);
    } catch (error) {
      console.error("خطأ في إضافة المنتج:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <>
      <MyNavbar />
      <Box
        sx={{
          direction: "rtl",
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          marginTop: "85px",
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
                elevation={3}
                sx={{
                  p: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "unset",
                }}
              >
                {mainImage ? (
                  <Box
                    component="img"
                    src={mainImage}
                    alt={mergedData.title}
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

                {allImages.length > 1 && (
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
                    {allImages.map((img, index) => (
                      <Box
                        key={index}
                        onClick={() =>
                          setMainImage(`http://localhost:8000${img}`)
                        }
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: "hidden",
                          cursor: "pointer",
                          border:
                            mainImage === `http://localhost:8000${img}`
                              ? "2px solid #1976d2"
                              : "1px solid #ddd",
                        }}
                      >
                        <img
                          src={`http://localhost:8000${img}`}
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

            <Grid
              item
              xs={12}
              md={6}
              sx={{ backgroundColor: "unset", color: "unset" }}
            >
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "unset",
                  color: "unset",
                }}
              >
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {mergedData.title}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h4" color="primary">
                      {mergedData.price} جنيه
                    </Typography>
                  </Box>

                  <Typography variant="body1" paragraph>
                    {mergedData.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    {/* {brands.name && ( */}
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        <strong>الشركة:</strong>{" "}
                        {(mergedData.brand_id &&
                          brands[mergedData.brand_id]?.name) ||
                          mergedData.brand?.name ||
                          "غير معروف"}
                      </Typography>
                    </Grid>
                    {/* )} */}
                    {mergedData.storage && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>المساحة:</strong> {mergedData.storage} جيجا
                          بايت
                        </Typography>
                      </Grid>
                    )}
                    {mergedData.display && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الشاشة:</strong> {mergedData.display}
                        </Typography>
                      </Grid>
                    )}
                    {mergedData.camera && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الكاميرا:</strong> {mergedData.camera} ميجا
                          بايت
                        </Typography>
                      </Grid>
                    )}
                    {mergedData.processor && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>المعالج:</strong> {mergedData.processor}
                        </Typography>
                      </Grid>
                    )}
                    {mergedData.operating_system && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>نظام التشغيل:</strong>{" "}
                          {mergedData.operating_system}
                        </Typography>
                      </Grid>
                    )}
                    {mergedData.network_support && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الشبكة:</strong> {mergedData.network_support}
                        </Typography>
                      </Grid>
                    )}
                    {mergedData.battery && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>البطارية:</strong> {mergedData.battery} مللي
                          أمبير
                        </Typography>
                      </Grid>
                    )}
                    {mergedData.color && (
                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <strong>اللون المتاح:</strong>
                          <span
                            style={{
                              display: "inline-block",
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: mergedData.color,
                              border: "1px solid #ddd",
                            }}
                          />
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    <TextField
                      type="number"
                      size="small"
                      label="الكمية"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{
                        min: 1,
                        style: {
                          textAlign: "center",
                          color: "green", // لون النص أخضر
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddToCart}
                      disabled={isLoading}
                      sx={{ flexGrow: 1 }}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                    >
                      {isLoading ? "جاري الإضافة..." : "إضافة إلى عربة التسوق"}
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
              {messageText}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default AccessoryDetails;
