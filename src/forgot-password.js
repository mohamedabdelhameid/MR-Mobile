import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignInAlt, FaHome } from "react-icons/fa";

const Forgot = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8000/api/user/password/forgot", {
        email,
      });

      if (response.status === 200) {
        setMessage("تم إرسال رابط لتغيير كلمة السر.");
        // setTimeout(() => navigate(`/resetPassword?email=${email}`), 2000); // إعادة التوجيه إلى صفحة التحقق
      } else {
        setMessage("حدث خطأ، تأكد من صحة البريد الإلكتروني.");
      }
    } catch (error) {
      setMessage("فشل إرسال الطلب، حاول مرة أخرى.");
    }

    setLoading(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={theme.palette.background.default}>
      <Box p={4} width={"350px"} bgcolor="white" borderRadius={2} boxShadow={3}>
        <Typography variant="h4" textAlign="center" mb={2} color="primary">
          استعادة كلمة المرور
        </Typography>

        <form onSubmit={handleResetPassword}>
          <TextField
            label="البريد الإلكتروني"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "جارٍ الإرسال..." : "إستعادة كلمة المرور"}
          </Button>
        </form>

        {message && (
          <Typography color="success.main" textAlign="center" mt={2}>
            {message}
          </Typography>
        )}

        <Box textAlign="center" mt={2}>
          <Typography>
            <Link to="/singeup" style={{ color: theme.palette.primary.main }}>
              العودة إلى تسجيل الدخول
            </Link>
          </Typography>
        </Box>
            {/* زر العودة إلى الصفحة الرئيسية */}
            <Box display="flex" justifyContent="center" mt={3}>
          <Button 
            variant="outlined" 
            color="secondary" 
            startIcon={<FaHome />} 
            onClick={() => navigate("/")}
            sx={{
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)"
              }
            }}
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Forgot;
