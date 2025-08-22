"use client";
import React, { useEffect, useState } from "react";
import Icons from "@/utilities/icons/icons";
import Link from "next/link";
import userService, { apiService } from "@/apies/Services/UserService";
import Pagination from "../pagination/Pagination";
import { UserListComponentProps } from "./Interfaces/IList";
import SearchFilters from "@/components/searchFilter/SearchFilter";
import ClimbingLoader from "react-spinners/ClimbingBoxLoader";
import Image from "next/image";
import Dropdown from "../(Fields)/inputs/Dropdown/Dropdown";

// Helper function to strip HTML tags from a string
const stripHtmlTags = (htmlString:any) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
};

const UserListV4 = <T,>({
    columns, itemsPerPage = 10,
    bgColor, apiEndpoint, apiVersion, Action, deleteApie, onDelete, onCancel, onEdit, onView, onItemsPerPageChange, onRecommend, filterss, removeListId, onSave
}: UserListComponentProps<T> & {
    onSave?: (guid: string, updatedData: T) => void;
}) => {
    const [users, setUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOpenFilter, setOpenFilter] = useState(false);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [itemsPerPagee, setItemsPerPage] = useState(itemsPerPage);

    const [editableRowId, setEditableRowId] = useState<string | null>(null);
    const [editedItems, setEditedItems] = useState<Record<string, any>>({});
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    useEffect(() => {
        if (removeListId) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.guid !== removeListId));
        }
    }, [removeListId]);

    useEffect(() => {
        if (apiVersion === "v3") {
            fetchUsersV3(currentPage);
        } else if (apiVersion === "v2") {
            fetchUsersV2(currentPage);
        } else {
            fetchUsers(currentPage);
        }
    }, [currentPage, filters, itemsPerPagee, apiVersion]);


    const fetchUsersV2 = async (page: number) => {
        try {
            setLoading(true)
            const response = await apiService.fetchData(apiEndpoint,
                {
                    page: page,
                    pageSize: itemsPerPagee,
                    ...filters
                },
                true
            );
            console.log(response.data.orders)
            setUsers(response.data.orders || []);
            setTotalUsers(response.data.total || 0);
        }
        catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsersV3 = async (page: number) => {
        try {
            setLoading(true)
            const response = await apiService.fetchData(apiEndpoint,
                { ...filters },
                true
            );
            console.log("v3", response)
            setUsers(response.data || []);
            setTotalUsers(response.count || 0);
        }
        catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsers = async (page: number) => {
        setLoading(true);
        try {
            const response = await userService.fetchUsers(
                page,
                itemsPerPagee,
                Action as string,
                apiEndpoint,
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
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({});
        setCurrentPage(1);
        fetchUsers(currentPage);
    };

    const handleEditRow = (guid: string, user: any) => {
        setEditableRowId(guid);
        setEditedItems(prev => ({ ...prev, [guid]: { ...user } }));
    };

    const handleSaveRow = (guid: string) => {
        const updatedItem = editedItems[guid];
        if (updatedItem) {
            console.log(`Saving row ${guid} with data:`, updatedItem);
            if (onSave) {
                onSave(guid, updatedItem);
            }
            setEditableRowId(null);
            setEditedItems(prev => {
                const newItems = { ...prev };
                delete newItems[guid];
                return newItems;
            });
        }
    };

    const handleCancelEdit = () => {
        setEditableRowId(null);
        setEditedItems({});
    };

    const handleInputChange = (guid: string, key: string, value: any) => {
        setEditedItems(prev => ({
            ...prev,
            [guid]: {
                ...prev[guid],
                [key]: value
            }
        }));
    };

    const handleSelectRow = (guid: string) => {
        setSelectedRows(prev =>
            prev.includes(guid) ? prev.filter(id => id !== guid) : [...prev, guid]
        );
    };
    
    // Naya Bulk Update Function
    const handleBulkSave = async () => {
        const updatedItemsArray = selectedRows.map(guid => ({
            guid,
            ...editedItems[guid]
        }));

        if (updatedItemsArray.length === 0) {
            console.log("No items selected for bulk save.");
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.postData(
                `/product/bulk-updatev2`,
                updatedItemsArray
            );
            console.log("Bulk update successful:", response);

            setSelectedRows([]);
            setEditableRowId(null);
            setEditedItems({});
            fetchUsers(currentPage);

        } catch (error) {
            console.error("Error during bulk update:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative overflow-x-auto py-2 sm:rounded-lg">
            <div
                className={`flex justify-between p-3 mb-2 ${bgColor ? bgColor : "bg-slate-200"
                    } w-full rounded-lg`}>
                <div className="flex items-end">
                    <ul className="flex gap-4 m-auto">
                        <li onClick={() => setOpenFilter(!isOpenFilter)}>
                            {" "}
                            <Icons icon="FunnelSimple" />
                        </li>
                    </ul>
                </div>
                <div className="flex gap-2">
                    {selectedRows.length > 0 && (
                        <button
                            onClick={handleBulkSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Save Selected ({selectedRows.length})
                        </button>
                    )}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-60 border rounded-lg px-2 py-1"
                    />
                </div>
            </div>
            <div
                className={`${isOpenFilter ? "" : "hidden"} flex gap-2 p-3 mb-2 ${bgColor ? bgColor : "bg-slate-200"
                    } w-full rounded-lg`}>
                {isOpenFilter && (
                    <SearchFilters
                        filters={filterss ? filterss : []}
                        onApply={handleApplyFilters}
                        onReset={handleResetFilters}
                    />
                )}
            </div>
            {loading ? <ClimbingLoader color="#5b909b" className="!flex m-auto p-9" size={15} /> :
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase border-b-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-2 w-10">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedRows(users.map(user => user.guid));
                                        } else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                            </th>
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
                                {(onView || onEdit || onDelete || onCancel) && "Actions"}
                            </th>
                            <th scope="col" className="px-4 py-2">
                                {onRecommend && ("Deals/Recommend")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr
                                key={user.guid || index}
                                onDoubleClick={() => handleEditRow(user.guid, user)}
                                className="bg-white border-b text-sm dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(user.guid)}
                                        onChange={() => handleSelectRow(user.guid)}
                                    />
                                </td>
                                {columns.map((column) => (
                                    <td
                                        key={column.key.toString()}
                                        className="px-4 py-2 text-nowrap min-w-6 max-w-[10rem] overflow-hidden"
                                    >
                                        {column.key === "images" ? (
                                            Array.isArray(user.images) && user.images.length > 0 ? (
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={`https://flexemart.com/uploads/${user.images[0]?.name}`}
                                                    alt="Product Image"
                                                    className="w-16 h-16 object-cover"
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )
                                        ) : (editableRowId === user.guid || selectedRows.includes(user.guid)) ? (
                                            <input
                                                type="text"
                                                value={editedItems[user.guid]?.[column.key] || user[column.key]?.toString()}
                                                onChange={(e) => handleInputChange(user.guid, column.key.toString(), e.target.value)}
                                                className="w-full border rounded-lg px-2 py-1"
                                            />
                                        ) : (
                                            column.key === "description" ? (
                                                <span dangerouslySetInnerHTML={{ __html: stripHtmlTags(user[column.key]?.toString() || "") }} />
                                            ) : typeof user[column.key] === "boolean" ? (
                                                user[column.key] ? "Yes" : "No"
                                            ) : (
                                                column.render
                                                    ? column.render(user[column.key], user)
                                                    : user[column.key]?.toString()
                                            ))}
                                    </td>
                                ))}
                                <td className="px-4 py-7 flex gap-3 text-nowrap min-w-6 max-w-[10rem] ">
                                    {(editableRowId === user.guid || selectedRows.includes(user.guid)) ? (
                                        <>
                                            <button onClick={() => handleSaveRow(user.guid)}>
                                                <Icons icon="Save" />save
                                            </button>
                                            <button onClick={handleCancelEdit}>
                                                <Icons icon="Cancel" />cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {onView && (
                                                <Link
                                                    href={onView(user.guid)}
                                                    className="text-blue-500 hover:underline">
                                                    <Icons icon="link" />
                                                </Link>
                                            )}
                                            {onEdit && (
                                                <button onClick={() => handleEditRow(user.guid, user)}>
                                                    <Icons icon="edit" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button onClick={() => onDelete(user.guid, user.id)}>
                                                    <Icons icon="delete" />
                                                </button>
                                            )}
                                            {onCancel && (
                                                <button onClick={() => onCancel(user.guid)}>
                                                    <Icons icon="delete" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-nowrap min-w-6 max-w-[10rem] overflow-hidden">
                                    {onRecommend && (
                                        <button
                                            onClick={() => onRecommend(user.id, true)}
                                            className="text-blue-500 hover:underline">
                                            <Icons icon="heart" />
                                            Is Recommend?
                                        </button>
                                    )}
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
                onItemsPerPageChange={(e) => setItemsPerPage(e)}
            />
        </div>
    );
};

export default UserListV4;
