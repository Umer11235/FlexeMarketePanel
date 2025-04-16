"use client";

import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {Toaster,toast} from 'sonner'
import {  PromotionZipSchema } from "@/utilities/schema";
import { apiService, askMessagesService, productService } from "@/apies/Services/UserService";
import Popup from "@/components/(AdminPanel)/popup";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";
import { useAuthRedirect } from "@/utilities/Authentication";



interface User {
  id: string;
  zip: string;
  guid: string;

}



const Page =  () => {

  if (useAuthRedirect()) return null;

  

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

const [initialValues,setInitialValues]=useState<User>({
  id: "",
  zip: "",
  guid: "",
})

//  for update 
  // const [productList, setProductList] = useState<any[]>([]); // Shared state for products


//  for update 

// alert(selectedType)

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


 
  const handleDeleteConfirmation = async (id: string) => {
    setSelectedId(id); 
    setIsOpen(true);   
  };

  const handleDelete= async()=>{
  // alert(selectedId)
    try {
      if (!selectedId) return;
      const response= await askMessagesService.deleteMessage("/PromotionZip", selectedId); 
   
      if(response.isSuccess){
        setRefreshKey((prev)=>prev + 1);
        setData(data.filter((Item)=>Item.id !== selectedId))
        toast.error("Successfully Deleted")
     
      }
   
     } catch (error) {
       console.error("Error deleting product:", error);
     }
  }

  
  const handleEdit=(id:string,updatedData:User)=>{
    setOnEditing(true)
    setInitialValues({
      guid:updatedData.guid,
      zip:updatedData.zip,
      id:updatedData.id,
 
    })
    setIsEditing(true)
  }

  // Form submission handler
  const handleSubmit = async (values: User) => {
    
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    
    try {

      if(isEditing){
        const response = await apiService.putData(`http://localhost:7078/api/PromotionZip`,  values,{},true );
      
                if (response.isSuccess) {
                  // setIsEditing(false)
                  setData((prev)=>[...prev,response.data])

                  toast.success("Zip has been Updated")
                }
            setSuccessMessage("Zip updated successfully!");
      }
      else{

        const response = await apiService.postData(`http://localhost:5145/api/PromotionZip`,  values,{},true );

          if (response.isSuccess) {
setData((prev)=>[...prev,response.data])
            toast.success("Zip has been Added")
          }
      setSuccessMessage("Zip updated successfully!");
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
      <h2 className="text-xl font-bold mb-4">Promotion Zip</h2>
    <div className="w-full flex justify-between flex-wrap">

      <div className="w-1/3">

      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={PromotionZipSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting,setFieldValue ,values}) => (
          <Form>
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="zip" className="block font-medium">
              Zip
              </label>
              <Field
          
                type="text"
                id="name"
                name="zip"
                className="border rounded w-full p-2"
              />

              <ErrorMessage
                name="name"
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
                {loading ? "Uploading...": isEditing? "Update Zip" : "Create Zip"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
<div className="w-[60%]">




<CommonListV3<User> key={refreshKey} apiEndpoint={``} sharedList={data} columns={[
 { key: "zip", label: "zip" },
]} 
onEdit={handleEdit}
onDelete={handleDeleteConfirmation}
/>
</div>


    </div>

    </div>

  );
};

export default Page;
