"use client";
import React, { useEffect, useState } from "react";
import Icons from "@/utilities/icons/icons";
import Link from "next/link";
import userService from "@/apies/Services/UserService";
import Pagination from "../pagination/Pagination";
import { UserListComponentProps } from "./Interfaces/IList";
import SearchFilters from "@/components/searchFilter/SearchFilter";
import ClimbingLoader from "react-spinners/ClimbingBoxLoader";
import Image from "next/image";



const UserListV2 = <T,>({
  columns,itemsPerPage = 10,
  bgColor,apiEndpoint,Action,deleteApie,onDelete,onEdit,onView,onItemsPerPageChange }:UserListComponentProps<T>) =>
     {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpenFilter,setOpenFilter]=useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [itemsPerPagee, setItemsPerPage] = useState(itemsPerPage);


  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage,filters,itemsPerPagee]);

  

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      
      const response = await userService.fetchUsers(
        page,
        itemsPerPagee,
        Action as string,
        apiEndpoint
        ,
        filters                
      );

      setUsers(response.data || []);
      setTotalUsers(response.count || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };



  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  const totalPages = Math.ceil(totalUsers / itemsPerPagee);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };




  const handleApplyFilters = (filterValues: Record<string, any>) => {
    
    setFilters({ ...filterValues });
    setCurrentPage(1); // Reset to the first page
  // fetchUsers(currentPage);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1); 
  fetchUsers(currentPage);

  };
  
  return (
    <div className="relative overflow-x-auto py-2 sm:rounded-lg">
  
   
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

  {/* Search Filters */}

        <div
          className={`${isOpenFilter?"":"hidden"} flex gap-2 p-3 mb-2 ${
            bgColor ? bgColor : "bg-slate-200"} w-full rounded-lg`}>




{isOpenFilter && (
        <SearchFilters
          filters={[
            {
              name: "category",
              type: "select",
              options: [
                { key: "Electronics", value: "320" },
                { key: "Bluetooth", value: "321" },
                { key: "Smartwatches", value: "353" },
                // Add more options as needed
              ],
            },
            
            {
              name: "name",
              type: "text",
              placeholder: "Name",
            },
          ]}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      )}



      </div>
  
  {loading?<ClimbingLoader color="#5b909b" className="!flex m-auto p-9" size={15}/>:
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase border-b-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                scope="col"
                className="px-4 py-2 w-32 text-nowrap"
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
          {filteredUsers.map((user, index) => (
            <tr
              key={index}
              className="bg-white border-b text-sm dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >

              
              {columns.map((column) => (
                <td
                  key={column.key.toString()}
                  className="px-4 py-2 text-nowrap min-w-6 max-w-[10rem] overflow-hidden"
                >
                  {column.key === "images" &&
                  Array.isArray(user[column.key]) ? (
                    user[column.key].length > 0 ? (
                      // <img
                      <Image
                        width={100} 
                        height={100}
                        src={`https://flexemart.com/uploads/${
                          user[column.key][0]?.name
                        }`}
                        alt="Product Image"
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      <span>No Image</span>
                    )
                  ) : typeof user[column.key] === "boolean" ? (
                    user[column.key] ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : (
                    user[column.key]?.toString()
                  )}
                </td>
              ))}

              <td className="px-4 py-7 flex gap-3">

              {onView&&(   <Link
                    href={onView(user.guid)}
                    className="text-blue-500 hover:underline">
                   <Icons icon="link" />
                    </Link>)}

                  {onEdit && (
                    
                    <button
                    onClick={()=>onEdit?.(user.guid,user )}>
                    <Icons icon="edit" />
                    </button>
                              )
                  }

                  {
                    onDelete && (
                      <button
                      onClick={()=>onDelete(user.guid)}>
                      <Icons icon="delete" />
                      </button>
                    )
                  }
        
              </td>
            </tr>
          ))}
        </tbody>
      </table>

  }


      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPagee}
        totalUsers={totalUsers}
        // onItemsPerPageChange={() => itemsPerPage} 
        onItemsPerPageChange={(e)=>setItemsPerPage(e)} // Updated function

      />

      <div>

      
      </div>
    </div>
  );
};

export default UserListV2;
