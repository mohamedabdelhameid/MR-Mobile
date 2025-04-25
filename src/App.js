import React, { useState, useEffect } from "react";
import Home, { Footer } from './landing/home';
import Slider from "./landing/Slider";
import AboutUs from './landing/aboutus';
import MyNavbar from "./landing/navbar";
import { ScrollToHashElement } from "./landing/Slider";
import SplashScreen from "./components/SplashScreen";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500); // وقت عرض الاسبلاش (2.5 ثانية)

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <MyNavbar />
            <Slider />
            <Home />
            <AboutUs />
            <Footer />
            <ScrollToHashElement />
        </>
    );
}

export default App;