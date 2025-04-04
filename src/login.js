import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignInAlt, FaHome } from "react-icons/fa";

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
      const response = await axios.post("http://localhost:8000/api/user/register", {
        name,
        email,
        phone,
        address,
        password,
        password_confirmation: confirmPassword,
      });
  
      if (response.status === 201) {
        setMessage("✅ تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.");
        // setTimeout(() => navigate("/singeup"), 3000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessage("⚠ خطأ في البيانات: " + JSON.stringify(error.response.data.error));
        } else if (error.response.status === 401) {
          setMessage("🔒 يرجى تأكيد حسابك عبر البريد الإلكتروني المرسل إلى " + email);
        } else {
          setMessage("❌ فشل الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
        }
      } else {
        setMessage("❌ حدث خطأ غير متوقع. حاول مرة أخرى.");
      }
    }
  
    setLoading(false);
  };
  
  

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box p={4} width={"350px"} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" textAlign="center" mb={2} color="primary">
          إنشاء حساب جديد
        </Typography>

        <p className="text-warning" style={{direction:"rtl"}}>سوف يتم إرسال رسالة عبر البريد الإلكتروني للتأكيد. </p>

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
            label="رقم الموبايل"
            variant="outlined"
            fullWidth
            margin="normal"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <TextField
            label="العنوان"
            variant="outlined"
            fullWidth
            margin="normal"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
