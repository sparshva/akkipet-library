import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { toast } from "../Toast/Toast";

function Row({ row, selectedBooks, setSelectedBooks, windowWidth }) {
  const [open, setOpen] = React.useState(false);
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      // Add to selectedBooks if checked
      setSelectedBooks((prevSelected) => [...prevSelected, row]);
    } else {
      // Remove from selectedBooks if unchecked
      setSelectedBooks(
        (prevSelected) =>
          prevSelected.filter((book) => book.serialNumber !== row.serialNumber) // Assuming each book has a unique 'id'
      );
    }
  };

  return (
    <React.Fragment>
      <TableRow
        // sx={{ "& > *": { borderBottom: "unset" }, border: "1px solid black" }}
        sx={{
          "& .MuiTableCell-sizeMedium": {
            padding: "12px 16px",
          },
        }}
      >
        <TableCell sx={{ padding: "0" }} align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          align="left"
          sx={{
            padding: "0 20px",
            fontSize: "16px",
            color: row.status != "AVAILABLE" ? "#949494" : "inherit",
          }}
        >
          {row.name}
          {/* <br></br>
          <br></br>
          {row.author} */}
        </TableCell>
        {windowWidth > 500 && (
          <TableCell
            component="th"
            scope="row"
            align="left"
            sx={{
              padding: "0 20px",
              fontSize: "16px",
              color: row.status != "AVAILABLE" ? "grey" : "inherit",
            }}
          >
            {row.author}
          </TableCell>
        )}
        {windowWidth > 800 && (
          <TableCell
            component="th"
            scope="row"
            align="left"
            sx={{
              padding: "0 20px",
              fontSize: "16px",
              color: row.status != "AVAILABLE" ? "grey" : "inherit",
            }}
          >
            {row.language}
          </TableCell>
        )}
        {windowWidth > 950 && (
          <TableCell
            component="th"
            scope="row"
            align="left"
            sx={{
              padding: "0 20px",
              fontSize: "16px",
              color: row.status != "AVAILABLE" ? "grey" : "inherit",
            }}
          >
            {row.topic}
          </TableCell>
        )}
        {windowWidth > 1050 && (
          <TableCell
            component="th"
            scope="row"
            align="left"
            sx={{
              padding: "0 20px",
              fontSize: "16px",
              color: row.status != "AVAILABLE" ? "grey" : "inherit",
            }}
          >
            {row.editor}
          </TableCell>
        )}
        <TableCell sx={{ padding: "0" }} align="center">
          <div class="w-full h-full">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
              onChange={handleCheckboxChange}
              checked={selectedBooks.some(
                (book) => book.serialNumber === row.serialNumber
              )}
              //   disabled={row.status != "AVAILABLE"}
              // disabled={true}
            />
          </div>
        </TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Book Details
              </Typography>
              <Table size="small" aria-label="book-details">
                {/* <TableHead>
                  <TableRow>
                    <TableCell>Detail</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      Author
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      {row.author || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      Editor
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      {row.editor || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      Publisher
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      {row.publisher || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      Language
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      {row.language || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      Topic
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      {row.topic || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      Serial Number
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      {row.serialNumber || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "10px 20px",
                        fontSize: "16px",
                      }}
                    >
                      {row.status || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const AdminSideCollapsibleTable = ({
  books,
  selectedBooks,
  setSelectedBooks,
  fetchFilteredBooks,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log("windowWidth", windowWidth);
  console.log("Selected books:", selectedBooks);

  const deleteSelectedBooks = async () => {
    console.log("Selected books to delete:", selectedBooks);
    const confirmAction = window.confirm(
      "Are you sure you want to delete the selected books?"
    );
    if (!confirmAction) return;

    // Extract _id values from selectedBooks

    try {
      await toast.promise(
        axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/books/delete`, {
          data: {
            books: selectedBooks,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // retrieve and set the token
          },
        }),
        {
          pending: "Deleting selected books...",
          success: {
            render({ data }) {
              console.log("Deleted books response:", data);
              fetchFilteredBooks();
              return `${data.deletedCount} books deleted successfully!`;
            },
          },
          error: {
            render({ data }) {
              console.error(
                "Error deleting books:",
                data.response.data.message
              );
              return data.response.data.message;
            },
          },
        }
      );

      // Clear the selectedBooks state after successful deletion
      setSelectedBooks([]);
    } catch (error) {
      console.error("An error occurred while deleting books:", error);
      toast.error("Error deleting books");
    }
  };
  // console.log(books);
  return (
    <>
      <Table
        aria-label="collapsible table"
        stickyHeader
        sx={{
          border: "1px solid transparent", // Ensure there's a base border for shadow
          // boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)", // Adds shadow effect
          backgroundColor: "white", // Ensures table background is white
          borderRadius: "2px", // Adds rounded corners,
          boxShadow:
            " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" />
            <TableCell
              align="left"
              sx={{
                padding: "20px 20px",
                fontSize: "20px",
              }}
            >
              Name
            </TableCell>
            {windowWidth > 500 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "20px",
                }}
              >
                Author
              </TableCell>
            )}
            {windowWidth > 800 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "20px",
                }}
              >
                Language
              </TableCell>
            )}
            {windowWidth > 950 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "20px",
                }}
              >
                Topic
              </TableCell>
            )}
            {windowWidth > 1050 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "20px",
                }}
              >
                Editor
              </TableCell>
            )}
            <TableCell
              align="left"
              sx={{
                padding: "10px 20px",
                fontSize: "20px",
              }}
            >
              {selectedBooks && selectedBooks.length > 0 && (
                <div className=" flex items-center whitespace-nowrap text-md text-gray-500">
                  <button
                    onClick={() => deleteSelectedBooks()}
                    className="text-red-600 hover:text-red-900 cursor-pointer focus:outline-none  p-1  transition-colors duration-200"
                    aria-label="Delete books"
                  >
                    <DeleteOutlineIcon className="w-5 h-5" />
                  </button>
                  ( {selectedBooks.length})
                </div>
              )}
            </TableCell>
            {/* <TableCell align="right">Fat&nbsp;(g)</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {books &&
            books.length > 0 &&
            books.map((row) => (
              <Row
                key={row.serialNumber}
                row={row}
                selectedBooks={selectedBooks}
                setSelectedBooks={setSelectedBooks}
                windowWidth={windowWidth}
              />
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AdminSideCollapsibleTable;
