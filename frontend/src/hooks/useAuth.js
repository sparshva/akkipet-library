// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper: Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp * 1000; // convert seconds → ms

    return Date.now() > exp;
  } catch (error) {
    return true; // invalid token = treat as expired
  }
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      setIsAuthenticated(false);
      localStorage.removeItem("token"); // delete expired token
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  return { isAuthenticated };
};

export default useAuth;
