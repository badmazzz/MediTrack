import { createContext, useState } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const login = (email, password) => {
    console.log("Logging in with:", email, password);
    setUser({ email, name });
  };

  const signup = (name, email, password) => {
    console.log("Signing up with:", name, email, password);
    setUser({ name, email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
