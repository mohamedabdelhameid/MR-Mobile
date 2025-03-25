import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaHome } from "react-icons/fa";

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://your-api-url.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("تم تسجيل الدخول بنجاح");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ، حاول مرة أخرى");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={theme.palette.background.default}>
      <Box p={4} width={350} bgcolor="white" borderRadius={2} boxShadow={3}>
        <Typography variant="h4" textAlign="center" mb={2} color="primary">
          تسجيل الدخول
        </Typography>

        {error && <Typography color="error" textAlign="center">{error}</Typography>}
        {success && <Typography color="success.main" textAlign="center">{success}</Typography>}

        <form onSubmit={handleLogin}>
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
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            startIcon={<FaSignInAlt />} 
            sx={{ mt: 2 }}
          >
            تسجيل الدخول
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography>
            <Link to="/forgot-password" style={{ color: theme.palette.primary.main }}>
              هل نسيت كلمة المرور؟
            </Link>
          </Typography>
          <Typography mt={1} style={{ color: theme.palette.text.primary, marginLeft: 5 }}>

            ليس لديك حساب؟ 
            <Link to="/login" style={{ color: theme.palette.primary.main, marginLeft: 5 }}>
              إنشاء حساب جديد
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
