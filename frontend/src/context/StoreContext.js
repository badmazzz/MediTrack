import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaPills, FaFirstAid, FaStethoscope } from "react-icons/fa";

axios.defaults.withCredentials = true;

export const StoreContext = createContext();

const meditrack = "http://localhost:2000/api/v1";

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [currentState, setCurrentState] = useState("Login");
  const [categories, setCategories] = useState("");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getProduct();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [cartItems, products]);

  useEffect(() => {
    filter();
    category();
  }, [categories]);

  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex((item) => item._id === itemId);
      if (existingItemIndex === -1) {
        return [...prev, { _id: itemId, quantity: 1 }];
      } else {
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
      const existingItemIndex = prev.findIndex((item) => item._id === itemId);
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

  const calculateTotalAmount = () => {
    const total = cartItems.reduce((acc, item) => {
      const product = products.find((p) => p._id === item._id);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
    setTotalAmount(total);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const itemInfo = products.find((product) => product._id === item.menuId);
      setTotalAmount(total + (itemInfo ? itemInfo.price * item.quantity : 0));
      return total + (itemInfo ? itemInfo.price * item.quantity : 0);
    }, 0);
  };

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

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${meditrack}/users/login`, {
        email,
        password,
      });
      const { user, accessToken, refreshToken } = response.data.data;

      console.log("User:", user);
      console.log("AccessToken:", accessToken);
      console.log("RefreshToken:", refreshToken);

      localStorage.setItem("user", JSON.stringify(user));
      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("refreshToken", refreshToken, { expires: 7 });

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

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("street", street);
    formData.append("zipcode", zipcode);
    formData.append("city", city);
    formData.append("avatar", avatar);
    formData.append("phone", phone);

    try {
      const response = await axios.post(
        `${meditrack}/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
        const response = await axios.post(`${meditrack}/users/logout`);
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

  const getProduct = async () => {
    try {
      const response = await axios.get(`${meditrack}/products/`);
      setProducts(response.data.data);
    } catch (err) {
      console.error("Error fetching product list list:", err);
    }
  };

  const placeOrder = async () => {
    const data = {
      products: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      totalAmount,
      shippingAddress: `${user.address[0].street}, ${user.address[0].city}, ${user.address[0].zipcode}`,
    };

    console.log(data);
    try {
      const orderRes = await axios.post(`${meditrack}/orders/`, data, {
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

  const filter = async () => {
    if (categories) {
      try {
        const response = await axios.get(`${meditrack}/products/filter`, {
          params: { category: categories },
        });

        if (response.status === 200) {
          const products = response.data.data;

          if (products.length === 0) {
            toast.info("No products found for the selected category.");
          } else {
            console.log("Filtered Products:", products);
            setProducts(products);
            toast.success("Products filtered successfully!");
          }
        } else {
          toast.error("Failed to filter products.");
        }
      } catch (error) {
        console.error("Error while filtering products:", error);
        toast.error("An error occurred while filtering products.");
      }
    }
  };

  const category = (products) => {
    if (!products || !Array.isArray(products)) {
      return [];
    }

    const categories = [
      ...new Set(products.map((product) => product.category)),
    ].map((category) => {
      let icon;
      switch (category) {
        case "Medicine":
          icon = <FaPills size={40} />;
          break;
        case "Supplies":
          icon = <FaFirstAid size={40} />;
          break;
        case "Equipment":
          icon = <FaStethoscope size={40} />;
          break;
        default:
          icon = <FaPills size={40} />;
      }

      return {
        name: category,
        icon,
        description: `Explore our wide range of ${category.toLowerCase()}.`,
      };
    });

    return categories; 
  };

  return (
    <StoreContext.Provider
      value={{
        currentState,
        setCurrentState,
        name,
        setName,
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
        user,
        handleLogout,
        showLogin,
        getProduct,
        products,
        cartItems,
        setCartItems,
        totalAmount,
        addToCart,
        removeFromCart,
        calculateTotalAmount,
        getTotalQuantity,
        getTotalCartAmount,
        showPopup,
        setShowPopup,
        categories,
        setCategories,
        placeOrder,
        filter,
        category,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
