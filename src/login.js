import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignInAlt, FaHome } from "react-icons/fa";

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // استبدل هذا الرابط بـ API الحقيقي عند توفره
      const response = await axios.post("https://api.example.com/signup", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        setMessage("تم إنشاء الحساب بنجاح! سيتم تحويلك للصفحة الرئيسية...");
        setTimeout(() => navigate("/"), 2000); // إعادة التوجيه بعد 2 ثانية
      } else {
        setMessage("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
      }
    } catch (error) {
      setMessage("فشل الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
    }

    setLoading(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box p={4} width={"350px"} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" textAlign="center" mb={2} color="primary">
          إنشاء حساب جديد
        </Typography>

        <form onSubmit={handleSignup}>
          <TextField
            label="الاسم الكامل"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="البريد الإلكتروني"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="كلمة المرور"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="تأكيد كلمة المرور"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "جاري التسجيل..." : "إنشاء حساب"}
          </Button>
        </form>

        {message && (
          <Typography color="success.main" textAlign="center" mt={2}>
            {message}
          </Typography>
        )}

        <Box textAlign="center" mt={2}>
        <Typography mt={1} style={{ color: theme.palette.text.primary, marginLeft: 5 }}>

            لديك حساب بالفعل؟
            <Link to="/singeup" style={{ color: theme.palette.primary.main }}>
              تسجيل الدخول
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

export default Signup;
