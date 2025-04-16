"use client"

import { apiService } from "@/apies/Services/UserService";
import TabbedView from "@/components/(AdminPanel)/View/TabbedView";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const Page = () =>{
  const params = useParams<{ id: string; }>()

  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Fetch order data from API
  useEffect(() => {
    const fetchOrderDetails = async () => {

      const response = await apiService.fetchData("/orderv2/orders",{search: params.id});

        if (response.isSuccess) {
          console.log(response.data.orders[0], "Success")
        setOrderDetails(response.data.orders[0]);
        console.log(response.data)
      }

     // http://localhost:5145/api/orderv2/orders

     
    //  const response= await apiService.fetchData("orderv2/orders",
    //   {
    //     page:1,
    //     pageSize:10,
    //     search: params.id,
    //   },
    //   true
    // );

      // const response = await axios.get("https://flexemart.com/api/order/get-order/"+params.id);
      // const data = await response;
      // console.log(data.data)
      // if (data.data.isSuccess) {
      //   setOrderDetails(data.data.data);
      //   console.log(data)
      // }
    };

    fetchOrderDetails();
  }, []);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  // Define dynamic tabs
  const tabs = [
    {
      title: "Order Info",
      content: (
        <div>
          <h1 className="text-2xl font-bold mb-4">Order Info</h1>
          <p>Name: {orderDetails.name}</p>
          <p>Address: {orderDetails.address}</p>
          <p>City: {orderDetails.city}</p>
          <p>State: {orderDetails.state}</p>
          <p>Zip: {orderDetails.zip}</p>
          <p>Total: ${orderDetails.price}</p>
          <p>Tax Amount: ${orderDetails.tax}</p>
          {/* <p>Shipping Cost: ${orderDetails.shipping.toFixed(2)}</p>
          <p>Grand Total: ${orderDetails.grandTotal.toFixed(2)}</p> */}
          <p>Vendor Paid for Shipping: {orderDetails.hasVendorPaidForShiping ? "Yes" : "No"}</p>
        </div>
      ),
    },
    {
      title: "User Info",
      content: (
        <div>
          <h1 className="text-2xl font-bold mb-4">User Info</h1>
          {/* <p>Name: {orderDetails.orders.items.images.product.user.name}</p>
          <p>Email: {orderDetails.orders.items.images.product.user.email}</p>
          <p>Phone: {orderDetails.orders.items.images.product.user.phoneNumber}</p> */}
        </div>
      ),
    },
    {
      title: "Vendor Info",
      content: (
        <div>
          <h1 className="text-2xl font-bold mb-4">Vendor Info</h1>
          {/* <p>Name: {orderDetails.vendor.name}</p>
          <p>Email: {orderDetails.vendor.email}</p>
          <p>Phone: {orderDetails.vendor.phoneNumber}</p>
          <p>Verified Vendor: {orderDetails.vendor.isVerifiedVendor ? "Yes" : "No"}</p> */}
        </div>
      ),

     },
       {
        title: "Shipping Info",
        content: (
          <div>
            <h1 className="text-2xl font-bold mb-4">Vendor Info</h1>
            <p>Name: {orderDetails.service}</p>
            <p>Shippment Tracking#: {orderDetails.shipmentTrackingNumber}</p>
            <p>Download Label:	 {orderDetails.labelUrl}</p>
            <p>Track Order: {orderDetails.trackingPublicUrl }</p>
            <p>Invoice:	 {orderDetails.labelUrliedVendor }</p>
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

export default Page;
