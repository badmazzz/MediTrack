import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import ProductDisplay from "./pages/Products/ProductDisplay";
import Cart from "./components/Cart/Cart";
import FormComponent from "./pages/Login/Login";


const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductDisplay />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<FormComponent />} />
      </Routes>
    </div>
  );
};

export default App;
