import React, { useState, useEffect } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// import img10 from "../../images/img10.jpg";
// import img2 from "../../images/img2.jpg";
// import img3 from "../../images/img3.jpg";
// import img4 from "../../images/img4.jpg";
// import img5 from "../../images/img5.jpg";
// import img6 from "../../images/img6.jpg";
// import img7 from "../../images/img7.jpg";
// import img8 from "../../images/img8.jpg";
// import img9 from "../../images/img9.jpg";

const img10 = process.env.PUBLIC_URL + "/images/img10.jpg";
const img2 = process.env.PUBLIC_URL + "/images/img2.jpg";
const img3 = process.env.PUBLIC_URL + "/images/img3.jpg";
const img4 = process.env.PUBLIC_URL + "/images/img4.jpg";
const img5 = process.env.PUBLIC_URL + "/images/img5.jpg";
const img6 = process.env.PUBLIC_URL + "/images/img6.jpg";
const img7 = process.env.PUBLIC_URL + "/images/img7.jpg";
const img8 = process.env.PUBLIC_URL + "/images/img8.jpg";
const img9 = process.env.PUBLIC_URL + "/images/img9.jpg";

const Carousel = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const slides = [
    // {
    //   url: book,
    // },
    // {
    //   url: img1,
    // },
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
    // {
    //   url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    // },
    // {
    //   url: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80",
    // },
    // {
    //   url: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80",
    // },
    // {
    //   url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80",
    // },
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
        className=" group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
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
