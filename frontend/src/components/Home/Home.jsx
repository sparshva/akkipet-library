import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../Carousel/Carousel.jsx";
import { AppContext } from "../AppProvider/AppProvider.jsx";
import { toast } from "../Toast/Toast";
import axios from "axios";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
// https://api.akkipetgyanbhandar.in

const RollingCounter = ({ total, label, Icon, colorClass, bgColorClass }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // Duration of the animation in milliseconds
    const increment = total / (duration / 10); // Increment per frame (~10ms)

    const counter = setInterval(() => {
      start += increment;
      if (start >= total) {
        clearInterval(counter);
        setDisplayCount(total); // Ensure it ends at the exact total
      } else {
        setDisplayCount(Math.ceil(start));
      }
    }, 10); // Update every 10ms

    return () => clearInterval(counter); // Cleanup on unmount
  }, [total]);

  return (
    <div
      className="flex items-center p-4 bg-white rounded-lg"
      style={{
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
      }}
    >
      <div className={`p-3 mr-4 ${colorClass} ${bgColorClass} rounded-full`}>
        <Icon />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600">
          <strong>{label}</strong>
        </p>
        <p className="text-lg font-semibold text-gray-700">{displayCount}</p>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const [totalBooks, setTotalBooks] = useState(0);
  const fetchFilteredBooks = async (activeFilters, page) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/books/filter?page=${1}`,
        activeFilters // Send full filters object
      );
      // console.log(response);
      setTotalBooks(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Initial fetch when the component loads
  useEffect(() => {
    // fetchAllBooks();

    fetchFilteredBooks();
  }, []);

  const [totalOrders, setTotalOrders] = useState(0);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/order/total-orders`
      );
      // console.log("orders total", response.data.totalOrders);
      setTotalOrders(response.data?.totalOrders); // Set the data from response
      // console.log("Fetched orders:", response.data);
      // toast.success("Orders fetched successfully!");
    } catch (error) {
      // console.error("Error fetching orders:", error);
      toast.error("Error fetching details");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const navigateToSearchPage = () => {
    navigate("/search");
  };

  const navigateToAdminLoginPage = () => {
    navigate("/admin/login");
  };

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Update state to reflect logout
    navigate("/"); // Redirect to the admin login page
  };

  return (
    <div className="w-full h-full  bg-[#fafafa]  ">
      <Carousel />
      <div className="w-full py-8 flex justify-center items-center">
        <button
          type="button"
          className="text-white w-2/3 min-w-fit bg-[#ad0000] focus:outline-none  font-medium rounded-md text-[16px] px-4 py-2 text-center mb-2"
          onClick={navigateToSearchPage}
        >
          Search Books / पुस्तकें खोजें
        </button>
      </div>
      <div className="px-5">
        {/* <div class="  mx-auto grid"> */}
        {/* <!-- Cards --> */}
        <div class="grid gap-6 mb-6 sm:grid-cols-2 ">
          {/* <!-- Card --> */}
          {/* <div
            class="flex items-center p-4 bg-white rounded-lg  "
            style={{
              boxShadow:
                " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            }}
          >
            <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
              <LocalShippingOutlinedIcon />
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600">
                <strong>Total Orders</strong>
              </p>
              <p class="text-lg font-semibold text-gray-700 ">{totalOrders}</p>
            </div>
          </div> */}

          <RollingCounter
            total={totalOrders}
            label="Total Orders"
            Icon={LocalShippingOutlinedIcon}
            colorClass="text-orange-500"
            bgColorClass="bg-orange-100"
          />
          <RollingCounter
            total={totalBooks}
            label="Total Books"
            Icon={LibraryBooksRoundedIcon}
            colorClass="text-green-500"
            bgColorClass="bg-green-100"
          />
        </div>
        {/* </div> */}
      </div>
      <div className="w-full  px-5">
        <div
          className="w-full p-3   text-[#ff1414]  rounded-[2px] bg-white  text-left  "
          style={{
            boxShadow:
              " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          }}
        >
          <div className="flex items-center justify-center font-semibold text-[#ff1414] text-[20px] mb-6 relative">
            <span className="text-[#ff1414] mx-2">★</span>
            <strong>सूचना पत्र</strong>
            <span className="text-[#ff1414] mx-2">★</span>
          </div>

          <div className="font-semibold  text-[16px] mb-3">
            श्रुतपिपासु श्रमण श्रमणी भगवंत को वंदन | श्रावक श्राविका को प्रणाम |
            हमारे ज्ञान भंडार को लाभ देने के लिए धन्यवाद | ज्ञान भंडार की
            व्यवस्था के लिए नीचे लिखे सूचनाओं को पढ़कर खास ध्यान रखे ऐसी विनंती
          </div>
          {/* <br /> */}
          <div className="font-semibold text-[#ff1414] text-[15px]">
            <div>
              <strong>०१ -</strong> जो भी पुस्तक एक दिवस या घंटे के लिए भी ले
              जाना हो तो उसकी नोट अवश्य करवाना, नोट किए बिना ले जाने से व्यवस्था
              भंग हो जाती है और साथ में आपका संपर्क सूत्र भी अवश्य दीजिएगा
            </div>

            <div>
              <strong>०२ -</strong> आप पुस्तक अभ्यास के लिए चाहे जितना समय खुशी
              से रख सकते हो, परंतु अभ्यास पूर्ण होने के पश्चात तुरंत वापस
              भिजवाने की कृपा करना और जो अभ्यास चल रहा हो तो 4 महीने के अंदर
              पुस्तक रिन्यू करवा देना
              <br />
              अगर आपको जरूरत ना हो और पुस्तक आपके पास पड़ी हो तो यहां जरूरत वाले
              दूसरों को पुस्तक नहीं मिलने से अंतराय होगा
            </div>

            <div>
              <strong>०३ -</strong> आप जिसके साथ पुस्तक वापस भिजवा रहे हो उनका
              नाम और नंबर का अवश्य नोट कर लेवे, बहुत बार श्रावक पुस्तक जमा
              करवाना भूल जाते हैं
            </div>

            <div>
              <strong>०४ -</strong> पुस्तक वह संघ की संपत्ति है, आपकी संपत्ति
              है, हम सिर्फ संभाल रहे है, आप उपयोग कर हमारे संभालने की मेहनत
              सार्थक कर रहे हो उसके लिए हम आपके ऋणी है, यह संपत्ति नष्ट ना हो
              जाए और खो ना जाए उसका आप खास ध्यान रखना ऐसी विनंती
            </div>

            <div>
              <strong>०५ -</strong> यदि पुस्तक फट जाये तो आप उसे पुनः कवर (Bind)
              करवाके और यदि खो जाये तो नयी पुस्तक जमा करावे
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
