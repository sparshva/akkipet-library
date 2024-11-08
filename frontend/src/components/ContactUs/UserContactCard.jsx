import React from "react";
import CallIcon from "@mui/icons-material/Call";

const UserContactCard = ({ user }) => {
  const handlePhoneClick = () => {
    window.location.href = `tel:${user.phoneNumber.replace(/\D/g, "")}`;
  };

  return (
    // <div className="  flex items-center justify-center p-4">
    <div
      className="w-full  bg-white rounded-xl shadow-lg  transition-opacity duration-500 transform translate-y-0 opacity-100"
      role="article"
      aria-label="User Contact Information"
    >
      <div className="p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800" role="heading">
            {user.name}
          </h2>
        </div>

        <div
          className="flex items-center justify-center space-x-2 cursor-pointer focus:outline-none "
          role="button"
          tabIndex={0}
          onClick={handlePhoneClick}
          onKeyPress={(e) => e.key === "Enter" && handlePhoneClick()}
          aria-label={`Call ${user.name} at ${user.phoneNumber}`}
        >
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg transition-transform duration-200 transform hover:scale-105 active:scale-95 hover:bg-blue-100">
            <CallIcon className="text-blue-600" />
            <span className="text-lg text-blue-600 font-medium">
              {user.phoneNumber}
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Click on the phone number to call
        </p>
      </div>
    </div>
    // </div>
  );
};

export default UserContactCard;
