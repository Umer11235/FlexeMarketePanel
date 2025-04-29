"use client"
import { apiService } from "@/apies/Services/UserService";
import UserManagement from "@/components/(AdminPanel)/(Card)/userList/userManage";
import UserListV2 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV2";
import UserListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV3";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { useState } from "react";


const Page = () => {


  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const handleDelete=(id:string)=>{
  alert("set"+id)
  setIsPopup(true)
  setSelectedId(id)
  }
  
  const handleDeleteConfirmed = async () => {
  
  
      if(!selectedId) return;
      const response=await apiService.deleteData("deleteApie", selectedId , true);
  
      if (response.isSuccess) {
        console.log(response, "Success");
      }else {
        console.log("Delete Failed", response?.message || "Unknown Error");
      }
      // alert(id+action+deleteApie)
  
  };
  
  const handleEdit=(id:string,Data:any)=>{
  alert(id)
  console.log(Data)
  
  }
  
  
  const onView=(id:string)=>{
    return `/product-view/${id}`
  }
  

  if (useAuthRedirect()) return null;


    return(
    <div>
           <Popup
        isOpen={isPopup}
        setIsOpen={setIsPopup}
        title="Are you Sure YOu Want Delete"
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDeleteConfirmed}
      /> 
<h2 className="font-bold pb-4 mb-1">Contacts</h2>

      <UserListV3
        apiEndpoint="misc/all-contacts/v2"
        columns={ [
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "subject", label: "Subject" },
          { key: "message", label: "Message" },
         
        ]}
        itemsPerPage={10}
        Action="contacts"
        filterss={[
          {name: "name", type: "text", placeholder: "Search by Name"},
          {name: "email", type: "text", placeholder: "Search by Email"},
        ]}
      />
    </div>        
    )
}

export default Page;