import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { jwtDecode } from "jwt-decode";
import { toast } from "../Toast/Toast";

const Users = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("users token: " + token);
    if (!token) navigate("/admin/login", { replace: true });
  }, [navigate]);
  const [admin, setAdmin] = useState({});
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from storage
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      setAdmin(decodedToken); // Display decoded payload (e.g., user information)
    }
  }, []);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const fetchallUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/user/all-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // retrieve and set the token
          },
        }
      );

      setAllUsers(response.data);
      //   setBooks(response.data);
      console.log("Fetched users:", response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchallUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (formData.password !== formData.confirmPassword) {
  //       alert("Passwords do not match!");
  //       return;
  //     }

  //     console.log(formData);
  //     try {
  //       const response = await axios.post(
  //         `http://localhost:3001/user/create`,
  //         formData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`, // retrieve and set the token
  //           },
  //         }
  //       );

  //       //   setAllUsers(response.data);
  //       //   setBooks(response.data);
  //       console.log("Fetched users:", response.data);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }

  //     setFormData({
  //       name: "",
  //       phoneNumber: "",
  //       password: "",
  //       confirmPassword: "",
  //     });
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Confirmation prompt
    if (!window.confirm("Are you sure you want to create this user?")) {
      return;
    }

    console.log("Submitting form data:", formData);

    try {
      // Submit form with a promise toast
      await toast.promise(
        axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/user/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // retrieve and set the token
            },
          }
        ),
        {
          pending: "Creating user...",
          success: {
            render({ data }) {
              console.log("User created:", data);
              fetchallUsers();
              return "User created successfully!";
            },
          },
          error: {
            render({ data }) {
              console.error("Error creating user:", data.response.data.message);
              return data.response.data.message || "Error creating user";
            },
          },
        }
      );

      // Reset form data on successful submission
      setFormData({
        name: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Error creating user");
    }
  };

  //   const removeUser = async (id) => {
  //     console.log(id);
  //     try {
  //       const response = await axios.delete(
  //         `http://localhost:3001/user/delete/${id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`, // retrieve and set the token
  //           },
  //         }
  //       );
  //       fetchallUsers();

  //       console.log("Fetched users:", response.data);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  const removeUser = async (id) => {
    console.log("User ID to remove:", id);

    // Confirmation prompt
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      // Deleting user with a promise toast
      await toast.promise(
        axios.delete(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/user/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // retrieve and set the token
            },
          }
        ),
        {
          pending: "Deleting user...",
          success: {
            render({ data }) {
              console.log("User deleted:", data);
              return "User deleted successfully!";
            },
          },
          error: {
            render({ data }) {
              console.error(
                "Error deleting user:",
                data.response?.data?.message
              );
              return data.response?.data?.message || "Error deleting user";
            },
          },
        }
      );

      // Refetch users after successful deletion
      fetchallUsers();
    } catch (error) {
      console.error("An error occurred while deleting the user:", error);
      toast.error("Error deleting user");
    }
  };

  useEffect(() => {
    const filtered = allUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [allUsers]);

  return (
    <>
      {admin && admin.phoneNumber && (
        <div className="max-w-7xl mx-auto mb-12  px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Search Section */}
            <div className="relative">
              <SearchOutlinedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search users"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phoneNumber != admin.phoneNumber &&
                          !user.isSuperAdmin && (
                            <button
                              onClick={() => removeUser(user._id)}
                              className="text-red-600 hover:text-red-900 focus:outline-none  p-1  transition-colors duration-200"
                              aria-label="Delete user"
                            >
                              <DeleteOutlineIcon className="w-5 h-5" />
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add User Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white w-full p-6 rounded-lg shadow-md space-y-4"
            >
              <h2 className="text-lg w-full font-semibold text-gray-800 mb-4">
                Add New Admin
              </h2>
              <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 border-2 pl-3 pr-9 py-1  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    className="mt-1 border-2 pl-3 pr-9 py-1  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={formData.phoneNumber}
                    // onChange={handleInputChange}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, ""); // Only allow digits
                      if (numericValue.length <= 10) {
                        console.log(numericValue);
                        setFormData({
                          ...formData,
                          phoneNumber: numericValue,
                        });
                        // handleInputChange({
                        //   ...e,
                        //   target: { ...e.target, value: numericValue },
                        // });
                      }
                    }}
                    pattern="\d{10}"
                    title="Contact number must be exactly 10 digits"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="w-full  relative flex">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      className="mt-1 border-2 pl-3 pr-9 py-1  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={formData.password}
                      onChange={handleInputChange}
                      minLength={6} // You can set a minimum length for the password
                      title="Password must be at least 6 characters long"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                      className="absolute right-[6px] bottom-1"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon /> // Show eye-off icon when password is visible
                      ) : (
                        <VisibilityOutlinedIcon /> // Show eye icon when password is hidden
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="w-full flex relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      className={`mt-1 border-2 pl-3 pr-9 py-1  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                        formData.password &&
                        formData.password !== formData.confirmPassword
                          ? "border-red-500"
                          : ""
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      minLength={6} // You can set a minimum length for the password
                      title="Password must be at least 6 characters long"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                      className="absolute right-[6px] bottom-1"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon /> // Show eye-off icon when password is visible
                      ) : (
                        <VisibilityOutlinedIcon /> // Show eye icon when password is hidden
                      )}
                    </button>
                  </div>
                  {formData.password &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ad0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <PersonAddAlt1Icon className="mr-2" />
                Add Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
