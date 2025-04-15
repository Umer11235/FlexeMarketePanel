"use client"

import React from "react";



const Checkbtn:React.FC<Icheckbtn> = ({ id, label, checked, value, onChange }) => {
  return (
    <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      value={value}
      onChange={onChange}
      className={`peer w-5 h-5 appearance-none border-2 border-gray-800 rounded-md bg-transparent checked:bg-gray-800 checked:border-gray-800 focus:ring-2`}
    />
    <label htmlFor={id} className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">
      {label}
    </label>
  </div>
  );
};

export default Checkbtn;
