"use client";

import { apiService } from "@/apies/Services/UserService";
import UserListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV3";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";



interface User {
  id: string;
  zip: string;
  guid: string;

}
const Page = () => {

  
  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<number>(1);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  
  

  
  useEffect(() => {
    fetchData(selectedType);

  
}, [selectedType]);

const fetchData = async (type: number) => {
  setLoading(true);
  try {
    const response = await apiService.fetchData("/PromotionZip",{},true);
    setData(response.data);
  } catch (err) {
  } finally {
    setLoading(false);
  }
};

  const handleDelete = (guid: string,id?:string) => {

    setIsPopup(true);
    setSelectedId(id||null);
  };

  const handleDeleteConfirmed = async () => {


    if (!selectedId) return;
    const response = await apiService.deleteData(
      "promotionzip",
      selectedId,
      true
    );  

    
    toast.success("Successfully Deleted");

  
    if (response.isSuccess) {
      
      setData((prevData) => prevData.filter((item) => item.id !== selectedId));
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

  const isAuthenticated  = useAuthRedirect();
  if (isAuthenticated) return null;

  return (
    <div>
      <h2 className="font-bold pb-4 mb-1">Promotion Cities</h2>
<Toaster/>
      <Popup
        isOpen={isPopup}
        setIsOpen={setIsPopup}
        title="Are you Sure YOu Want Delete"
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDeleteConfirmed}
      />

      <UserListV3
      
        apiEndpoint="promotionzip/v2"
         apiVersion="v3"
        columns={[
          { key: "zip", label: "City" },
    
        ]}
        itemsPerPage={10}
        onDelete={handleDelete}
        // onEdit={handleEdit}
        // onView={onView}
      filterss={[
        {
          name:"city",
          type:"text",
          placeholder:"Search by City",
        }
      ]}
    
      />
    </div>
  );
};

export default Page;
