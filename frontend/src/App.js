// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import SearchBooks from "./components/SearchBooks/SearchBooks";
import { AppProvider } from "./components/AppProvider/AppProvider"; // Import the context provider
import "./App.css";
import { Toast } from "./components/Toast/Toast"; // Import the Toast component
import Header from "./components/Header/Header.jsx";
import AdminLogin from "./components/AdminLogin/AdminLogin.jsx";
import Orders from "./components/Orders/Orders.jsx"; // Import the Orders component
import useAuth from "./hooks/useAuth";
import Users from "./components/Users/Users";
import Books from "./components/Books/Books.jsx";
import MyHistory from "./components/MyHistory/MyHistory.jsx";
import Footer from "./components/Footer/Footer";
import ContactUs from "./components/ContactUs/ContactUs.jsx";
//https://api.akkipetgyanbhandar.in
function App() {
  const { isAuthenticated } = useAuth();
  // console.log("App");
  return (
    <AppProvider>
      {" "}
      {/* Wrap your app with the AppProvider */}
      <div className="App bg-[#fafafa] min-h-[100vh] pb-[4rem]  relative">
        <Toast />
        <Header />
        {/* <Router> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchBooks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/manage/orders" element={<Orders />} />
          <Route path="/admin/manage/users" element={<Users />} />{" "}
          <Route path="/admin/manage/books" element={<Books />} />
          <Route path="/my-history" element={<MyHistory />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
        {/* </Router> */}
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
