import React, { useEffect, useState } from "react";
import CommonPagination from "../pagination/CommonPagination/Pagination";
import Link from "next/link";
import useFetchData from "./CustomHook";
import Icons from "@/utilities/icons/icons";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { CommonListPropsV2 } from "./Interfaces/IList";
import SearchFilters from "@/components/searchFilter/SearchFilter";


const CommonListV3 = <T extends { id: string; type?: number ,blogId?:string }>({
  apiEndpoint,
  columns,
  sharedList,
  onListChange,
  onView,
  onDelete,
  onEdit,
  onSetValue,
  payloads,
  attributesColumn,
  bgColor,
  filtersPatterns,
}: CommonListPropsV2<T>) => {



  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // for filtersss
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [isOpenFilter,setOpenFilter]=useState(false)
    const [searchTerm, setSearchTerm] = useState("");




  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = (id: string, item: T) => {
    if (onEdit) {
      onEdit(id, item);
    }
  };

  const handleSetValue = (id: string) => {
    if (onSetValue) {
      onSetValue(id);
    }  
};

  const { data, loading, error,fetchData } = useFetchData<T>(
    apiEndpoint,
    sharedList,
    {...filters,...payloads}
  );



  useEffect(()=>{
  fetchData();
  },[filters])




  
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  




  const handleApplyFilters = (filterValues: Record<string, any>) => {
   
    setFilters({ ...filterValues });
 
  };

  const handleResetFilters = () => {

  setFilters({});


  };

  return (
    <div className="relative overflow-x-auto py-2 sm:rounded-lg">
{filtersPatterns&&(



<div
          className={`flex justify-between p-3 mb-2 ${
            bgColor ? bgColor : "bg-slate-200"} w-full rounded-lg`}>

          <div className="flex items-end">
            <ul className="flex gap-4 m-auto">
              <li onClick={() => setOpenFilter(!isOpenFilter)}>
                {" "}
                <Icons icon="FunnelSimple" />
              </li>
            </ul>
          </div>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-60 border rounded-lg px-2 py-1"
          />
        </div>

)}

  {/* Search Filters */}

        <div
          className={`${isOpenFilter?"":"hidden"} flex gap-2 p-3 mb-2 ${
            bgColor ? bgColor : "bg-slate-200"} w-full rounded-lg`}>




{isOpenFilter && (
        <SearchFilters
          filters={filtersPatterns?filtersPatterns:[]}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      )}



      </div>





      {(sharedList ===undefined|| error===null) && <p className="text-red-500">{error}</p>}
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
              {(onView || onEdit || onDelete) && "Actions"}

              </th>

              {/* <th scope="col" className="px-4 py-2">
                Attributes
              </th> */}

{attributesColumn && (
      <th className="px-4 py-2">{attributesColumn.header}</th>
    )}
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
                      onClick={() => onEdit(item.blogId ?? item.id, item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Icons icon="edit" />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id??item.blogId)}
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

                {attributesColumn && (
 <td className="px-4 py-2">
                   

 { [1, 2, 3].includes(item.type ?? 0) && ( 
  attributesColumn.render?.(item.id)
  )}
                    
</td>
)}
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

export default CommonListV3;
