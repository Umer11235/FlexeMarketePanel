"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserList from "..";

interface User {
  id: number;
  name: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneConfirmed: boolean;
}

const initialUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  emailConfirmed: i % 2 === 0,
  phoneNumber: i % 2 === 0 ? `12345678${i}` : undefined,
  phoneConfirmed: i % 3 === 0,
}));

const USERS_PER_PAGE = 10;

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (ids: number | number[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    setUsers((prev) => prev.filter((user) => !idsArray.includes(user.id)));
    setSelectedUsers([]); // Clear selections
  };

  const handleSelectUser = (id: number, selected: boolean) => {
    setSelectedUsers((prev) =>
      selected ? [...prev, id] : prev.filter((userId) => userId !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    const visibleUserIds = users
      .slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE)
      .map((user) => user.id);

    setSelectedUsers(selected ? visibleUserIds : []);
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <UserList
        users={paginatedUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        selectedUsers={selectedUsers}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {selectedUser && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                Edit User: {selectedUser.name}
              </h2>
              <input
                type="text"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                className="border p-2 mb-4 w-full"
              />
              <Button onClick={() => setIsDialogOpen(false)}>Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
