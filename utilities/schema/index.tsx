import * as Yup from "yup";
 

// Validation schema

export const CategorySchema = Yup.object({
    name: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    // placeholder: Yup.string().required("Required"),
    // valuetype: Yup.string().required("Required"),

  });


  
export const PromotionZipSchema = Yup.object({
  zip: Yup.string().required("Required"),


});

  
export const GiftPickupSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  pickuplocation: Yup.string().required("Required"),


});
