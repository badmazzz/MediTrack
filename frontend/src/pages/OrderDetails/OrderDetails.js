import React, { useContext } from "react";
import {
  FaQuestionCircle,
  FaTruck,
  FaCheck,
  FaTimes,
  FaCreditCard,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { orderDetails } = useContext(StoreContext);

  // Order status configuration
  const orderStatusConfig = {
    pending: {
      icon: <FaQuestionCircle className="text-white" size={12} />,
      bgClass: "bg-warning",
      text: "Pending",
    },
    shipped: {
      icon: <FaTruck className="text-white" size={12} />,
      bgClass: "bg-info",
      text: "Shipped",
    },
    delivered: {
      icon: <FaCheck className="text-white" size={12} />,
      bgClass: "bg-success",
      text: "Delivered",
    },
    cancelled: {
      icon: <FaTimes className="text-white" size={12} />,
      bgClass: "bg-danger",
      text: "Cancelled",
    },
  };

  // Payment status configuration
  const paymentStatusConfig = {
    pending: {
      icon: <FaQuestionCircle className="text-white" size={12} />,
      bgClass: "bg-warning",
      text: "Pending",
    },
    paid: {
      icon: <FaCreditCard className="text-white" size={12} />,
      bgClass: "bg-success",
      text: "Paid",
    },
    failed: {
      icon: <FaExclamationTriangle className="text-white" size={12} />,
      bgClass: "bg-danger",
      text: "Failed",
    },
  };

  const getOrderStatusDisplay = (status) => {
    return (
      orderStatusConfig[status] || {
        icon: <FaQuestionCircle className="text-white" size={12} />,
        bgClass: "bg-secondary",
        text: status,
      }
    );
  };

  const getPaymentStatusDisplay = (status) => {
    return (
      paymentStatusConfig[status] || {
        icon: <FaQuestionCircle className="text-white" size={12} />,
        bgClass: "bg-secondary",
        text: status,
      }
    );
  };

  return (
    <div className="container py-5 w-75 bg-light">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Order Details</h1>
        <p className="text-muted">
          Check the status of recent and old orders & discover more products.
        </p>
      </div>

      <ul className="list-unstyled">
        {orderDetails?.map((order) => {
          const orderStatus = getOrderStatusDisplay(order.status);
          const paymentStatus = getPaymentStatusDisplay(order.paymentStatus);

          return (
            <li key={order._id} className="mb-5">
              <div className="card">
                <div className="row g-0">
                  {/* Order Summary Section */}
                  <div className="col-md-3 bg-light p-4">
                    <h4 className="fw-bold mb-4">Order Summary</h4>

                    <div className="mb-3">
                      <p className="text-muted small mb-1">Order ID</p>
                      <p className="fw-semibold fs-5">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div className="mb-3">
                      <p className="text-muted small mb-1">Date</p>
                      <p className="fw-semibold fs-5">{order.createdAt}</p>
                    </div>

                    <div className="mb-3">
                      <p className="text-muted small mb-1">Total</p>
                      <p className="fw-semibold fs-5">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    {/* Order Status */}
                    <div className="mb-3">
                      <p className="text-muted small mb-1">Order Status</p>
                      <div className="d-flex align-items-center">
                        <span
                          className={`rounded-circle d-flex align-items-center justify-content-center ${orderStatus.bgClass} me-2`}
                          style={{ width: "20px", height: "20px" }}
                        >
                          {orderStatus.icon}
                        </span>
                        <span className="fw-bold fs-4">{orderStatus.text}</span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mb-3">
                      <p className="text-muted small mb-1">Payment Status</p>
                      <div className="d-flex align-items-center">
                        <span
                          className={`rounded-circle d-flex align-items-center justify-content-center ${paymentStatus.bgClass} me-2`}
                          style={{ width: "20px", height: "20px" }}
                        >
                          {paymentStatus.icon}
                        </span>
                        <span className="fw-bold fs-4">
                          {paymentStatus.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="col-md-9 p-4">
                    <ul className="list-unstyled">
                      {order.products.map((product) => (
                        <li
                          key={product.product}
                          className="d-flex border-bottom py-4 align-items-center"
                        >
                          <div className="me-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="img-fluid rounded"
                              style={{ width: "120px" }}
                            />
                          </div>

                          <div className="flex-grow-1 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="mb-1 fs-3">{product.name}</h5>
                                <div className="d-flex align-items-center">
                                  <p className="text-muted fs-5 mb-0 me-3">
                                    Quantity: {product.quantity}
                                  </p>
                                  <p className="text-muted fs-5 mb-0">
                                    Price: ₹{product.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-muted">
                                  ₹
                                  {(product.price * product.quantity).toFixed(
                                    2
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="d-flex mt-3">
                              <Link
                                to={`/product/${product.product}`}
                                className="text-dark me-3"
                              >
                                View Product
                              </Link>
                              <Link to="#" className="text-dark">
                                Similar Product
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <button className="btn btn-outline-secondary">
                        View Order
                      </button>
                      <button className="btn btn-outline-secondary">
                        View Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderDetails;
