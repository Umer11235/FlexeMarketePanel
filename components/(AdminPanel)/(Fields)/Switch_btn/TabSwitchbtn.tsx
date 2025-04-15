"use client"

import React, { useState } from "react";

interface ItabSwitchProps {
    leftLabel: string;
    rightLabel: string;
    bgColor?:string;
  }
  
const TabSwitch:React.FC<ItabSwitchProps>=({leftLabel,rightLabel,bgColor})=>{

    const [isRight,setIsRight]=useState(false);
    return(
    // <div className="w-full max-w-sm rounded-lg bg-white h-20 m-auto shadow flex flex-col border-2">
<div className=" w-44 shadow rounded-xl border h-9 flex p-1 relative items-center bg-gray-200">
<div className="w-full flex justify-center border" onClick={()=>setIsRight(false)}>
    <button onClick={()=>{}} className="text-xs">{leftLabel}</button>
</div>

<div className="w-full flex justify-center border" onClick={()=>setIsRight(true)}>
<button onClick={()=>{}} className="text-xs">{rightLabel}</button>
</div>

<span className={`elSwitch ${bgColor?bgColor:"bg-white  text-gray-800"}  shadow flex items-center justify-center w-1/2 rounded-lg text-xs font-bold h-7 transition-all top-[4px] absolute ${isRight?"left-[48%]":"left-1"}`}>
{isRight?rightLabel:leftLabel}
</span>
</div>


    // </div>
);
}

export default TabSwitch