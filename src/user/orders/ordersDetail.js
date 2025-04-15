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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Footer } from "../../landing/home";
import MyNavbar from "../../landing/navbar";

const API_URL = "http://localhost:8000/api/orders";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب تفاصيل الطلب");
        }

        const data = await response.json();
        setOrder(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "info";
      case "cancelled":
        return "error";
      case "shipped":
        return "warning";
      default:
        return "primary";
    }
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

  // دالة جديدة لجلب صورة المنتج بناءً على البيانات الجديدة
  const getProductImage = (item) => {
    // إذا كان هناك صورة للون تأتي مباشرة مع البيانات
    if (item.color_image) {
      return `http://localhost:8000${item.color_image}`;
    }
    
    // إذا كان هناك صورة غلاف للمنتج
    if (item.product?.image_cover) {
      return `http://localhost:8000${item.product.image_cover}`;
    }
    
    // إذا كان هناك صورة عادية للمنتج
    if (item.product?.image) {
      return `http://localhost:8000${item.product.image}`;
    }
    
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!order) {
    return (
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
                  المنتجات
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
                      {order.order_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                src={getProductImage(item)}
                                alt={item.product?.title}
                                sx={{ width: 56, height: 56, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {item.product?.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {item.product?.model_number}
                                  {item.color_name && (
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
                                          backgroundColor: item.color_name === "أحمر" ? "red" :
                                                         item.color_name === "أزرق" ? "blue" :
                                                         item.color_name === "أصفر" ? "yellow" :
                                                         item.color_name === "أسود" ? "black" :
                                                         item.color_name === "أبيض" ? "white" :
                                                         item.color_name === "أخضر" ? "green" :
                                                         "#cccccc",
                                          mr: 1,
                                          border: "1px solid #ddd",
                                          display: "inline-block",
                                        }}
                                      />
                                      <span>اللون: {item.color_name}</span>
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
                      ))}
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
                      {formatPrice(order.total_price)} ج.م
                    </Typography>
                  </ListItem>
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
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default OrderDetails;