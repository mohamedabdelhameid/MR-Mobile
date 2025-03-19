import { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { selectCartCount } from "./cartSlice";
import LogoImg from "./img/mobileLogo.png";
import "./nav_stayel.css";

const MyNavbar = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const [searchOpen, setSearchOpen] = useState(false);

  const searchRef = useRef(null);

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

  const cartCount = useSelector(selectCartCount);

  return (
    <>
      <Navbar expand="lg" className={`custom-navbar ${darkMode ? "dark" : "light"}`} expanded={expanded}>
        <Container className="d-flex align-items-center justify-content-between w-100">
          
          <img className="logo" src={LogoImg} alt="Logo" />

          <div className="d-flex align-items-center order-lg-2">
            <Link to="/yourCart" className="position-relative cart-icon me-3">
              <ShoppingCartIcon className="fs-1" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <span id="theme_switch" className="me-3">
              <input type="checkbox" id="checkbox" hidden checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <label htmlFor="checkbox" className="checkbox-label">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <span className="ball"></span>
              </label>
            </span>

            {/* زر فتح البحث في الشاشات الصغيرة */}
            {/* <button className="search-toggle d-lg-none" onClick={() => setSearchOpen(!searchOpen)}>
              <i className="fas fa-search"></i>
            </button> */}

            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="nav-links d-flex gap-4">
              <Nav.Link as={Link} to="/" className={`befor ${activeTab === "/" ? "active" : ""}`} onClick={() => { setActiveTab("/"); setExpanded(false); }}>
                الصفحة الرئيسية
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className={`befor ${activeTab === "/contact" ? "active" : ""}`} onClick={() => { setActiveTab("/contact"); setExpanded(false); }}>
                تواصل معنا
              </Nav.Link>
              <Nav.Link as={Link} to="/products" className={`befor ${activeTab === "/products" ? "active" : ""}`} onClick={() => { setActiveTab("/products"); setExpanded(false); }}>
                المنتجات
              </Nav.Link>
            </Nav>

            {/* البحث في الشاشات الكبيرة */}
            <Form className="d-none d-lg-flex search-form">
              <Form.Control type="search" placeholder="بحث..." className="me-2" />
              <Button variant="outline-success">بحث</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* مربع البحث في الشاشات الصغيرة */}
      {searchOpen && (
        <div ref={searchRef} className="mobile-search-bar">
          <Form className="d-flex w-100">
            <Form.Control type="search" placeholder="بحث..." className="me-2" />
            <Button variant="outline-success">بحث</Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default MyNavbar;
