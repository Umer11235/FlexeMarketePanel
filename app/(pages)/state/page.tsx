"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import CommonList from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonList";

interface UserFormValues {
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



  // Initial form values
  const initialValues: UserFormValues = {
    name: "",
    code: "",
    tax:1,

  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    code: Yup.string().required("Required"),

  });

  // Form submission handler
  const handleSubmit = async (values: UserFormValues) => {
    console.log(values)
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");



    try {
      const response = await axios.post(`https://flexemart.com/api/State`, values
    ,    
            {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiY2Y4ZjMyMzAtNjA1ZC00ZmVkLWI4N2EtYzE2MzllNGYwMWQzIiwiZW1haWwiOiJhaS5haHNhbmlzbWFpbEBnbWFpbC5jb20iLCJuYW1lIjoiRmxleGVtYXJrZXQiLCJwcm9maWxlIjoiMTczMjMwNDM1MzkzNl8xNi5qcGciLCJpc1ZlbmRvciI6IlRydWUiLCJpc1ZlcmlmaWVkIjoiRmFsc2UiLCJpc1Bob25lQ29uZmlybSI6IlRydWUiLCJpc0VtYWlsQ29uZmlybSI6IlRydWUiLCJSb2xlQ2xhaW0iOlsiSGFzUm9sZUFkZCIsIkhhc1JvbGVEZWxldGUiLCJIYXNSb2xlRWRpdCIsIkhhc1JvbGVWaWV3Il0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjozMzI5MjEzNTY2NSwiaXNzIjoiaHR0cHM6Ly9mbGV4ZW1hcnQuY29tLyIsImF1ZCI6Imh0dHBzOi8vZmxleGVtYXJrZXQuY29tLyJ9.tU6CsPZZ9P2rP8FP3Z-XUEqkHNUcxfzOKDbIyWfKbzE",
              "Content-Type": "application/json",
            },
          });

          if (response.data.isSuccess) {
            setSuccessMessage("Product updated successfully!");
            handleProductUpdate(response.data.data); // Notify UserList
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

      <h2 className="text-xl font-bold mb-4">State</h2>
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
              name
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
              <label htmlFor="code" className="block font-medium">
              Code

              </label>
              <Field
                type="text"
                id="code"
                name="code"
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
                {loading ? "Uploading..." : "Create Types"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
<div className="w-[60%]">



<CommonList
  apiEndpoint="/State/getState"
  columns={[
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
  
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
