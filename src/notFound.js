import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box className="notFound" display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" textAlign="center" bgcolor="#f8f9fa">
      <Typography variant="h1" color="error" fontWeight="bold" className="error" fontSize={{ xs: 80, md: 150 }}>
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" mb={2}>
        الصفحة غير موجودة
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3} maxWidth="400px">
        يبدو أنك وصلت إلى صفحة غير صحيحة. تأكد من العنوان أو عد إلى الصفحة الرئيسية.
      </Typography>
      <Button variant="contained" color="primary" size="large" onClick={() => navigate("/")}>العودة إلى الصفحة الرئيسية</Button>
    </Box>
  );
};

export default NotFound;
