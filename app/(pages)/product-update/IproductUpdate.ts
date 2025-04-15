import * as Yup from "yup";


export interface UserFormValues {
    type: string;
    service: string;
    deleiveryDays: string;
  }
  
    // Initial form values
 export  const initialValues: UserFormValues = {
      type: "",
      service: "",
      deleiveryDays: "",
    };
  


      // Validation schema
export  const validationSchema = Yup.object({
    type: Yup.string().required("Required"),
    service: Yup.string().required("Required"),
    deleiveryDays: Yup.string().required("Required"),
  });
