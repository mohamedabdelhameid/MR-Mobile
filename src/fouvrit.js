import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [clearAll, setClearAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event("favoritesUpdated"));
  }, [favorites]);

  const handleRemoveFavorite = (product) => {
    setSelectedProduct(product);
    setClearAll(false);
    setOpenDialog(true);
  };

  const handleClearFavorites = () => {
    setClearAll(true);
    setOpenDialog(true);
  };

  const confirmRemove = () => {
    if (clearAll) {
      setFavorites([]);
      localStorage.removeItem("favorites");
      setSnackbarMessage("تم حذف جميع المنتجات من المفضلة");
    } else {
      const updatedFavorites = favorites.filter((fav) => fav._id !== selectedProduct._id);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setSnackbarMessage(`تم إزالة "${selectedProduct.title}" من المفضلة`);
    }
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  return (
    <div>
      <MyNavbar/>
      <Box sx={{ mt: 10, mx: "auto", maxWidth: "1200px", px: 2 }}>
        <Typography variant="h4" textAlign="center" mb={3} color="primary">
          المفضلة ❤️
        </Typography>

        {favorites.length === 0 ? (
          <Typography textAlign="center">لا توجد منتجات مفضلة.</Typography>
        ) : (
          <>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "repeat(2, minmax(150px, 1fr))", md: "repeat(auto-fill, minmax(250px, 1fr))" }}
              gap="15px"
            >
              {favorites.map((product) => (
                <Card key={product._id} sx={{ boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageCover}
                    alt={product.title}
                    sx={{ objectFit: "contain", backgroundColor: "#f8f8f8" }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography color="primary">السعر: {product.price} جنيه</Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveFavorite(product)}
                      sx={{ mt: 1 }}
                    >
                      حذف من المفضلة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box textAlign="center" mt={3}>
              <Button variant="contained" color="secondary" onClick={handleClearFavorites}>
                حذف الكل
              </Button>
            </Box>
          </>
        )}

        <Box textAlign="center" mt={3}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">العودة إلى الصفحة الرئيسية</Button>
          </Link>
        </Box>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="success" sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogContent>
            {clearAll ? "هل أنت متأكد أنك تريد حذف جميع المنتجات من المفضلة؟" : `هل أنت متأكد أنك تريد إزالة "${selectedProduct?.title}" من المفضلة؟`}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
            <Button onClick={confirmRemove} color="error">حذف</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default Favorites;