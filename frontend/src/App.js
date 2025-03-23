import React, {useEffect} from "react";
import { Routes, Route,  } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import ProductDisplay from "./pages/Products/ProductDisplay";
import Cart from "./components/Cart/Cart";
import FormComponent from "./pages/Login/Login";
import "../src/styles/styles.css"
import "aos/dist/aos.css";
import AOS from "aos";



const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false, 
      offset: 150,
    });
  }, []);
  
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductDisplay />} />
        <Route path="/categories" element={<ProductDisplay />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<FormComponent />} />
      </Routes>
    </div>
  );
};

export default App;
