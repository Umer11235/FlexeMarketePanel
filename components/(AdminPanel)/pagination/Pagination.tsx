import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalUsers: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalUsers,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const options = [10,30, 50, 100, 500]; // Default options

  // Determine if 'Max' value should be displayed twice
  const shouldShowMaxTwice = totalUsers === 500;


  
  return (
    <div className="flex justify-between items-center py-4 px-6 bg-white shadow-lg rounded-md">
      {/* Items per page selector */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm font-semibold bg-gray-50 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
          {/* Conditionally render "Max" */}
          {shouldShowMaxTwice && (
            <>
              <option value={totalUsers}>{totalUsers}</option> {/* First "Max" */}
              <option value={totalUsers}>{totalUsers}</option> {/* Second "Max" */}
            </>
          )}
          {!shouldShowMaxTwice && (
            <option value={totalUsers}>
              {totalUsers === 1 ? "1 Item" : "Max"}
            </option>
          )}
        </select>
      </div>

      {/* Pagination buttons (Previous / Next) */}
      <div className="flex items-center space-x-4">
        {/* Previous button */}
        <button
          className={`px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {/* Page info */}
        <span className="text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next button */}
        <button
          className={`px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Results info */}
      <div className="text-sm text-gray-500">
        <span>
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, totalUsers)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">{totalUsers}</span>
        </span>
      </div>
    </div>
  );
};

export default Pagination;
