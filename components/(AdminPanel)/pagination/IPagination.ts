export interface IPaginate {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalUsers: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
  }
  