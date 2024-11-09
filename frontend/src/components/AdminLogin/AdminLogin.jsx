import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios
import { toast } from "../Toast/Toast";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AppContext } from "../AppProvider/AppProvider";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("AdminLogin token: " + token, token);
    if (token) navigate("/admin/manage/orders", { replace: true });
  }, [navigate]);

  const [loginInfo, setLoginInfo] = useState({
    phoneNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State for showing password

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(loginInfo);

    // Replace with your actual API endpoint
    const apiEndpoint = `${process.env.REACT_APP_BACKEND_BASE_URL}/user/login`;

    try {
      // Call the API to log in the user
      await toast.promise(
        axios.post(apiEndpoint, loginInfo), // Use axios to make the POST request
        {
          pending: "Logging in... Please wait.",
          success: {
            render({ data }) {
              console.log(data); // Log the response data for debugging
              localStorage.setItem("token", data.data.token);
              console.log(localStorage.getItem("token"));
              setIsLoggedIn(true);
              navigate("/admin/manage/orders"); // Navigate to orders page
              return "Login successful!"; // Show success message
            },
          },
          error: {
            render({ data }) {
              // Log the error for debugging
              console.error("Login error:", data.response.data.message);
              window.alert(data.response.data.message || "Login failed"); // Show error message
              return data.response.data.message || "Login failed"; // Show error message in toast
            },
          },
        }
      );
    } catch (error) {
      // Handle any errors that are not caught by toast.promise
      console.error("An error occurred during login:", error);
      toast.error("Error occurred during login"); // Show user-friendly error message
    }
  };

  return (
    <div className="flex w-full h-full justify-center items-center">
      <section className=" py-10 px-2  w-full">
        <div className="w-full  px-2   flex justify-center items-center ">
          <div className="relative border-0 shadow-[0_2px_5px_1px_rgba(0,0,0,0.3)]  flex flex-col min-w-0 break-words w-full  rounded-lg  max-w-[50vh] ">
            <div className="rounded-t bg-white mb-0 px-4 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">Login</h6>
              </div>
            </div>
            <div className="flex-auto px-4  py-10 pt-0">
              <form onSubmit={(e) => handleLogin(e)}>
                <div className="flex flex-col flex-wrap">
                  <div className="w-full  px-1">
                    <div className="relative w-full mb-3">
                      <label
                        className="flex  items-start uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Contact Number
                      </label>
                      <input
                        type="text"
                        className="border-2 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={loginInfo.phoneNumber}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          ); // Only allow digits
                          if (numericValue.length <= 10) {
                            setLoginInfo({
                              ...loginInfo,
                              phoneNumber: numericValue,
                            });
                          }
                        }}
                        required={true}
                        pattern="\d{10}"
                        title="Contact number must be exactly 10 digits"
                      />
                    </div>
                  </div>
                  <div className="w-full  px-1">
                    <div className="relative w-full mb-3">
                      <label
                        className="flex items-start uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"} // Change type to "password"
                        className="border-2 pl-3 pr-9 py-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={loginInfo.password} // Assuming you have password in your state
                        onChange={(e) => {
                          setLoginInfo({
                            ...loginInfo,
                            password: e.target.value, // Set the password directly
                          });
                        }}
                        required={true}
                        minLength={6} // You can set a minimum length for the password
                        title="Password must be at least 6 characters long"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                        className="absolute right-[6px] bottom-2 cursor-pointer"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon /> // Show eye-off icon when password is visible
                        ) : (
                          <VisibilityOutlinedIcon /> // Show eye icon when password is hidden
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex  justify-center items-center mt-4">
                  <button
                    className="bg-[#ad0000] text-white  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 cursor-pointer"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
