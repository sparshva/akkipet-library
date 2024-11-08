import React, { useState, useEffect, useContext } from "react";
import UserSideCollapsibleTable from "../CollapsibleTable/UserSideCollapsibleTable";
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
        size={50}
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
        size={50}
        thickness={3}
        {...props}
      />
    </Box>
  );
}

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOrderPlaceModal, setShowOrderPlaceModal] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //   const [selectedBooks, setSelectedBooks] = useState([]);
  const { cartBooks, setCartBooks, clearAll } = useContext(AppContext); // Consume the context
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
      console.log("filters", activeFilters);
      console.log(process.env);
      console.log(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/books/filter?page=${page}`
      );
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/books/filter?page=${page}`,
        activeFilters // Send full filters object
      );
      console.log(response);
      setBooks(response.data.results);
      setTotalBooks(response.data.totalCount);
      // toast.success("Books fetched successfully", {
      //   //
      // });
      setLoading(false);
      //   console.log("Fetched books:", response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Error fetching books", {
        //
      });
    }
  };
  const fetchAllBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/books/`);
      const totalPages = Math.ceil(response.data.length / 20);
      setTotalBooks(response.data.length);
      //   setBooks(response.data);
      console.log("Fetched books:", response.data);
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

      // Log the formatted categories for debugging
      console.log("Formatted Categories:", formattedCategories);

      setCategories(formattedCategories);
      console.log("Fetched categories:", response.data);
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
    console.log("Apply filters");
    debouncedFetchBooks(filters, 1); // Call the debounced API with updated filters
  };

  const handleClearFilters = (event) => {
    console.log("Clear filters");

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

  const handlePageChange = (event, value) => {
    console.log(value);
    setPage(value);
    debouncedFetchBooks(filters, value); // Call the debounced
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    debouncedFetchBooks(filters, newPage + 1);
    console.log("Change page", newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 25));
    setPage(0);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(
      (filter) => Array.isArray(filter) && filter.length > 0
    );
  };

  const handleAddToCart = (event) => {
    event.preventDefault();

    // Add the selected books to the cartbooks state
    setCartBooks([
      ...cartBooks,
      ...selectedBooks.filter(
        (newBook) =>
          !cartBooks.some(
            (cartBook) => cartBook.serialNumber === newBook.serialNumber
          )
      ),
    ]);

    // Save the selected books to localStorage
    // localStorage.setItem(
    //   "cartBooks",
    //   JSON.stringify([...cartBooks, ...selectedBooks])
    // );

    // Clear the selectedBooks after adding to cart
    // console.log("clearing the books selected");
    setSelectedBooks([]);

    // Navigate to the cart page
    navigate("/cart");

    // Log the added books
    // console.log("Selected books", [...cartBooks, ...selectedBooks]);
  };

  console.log("Active filters", hasActiveFilters());
  //   console.log(books);
  return (
    <>
      <div
        className={`w-full relative  min-h-full py-4 flex flex-col ${
          windowWidth < 450 ? "px-4" : "px-8" // Example condition based on window size
        }`}
      >
        {/* <div
          className={`flex items-center fixed top-0 left-0 right-0  z-10 justify-between ${
            windowWidth < 450 ? "p-[1rem]" : "py-[1.1rem] px-[2rem]" // Example condition based on window size
          }  `}
        > */}
        <div
          className={`flex items-center bg-[#fafafa] overflow-hidden sticky top-0 left-0 right-0 bottom-0 pb-4 z-10 justify-between mb-6 `}
        >
          <div className="w-full h-full flex items-center justify-between">
            <div className=" bg-white  w-full">
              <div class="flex px-4 py-2 rounded-md border-2  overflow-hidden  mx-auto font-[sans-serif]">
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
            </div>
            <div
              className="ml-4 flex bg-white justify-between items-center py-1 px-2 rounded-md focus:outline-none transition-colors cursor-pointer "
              onClick={() => setShowFilterModal(true)}
            >
              {hasActiveFilters() ? (
                <FilterAltOffOutlinedIcon sx={{ fontSize: "30px" }} />
              ) : (
                <FilterAltOutlinedIcon sx={{ fontSize: "30px" }} />
              )}{" "}
              <span
                className="text-[18px] px-[6px] "
                // style={{
                //   color: "#137d9f",
                //   fontSize: "19px",
                //   //   fontWeight: "bold",
                //   padding: "0 6px",
                // }}
              >
                {" "}
                Filter
              </span>
            </div>
          </div>
        </div>
        <div className="h-full mb-[1rem] flex flex-col flex-grow rounded-md">
          <div className="w-full  mt-15 mb-4 rounded-md px-2  overflow-y-auto ">
            {loading ? (
              <>
                <div className="w-full h-full  flex justify-center items-center">
                  <FacebookCircularProgress />
                </div>
              </>
            ) : books && books.length > 0 ? (
              <UserSideCollapsibleTable
                books={books}
                selectedBooks={selectedBooks}
                setSelectedBooks={setSelectedBooks}
              />
            ) : (
              <>
                <div className="flex rounded-lg justify-center items-center text-[20px] w-full h-full">
                  No books are available
                </div>
              </>
            )}
          </div>
          <div className="  flex justify-end  items-center ">
            {/* <Stack>
              <Pagination
                count={Math.ceil(totalBooks / 20)}
                page={page}
                siblingCount={0}
                boundaryCount={1}
                shape="rounded"
                onChange={handlePageChange}
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize:
                      windowWidth > 400
                        ? "1.2rem"
                        : windowWidth > 360
                        ? "1.1rem"
                        : "0.9rem",
                  },
                  "& .MuiPaginationItem-icon": {
                    fontSize:
                      windowWidth > 400
                        ? "1.3rem"
                        : windowWidth > 360
                        ? "1.1rem"
                        : "1rem",
                  },
                }}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack> */}
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

        <div
          className={`sticky flex justify-end bottom-[3.2rem] left-0 right-0 z-10 w-full ${
            windowWidth < 450 ? "p-[0.75rem]" : "py-[0.75rem] px-[1.75rem]" // Example condition based on window size
          }  bg-gray-200`}
        >
          <button
            className={`px-4 py-2 bg-[#ad0000] text-white  rounded-md focus:outline-none transition-colors ${
              selectedBooks.length < 1 ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={selectedBooks.length < 1}
            onClick={(e) => handleAddToCart(e)}
          >
            {selectedBooks.length > 0
              ? `Add to cart ( ${selectedBooks.length} )`
              : "Add to cart"}
          </button>
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
              <div className="mt-6 w-full flex justify-end ">
                <button
                  onClick={(e) => handleClearFilters(e)}
                  className="px-4 py-1 border border-[#ad0000]  rounded-lg  "
                >
                  Clear
                </button>
                <button
                  onClick={(e) => handleApplyfilters(e)}
                  className="ml-4 px-4 py-1 bg-[#ad0000] text-white rounded-lg transition-colors"
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

export default SearchBooks;
