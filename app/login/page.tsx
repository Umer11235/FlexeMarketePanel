"use client"

import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Button from "@/components/(AdminPanel)/(Fields)/inputs/Button/Button";
import Textbox from "@/components/(AdminPanel)/(Fields)/inputs/TextBox/Textbox";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { apiService } from '@/apies/Services/UserService';

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Page = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false); // For form submission
  const [fetching, setFetching] = useState(true); // For initial API loading
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


const initialValues = {
    email: '',
    password: '',
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/'); // already logged in
    }
  }, []);

  const handleSubmit = async (values:any) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      apiService.postData
      const response = await apiService.postData("users/login", values);
    
      if (response && response.isSuccess) {
        console.log("Login successful:", response);
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("token", accessToken); // Persistent storage
        localStorage.setItem("refreshToken", refreshToken); // Store user ID
    
        router.push('/');        

      } else {
        console.error("Authentication failed:", response.msg);
      }
    }
    catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while updating settings."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      <div className=" p-5 flex flex-col gap-5 border-2 m-auto ">
        <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
        <p>Today is a new day. It's your day. You shape it. </p>
        <p>Sign in to start managing your Attendance</p>

        {/* Formik Component */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, errors, touched }) => (
            <Form>
              {/* Email Textbox */}
              <Textbox
                SetWidth="max-w-96 w-full"
                SetMargin="mb-6"
                name="email"
                type="text"
                label="Email"
                onChange={handleChange}
                value={values.email}
              />
              {errors.email && touched.email && (
                <div className="text-red-500">{errors.email}</div>
              )}

              {/* Password Textbox */}
              <Textbox
                SetWidth="max-w-96 w-full"
                SetMargin="mb-6"
                name="password"
                type="password"
                label="Password"
                onChange={handleChange}
                value={values.password}
              />
              {errors.password && touched.password && (
                <div className="text-red-500">{errors.password}</div>
              )}

              <a href="#" className="text-blue-700 flex justify-end">
                Forgot Password? 
              </a>

              {/* Submit Button */}
              <Button width="max-w-96 w-full" disabled={loading}>
                   {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
            
          )}

          
        </Formik>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
{successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      </div>
    </>
  );
}

export default Page;
