/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || null,
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || null,
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const getTokenExpirationDate = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        return null;
      }

      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decoded.exp);

      return expirationDate;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    const expirationDate = getTokenExpirationDate(token);
    if (!expirationDate) {
      return false;
    }

    return expirationDate.getTime() <= new Date().getTime();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        console.log("Token expired, logging out.");
        logout();
      } else {
        setToken(storedToken);
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }

    const intervalId = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken && isTokenExpired(currentToken)) {
        console.log("Token expired, logging out (from interval).");
        logout();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //   }
  // }, []);

  const login = async (credentials) => {
    const loginEndpoint = "/auth/login";
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_GATEWAY + "/client-service" + loginEndpoint,
        {
          email: credentials.email,
          password: credentials.password,
        },
      );

      if (response.status === 201 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log(response.data);
        setToken(response.data.token);
        setIsLoggedIn(true);

        setUser(response.data.user);
        const decoded = jwtDecode(response.data.token);
        const userId = decoded.id;
        const userRole = decoded.role;
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", userRole);
        setUserId(userId);
        setUserRole(userRole);
        if (userRole === "client") {
          navigate("/restaurants");
        } else if (userRole === "chef") {
          navigate("/ChefList");
        } else {
          navigate("/livraisons");
        }
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setToken(null);
    setUser(null);
    setUserId(null);
    setUserRole(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  // const fetchUserData = async (authToken) => {
  //
  // };

  const value = {
    token,
    user,
    userId,
    userRole,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
