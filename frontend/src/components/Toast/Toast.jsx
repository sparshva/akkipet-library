import React from "react";
import { ToastContainer, toast as reactToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toast = reactToast;

export const Toast = () => {
  return (
    // <div className="w-full h-screen flex justify-center items-center">
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={true}
      closeButton={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      //   pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="light"
      draggablePercent={60}
      role="alert"
      stacked={false}
      limit={5}
      //   progress={1}
      toastClassName="flex items-center justify-between p-0 rounded-lg shadow-md bg-white text-gray-800 border border-gray-300 transition-transform transform hover:scale-105 mt-4"
    />
    // </div>
  );
};
