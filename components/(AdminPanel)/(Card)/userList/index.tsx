// components/UserList.tsx
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneConfirmed: boolean;
}

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (ids: number | number[]) => void; // Fix: Allow both single and array IDs
    onSelectUser: (id: number, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
    selectedUsers: number[];
    onPageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
  }
const UserList: FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  onSelectUser,
  onSelectAll,
  selectedUsers,
  onPageChange,
  currentPage,
  totalPages,
}) => {
  const allSelected = users.every((user) => selectedUsers.includes(user.id));

  return (
    <div>

<Button
  variant="destructive"
  disabled={selectedUsers.length === 0}
  onClick={() => onDelete(selectedUsers)} // Pass array of selected user IDs
className="mb-6"
>
  Bulk Delete
</Button>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th className="border border-gray-300 p-2 text-left">Name</th>
            <th className="border border-gray-300 p-2 text-left">Email</th>
            <th className="border border-gray-300 p-2 text-left">
              Email Confirmed
            </th>
            <th className="border border-gray-300 p-2 text-left">
              Phone Number
            </th>
            <th className="border border-gray-300 p-2 text-left">
              Phone Confirmed
            </th>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) =>
                    onSelectUser(user.id, e.target.checked)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">
                {user.emailConfirmed ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 p-2">
                {user.phoneNumber || "N/A"}
              </td>
              <td className="border border-gray-300 p-2">
                {user.phoneConfirmed ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => onDelete(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
 

        <div className="flex space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
