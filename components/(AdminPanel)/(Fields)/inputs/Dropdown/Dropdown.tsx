import React from "react";



const Dropdown: React.FC<IDropdownProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  Setwidth,
  placeholder = "Select an option",
}) => {
  return (

    <div className="flex justify-between items-center mb-6 flex-wrap">
    <div >
      <label className="block text-gray-00 font-semibold md:text-right mb-1 md:mb-0 pr-4">
        {label}
      </label>
    </div>

    <div className={`${Setwidth || "w-72"}`}>
    <select
        id="dropdown"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
//


    // <div className="  max-w-sm mx-auto">
    //   <label
    //     htmlFor="dropdown"
    //     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    //   >
    //     {label}
    //   </label>
    //   <select
    //     id="dropdown"
    //     value={selectedValue}
    //     onChange={(e) => onChange(e.target.value)}
    //     className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //   >
    //     <option disabled value="">
    //       {placeholder}
    //     </option>
    //     {options.map((option) => (
    //       <option key={option.value} value={option.value}>
    //         {option.label}
    //       </option>
    //     ))}
    //   </select>
    // </div>
  );
};

export default Dropdown;
