const Book = require("../models/book.js");
const fs = require("fs");
const ExcelJS = require("exceljs");
const path = require("path");

const getAllBooks = async (req, res) => {
  // console.log("Inside getAllBooks");
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

const deleteSelectedBooks = async (req, res) => {
  // console.log("Inside deleteSelectedBooks");

  // Extract books array from request body
  const { books } = req.body;

  // Validate input
  if (!Array.isArray(books) || books.length === 0) {
    return res
      .status(400)
      .json({ message: "Provide a non-empty array of books to delete." });
  }

  // console.log(books);

  // Extract _id values from each book object
  const bookIds = books.map((book) => book._id).filter((id) => id);

  if (bookIds.length === 0) {
    return res
      .status(400)
      .json({ message: "No valid book IDs found in the provided books." });
  }

  try {
    // Check if any of the selected books have a status of "NOT AVAILABLE"
    const unavailableBooks = await Book.find({
      _id: { $in: bookIds },
      status: "NOT AVAILABLE",
    });

    if (unavailableBooks.length > 0) {
      // Find the serial numbers (indices) of the unavailable books
      const unavailableSerialNumbers = unavailableBooks.map(
        (unavailableBook) => {
          // Find the serial number (index) of the book from the original books array
          return unavailableBook.serialNumber;
        }
      );

      return res.status(400).json({
        message: `Books whose serial numbers are ${unavailableSerialNumbers.join(
          ", "
        )} cannot be deleted because they are currently ordered (status: NOT AVAILABLE).`,
        unavailableBooks: unavailableSerialNumbers,
      });
    }

    // Delete books if all are available
    const result = await Book.deleteMany({ _id: { $in: bookIds } });

    // Check if any books were deleted
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No books found with the provided IDs." });
    }

    res.status(200).json({
      message: `${result.deletedCount} books deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting books:", error);
    res.status(500).json({ message: "Error deleting books" });
  }
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
};

const getBooksByFilterRequest = async (req, res) => {
  // console.log("Inside getBooksByFilterRequest", req);

  const filters = req.body; // Get filters from the request body
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 25; // Default to limit 20 if not provided
  const query = { $and: [] }; // Initialize an array to hold conditions

  // console.log("Filters:", filters);

  const hasFilters =
    filters.searchTerm ||
    (filters.authors && filters.authors.length > 0) ||
    (filters.publishers && filters.publishers.length > 0) ||
    (filters.editors && filters.editors.length > 0) ||
    (filters.languages && filters.languages.length > 0) ||
    (filters.topics && filters.topics.length > 0);

  // Build the query only if there are filters
  if (hasFilters) {
    if (filters.searchTerm !== "") {
      const escapedSearchTerm = escapeRegExp(filters.searchTerm).trim(); // Escape special characters
      query.$and.push({
        $or: [
          { nameInHindi: { $regex: escapedSearchTerm, $options: "i" } }, // Case-insensitive search for name
          { nameInEnglish: { $regex: escapedSearchTerm, $options: "i" } },
          { serialNumber: { $regex: escapedSearchTerm, $options: "i" } }, // Case-insensitive search for serialNumber
        ],
      });
    }

    if (filters.authors && filters.authors.length > 0) {
      query.$and.push({ author: { $in: filters.authors } }); // Match any of the authors
    }

    if (filters.publishers && filters.publishers.length > 0) {
      query.$and.push({ publisher: { $in: filters.publishers } }); // Match any of the publishers
    }

    if (filters.editors && filters.editors.length > 0) {
      query.$and.push({ editor: { $in: filters.editors } }); // Match any of the editors
    }

    if (filters.languages && filters.languages.length > 0) {
      query.$and.push({ language: { $in: filters.languages } }); // Match any of the languages
    }

    if (filters.topics && filters.topics.length > 0) {
      query.$and.push({ topic: { $in: filters.topics } }); // Match any of the topics
    }

    // console.log("Query with filters:", query);
  }

  try {
    // If no filters are applied, the query is an empty object, meaning fetch all books
    const finalQuery = hasFilters ? query : {};

    const results = await Book.find(finalQuery)
      .sort("nameInHindi") // Sorting by serialNumber
      .skip((page - 1) * limit) // Pagination logic
      .limit(limit) // Limit the number of results per page
      .lean();

    const totalCount = await Book.countDocuments(finalQuery); // Get total count of matching documents

    res.status(200).json({
      results,
      totalCount, // Attach total count to the response
    });
  } catch (error) {
    console.error("Error fetching books:", error); // Log the error for debugging

    // Send an error response
    res.status(500).json({
      message: "Error fetching books",
      error: error.message,
    });
  }
};

const getUniqueValues = async (req, res) => {
  // console.log("Inside getUniqueValues");
  try {
    const uniqueValues = await Book.aggregate([
      {
        $group: {
          _id: null,
          authors: { $addToSet: "$author" },
          topics: { $addToSet: "$topic" },
          languages: { $addToSet: "$language" },
          editors: { $addToSet: "$editor" },
          publishers: { $addToSet: "$publisher" },
        },
      },
      {
        $project: {
          _id: 0, // Do not include the _id field in the result
          authors: 1,
          topics: 1,
          languages: 1,
          editors: 1,
          publishers: 1,
        },
      },
    ]);

    res.status(200).json(uniqueValues[0]); // Return the first (and only) document
  } catch (error) {
    console.error("Error fetching unique values:", error);

    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

const exportBooks = async (req, res) => {
  try {
    const books = await Book.find(); // Fetch data from the database

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Books");

    // Define columns for the worksheet
    worksheet.columns = [
      { header: "Serial Number", key: "serialNumber", width: 15 },
      { header: "Name In Hindi", key: "nameInHindi", width: 25 },
      { header: "Name In English", key: "nameInEnglish", width: 25 },
      { header: "Author", key: "author", width: 25 },
      { header: "Editor", key: "editor", width: 20 },
      { header: "Publisher", key: "publisher", width: 20 },
      { header: "Topic", key: "topic", width: 15 },
      { header: "Language", key: "language", width: 15 },
      { header: "Status", key: "status", width: 10 },
    ];

    // Add rows of data to the worksheet
    books.forEach((book) => {
      worksheet.addRow({
        serialNumber: book.serialNumber,
        nameInHindi: book.nameInHindi,
        nameInEnglish: book.nameInEnglish,
        author: book.author,
        editor: book.editor,
        publisher: book.publisher,
        topic: book.topic,
        language: book.language,
        status: book.status,
      });
    });

    // Write the workbook to the response as an Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=books.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting books:", error);
    res.status(500).json({ message: "Error exporting books" });
  }
};

const uploadBooks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer); // Read the uploaded file

    const worksheet = workbook.getWorksheet(1); // Assume data is in the first sheet
    const books = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip the header row

      // Extract book data from the row
      const rawBook = {
        serialNumber: row.getCell(1).value?.toString().trim(),
        nameInHindi: row.getCell(2).value?.toString().trim(),
        nameInEnglish: row.getCell(3).value?.toString().trim(),
        author: row.getCell(4).value?.toString().trim(),
        editor: row.getCell(5).value?.toString().trim(),
        publisher: row.getCell(6).value?.toString().trim(),
        topic: row.getCell(7).value?.toString().trim(),
        language: row.getCell(8).value?.toString().trim(),
      };

      if (!rawBook.serialNumber) return;

      if (!rawBook.nameInHindi && !rawBook.nameInEnglish) return;

      const allFields = [
        "serialNumber",
        "nameInHindi",
        "nameInEnglish",
        "author",
        "editor",
        "publisher",
        "topic",
        "language",
      ];
      const validBook = {};

      for (const field of allFields) {
        if (
          rawBook[field] !== null &&
          rawBook[field] !== undefined &&
          rawBook[field] !== ""
        ) {
          validBook[field] = rawBook[field];
        }
      }

      // Only push the book if all required fields are present
      if (Object.keys(validBook).length > 0) {
        books.push(validBook);
      }
    });

    if (!books.length) {
      return res.status(400).json({
        message: "No valid books found. Serial number and name is compulsory.",
      });
    }

    // Bulk insert or update books in MongoDB
    const bulkOps = books.map((book) => ({
      updateOne: {
        filter: { serialNumber: book.serialNumber },
        update: {
          $set: {
            ...book, // Spread validBook properties to set them
          },
          $setOnInsert: { status: "AVAILABLE" }, // Set status to "AVAILABLE" only on insert
        },
        upsert: true,
      },
    }));

    // Only proceed if there are valid books to process
    let addedCount = 0;
    let updatedCount = 0;
    if (bulkOps.length > 0) {
      const result = await Book.bulkWrite(bulkOps);
      console.log(result);
      addedCount = result.upsertedCount || 0;
      updatedCount = result.modifiedCount || 0;
    }

    // fs.unlinkSync(req.file.path); // Delete file after processing

    res.status(200).json({
      message: `Added: ${addedCount}, Updated: ${updatedCount} successfully`,
    });
  } catch (error) {
    console.error("Error importing books:", error);
    res.status(500).json({ message: "Error importing books" });
  }
};

module.exports = {
  getAllBooks,
  uploadBooks,
  exportBooks,
  getBooksByFilterRequest,
  getUniqueValues,
  deleteSelectedBooks,
};
