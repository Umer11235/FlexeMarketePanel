import * as Yup from "yup";


export interface UserFormValues {
    messsage: string;
  
  }


  
  // Initial form values
 export const initialValues: UserFormValues = {
    messsage: "",
  };

  // Validation schema
  export const validationSchema = Yup.object({
    messsage: Yup.string().required("Required"),

  });


