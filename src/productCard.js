import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCart } from './cartSlice';
import './productCard.css';

function ProductCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("Product Data in ProductCard:", data); // تحقق من البيانات في الـ Console

  if (!data || Object.keys(data).length === 0) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="div-1 bblockk">
      <img
        className='img-fluid'
        src={data?.imageCover}
        onClick={() => navigate(`/product/${data._id}`)}
        alt={data.title || "Product Image"}
      />
      <div className="div2flex">
        <p id="title" className='ppopo'>{data.title || "Unknown Product"}</p>
        <p id="Price">{data.price ? `${data.price} جنية` : "غير متوفر"}</p>
        <div className="btns">
        <button
          id="btn-1"
          className='btn btn-primary'
          style={{ width: '100%' }}
          onClick={() => {
            console.log("Adding to cart:", data); // ✅ تحقق من أن `data` يحتوي على المنتج
            dispatch(addToCart(data));
            navigate("/yourCart");
          }}
        >
          إشتري الآن
        </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;