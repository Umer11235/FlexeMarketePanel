'use client';

import userService, { apiService } from "@/apies/Services/UserService";
import UserListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/FilterListV3";
import Popup from "@/components/(AdminPanel)/popup";
import ModalForm from "@/components/(pagesComponent)/modalForm";
import { useAuthRedirect } from "@/utilities/Authentication";
import { useMemo, useState } from "react";

const Page = () => {


  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModal, setIsModal] = useState(false);
  const [editInitialValues, setEditInitialValues] = useState({});

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
          { key: "price", label: "Price" },
          { key: "discount", label: "Discount %" },
          { key: "condition", label: "Condition" },
          { key: "sku", label: "Sku" },
          { key: "inventory", label: "Inventory" },
          { key: "shippingType", label: "Shipping Type" },
          { key: "status", label: "Status" },
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
              { key: "Electronics", value: "320" },
              { key: "Bluetooth", value: "321" },
              { key: "Smartwatches", value: "353" },
            ],
          },
          {
            name: "name",
            type: "text",
            placeholder: "Name",
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
