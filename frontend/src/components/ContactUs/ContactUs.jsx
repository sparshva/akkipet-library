import React, { useEffect, useState } from "react";
import axios from "axios";
import UserContactCard from "./UserContactCard";

const ContactUs = () => {
  const [allUsers, setAllUsers] = useState([]);
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
  return (
    <>
      <div className="h-screen mb-[2rem] px-4">
        <div className="py-4">
          <h1 className="text-[16px] text-red-600  mb-8  font-bold text-center">
            For any questions or updates about your order, or if you need
            additional information, please feel free to contact any of the
            numbers listed below
          </h1>

          <div className="grid grid-cols-1 gap-y-4 justify-items-center">
            {allUsers.map(
              (user) =>
                !user.isSuperAdmin && (
                  <div className="w-full max-w-md">
                    <UserContactCard key={user._id} user={user} />
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
