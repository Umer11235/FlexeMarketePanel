"use client";
import React from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
}) => {

  return (

    // <div className="flex justify-between items-center mb-6 flex-wrap">
    //   <div>
    //     <label className="block text-gray-500 font-semibold md:text-right mb-1 md:mb-0 pr-4">
    //     <span className="ms-3 mr-5 text-sm font-medium text-gray-900 dark:text-gray-300">
    //     {label}
    //   </span>
    //     </label>
    //   </div>

    //   <div className="w-72">
    //   <input
    //     type="checkbox"
    //     className="sr-only peer"
    //     checked={checked}
    //     onChange={onChange}
    //   />
    //   <div className="relative w-16 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-10 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
    //   after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#455D76]"></div>
    //   </div>
    // </div>


/////

    <label className="inline-flex mb-6 items-center   cursor-pointer justify-between">
      <span className=" text-gray-500 font-semibold w-48 dark:text-gray-300">
        {label}
      </span>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="relative m-auto w-16 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-10 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
      after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#455D76]"></div>
    </label>
  );
};

export default ToggleSwitch;
