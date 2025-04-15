import * as Yup from "yup";


 
 // Validation schema
  export const validationSchema = Yup.object({
    profitMargin: Yup.number()
      .required("Profit margin is required")
      .typeError("Profit margin must be a number"),
    afflictionMargin: Yup.number()
      .required("Affliction margin is required")
      .typeError("Affliction margin must be a number"),
  });


  export interface UserFormValues {
    afflictionMargin: string;
    profitMargin: string;
  }