import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Grid,
  useTheme,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Footer } from "../../landing/home";
import MyNavbar from "../../landing/navbar";

const API_URL = "http://localhost:8000/api/orders";
const MOBILES_API = "http://localhost:8000/api/mobiles";
const ACCESSORIES_API = "http://localhost:8000/api/accessories";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [mobiles, setMobiles] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          navigate("/login");
          return;
        }

        // جلب بيانات الطلب والمنتجات بشكل متوازي
        const [orderRes, mobilesRes, accessoriesRes] = await Promise.all([
          fetch(`${API_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(MOBILES_API),
          fetch(ACCESSORIES_API),
        ]);

        if (!orderRes.ok) {
          throw new Error("فشل في جلب تفاصيل الطلب");
        }

        const orderData = await orderRes.json();
        const mobilesData = await mobilesRes.json();
        const accessoriesData = await accessoriesRes.json();

        setOrder(orderData.data);
        setMobiles(mobilesData.data || []);
        setAccessories(accessoriesData.data || []);
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    const statusColors = {
      completed: "success",
      processing: "info",
      cancelled: "error",
      shipped: "warning",
      delivered: "success",
      pending: "warning",
    };
    return statusColors[status] || "primary";
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("YYYY-MM-DD HH:mm");
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("ar-EG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getProductDetails = (item) => {
    if (item.product_type === "mobile") {
      const mobile = mobiles.find((m) => m.id === item.product_id);
      return {
        title: mobile?.title || "غير معروف",
        image: mobile?.image_cover 
          ? `http://localhost:8000${mobile.image_cover}`
          : "/default-mobile.png",
        specs: `${mobile?.storage || "غير معروف"} GB`,
        color: item.color_name || "غير محدد",
      };
    } else if (item.product_type === "accessory") {
      const accessory = accessories.find((a) => a.id === item.product_id);
      return {
        title: accessory?.title || "غير معروف",
        image: accessory?.image 
          ? `http://localhost:8000${accessory.image}`
          : "/default-accessory.png",
        specs: accessory?.description || "إكسسوار",
        color: accessory?.color || "غير محدد",
      };
    }
    return {
      title: "منتج غير معروف",
      image: "/default-product.png",
      specs: "",
      color: "",
    };
  };

  if (loading) {
    return (
      <>
        <MyNavbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" mt={4}>
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <MyNavbar />
        <Box p={3}>
          <Typography color="error" variant="h6">
            خطأ: {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            العودة
          </Button>
        </Box>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <MyNavbar />
        <Box p={3} textAlign="center">
          <Typography variant="h6">لا يوجد طلب بهذا الرقم</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/orders")}
            sx={{ mt: 2 }}
          >
            العودة إلى قائمة الطلبات
          </Button>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MyNavbar />

      <Box sx={{ p: 3, mt: 10, direction: "rtl" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          العودة
        </Button>

        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          تفاصيل الطلب #{order.id.split("-")[0]}
        </Typography>

        <Grid container spacing={3} style={{ direction: "ltr" }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  المنتجات ({order.order_items.length})
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>المنتج</TableCell>
                        <TableCell align="right">السعر</TableCell>
                        <TableCell align="right">الكمية</TableCell>
                        <TableCell align="right">المجموع</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.order_items.map((item) => {
                        const product = getProductDetails(item);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                  src={product.image}
                                  alt={product.title}
                                  sx={{ width: 56, height: 56, mr: 2 }}
                                  variant="rounded"
                                />
                                <Box>
                                  <Typography variant="subtitle1">
                                    {product.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {product.specs}
                                    {product.color && (
                                      <Box
                                        component="span"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          mt: 0.5,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: "50%",
                                            backgroundColor: product.color,
                                            mr: 1,
                                            border: "1px solid #ddd",
                                          }}
                                        />
                                        <span>اللون: {product.color}</span>
                                      </Box>
                                    )}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              {formatPrice(item.price)} ج.م
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              {formatPrice(item.price * item.quantity)} ج.م
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ملخص الطلب
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="رقم الطلب" />
                    <Typography>#{order.id.split("-")[0]}</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="تاريخ الطلب" />
                    <Typography>{formatDate(order.created_at)}</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="حالة الطلب" />
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem>
                    <ListItemText primary="المجموع الفرعي" />
                    <Typography>
                      {formatPrice(order.subtotal)} ج.م
                    </Typography>
                  </ListItem>
                  {order.delivery_fee > 0 && (
                    <ListItem>
                      <ListItemText primary="رسوم التوصيل" />
                      <Typography>
                        {formatPrice(order.delivery_fee)} ج.م
                      </Typography>
                    </ListItem>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <ListItem>
                    <ListItemText
                      primary="المجموع الكلي"
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {formatPrice(order.total_price)} ج.م
                    </Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {order.shipping_address && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    عنوان الشحن
                  </Typography>
                  <Typography>
                    {order.shipping_address.street}, {order.shipping_address.city}
                  </Typography>
                  <Typography>
                    {order.shipping_address.governorate}, {order.shipping_address.postal_code}
                  </Typography>
                  <Typography>الهاتف: {order.shipping_address.phone}</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default OrderDetails;