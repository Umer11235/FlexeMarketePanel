import React, { useState } from "react";
import CommonPagination from "../pagination/CommonPagination/Pagination";
import Link from "next/link";
import useFetchData from "./CustomHook";
import Icons from "@/utilities/icons/icons";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { CommonListPropsV2 } from "./Interfaces/IList";

const CommonListV2 = <T extends { id: string; type?: number }>({
  apiEndpoint,
  columns,
  sharedList,
  onListChange,
  onView,
  onDelete,
  onEdit,
  onSetValue,
  payload,
}: CommonListPropsV2<T>) => {
  const { data, loading, error } = useFetchData<T>(
    apiEndpoint,
    sharedList,
    payload
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  

  return (
    <div className="relative overflow-x-auto py-2 sm:rounded-lg">
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <ClimbingBoxLoader
          color="#5b909b"
          className="!flex m-auto p-9"
          size={15}
        />
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase border-b-2 bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  scope="col"
                  className="px-4 py-2"
                >
                  {column.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key.toString()} className="px-4 py-2 ">
                    {/* {item[column.key]?.toString()} */}
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]?.toString()}
                  </td>
                ))}
                <td className="py-2 flex gap-2">
                  {onView && (
                    <Link href={onView(item.id)} className="text-green-500">
                      <Icons icon="link" />
                    </Link>
                  )}

                  {onEdit && (
                    <button
                      onClick={() => onEdit(item.id, item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Icons icon="edit" />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Icons icon="delete" />
                    </button>
                  )}

                  {onSetValue &&
                    [1, 2, 3].includes(item.type ?? 0) && ( // <-- Type check added
                      <button
                        onClick={() => onSetValue(item.id)}
                        className="text-purple-500 hover:text-purple-700 ml-2"
                      >
                        <Icons icon="update" />
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <CommonPagination
        currentPage={currentPage}
        totalItems={data.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default CommonListV2;
