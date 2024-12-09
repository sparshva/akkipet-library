import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#ad0000] fixed bottom-0 left-0 right-0 flex py-1 items-center  text-white  ">
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center h-full py-2 justify-center w-1/2"
      >
        <div
          onClick={() =>
            window.open(
              "https://www.google.com/maps/dir//Obaiah+Ln,+Akkipete,+Chickpet,+Bengaluru,+Karnataka+560053/@12.9706505,77.4894714,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae16066432b615:0xf969c14fc278faef!2m2!1d77.5718066!2d12.97067?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
              "_blank",
              "noopener,noreferrer"
            )
          }
          className="flex items-center flex-row text-[16px] cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <LocationOnIcon sx={{ fontSize: "20px", marginRight: "2px" }} />
          <span className="sm:ml-2 text-center sm:text-left">Location </span>
        </div>
      </a>

      <div className="flex items-center py-2  justify-center  w-1/2">
        <div
          className="flex items-center flex-row  text-[16px] cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => navigate("/")}
        >
          <HomeIcon sx={{ fontSize: "20px", marginRight: "2px" }} />
          <span className="sm:ml-2 text-center sm:text-left">Home</span>
        </div>
      </div>

      <div className="flex items-center py-2  justify-center  w-1/2">
        <div
          className="flex items-center flex-row  text-[16px] cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => navigate("/contact-us")}
        >
          <CallIcon sx={{ fontSize: "20px", marginRight: "2px" }} />
          <span className="sm:ml-2 text-center sm:text-left">Contact Us</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
