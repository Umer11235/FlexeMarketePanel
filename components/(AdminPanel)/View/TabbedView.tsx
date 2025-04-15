import { useTheme } from '@/components/ThemContext/theme';
import React, { useState } from 'react';

// Define Tab type
interface Tab {
  title: string;
  content: React.ReactNode;
}

// TabbedView component that accepts props for dynamic tabs and contents
interface TabbedViewProps {
  tabs: Tab[]; // Array of tabs passed in from the parent component
}

const TabbedView: React.FC<TabbedViewProps> = ({ tabs }) => {
 
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.title || "");

  return (
    <div className={`min-h-screen ${theme==="dark"?"bg-gray-700":"bg-gray-100"} `}>
      {/* Tab Navigation */}
      <div className={`flex justify-center  ${theme==="dark"?"bg-gray-500":"bg-gray-200"}shadow-md`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab.title)}
            className={`px-5 py-3 text-md font-semibold ${
              activeTab === tab.title ? "bg-slate-500 text-white" : "text-black hover:bg-gray-300"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`p-10 ${theme==="dark"?"bg-gray-600 text-gray-100":"bg-gray-300  text-gray"} `}>
        {tabs.map(
          (tab, index) =>
            activeTab === tab.title && <div key={index}>{tab.content}</div>
        )}
      </div>
    </div>
  );
};

export default TabbedView;
