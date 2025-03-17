import React, { useContext } from "react";
import "./ProductDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../../components/ProductItem/ProductItem.js";

const ProductDisplay = () => {
  const { products } = useContext(StoreContext);

  return (
    <div className="product-display">
      <h2>Available Medical Supplies</h2>
      <div className="product-display-list">
        {products.map((item) => {
          return (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              quantity={item.quantity}
              expiryDate={item.expiryDate}
              productImage={item.productImage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductDisplay;
