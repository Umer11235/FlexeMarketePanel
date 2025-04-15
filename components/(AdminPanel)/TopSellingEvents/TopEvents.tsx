import { useTheme } from "@/components/ThemContext/theme";
import React, { useEffect, useState } from "react";

interface TopEventsProps {
  title: string;
  columns: string[];
  data: Array<{ [key: string]: string | number }>;
  padding?:string;
  hoverColor?:string;
  Width?:string;
}

const TopEvents: React.FC<TopEventsProps> = ({ title, columns, data ,padding,hoverColor,Width}) => {
  
  
  const { theme } = useTheme();


  
  return (
    <div className={`relative overflow-x-auto  shadow-md sm:rounded-lg rounded-3xl  ${Width} `}>
      <div className="flex items-center px-6 py-8 justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        <h2 className="text-1xl font-semibold">{title}</h2>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 border-b-2 dark:text-gray-400">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className={`${padding?padding:"px-5 py-3"}`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`bg-white border-b  ${theme==="dark"?"text-white":"text-gray-700"}  dark:bg-gray-800 dark:border-gray-700 ${hoverColor?hoverColor:"hover:bg-gray-50"}  dark:hover:bg-gray-600`}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`${padding?padding:"px-6 py-4"}`}>
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopEvents;
