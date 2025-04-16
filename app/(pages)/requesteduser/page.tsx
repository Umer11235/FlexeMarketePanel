"use client";

import { apiService } from "@/apies/Services/UserService";
import UserListV2 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV2";
import UserList from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV2";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { useState } from "react";

const Page = () => {
    if (useAuthRedirect()) return null;
  
  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    alert("set" + id);
    setIsPopup(true);
    setSelectedId(id);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedId) return;
    const response = await apiService.deleteData(
      "deleteApie",
      selectedId,
      true
    );

    if (response.isSuccess) {
      console.log(response, "Success");
    } else {
      console.log("Delete Failed", response?.message || "Unknown Error");
    }
    // alert(id+action+deleteApie)
  };

  const handleEdit = (id: string, Data: any) => {
    alert(id);
    console.log(Data);
  };

  const onView = (id: string) => {
    return `/view/${id}`;
  };



  
  return (
    <>
    <Popup
        isOpen={isPopup}
        setIsOpen={setIsPopup}
        title="Are you Sure YOu Want Delete"
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDeleteConfirmed}
      />

<h2 className="font-bold pb-4 mb-1">Requested Users</h2>


<UserListV2
        apiEndpoint="https://flexemart.com/api/AffiliationDocument/Requested-Users"
        columns={ [
          // { key: "profile", label: "Image" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "isVendor", label: "Vendor" },
          { key: "isVerifiedVendor", label: "Verified Vendor" },
          // { key: "affiliationStatus", label: "Affiliation Status" },
          // { key: "profitPercent", label: "Profit Percent" },
        ]}
        itemsPerPage={10}
        // Action="requested"
        onView={onView}
        // onDelete={handleDelete}
        // onEdit={handleEdit}

      />

    </>
  );
};

export default Page;
