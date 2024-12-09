import React, { useState, useEffect, useContext, useRef } from "react";
import AdminSideCollapsibleTable from "../CollapsibleTable/AdminSideCollapsibleTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce"; // Import a debounce function from lodash

import Filter from "../Filter/Filter";

import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import TablePagination from "@mui/material/TablePagination";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { AppContext } from "../AppProvider/AppProvider"; // Import the context
import { toast } from "../Toast/Toast";

function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          color: theme.palette.grey[200],
          ...theme.applyStyles("dark", {
            color: theme.palette.grey[800],
          }),
        })}
        size={35}
        thickness={3}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={(theme) => ({
          color: "#ad0000",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
          ...theme.applyStyles("dark", {
            color: "#308fe8",
          }),
        })}
        size={35}
        thickness={3}
        {...props}
      />
    </Box>
  );
}

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const abortControllerRef = useRef(null);

  //   const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const [categories, setCategories] = useState([]);
  const [page, setPage] = React.useState(0);

  const [filters, setFilters] = useState({
    searchTerm: "",
    authors: [],
    publishers: [],
    languages: [],
    editors: [],
    topics: [],
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();

  const fetchFilteredBooks = async (activeFilters, page) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new AbortController
      const newController = new AbortController();
      abortControllerRef.current = newController;

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/books/filter?page=${page}`,
        activeFilters, // Send full filters object
        {
          signal: newController.signal, // Attach the signal for cancellation
        }
      );
      // console.log(response);
      setBooks(response.data.results);
      setTotalBooks(response.data.totalCount);
      // toast.success("Books fetched successfully", {
      //   //
      // });
      setLoading(false);
      //   console.log("Fetched books:", response.data);
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Request was canceled:", error.message);
      } else {
        console.error("Error fetching books:", error);
        toast.error("Error fetching books");
      }
    }
  };
  const fetchAllBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/books/`);
      const totalPages = Math.ceil(response.data.length / 20);
      setTotalBooks(response.data.length);
      //   setBooks(response.data);
      // console.log("Fetched books:", response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/books/unique`
      ); // Adjust the API URL accordingly
      const categoryData = response.data || {}; // Ensure categoryData is an object even if response.data is undefined

      const formattedCategories = [
        { id: 1, name: "Authors", values: categoryData.authors || [] }, // Default to empty array if authors is undefined
        { id: 2, name: "Topics", values: categoryData.topics || [] }, // Default to empty array if topics is undefined
        { id: 3, name: "Languages", values: categoryData.languages || [] }, // Default to empty array if languages is undefined
        { id: 4, name: "Editors", values: categoryData.editors || [] }, // Default to empty array if editors is undefined
        { id: 5, name: "Publishers", values: categoryData.publishers || [] }, // Default to empty array if publishers is undefined
      ];
      setCategories(formattedCategories);
      // console.log("Fetched categories:", response.data);
      // toast.success("Categories fetched successfully", {});
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories", {});
    }
  };

  // Debounced function to prevent making too many requests
  const debouncedFetchBooks = debounce((updatedFilters, page) => {
    fetchFilteredBooks(updatedFilters, page);
  }, 500); // 500ms delay before calling the API

  // Handle search input change and update filters
  const handleSearchInputChange = (event) => {
    const searchQuery = event.target.value;

    // Update filters with new search term
    const updatedFilters = {
      ...filters,
      searchTerm: searchQuery, // Update only the search term
    };

    setFilters(updatedFilters); // Update filters state
    setLoading(true); // Show loading while fetching data
    debouncedFetchBooks(updatedFilters, 1); // Call the debounced API with updated filters
  };

  // Initial fetch when the component loads
  useEffect(() => {
    // fetchAllBooks();

    fetchFilteredBooks(filters, 1);
    fetchCategories();
  }, []);

  const handleApplyfilters = (event) => {
    event.preventDefault();
    setShowFilterModal(false);
    setLoading(true); // Show loading while fetching data
    // console.log("Apply filters");
    debouncedFetchBooks(filters, 1); // Call the debounced API with updated filters
  };

  const handleClearFilters = (event) => {
    // console.log("Clear filters");

    // Clear the filters and then fetch books with cleared filters
    setFilters((prevFilters) => {
      const clearedFilters = {
        ...prevFilters,
        authors: [],
        publishers: [],
        languages: [],
        editors: [],
        topics: [],
      };

      // Call fetchFilteredBooks with cleared filters after updating state
      fetchFilteredBooks(clearedFilters, 1);
      return clearedFilters; // Update state with cleared filters
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    debouncedFetchBooks(filters, newPage + 1);
    // console.log("Change page", newPage);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(
      (filter) => Array.isArray(filter) && filter.length > 0
    );
  };

  // console.log("Active filters", hasActiveFilters());
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Set the selected file to state
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const confirmAction = window.confirm(
      "Are you sure you want to upload this file?"
    );
    if (!confirmAction) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await toast.promise(
        axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/books/import`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach the token if needed
            },
          }
        ),
        {
          pending: "Uploading your file...",
          success: {
            render() {
              // Set file to null after a successful upload
              setFile(null);
              // navigate("/admin/manage/books");
              fetchFilteredBooks();
              fetchCategories();
              return "Books imported successfully!";
            },
          },
          error: "Error importing books",
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error importing books");
    }
  };

  const handleFileExport = async () => {
    const confirmAction = window.confirm(
      "Are you sure you want to export the books?"
    );
    if (!confirmAction) return;

    try {
      await toast.promise(
        axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/books/export`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob", // Important for downloading files
        }),
        {
          pending: "Exporting your data...",
          success: {
            render({ data }) {
              // Create a Blob from the response data and trigger download
              const url = window.URL.createObjectURL(new Blob([data.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "books.xlsx"); // Filename
              document.body.appendChild(link);
              link.click();
              link.remove();

              return "Data exported successfully!";
            },
          },
          error: "Failed to export data.",
        }
      );
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data.");
    }
  };

  return (
    <>
      <div
        className={`w-full relative min-h-full py-4 flex flex-col ${
          windowWidth < 450 ? "px-4" : "px-8" // Example condition based on window size
        }`}
      >
        {/* <div
          className={`flex items-center fixed top-0 left-0 right-0  z-10 justify-between ${
            windowWidth < 450 ? "p-[1rem]" : "py-[1.1rem] px-[2rem]" // Example condition based on window size
          }  `}
        > */}
        <div
          className={`flex items-center   flex-col md:flex-row  bg-[#fafafa]  sticky top-0 left-0 right-0 bottom-0 pb-4 z-10 mb-4 `}
        >
          {/* <div className="w-full border-2 border-black relative h-full flex flex-col overflow-auto sm500:flex-row gap-2 items-center justify-between"> */}
          <div className=" flex gap-2 w-full md:mb-0  ">
            <div class="flex px-4 py-2 w-full rounded-md border-2    font-[sans-serif]">
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
                placeholder="Search name..."
                class="w-full outline-none bg-transparent text-gray-600 text-[16px]"
                value={filters.searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
            <div className="">
              <button
                onClick={handleFileExport}
                className=" py-2 px-4 cursor-pointer bg-[#ad0000] text-white rounded-lg transition-colors focus:outline-none"
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-auto w-full ml-0 md:ml-3 mt-3 md:mt-0 flex items-center   justify-center gap-4 md:justify-end">
            <div
              className=" p-[0.45rem] flex justify-between items-center bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none   transition-colors cursor-pointer "
              onClick={() => setShowFilterModal(true)}
            >
              {hasActiveFilters() ? (
                <FilterAltOffOutlinedIcon
                  sx={{ color: "#ad0000", fontSize: "30px" }}
                />
              ) : (
                <FilterAltOutlinedIcon
                  sx={{ color: "#ad0000", fontSize: "30px" }}
                />
              )}{" "}
              <span className="text-[16px] px-[6px] text-[#ad0000]">
                {" "}
                Filter
              </span>
            </div>

            <div className="  overflow-auto">
              {!file && (
                <div>
                  {" "}
                  <label
                    htmlFor="fileUpload"
                    className="flex  whitespace-nowrap items-center py-2 px-4 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 transition-colors focus:outline-none "
                  >
                    Import Books
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {file && (
                <div className="mt-2 flex items-center">
                  <p className="text-gray-700">
                    {" "}
                    {file.name.length > 10 ? `${file.name}...` : file.name}
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="ml-4 py-1 px-3 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none "
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleFileUpload}
                    className="ml-2 py-1 px-3 cursor-pointer bg-[#ad0000] text-white rounded-lg transition-colors focus:outline-none "
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="h-full  flex flex-col flex-grow rounded-md">
          <div className="w-full  mt-15 mb-4 rounded-md px-2  overflow-y-auto ">
            {loading ? (
              <>
                <div className="w-full h-full p-4  flex justify-center items-center">
                  <FacebookCircularProgress />
                </div>
              </>
            ) : books && books.length > 0 ? (
              <AdminSideCollapsibleTable
                books={books}
                selectedBooks={selectedBooks}
                setSelectedBooks={setSelectedBooks}
                fetchFilteredBooks={fetchFilteredBooks}
              />
            ) : (
              <>
                <div className="flex rounded-lg justify-center items-center text-[20px] w-full h-full">
                  No books are available
                </div>
              </>
            )}
          </div>
          <div className=" flex justify-end  items-center ">
            <TablePagination
              rowsPerPageOptions={[]} // Removes dropdown options
              colSpan={3}
              count={totalBooks}
              rowsPerPage={25}
              page={page}
              onPageChange={handleChangePage}
              //   onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count }) => (
                <Box
                  component="span"
                  sx={{ fontSize: windowWidth > 400 ? "16px" : "15px" }}
                >
                  Rows per page: 25 &nbsp;&nbsp;&nbsp;&nbsp;|
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Box component="span" sx={{}}>
                    {from}-{to}
                  </Box>{" "}
                  of {count}
                </Box>
              )} // Display range and total count
              sx={{
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-select":
                  {
                    display: "none", // Hide the dropdown
                  },
                "& .MuiIconButton-root, & .MuiTablePagination-toolbar": {
                  padding: 0,
                  //   cursor: "pointer",
                },
              }}
            />
          </div>
        </div>

        {showFilterModal && (
          <div className="fixed inset-0 w-full p-4 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4  rounded-lg shadow-xl  w-full">
              <div className="space-y-2">
                <Filter
                  filters={filters}
                  setFilters={setFilters}
                  categories={categories}
                  setCategories={setCategories}
                  debouncedFetchBooks={debouncedFetchBooks}
                />
              </div>
              <div className="mt-6 w-full flex justify-end font-semibold">
                <button
                  onClick={(e) => handleClearFilters(e)}
                  className="px-4 py-1 border border-[#ad0000]  rounded-lg  "
                >
                  Clear
                </button>
                <button
                  onClick={(e) => handleApplyfilters(e)}
                  className="ml-4 px-4 py-1 bg-[#ad0000] text-white rounded-lg  transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setShowFilterModal(false)}
            ></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Books;
