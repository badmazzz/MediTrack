import React, { useState, useContext } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/login.css";
import { StoreContext } from "../context/StoreContext";
import { NavLink } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    login,
    signup,
  } = useContext(StoreContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      try {
        await signup(email, password, name);
        setError("");
        alert("Sign up successful! Please log in.");
        setIsSignUp(false);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        await login(email, password);
        setError("");
      } catch (err) {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>{isSignUp ? "Create an account" : "Welcome back!"}</h2>
            <p>
              {isSignUp
                ? "Sign up to get started"
                : "Please enter your details"}
            </p>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    console.log(name);
                  }}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  console.log(email);
                }}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    console.log(password);
                  }}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>

              {isSignUp && (
                <div className="pass-input-div">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="login-center-options">
                  <div className="remember-div">
                    <input type="checkbox" id="remember-checkbox" />
                    <label htmlFor="remember-checkbox">
                      Remember for 30 days
                    </label>
                  </div>
                  <NavLink href="/" className="forgot-pass-link">
                    Forgot password?
                  </NavLink>
                </div>
              )}

              <div className="login-center-buttons">
                <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <NavLink
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
