import React, { useState, useRef, useEffect } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const MyHistory = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmitPhone = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowOTP(true);
    }, 1500);
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

  return (
    <div className="mx-auto h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-[2px] mt-4 shadow-[0_1px_5px_1px_rgba(0,0,0,0.3)] p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          {/* <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2> */}
          <p className="text-gray-600">
            {showOTP ? "Enter OTP to verify" : "Enter your phone number..."}
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
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                "Get OTP"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockOutlinedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-between space-x-2 pl-12">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
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
    </div>
  );
};

export default MyHistory;
