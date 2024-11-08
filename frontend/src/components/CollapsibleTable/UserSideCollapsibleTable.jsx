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
            {row.editor}
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
            {row.publisher}
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
            {row.topic}
          </TableCell>
        )}
        {windowWidth > 1250 && (
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
        <TableCell sx={{ padding: "0" }} align="center">
          <div class="w-full h-full">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              class={`w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300 rounded  `}
              onChange={handleCheckboxChange}
              checked={selectedBooks.some(
                (book) => book.serialNumber === row.serialNumber
              )}
              disabled={row.status != "AVAILABLE"}
              // disabled={true}
            />
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant=""
                sx={{ fontSize: "18px" }}
                gutterBottom
                component="div"
              >
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
                      Author / लेखक
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
                      Editor / संपादक
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
                      Publisher / प्रकाशक
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
                      Language / भाषा
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
                      Topic / विषय
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
                        color: row.status != "AVAILABLE" ? "red" : "green",
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

const UserSideCollapsibleTable = ({
  books,
  selectedBooks,
  setSelectedBooks,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log("windowWidth", windowWidth);
  console.log("Selected books:", selectedBooks);
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
                fontSize: "18px",
              }}
            >
              Name / नाम
            </TableCell>
            {windowWidth > 500 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "18px",
                }}
              >
                Author / लेखक
              </TableCell>
            )}
            {windowWidth > 800 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "18px",
                }}
              >
                Editor / संपादक
              </TableCell>
            )}
            {windowWidth > 950 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "18px",
                }}
              >
                Publisher / प्रकाशक
              </TableCell>
            )}
            {windowWidth > 1050 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "18px",
                }}
              >
                Topic / विषय
              </TableCell>
            )}
            {windowWidth > 1250 && (
              <TableCell
                align="left"
                sx={{
                  padding: "10px 20px",
                  fontSize: "18px",
                }}
              >
                Language / भाषा
              </TableCell>
            )}
            <TableCell></TableCell>
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

export default UserSideCollapsibleTable;
