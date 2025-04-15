import React, { useState, useEffect } from 'react';
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
  TableRow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const API_URL = "http://localhost:8000/api/orders";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('user_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('فشل في جلب الطلبات');
        }

        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'shipped':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('YYYY-MM-DD HH:mm');
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
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
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6">
          لا توجد طلبات سابقة
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          تصفح المنتجات
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        طلباتي السابقة
      </Typography>

      {/* <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>رقم الطلب</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>المجموع</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id.split('-')[0]}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)} 
                  />
                </TableCell>
                <TableCell>{formatPrice(order.total_price)} ج.م</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    التفاصيل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      {/* عرض بديل للجوال */}
      <Box sx={{ display: { xs: 'block'}, mt: 3 }}>
        {orders.map((order) => (
          <Card key={order.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">طلب #{order.id.split('-')[0]}</Typography>
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status)} 
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatDate(order.created_at)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>المجموع:</Typography>
                <Typography fontWeight="bold">
                  {formatPrice(order.total_price)} ج.م
                </Typography>
              </Box>
              
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => handleViewDetails(order.id)}
              >
                عرض التفاصيل
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default UserOrders;