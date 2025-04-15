import Icons from '@/utilities/icons/icons';
import React, { useState } from 'react';



const ActiveSold_Switch= () => {
  const [status,setStatus]=useState<"active" | "sold">("active");

  const handleStatusChange=(item:"active" | "sold")=>{
     alert(item);
    setStatus(item);
  }

 

  return (
    <div className="w-36 rounded-full py-4   px-2">
      <ul className="flex rounded-full m-auto">
        <li
          onClick={() => handleStatusChange('active')}
          className={`py-2 px-6 ${status === 'active' ? 'bg-blue-950 text-white' : 'bg-white text-black'} border-2 border-slate-400 rounded-s-full flex gap-2 w-28 cursor-pointer`}
        >
          <span className="text-black flex items-center">
            <Icons
             icon="Tick" />
          </span>
          Active
        </li>
        <li
          onClick={() => handleStatusChange('sold')}
          className={`py-2 px-6 ${status === 'sold' ? 'bg-blue-950 text-white' : 'bg-white text-black'} border-2 border-slate-400 rounded-e-full flex gap-2 w-28 cursor-pointer`}
        >
          <span className="text-black flex items-center">
            <Icons icon="closeCircle" />
          </span>
          Sold
        </li>
      </ul>
    </div>
  );
};

export default ActiveSold_Switch;
