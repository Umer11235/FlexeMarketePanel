"use client";
import React, { useEffect, useState } from "react";
import Icons from "@/utilities/icons/icons";
import Modal from "../modals/Modal";
import Link from "next/link";
import userService from "@/apies/Services/UserService";
import Pagination from "../pagination/Pagination";
import { UserListComponentProps } from "./Interfaces/IList";
import SearchFilters from "@/components/searchFilter/SearchFilter";
import ClimbingLoader from "react-spinners/ClimbingBoxLoader";



const UserList = <T,>({
  columns,itemsPerPage = 10,
  bgColor,apiEndpoint,Action,deleteApie,onDelete,onEdit,onView}:UserListComponentProps<T>) =>
     {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpenFilter,setOpenFilter]=useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({});



  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage,filters]);

  
  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const response = await userService.fetchUsers(
        page,
        itemsPerPage,
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


  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const handleDelete = async (id: string) => {
    try {

      const response=await userService.deleteUser(deleteApie as string,id);

      if (response.isSuccess) {
        console.log(response, "Success");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      }
      // alert(id+action+deleteApie)
    } catch (e) {
      console.log(e);
    }
  };


  const handleUpdate = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
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
                      <img
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



                {/* ////Views */}
                {Action === "orders" || Action === "requested" ? (
                  <Link
                    href={"/view/" + user.guid}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                ) : Action === "products" ? (
                  <Link
                    href={"/product-view/" + user.guid}
                    className="text-blue-500 hover:underline"
                  >
                    {/* View */}
                    <Icons icon={"edit"} />

                  </Link>
                ) : null}

                {/* ////Update */}

                {Action === "products" || Action === "productUpdate" ? (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleUpdate(user)}
                  >
                    {/* Update */}
                    <Icons icon={"update"} />

                  </button>
                ) : null}

                {/* ////Delete */}

                {Action === "users" ||
                Action === "products" ||
                Action === "productUpdate" ? (
                  <button
                    className="text-red-500 hover:underline ml-2"
                    // onClick={() => handleDelete(user.id)}
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                  >
                    {/* Delete */}
                    
                    <Icons icon={"delete"} />

                  </button>
                ) : null}
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
        itemsPerPage={itemsPerPage}
        totalUsers={totalUsers}
        onItemsPerPageChange={() => itemsPerPage} 
      />

      <div>
        {/* Modal Toggle Button */}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(!isModalOpen);
          }}
          title={selectedUser?.name}
          content={
            <>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              </p>
              <p>Edit form for {selectedUser?.id}</p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Email {selectedUser?.email}
              </p>
              <p>are you sure You want to Delete ?</p>
            </>
          }
          footerActions={
            <>
              <button
                onClick={() => {
                  setIsModalOpen(!isModalOpen);
                  handleDelete(selectedUser.id);
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(!isModalOpen);
                }}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          }
        />
      </div>
    </div>
  );
};

export default UserList;
