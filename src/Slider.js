import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "./cartSlice";
import Carousel from "react-bootstrap/Carousel";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";

import banner1 from "./img/banner_home1.png";
import banner2 from "./img/banner_home2.png";
import banner3 from "./img/banner_box1.jpg";

import "./home.css";
import { fetchProducts } from "./productSlice";
import "./slider.css";

export function SelectCategory({ selectedCategory }) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    fetch("https://ecommerce.routemisr.com/api/v1/products")
      .then((res) => res.json())
      .then((json) => setProducts(json.data || []))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        products.filter((p) => p.category?.name === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchProducts()).then(() => setIsFetching(false));
  }, [dispatch]);

  const handleAddToCart = async (product) => {
    setIsLoading(true);
    setMessage("جارٍ إضافة المنتج...");
    await dispatch(addToCart(product));
    setIsLoading(false);
    setMessage("✔ تم إضافة المنتج بنجاح! 🎉");
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <>
      {message && <div className="message-box ">{message}</div>}
      {selectedCategory && (
        <div
          className="mt-4 text-center container"
          style={{ direction: "rtl" }}
          id="productFilter"
        >
          <h1 className="fw-bold mb-2">منتجات {selectedCategory}</h1>
          <div className="Items-list div-0">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="product-card div-1">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.imageCover}
                      width="100%"
                      alt={product.title || "صورة المنتج"}
                      className="imgProduct rounded-3"
                    />
                  </Link>
                  {product.brand?.name && (
                    <p className="product-pric text-center fw-800">
                      {product.brand.name}
                    </p>
                  )}
                  {product.title && (
                    <p className="product-title text-center fw-bold">
                      {product.title}
                    </p>
                  )}
                  {product.price && (
                    <p className="product-price text-center fw-800">
                      {product.price} جنية
                    </p>
                  )}
                  <button
                    className="btn btn-success w-100 my-3"
                    onClick={() => handleAddToCart(product)}
                    disabled={isLoading && currentProduct === product._id}
                  >
                    {isLoading && currentProduct === product._id ? (
                      <span className="loader"></span>
                    ) : (
                      <> أضف الى {<FaCartPlus />} </>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <p>لا توجد منتجات في هذه الفئة</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ControlledCarousel({ setSelectedCategory }) {
  const handleBannerClick = (index) => {
    const categories = ["Women's Fashion", "Men's Fashion", "Electronics"];
    setSelectedCategory(categories[index]);
  };
  const navigate = useNavigate();
  return (
    <Carousel interval={3000} className="slider">
      <Carousel.Item
        onClick={() => {
          navigate("/#productFilter");
          setTimeout(() => {
            const element = document.getElementById("productFilter");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);

          handleBannerClick(0);
        }}
      >
        <img
          src={banner1}
          className="imgSlider d-block w-100"
          alt="First slide"
          loading="lazy"
        />
      </Carousel.Item>
      <Carousel.Item
        onClick={() => {
          navigate("/#productFilter");
          setTimeout(() => {
            const element = document.getElementById("productFilter");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);

          handleBannerClick(1);
        }}
      >
        <img
          src={banner3}
          className="imgSlider d-block w-100"
          alt="Second slide"
          loading="lazy"
        />
      </Carousel.Item>
      <Carousel.Item
        onClick={() => {
          navigate("/#productFilter");
          setTimeout(() => {
            const element = document.getElementById("productFilter");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);

          handleBannerClick(2);
        }}
      >
        <img
          src={banner2}
          className="imgSlider d-block w-100"
          alt="Third slide"
          loading="lazy"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
