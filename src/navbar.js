import { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { selectCartCount } from "./cartSlice";
import LogoImg from "./img/mobileLogo.svg";
import "./nav_stayel.css";
import {
  FaHome,
  FaStore,
  FaPhoneAlt,
  FaSignInAlt,
  FaHeart,
  FaUser,
} from "react-icons/fa";

const MyNavbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user_token")
  );

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);

  useEffect(() => {
    const updateFavoriteCount = () => {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      setFavoriteCount(storedFavorites.length);
    };

    // ✅ تحديث العدد عند تحميل الصفحة وأي تحديث في المفضلات
    updateFavoriteCount();
    window.addEventListener("favoritesUpdated", updateFavoriteCount);

    return () =>
      window.removeEventListener("favoritesUpdated", updateFavoriteCount);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user_token"));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/mobiles`
      );
      const data = await response.json();
  
      if (data && data.data) {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        const filteredResults = data.data.filter((product) =>
          product.title?.toLowerCase().includes(normalizedSearchTerm)
        );
  
        if (filteredResults.length > 0) {
          navigate(`/products?search=${searchTerm}`, {
            state: { results: filteredResults },
          });
        } else {
          alert("❌ لم يتم العثور على منتجات بهذا الاسم!");
        }
      }
    } catch (error) {
      console.error("❌ خطأ في جلب البيانات:", error);
    }
  };
  

  return (
    <>
      <Navbar
        expand="lg"
        className={`navLink custom-navbar ${darkMode ? "dark" : "light"}`}
        expanded={expanded}
      >
        <Container className="d-flex align-items-center justify-content-between w-100">
          <img
            className="logo"
            src={LogoImg}
            alt="Logo"
            onClick={() => navigate("/")}
            loading="lazy"
          />

          <div className="d-flex align-items-center order-lg-2">
            <span id="theme_switch" className="me-3">
              <input
                type="checkbox"
                id="checkbox"
                hidden
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <label htmlFor="checkbox" className="checkbox-label">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <span className="ball"></span>
              </label>
            </span>

            {/* ✅ مفضلات */}
            <Link to="/fouvrit" className="position-relative cart-icon me-3">
              <FaHeart className="fs-1 text-danger" />
              {/* {favoriteCount > 0 && (
                <span className="cart-badge">{favoriteCount}</span>
              )} */}
            </Link>

            {/* ✅ السلة */}
            <Link to="/yourCart" className="position-relative cart-icon me-3">
              <ShoppingCartIcon className="fs-1" />
              {/* {cartCount > 0 && <span className="cart-badge">{cartCount}</span>} */}
            </Link>

            <button
              className="search-toggle d-lg-none"
              onClick={() => {navigate('/searchProducts')}}
            >
              <i className="fas fa-search"></i>
            </button>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="Toogless"
              onClick={() => setExpanded(!expanded)}
            />
          </div>

          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-center"
          >
            <Nav className="nav-links d-flex gap-4">
              <Nav.Link
                as={Link}
                to="/"
                className={`befor ${activeTab === "/" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("/");
                  setExpanded(false);
                }}
              >
                <FaHome className="nav-icon" /> الصفحة الرئيسية
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/products"
                className={`befor ${activeTab === "/products" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("/products");
                  setExpanded(false);
                }}
              >
                <FaStore className="nav-icon" /> المنتجات
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/contact"
                className={`befor ${activeTab === "/contact" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("/contact");
                  setExpanded(false);
                }}
              >
                <FaPhoneAlt className="nav-icon" /> تواصل معنا
              </Nav.Link>

              <Nav.Link
                as={Link}
                to={isLoggedIn ? "/account" : "/singeup"}
                className={`sing ${activeTab === "/singeup" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("/singeup");
                  setExpanded(false);
                }}
              >
                {isLoggedIn ? (
                  <FaUser className="nav-icon singg" />
                ) : (
                  <FaSignInAlt className="nav-icon singg" />
                )}
                {isLoggedIn ? "حسابي" : "تسجيل الدخول"}
              </Nav.Link>
            </Nav>

            <Form
              className="d-lg-flex search-form"
              onSubmit={handleSearch}
              style={{ direction: "rtl" }}
            >
              <Button variant="outline-success" onClick={()=>{
                navigate('/searchProducts')
              }}>
              بحث
            </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default MyNavbar;
