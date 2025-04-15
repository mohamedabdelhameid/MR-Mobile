import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

const CART_API = "http://localhost:8000/api/cart";
const MOBILES_API = "http://localhost:8000/api/mobiles";
const ACCESSORIES_API = "http://localhost:8000/api/accessories";
const BRANDS_API = "http://localhost:8000/api/brands";
const CHECKOUT_PAYMENT =
  "http://localhost:8000/api/payment/create-checkout-session";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectAllCartItems);
  const totalPrice = useSelector(selectTotalPrice);

  const [mobiles, setMobiles] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateType, setUpdateType] = useState("");
  const [cartId, setCartId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      setError("يجب تسجيل الدخول أولاً لعرض سلة التسوق");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [cartRes, mobilesRes, accessoriesRes, brandsRes] =
          await Promise.all([
            fetch(CART_API, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }),
            fetch(MOBILES_API),
            fetch(ACCESSORIES_API),
            fetch(BRANDS_API),
          ]);

        const cartData = await cartRes.json();
        const mobilesData = await mobilesRes.json();
        const accessoriesData = await accessoriesRes.json();
        const brandsData = await brandsRes.json();

        // تخزين cart_id في الـ state
        const cartId = cartData.data?.id;
        if (cartId) {
          setCartId(cartId); // حفظ cart_id لاستخدامه لاحقًا
        }

        // تخزين باقي البيانات
        dispatch(setApiCartItems(cartData.data?.cart_items || []));
        setMobiles(mobilesData.data || []);
        setAccessories(accessoriesData.data || []);
        setBrands(brandsData.data || []);
        setLoading(false);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل بيانات السلة");
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const getProductInfo = (item) => {
    if (item.product_type === "mobile") {
      const mobile = mobiles.find((m) => m.id === item.product_id);
      if (!mobile)
        return {
          name: "غير معروف",
          image: "",
          brandName: "غير معروف",
          price: item.price,
          specs: [],
          stock_quantity: 0,
        };

      const brand = brands.find((b) => b.id === mobile.brand_id);

      const productImage = item.color?.image
        ? `http://localhost:8000${item.color.image}`
        : mobile.image_cover
        ? `http://localhost:8000${mobile.image_cover}`
        : "";

      // التعديل هنا: الوصول إلى اللون من كائن color
      const color = item.color?.color || "غير محدد";

      const specs = [
        { label: "الشركة", value: brand ? brand.name : "غير معروف" },
        {
          label: "المساحة",
          value: mobile.storage ? `${mobile.storage} جيجابايت` : "غير محدد",
        },
        { label: "اللون", value: color },
      ];

      return {
        name: mobile.title,
        image: productImage,
        brandName: brand ? brand.name : "غير معروف",
        price: mobile.final_price || mobile.price, // استخدم final_price إذا كان موجوداً
        specs,
        color,
        stock_quantity: mobile.stock_quantity,
      };
    } else if (item.product_type === "accessory") {
      const accessory = accessories.find((a) => a.id === item.product_id);
      if (!accessory)
        return {
          name: "غير معروف",
          image: "",
          brandName: "غير معروف",
          price: item.price,
          specs: [],
          stock_quantity: 0,
        };

      const brand = brands.find((b) => b.id === accessory.brand_id);

      // استخراج اللون من العنصر نفسه
      const color = item.color || accessory.color || "غير محدد";

      const specs = [
        { label: "الشركة", value: brand ? brand.name : "غير معروف" },
        { label: "اللون", value: color },
      ];

      return {
        name: accessory.title,
        image: accessory.image ? `http://localhost:8000${accessory.image}` : "",
        brandName: brand ? brand.name : "غير معروف",
        price: accessory.price,
        specs,
        color,
        stock_quantity: accessory.stock_quantity,
      };
    }

    return {
      name: "منتج غير معروف",
      image: "",
      brandName: "غير معروف",
      price: item.price,
      specs: [],
      stock_quantity: 0,
    };
    // const { name, image, brandName, specs, stock_quantity } = getProductInfo(item);
  };

  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      Swal.fire("خطأ", "يجب تسجيل الدخول أولاً", "error");
      return;
    }

    setIsUpdating(cartItemId);
    setUpdateType(
      newQuantity > cartItems.find((i) => i.id === cartItemId).quantity
        ? "increase"
        : "decrease"
    );

    try {
      const response = await fetch(
        `http://localhost:8000/api/cart-items/${cartItemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) throw new Error("فشل في تحديث الكمية");

      const updatedCart = cartItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      );

      dispatch(setApiCartItems(updatedCart.filter((item) => item.id)));
      Swal.fire("نجاح", "تم تحديث الكمية بنجاح!", "success");
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء تحديث الكمية!", "error");
    } finally {
      setIsUpdating(null);
      setUpdateType("");
    }
  };

  const handleDeleteItem = (cartItemId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا المنتج!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف المنتج!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCartItem(cartItemId);
      }
    });
  };

  const deleteCartItem = async (cartItemId) => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      Swal.fire("خطأ", "يجب تسجيل الدخول أولاً", "error");
      return;
    }

    setIsUpdating(cartItemId);
    setUpdateType("delete");

    try {
      const response = await fetch(
        `http://localhost:8000/api/cart-items/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("فشل في حذف المنتج");

      const updatedCart = cartItems.filter((item) => item.id !== cartItemId);
      dispatch(setApiCartItems(updatedCart));
      Swal.fire("نجاح", "تم حذف المنتج بنجاح!", "success");
    } catch (error) {
      Swal.fire("خطأ", "فشل في حذف المنتج!", "error");
    } finally {
      setIsUpdating(null);
      setUpdateType("");
    }
  };

  const clearCartFromAPI = async () => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      Swal.fire("خطأ", "يجب تسجيل الدخول أولاً", "error");
      return;
    }

    setIsClearingCart(true); // بدء التحميل

    try {
      const response = await fetch("http://localhost:8000/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) throw new Error("فشل في إفراغ السلة");

      dispatch(clearCart());
      Swal.fire("نجاح", "تم حذف جميع المنتجات بنجاح!", "success");
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء إفراغ السلة!", "error");
    } finally {
      setIsClearingCart(false);
    }
  };

  const handleDeleteAll = () => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف جميع المنتجات من عربة التسوق!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف الكل!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCartFromAPI();
      }
    });
  };

  if (loading)
    return (
      <>
        <MyNavbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <Typography variant="h5">جارٍ تحميل بيانات السلة...</Typography>
        </Box>
        <Footer />
      </>
    );

  const handleCheckout = async () => {
    if (!cartId) {
      console.error("Cart ID is not available.");
      return;
    }

    setIsCheckingOut(true); // بدء التحميل

    const token = localStorage.getItem("user_token");

    try {
      const response = await fetch(
        "http://localhost:8000/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart_id: cartId }), // إضافة cart_id إلى body الطلب
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to create checkout session: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Checkout session data:", data);

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error(
          "Failed to create checkout session. No URL in response."
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      Swal.fire(
        "خطأ",
        "حدث خطأ أثناء محاولة الدفع، يرجى المحاولة لاحقاً",
        "error"
      );
    } finally {
      setIsCheckingOut(false); // إيقاف التحميل
    }
  };

  if (error)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );

  return (
    <>
      <MyNavbar />
      <Box
        sx={{
          minHeight: "100vh",
          direction: "rtl",
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            marginTop: "85px",
            padding: { xs: "20px", md: "40px" },
            paddingTop: "100px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: "30px",
              // color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ShoppingCartCheckoutIcon fontSize="large" />
            سلة التسوق
          </Typography>

          {cartItems.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "#666", marginBottom: "20px" }}
              >
                سلة التسوق فارغة
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/")}
                sx={{ padding: "10px 25px" }}
              >
                تصفح المنتجات
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: "30px",
              }}
            >
              {/* قائمة المنتجات */}
              <Box
                sx={{
                  flex: 3,
                  // backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "20px",
                }}
              >
                {cartItems.map((item) => {
                  const { name, image, brandName, specs, stock_quantity } =
                    getProductInfo(item);
                  const itemTotal = item.price * item.quantity;

                  return (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: "20px",
                        padding: "20px 0",
                        borderBottom: "1px solid #eee",
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      {/* صورة المنتج */}
                      <Box
                        sx={{
                          width: { xs: "100%", sm: "150px" },
                          height: "150px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          // backgroundColor: "#f9f9f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: "#999" }}>
                            لا توجد صورة
                          </Typography>
                        )}
                      </Box>

                      {/* تفاصيل المنتج */}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            marginBottom: "5px",
                          }}
                        >
                          {name}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "#666", marginBottom: "5px" }}
                        >
                          <strong>النوع:</strong>{" "}
                          {item.product_type === "mobile" ? "هاتف" : "إكسسوار"}
                        </Typography>

                        {/* {specs
                          .filter((spec) => spec.value)
                          .map((spec, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{
                                color: "#666",
                                marginBottom: "5px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <strong>{spec.label}:</strong>

                              {spec.label === "اللون" ? (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      backgroundColor: spec.value,
                                      border: "1px solid #ddd",
                                      display: "inline-block",
                                    }}
                                  />
                                  {/* <span>{spec.value}</span>{" "} */}
                        {/* </Box>
                              ) : (
                                spec.value
                              )}
                            </Typography> */}
                        {/* ))} */}

                        {specs
                          .filter((spec) => spec.value)
                          .map((spec, index) => (
                            <Box
                              key={index}
                              component="span"
                              sx={{
                                color: "#666",
                                marginBottom: "5px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <Typography component="span" variant="body2">
                                <strong>{spec.label}:</strong>
                              </Typography>

                              {spec.label === "اللون" ? (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      backgroundColor: spec.value,
                                      border: "1px solid #ddd",
                                      display: "inline-block",
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Typography component="span" variant="body2">
                                  {spec.value}
                                </Typography>
                              )}
                            </Box>
                          ))}

                        <Typography
                          variant="h6"
                          sx={{
                            color: "#1976d2",
                            marginBottom: "15px",
                          }}
                        >
                          {item.price} جنيه
                        </Typography>

                        {/* التحكم في الكمية */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {/* زر التقليل */}
                          <IconButton
                            onClick={() =>
                              updateCartItemQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            disabled={
                              item.quantity <= 1 || isUpdating === item.id
                            }
                            sx={{
                              color:
                                item.quantity > 1 && isUpdating !== item.id
                                  ? "green"
                                  : "inherit",
                              "&:hover": {
                                backgroundColor:
                                  item.quantity > 1 && isUpdating !== item.id
                                    ? "rgba(0, 128, 0, 0.1)"
                                    : "inherit",
                              },
                            }}
                          >
                            {isUpdating === item.id &&
                            updateType === "decrease" ? (
                              <CircularProgress size={20} />
                            ) : (
                              <RemoveIcon />
                            )}
                          </IconButton>

                          <Typography>{item.quantity}</Typography>

                          {/* زر الزيادة */}
                          <IconButton
                            onClick={() => {
                              if (item.quantity >= stock_quantity) {
                                Swal.fire(
                                  "تنبيه",
                                  "لقد وصلت إلى الحد الأقصى للمخزون المتاح",
                                  "info"
                                );
                                return;
                              }
                              updateCartItemQuantity(
                                item.id,
                                item.quantity + 1
                              );
                            }}
                            disabled={
                              isUpdating === item.id ||
                              item.quantity >= stock_quantity
                            }
                            sx={{
                              color: !(
                                isUpdating === item.id ||
                                item.quantity >= stock_quantity
                              )
                                ? "green"
                                : "inherit",
                              "&:hover": {
                                backgroundColor: !(
                                  isUpdating === item.id ||
                                  item.quantity >= stock_quantity
                                )
                                  ? "rgba(0, 128, 0, 0.1)"
                                  : "inherit",
                              },
                            }}
                          >
                            {isUpdating === item.id &&
                            updateType === "increase" ? (
                              <CircularProgress size={20} />
                            ) : (
                              <AddIcon />
                            )}
                          </IconButton>
                        </Box>

                        {/* حذف المنتج */}
                        <Button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={isUpdating === item.id}
                          startIcon={<DeleteIcon />}
                          sx={{
                            color: "#f44336",
                            "&:hover": {
                              backgroundColor: "rgba(244, 67, 54, 0.04)",
                            },
                          }}
                        >
                          {isUpdating === item.id && updateType === "delete"
                            ? "جاري الحذف..."
                            : "حذف"}
                        </Button>
                      </Box>

                      {/* الإجمالي */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          minWidth: "100px",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          الإجمالي
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {itemTotal} جنيه
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* ملخص الطلب */}
              <Box
                sx={{
                  flex: 1,
                  // backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "25px",
                  height: "fit-content",
                  position: { md: "sticky" },
                  top: "120px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "20px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  ملخص الطلب
                </Typography>

                <Box sx={{ marginBottom: "20px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <Typography variant="body1">عدد المنتجات:</Typography>
                    <Typography variant="body1">{cartItems.length}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <Typography variant="body1">المجموع:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {totalPrice.toFixed(2)} جنيه
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  sx={{
                    marginBottom: "15px",
                    padding: "12px",
                    fontWeight: "bold",
                  }}
                  startIcon={
                    isCheckingOut ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : null
                  }
                >
                  {isCheckingOut ? "جاري التوجيه للدفع..." : "اتمام الشراء"}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={handleDeleteAll}
                  disabled={isClearingCart || cartItems.length === 0}
                  sx={{
                    padding: "12px",
                    fontWeight: "bold",
                    position: "relative",
                  }}
                >
                  {isClearingCart ? (
                    <>
                      <CircularProgress
                        size={24}
                        color="error"
                        sx={{
                          position: "absolute",
                          left: "20px",
                        }}
                      />
                      جاري الإفراغ...
                    </>
                  ) : (
                    "إفراغ السلة"
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        <Footer />
      </Box>
    </>
  );
}

export default Cart;
