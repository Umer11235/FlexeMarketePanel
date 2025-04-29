"use client";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import CommonList from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonList";
import {  initialValues, UserFormValues, validationSchema } from "./IaskMsg";
import { apiService, askMessagesService } from "@/apies/Services/UserService";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";
import { toast, Toaster } from "sonner";
import { useAuthRedirect } from "@/utilities/Authentication";
import Popup from "@/components/(AdminPanel)/popup";



const Page =  () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productList, setProductList] = useState<any[]>([]);
  const [onEditing,setOnEditing]=useState(false)
const [isEditing,setIsEditing]=useState(false)
const [selectedId, setSelectedId] = useState<string | null>(null);
// const [isOpen, setIsOpen] = useState(false);
const [isPopup, setIsPopup] = useState(false);

const [initialValues, setInitialValues] = useState<UserFormValues>({
messsage:'',
});
//  for update 

  // Callback function to handle updates
  const handleProductUpdate = (newProduct: any) => {
    setProductList((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === newProduct.id);
      if (existingIndex !== -1) {
        const updatedList = [...prev];
        updatedList[existingIndex] = newProduct;
        return updatedList;
      }
      return [...prev, newProduct];
    });
  };

//  for update 


 
const handleDeleteConfirmation = async (id: string) => {
  setSelectedId(id); 
  // setIsOpen(true);   
  setIsPopup(true);
};

const handleDelete= async()=>{
// alert(selectedId)
  try {
    if (!selectedId) return;
    const response= await askMessagesService.deleteMessage("AskMessages", selectedId); 
 
    if(response.isSuccess){
      toast.error("Successfully Deleted")
   handleProductUpdate(response); 
   
    }
 
   } catch (error) {
     console.error("Error deleting product:", error);
   }
}


const handleEdit=(id:string,updatedData:UserFormValues)=>{
  setOnEditing(true)
  setInitialValues({
    id:updatedData.id,
    messsage:updatedData.messsage,
  })
  setIsEditing(true)
}

// Form submission handler
const handleSubmit = async (values: UserFormValues ,{ resetForm }: { resetForm: () => void }) => {
  
  setLoading(true);
  setSuccessMessage("");
  setErrorMessage("");

  
  try {

    if(isEditing){

      const response = await apiService.putData(
        "AskMessages", values,{},true
      );
   
              if (response.isSuccess) {
                // setIsEditing(false)
                
                toast.success("Category has been Updated")
                handleProductUpdate(response.data); 
                resetForm(); 
                setIsEditing(false); 
                setInitialValues({
                  id: "",
                  messsage: "",
                })
              }
          setSuccessMessage("User updated successfully!");
    }
    else{
      
     
      const response = await apiService.postData(          
        "AskMessages", values,{},true
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
   <Popup
        isOpen={isPopup}
        setIsOpen={setIsPopup}
        title="Are you Sure YOu Want Delete"
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDelete}
      />

      <Toaster />
      <h2 className="text-xl font-bold mb-4">Ask Message</h2>
    <div className="w-full flex justify-between flex-wrap">

      <div className="w-1/3">

      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

      <Formik
      enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="messsage" className="block font-medium">
              Message
              </label>
              <Field
              as="textarea"
                type="text"
                id="messsage"
                name="messsage"
                placeholder="Enter Message "
                className="border rounded w-full p-2"
              />
              <ErrorMessage
                name="messsage"
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
                {loading ? "Uploading...": isEditing? "Update Message" : "Create Message"}

              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
<div className="w-[60%]">



<CommonListV3
  apiEndpoint="/AskMessages/getMessages"
  deleteApi="/AskMessages"
  columns={[
    { key: "messsage", label: "Messsage" },
  
  ]}
  sharedList={productList}
  onListChange={setProductList}
  onEdit={handleEdit}
  onDelete={handleDeleteConfirmation}

/>


</div>


    </div>

    </div>

  );
};

export default Page;
