import React, { useContext } from "react";
import "./ProductItem.css";
import { assets } from "../../assets/assets"; // Import your assets
import { StoreContext } from "../../context/StoreContext";

const ProductItem = ({
  id,
  name,
  price,

  quantity,
  expiryDate,
  productImage,
}) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  const cartItem = cartItems.find((item) => item._id === id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="product-item">
      <div className="product-item-img-container">
        <img src={productImage} alt={name} className="product-item-img" />
        {itemQuantity > 0 ? (
          <div className="product-item-counter">
            <img
              src={assets.remove_icon_red}
              alt="remove_icon_red"
              onClick={() => removeFromCart(id)}
            />
            <p>{itemQuantity}</p>
            <img
              src={assets.add_icon_green}
              alt="add_icon_green"
              onClick={() => addToCart(id)}
            />
          </div>
        ) : (
          <img
            src={assets.add_icon_white}
            alt="add_icon_white"
            className="add"
            onClick={() => addToCart(id)}
          />
        )}
      </div>
      <div className="product-item-info">
        <div className="product-item-name-rating">
          <p className="fs-3">{name}</p>
          <img src={assets.rating_starts} alt="rating_starts" />
        </div>
        <p className="product-item-price ">₹ {price}</p>
        <p className="product-item-quantity fs-5">
          <strong>Quantity:</strong> {quantity} in stock
        </p>
        <p className="product-item-expiry fs-5">
          <strong>Expiry Date:</strong>{" "}
          {new Date(expiryDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
