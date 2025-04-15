"use client";

import SimpleCard from "@/components/(AdminPanel)/(Card)/SimpleCard/SimpleCard";
import TopEvents from "@/components/(AdminPanel)/TopSellingEvents/TopEvents";
import Icons from "@/utilities/icons/icons";
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const Home = () => {


  const [Users, setUsers] = useState("0");
  const [products, setProducts] = useState("0");
  const [Orders, setOrders] = useState("0");
  const [Requested, setRequested] = useState("0");

  // useEffect(() => {
  //   setUsers(localStorage.getItem("users") || "0");
  //   setProducts(localStorage.getItem("products") || "0");
  //   setOrders(localStorage.getItem("orders") || "0");
  //   setRequested(localStorage.getItem("requested") || "0");
  // }, []);

  // const products = localStorage.getItem('products');
  // const Users = localStorage.getItem('users');
  // const Orders = localStorage.getItem('orders');
  // const Requested = localStorage.getItem('requested');


  const eventsData = [
    {
      Message: "i would like to buy there is any more stock ?",
      Update: <input type="text" className="border-2"/>,
      "Action":"Delete",
    
    },
    {
      Message: "Can you provide more details about this item",
      Update: <input type="text" className="border-2"/>,
     "Action": "Delete",
    
    },
    {
      Message: "Are there any defects or issues with the item?",
      Update: <input type="text" className="border-2"/>,
      "Action": "Delete",
     
    },
    {
      Message: "Where would be a convenient meetup spot for us?",
      Update: <input type="text" className="border-2"/>,
      "Action": "Delete",
    },
    // Add more data as needed
  ];

  const columns = ["Message", "Update", "Action"];


  return (
    <div>
      <p className="font-bold pb-3 px-2">Home</p>

      <div className="flex flex-wrap w-full">
        <div className="flex flex-wrap gap-4 w-[50%]? w-full justify-between ">
          <SimpleCard
            title="Total Users"
            value={Users? Users:"0"}
            percentage="+5.27%"
            bgColor="#E3F5FF"
            icon2={<Icons icon="VectorTop" />}
          />

          <SimpleCard
            title="Products"
            value={products ? products:"0"}
            percentage="+5.27%"
            icon={<Icons icon="listCheck" />}
            bgColor="#E3E3E3"
            icon2={<Icons icon="VectorTop" />}
          />

          <SimpleCard
            title="Orders"
            value={Orders ? Orders:"0"}
            percentage="+5.27%"
            bgColor="white"
            icon2={<Icons icon="VectorTop" />}
          />
          <SimpleCard
            title="Requested Users"
            value={Requested ? Requested:"0"}
            percentage="-0.27%"
            icon={<FaCalendarAlt />}
            bgColor="#E5ECF6"
            icon2={<Icons icon="VectorDown" />}
          />
        </div>

        {/* <div className="flex flex-wrap  w-1/2 rounded-2xl ">
          <EmailAlert
            data={data}
            barDataKey="pv"
            tooltipContent={tooltipContent}
          />
        </div> */}
      </div>

      <div className="flex flex-wrap w-full mt-6 justify-between bottom-2 ">
        <div className="flex flex-wrap w-[72%]? w-full rounded-2xl border-2 overflow-hidden   ">
          <TopEvents
            title="Comments"
            columns={columns}
            data={[]}
            Width="w-full"
          />
        </div>
        {/* <div className="flex flex-wrap w-1/4  bg-white rounded-3xl">
          <PieChart />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
