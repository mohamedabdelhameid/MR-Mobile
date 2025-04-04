import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "./productSlice";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "./cartSlice";
import { Footer } from "./home";
import MyNavbar from "./navbar";
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
  useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const IMAGE_COVER_API = 'http://localhost:8000/api/mobiles';
const ADD_TO_USER_CART = 'http://localhost:8000/api/cart-items';

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
  

  const products = useSelector((state) => state.products.items || []);
  const data = products.find((p) => p.id.toString() === id) || null;

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

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= 5) {
      setQuantity(newQuantity);
    }
  };


  // const [selectedColor, setSelectedColor] = useState(null);

useEffect(() => {
  if (!selectedColor && colors.length > 0) {
    setSelectedColor(colors[0]); // اختيار أول لون تلقائيًا
  }
}, [colors]);



  // const handleAddToCart = async () => {
  //   const token = localStorage.getItem('user_token');
  //   const userId = localStorage.getItem("user_id");
    
  //   if (!token || !userId) {
  //     setMessageText("❌ يجب تسجيل الدخول أولاً!");
  //     setShowMessage(true);
  //     setTimeout(() => setShowMessage(false), 3000);
  //     setTimeout(() => navigate("/singeup"), 3000);
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
      

  //     // ✅ إرسال المنتج إلى API مرة واحدة
  //     const response = await fetch(ADD_TO_USER_CART, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         product_id: id,
  //         product_type: "mobile",
  //         quantity: quantity,
  //         color: selectedColor ? selectedColor.color : mobile.colors.length > 0 ? mobile.colors[0].color : "غير محدد"
  //       })
  //     });


  //     if (!response.ok) {
  //       throw new Error('فشل في إضافة المنتج إلى السلة');
  //     }

  //     setShowMessage(true);
  //   } catch (error) {
  //     console.error("خطأ في إضافة المنتج:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('user_token');
    const userId = localStorage.getItem("user_id");
  
    if (!token || !userId) {
      setMessageText("❌ يجب تسجيل الدخول أولاً!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }
  
    setIsLoading(true);
    try {
      const chosenColor = selectedColor ? selectedColor.color : (colors.length > 0 ? colors[0].color : "غير محدد");
  
      const response = await fetch(ADD_TO_USER_CART, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: id,
          product_type: "mobile",
          quantity: quantity,
          color: chosenColor
        })
      });
  
      if (!response.ok) {
        throw new Error('فشل في إضافة المنتج إلى السلة');
      }
  
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
      <Box sx={{ marginTop:'85px',direction: 'rtl',minHeight:'80vh',justifyContent:'center',alignContent:'center',alignItems:'center' }}>
        <Box sx={{ 
          m: 3, 
          position: "relative",
          marginTop: '85px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
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

          <Grid container spacing={3} style={{alignItems:'center'}} sx={{ maxWidth: '1200px' }}>
            <Grid item xs={12} md={6}>
              <Paper style={{color:'unset',backgroundColor:'unset'}} elevation={3} sx={{ 
                p: 2, 
                textAlign: "center",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
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
                  <Box sx={{ 
                    display: "flex", 
                    gap: 2, 
                    mt: 2, 
                    overflowX: "auto",
                    justifyContent: 'center',
                    width: '100%'
                  }}>
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
                          border: mainImage === img ? "2px solid #1976d2" : "1px solid #ddd",
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
              <Card style={{color:'unset',backgroundColor:'unset'}} sx={{ height: '100%' }}>
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
                  {data.brand?.name && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        <strong>الشركة:</strong> {data.brand.name}
                      </Typography>
                    </Grid>
                  )}
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
                      <Box sx={{ 
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
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ 
                    mt: 3, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 2,
                    justifyContent: 'flex-end'
                  }}>
                    <TextField
                      type="number"
                      size="small"
                      label="الكمية"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{ min: 1, max: 5 }}
                      sx={{ 
                        width: 100,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddToCart}
                      disabled={isLoading}
                      sx={{ flexGrow: 1 }}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
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