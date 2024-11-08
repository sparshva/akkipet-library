// src/context/AppContext.js
import React, { createContext, useState, useEffect } from "react";

// Create Context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [cartBooks, setCartBooks] = useState(() => {
    const savedBooks = localStorage.getItem("cartBooks");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Save selectedBooks to session storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartBooks", JSON.stringify(cartBooks));
  }, [cartBooks]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token")); // Update state based on the current token
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const clearAll = () => {
    setCartBooks([]);
  };

  return (
    <AppContext.Provider
      value={{ cartBooks, setCartBooks, clearAll, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AppContext.Provider>
  );
};
