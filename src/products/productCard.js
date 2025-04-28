import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCart } from '../user/cart/cartSlice';
import './productCard.css';
import { FaCartPlus } from 'react-icons/fa';

function ProductCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("Product Data in ProductCard:", data); // ✅ تأكد من البيانات في الـ Console

  if (!data || Object.keys(data).length === 0) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="div-1 bblockk">
      <img
        className='img-fluid'
        src={`http://localhost:8000${data.image_cover}`}
        alt={data.title || "Product Image"}
        loading="lazy"
        style={{ cursor: "pointer" }}
      />
      <div className="div2flex">
        <p id="title" className='ppopo text-success'>{data.title || "Unknown Product"}</p>
     
        <p id="Price">{data.price ? `${data.price} جنية` : "غير متوفر"}</p>



        <div className="btns">
          <button
            id="btn-1"
            className='btn btn-success rounded-pill'
            style={{ width: '100%' }}
            onClick={() => navigate(`/mobiles/${data.id}`)}
          >
            عرض التفاصيل
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
