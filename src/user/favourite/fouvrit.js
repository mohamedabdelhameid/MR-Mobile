import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "../../landing/navbar";
import './favourite.css';
import { Footer } from "../../landing/home";

const API_URL = "http://localhost:8000/api/wishlist"; 

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [clearAll, setClearAll] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // حالة تسجيل الدخول
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      setIsAuthenticated(false); // المستخدم غير مسجل دخول
      setSnackbarMessage("يجب تسجيل الدخول أولاً!");
      setOpenSnackbar(true);

      // إعادة التوجيه إلى صفحة تسجيل الدخول بعد 3 ثوانٍ
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }

    // ✅ جلب قائمة المفضلة من الـ API
    const fetchFavorites = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { "Authorization": `Bearer ${userToken}` }
        });
        const data = await response.json();
        if (response.ok) {
          setFavorites(data.data || []);
        } else {
          console.error("Failed to fetch favorites:", data.message);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleRemoveFavorite = (product) => {
    setSelectedProduct(product);
    setClearAll(false);
    setOpenDialog(true);
  };

  const handleClearFavorites = () => {
    setClearAll(true);
    setOpenDialog(true);
  };

  const confirmRemove = async () => {
    try {
      const userToken = localStorage.getItem("user_token");
      const url = clearAll ? API_URL : `${API_URL}/${selectedProduct.id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${userToken}` }
      });

      if (response.ok) {
        if (clearAll) {
          setFavorites([]);
          setSnackbarMessage("تم حذف جميع المنتجات من المفضلة");
        } else {
          setFavorites(favorites.filter((fav) => fav.id !== selectedProduct.id));
          setSnackbarMessage(`تم الإزالة من المفضلة`);
        }
      } else {
        const data = await response.json();
        setSnackbarMessage(`فشل الحذف: ${data.message || "حدث خطأ"}`);
      }
    } catch (error) {
      setSnackbarMessage("❌ حدث خطأ أثناء حذف المنتج من المفضلة!");
    }

    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  return (
    <div>
      <MyNavbar/>
      <Box sx={{ mt: 10, mb: 10, mx: "auto", maxWidth: "1200px", px: 2, direction: 'rtl' }}>
        <Typography variant="h4" textAlign="center" mb={3} color="primary">
          المفضلة <p className="heartT">❤️</p>
        </Typography>

        {!isAuthenticated ? (
          <Typography textAlign="center" color="error" sx={{minHeight: "30vh"}}>
            يجب تسجيل الدخول أولاً للوصول إلى المفضلة!
          </Typography>
        ) : favorites.length === 0 ? (
          <Typography textAlign="center" sx={{minHeight: "30vh"}}>لا توجد منتجات مفضلة.</Typography>
        ) : (
          <>
            <Box display="grid" gridTemplateColumns={{ xs: "repeat(2, minmax(150px, 1fr))", md: "repeat(auto-fill, minmax(250px, 1fr))" }} gap="15px">
              {favorites.map((product) => (
                <Card key={product.id} sx={{ boxShadow: 3, height:'fit-content',backgroundColor:'unset',color:'unset' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:8000${product.product_type === "mobile" ? product.product.image_cover : product.product.image}`}
                    alt={product.product.title}
                    sx={{ objectFit: "contain" }}
                    onClick={() => navigate(`/${product.product_type === "mobile" ? "mobiles" : "accessories"}/${product.product_id}`)}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.product.title}</Typography>
                    <Typography color="primary">السعر: {product.product.price} جنيه</Typography>
                    <Button variant="contained" color="error" onClick={() => handleRemoveFavorite(product)} sx={{ mt: 1 }}>
                      حذف من المفضلة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>

          </>
        )}

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity={isAuthenticated ? "success" : "error"} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogContent>
            {clearAll ? "هل أنت متأكد أنك تريد حذف جميع المنتجات من المفضلة؟" : `هل أنت متأكد أنك تريد إزالته من المفضلة؟`}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
            <Button onClick={confirmRemove} color="error">حذف</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </div>
  );
};

export default Favorites;