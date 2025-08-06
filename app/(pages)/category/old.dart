 // Form submission handler
  // const handleSubmit = async (values: IUserFormValues ,{ resetForm }: { resetForm: () => void }) => {
    
  //   setLoading(true);
  //   setSuccessMessage("");
  //   setErrorMessage("");

    
  //   try {

  //     if(isEditing){

  //       const response = await apiService.putData(
  //         "categories", values,{},true
  //       );
     
  //               if (response.isSuccess) {
  //                 // setIsEditing(false)
                  
  //                 toast.success("Category has been Updated")
  //                 handleProductUpdate(response.data); 
  //                 resetForm(); 
  //                 setIsEditing(false); 
  //                 setInitialValues({
  //                   name:'',
  //                   description:'',
  //                   type:1,
  //                   sort:0,
  //                   imageFile: null,
  //                   previewImage: "",
  //                 })
  //               }
  //           setSuccessMessage("User updated successfully!");
  //     }
  //     else{
  //     //  const formData = new FormData();
    
  //       // 2. Append all category data
  //       // formData.append('name', values.name);
  //       // formData.append('description', values.description); 
  //       // formData.append('type', values.type.toString());
        
  //       // if (values.parent_id) {
  //       //   formData.append('parent_id', values.parent_id.toString()||"null");
  //       // }
        
  //       // 3. Append image file if exists
  //       // if (values) {
  //       //   formData.append('imageFile', values.imageFile as Blob );
  //       // }

  //       const response = await apiService.postData(          
  //         "categories", values,{ },true
  //       );

   

  //         if (response.isSuccess) {
  //           // setSuccessMessage("Product updated successfully!");
  //           console.log(response.data.id, "Response Data Category");

  //      if (values.imageFile) {
  //         const imageFormData = new FormData();
  //         imageFormData.append('file', values.imageFile);
  //         imageFormData.append('category_id',  response.data.id);

  // const response1 = await apiService.postData(          
  //         "/Media/upload-with-category", imageFormData,{
  //            'Content-Type': 'multipart/form-data'
  //         },true
  //       );

  //       console.log(response1, "Response Data Category Media");
  //           alert("Category has been Added 1")

  //     }
  //     alert("Category has been Added 2")
  //           toast.success("Category has been Added")
  //           handleProductUpdate(response.data); 
  //           resetForm(); 
  //         }
  //               alert("Category has been Added 3")

  //     setSuccessMessage("User updated successfully!");
  //   }

  //   } catch (err) {
      
  //     setErrorMessage( "An error occurred while updating the user.");
  //   } 
    
  //   finally {
  //     setLoading(false);
  //   }
  // };