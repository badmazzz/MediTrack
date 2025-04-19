import React, { useContext } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./ProductItem.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const ProductItem = ({
  _id,
  name,
  price,
  originalPrice,
  productImage,
  category,
  isNew,
  isSale,
  rating,
}) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  const cartItem = cartItems.find((item) => item._id === _id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++)
      stars.push(<FaStar key={`full-${i}`} className="me-1" />);
    if (halfStar) stars.push(<FaStarHalfAlt key="half" className="me-1" />);
    for (let i = 0; i < emptyStars; i++)
      stars.push(<FaRegStar key={`empty-${i}`} className="me-1" />);

    return stars;
  };

  return (
    <div className="product-item">
      <div className="product-item-img-container">
        <img src={productImage} alt={name} className="product-item-img" />

        {/* Badges */}
        {isNew && (
          <span className="badge bg-success position-absolute top-0 start-0 m-2">
            New
          </span>
        )}
        {isSale && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            Sale
          </span>
        )}

        {/* Cart Button */}
        {!itemQuantity ? (
          <img
            src={assets.add_icon_white}
            alt="add_icon_white"
            className="add"
            onClick={() => addToCart(_id)}
          />
        ) : (
          <div className="product-item-counter">
            <img
              src={assets.remove_icon_red}
              alt="remove_icon_red"
              onClick={() => removeFromCart(_id)}
            />
            <p>{itemQuantity}</p>
            <img
              src={assets.add_icon_green}
              alt="add_icon_green"
              onClick={() => addToCart(_id)}
            />
          </div>
        )}
      </div>

      <div className="product-item-info">
        <div className="product-item-name-rating">
          <p className="product-name">{name}</p>
          {isSale ? (
            <div className="price-container">
              <span className="text-danger fw-bold product-item-price">
                ₹{price}
              </span>
              <del className="text-muted small d-block original-price">
                ₹{originalPrice}
              </del>
            </div>
          ) : (
            <span className="fw-bold product-item-price">₹{price}</span>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="text-warning d-flex align-items-center">
            {renderStars(rating)}
          </div>
          <p className="text-muted product-category fs-5">{category}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
