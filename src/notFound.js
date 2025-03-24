import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import './notFound.css'

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notFound">
      <Box className='error' textAlign="center" mt={5}>
      <Typography variant="h1" color="error">404</Typography>
      <Typography variant="h5">الصفحة غير موجودة</Typography>
      <Typography variant="body1">يبدو أنك وصلت إلى صفحة غير صحيحة.</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        العودة إلى الصفحة الرئيسية
      </Button>
    </Box>
    </div>
  );
};

export default NotFound;