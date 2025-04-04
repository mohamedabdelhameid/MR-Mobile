import React, { useState } from "react";
import Home, { Footer } from './home';
import Slider from "./Slider";
import AboutUs from './aboutus';
import MyNavbar from "./navbar";
import { ScrollToHashElement } from "./Slider";

function App() {

    return (
        <>
            <MyNavbar/>
            <Slider/>
            <Home />
            <AboutUs/>
            <Footer/>
            <ScrollToHashElement />
        </>
    );
}

export default App;
