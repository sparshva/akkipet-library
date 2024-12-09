import React, { useState, useRef, useEffect } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import axios from "axios";
import { toast } from "../Toast/Toast";

const MyHistory = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const handleSubmitPhone = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/order/orders/by-phone-number`,
        {
          phoneNumber,
        }
      );
      setOrders(response.data);
      // console.log(response);

      if (response.data && response.data.length <= 0) {
        toast.success("No orders were found");
      }
      setIsLoading(false);
      //   console.log("Fetched books:", response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders. Please try again later", {
        //
      });
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOTP = () => {
    setTimer(30);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("OTP verified successfully!");
    }, 1500);
  };

  const handleAccordionClick = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
    setError("");
  };

  return (
    <div className="mx-auto  w-full h-full flex flex-col items-center justify-center p-4">
      <div className="bg-white  rounded-[2px] mt-4 shadow-[0_1px_5px_1px_rgba(0,0,0,0.3)] p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          {/* <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2> */}
          <p className="text-gray-600">
            <strong>
              {" "}
              {showOTP ? "Enter OTP to verify" : "Enter your phone number..."}
            </strong>
          </p>
        </div>

        {!showOTP ? (
          <form onSubmit={handleSubmitPhone} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                // className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                className="w-full block pl-12 pr-4 py-3 border-2 rounded-md outline-none bg-transparent text-gray-600 text-[16px]"
                placeholder="Enter phone number"
                aria-label="Phone number"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ad0000]  text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <AutorenewIcon className="animate-spin h-5 w-5" />
              ) : (
                "Get History"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6 ">
            <div className="relative flex items-center justify-center ">
              <div className=" flex  items-center pointer-events-none">
                <LockOutlinedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex  justify-between space-x-2 pl-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-8 h-8 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ad0000] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <AutorenewIcon className="animate-spin h-5 w-5" />
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={timer > 0}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="w-full mt-12 max-w-screen-xl ">
        {orders && orders.length > 0 ? (
          <div className="">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white rounded-lg overflow-auto shadow-[0_1px_5px_1px_rgba(0,0,0,0.3)]  hover:shadow-lg mb-4 duration-300"
              >
                <button
                  onClick={() => handleAccordionClick(index)}
                  className="w-full text-left p-4 focus:outline-none  rounded-lg"
                  aria-expanded={activeAccordion === index}
                  aria-controls={`content-${order.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-[18px] font-semibold text-gray-800">
                        {order.bookName}
                      </h3>
                      <p className="text-[16px] text-gray-600">
                        {/* Order ID: {order.id} | Book ID: {order.bookId} */}
                        Serial Number: {order.bookSerialNumber}
                      </p>
                      <p className="text-[16px] text-gray-600">
                        {/* Order ID: {order.id} | Book ID: {order.bookId} */}
                        Status: {order.orderStatus}
                      </p>
                    </div>
                    {activeAccordion === index ? (
                      <ArrowUpwardIcon className="text-gray-600 text-xl" />
                    ) : (
                      <ArrowDownwardIcon className="text-gray-600 text-xl" />
                    )}
                  </div>
                </button>

                <div
                  id={`content-${order.id}`}
                  className={`px-4 overflow-auto transition-all duration-300 ${
                    activeAccordion === index ? "max-h-96 pb-4" : "max-h-0"
                  }`}
                  role="region"
                  aria-labelledby={`heading-${order.id}`}
                >
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Sahebji Name:</span>{" "}
                      {order.sahebjiName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Samuday:</span>{" "}
                      {order.samuday}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Contact Name:</span>{" "}
                      {order.contactName}
                    </p>

                    <p className="text-gray-700">
                      <span className="font-medium">Contact Number:</span>{" "}
                      {order.contactNumber}
                    </p>

                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {order.address}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">City:</span> {order.city}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Pin Code:</span>{" "}
                      {order.pinCode}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Requested for days:</span>{" "}
                      {order.days}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Additional Info:</span>{" "}
                      {order.extraInfo}{" "}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Received Date:</span>{" "}
                      {(() => {
                        const date = new Date(order.createdAt);
                        const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        ); // Months are 0-based
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
                      })()}{" "}
                    </p>
                    {(order.orderStatus === "ACCEPTED" ||
                      order.orderStatus === "RETURNED") && (
                      <>
                        <p className="text-gray-700">
                          <span className="font-medium">Accepted By:</span>{" "}
                          {order.acceptedOrRejectedBy}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Accepted At:</span>{" "}
                          {(() => {
                            const date = new Date(order.acceptedOrRejectedAt);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                        </p>
                      </>
                    )}

                    {order.orderStatus === "REJECTED" && (
                      <>
                        <p className="text-gray-700">
                          <span className="font-medium">Rejected By:</span>{" "}
                          {order.acceptedOrRejectedBy}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Rejected At:</span>{" "}
                          {(() => {
                            const date = new Date(order.acceptedOrRejectedAt);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                        </p>
                      </>
                    )}

                    {order.orderStatus === "RETURNED" && (
                      <>
                        <p className="text-gray-700">
                          <span className="font-medium">Returned By:</span>{" "}
                          {order.returnAcceptedBy}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Return Date:</span>{" "}
                          {(() => {
                            const date = new Date(order.returnDate);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                        </p>
                      </>
                    )}

                    {/* <div className="flex gap-4 mt-4 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleAccept(order.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    aria-label="Accept order"
                  >
                    <FaCheckCircle />
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(order.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Reject order"
                  >
                    <FaTimesCircle />
                    Reject
                  </button>
                </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="w-full">
              <p className="text-center  text-[18px]">No orders</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyHistory;
