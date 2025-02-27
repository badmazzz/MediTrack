import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const Navbar = () => {
  const { user, logout } = useContext(StoreContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand fw-bold" to="/">
        MEDTRACK
      </Link>
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
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
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
              Cart
            </NavLink>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link fw-bold text-primary">
                  {user.email}
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger ms-2" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
