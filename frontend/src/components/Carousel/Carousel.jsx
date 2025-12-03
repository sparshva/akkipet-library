import React, { useState, useEffect } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const img10 = process.env.PUBLIC_URL + "/images/img10.jpg";
const img2 = process.env.PUBLIC_URL + "/images/img2.jpg";
const img3 = process.env.PUBLIC_URL + "/images/img3.jpg";
const img4 = process.env.PUBLIC_URL + "/images/img4.jpg";
const img5 = process.env.PUBLIC_URL + "/images/img5.jpg";
const img6 = process.env.PUBLIC_URL + "/images/img6.jpg";
const img7 = process.env.PUBLIC_URL + "/images/img7.jpg";
const img8 = process.env.PUBLIC_URL + "/images/img8.jpg";
const img9 = process.env.PUBLIC_URL + "/images/img9.jpg";
const img11 = process.env.PUBLIC_URL + "/images/img11.jpg";

const Carousel = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const slides = [
    {
      url: img10,
    },
    {
      url: img3,
    },
    {
      url: img4,
    },
    {
      url: img5,
    },
    {
      url: img6,
    },
    {
      url: img7,
    },
    {
      url: img8,
    },
    {
      url: img9,
    },
    {
      url: img11,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [currentIndex]); // Re-run effect on `currentIndex` change

  return (
    <div
      className={`  ${
        windowWidth < 550
          ? "h-[270px]"
          : windowWidth < 650
          ? "h-[330px]"
          : windowWidth < 800
          ? "h-[370px]"
          : "h-[420px]"
      }  w-full m-auto relative group mb-1`}
    >
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className="w-full h-full bg-center bg-no-repeat  bg-cover duration-500"
      ></div>
      <div
        className=" group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-1xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        onClick={prevSlide}
      >
        <ChevronLeftIcon size={30} />
      </div>
      <div
        className=" group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-1xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        onClick={nextSlide}
      >
        <ChevronRightIcon size={30} />
      </div>
      <div className="flex  justify-center ">
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className="cursor-pointer"
          >
            <FiberManualRecordIcon
              color={slideIndex === currentIndex ? "primary" : "disabled"}
              sx={{ fontSize: "15px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
