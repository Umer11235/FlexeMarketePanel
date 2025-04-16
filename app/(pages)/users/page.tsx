"use client";

import { apiService } from "@/apies/Services/UserService";
import UserListV2 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV2";
import UserList from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV2";
import UserListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV3";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { useState } from "react";

const Page = () => {

  if (useAuthRedirect()) return null;
  
  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = (guid: string,id?:string) => {

    setIsPopup(true);
    setSelectedId(id||null);
  };

  const handleDeleteConfirmed = async () => {

    alert("Delete Confirmed code is Commented " + selectedId);

    if (!selectedId) return;
    const response = await apiService.deleteData(
      "/misc/delete-user",
      selectedId,
      true
    );  

    if (response.isSuccess) {
      console.log(response, "Success");
    } else {
      console.log("Delete Failed", response?.message || "Unknown Error");
    }

  };

  const handleEdit = (id: string, Data: any) => {
    alert(id);
    console.log(Data);
  };

  const onView = (id: string) => {
    return `/view/${id}`;
  };

  return (
    <div>
      <h2 className="font-bold pb-4 mb-1">Users</h2>

      <Popup
        isOpen={isPopup}
        setIsOpen={setIsPopup}
        title="Are you Sure YOu Want Delete"
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDeleteConfirmed}
      />

      <UserListV3
        apiEndpoint="misc/all-users"
        // deleteApie="/misc/delete-user/"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "emailConfirmed", label: "Cornfirm Email" },
          { key: "phoneNumber", label: "Phone" },
          { key: "phoneNumberConfirmed", label: "Phone Confirmed" },
        ]}
        itemsPerPage={10}
        // Action="users"
        onDelete={handleDelete}
        // onEdit={handleEdit}
        // onView={onView}
      filterss={[
        {
          name:"IsVendor",
          type:"select",
          options:[
            {key:"Yes",value:"true"},
            {key:"No",value:"false"}
          ]
        },
        {
          name:"email",
          type:"text",
          placeholder:"Email"

        },
        {
          name:"name",
          type:"text",
          placeholder:"Name",
        },
        {
          name:"phoneNumber",
          type:"text",
          placeholder:"Phone Number"
        }
      ]}
      />
    </div>
  );
};

export default Page;
