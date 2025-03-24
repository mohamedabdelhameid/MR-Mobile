import React, { useState } from "react";
import Home, { Footer } from './home';
import Slider, { SelectCategory } from "./Slider";
import AboutUs from './aboutus';
import MyNavbar from "./navbar";


function App() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <>
            <MyNavbar />
            <Slider setSelectedCategory={setSelectedCategory}/>
            <Home />
            <SelectCategory selectedCategory={selectedCategory}/>
            <AboutUs/>
            <Footer/>
        </>
    );
}

export default App;
