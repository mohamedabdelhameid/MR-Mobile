import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyCode = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // جلب البريد من الرابط
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://api.example.com/verify-code", {
        email,
        code,
      });

      if (response.data.success) {
        setMessage("تم تسجيلك بنجاح! سيتم تحويلك إلى الصفحة الرئيسية...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage("الكود الذي أدخلته غير صحيح، يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      setMessage("فشل التحقق من الكود، حاول مرة أخرى.");
    }

    setLoading(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={theme.palette.background.default}>
      <Box p={4} width={"350px"} bgcolor="white" borderRadius={2} boxShadow={3}>
        <Typography variant="h4" textAlign="center" mb={2} color="primary">
          تحقق من رمز التأكيد
        </Typography>

        <form onSubmit={handleVerifyCode}>
          <TextField
            label="أدخل الرمز الذي تم إرساله"
            variant="outlined"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
            {loading ? "جارٍ التحقق..." : "تحقق"}
          </Button>
        </form>

        {message && (
          <Typography color={message.includes("تم تسجيلك") ? "success.main" : "error.main"} textAlign="center" mt={2}>
            {message}
          </Typography>
        )}

        <Box textAlign="center" mt={2}>
          <Typography>
            <Button onClick={() => navigate("/forgot-password")} sx={{ color: theme.palette.primary.main }}>
              إعادة إرسال الرمز
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyCode;
