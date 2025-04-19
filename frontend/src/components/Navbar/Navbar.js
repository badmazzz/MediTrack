import React, { useContext, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { FaUserCircle, FaEdit, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const { user, handleLogout, cartItems, setCategories, getProduct } =
    useContext(StoreContext);
  const location = useLocation(); // Get current path
  const [activeCategory, setActiveCategory] = useState("");

  const handleCategoryClick = (category) => {
    setCategories(category);
    setActiveCategory(category);
  };

  const product = () => {
    getProduct();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3 text-primary me-auto" to="/">
          {assets.Logo()}
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" exact>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/products"
                onClick={product}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                id="categoriesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </NavLink>
              <ul
                className="dropdown-menu"
                aria-labelledby="categoriesDropdown"
              >
                <li>
                  <NavLink
                    className="dropdown-item"
                    to="/categories"
                    onClick={() => handleCategoryClick("Medicines")}
                  >
                    Medicines
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="dropdown-item"
                    to="/categories"
                    onClick={() => handleCategoryClick("Supplies")}
                  >
                    Supplies
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="dropdown-item"
                    to="/categories"
                    onClick={() => handleCategoryClick("Equipment")}
                  >
                    Equipment
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/orders" exact>
                Order
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center ms-auto">
          <NavLink className="nav-link me-3 position-relative p-3" to="/cart">
            <img
              src={assets.basket_icon}
              alt="Basket"
              style={{ width: "24px", height: "24px" }}
            />
            {cartItems.length > 0 && (
              <span className="position-absolute top-0 badge rounded-pill bg-danger">
                {cartItems.length}
              </span>
            )}
          </NavLink>

          {user ? (
            <div className="nav-item dropdown">
              <div
                className="nav-link dropdown-toggle d-flex align-items-center user-dropdown"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={user.avatar || FaUserCircle}
                  alt="User Avatar"
                  className="rounded-circle user-avatar me-2"
                  style={{ width: "32px", height: "32px" }}
                />
              </div>
              <ul
                className="dropdown-menu dropdown-menu-end animate-dropdown text-center"
                aria-labelledby="navbarDropdown"
              >
                <li>
                  <NavLink className="dropdown-item fs-5" to="/edit-profile">
                    <FaEdit className="me-2" /> Edit Profile
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item fs-5 text-danger"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <NavLink className="nav-link btn login px-4" to="/login">
              Login
            </NavLink>
          )}
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
