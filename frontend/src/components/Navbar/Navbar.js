import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { FaUserCircle, FaEdit, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import Logo from "../../assets/logo.js";

const Navbar = () => {
  const { user, logout } = useContext(StoreContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3 text-primary me-auto" to="/">
          {Logo()}
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" exact>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">
                Categories
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/" exact>
                Order
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/" exact>
                Cart
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center ms-auto">
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
                    onClick={logout}
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

        {/* Navbar Toggler for Mobile */}
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
