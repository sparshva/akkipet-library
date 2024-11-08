import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../Carousel/Carousel.jsx";
import { AppContext } from "../AppProvider/AppProvider.jsx";
import { toast } from "../Toast/Toast";
import axios from "axios";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const [totalBooks, setTotalBooks] = useState(0);
  const fetchFilteredBooks = async (activeFilters, page) => {
    try {
      console.log("filters", activeFilters);
      console.log(process.env);
      // console.log(`https://akkipet-library.vercel.app/books/filter?page=${1}`);
      // axios.defaults.withCredentials = true;
      // Ensure this value is set correctly before using it
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/books/filter?page=${1}`,
        activeFilters // Send full filters object
        // { withCredentials: true } // Make sure to include this for CORS with credentials
      );
      console.log(response);
      setTotalBooks(response.data.totalCount);
      // toast.success("Books fetched successfully", {
      //   //
      // });
      //   console.log("Fetched books:", response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Error fetching books", {
        //
      });
    }
  };

  // Initial fetch when the component loads
  useEffect(() => {
    // fetchAllBooks();

    fetchFilteredBooks();
  }, []);

  const [totalOrders, setTotalOrders] = useState(0);

  // const fetchAllOrders = async () => {
  //   try {
  //     await toast.promise(
  //       axios.get(
  //         `${process.env.REACT_APP_BACKEND_BASE_URL}/order/total-orders`
  //       ),
  //       {
  //         pending: "Fetching orders...",
  //         success: {
  //           render({ data }) {
  //             setTotalOrders(data.data.totalOrders); // Set the data from response
  //             console.log("Fetched orders:", data);
  //             // return "Orders fetched successfully!";
  //           },
  //         },
  //         error: "Error fetching orders",
  //       }
  //     );

  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //     toast.error("Error fetching orders");
  //   }
  // };

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/order/total-orders`
      );
      console.log("orders total", response.data.totalOrders);
      setTotalOrders(response.data?.totalOrders); // Set the data from response
      console.log("Fetched orders:", response.data);
      // toast.success("Orders fetched successfully!");
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
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
          className="text-white w-2/3 bg-[#ad0000] focus:outline-none  font-medium rounded-md text-[16px] px-4 py-2 text-center mb-2"
          onClick={navigateToSearchPage}
        >
          Search Books / पुस्तकें खोजें
        </button>
      </div>
      <div className="px-5">
        {/* <div class="  mx-auto grid"> */}
        {/* <!-- Cards --> */}
        <div class="grid gap-6 mb-8 sm:grid-cols-2 ">
          {/* <!-- Card --> */}
          <div
            class="flex items-center p-4 bg-white rounded-lg  dark:bg-gray-800"
            style={{
              boxShadow:
                " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            }}
          >
            <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
              <LocalShippingOutlinedIcon />
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {totalOrders}
              </p>
            </div>
          </div>
          {/* <!-- Card --> */}
          <div
            class="flex items-center p-4 bg-white rounded-lg  dark:bg-gray-800"
            style={{
              boxShadow:
                " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            }}
          >
            <div class="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
              <LibraryBooksRoundedIcon />
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Books
              </p>
              <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {totalBooks}
              </p>
            </div>
          </div>
          {/* <!-- Card --> */}
          {/* <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
              <div class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div>
                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  My Tutorials
                </p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  376
                </p>
              </div>
            </div> */}
          {/* <!-- Card --> */}
          {/* <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
              <div class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                </svg>
              </div>
              <div>
                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  My Purchases
                </p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  35
                </p>
              </div>
            </div> */}
        </div>
        {/* </div> */}
      </div>
      <div className="w-full  px-5">
        <div
          className="w-full p-3    rounded-[2px] bg-white  text-left mb-4 "
          style={{
            boxShadow:
              " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          }}
        >
          <div className="font-semibold text-[#ff1414] text-[19px]">Rules</div>
          <div className="font-semibold  text-[16px]">
            श्रुतपिपासु श्रमण श्रमणी भगवंत को वंदन | श्रावक श्राविका को प्रणाम |
            हमारे ज्ञान भंडार को लाभ देने के लिए धन्यवाद | ज्ञान भंडार की
            व्यवस्था के लिए नीचे लिखे सूचनाओं को पढ़कर खास ध्यान रखे ऐसी विनंती
          </div>
          <br />
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
