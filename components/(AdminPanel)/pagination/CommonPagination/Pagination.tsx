import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const CommonPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

  return (
    <div className="flex justify-between items-center mt-4 px-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
        >
          Next
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600">Show</span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={totalItems}>Max</option>
        </select>
      </div>
    </div>
  );
};

export default CommonPagination;
