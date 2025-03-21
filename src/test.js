import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import LogoImg from "./img/mobileLogo.png";
import { useSelector } from "react-redux";
import { selectCartCount } from "./cartSlice";
import "./nav_stayel.css";
// import { useState, useEffect } from "react";
import './LIGHT&DARK.css';
function BasicExample() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const cartCount = useSelector(selectCartCount);

  return (
    <Navbar expand="lg" className={`custom-navbar ${darkMode ? "dark" : "light"}`}>
      <Container className="cont" >
      
        <img className="imf" data-aos="fade-left" data-aos-duration="1500" src={LogoImg} alt="Logo" />
       
        <Navbar.Collapse id="basic-navbar-nav"  className="w-100 d-flex justify-content-center">
          <div className="nav-link d-flex gap-5"> 
<Nav.Link className="ms-5 fw-bold befor" as={Link} to="/">الصفحة الرئسية </Nav.Link>
          <Nav.Link as={Link} className="befor" to="/contact">تواصل معنا</Nav.Link>
            <Nav.Link as={Link} className="me-5 befor"  to="/products">المنتجات</Nav.Link>
       
          </div>
           

          {/* فورم البحث + زر البحث */}
          <Form className="d-flex ms-auto search">
            <Form.Control type="search" placeholder="Search" className="me-2" />
            <Button variant="outline-success">Search</Button>
          </Form>


        </Navbar.Collapse>
        <span id="theme_switch">
      <input
        type="checkbox"
        className="checkbox"
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
          {/* زر تبديل المود */}
         
          {/* أيقونة السلة */}

          <Link to="/yourCart" className="position-relative cart-icon ms-3 ">
            <ShoppingCartIcon className="fs-1" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Container>
    </Navbar>
  );
}

export default BasicExample;
