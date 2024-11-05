import Book from "../models/book.js";
import fs from "fs";
import ExcelJS from "exceljs";
import path from "path";

export const getAllBooks = async (req, res) => {
  console.log("Inside getAllBooks");
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

export const deleteSelectedBooks = async (req, res) => {
  console.log("Inside deleteSelectedBooks");

  // Extract books array from request body
  const { books } = req.body;

  // Validate input
  if (!Array.isArray(books) || books.length === 0) {
    return res
      .status(400)
      .json({ message: "Provide a non-empty array of books to update." });
  }

  console.log(books);

  // Extract _id values from each book object
  const bookIds = books.map((book) => book._id).filter((id) => id);

  if (bookIds.length === 0) {
    return res
      .status(400)
      .json({ message: "No valid book IDs found in the provided books." });
  }

  try {
    // Update status of books with IDs in the extracted array
    const result = await Book.updateMany(
      { _id: { $in: bookIds } },
      { $set: { status: "DELETED" } }
    );

    // Check if any books were updated
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No books found with the provided IDs." });
    }

    res.status(200).json({
      message: `${result.modifiedCount} books marked as DELETED successfully.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating book statuses:", error);
    res.status(500).json({ message: "Error updating book statuses" });
  }
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
};

export const getBooksByFilterRequest = async (req, res) => {
  console.log("Inside getBooksByFilterRequest", req);

  const filters = req.body; // Get filters from the request body
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 25; // Default to limit 20 if not provided
  const query = { $and: [] }; // Initialize an array to hold conditions

  console.log("Filters:", filters);

  // Check if any filter exists
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
      const escapedSearchTerm = escapeRegExp(filters.searchTerm); // Escape special characters
      query.$and.push({
        $or: [
          { name: { $regex: escapedSearchTerm, $options: "i" } }, // Case-insensitive search for name
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

    console.log("Query with filters:", query);
  }

  try {
    // If no filters are applied, the query is an empty object, meaning fetch all books
    const finalQuery = hasFilters ? query : {};

    const results = await Book.find(finalQuery)
      .sort("name") // Sorting by serialNumber
      .skip((page - 1) * limit) // Pagination logic
      .limit(limit); // Limit the number of results per page

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

export const getUniqueValues = async (req, res) => {
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

export const exportBooks = async (req, res) => {
  try {
    const books = await Book.find(); // Fetch data from the database

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Books");

    // Define columns for the worksheet
    worksheet.columns = [
      { header: "Serial Number", key: "serialNumber", width: 15 },
      { header: "Name", key: "name", width: 25 },
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
        name: book.name,
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

export const uploadBooks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path); // Read the uploaded file

    const worksheet = workbook.getWorksheet(1); // Assume data is in the first sheet
    const books = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip the header row

      // Extract book data from the row
      const book = {
        serialNumber: row.getCell(1).value,
        name: row.getCell(2).value,
        author: row.getCell(3).value,
        editor: row.getCell(4).value,
        publisher: row.getCell(5).value,
        topic: row.getCell(6).value,
        language: row.getCell(7).value,
        status: row.getCell(8).value,
      };

      // Check required fields and only create a validBook object if all required fields are present
      const requiredFields = [
        "serialNumber",
        "name",
        "author",
        "editor",
        "publisher",
        "topic",
        "language",
      ];
      const validBook = {};

      for (const field of requiredFields) {
        if (
          book[field] !== null &&
          book[field] !== undefined &&
          book[field] !== ""
        ) {
          validBook[field] = book[field];
        }
      }

      // Only push the book if all required fields are present
      if (Object.keys(validBook).length > 0) {
        books.push(validBook);
      }
    });

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
    if (bulkOps.length > 0) {
      await Book.bulkWrite(bulkOps);
    }

    fs.unlinkSync(req.file.path); // Delete file after processing

    res.status(200).json({ message: "Books imported successfully" });
  } catch (error) {
    console.error("Error importing books:", error);
    res.status(500).json({ message: "Error importing books" });
  }
};
