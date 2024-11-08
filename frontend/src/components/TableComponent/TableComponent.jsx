import { useState, useEffect } from "react";
import { FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const TableComponent = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "John Smith",
      details1: "Project Manager",
      details2: "Tech",
      details3: "5 years",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      details1: "Developer",
      details2: "Engineering",
      details3: "3 years",
    },
    {
      id: 3,
      name: "Michael Brown",
      details1: "Designer",
      details2: "Creative",
      details3: "4 years",
    },
    {
      id: 4,
      name: "Emily Davis",
      details1: "Analyst",
      details2: "Data",
      details3: "2 years",
    },
    {
      id: 5,
      name: "James Wilson",
      details1: "Architect",
      details2: "Infrastructure",
      details3: "6 years",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showModal, setShowModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    details1: "",
    details2: "",
    details3: "",
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredData = data
    .filter((item) => {
      const searchMatch = Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const filterMatch =
        (!filterCriteria.details1 ||
          item.details1
            .toLowerCase()
            .includes(filterCriteria.details1.toLowerCase())) &&
        (!filterCriteria.details2 ||
          item.details2
            .toLowerCase()
            .includes(filterCriteria.details2.toLowerCase())) &&
        (!filterCriteria.details3 ||
          item.details3
            .toLowerCase()
            .includes(filterCriteria.details3.toLowerCase()));
      return searchMatch && filterMatch;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline" />;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="inline" />
    ) : (
      <FaSortDown className="inline" />
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded-md w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          aria-label="Open filters"
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedRows.length === filteredData.length}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
              {["name", "details1", "details2", "details3"].map((column) => (
                <th
                  key={column}
                  className={`p-4 text-left text-sm font-semibold text-gray-600 cursor-pointer select-none
                    ${column !== "name" ? "hidden sm:table-cell" : ""}`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row) => (
              <>
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedRows.includes(row.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      aria-label={`Select ${row.name}`}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-between">
                      <span>{row.name}</span>
                      <button
                        className="sm:hidden ml-2"
                        onClick={() => toggleRowExpand(row.id)}
                        aria-label={`${
                          expandedRows.includes(row.id) ? "Collapse" : "Expand"
                        } row details`}
                      >
                        {expandedRows.includes(row.id) ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">{row.details1}</td>
                  <td className="p-4 hidden sm:table-cell">{row.details2}</td>
                  <td className="p-4 hidden sm:table-cell">{row.details3}</td>
                </tr>
                {expandedRows.includes(row.id) && (
                  <tr className="sm:hidden bg-gray-50">
                    <td colSpan="2" className="p-4">
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold">Details 1:</span>{" "}
                          {row.details1}
                        </p>
                        <p>
                          <span className="font-semibold">Details 2:</span>{" "}
                          {row.details2}
                        </p>
                        <p>
                          <span className="font-semibold">Details 3:</span>{" "}
                          {row.details3}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
            <div className="space-y-4">
              {Object.keys(filterCriteria).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={filterCriteria[key]}
                    onChange={(e) =>
                      setFilterCriteria((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setFilterCriteria({
                    details1: "",
                    details2: "",
                    details3: "",
                  });
                  setShowModal(false);
                }}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
