import userService, { apiService } from "@/apies/Services/UserService";
import CommonListV2 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV2";
import ModalV2 from "@/components/(AdminPanel)/modals/modalV2";
import Popup from "@/components/(AdminPanel)/popup";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import * as Yup from "yup";
// Top pe import me add karo
import React from "react";
import Dropdown from "@/components/(AdminPanel)/(Fields)/inputs/Dropdown/Dropdown";

interface IRecommendProps {
  id?: string;
  type: number;
  productId?: string;
}

const validationSchema = Yup.object({
  type: Yup.number().required("Type is required"),
});

const AssignTypeOfRecommendation = ({ isModalOpen, guid,setisModalOpen }: { guid: number; isModalOpen: boolean ,setisModalOpen?:(open:boolean)=>void; }) => {
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing,setIsEditing]=useState(false)
  const [selectedId,setSelectedId]=useState<string|null>(null)
const [isOpen,setIsOpen]=useState(false)
const [selectedType, setSelectedType] = useState<number>(0);


const [initialValues,setInitialValues]=useState<IRecommendProps>({
  id: "0",
  type: 0,
  productId: "0",
});
 



useEffect(() => {
  fetchData();
}, [guid]);

const fetchData = async () => {
  try {
      const response = await apiService.fetchData("RecommendedProducts/productId/"+guid,{},true);
      console.log("Response from fetchData:", response);
      if (response.isSuccess) {
        setIsEditing(true);
        setInitialValues({
          type:response.data.type ,
          id: response.data.id ?? "0",
        });
       
      } else {
             setIsEditing(false);
              setInitialValues({
            type: 0,
        });
        toast.error("Failed to fetch products");
      }
  } catch (error) {

          setIsEditing(false);
              setInitialValues({
            type: 0,
        });
    console.error("Error fetching products:", error); 
    toast.error("Error fetching products");
  }
};



//  for update 
const [productList, setProductList] = useState<any[]>([]); // Shared state for products

// Callback function to handle updates
const handleProductUpdate = (newProduct: any) => {


  setProductList((prev) => [...prev, newProduct]);
  setRefreshKey((prev) => prev + 1); 
console.log(productList)
};


const HandleEdit = (idd: string, updatedData: IRecommendProps) => {

  setInitialValues({
    id: idd,
    type: updatedData.type,
    productId: updatedData.productId ?? "0" ,
  });
  setIsEditing(true);

  
}
  const handleSubmit = async (values:IRecommendProps, { resetForm }: any) => {
    // values.ProductId=guid;
   console.log("Form submitted with values recom:", values);
    try {
if(isEditing){

const payload = {
         Id: values.id,
        Type: values.type,
        ProductId: guid,
      };

  const response= await apiService.putData("RecommendedProducts", payload);
  if (response.isSuccess) {
    toast.success("Values Updated successfully!");
  
    setSuccessMessage("Values updated successfully!");
    handleProductUpdate(response.data.data); // Notify UserList
    resetForm();
    console.log(response)
   }
}
else{
      const payload1 = {
         Id: values.id,
        Type: values.type,
        ProductId: guid,
      };


      const response= await apiService.postData("RecommendedProducts", payload1);
       if (response.isSuccess) {
        toast.success("Values Assigned successfully!");
      
        setSuccessMessage("Product updated successfully!");
        handleProductUpdate(response.data.data); // Notify UserList
        resetForm();
        console.log(response)
       }
}

    } catch (error) {
      console.error("Error submitting form", error);
    }
  };


  const handleDeleteConfirmation = async (id: string) => {
    setSelectedId(id); 
    setIsOpen(true);   
  };

  const handleDelete = async () => {

    try {
      if (!selectedId) return;
     const response= await userService.deleteUser("RecommendedProducts/", selectedId);
     
     if(response.isSuccess){
       setIsEditing(false)

       toast.success("Successfully Deleted")
       handleProductUpdate(response.data);
   
      }
   
     } catch (error) {
       console.error("Error deleting product:", error);
     }
  
  };

  return (
    <ModalV2 isOpen={isModalOpen} onClose={() => setisModalOpen?.(false)} title="Set Recommendation Type">
    <Popup isOpen={isOpen} setIsOpen={setIsOpen} title="Are you Sure YOu Want Delete" cancelText="Cancel" confirmText="Delete" onConfirm={handleDelete} />

       <Toaster />

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting,setFieldValue ,values }) => (
       <Form className="space-y-4">


  <div>

{/* Category Type Dropdown */}
<div className="mb-4">
  <Dropdown
    label="Type"
    options={[
      { value: "1", label: "Cell Phones" },
      { value: "2", label: "Accessories" },
      { value: "3", label: "Health & Beauty" },
    ]}
    selectedValue={values.type}
    onChange={(value) => {
      setFieldValue("type", Number(value)); // Update Formik state
      setSelectedType(Number(value));  
    // Update local state
    }}
    Setwidth="w-full"
  />
  <ErrorMessage
    name="type"
    component="div"
    className="text-red-600 text-sm mt-1"
  />
</div>

    <ErrorMessage name="recommendationType" component="div" className="text-red-600 text-sm mt-1" />
  </div>

  {!isEditing && (
    <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      {isSubmitting ? "Saving..." : "Set"}
    </button>
  )}

  {/* Remove or Update buttons sirf edit mode me dikhayein */}
  {isEditing && (
    <div className="flex items-center justify-between">
      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {isSubmitting ? "Updating..." : "Update Value"}
      </button>
      <button type="button" onClick={() => handleDeleteConfirmation(initialValues.id??"")} className="text-red-600 underline">
        Remove
      </button>
    </div>
  )}
</Form>

        )}
      </Formik>
  
    </ModalV2>
  );
};

export default AssignTypeOfRecommendation;
