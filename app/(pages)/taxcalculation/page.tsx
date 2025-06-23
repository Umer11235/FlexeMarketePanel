"use client";

import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {Toaster,toast} from 'sonner'
import { apiService, askMessagesService } from "@/apies/Services/UserService";
import Popup from "@/components/(AdminPanel)/popup";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";
import { useAuthRedirect } from "@/utilities/Authentication";
import * as Yup from 'yup';

interface TaxCalculation {
  id: string;
  zipCode: string;
  country: string;
  city: string;
  state: string;
  taxPercentage: number | null ;
}

const TaxCalculationSchema = Yup.object().shape({
  zipCode: Yup.string().required('Zip Code is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
taxPercentage: Yup.number()
    .nullable()
    .typeError('Must be a number')
    .min(0, 'Minimum 0%')
    .max(100, 'Maximum 100%')
    .test(
      'is-decimal',
      'Max 2 decimal places allowed',
      (value) => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  
  });

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [onEditing, setOnEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<TaxCalculation[]>([]);

  const [initialValues, setInitialValues] = useState<TaxCalculation>({
    id: "",
    zipCode: "",
    country: "",
    city: "",
    state: "",
    taxPercentage: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.fetchData("/TaxCalculation", {}, true);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching tax calculations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = async (id: string) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectedId) return;
      
      
    const response = await apiService.deleteData(
      "/TaxCalculation",
      selectedId,
      true
    );  

    
    toast.success("Successfully Deleted");


      if (response.isSuccess) {
        setRefreshKey((prev) => prev + 1);
        setData(data.filter((item) => item.id !== selectedId));
        toast.success("Successfully Deleted");
      }
    } catch (error) {
      console.error("Error deleting tax calculation:", error);
    }
  };

  const handleEdit = (id: string, updatedData: TaxCalculation) => {
    setSelectedId(id);
    setOnEditing(true);
    setInitialValues({
      id: updatedData.id,
      zipCode: updatedData.zipCode,
      country: updatedData.country,
      city: updatedData.city,
      state: updatedData.state,
      taxPercentage: updatedData.taxPercentage,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (values: TaxCalculation, { resetForm }: { resetForm: () => void }) => {
    setLoading(true);

    try {
      if (isEditing) {
        const response = await apiService.putData(`/TaxCalculation/`+selectedId, values, {}, true);
        
        if (response.isSuccess) {
          setData(data.map(item => item.id === values.id ? response.data : item));
          toast.success("Tax calculation has been Updated");
          resetForm();
          setIsEditing(false);
        }
        setSuccessMessage("Tax calculation updated successfully!");
      } else {

        const payload = {
          zipCode: values.zipCode,
          country: values.country,
          city: values.city,
          state: values.state,
          taxPercentage: values.taxPercentage,
          }; 

        const response = await apiService.postData(`/TaxCalculation`, payload, {}, true);

        if (response.isSuccess) {
          setData((prev) => [...prev, response.data]);
          toast.success("Tax calculation has been Added");
          resetForm();
        }
        setSuccessMessage("Tax calculation added successfully!");
      }
    } catch (err) {
      setErrorMessage("An error occurred while updating the tax calculation.");
    } finally {
      setLoading(false);
    }
  };

  if (useAuthRedirect()) return null;

  return (
    <div className="w-full">
      <Toaster />
      <Popup 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        title="Are you sure you want to delete?" 
        cancelText="Cancel" 
        confirmText="Delete" 
        onConfirm={handleDelete} 
      />
      <h2 className="text-xl font-bold mb-4">Tax Calculations</h2>
      <div className="w-full flex justify-between flex-wrap">
        <div className="w-1/3">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={TaxCalculationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form>
                {/* Zip Code Field */}
                <div className="mb-4">
                  <label htmlFor="zipCode" className="block font-medium">
                    Zip Code
                  </label>
                  <Field
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className="border rounded w-full p-2"
                    placeholder="Enter ZIP code (e.g., 90210)"
                  />
                  <ErrorMessage
                    name="zipCode"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Country Field */}
                <div className="mb-4">
                  <label htmlFor="country" className="block font-medium">
                    Country
                  </label>
                  <Field
                    type="text"
                    id="country"
                    name="country"
                    className="border rounded w-full p-2"
                    placeholder="e.g., United States"
                  />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* City Field */}
                <div className="mb-4">
                  <label htmlFor="city" className="block font-medium">
                    City
                  </label>
                  <Field
                    type="text"
                    id="city"
                    name="city"
                    className="border rounded w-full p-2"
                    placeholder="e.g., Los Angeles"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* State Field */}
                <div className="mb-4">
                  <label htmlFor="state" className="block font-medium">
                    State
                  </label>
                  <Field
                    type="text"
                    id="state"
                    name="state"
                    className="border rounded w-full p-2"
                                        placeholder="e.g., California"

                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Tax Percentage Field */}
                <div className="mb-4">
                  <label htmlFor="taxPercentage" className="block font-medium">
                    Tax Percentage
                  </label>
                <Field
                       type="number"
                       id="taxPercentage"
                       name="taxPercentage"
                       step="0.01" 
                       className="border rounded w-full p-2"
                       placeholder="e.g., 7.25%"

                      />
                  <ErrorMessage
                    name="taxPercentage"
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
                    {loading ? "Processing..." : isEditing ? "Update Tax" : "Add Tax"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="w-[60%]">
          <CommonListV3<TaxCalculation>
            key={refreshKey}
            apiEndpoint={""}
            sharedList={data}
            columns={[
              { key: "zipCode", label: "Zip Code" },
              { key: "country", label: "Country" },
              { key: "city", label: "City" },
              { key: "state", label: "State" },
              { key: "taxPercentage", label: "Tax Percentage" }
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