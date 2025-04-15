"use client"
import { apiService } from "@/apies/Services/UserService";
import UserManagement from "@/components/(AdminPanel)/(Card)/userList/userManage";
import UserListV2 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV2";
import UserList from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV2";
import Popup from "@/components/(AdminPanel)/popup";
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

      <UserListV2
        apiEndpoint="https://flexemart.com/api/misc/all-contacts"
        columns={ [
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "subject", label: "Subject" },
          { key: "message", label: "Message" },
         
        ]}
        itemsPerPage={10}
        Action="contacts"
      />
    </div>        
    )
}

export default Page;