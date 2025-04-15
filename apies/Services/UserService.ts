import { headers } from "next/headers";
import apiClient from "../api";


const userService = {

  fetchUsers: async (page: number, pageSize: number, action: string,api:string,additionalPayloads:any={}) => {
   
    const payload:any={
  page,
  pageSize
    }
   
    if(additionalPayloads && Object.keys(additionalPayloads).length>0){
Object.assign(payload,additionalPayloads);
    }

    // const response = await apiClient.post(api, {
    //   page,
    //   pageSize,
    // });
    try {
    const response = await apiClient.post(api,payload);

    if (response.data.isSuccess) {
      const { data } = response.data;
      const count = data.count || 0;

  


      if (['products', 'orders', 'requested', 'users'].includes(action)) {
         localStorage.setItem(action, count.toString());
    }
    return data;
  }
}

  catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");}

  

    // throw new Error(response.data.message || 'Failed to fetch users');
  },

  // https://flexemart.com/api/misc/delete-user/
    deleteUser: async (api:string,id: string) => {

      const response = await apiClient.delete(`${api}${id}`);
       if (response.data.isSuccess) {
        return response.data;
    }
    throw new Error(response.data.message || 'Failed to delete user');
  },



};



const productService = {


  
  fetchProducts: async ( action: string,api:string,payload:any={}) => {
    const response = await apiClient.post(api,payload, {
      headers: {
        Authorization: `Bearer YOUR_TOKEN_HERE`,
      },});

    if (response.data.isSuccess) {
      const { data } = response.data;
      const count = data.count || 0;

  
      return data;
    }

    throw new Error(response.data.message || 'Failed to fetch Products');
  },

}





const askMessagesService = {
  sendMessage: async (api:string,values: Record<string, any>) => {
 
    try {
      const response = await apiClient.post(api,values);

      if (response.data && response.data.isSuccess) {
        return response.data;
      }

      throw new Error(response.data?.message || "Failed to send message");
    } catch (error: any) {

      throw new Error(error.response?.data?.message || error.message || "An error occurred");
    }
  },

  deleteMessage: async (api:string,id:string) => {
    try {
      const response = await apiClient.delete(`${api}/${id}`);

      if (response.data && response.data.isSuccess) {
        return response.data;
      }

      throw new Error(response.data?.message || "Failed to send message");
    } catch (error: any) {

      throw new Error(error.response?.data?.message || error.message || "An error occurred");
    }
  },
};



///for post and flexible api 
const apiService = {


fetchData:async (api:string, params: Record<string,any>={}, useAuth:boolean=false )=>{
try {
  const headers:Record<string,string>={};
  if(useAuth){
    headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiY2Y4ZjMyMzAtNjA1ZC00ZmVkLWI4N2EtYzE2MzllNGYwMWQzIiwiZW1haWwiOiJhaS5haHNhbmlzbWFpbEBnbWFpbC5jb20iLCJuYW1lIjoiRmxleGVtYXJrZXQiLCJwcm9maWxlIjoiMTczMjMwNDM1MzkzNl8xNi5qcGciLCJpc1ZlbmRvciI6IlRydWUiLCJpc1ZlcmlmaWVkIjoiRmFsc2UiLCJpc1Bob25lQ29uZmlybSI6IlRydWUiLCJpc0VtYWlsQ29uZmlybSI6IlRydWUiLCJSb2xlQ2xhaW0iOlsiSGFzUm9sZUFkZCIsIkhhc1JvbGVEZWxldGUiLCJIYXNSb2xlRWRpdCIsIkhhc1JvbGVWaWV3Il0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjozMzI5MjEzNTY2NSwiaXNzIjoiaHR0cHM6Ly9mbGV4ZW1hcnQuY29tLyIsImF1ZCI6Imh0dHBzOi8vZmxleGVtYXJrZXQuY29tLyJ9.tU6CsPZZ9P2rP8FP3Z-XUEqkHNUcxfzOKDbIyWfKbzE`;
  }

const queryString= new URLSearchParams(params).toString();
const url= queryString? `${api}?${queryString}`:api;

const response= await apiClient.get(url,{headers})

if(response.data?.isSuccess){
  return response.data;}
  throw new Error(response.data?.message || "Failed to fetch data");
} catch (error:any) {
  throw new Error(error.response?.data?.message || error.message || "An error occurred");
}
},


  postData: async (api: string, payload: Record<string, any> = {}, customHeaders: Record<string, string> = {} , useAuth: boolean = false) => {
    try {
      const headers: Record<string, string> = {...customHeaders};
      if (useAuth) {
        headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiY2Y4ZjMyMzAtNjA1ZC00ZmVkLWI4N2EtYzE2MzllNGYwMWQzIiwiZW1haWwiOiJhaS5haHNhbmlzbWFpbEBnbWFpbC5jb20iLCJuYW1lIjoiRmxleGVtYXJrZXQiLCJwcm9maWxlIjoiMTczMjMwNDM1MzkzNl8xNi5qcGciLCJpc1ZlbmRvciI6IlRydWUiLCJpc1ZlcmlmaWVkIjoiRmFsc2UiLCJpc1Bob25lQ29uZmlybSI6IlRydWUiLCJpc0VtYWlsQ29uZmlybSI6IlRydWUiLCJSb2xlQ2xhaW0iOlsiSGFzUm9sZUFkZCIsIkhhc1JvbGVEZWxldGUiLCJIYXNSb2xlRWRpdCIsIkhhc1JvbGVWaWV3Il0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjozMzI5MjEzNTY2NSwiaXNzIjoiaHR0cHM6Ly9mbGV4ZW1hcnQuY29tLyIsImF1ZCI6Imh0dHBzOi8vZmxleGVtYXJrZXQuY29tLyJ9.tU6CsPZZ9P2rP8FP3Z-XUEqkHNUcxfzOKDbIyWfKbzE`;
      }

      const response = await apiClient.post(api, payload, { headers });

      if (response.data?.isSuccess) {
        return response.data;
      }


      

      throw new Error(response.data?.message || "Failed to fetch data");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || "An error occurred");
    }
  },



  putData: async (api: string, payload: Record<string, any> = {},customHeaders: Record<string, string> = {} , useAuth: boolean = false ) => {
    try {
      const headers: Record<string, string> = {...customHeaders};
      if (useAuth) {
        headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiY2Y4ZjMyMzAtNjA1ZC00ZmVkLWI4N2EtYzE2MzllNGYwMWQzIiwiZW1haWwiOiJhaS5haHNhbmlzbWFpbEBnbWFpbC5jb20iLCJuYW1lIjoiRmxleGVtYXJrZXQiLCJwcm9maWxlIjoiMTczMjMwNDM1MzkzNl8xNi5qcGciLCJpc1ZlbmRvciI6IlRydWUiLCJpc1ZlcmlmaWVkIjoiRmFsc2UiLCJpc1Bob25lQ29uZmlybSI6IlRydWUiLCJpc0VtYWlsQ29uZmlybSI6IlRydWUiLCJSb2xlQ2xhaW0iOlsiSGFzUm9sZUFkZCIsIkhhc1JvbGVEZWxldGUiLCJIYXNSb2xlRWRpdCIsIkhhc1JvbGVWaWV3Il0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjozMzI5MjEzNTY2NSwiaXNzIjoiaHR0cHM6Ly9mbGV4ZW1hcnQuY29tLyIsImF1ZCI6Imh0dHBzOi8vZmxleGVtYXJrZXQuY29tLyJ9.tU6CsPZZ9P2rP8FP3Z-XUEqkHNUcxfzOKDbIyWfKbzE`;
      }

      const response = await apiClient.put(api, payload, { headers });

      if (response.data?.isSuccess) {
        return response.data;
      }

      throw new Error(response.data?.message || "Failed to fetch data");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || "An error occurred");
    }
  },


  deleteData: async (api: string, id: string, useAuth: boolean = false) => {
    try {
      const headers: Record<string, string> = {};
      if (useAuth) {
        headers.Authorization = `Bearer YOUR_TOKEN_HERE`;
      }

      const response = await apiClient.delete(`${api}/${id}`, { headers });

      if (response.data?.isSuccess) {
        return response.data;
      }

      throw new Error(response.data?.message || "Failed to delete data");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || "An error occurred");
    }
  },




};




export default userService;

export {productService,askMessagesService,apiService};