import userService, { apiService } from "@/apies/Services/UserService";
import CommonListV2 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV2";
import ModalV2 from "@/components/(AdminPanel)/modals/modalV2";
import Popup from "@/components/(AdminPanel)/popup";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import * as Yup from "yup";

interface IAssignAttributeValueProps {
  id: string;
  value: string;
}

const validationSchema = Yup.object({
  value: Yup.string().required("Value is required"),
});

const AssignAttributeValue = ({ isModalOpen, attributeid,setisModalOpen }: { attributeid: string; isModalOpen: boolean ,setisModalOpen?:(open:boolean)=>void; }) => {
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing,setIsEditing]=useState(false)
  const [selectedId,setSelectedId]=useState<string|null>(null)
const [isOpen,setIsOpen]=useState(false)

const [initialValues,setInitialValues]=useState<IAssignAttributeValueProps>({
id:"0",
value:""

});
 


//  for update 
const [productList, setProductList] = useState<any[]>([]); // Shared state for products

// Callback function to handle updates
const handleProductUpdate = (newProduct: any) => {


  setProductList((prev) => [...prev, newProduct]);
  setRefreshKey((prev) => prev + 1); 
console.log(productList)
};


const HandleEdit = (idd: string, updatedData: IAssignAttributeValueProps) => {

  setInitialValues({
    id: idd,
    value: updatedData.value,
  });
  setIsEditing(true);

  
}
  const handleSubmit = async (values: { value: string }, { resetForm }: any) => {
    try {
if(isEditing){

  const response= await apiService.putData("https://flexemart.com/api/CategoryAttributeValues", values);
  if (response.isSuccess) {
    toast.success("Values Updated successfully!");
  
    setSuccessMessage("Values updated successfully!");
    handleProductUpdate(response.data.data); // Notify UserList
    resetForm();
    console.log(response)
   }
}
else{


      const payload = {
        value: values.value,
        categoryAttributeId: attributeid,
      };
      const response= await apiService.postData("https://flexemart.com/api/CategoryAttributeValues", payload);
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
     const response= await userService.deleteUser("https://flexemart.com/api/CategoryAttributeValues/", selectedId);
     
     if(response.isSuccess){
       
       toast.success("Successfully Deleted")
       handleProductUpdate(response.data);
   
      }
   
     } catch (error) {
       console.error("Error deleting product:", error);
     }
  
  };

  return (
    <ModalV2 isOpen={isModalOpen} onClose={() => setisModalOpen?.(false)} title="Add Values Of Attribute">
    <Popup isOpen={isOpen} setIsOpen={setIsOpen} title="Are you Sure YOu Want Delete" cancelText="Cancel" confirmText="Delete" onConfirm={handleDelete} />

       <Toaster />

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="value" className="block font-medium">Value</label>
              <Field type="text" id="value" name="value" className="border rounded w-full p-2" />
              <ErrorMessage name="value" component="div" className="text-red-600 text-sm mt-1" />
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {isSubmitting ? "Saving...": isEditing? "Update Value" : "Save Value"}

            </button>
          </Form>
        )}
      </Formik>
      <CommonListV2<IAssignAttributeValueProps> 
      key={refreshKey}
        apiEndpoint={`/CategoryAttributeValues/attributesValues?id=` + attributeid}
        payload={{ categoryAttributeId: attributeid }}
        columns={[{ key: "value", label: "Value" }]}
         onEdit={HandleEdit}
        onDelete={handleDeleteConfirmation}
      />
    </ModalV2>
  );
};

export default AssignAttributeValue;
