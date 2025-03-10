import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "../../styles/login.css";
import Image from "../../assets/image.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    currentState,
    setCurrentState,
    username,
    setUsername,
    street,
    setStreet,
    city,
    setCity,
    zipcode,
    setZipcode,
    phone,
    setPhone,
    password,
    setPassword,
    email,
    setEmail,
    handleLogin,
    handleRegister,
    setAvatar,
  } = useContext(StoreContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentState === "Sign up") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      try {
        await handleRegister();
        setError("");
        alert("Sign up successful! Please log in.");
        setCurrentState("Login");
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        await handleLogin();
        setError("");
        navigate("/"); // Redirect to home page after successful login
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
            <svg
              width="369.9130434782609"
              height="103.1566308494726"
              viewBox="0 0 369.9130434782609 88.9486789568575"
              class="looka-1j8o68f"
            >
              <defs id="SvgjsDefs1169"></defs>
              <g
                id="SvgjsG1170"
                featurekey="HKaMnE-0"
                transform="matrix(0.862617673230079,0,0,0.862617673230079,0.9105552343487417,4.843455816924802)"
                fill="#0c056d"
              >
                <g xmlns="http://www.w3.org/2000/svg">
                  <rect x="48.8" y="2.5" width="2.5" height="5.6"></rect>
                  <rect
                    x="56.4"
                    y="5.3"
                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 22.5766 -38.3953)"
                    width="2.5"
                    height="5.6"
                  ></rect>
                  <rect
                    x="39.6"
                    y="6.8"
                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 18.104 -27.5969)"
                    width="5.6"
                    height="2.5"
                  ></rect>
                  <path d="M13.7,42H9.1c-1.8,0-3.2,1.5-3.2,3.2v12.5h7.9V42z"></path>
                  <path d="M90.9,42.5h-4.6v15.7h7.8h0V45.7C94.2,43.9,92.7,42.5,90.9,42.5z"></path>
                  <path d="M71.3,89.4H28.7h-1.3H13.8v4.7c0,1.9,1.5,3.4,3.4,3.4h8.1c1.9,0,3.4-1.5,3.4-3.4h0v-1.6h42.5v1.6c0,1.9,1.5,3.4,3.4,3.4   h8.1c1.9,0,3.4-1.5,3.4-3.4v-4.7H72.4H71.3z"></path>
                  <path d="M86.2,79V63.8c0-1.4-0.5-2.6-1.4-3.6V28.6c0-2.7-2.2-4.9-4.9-4.9H56.2c0-0.1,0-0.1,0-0.2v-2.1c0-0.5-0.4-1-1-1H55v-3.7   c0-2.7-2.2-4.9-4.9-4.9h-0.3c-2.7,0-4.9,2.2-4.9,4.9v3.7h-0.2c-0.5,0-1,0.4-1,1v2.1c0,0.1,0,0.1,0,0.2H20.1c-2.7,0-4.9,2.2-4.9,4.9   v31.6c-0.9,0.9-1.4,2.2-1.4,3.6V79c-0.6,0.2-1,0.8-1,1.4v5.9c0,0.6,0.4,1.2,1,1.4v0.1h0.6h71.2h0.6v-0.1c0.6-0.2,1-0.8,1-1.4v-5.9   C87.1,79.8,86.7,79.2,86.2,79z M46.4,16.9c0-1.9,1.6-3.4,3.4-3.4H50v6.9h-3.6V16.9z M20.2,54.4l5.1-13.5c0.5-1.7,2.1-2.8,3.8-2.8   h41.7c1.7,0,3.3,1.1,3.8,2.8l5.1,13.5c0.5,1.3-0.5,2.7-1.9,2.7H22.1C20.6,57.2,19.7,55.7,20.2,54.4z M22.6,71.6   c-2.5,0-4.6-2-4.6-4.6s2-4.6,4.6-4.6s4.6,2,4.6,4.6S25.1,71.6,22.6,71.6z M56.5,73.2H52v4.6h-4.5v-4.6h-4.6v-4.5h4.6v-4.6H52v4.6   h4.6V73.2z M77.4,71.6c-2.5,0-4.6-2-4.6-4.6s2-4.6,4.6-4.6s4.6,2,4.6,4.6S79.9,71.6,77.4,71.6z"></path>
                </g>
              </g>
              <g
                id="SvgjsG1171"
                featurekey="J3GnXt-0"
                transform="matrix(2.398537937816336,0,0,2.398537937816336,91.97045324506884,19.856058947210578)"
                fill="#0c056d"
              >
                <path d="M4.54 5.84 l4.5 10.72 l0.08 0 l4.46 -10.72 l2.86 0 l0 14.16 l-1.92 0 l0 -11.64 l-0.04 0 l-4.78 11.64 l-1.28 0 l-4.78 -11.64 l-0.04 0 l0 11.64 l-1.92 0 l0 -14.16 l2.86 0 z M29.080000000000002 5.84 l0 1.8 l-7.22 0 l0 4.22 l6.72 0 l0 1.8 l-6.72 0 l0 4.54 l7.58 0 l0 1.8 l-9.5 0 l0 -14.16 l9.14 0 z M36.88 5.84 c1.5067 0 2.8134 0.31 3.92 0.93 s1.9533 1.47 2.54 2.55 s0.88 2.28 0.88 3.6 s-0.32666 2.5234 -0.98 3.61 s-1.5667 1.9367 -2.74 2.55 s-2.48 0.92 -3.92 0.92 l-4.74 0 l0 -14.16 l5.04 0 z M36.28 18.2 c1.08 0 2.07 -0.21002 2.97 -0.63002 s1.6133 -1.0233 2.14 -1.81 s0.79 -1.7333 0.79 -2.84 c0 -1.6 -0.49666 -2.88 -1.49 -3.84 s-2.31 -1.44 -3.95 -1.44 l-2.98 0 l0 10.56 l2.52 0 z M48.900000000000006 5.84 l0 14.16 l-1.92 0 l0 -14.16 l1.92 0 z M61.980000000000004 5.84 l0 1.8 l-4.56 0 l0 12.36 l-1.92 0 l0 -12.36 l-4.56 0 l0 -1.8 l11.04 0 z M69.10000000000001 5.84 c1.3867 0 2.4734 0.34666 3.26 1.04 s1.18 1.6667 1.18 2.92 c0 0.94666 -0.32334 1.7733 -0.97 2.48 s-1.4767 1.1267 -2.49 1.26 l-0.02 0 l4.02 6.46 l-2.4 0 l-3.6 -6.24 l-2.14 0 l0 6.24 l-1.92 0 l0 -14.16 l5.08 0 z M68.54 12.08 c1 0 1.7433 -0.18336 2.23 -0.55002 s0.73 -0.94332 0.73 -1.73 c0 -1.52 -0.98666 -2.28 -2.96 -2.28 l-2.6 0 l0 4.56 l2.6 0 z M82.42 5.84 l6.06 14.16 l-2.24 0 l-1.42 -3.5 l-6.74 0 l-1.4 3.5 l-2.24 0 l6.24 -14.16 l1.74 0 z M78.76 14.82 l5.36 0 l-2.64 -6.5 l-0.04 0 z M96.82 5.48 c1 0 1.9367 0.18664 2.81 0.55998 s1.59 0.92 2.15 1.64 l-1.6 1.22 c-0.86666 -1.08 -2.0066 -1.62 -3.42 -1.62 c-1.5333 0 -2.7966 0.54666 -3.79 1.64 s-1.49 2.4666 -1.49 4.12 c0 1.6 0.49 2.92 1.47 3.96 s2.25 1.56 3.81 1.56 s2.7934 -0.63334 3.7 -1.9 l1.62 1.22 c-0.56 0.74666 -1.3067 1.3467 -2.24 1.8 s-1.9733 0.68 -3.12 0.68 c-1.36 0 -2.5934 -0.33 -3.7 -0.99 s-1.98 -1.5667 -2.62 -2.72 s-0.96 -2.3634 -0.96 -3.63 c0 -2.1866 0.68666 -3.99 2.06 -5.41 s3.1466 -2.13 5.32 -2.13 z M106.32 5.84 l0 6.12 l0.16 0 l6.26 -6.12 l2.68 0 l-6.84 6.54 l7.3 7.62 l-2.8 0 l-6.6 -7.08 l-0.16 0 l0 7.08 l-1.92 0 l0 -14.16 l1.92 0 z"></path>
              </g>
            </svg>
          </div>
          <div className="login-center">
            <h2>
              {currentState === "Sign up"
                ? "Create an account"
                : "Welcome back!"}
            </h2>
            <p>
              {currentState === "Sign up"
                ? "Sign up to get started"
                : "Please enter your details"}
            </p>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              {currentState === "Sign up" && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <div className="multi-fields">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Zip Code"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="file"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    required
                  />
                </>
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              {currentState === "Sign up" && (
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
              {currentState === "Login" && (
                <div className="login-center-options">
                  <div className="remember-div">
                    <input type="checkbox" id="remember-checkbox" />
                    <label htmlFor="remember-checkbox">
                      Remember for 30 days
                    </label>
                  </div>
                  <NavLink to="/forgot-password" className="forgot-pass-link">
                    Forgot password?
                  </NavLink>
                </div>
              )}
              <div className="login-center-buttons">
                <button type="submit">
                  {currentState === "Sign up" ? "Create Account" : "Log In"}
                </button>
              </div>
            </form>
          </div>
          <p className="login-bottom-p">
            {currentState === "Login" ? (
              <>
                Don't have an account?{" "}
                <span onClick={() => setCurrentState("Sign up")}>Sign Up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setCurrentState("Login")}>Login</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
