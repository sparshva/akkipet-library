import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { FiHome, FiSettings, FiUser, FiMenu, FiX } from "react-icons/fi";
import CloseIcon from "@mui/icons-material/Close";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import axios from "axios";
import OrdersPending from "./OrdersPending.jsx";
import OrdersGiven from "./OrdersGiven.jsx";
import OrdersHistory from "./OrdersHistory.jsx";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import { toast } from "../Toast/Toast";

const Orders = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Orders token: " + token);
    if (!token) navigate("/admin/login", { replace: true });
  }, [navigate]);
  const [allOrders, setAllOrders] = useState([]);
  //   const fetchAllOrders = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3001/order/orders/grouped-by-status`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`, // retrieve and set the token
  //           },
  //         }
  //       );

  //       setAllOrders(response.data);
  //       //   setBooks(response.data);
  //       console.log("Fetched orders:", response.data);
  //     } catch (error) {
  //       console.error("Error fetching books:", error);
  //     }
  //   };
  const fetchAllOrders = async () => {
    try {
      await toast.promise(
        axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/order/orders/grouped-by-status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // retrieve and set the token
            },
          }
        ),
        {
          pending: "Fetching orders...",
          success: {
            render({ data }) {
              setAllOrders(data.data); // Set the data from response
              console.log("Fetched orders:", data.data);
              return "Orders fetched successfully!";
            },
          },
          error: "Error fetching orders",
        }
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);
  const [activeTab, setActiveTab] = useState("pending");
  const [error, setError] = useState(false);

  const dummyOrders = {
    pending: [
      {
        id: "ORD001",
        customerName: "John Doe",
        date: "2024-01-15",
        status: "Awaiting Confirmation",
        total: "$299.99",
      },
      {
        id: "ORD002",
        customerName: "Jane Smith",
        date: "2024-01-16",
        status: "Payment Pending",
        total: "$149.50",
      },
    ],
    given: [
      {
        id: "ORD003",
        customerName: "Mike Johnson",
        date: "2024-01-14",
        status: "In Transit",
        total: "$599.99",
      },
      {
        id: "ORD004",
        customerName: "Sarah Williams",
        date: "2024-01-13",
        status: "Out for Delivery",
        total: "$899.00",
      },
    ],
    processed: [
      {
        id: "ORD005",
        customerName: "Robert Brown",
        date: "2024-01-12",
        status: "Delivered",
        total: "$199.99",
      },
      {
        id: "ORD006",
        customerName: "Emily Davis",
        date: "2024-01-11",
        status: "Completed",
        total: "$449.99",
      },
    ],
  };

  const tabs = [
    {
      id: "pending",
      label: "Pending",
      icon: <PendingActionsIcon className="w-5 h-5" />,
    },
    {
      id: "issued",
      label: "Issued",
      icon: <InventoryRoundedIcon className="w-5 h-5" />,
    },
    {
      id: "history",
      label: "History",
      icon: <HistoryToggleOffIcon className="w-5 h-5" />,
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setError(false);
  };

  const renderOrderContent = () => {
    if (error) {
      return (
        <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">
          Failed to load order details. Please try again.
        </div>
      );
    }

    const orders = dummyOrders[activeTab];

    return (
      <div className="grid  gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-800">
                {order.id}
              </span>
              <span className="px-3 py-1 text-sm text-white bg-blue-500 rounded-full">
                {order.status}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Customer:</span>{" "}
                {order.customerName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Date:</span> {order.date}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Total:</span> {order.total}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const exportOrders = async (statuses, searchQuery, filename, message) => {
    const confirmAction = window.confirm(message);
    if (!confirmAction) return;

    try {
      await toast.promise(
        axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/order/export`,
          { statuses, searchQuery },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "blob", // Expect a blob for file download
          }
        ),
        {
          pending: "Exporting data...",
          success: {
            render({ data }) {
              // Create a Blob from the response data and trigger download
              const url = window.URL.createObjectURL(new Blob([data.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", filename); // Filename
              document.body.appendChild(link);
              link.click();
              link.remove();

              return "Data exported successfully!";
            },
          },
          error: "Error exporting data",
        }
      );
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    }
  };

  return (
    <div className="container mb-10 p-4 mx-auto w-full">
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 outline-none  rounded-lg sm:rounded-none ${
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50 sm:bg-white sm:border-b-2 sm:border-blue-600"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 sm:hover:bg-white"
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-content`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="transition-all duration-300"
        role="tabpanel"
        id={`${activeTab}-content`}
        aria-labelledby={activeTab}
      >
        {allOrders && activeTab === "pending" ? (
          <OrdersPending
            allOrders={allOrders.PENDING || []}
            setAllOrders={setAllOrders}
            fetchAllOrders={fetchAllOrders}
            exportOrders={exportOrders}
          />
        ) : activeTab === "issued" ? (
          <OrdersGiven
            allOrders={allOrders.ACCEPTED || []}
            setAllOrders={setAllOrders}
            fetchAllOrders={fetchAllOrders}
            exportOrders={exportOrders}
          />
        ) : (
          <OrdersHistory
            allOrders={[
              ...(allOrders.RETURNED || []),
              ...(allOrders.REJECTED || []),
              ...(allOrders.ACCEPTED || []),
            ]}
            setAllOrders={setAllOrders}
            fetchAllOrders={fetchAllOrders}
            exportOrders={exportOrders}
          />
        )}

        {/* {renderOrderContent()} */}
      </div>
    </div>
  );
};

export default Orders;
