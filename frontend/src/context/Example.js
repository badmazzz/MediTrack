import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const StoreContext = createContext(null);

const ecafe = "https://e-cafe-backend.onrender.com/api/v1";

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [exploreMenu, setExploreMenu] = useState([]);
  const [table, setTable] = useState([]);
  const [error, setError] = useState("Error");
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentState, setCurrentState] = useState("Login");
  const [username, setUsername] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchMenuList();
    fetchTableList();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    getTotalCartAmount();
  }, [cartItems]);

  const parseErrorMessage = (responseHTMLString) => {
    const parser = new DOMParser();

    const responseDocument = parser.parseFromString(
      responseHTMLString,
      "text/html"
    );

    const errorMessageElement = responseDocument.querySelector("pre");

    if (errorMessageElement) {
      const errorMessageText = errorMessageElement.textContent.trim();

      const errorMessageMatch = errorMessageText.match(
        /^Error:\s*(.*?)(?=\s*at|$)/
      );

      if (errorMessageMatch && errorMessageMatch[1]) {
        return errorMessageMatch[1].trim();
      } else {
        return errorMessageText;
      }
    }
    return "Something went wrong 😕";
  };

  const fetchMenuList = async () => {
    try {
      const menuRes = await axios.get(`${ecafe}/menu/`);
      setFoodList(menuRes.data.data);
      const exploreRes = await axios.get(`${ecafe}/menu/explore`);
      setExploreMenu(exploreRes.data);
    } catch (err) {
      console.error("Error fetching menu list:", err);
    }
  };

  const fetchTableList = async () => {
    try {
      const tableRes = await axios.get(`${ecafe}/table/`);
      setTable(tableRes.data.data);
    } catch (err) {
      console.error("Error fetching menu list:", err);
    }
  };

  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.menuId === itemId
      );

      if (existingItemIndex === -1) {
        // Item doesn't exist in the cart, add it with quantity 1
        return [...prev, { menuId: itemId, quantity: 1 }];
      } else {
        // Item exists, increment the quantity
        return prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.menuId === itemId
      );

      if (existingItemIndex !== -1) {
        if (prev[existingItemIndex].quantity === 1) {
          return prev.filter((item, index) => index !== existingItemIndex);
        } else {
          return prev.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        }
      }

      return prev;
    });
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const itemInfo = foodList.find((product) => product._id === item.menuId);
      setTotalAmount(total + (itemInfo ? itemInfo.price * item.quantity : 0));
      return total + (itemInfo ? itemInfo.price * item.quantity : 0);
    }, 0);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${ecafe}/user/login`, {
        email,
        password,
      });
      const { user, accessToken, refreshToken } = response.data.data;

      // Logging for debugging
      console.log("User:", user);
      console.log("AccessToken:", accessToken);
      console.log("RefreshToken:", refreshToken);

      // Storing user data in local storage and cookies
      localStorage.setItem("user", JSON.stringify(user));
      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("refreshToken", refreshToken, { expires: 7 });

      // Setting state
      setUser(user);
      setShowLogin(false);
      toast.success(response.data.message);
    } catch (err) {
      console.error("Login error:", err);

      if (err.response && err.response.status === 401) {
        setShowLogin(true);
      }
      toast.error(parseErrorMessage(err.response.data));
    }
  };

  const placeOrder = async () => {
    const data = {
      cartItems,
      totalAmount,
    };
    try {
      const orderRes = await axios.post(`${ecafe}/order/create`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(orderRes.data.message);
    } catch (err) {
      console.log("Order not placed...", err);
      if (err.response && err.response.status === 401) {
        setShowLogin(true);
      }
      toast.error(parseErrorMessage(err.response.data));
    }
  };

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("street", street);
    formData.append("zipcode", zipcode);
    formData.append("city", city);
    formData.append("avatar", avatar);
    formData.append("phone", phone);

    try {
      const response = await axios.post(`${ecafe}/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await handleLogin(email, password, setUser, setShowLogin);
      toast.success(response.data.message);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(parseErrorMessage(err.response.data));
    }
  };

  const handleLogout = async () => {
    let ans = window.confirm("Are you sure you want to logout?");
    if (ans) {
      try {
        const response = await axios.post(`${ecafe}/user/logout`);
        localStorage.removeItem("user");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
        toast.success(response.data.message);
        window.location.reload();
      } catch (err) {
        console.error("Logout error:", err);
        toast.error(parseErrorMessage(err.response.data));
      }
    }
  };

  const handleTableRegistration = async (name, date, time, guests) => {
    const data = {
      name,
      date,
      time,
      guests,
    };

    try {
      const response = await axios.post(`${ecafe}/table/add`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(response.data.message);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.status === 401) {
        setShowLogin(true);
      }
      toast.error(parseErrorMessage(err.response.data));
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      const response = await axios.delete(`${ecafe}/table/${id}`);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(parseErrorMessage(err.response.data));
    }
  };

  const contactUs = async (data) => {
    try {
      const response = await axios.post(`${ecafe}/user/contactus`, data);
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error while creating contact", error);
      if (err.response && err.response.status === 401) {
        setShowLogin(true);
      }
      parseErrorMessage(parseErrorMessage(err.response.data));
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await axios.patch(`${ecafe}/user/update-account`, data);
      const { user } = response.data.data;

      console.log("User:", user);

      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setShowLogin(false);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(parseErrorMessage(err.response.data));
    }
  };

  const updateAvatar = async (avatar) => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    try {
      const response = await axios.patch(`${ecafe}/user/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { user } = response.data.data;
      console.log("User:", user);

      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setShowLogin(false);
      toast.success("Avatar updated successfully");
    } catch (err) {
      toast.error(parseErrorMessage(err.response.data));
    }
  };

  const contextValue = {
    foodList,
    exploreMenu,
    table,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
    handleLogin,
    handleRegister,
    handleLogout,
    handleTableRegistration,
    handleDeleteTable,
    totalAmount,
    placeOrder,
    user,
    setUser,
    showPopup,
    setShowPopup,
    contactUs,
    showLogin,
    setShowLogin,
    currentState,
    setCurrentState,
    username,
    setUsername,
    street,
    setStreet,
    avatar,
    setAvatar,
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
    updateProfile,
    updateAvatar,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
