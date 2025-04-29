import { useEffect, useState } from "react";
import { productService } from "@/apies/Services/UserService";

const useFetchData = <T,>(apiEndpoint: string, sharedList?: T[] , payload: any = {}) => {
  
  const [data, setData] = useState<T[]>(sharedList || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sharedList || sharedList.length === 0) {
      fetchData();
    } else {
      setData(sharedList);
    }
  }, [sharedList, JSON.stringify(payload)]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await productService.fetchProducts("test", apiEndpoint,payload);
      setData(response);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default useFetchData;
