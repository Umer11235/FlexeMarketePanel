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
import { useAuthRedirect } from "@/utilities/Authentication";
import { getTypeLabel } from "@/utilities/helpers.ts";
import Link from "next/link";
import Icons from "@/utilities/icons/icons";
import Image from "next/image";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";


interface IUserFormValues {
  id?:string;
  name: string;
  sort?: number;
  description: string;
  type: number;
  parent_id?: number;
  imageFile?: File | null; 
  previewImage?: string;
}

interface User {
  id: string;
  name: string;
  sort: number;
  type: number;
  description: string;
  parent_id: number;
  images: string[];
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
        const formData = new FormData();
    
        // 2. Append all category data
        formData.append('name', values.name);
        formData.append('description', values.description); 
        formData.append('type', values.type.toString());
        
        if (values.parent_id) {
          formData.append('parent_id', values.parent_id.toString());
        }
        
        // 3. Append image file if exists
        if (values) {
          formData.append('imageFile', values.imageFile as Blob );
        }

        const response = await apiService.postData(          
          "categories", values,{
            // 'Content-Type': 'multipart/form-data'
          },true
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

  if (useAuthRedirect()) return null;


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
              Title
              </label>
              <Field
          
                type="text"
                id="name"
                name="name"
                placeholder="Category Name Ex : Mobile, Laptop, Electronics, jewelry"
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
              Sort Number
              </label>
              <Field
          
                type="number"
                id="sort"
                name="Sort Number"
                placeholder="Sort Number Ex : 1,2,3"
                className="border rounded w-full p-2"
              />
              </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="description" className="block font-medium">
              Description 
              </label>
              <Field
              as="textarea"
                type="text"
                id="service"
                name="description"
                placeholder="Description Ex : Details about the category"
                className="border rounded w-full p-2"
              />
           
            </div>





{/* Image Upload Field */}

{/* <div className="mb-4">
  <label htmlFor="imageFile" className="block font-medium">
    Category Image
  </label>
  <input
    type="file"
    id="imageFile"
    name="imageFile"
    accept="image/*"
    onChange={(e) => {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        const file = e.currentTarget.files[0];
        setFieldValue("imageFile", file);
        setFieldValue("previewImage", URL.createObjectURL(file));
      }
    }}
    className="border rounded w-full p-2"
  />
  <ErrorMessage
    name="imageFile"
    component="div"
    className="text-red-600 text-sm mt-1"
  />
  

  {values.previewImage && (
    <div className="mt-2">
      <Image
        src={values.previewImage}
        alt="Preview"
        width={100}
        height={100}
        className="w-24 h-24 object-cover rounded"
      />
    </div>
  )}
</div> */}



            {/* Email Field */}
        
            <div className="mb-4">
                
                  <Dropdown
                    label=" Category For"
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
          label="Select Parent Category"
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




<CommonListV3<User> key={refreshKey}
 apiEndpoint={`/categories/getAllCategories/v2`} 
 columns={[
  { 
    key: "images", 
    label: "Images",
    render: (_: any, item: any) => (
      <div className="flex gap-2">
        {item.images?.map((img: any, index: number) => (
          <Image
          key={index}
          src={`https://flexemart.com/uploads/${img.name}`}
          alt={img.name}
          width={40}
          height={40}
          className="w-16 h-16 object-cover  rounded"
        />
        ))}
      </div>
    )
  },
  { key: "name", label: "Name" },
  { key: "sort", label: "Sort Number" },
  { 
    key: "type", 
    label: "type",
    render: (type: number) => {
      return getTypeLabel(type, {
        1: "Product",
        2: "Service",
      });
    }
  },
  { key: "description", label: "description" },
]} 
onEdit={handleEdit}
onDelete={handleDeleteConfirmation}
attributesColumn={{
  header: "Attributes",
  render: (id: string) => (
    <Link href={`/categoryAttribute/${id}`} className="text-blue-500">
      <Icons icon="link" />
    </Link>
  ),
}}
filtersPatterns={[{name:"name",type:"text",placeholder:"Search By Name"},
{ name: "type", type: "select", options: [{ key: "Product", value: 1 }, { key: "Service", value: 2 }] }]}
/>

</div>


    </div>

    </div>

  );
};

export default Page;
