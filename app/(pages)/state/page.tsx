"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";
import { toast, Toaster } from "sonner";
import Popup from "@/components/(AdminPanel)/popup";
import { apiService, askMessagesService } from "@/apies/Services/UserService";
import { metadata } from "@/app/login/layout";

interface UserFormValues {
  id?: string;
  name: string;
  code: string;
  tax: number;

}



// const Page = ({ userId }: { userId: string }) => {
const Page =  ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen,setIsOpen]=useState(false)
  const [onEditing,setOnEditing]=useState(false)
  const [isEditing,setIsEditing]=useState(false)
const [initialValues,setInitialValues]=useState<UserFormValues>({
  name: "",
  code: "",
  tax:1,
})

  const [selectedId,setSelectedId]=useState<string|null>(null)


//  for update 
  const [productList, setProductList] = useState<any[]>([]); // Shared state for products

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




  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    code: Yup.string().required("Required"),

  });

  // Form submission handler
  const handleSubmit = async (values: UserFormValues ,{ resetForm }: { resetForm: () => void }) => {
    
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    
    try {

      if(isEditing){

        const response = await apiService.putData(
          "State", values,{},true
        );
     
                if (response.isSuccess) {
                  // setIsEditing(false)
                  
                  toast.success("Category has been Updated")
                  handleProductUpdate(response.data); 
                  resetForm(); 
                  setIsEditing(false); 
                  setInitialValues({
                    name: "",
                    code: "",
                    tax:1,
                  })
                }
            setSuccessMessage("User updated successfully!");
      }
      else{
    
  

        const response = await apiService.postData(          
          "State", values,{},true
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


  const handleDeleteConfirmation = async (id: string) => {
    setSelectedId(id); 
    setIsOpen(true);   
  };

  const handleDelete= async()=>{
  // alert(selectedId)
    try {
      if (!selectedId) return;
      const response= await askMessagesService.deleteMessage("State", selectedId); 
   
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
      id:id,
      name: updatedData.name,
      code: updatedData.code,
      tax:updatedData.tax,
    })

    setIsEditing(true)
  }


  return (
    <div className="w-full">

<Toaster />
      <Popup isOpen={isOpen} setIsOpen={setIsOpen} title="Are you Sure YOu Want Delete" cancelText="Cancel" confirmText="Delete" onConfirm={handleDelete} />
    

      <h2 className="text-xl font-bold mb-4">State</h2>
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
              Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Enter State Name: Ex : Illinois ,District of Columbia	"
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
              <label htmlFor="code" className="block font-medium">
              Code

              </label>
              <Field
                type="text"
                id="code"
                name="code"
                placeholder="Enter Code Ex : Il,DC,UK"
                className="border rounded w-full p-2"
              />
              <ErrorMessage
                name="code"
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
                {loading ? "Uploading...": isEditing? "Update State" : "Add New State"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
<div className="w-[60%]">



<CommonListV3
  apiEndpoint="/State/getState/v2"
  columns={[
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
  
  ]}
  sharedList={productList}
  onListChange={setProductList}
  onDelete={handleDeleteConfirmation}
  onEdit={handleEdit} 
  filtersPatterns={[
    { name: "name",type:"text" ,  placeholder: "Name" },{ name: "code",type:'text', placeholder: "Code" },
  ]}
/>


</div>


    </div>

    </div>

  );
};

export default Page;
