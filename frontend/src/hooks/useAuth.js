// src/hooks/useAuth.js
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Set true if token exists, else false
  }, []);

  return { isAuthenticated };
};

export default useAuth;
