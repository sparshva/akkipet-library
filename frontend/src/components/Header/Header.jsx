import React, { useState, useEffect, useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppProvider/AppProvider";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
// import img1 from "../../images/img1.jpg";
const logo = process.env.PUBLIC_URL + "/images/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { isLoggedIn, setIsLoggedIn, cartBooks } = useContext(AppContext);

  const navigate = useNavigate();

  const navigateToAdminLoginPage = () => {
    setIsOpen(false);
    navigate("/admin/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Update state to reflect logout
    setIsOpen(false); //
    navigate("/"); // Redirect to the admin login page
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" bg-white  w-full py-1">
      <div className="max-w-full mx-auto px-2 py-1 sm:px-6 lg:px-8">
        <div className="flex items-center  justify-between w-full h-fit">
          <div className="  flex w-full mr-4  items-center justify-start sm:items-stretch">
            <div
              className=" flex cursor-pointer items-center"
              onClick={() => navigate("/")}
            >
              <img
                className="h-16 w-16 rounded-full"
                src={logo}
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%23CBD5E0' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/%3E%3C/svg%3E";
                }}
              />
              <span className="ml-2  flex flex-wrap  font-serif font-medium text-[23px]">
                <div className="mr-[0.4rem]">Akkipet</div>
                <div>Gyan Bhandar</div>
              </span>
            </div>
          </div>
          <div
            className="flex items-center cursor-pointer relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCartIcon sx={{}} />
            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartBooks.length}
            </div>
          </div>

          {windowWidth <= 768 ? (
            <button
              onClick={toggleMenu}
              className="inline-flex ml-4  items-center justify-center p-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-inset "
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <CloseIcon className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-in-out transform rotate-180" />
              ) : (
                <MenuIcon className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-in-out" />
              )}
            </button>
          ) : (
            <div className="hidden w-fit lg900:flex   justify-end ">
              <div className="  w-fit  flex items-center    justify-end ">
                {isLoggedIn ? (
                  <>
                    <div
                      className="text-black ml-6   rounded-md text-base font-medium transition-colors duration-200  flex items-center  cursor-pointer  focus:outline-none "
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                    <div
                      className="text-black ml-6  rounded-md text-base font-medium transition-colors duration-200 flex items-center  cursor-pointer   focus:outline-none "
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/admin/manage/orders");
                      }}
                    >
                      Orders
                    </div>
                    <div
                      className="text-black ml-6  rounded-md text-base font-medium transition-colors duration-200 flex items-center  cursor-pointer   focus:outline-none "
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/admin/manage/books");
                      }}
                    >
                      Books
                    </div>
                    <div
                      className="text-black ml-6  rounded-md text-base font-medium transition-colors duration-200 flex items-center  cursor-pointer   focus:outline-none "
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/admin/manage/users");
                      }}
                    >
                      Users
                    </div>
                  </>
                ) : (
                  <div
                    className="text-black ml-6  cursor-pointer rounded-md text-base font-medium transition-colors duration-200 flex items-center whitespace-nowrap w-fit  focus:outline-none "
                    onClick={navigateToAdminLoginPage}
                  >
                    Admin Login
                  </div>
                )}
                <div
                  className="text-black ml-6   rounded-md text-base font-medium transition-colors duration-200  flex items-center  whitespace-nowrap  cursor-pointer  focus:outline-none "
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/my-history");
                  }}
                >
                  My History
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg900:hidden fixed top-0 left-0 w-64 h-screen bg-gray-800/70 transform transition-transform duration-300 ease-in-out z-50`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-2   ">
          {isLoggedIn ? (
            <>
              <div
                type="button"
                className="text-white bg-[#ad0000] mb-4  px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full  flex items-center space-x-4 p-3 cursor-pointer  focus:outline-none "
                onClick={handleLogout}
              >
                <LogoutIcon sx={{ marginRight: "0.75rem" }} />
                Logout
              </div>
              <div
                type="button"
                className="text-white bg-[#ad0000] mb-4  px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full flex items-center space-x-4 p-3  cursor-pointer focus:outline-none "
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admin/manage/orders");
                }}
              >
                {" "}
                <LocalShippingIcon sx={{ marginRight: "0.75rem" }} />
                Orders
              </div>
              <div
                type="button"
                className="text-white bg-[#ad0000] mb-4  px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full flex items-center space-x-4 p-3  cursor-pointer focus:outline-none "
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admin/manage/books");
                }}
              >
                {" "}
                <LibraryBooksRoundedIcon sx={{ marginRight: "0.75rem" }} />
                Books
              </div>
              <div
                type="button"
                className="text-white bg-[#ad0000] mb-4  px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full flex items-center space-x-4 p-3  cursor-pointer focus:outline-none"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admin/manage/users");
                }}
              >
                <AccountBoxIcon sx={{ marginRight: "0.75rem" }} />
                Users
              </div>
            </>
          ) : (
            <div
              type="button"
              className="text-white bg-[#ad0000] mb-4  px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full flex items-center space-x-4 p-3  cursor-pointer focus:outline-none "
              onClick={navigateToAdminLoginPage}
            >
              <LoginIcon sx={{ marginRight: "0.75rem" }} />
              Admin Login
            </div>
          )}
          <div
            type="button"
            className="text-white bg-[#ad0000] mb-4  px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full flex items-center space-x-4 p-3 cursor-pointer  focus:outline-none "
            onClick={() => {
              setIsOpen(false);
              navigate("/my-history");
            }}
          >
            <HistoryToggleOffIcon sx={{ marginRight: "0.75rem" }} />
            My History
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg900:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
    </nav>
  );
};

export default Header;
