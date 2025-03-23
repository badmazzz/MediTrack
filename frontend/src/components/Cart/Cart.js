import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

export const deliveryFee = 100;

const Cart = () => {
  const {
    cartItems,
    products,
    removeFromCart,
    getTotalQuantity,
    calculateTotalAmount,
    placeOrder,
    showPopup,
    totalAmount,
    getProduct,
  } = useContext(StoreContext);

  useEffect(() => {
    getProduct();
  }, []);

  const totalQuantity = getTotalQuantity();

  const handleOrder = () => {
    placeOrder();
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title cart-heading">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {totalQuantity === 0 ? (
          <p className="NoItems">No Items in cart</p>
        ) : (
          cartItems.map(({ _id, quantity }) => {
            const item = products.find((product) => product._id === _id);
            if (item) {
              return (
                <React.Fragment key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={item.productImage} alt="product img" />
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>{quantity}</p>
                    <p>₹{item.price * quantity}</p>
                    <p className="Remove" onClick={() => removeFromCart(_id)}>
                      <img
                        src={assets.remove_icon_cross}
                        alt="remove_icon_cross"
                        className="close"
                      />
                    </p>
                  </div>
                  <hr />
                </React.Fragment>
              );
            }
            return null;
          })
        )}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{totalAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{calculateTotalAmount === 0 ? 0 : deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalAmount === 0 ? 0 : totalAmount + deliveryFee}</b>
            </div>
          </div>
          <button
            className="btn btn-warning rounded-pill px-5 py-3 text-dark fw-semibold d-inline-flex align-items-center shadow-sm hover-scale"
            disabled={totalAmount === 0}
            onClick={handleOrder}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promocode, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo Code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <p>Order Placed Successfully!</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
