import React, { useState, useEffect, useCallback, useMemo } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";

const Filter = React.memo(
  ({ filters, setFilters, categories, setCategories, debouncedFetchBooks }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleCategoryClick = useCallback(
      (category) => {
        setSelectedCategory(
          category.id === selectedCategory ? null : category.id
        );
        setSearchTerm("");
      },
      [selectedCategory]
    );

    const handleSearch = useCallback((e) => {
      setSearchTerm(e.target.value);
    }, []);

    const handleFilterChange = useCallback(
      (categoryName, value) => {
        const updatedFilters = { ...filters };
        const categoryKey = categoryName.toLowerCase();
        const currentValues = filters[categoryKey];

        if (currentValues.includes(value)) {
          updatedFilters[categoryKey] = currentValues.filter(
            (item) => item !== value
          );
        } else {
          updatedFilters[categoryKey] = [...currentValues, value];
        }

        setFilters(updatedFilters);
      },
      [filters, setFilters]
    );

    const filteredValues = () => {
      const category = categories.find((c) => c.id === selectedCategory);

      if (!category) return [];
      // console.log("Filtering category", category);

      const filtered = category.values.filter((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const selected = filtered.filter((value) =>
        filters[category.name.toLowerCase()].includes(value)
      );
      const unselected = filtered.filter(
        (value) => !filters[category.name.toLowerCase()].includes(value)
      );

      return [...selected, ...unselected];
    };

    //   console.log(filters["authors"].length);
    // console.log("filtered values", filteredValues);

    return (
      <div className=" mx-auto  md:p-4  h-[50vh]">
        <div className="flex flex-col md:flex-row  h-full ">
          <div className="w-full md:w-2/5 md:mb-0 md:pr-4   h-full  overflow-y-auto">
            <h2 className="text-[20px] font-bold mb-4">Categories</h2>
            {categories.map((category) => (
              <div key={category.id} className="mb-2 ">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="w-full flex justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none "
                  aria-expanded={selectedCategory === category.id}
                  aria-controls={`category-${category.id}-values`}
                >
                  <span className="text-[18px]">
                    {category.name}{" "}
                    {filters[category.name.toLowerCase()].length > 0
                      ? ` ( ${filters[category.name.toLowerCase()].length} )`
                      : ""}
                  </span>
                  {isMobile && (
                    <span>
                      {selectedCategory === category.id ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </span>
                  )}
                </button>
                {isMobile && selectedCategory === category.id && (
                  <div
                    id={`category-${category.id}-values`}
                    className="mt-2 p-2 bg-white border border-gray-200 rounded-md "
                  >
                    <div className="relative mb-2 ">
                      <input
                        type="text"
                        placeholder="Search values"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 pl-8 border text-[18px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Search values in ${category.name}`}
                      />
                      <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <ul className="space-y-1">
                      {filteredValues(category.id).map((value, index) => (
                        <li key={index}>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={filters[
                                category.name.toLowerCase()
                              ].includes(value)}
                              onChange={() =>
                                handleFilterChange(category.name, value)
                              }
                              aria-label={`Select ${value} in ${category.name}`}
                            />
                            <span className="text-[16px]">{value}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!isMobile && (
            <div className="w-full md:w-2/3 px-4  h-full  overflow-y-auto">
              <h2 className=" text-[20px] font-bold mb-4">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory).name
                  : "Select a category"}
              </h2>
              {selectedCategory && (
                <div>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search values"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full p-2 pl-8 border text-[18px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Search values in ${
                        categories.find((c) => c.id === selectedCategory).name
                      }`}
                    />
                    <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <ul className="space-y-2">
                    {filteredValues(selectedCategory).map((value, index) => (
                      <li key={index}>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 "
                            checked={filters[
                              categories
                                .find((c) => c.id === selectedCategory)
                                .name.toLowerCase()
                            ].includes(value)}
                            onChange={() =>
                              handleFilterChange(
                                categories.find(
                                  (c) => c.id === selectedCategory
                                ).name,
                                value
                              )
                            }
                            aria-label={`Select ${value} in ${
                              categories.find((c) => c.id === selectedCategory)
                                .name
                            }`}
                          />
                          <span className="text-[16x]">{value}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Filter.displayName = "Filter";

export default Filter;
