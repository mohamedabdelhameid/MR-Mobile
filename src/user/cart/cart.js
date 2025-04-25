import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllCartItems,
  selectTotalPrice,
  setApiCartItems,
  clearCart,
} from "./cartSlice";
import Swal from "sweetalert2";
import { Footer } from "../../landing/home";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../../landing/navbar";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
} from "@mui/icons-material";

// روابط API
const API_BASE = "http://localhost:8000/api";
const CART_API = `${API_BASE}/cart`;
const MOBILES_API = `${API_BASE}/mobiles`;
const ACCESSORIES_API = `${API_BASE}/accessories`;
const BRANDS_API = `${API_BASE}/brands`;
const CHECKOUT_API = `${API_BASE}/payment/create-checkout-session`;

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // بيانات السلة من Redux
  const cartItems = useSelector(selectAllCartItems);
  const totalPrice = useSelector(selectTotalPrice);

  // حالات التحميل والأخطاء
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateType, setUpdateType] = useState("");
  const [cartId, setCartId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);

  // بيانات المنتجات
  const [mobiles, setMobiles] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [brands, setBrands] = useState([]);

  // جلب بيانات السلة والمنتجات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      const userToken = localStorage.getItem("user_token");
      
      if (!userToken) {
        setError("يجب تسجيل الدخول أولاً لعرض سلة التسوق");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        
        const [cartRes, mobilesRes, accessoriesRes, brandsRes] = await Promise.all([
          fetch(CART_API, {
            headers: { Authorization: `Bearer ${userToken}` },
          }),
          fetch(MOBILES_API),
          fetch(ACCESSORIES_API),
          fetch(BRANDS_API),
        ]);

        const [cartData, mobilesData, accessoriesData, brandsData] = await Promise.all([
          cartRes.json(),
          mobilesRes.json(),
          accessoriesRes.json(),
          brandsRes.json(),
        ]);

        if (cartData.data?.id) {
          setCartId(cartData.data.id);
        }

        dispatch(setApiCartItems(cartData.data?.cart_items || []));
        setMobiles(mobilesData.data || []);
        setAccessories(accessoriesData.data || []);
        setBrands(brandsData.data || []);
        
      } catch (err) {
        setError("حدث خطأ أثناء تحميل بيانات السلة");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  // الحصول على معلومات المنتج
  const getProductInfo = (item) => {
    if (item.product_type === "mobile") {
      const mobile = mobiles.find((m) => m.id === item.product_id);
      if (!mobile) return null;

      const brand = brands.find((b) => b.id === mobile.brand_id);
      const image = item.color?.image 
        ? `http://localhost:8000${item.color.image}`
        : mobile.image_cover 
        ? `http://localhost:8000${mobile.image_cover}`
        : "";

      return {
        name: mobile.title,
        image,
        price: mobile.final_price || mobile.price,
        specs: [
          { label: "الشركة", value: brand?.name || "غير معروف" },
          { label: "المساحة", value: mobile.storage ? `${mobile.storage} جيجابايت` : "غير محدد" },
          { label: "اللون", value: item.color?.color || "غير محدد" },
        ],
        stock: mobile.stock_quantity,
      };
    } else {
      const accessory = accessories.find((a) => a.id === item.product_id);
      if (!accessory) return null;

      const brand = brands.find((b) => b.id === accessory.brand_id);
      const color = item.color || accessory.color || "غير محدد";

      return {
        name: accessory.title,
        image: accessory.image ? `http://localhost:8000${accessory.image}` : "",
        price: accessory.price,
        specs: [
          { label: "الشركة", value: brand?.name || "غير معروف" },
          { label: "اللون", value: color },
        ],
        stock: accessory.stock_quantity,
      };
    }
  };

  // تحديث كمية المنتج في السلة
  const updateQuantity = async (itemId, newQuantity) => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      Swal.fire("خطأ", "يجب تسجيل الدخول أولاً", "error");
      return;
    }

    setIsUpdating(itemId);
    setUpdateType(newQuantity > cartItems.find(i => i.id === itemId).quantity ? "increase" : "decrease");

    try {
      const response = await fetch(`${API_BASE}/cart-items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("فشل في تحديث الكمية");

      const updatedCart = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      dispatch(setApiCartItems(updatedCart));
    } catch (err) {
      Swal.fire("خطأ", "حدث خطأ أثناء تحديث الكمية", "error");
    } finally {
      setIsUpdating(null);
      setUpdateType("");
    }
  };

  // حذف منتج من السلة
  const deleteItem = async (itemId) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا المنتج!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) return;

    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      Swal.fire("خطأ", "يجب تسجيل الدخول أولاً", "error");
      return;
    }

    setIsUpdating(itemId);
    setUpdateType("delete");

    try {
      const response = await fetch(`${API_BASE}/cart-items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (!response.ok) throw new Error("فشل في حذف المنتج");

      const updatedCart = cartItems.filter(item => item.id !== itemId);
      dispatch(setApiCartItems(updatedCart));
      Swal.fire("تم الحذف!", "تم حذف المنتج بنجاح", "success");
    } catch (err) {
      Swal.fire("خطأ!", "فشل في حذف المنتج", "error");
    } finally {
      setIsUpdating(null);
      setUpdateType("");
    }
  };

  // إتمام عملية الشراء
  const handleCheckout = async () => {
    if (!cartId) {
      Swal.fire("خطأ", "لا يوجد سلة تسوق", "error");
      return;
    }

    setIsCheckingOut(true);
    const userToken = localStorage.getItem("user_token");

    try {
      const response = await fetch(CHECKOUT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ cart_id: cartId }),
      });

      if (!response.ok) throw new Error("فشل في إنشاء عملية الدفع");

      const data = await response.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error("لا يوجد رابط دفع");
      }
    } catch (err) {
      Swal.fire("خطأ", "حدث خطأ أثناء محاولة الدفع", "error");
      console.error("Checkout error:", err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // إفراغ السلة بالكامل
  const clearAllItems = async () => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف جميع المنتجات من السلة!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، افرغ السلة!",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) return;

    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      Swal.fire("خطأ", "يجب تسجيل الدخول أولاً", "error");
      return;
    }

    setIsClearingCart(true);

    try {
      const response = await fetch(CART_API, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (!response.ok) throw new Error("فشل في إفراغ السلة");

      dispatch(clearCart());
      Swal.fire("تم الحذف!", "تم إفراغ السلة بنجاح", "success");
    } catch (err) {
      Swal.fire("خطأ!", "فشل في إفراغ السلة", "error");
    } finally {
      setIsClearingCart(false);
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // عرض الأخطاء
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
          تسجيل الدخول
        </Button>
      </Box>
    );
  }

  // عرض السلة الفارغة
  if (cartItems.length === 0) {
    return (
      <>
        <MyNavbar />
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <ShoppingCartCheckoutIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            سلة التسوق فارغة
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate("/products")}
          >
            تصفح المنتجات
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  // العرض الرئيسي لصفحة السلة
  return (
    <>
      <MyNavbar />
      <Container maxWidth="lg" sx={{ py: 4, pt: { xs: 10, md: 12 } }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          <ShoppingCartCheckoutIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          سلة التسوق
        </Typography>

        <Grid container spacing={3}>
          {/* قائمة المنتجات */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                {cartItems.map((item) => {
                  const product = getProductInfo(item);
                  if (!product) return null;

                  return (
                    <Box key={item.id} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #eee' }}>
                      <Grid container spacing={2}>
                        {/* صورة المنتج */}
                        <Grid item xs={4} sm={3}>
                          <CardMedia
                            component="img"
                            image={product.image || "/placeholder-product.png"}
                            alt={product.name}
                            sx={{ borderRadius: 1, height: 120, objectFit: 'contain' }}
                          />
                        </Grid>

                        {/* تفاصيل المنتج */}
                        <Grid item xs={8} sm={9}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" fontWeight="bold">
                              {product.name}
                            </Typography>
                            <IconButton 
                              onClick={() => deleteItem(item.id)}
                              disabled={isUpdating === item.id}
                              color="error"
                            >
                              {isUpdating === item.id && updateType === "delete" ? (
                                <CircularProgress size={24} />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </Box>

                          {/* مواصفات المنتج */}
                          {product.specs.map((spec, i) => (
                            <Box key={i} sx={{ display: 'flex', mt: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 60 }}>
                                {spec.label}:
                              </Typography>
                              {spec.label === "اللون" ? (
                                <Box sx={{ 
                                  width: 16, 
                                  height: 16, 
                                  borderRadius: '50%', 
                                  backgroundColor: spec.value,
                                  border: '1px solid #ddd',
                                  ml: 1,
                                  mt: 0.5
                                }} />
                              ) : (
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                  {spec.value}
                                </Typography>
                              )}
                            </Box>
                          ))}

                          {/* السعر والكمية */}
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="primary">
                              {item.price} جنيه
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating === item.id}
                                size="small"
                              >
                                {isUpdating === item.id && updateType === "decrease" ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <RemoveIcon />
                                )}
                              </IconButton>

                              <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>

                              <IconButton
                                onClick={() => {
                                  if (item.quantity >= product.stock) {
                                    Swal.fire("تنبيه", "لا يوجد مخزون كافي", "info");
                                    return;
                                  }
                                  updateQuantity(item.id, item.quantity + 1);
                                }}
                                disabled={isUpdating === item.id || item.quantity >= product.stock}
                                size="small"
                              >
                                {isUpdating === item.id && updateType === "increase" ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <AddIcon />
                                )}
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>

          {/* ملخص الطلب */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, position: 'sticky', top: 100 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  ملخص الطلب
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography>عدد المنتجات:</Typography>
                    <Typography>{cartItems.length}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography>المجموع:</Typography>
                    <Typography>{totalPrice.toFixed(2)} جنيه</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography>الشحن:</Typography>
                    <Typography>مجاني</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">الإجمالي:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {totalPrice.toFixed(2)} جنيه
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  sx={{ mb: 2, py: 1.5, fontWeight: 'bold' }}
                  startIcon={isCheckingOut ? <CircularProgress size={24} /> : null}
                >
                  {isCheckingOut ? "جاري التوجيه للدفع..." : "اتمام الشراء"}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={clearAllItems}
                  disabled={isClearingCart}
                  sx={{ py: 1.5, fontWeight: 'bold' }}
                  startIcon={isClearingCart ? <CircularProgress size={24} color="error" /> : null}
                >
                  {isClearingCart ? "جاري الإفراغ..." : "إفراغ السلة"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Cart;