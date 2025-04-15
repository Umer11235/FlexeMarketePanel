"use client";

import TopEvents from "@/components/(AdminPanel)/TopSellingEvents/TopEvents";
import VividSeat from "@/images/Media.png";
import Stubhub from "@/images/Media (1).png";
import GameTime from "@/images/Media (2).png";
import ActiveSold_Switch from "@/components/(AdminPanel)/(Fields)/Switch_btn/ActiveSold_Switch";

const Page = () => {
  const eventsData = [
    {
      Sec: "117",
      "#Ticket": "400",
      "Min Price": "$20.9",
      "Max Price": "$117",
      Type: "Primary",
    },
    {
      Sec: "117",
      "#Ticket": "400",
      "Min Price": "$20.9",
      "Max Price": "$117",
      Type: "Primary",
    },
    {
      Sec: "117",
      "#Ticket": "400",
      "Min Price": "$20.9",
      "Max Price": "$117",
      Type: "Primary",
    },
    {
      Sec: "117",
      "#Ticket": "400",
      "Min Price": "$20.9",
      "Max Price": "$117",
      Type: "Primary",
    },
    // Add more data as needed
  ];

  const columns = ["Sec", "#Ticket", "Min Price", "Max Price", "Type"];

  return (
    <div>
      <div className="mb-6 text-xs">
        <p>Event : Katherine Moss on 2024-11-08T19:30:00 at United Center </p>
      </div>

      <div>
        <ActiveSold_Switch />
      </div>

      <div className="flex flex-wrap">
        <div className="flex flex-wrap gap-4 w-[50%] ">
          <TopEvents
            hoverColor="hover:bg-blue-950 hover:text-gray-200"
            Width="max-w-full w-[95%]"
            padding="px-4 py-2"
            title="Total Number Of Available Tickets 4307 / 63738"
            columns={columns}
            data={eventsData}
          />
        </div>

        <div className="flex flex-wrap  w-1/2 rounded-2xl">
        </div>
      </div>

      <div>
        {/* cards */}

        <div>
          <h2 className="my-2 p-6">Secondary Market Places</h2>
          <div className="flex flex-wrap gap-4 m-auto items-center justify-center">
        

        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
