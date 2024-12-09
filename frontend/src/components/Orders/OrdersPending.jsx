import React, { useState, useEffect } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import axios from "axios";
import { toast } from "../Toast/Toast";

const OrdersPending = ({
  allOrders,
  setAllOrders,
  fetchAllOrders,
  exportOrders,
}) => {
  // console.log("orders pending", allOrders);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    setFilteredOrders(allOrders); // Set the initial orders when allOrders is available
  }, [allOrders]);

  useEffect(() => {
    const filtered = allOrders.filter(
      (order) =>
        order.bookName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.bookSerialNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.contactNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.sahebjiName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, allOrders]); // Add allOrders to dependencies here

  const handleAccordionClick = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
    setError("");
  };

  const handleAccept = async (orderId) => {
    const confirmAction = window.confirm(
      "Are you sure you want to accept this order?"
    );
    if (!confirmAction) return;

    try {
      await toast.promise(
        axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/order/update/${orderId}/accept`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Accepting order...",
          success: "Order accepted successfully!",
          error: "Error accepting order.",
        }
      );

      fetchAllOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleReject = async (orderId) => {
    const confirmAction = window.confirm(
      "Are you sure you want to reject this order?"
    );
    if (!confirmAction) return;

    try {
      await toast.promise(
        axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/order/update/${orderId}/reject`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Rejecting order...",
          success: "Order rejected successfully!",
          error: "Error rejecting order.",
        }
      );

      fetchAllOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  const handleFileExport = async () => {
    const confirmAction = window.confirm(
      "Do you want to export the pending orders?"
    );
    if (!confirmAction) return;

    try {
      await toast.promise(
        axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/order/export`,
          { statuses: ["PENDING"] },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Exporting data...",
          success: "Data exported successfully!",
          error: "Error exporting data.",
        }
      );

      // Handle file download after export is successful
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/order/export`,
        { statuses: ["PENDING"], searchQuery },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob", // Expect a blob for download
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "pending-orders.csv");
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };
  const handlePendingOrdersExport = () => {
    exportOrders(
      ["PENDING"],
      searchQuery,
      "pending-orders.xlsx",
      "Do you want to export the pending orders?"
    );
  };
  return (
    <>
      {" "}
      <div className="w-full h-full">
        <div className="  flex flex-col mb-4  w-full">
          <div class="flex  gap-4 w-full mb-2 overflow-hidden  mx-auto font-[sans-serif]">
            <div className="flex px-4 py-2 rounded-md border-2 w-full bg-white  overflow-hidden  mx-auto font-[sans-serif]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 192.904 192.904"
                width="16px"
                class="fill-gray-600 mr-3 rotate-90"
              >
                <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                class="w-full outline-none bg-transparent text-gray-600 text-[16px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="">
              <button
                onClick={handlePendingOrdersExport}
                className=" py-2 px-4 bg-[#ad0000] text-white rounded-lg  transition-colors focus:outline-none "
              >
                Export
              </button>
            </div>
          </div>
          <div className="w-full flex text-[14px]  text-red-500 font-bold flex-wrap">
            Search by book name or serial number or sahebji name or contact name
            or contact number
          </div>
        </div>
        <div className="w-full flex flex-col">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No matching orders found</p>
            </div>
          ) : (
            <div className="">
              {filteredOrders.map((order, index) => (
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
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");
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
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");
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
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");
                              const year = date.getFullYear();
                              return `${day}/${month}/${year}`;
                            })()}
                          </p>
                        </>
                      )}

                      <div className="flex gap-4 mt-4 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleAccept(order._id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          aria-label="Accept order"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(order._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-label="Reject order"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPending;
