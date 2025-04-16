"use client"
import { apiService } from "@/apies/Services/UserService";
import UserListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV3";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { useState } from "react";
import { toast, Toaster } from "sonner";


const Page = () => {

  useAuthRedirect(); 


const [isPopup, setIsPopup] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
const [cancelConfirmedOrderId, setCancelConfirmedOrderId] = useState<string | null>(null);


// const handleDelete=(id:string)=>{
// alert("set"+id)
// setIsPopup(true)
// setSelectedId(id)
// }

// const handleDeleteConfirmed = async () => {


//     if(!selectedId) return;
//     const response=await apiService.deleteData("deleteApie", selectedId , true);

//     if (response.isSuccess) {
//       console.log(response, "Success");
//     }else {
//       console.log("Delete Failed", response?.message || "Unknown Error");
//     }
//     // alert(id+action+deleteApie)

// };

const handleEdit=(id:string,Data:any)=>{

alert(id)
console.log(Data)

}


const handleCancelConfirmed = async () => {
  if (!cancelOrderId) return;
   apiService.fetchData(`http://localhost:5145/api/orderv2/cancel-order/${cancelOrderId}`, {} , true).then((response)=>{
    if (response.isSuccess) {
      setCancelConfirmedOrderId(cancelOrderId)
    } else {
      console.log("Delete Failed", response?.message || "Unknown Error");
    }

  }).catch((error)=>{
  toast.success(error.message)  
  });

 
};

const handleCancel=(id:string)=>{
  setCancelOrderId(id)
  setIsPopup(true)
  

}


const onView=(id:string)=>{
  return `/view/${id}`
}



    return(
    <div>
      <Toaster/>
        <Popup
              isOpen={isPopup}
              setIsOpen={setIsPopup}
              title="Are you Sure YOu Want to Cancel this Order?"
              cancelText="Cancel"
              confirmText="Delete"
              onConfirm={handleCancelConfirmed}
            />

<h2 className="font-bold pb-4 mb-1">Orders</h2>

      <UserListV3
      // apiEndpoint="https://flexemart.com/api/order/search-orders"     //----- old api V1----
        apiEndpoint="orderv2/orders"
        apiVersion="v2"
        columns={ [
          { key: "orderNumber", label: "Order#" },
          { key: "name", label: "Name" },
          { key: "address", label: "Address" },
          { key: "orderItems", label: "Items" },
          { key: "price", label: "Price" },
          { key: "total", label: "Total" },
          { key: "tax", label: "Tax Price" },
          { key: "shipping", label: "Shipping" },
          { key: "grandTotal", label: "Grand Total" },
          { key: "status", label: "Status" },
        ]}
        itemsPerPage={10}
      // Action="orders"
      // onDelete={handleDelete}
      onView={onView}
      onEdit={handleEdit}
      onCancel={handleCancel}
      filterss={[
        {
          name: "status",
          type: "select",
          options: [
            { key: "Pending", value: "1" },
            { key: "Fullfilled", value: "4" },
            { key: "delivered", value: "2" },
            { key: "Rejected", value: "3" },
            { key: "Un Confirmed", value: "5" },
          ],
        },
        
        
        {
          name: "orderNumber",
          type: "text",
          placeholder: "order",
        },
      ]}
      removeListId={cancelConfirmedOrderId?cancelConfirmedOrderId:""}
      />



    </div>        
    )
}

export default Page;