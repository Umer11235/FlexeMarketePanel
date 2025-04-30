"use client"
import { apiService } from "@/apies/Services/UserService";
import UserListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV3";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { getTypeLabel } from "@/utilities/helpers.ts";
import { useState } from "react";
import { toast, Toaster } from "sonner";


interface IOrder{
  orderNumber: string;
  name: string;
  address: string;
  items: { quantity: number }[];
  price: number;
  total: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  status: number;
  id: string;
}

const Page = () => {

  useAuthRedirect(); 


const [isPopup, setIsPopup] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
const [cancelConfirmedOrderId, setCancelConfirmedOrderId] = useState<string | null>(null);


const handleDelete=(id:string)=>{
setIsPopup(true)
setSelectedId(id)
}



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

      <UserListV3<IOrder>
      // apiEndpoint="https://flexemart.com/api/order/search-orders"     //----- old api V1----
        apiEndpoint="orderv2/orders"
        apiVersion="v2"
        columns={ [
          { key: "orderNumber", label: "Order#" },
          { key: "name", label: "Name" },
          { key: "address", label: "Address" },
          // { key: "items", label: "Items" },
          { key: "price", label: "Price",
             render: (value: number) => `$${value.toFixed(2)}`
           },
          { key: "total", label: "Total",
             render: (value: number) => `$${value.toFixed(2)}`
           },
          { key: "tax", label: "Tax Price" ,
             render: (value: number) => `$${value.toFixed(2)}`
          },
          { key: "shipping", label: "Shipping" 
            , render: (value: number) => `$${value.toFixed(2)}`
          },
          { key: "grandTotal", label: "Grand Total" ,
             render: (value: number) => `$${value.toFixed(2)}`
          },
          { key: "status", label: "Status", 
               render: (status: number) => {
                  return getTypeLabel(status, {
                    1: "Pending",
                    2: "delivered",
                    3: "Rejected",
                    4: "Fullfilled",
                    5: "Un Confirmed",
                  });
                }
          },
        ]}
        itemsPerPage={10}
      // Action="orders"
      // onDelete={handleDelete}
      onView={onView}
      // onEdit={handleEdit}
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
          placeholder: "Order No #..",
        },
      ]}
      removeListId={cancelConfirmedOrderId?cancelConfirmedOrderId:""}
      />



    </div>        
    )
}

export default Page;