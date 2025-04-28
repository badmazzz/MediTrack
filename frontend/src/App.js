import React, {useEffect} from "react";
import { Routes, Route,  } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home.js";
import ProductDisplay from "./pages/Products/ProductDisplay.js";
import OrderDetails from "./pages/OrderDetails/OrderDetails.js";
import Cart from "./components/Cart/Cart.js";
import "../src/styles/styles.css"
import "aos/dist/aos.css";
import AOS from "aos";
import Login from "./pages/Login/Login.js";
import UserProfile from "./components/User Profile/UserProfile.js";



const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false, 
      offset: 150,
    });
  }, []);
  
  return (
    <div className="App bg-light px-3">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductDisplay />} />
        <Route path="/categories" element={<ProductDisplay />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<OrderDetails />} />
        <Route path="/edit-profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default App;
