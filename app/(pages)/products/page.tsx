'use client';

import userService, { apiService } from "@/apies/Services/UserService";
import UserListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV3";
import Popup from "@/components/(AdminPanel)/popup";
import ModalForm from "@/components/(pagesComponent)/modalForm";
import { useAuthRedirect } from "@/utilities/Authentication";
import { getTypeLabel } from "@/utilities/helpers.ts";
import { useEffect, useMemo, useState } from "react";


interface User {
  id: string;
  name: string;
  sort: number;
  type: number;
  description: string;
  parent_id: number;
  images: string[];
}

interface IUser {
  id: string;
  name: string;
  email: string;

}


const Page = () => {


  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModal, setIsModal] = useState(false);
  const [editInitialValues, setEditInitialValues] = useState({});
  const [loading, setLoading] = useState(false);
const [data, setData] = useState<User[]>([]);
const [user, setUser] = useState<IUser[]>([]);

useEffect(() => {
    fetchData(1); 
    fetchUser();
  }, []);

  const fetchData = async (type: number) => {
    setLoading(true);
    try {
      const response = await apiService.fetchData("/categories/GetCategoriesByType",{"type":"1"},true);
      setData(response.data);
      console.log(response.data, "Response Data Category");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await apiService.postData("/misc/all-users",{},{},true);
      setUser(response.data.data);
      console.log(response.data.data, "Response Data User");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Dynamically generate fields from editInitialValues
  const fields = useMemo(() => {
    return Object.keys(editInitialValues).map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      name: key,
    }));
  }, [editInitialValues]);

  const handleSubmit = (values: any) => {
    console.log("Updating with:", values);
    // Call API to update product here if needed
    apiService.postData(
      "Product/update-product/v2" , values,{'Content-Type': 'application/json'},true)
  };

  const handleDelete = (id: string) => {
    setIsPopup(true);
    setSelectedId(id);
  };

  const handleDeleteConfirmed = async () => {
    alert("Delete API is commented for ID: " + selectedId);
    // Uncomment and implement API call if needed
    if (!selectedId) return;
    const response = await apiService.postData(
      "Product/delete-product/" + selectedId,
      {},{},
      true
    );
    if (response.isSuccess) {
      console.log("Deleted Successfully", response);
    } else {
      console.log("Delete Failed", response?.message || "Unknown Error");
    }
  };
  const handleEdit = (id: string, data: any) => {
    setIsModal(true);
    console.log("Edit ID:", id, "Data:", data);
  
    const flatInitial = {
      guid: data.guid,
      name: data.name || "",
      price: data.price || "",
      description: data.description || "",
      shortDescription: data.shortDescription || "",
      category_id: data.category_id || "",
      condition: data.condition || "",
      inventory: data.inventory || "",
      sku: data.sku || "",
      policy: data.policy || "",
      shippingType: data.shippingType || "",
      packetWeightLBS: data.packetWeightLBS || "",
      packetWeightOz: data.packetWeightOz || "",
      packetLength: data.packetLength || "",
      packetWidth: data.packetWidth || "",
      packetHeight: data.packetHeight || "",
      weightType: data.weightType || 1,
      longitude: data.longitude || "",
      latitude: data.latitude || "",
      zip: data.zip || "",
      zipCode: data.zipCode || "",
      city: data.city || "",
      state: data.state || "",
      street1: data.street1 || "",
  
      // ✅ Add this line to fix the missing images
      // images: data.images || [],
    };
  
    setEditInitialValues(flatInitial);
  };
  


  const onView = (id: string) => {
    return `/product-view/${id}`;
  };

  if (useAuthRedirect()) return null;


  return (
    <div>
      <Popup
        isOpen={isPopup}
        setIsOpen={setIsPopup}
        title="Are you sure you want to delete?"
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDeleteConfirmed}
      />

      <h2 className="font-bold pb-4 mb-1">Products</h2>

      <UserListV3
        apiEndpoint="product/search-products"
        columns={[
          { key: "images", label: "Image" },
          { key: "name", label: "Name" },
          { key: "price", label: "Price",
             render: (value: number) => `$${value.toFixed(2)}`
           },
          { key: "discount", label: "Discount %",
             render: (value: number) => `%${value.toFixed(2)}`
           },
          { key: "condition", label: "Condition" },
          { key: "sku", label: "Sku" },
          { key: "inventory", label: "Inventory" },
          { key: "shippingType", label: "Shipping Type" 
            , 
            render: (status: number) => {
               return getTypeLabel(status, {
                 3: "Shipping",
                 2: "Local",
               });
             }
          },
         
          { key: "status", label: "Status" 

            , 
                           render: (status: number) => {
                              return getTypeLabel(status, {
                                1: "Pending",
                                2: "Approved",
                                3: "Rejected",
                              });
                            }
          },
        ]}
        itemsPerPage={10}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={onView}
        filterss={[
          {
            name: "category",
            type: "select",
            options: [
              ...(data?.map((category) => ({
                key: category.name,
                value: category.id,
              
              })) || []),

            ],
          },
          {
            name: "emails",
            type: "select",
            options: [
              ...(user?.map((users) => ({
                key: users.email,
                value: users.id,
              
              })) || []),

            ],
          },
          {
            name: "name",
            type: "text",
            placeholder: "Name",
          },
     
          {
            name: "deleverytype",
            type: "select",
            options: [
              { key: "Shipping", value: "1" },
              { key: "local", value: "2" },
            ],
          },
     
          {
            name: "condition",
            type: "select",
            options: [
              { key: "For Parts", value: "For_Parts" },
              { key: "New", value: "New" },
              { key: "Open Box", value: "Open_Box" },
              { key: "Others", value: "Others" },
              { key: "Renewed", value: "Renewed" },
              { key: "Used", value: "Used" },
            ],
          },
     
          {
            name: "status",
            type: "select",
            options: [
              { key: "Pending", value: "1" },
              { key: "Approved", value: "2" },
              { key: "Rejected", value: "3" },
            ],
          },
          {
            name: "location",
            type: "text",
            placeholder: "Location Search",
          },
          {
            name: "zip",
            type: "text",
            placeholder: "Zip Code",
          },
        ]}
      />

      <ModalForm
        isModalOpen={isModal}
        setisModalOpen={setIsModal}
        initialValues={editInitialValues}
        fields={fields}
        onSubmit={handleSubmit}
        title="Update Product"
        withImageUpload={true}
      />
    </div>
  );
};

export default Page;
