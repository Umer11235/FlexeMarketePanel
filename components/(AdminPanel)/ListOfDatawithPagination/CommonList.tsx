import React, { useEffect, useState } from "react";
import { UpdateProductListProps } from "./Interfaces/IList";
import { askMessagesService, productService } from "@/apies/Services/UserService";
import CommonPagination from "../pagination/CommonPagination/Pagination";
import Link from "next/link";

const CommonList: React.FC<UpdateProductListProps> = ({
  apiEndpoint,
  columns,
  sharedList,
  onListChange,
  deleteApie,
}) => {
  const [products, setProducts] = useState<any[]>(sharedList || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default items per page

  useEffect(() => {
    if (!sharedList || sharedList.length === 0) {
      fetchProducts();
    } else {
      setProducts(sharedList);
    }
  }, [sharedList]);

  const fetchProducts = async () => {
    try {
      const response = await productService.fetchProducts("test", apiEndpoint);
      setProducts(response);
      if (onListChange) onListChange(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
     const response= await askMessagesService.deleteMessage(deleteApie as string, id); 

     if(response.isSuccess){
          const updatedProducts = products.filter((product) => product.id !== id); 
          setProducts(updatedProducts); 
           if (onListChange) onListChange(updatedProducts); 
     }

    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="relative overflow-x-auto py-2 sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase border-b-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-2 w-32 text-nowrap">
                {column.label}
              </th>
            ))}
            <th scope="col" className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => (
            <tr
              key={index}
              className="bg-white border-b text-sm dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-2 text-nowrap">
                  {product[column.key as string]?.toString()}
                </td>
              ))}
              <td className="py-2 w-60">
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  onClick={() => console.log("Edit Product:", product)}
                >
                  Update
                </button>
                <button
                  className="text-red-500 hover:text-red-700 ml-2 transition-colors"
                  // onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>

                <Link href={`/categoryAttribute/${product.id}`} 
                  className="text-green-500 hover:text-green-700 ml-2 transition-colors"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CommonPagination 
        currentPage={currentPage}
        totalItems={products.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default CommonList;
