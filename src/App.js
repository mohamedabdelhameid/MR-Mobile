// import LogoImg from './img/mobileLogo.svg';
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setCartFromLocalStorage, selectCartCount } from "./cartSlice";
// import { Link } from "react-router-dom";

// function App() {
//     const dispatch = useDispatch();
//     const cartCount = useSelector(selectCartCount); // ✅ الحصول على عدد المنتجات في السلة

//     useEffect(() => {
//         dispatch(setCartFromLocalStorage());
//     }, [dispatch]);

//     return (
//         <>
//             <img src={LogoImg} alt="" />
//             <h1 className="container" data-aos="fade-left" data-aos-duration="1500">MR Mobile</h1>
//             <Link to="/products">product</Link> <br />
//             <Link to="yourCart">cart ({cartCount})</Link> {/* ✅ عرض عدد المنتجات */}
//         </>
//     );
// }

// export default App;


import LogoImg from './img/mobileLogo.svg';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartFromLocalStorage, selectCartCount } from "./cartSlice";
import { Link } from "react-router-dom";

function App() {
    const dispatch = useDispatch();
    const cartCount = useSelector(selectCartCount); // ✅ الحصول على عدد المنتجات في السلة

    useEffect(() => {
        dispatch(setCartFromLocalStorage());
    }, [dispatch]);

    return (
        <>
            <img src={LogoImg} alt="" />
            <h1 className="container" data-aos="fade-left" data-aos-duration="1500">MR Mobile</h1>
            <Link to="/products">product</Link> <br />
            
            {/* ✅ عرض العدد فقط إذا كان أكبر من 0 */}
            <Link to="yourCart">cart {cartCount > 0 && `(${cartCount})`}</Link>
        </>
    );
}

export default App;
