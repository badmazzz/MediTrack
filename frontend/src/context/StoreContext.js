import { createContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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
      const response = await axios.post(`${meditrack}/users/register`, formData, {
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

  const logout = () => {
    setUser(null);
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
        logout,
        showLogin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
