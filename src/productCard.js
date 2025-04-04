// import React from 'react';
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from 'react-redux';
// import { addToCart } from './cartSlice';
// import './productCard.css';
// import { FaCartPlus } from 'react-icons/fa';

// function ProductCard({ data }) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   console.log("Product Data in ProductCard:", data); // تحقق من البيانات في الـ Console

//   if (!data || Object.keys(data).length === 0) {
//     return <p>Loading product...</p>;
//   }

//   return (
//     <div className="div-1 bblockk">
//       <img
//         className='img-fluid'
//         src={`http://localhost:8000${data.image_cover}`}
//         onClick={() => navigate(`/mobiles/${data.id}`)}
//         alt={data.title || "Product Image"}
//         loading="lazy"
//       />
//       <div className="div2flex">
//         <p id="title" className='ppopo'>{data.title || "Unknown Product"}</p>
//         <p id="Price">{data.brand ? `${data.brand}` : "غير متوفر"}</p>
//         <p id="Price">{data.price ? `${data.price} جنية` : "غير متوفر"}</p>
//         <div className="btns">
//         <button
//           id="btn-1"
//           className='btn btn-primary'
//           style={{ width: '100%' }}
//           onClick={() => {
//             console.log("Adding to cart:", data); // ✅ تحقق من أن `data` يحتوي على المنتج
//             dispatch(addToCart(data));
//             navigate("/yourCart");
//           }}
//         >
//           أضف الى {<FaCartPlus />}
//         </button>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;


import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCart } from './cartSlice';
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
        onClick={() => navigate(`/mobiles/${data.id}`)}
        alt={data.title || "Product Image"}
        loading="lazy"
        style={{ cursor: "pointer" }}
      />
      <div className="div2flex">
        <p id="title" className='ppopo'>{data.title || "Unknown Product"}</p>
        
        {/* ✅ عرض اسم العلامة التجارية بناءً على نوع البيانات */}
        <p id="brand">
          {data.brand 
            ? typeof data.brand === "object" 
              ? data.brand.name 
              : data.brand
            : "غير متوفر"}
        </p>

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
            أضف الى <FaCartPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
