"use client";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import CommonList from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonList";
import {  initialValues, UserFormValues, validationSchema } from "./IaskMsg";
import { askMessagesService } from "@/apies/Services/UserService";



const Page =  () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productList, setProductList] = useState<any[]>([]);
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



  // Form submission handler
  const handleSubmit = async (values: UserFormValues) => {
    console.log(values)
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");



    try {

      const response= await askMessagesService.sendMessage("/AskMessages",values)
 
          if (response.isSuccess) {
            setSuccessMessage("Product updated successfully!");
            handleProductUpdate(response.data); // Notify UserList
          }
      setSuccessMessage("User updated successfully!");
    } catch (err) {
      
      setErrorMessage( "An error occurred while updating the user.");
    } 
    
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      <h2 className="text-xl font-bold mb-4">Ask Message</h2>
    <div className="w-full flex justify-between flex-wrap">

      <div className="w-1/3">

      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

      <Formik
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
                type="text"
                id="messsage"
                name="messsage"
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
                {loading ? "Uploading..." : "Create Types"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
<div className="w-[60%]">



<CommonList
  apiEndpoint="/AskMessages/getMessages"
  deleteApie="/AskMessages"
  columns={[
    { key: "messsage", label: "Messsage" },
  
  ]}
  sharedList={productList}
  onListChange={setProductList}

/>


</div>


    </div>

    </div>

  );
};

export default Page;
