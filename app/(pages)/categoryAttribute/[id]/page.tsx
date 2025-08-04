"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Toaster, toast } from "sonner";
import CommonList from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonList";
import { CategorySchema } from "@/utilities/schema";
import CommonListV2 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV2";
import { apiService, askMessagesService } from "@/apies/Services/UserService";
import { getTypeLabel } from "@/utilities/helpers.ts";
import Dropdown from "@/components/(AdminPanel)/(Fields)/inputs/Dropdown/Dropdown";
import AssignAttributeValue from "@/components/(pagesComponent)/attributeValue/AssignAttributeValue";
import Popup from "@/components/(AdminPanel)/popup";
import { ICategoryAttribute } from "@/utilities/interfaces/Pages_Interfaces";
import Icons from "@/utilities/icons/icons";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attributeId, setAttributeId] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  //  for update
  const [productList, setProductList] = useState<any[]>([]); // Shared state for products
  const [initialValues, setInitialValues] = useState<ICategoryAttribute>({
    id: "",
    name: "",
    placeholder: "",
    type: 0,
    valueType: "",
    categoryId: id,
    markForVariant: false,
    sortOrder: 0, });

  // Callback function to handle updates
  const handleProductUpdate = (newProduct: any) => {
    // setProductList((prev) => {
    //   const existingIndex = prev.findIndex((p) => p.id === newProduct.id);
    //   if (existingIndex !== -1) {
    //     const updatedList = [...prev];
    //     updatedList[existingIndex] = newProduct;
    //     return updatedList;
    //   }
    //   return [...prev, newProduct];
    // });

    setProductList((prev) => [...prev, newProduct]);
    setRefreshKey((prev) => prev + 1);
  };

  //  for update


  const onEdit = (idd: string, updatedData: ICategoryAttribute) => {
    // alert(idd)
    setInitialValues({
      name: updatedData.name,
      placeholder: updatedData.placeholder,
      type: updatedData.type,
      valueType: updatedData.valueType,
      categoryId: id,
      id: idd,
      markForVariant: updatedData.markForVariant,
    });

    setIsEditing(true);
    // alert(id)
  };

  const handleSetValue = (id: string) => {
    setAttributeId(id);
    setIsOpen(true);
  };

  const handleDeleteConfirmation = async (id: string) => {
    setSelectedId(id);
    setIsPopup(true);
  };

  const handleDelete = async () => {
    // alert(id)
    try {
      if (!selectedId) return;
      const response = await askMessagesService.deleteMessage(
        "CategoryAttribute",
        selectedId
      );

      toast.success("Successfully Deleted");

      if (response.isSuccess) {
        handleProductUpdate(response.data);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Form submission handler
  const handleSubmit = async (values: ICategoryAttribute  ,{ resetForm }: { resetForm: () => void }) => {
    values.categoryId = id;
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (isEditing) {
        const response = await apiService.putData(
          "CategoryAttribute", values
        );

        if (response.isSuccess) {
          toast.success("Category has been Updated");
          setSuccessMessage("Product updated successfully!");
          handleProductUpdate(response.data.data); // Notify UserList
          resetForm();
          setIsEditing(false); 
          setInitialValues({
            id: "",
            name: "",
            placeholder: "",
            type: 0,
            valueType: "",
            categoryId: id,
            markForVariant: false,
            sortOrder: 0,
          });
        }
        setSuccessMessage("User updated successfully!");
      } else {
      
        const response = await apiService.postData(
          "CategoryAttribute", values
        );

        if (response.isSuccess) {
          toast.success("Category has been created");
          setSuccessMessage("Product Created successfully!");
          handleProductUpdate(response.data.data); // Notify UserList
          
          resetForm();
        }
        setSuccessMessage("User updated successfully!");
      }
    } catch (err) {
      setErrorMessage("An error occurred while updating the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Popup
        isOpen={isPopup}
        setIsOpen={setIsPopup}
        title="Are you Sure YOu Want Delete"
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDelete}
      />

      <Toaster />
      <h2 className="text-xl font-bold mb-4">Category Attributes</h2>
      <div className="w-full flex justify-between flex-wrap">
        <div className="w-1/3">
          {successMessage && (
            <div className="text-green-600 mb-4">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-600 mb-4">{errorMessage}</div>
          )}

          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={CategorySchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                {/* Name Field */}
                <div className="mb-4">
                  <label htmlFor="name" className="block font-medium">
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Name of Attribute Ex: Model,Size,Battery,Color"
                    className="border rounded w-full p-2"
                  />

                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Name Field */}
                <div className="mb-4">
                  <label htmlFor="name" className="block font-medium">
                    Placholder
                  </label>
                  <Field
                    type="text"
                    id="sort"
                    name="placeholder"
                    placeholder="Enter Placeholder of Attribute Ex: Model,Size,Battery,Color"
                    className="border rounded w-full p-2"
                  />
                  <ErrorMessage
                    name="placeholder"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Name Field */}
                <div className="mb-4">
                  <label htmlFor="sortOrder" className="block font-medium">
                  Sort Order
                  </label>
                  <Field
                    type="text"
                    id="sort"
                    name="sortOrder"
                    className="border rounded w-full p-2"
                  />
                  <ErrorMessage
                    name="sortOrder"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>


                <div className="mb-4 flex items-center gap-2">
      <Field
        type="checkbox"
    id="markForVariant"
    name="markForVariant"
    className="mr-2"
  />
  <label htmlFor="markForVariant" className="font-medium">
    Mark as Variant
  </label>
</div>

                <div className="mb-4">
                  <Dropdown
                    label="Value Type"
                    options={[
                      { value: "1", label: "text" },
                      { value: "2", label: "number" },
                    ]}
                    selectedValue={values.valueType}
                    onChange={(value) => setFieldValue("valueType", value)}
                    Setwidth="w-full"
                  />
                  <ErrorMessage
                    name="valuetype"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="mb-4">
                  <Dropdown
                    label="Select Type"
                    options={[
                      { value: "1", label: "Dropdown" },
                      { value: "2", label: "Checkbox" },
                      { value: "3", label: "Radio Button" },
                      { value: "4", label: "Textbox" },
                    ]}
                    selectedValue={values.type}
                    onChange={(value) => setFieldValue("type", value)}
                    Setwidth="w-full"
                  />
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {loading
                      ? "Uploading..."
                      : isEditing
                        ? "Update Attribute"
                        : "Add Attribute"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          
        </div>
        <div className="w-[60%]">
          <CommonListV3<ICategoryAttribute>
            key={refreshKey}
            apiEndpoint={`/Modified/getAllCategoriesById/v2?id=` + id}
            columns={[
              { key: "name", label: "Name" },
              { key: "markForVariant", label: "Variant"
                ,render: (type: boolean) => {
                  return type?( <span>Available</span>):(<span className="text-red-700  ">Not Available</span>)
                }
               },
              { key: "sortOrder", label: "Order" },
              {
                key: "type",
                label: "Type",
                render: (type: number) => {
                  return getTypeLabel(type, {
                    1: "Dropdown",
                    2: "Checkbox",
                    3: "Radio button",
                    4: "Textbox", });
                              },
                },
              {
                key: "valueType",
                label: "valuetype",
                render: (type: number) =>
                  getTypeLabel(type, { 1: "text", 2: "number" }),
              },
              { key: "placeholder", label: "placeholder" },
            ]}
            // onView={onView}
            onEdit={onEdit}
            onDelete={handleDeleteConfirmation}
            // onSetValue={handleSetValue}

            attributesColumn={{
              header: "Assign Value",
              render: (id: string) => (
                <button
                  onClick={() => handleSetValue(id)}
                  className="text-purple-500 hover:text-purple-700"
                >
                  <Icons icon="update" />
                </button>
              ), 
             }}

  filtersPatterns={[{name:"name",type:"text",placeholder:"Name"},{ name: "type",type:"select", placeholder:"Type",options:[{key:"Dropdown",value:"1"},{key:"Checkbox",value:"2"},{key:"Radio button",value:"3"},{key:"Textbox",value:"4"}]}]}

          />

          <AssignAttributeValue
            attributeid={attributeId}
            isModalOpen={isOpen}
            setisModalOpen={setIsOpen}
          />

          {/* <AssignAttributeValue attributeid={attributeId} isModalOpen={isOpen} setisModalOpen={()=>setIsOpen(false)} /> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
