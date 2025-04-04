import { useState, useEffect } from "react";
import styles from "./AccountInformation.module.css"; // ✅ الآن هو CSS Module
import { useNavigate } from "react-router-dom"; // لاستخدام التوجيه بعد تسجيل الخروج
import MyNavbar from "./navbar";

function AccountInformation() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook للتوجيه بين الصفحات

  useEffect(() => {
    const userToken = localStorage.getItem("user_token"); // جلب التوكين من localStorage

    if (!userToken) {
      setError("لم يتم العثور على التوكين. الرجاء تسجيل الدخول.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/user/getaccount", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`, // إرسال التوكين مع الطلب
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات، تحقق من التوكين.");
        }
        return response.json();
      })
      .then((data) => {
        setAccount(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // ✅ دالة تسجيل الخروج
  const handleLogout = () => {
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      navigate("/login"); // لو مفيش توكين، يروح على صفحة تسجيل الدخول
      return;
    }

    fetch("http://localhost:8000/api/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("فشل تسجيل الخروج، حاول مرة أخرى.");
        }
        return response.json();
      })
      .then(() => {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_id");
        navigate("/login");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (loading) return (
    <>
    <MyNavbar />
    <div className={styles.container1}>
      <div className={styles.card}>
        <h1 className={styles.loading}>جارٍ تحميل البيانات...</h1>
      </div>
    </div>
  </>
);
  if (error) return(
    <>
    <MyNavbar />
    <div className={styles.container1}>
      <div className={styles.card}>
        <h1 className={styles.error}>{error}</h1>
      </div>
    </div>
  </>
);

  return (
  <>
    <MyNavbar />
    <div className={styles.container1}>
      <div className={styles.card}>
        <h1 className={styles.title}>معلومات الحساب</h1>
        <p><strong>👤 الاسم:</strong> {account.name}</p>
        <p><strong>📧 البريد الإلكتروني:</strong> {account.email}</p>
        <p><strong>📞 رقم الهاتف:</strong> {account.phone}</p>
        <p><strong>📍 العنوان:</strong> {account.address}</p>

        {/* زر تسجيل الخروج */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          🚪 تسجيل الخروج
        </button>
      </div>
    </div>
  </>
  );
}

export default AccountInformation;

