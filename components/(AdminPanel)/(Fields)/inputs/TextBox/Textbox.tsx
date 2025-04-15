"use client"
import React from 'react';



const Textbox = ({ name, SetWidth,SetMargin, type, label ,Flex, onChange }:ITextbox) => {
  return (
    <div className={`${Flex} justify-between items-center ${SetMargin}  flex-wrap`}>
      <div>
        <label className="block text-gray-00 font-semibold text-xs mb-1 md:mb-0 pr-4">
          {label}
        </label>
      </div>

        <div className={`${SetWidth}`}>
        <input
          name={name}
          type={type}
          onChange={onChange}
          className="bg-white  appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
       placeholder='info@gmail.com'
       />
      </div>
    </div>
  );
};

export default Textbox;