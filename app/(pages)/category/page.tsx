"use client";

import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {Toaster,toast} from 'sonner'
import { CategorySchema } from "@/utilities/schema";
import CommonListV2 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV2";
import { apiService, askMessagesService, productService } from "@/apies/Services/UserService";
import Dropdown from "@/components/(AdminPanel)/(Fields)/inputs/Dropdown/Dropdown";
import Popup from "@/components/(AdminPanel)/popup";


interface IUserFormValues {
  id?:string;
  name: string;
  sort?: number;
  description: string;
  type: number;
  parent_id?: number;
}

interface User {
  id: string;
  name: string;
  sort: number;
  type: number;
  description: string;
  parent_id: number;
}



const Page =  () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
const [onEditing,setOnEditing]=useState(false)
const [isEditing,setIsEditing]=useState(false)
const [selectedId,setSelectedId]=useState<string|null>(null)
const [isOpen,setIsOpen]=useState(false)
const [data, setData] = useState<User[]>([]);
const [selectedType, setSelectedType] = useState<number>(1);

const [initialValues,setInitialValues]=useState<IUserFormValues>({
  name:'',
  description:'',
  type:1,
  sort:0,
  parent_id:0,
})

//  for update 
  const [productList, setProductList] = useState<any[]>([]); // Shared state for products


  // Callback function to handle updates
  const handleProductUpdate = (newProduct: any) => {

  
    setProductList((prev)=>[...prev,newProduct]);
    setRefreshKey((prev)=>prev + 1);
  
  };

//  for update 

// alert(selectedType)

  useEffect(() => {
      fetchData(selectedType);
  
    
  }, [selectedType]);

  const fetchData = async (type: number) => {
    setLoading(true);
    try {
      const response = await apiService.fetchData("/categories/GetCategoriesByType",{"type":type},true);
      setData(response.data);
      console.log(response.data, "Response Data Category");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };


 


  const handleView=(id:string)=> `/categoryAttribute/${id}`

 
  const handleDeleteConfirmation = async (id: string) => {
    setSelectedId(id); 
    setIsOpen(true);   
  };

  const handleDelete= async()=>{
  // alert(selectedId)
    try {
      if (!selectedId) return;
      const response= await askMessagesService.deleteMessage("https://flexemart.com/api/categories", selectedId); 
   
      if(response.isSuccess){
        toast.error("Successfully Deleted")
     handleProductUpdate(response); 
     
      }
   
     } catch (error) {
       console.error("Error deleting product:", error);
     }
  }

  
  const handleEdit=(id:string,updatedData:User)=>{
    setOnEditing(true)
    setInitialValues({
      description:updatedData.description,
      name:updatedData.name,
      type:updatedData.type,
      sort:updatedData.sort,
      id:updatedData.id,
      parent_id:updatedData.parent_id
    })
    setIsEditing(true)
  }

  // Form submission handler
  const handleSubmit = async (values: IUserFormValues ,{ resetForm }: { resetForm: () => void }) => {
    
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    
    try {

      if(isEditing){

        const response = await apiService.putData(
          "categories", values,{},true
        );
     
                if (response.isSuccess) {
                  // setIsEditing(false)
                  
                  toast.success("Category has been Updated")
                  handleProductUpdate(response.data); 
                  resetForm(); 
                  setIsEditing(false); 
                  setInitialValues({
                    name:'',
                    description:'',
                    type:1,
                    sort:0,
                  })
                }
            setSuccessMessage("User updated successfully!");
      }
      else{
        const response = await apiService.postData(
          "categories", values,{},true
        );

   

          if (response.isSuccess) {
            // setSuccessMessage("Product updated successfully!");
            toast.success("Category has been Added")
            handleProductUpdate(response.data); 
            resetForm(); 
          }
      setSuccessMessage("User updated successfully!");
    }

    } catch (err) {
      
      setErrorMessage( "An error occurred while updating the user.");
    } 
    
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
            <Toaster />
      <Popup isOpen={isOpen} setIsOpen={setIsOpen} title="Are you Sure YOu Want Delete" cancelText="Cancel" confirmText="Delete" onConfirm={handleDelete} />
      <h2 className="text-xl font-bold mb-4">Category</h2>
    <div className="w-full flex justify-between flex-wrap">

      <div className="w-1/3">

      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={CategorySchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting,setFieldValue ,values}) => (
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
              sort
              </label>
              <Field
          
                type="text"
                id="sort"
                name="sort"
                className="border rounded w-full p-2"
              />
              </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="description" className="block font-medium">
              Description 
              </label>
              <Field
                type="text"
                id="service"
                name="description"
                className="border rounded w-full p-2"
              />
           
            </div>


            {/* Email Field */}
        
            <div className="mb-4">
                
                  <Dropdown
                    label="Value Type"
                    options={[
                      { value: "1", label: "Product" },
                      { value: "2", label: "Service" },
               
                    ]}
                    selectedValue={values.type}
                    // onChange={(value) => setFieldValue("type", value)}
                    onChange={(value) => {
                      setFieldValue("type", value); // Update Formik value
                      setSelectedType(Number(value)); // Update selectedType state
                    }}
                    Setwidth="w-full"
                  />
                  <ErrorMessage name="type" component="div" className="text-red-600 text-sm mt-1" />
                </div>
       


 {/* Dropdown Field for Categories */}
 <div className="mb-4">
      
        <Dropdown
          label="Category"
          options={data.map((category) => ({
            value: category.id, // id will be used as the value
            label: category.name, // name will be displayed
          }))}
          selectedValue={values.parent_id} // Assuming 'type' is the value you want to set
          onChange={(value) => setFieldValue("parent_id", value)} // Set field value to the selected category id
          Setwidth="w-full"
        />
        <ErrorMessage name="type" component="div" className="text-red-600 text-sm mt-1" />
      </div>
       

            {/* Submit Button */}
            <div className="mt-4">

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {loading ? "Uploading...": isEditing? "Update Category" : "Create Category"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
<div className="w-[60%]">




<CommonListV2<User> key={refreshKey} apiEndpoint={`/categories/getAllCategories`} columns={[
 
 { key: "name", label: "Name" },
 { key: "sort", label: "sort" },
 { key: "type", label: "type" },
 { key: "description", label: "description" },
]} 
onView={handleView}
onEdit={handleEdit}
onDelete={handleDeleteConfirmation}
/>
</div>


    </div>

    </div>

  );
};

export default Page;
