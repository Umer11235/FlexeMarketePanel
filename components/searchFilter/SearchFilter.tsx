"use client";
import React, { useState } from "react";
import { ISearchFiltersProps } from "../(AdminPanel)/ListOfDatawithPagination/Interfaces/IList";



const SearchFilters: React.FC<ISearchFiltersProps> = ({
  filters,
  onApply,
  onReset,
  bgColor,
}) => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleChange = (key: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilterValues({});
    onReset();
  };

  return (
    <div
      className={`flex flex-wrap gap-4 p-3 mb-2 ${
        bgColor || "bg-slate-200"
      } w-full rounded-lg`}
    >
      {filters.map((filter) => (
        <div key={filter.name} className="flex flex-col">
          {filter.type === "text" ? (
            <input
              type="text"
              placeholder={filter.placeholder}
              value={filterValues[filter.name] || ""}
              onChange={(e) => handleChange(filter.name, e.target.value)}
              className="p-1 rounded-md"
            />
          ) : filter.type === "select" ? (
            <select
              value={filterValues[filter.name] || ""}
              onChange={(e) => handleChange(filter.name, e.target.value)}
              className="px-2 py-1 rounded-md"
            >
              <option value="">Select {filter.title}</option>
              {filter.options?.map((option) => (
                <option key={option.key} value={option.value}>
                  {option.key}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ))}
      <div className="flex gap-2">
        <button className="bg-blue-300 rounded px-4 py-1 text-gray" onClick={handleReset}>
          Reset
        </button>
        <button
          className="bg-blue-300 rounded  px-4 py-1 text-gray"
          onClick={() => onApply({...filterValues})}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
