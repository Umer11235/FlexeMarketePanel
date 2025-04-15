"use client"

import TabbedView from "@/components/(AdminPanel)/View/TabbedView";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";


const page = () =>{
  const params = useParams<{ id: string; }>()

  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Fetch order data from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await axios.get("https://flexemart.com/api/product/show/"+params.id);
      const data = await response;
      console.log(data.data)
      if (data.data.isSuccess) {
        setOrderDetails(data.data.data);
        console.log(data)
      }
    };

    fetchOrderDetails();
  }, []);

  if (!orderDetails) {
    return <div>
    <ClimbingBoxLoader color="#5b909b" className="!flex m-auto p-9" size={15}/>

      {/* Loading... */}
      </div>;
  }

  // Define dynamic tabs
  const tabs = [
    {
      title: "Product Info",
      content: (
        <div>
          <h1 className="text-2xl font-bold mb-4">Product Info</h1>
          <div className="flex gap-4 mb-4">
            {orderDetails.images.map((image: any) => (
              <img
                key={image.id}
                src={`https://flexemart.com/uploads/${image.name}`}
                alt="Product"
                className="w-32 h-32 object-cover rounded-lg"
              />
            ))}
          </div>
          <p>Name: {orderDetails.name}</p>
          <p>Price: ${orderDetails.price}</p>
          <p>Discount: {orderDetails.discount}%</p>
          <p>Condition: {orderDetails.condition}</p>
          <p>Inventory: {orderDetails.inventory}</p>
          <p>Shipping Type: Shipping</p>
          <p>Policy: {orderDetails.policy}</p>
          <p>Description: {orderDetails.description}</p>
        </div>
      ),
    },
    {
      title: "Category / User Info",
      content: (
        <div>
          <h1 className="text-2xl font-bold mb-4">Category / User Info</h1>
          <p>name: {orderDetails.user.name}</p>
          <p>Category: {orderDetails.category.name}</p>
          {/* <p>Accessory Type: {orderDetails.product.attributes[0]?.value || "N/A"}</p>
          <p>Compatibility: {orderDetails.product.attributes[1]?.value || "N/A"}</p>
          <p>Color: {orderDetails.product.attributes[2]?.value || "N/A"}</p>
          <p>Wireless Charging: {orderDetails.product.attributes[3]?.value || "N/A"}</p> */}
        </div>
      ),
    },
    {
      title: "Location Info",
      content: (
        <div>
          <h1 className="text-2xl font-bold mb-4">Location Info</h1>
          <p>Latitude: {orderDetails.latitude}</p>
          <p>Longitude: {orderDetails.longitude}</p>
          <p>Zip Address: {orderDetails.zip}</p>
          <p>City: {orderDetails.city}</p>
          <p>State: {orderDetails.state}</p>
        </div>
      ),
    },


  ];

  return (
    <div className="p-4">
      <TabbedView tabs={tabs} />
    </div>
  );
};

export default page;
