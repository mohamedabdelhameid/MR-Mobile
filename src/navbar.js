import { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { selectCartCount } from "./cartSlice";
import LogoImg from "./img/mobileLogo.svg";
import "./nav_stayel.css";
import { FaHome, FaStore, FaPhoneAlt } from "react-icons/fa";
const MyNavbar = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products`);
      const data = await response.json();

      console.log("📌 جميع المنتجات:", data.data); // ✅ التأكد من استلام البيانات

      if (data && data.data) {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        const filteredResults = data.data.filter(product =>
          product.slug &&
          product.slug.toLowerCase().includes(normalizedSearchTerm) // ✅ البحث داخل slug فقط
        );

        console.log("🔍 نتائج البحث:", filteredResults); // ✅ التأكد من صحة البحث

        if (filteredResults.length > 0) {
          navigate(`/products?search=${searchTerm}`, { state: { results: filteredResults } });
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
      <Navbar expand="lg" className={`navLink custom-navbar ${darkMode ? "dark" : "light"}`} expanded={expanded}>
        <Container className="d-flex align-items-center justify-content-between w-100">
          <img className="logo" src={LogoImg} alt="Logo" onClick={() => navigate('/')} loading="lazy"/>

          <div className="d-flex align-items-center order-lg-2">
            <span id="theme_switch" className="me-3">
              <input type="checkbox" id="checkbox" hidden checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <label htmlFor="checkbox" className="checkbox-label">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <span className="ball"></span>
              </label>
            </span>

            <Link to="/yourCart" className="position-relative cart-icon me-3">
              <ShoppingCartIcon className="fs-1" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <button className="search-toggle d-lg-none" onClick={() => setSearchOpen(!searchOpen)}>
              <i className="fas fa-search"></i>
            </button>

            <Navbar.Toggle aria-controls="basic-navbar-nav" className="Toogless" onClick={() => setExpanded(!expanded)} />
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="nav-links d-flex gap-4">
  <Nav.Link as={Link} to="/" className={`befor ${activeTab === "/" ? "active" : ""}`} onClick={() => { setActiveTab("/"); setExpanded(false); }}>
    <FaHome className="nav-icon" /> الصفحة الرئيسية
  </Nav.Link>

  <Nav.Link as={Link} to="/products" className={`befor ${activeTab === "/products" ? "active" : ""}`} onClick={() => { setActiveTab("/products"); setExpanded(false); }}>
    <FaStore className="nav-icon" /> المنتجات
  </Nav.Link>

  <Nav.Link as={Link} to="/contact" className={`befor ${activeTab === "/contact" ? "active" : ""}`} onClick={() => { setActiveTab("/contact"); setExpanded(false); }}>
    <FaPhoneAlt className="nav-icon" /> تواصل معنا
  </Nav.Link>
</Nav>

            <Form className="d-lg-flex search-form" onSubmit={handleSearch} style={{direction:'rtl'}}>
              <Form.Control 
                type="search" 
                placeholder="بحث بالاسم..." 
                className="me-2" 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-success" type="submit">بحث</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {searchOpen && (
        <div ref={searchRef} className="mobile-search-bar">
          <Form className="d-flex w-100" onSubmit={handleSearch} style={{direction:'rtl'}}>
            <Form.Control 
              type="search" 
              placeholder="بحث بالاسم..." 
              className="me-2" 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" type="submit">بحث</Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default MyNavbar;
