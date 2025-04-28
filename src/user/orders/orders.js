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



















// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Card, 
//   CardContent, 
//   CircularProgress, 
//   Button,
//   Divider,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   useMediaQuery,
//   useTheme
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import moment from 'moment';
// import { Footer } from '../../landing/home';
// import MyNavbar from '../../landing/navbar';

// const API_URL = "http://localhost:8000/api/orders";

// const UserOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   useEffect(() => {
//     const fetchUserOrders = async () => {
//       try {
//         const token = localStorage.getItem('user_token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         const response = await fetch(API_URL, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           }
//         });

//         if (!response.ok) {
//           throw new Error('فشل في جلب الطلبات');
//         }

//         const data = await response.json();
//         setOrders(data.data || []);
//       } catch (err) {
//         setError(err.message || 'حدث خطأ أثناء جلب الطلبات');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserOrders();
//   }, [navigate]);

//   const getStatusColor = (status) => {
//     const statusColors = {
//       'completed': 'success',
//       'processing': 'info',
//       'cancelled': 'error',
//       'shipped': 'warning',
//       'pending': 'warning',
//       'delivered': 'success'
//     };
//     return statusColors[status] || 'primary';
//   };

//   const formatDate = (dateString) => {
//     return moment(dateString).format('YYYY-MM-DD HH:mm');
//   };

//   const formatPrice = (price) => {
//     return parseFloat(price).toLocaleString('ar-EG', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     });
//   };

//   const handleViewDetails = (orderId) => {
//     navigate(`/orders/${orderId}`);
//   };

//   if (loading) {
//     return (
//       <>
//         <MyNavbar />
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
//           <CircularProgress />
//         </Box>
//         <Footer />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <MyNavbar />
//         <Box p={3} className="container">
//           <Typography color="error" variant="h6">
//             خطأ: {error}
//           </Typography>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={() => window.location.reload()}
//             sx={{ mt: 2 }}
//           >
//             إعادة المحاولة
//           </Button>
//         </Box>
//         <Footer />
//       </>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <>
//         <MyNavbar />
//         <Box p={3} textAlign="center" className="container">
//           <Typography variant="h6">
//             لا توجد طلبات سابقة
//           </Typography>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={() => navigate('/products')}
//             sx={{ mt: 2 }}
//           >
//             تصفح المنتجات
//           </Button>
//         </Box>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <MyNavbar />
      
//       <Box sx={{ p: 3, mt: 10 }} className="container">
//         <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
//           طلباتي السابقة ({orders.length})
//         </Typography>

//         {isMobile ? (
//           // عرض الموبايل
//           <Box sx={{ mt: 3 }}>
//             {orders.map((order) => (
//               <Card key={order.id} sx={{ mb: 3, boxShadow: 3 }}>
//                 <CardContent>
//                   <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Typography variant="h6" fontWeight="bold">
//                       طلب #{order.id.split('-')[0]}
//                     </Typography>
//                     <Chip 
//                       label={order.status}
//                       color={getStatusColor(order.status)}
//                       sx={{ fontWeight: 'bold' }}
//                     />
//                   </Box>
                  
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                     {formatDate(order.created_at)}
//                   </Typography>
                  
//                   <Divider sx={{ my: 2 }} />
                  
//                   <Box display="flex" justifyContent="space-between" mb={2}>
//                     <Typography>عدد المنتجات:</Typography>
//                     <Typography>{order.order_items.length}</Typography>
//                   </Box>
                  
//                   <Box display="flex" justifyContent="space-between" mb={2}>
//                     <Typography>المجموع:</Typography>
//                     <Typography fontWeight="bold">
//                       {formatPrice(order.total_price)} ج.م
//                     </Typography>
//                   </Box>
                  
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     onClick={() => handleViewDetails(order.id)}
//                     sx={{ mt: 1 }}
//                   >
//                     عرض التفاصيل
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>
//         ) : (
//           // عرض سطح المكتب
//           <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
//                   <TableCell sx={{ fontWeight: 'bold' }}>رقم الطلب</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>عدد المنتجات</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>المجموع</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orders.map((order) => (
//                   <TableRow key={order.id} hover>
//                     <TableCell>#{order.id.split('-')[0]}</TableCell>
//                     <TableCell>{formatDate(order.created_at)}</TableCell>
//                     <TableCell>{order.order_items.length}</TableCell>
//                     <TableCell>
//                       <Chip 
//                         label={order.status}
//                         color={getStatusColor(order.status)}
//                         sx={{ fontWeight: 'bold' }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: 'bold' }}>
//                       {formatPrice(order.total_price)} ج.م
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outlined"
//                         onClick={() => handleViewDetails(order.id)}
//                         sx={{ 
//                           borderColor: theme.palette.primary.main,
//                           color: theme.palette.primary.main,
//                           '&:hover': {
//                             backgroundColor: theme.palette.primary.light,
//                             color: theme.palette.primary.contrastText
//                           }
//                         }}
//                       >
//                         التفاصيل
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
      
//       <Footer />
//     </>
//   );
// };

// export default UserOrders;