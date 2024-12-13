import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../AppProvider/AppProvider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import axios from "axios";
import { toast } from "../Toast/Toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate(); // Use the navigate hook to navigate to other routes
  const { cartBooks, setCartBooks, clearAll } = useContext(AppContext); // Consume the context
  const [orderinfo, setOrderInfo] = useState({
    sahebjiName: "",
    samuday: "",
    contactName: "",
    contactNumber: "",
    address: "",
    city: "",
    pinCode: "",
    days: null,
    extraInfo: "",
    books: [],
  });

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const confirmAction = window.confirm(
      "Are you sure you want to order these books?"
    );
    if (!confirmAction) return;

    // Log the order info for debugging
    // console.log({ ...orderinfo, books: cartBooks });

    try {
      // Call the API to submit the order
      await toast.promise(
        axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/order/create-order`,
          {
            ...orderinfo,
            books: cartBooks,
          }
        ),
        {
          pending: "Submitting your order...",
          success: {
            render({ data }) {
              // Start the countdown
              setCountdown(5); // Set initial countdown value to 5 seconds
              // }
              return "Order placed successfully!";
            },
          },
          error: {
            render({ data }) {
              // Log the error for debugging
              console.error(
                "Error creating books:",
                data.response.data.message
              );
              window.alert(data.response.data.message);
              return data.response.data.message;
            },
          },
        }
      );

      // Clear the cart and reset the order info after successful submission
      clearAll();
      setOrderInfo({
        sahebjiName: "",
        samuday: "",
        contactName: "",
        contactNumber: "",
        address: "",
        city: "",
        pinCode: "",
        days: null, // Set to null or desired default
        extraInfo: "",
        books: [],
      });
    } catch (error) {
      // Handle any errors that are not caught by toast.promise
      console.error("An error occurred while submitting the order:", error);
      // Optionally, show a user-friendly error message
      toast.error("Error creating order");
    }
  };
  const [countdown, setCountdown] = useState(null);
  // console.log(countdown);

  // Effect to handle countdown and redirection
  useEffect(() => {
    if (countdown === null) return;

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        // console.log("countdown", prevCountdown);
        if (prevCountdown <= 1) {
          clearInterval(interval);
          navigate("/contact-us");
          return null;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up on component unmount
  }, [countdown]);

  return (
    <div className="w-full h-full  flex px-8 flex-col">
      <div className="w-full  py-4 ">
        <div className="w-full mb-4 text-[18px]">My Cart</div>
        <div className="w-full flex flex-col justify-center items-center">
          {/* <ul> */}
          {cartBooks.map((book) => (
            <div
              key={book.serialNumber}
              className="w-full rounded-lg bg-white shadow-[0_1px_5px_1px_rgba(0,0,0,0.3)] text-left  dark:bg-surface-dark dark:text-white mb-4 "
            >
              <Accordion sx={{ width: "100%" }}>
                <AccordionSummary
                  expandIcon={
                    <ArrowDownwardIcon
                      sx={{
                        pointerEvents: "auto",
                      }}
                    />
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div className="w-full flex justify-end  items-center px-1">
                    <div className="w-full flex flex-col  px-2 ">
                      <div className="flex p-1 items-center flex-wrap">
                        <p>Name: &nbsp; </p>
                        <p className="text-base">{book.nameInHindi}</p>
                      </div>
                    </div>
                    <div>
                      <CancelPresentationOutlinedIcon
                        sx={{ cursor: "pointer", pointerEvents: "auto" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCartBooks(
                            cartBooks.filter(
                              (b) => b.serialNumber !== book.serialNumber
                            )
                          );
                          console.log("remove book");
                        }}
                      />
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="flex p-1 items-center flex-wrap">
                    <p>Name In Hindi: &nbsp; </p>
                    <p className="text-base">{book.nameInHindi}</p>{" "}
                  </div>
                  <div className="flex p-1 items-center flex-wrap">
                    <p>Name In English: &nbsp; </p>
                    <p className="text-base">{book.nameInEnglish}</p>{" "}
                  </div>
                  <div className="flex p-1 items-center flex-wrap">
                    <p>Author: &nbsp; </p>
                    <p className="text-base">{book.author}</p>{" "}
                  </div>{" "}
                  <div className="flex p-1 items-center flex-wrap">
                    <p>Editor: &nbsp; </p>
                    <p className="text-base">{book.editor}</p>{" "}
                  </div>{" "}
                  <div className="flex p-1 items-center flex-wrap">
                    <p>Publisher: &nbsp; </p>
                    <p className="text-base">{book.publisher}</p>{" "}
                  </div>{" "}
                  <div className="flex p-1 items-center flex-wrap">
                    <p>Language: &nbsp; </p>
                    <p className="text-base">{book.language}</p>{" "}
                  </div>
                  <div className="flex p-1 items-center flex-wrap">
                    <p>Serial Number: &nbsp; </p>
                    <p className="text-base">{book.serialNumber}</p>{" "}
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
          {/* </ul> */}
          {/* <button onClick={clearAll}>clear cart</button> */}

          {cartBooks.length == 0 && <div>No books selected</div>}
        </div>
      </div>

      <section className="   w-full bg-white">
        <div className="w-full   mx-auto   ">
          <div className="relative border-0 shadow-[0_2px_5px_1px_rgba(0,0,0,0.3)]  flex flex-col min-w-0 break-words w-full  rounded-lg bg-blueGray-100 ">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  Contact info
                </h6>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-4   pt-0">
              <form onSubmit={(e) => handleSubmitOrder(e)}>
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  User Information
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Sahebji Name
                      </label>
                      <input
                        type="text"
                        className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={orderinfo.sahebjiName}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only letters and spaces, remove everything else (e.g., numbers, punctuation)
                          const filteredValue = value.replace(/[0-9]/g, "");

                          setOrderInfo({
                            ...orderinfo,
                            sahebjiName: filteredValue,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Samuday
                      </label>
                      <input
                        type="text"
                        className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={orderinfo.samuday}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only letters and spaces, remove everything else (e.g., numbers, punctuation)
                          const filteredValue = value.replace(/[0-9]/g, "");

                          setOrderInfo({
                            ...orderinfo,
                            samuday: filteredValue,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="flex  items-start uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Contact Name
                        <GradeIcon
                          sx={{
                            color: "red",
                            fontSize: "0.5rem", // Smaller size
                            marginBottom: "2px", // Small gap between icon and label
                            marginLeft: "4px", // Smaller margin between icon and label
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={orderinfo.contactName}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only letters and spaces, remove everything else (e.g., numbers, punctuation)
                          const filteredValue = value.replace(/[0-9]/g, "");

                          console.log(filteredValue);
                          setOrderInfo({
                            ...orderinfo,
                            contactName: filteredValue,
                          });
                        }}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="flex  items-start uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Contact Number
                        <GradeIcon
                          sx={{
                            color: "red",
                            fontSize: "0.5rem", // Smaller size
                            marginBottom: "2px", // Small gap between icon and label
                            marginLeft: "4px", // Smaller margin between icon and label
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={orderinfo.contactNumber}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          ); // Only allow digits
                          if (numericValue.length <= 10) {
                            setOrderInfo({
                              ...orderinfo,
                              contactNumber: numericValue,
                            });
                          }
                        }}
                        required={true}
                        pattern="\d{10}"
                        title="Contact number must be exactly 10 digits"
                      />
                    </div>
                  </div>
                </div>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Contact Information
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="  flex flex-col flex-wrap text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        <div className="uppercase ">
                          Address
                          <span className="text-red-600 text-[12px] lowercase ml-2">
                            ( If courier required )
                          </span>
                        </div>
                        <span className="text-red-600 text-[12px] lowercase">
                          courier charges will be borne by the recipient.
                        </span>
                      </label>
                      <textarea
                        type="text"
                        className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows="4"
                        value={orderinfo.address}
                        onChange={(e) =>
                          setOrderInfo({
                            ...orderinfo,
                            address: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="flex  items-start uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        City
                        <GradeIcon
                          sx={{
                            color: "red",
                            fontSize: "0.5rem", // Smaller size
                            marginBottom: "2px", // Small gap between icon and label
                            marginLeft: "4px", // Smaller margin between icon and label
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={orderinfo.city}
                        onChange={(e) =>
                          setOrderInfo({
                            ...orderinfo,
                            city: e.target.value,
                          })
                        }
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="flex  items-start uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Postal Code
                        <GradeIcon
                          sx={{
                            color: "red",
                            fontSize: "0.5rem", // Smaller size
                            marginBottom: "2px", // Small gap between icon and label
                            marginLeft: "4px", // Smaller margin between icon and label
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={orderinfo.pinCode}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          ); // Only allow digits
                          if (numericValue.length <= 6) {
                            setOrderInfo({
                              ...orderinfo,
                              pinCode: numericValue,
                            });
                          }
                        }}
                        required={true}
                        pattern="\d{6}"
                        title="Postal Code must be exactly 6 digits"
                      />
                    </div>
                  </div>
                </div>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex flex-wrap mt-4">
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="flex  items-start uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        For how many days would you like to borrow these books ?
                        <GradeIcon
                          sx={{
                            color: "red",
                            fontSize: "0.5rem", // Smaller size
                            marginBottom: "2px", // Small gap between icon and label
                            marginLeft: "4px", // Smaller margin between icon and label
                          }}
                        />
                      </label>

                      <select
                        className="border-2 px-2 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={orderinfo.days ?? ""} // Use empty string if days is null
                        onChange={(e) =>
                          setOrderInfo({
                            ...orderinfo,
                            days: e.target.value
                              ? Number(e.target.value)
                              : null, // Convert to number or set to null
                          })
                        }
                        required={true}
                      >
                        <option value="" disabled>
                          Select duration
                        </option>{" "}
                        {/* Placeholder option */}
                        <option value={30}>Up to 30 days</option>
                        <option value={60}>Up to 60 days</option>
                        <option value={90}>Up to 90 days</option>
                        <option value={120}>Up to 120 days</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Extra Information
                      </label>
                      <textarea
                        type="text"
                        className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows="4"
                        value={orderinfo.extraInfo}
                        onChange={(e) =>
                          setOrderInfo({
                            ...orderinfo,
                            extraInfo: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center py-3 px-8 border border-transparent text-sm font-bold uppercase bg-blueGray-600 hover:bg-blueGray-700 rounded"
                  >
                    Clear All
                  </button>
                  <button
                    className={`bg-[#ad0000] text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md  outline-none focus:outline-none mr-1 ease-linear transition-all duration-150  ${
                      cartBooks.length < 1
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    type="submit"
                    disabled={cartBooks.length < 1}
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {countdown !== null && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-sm shadow-md text-center">
            <p className="text-lg font-semibold">
              Order placed successfully! Redirecting in {countdown}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
