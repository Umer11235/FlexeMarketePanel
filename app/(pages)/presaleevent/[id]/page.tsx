"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

interface UserFormValues {
  name: string;
  email: string;
  role: string;
}




// const Page = ({ userId }: { userId: string }) => {
const Page =  ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
console.log(params.userId)
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Initial form values
  const initialValues: UserFormValues = {
    name: "",
    email: "",
    role: "",
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    role: Yup.string().required("Role is required"),
  });

  // Form submission handler
  const handleSubmit = async (values: UserFormValues) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.put(`/api/users/${userId}`, values);
      setSuccessMessage("User updated successfully!");
    } catch (err) {
      
      setErrorMessage( "An error occurred while updating the user.");
    } 
    
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-2/5 m-auto">
      <h2 className="text-xl font-bold mb-4">Update User</h2>

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

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="border rounded w-full p-2"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* Role Field */}
            <div className="mb-4">
              <label htmlFor="role" className="block font-medium">
                Role
              </label>
              <Field
                as="select"
                id="role"
                name="role"
                className="border rounded w-full p-2"
              >
                <option value="" label="Select role" />
                <option value="admin" label="Admin" />
                <option value="user" label="User" />
              </Field>
              <ErrorMessage
                name="role"
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
                {loading ? "Updating..." : "Update User"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Page;
