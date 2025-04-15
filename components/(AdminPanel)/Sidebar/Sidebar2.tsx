"use client"
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FiList, FiMessageSquare } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutline10K, MdOutlineDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import Link from "next/link";
import { TiMediaEject, TiMediaStopOutline } from "react-icons/ti";  
import Image from "next/image";
import profile from "@/images/user-1.jpg"
import { UserCheck } from "lucide-react";
import { useTheme } from "@/components/ThemContext/theme";

// interface SideBar2Props {
//     theme: "light" | "dark";
//   }
  const SideBar2 = () => {
    const { theme, toggleTheme } = useTheme();

    const [open, setOpen] = useState(false);
   
///for timer
    useEffect(()=>{
if(open){
    const timer=setTimeout(()=>{
        setOpen(false);
    },15000)
    return () => clearTimeout(timer);
}

    },[open])

    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

    type MenuItem = {
        name: string;
        link: string;
        Icon: any;
        submenu?: { name: string; link: string; Icon: any }[];
    };
    

    // const categories = [ this is old version ] this is old version

    const categories: { title: string; menus: MenuItem[] }[] = [
        {
            title: "information",
            menus: [
                // { name: "Home", link: '/dashboard', Icon: MdOutlineDashboard },
                { name: "Users", link: '/users', Icon: TiMediaEject },
                { name: "Product", link: '/products', Icon: UserCheck },
                { name: "Affilliations", link: '/requesteduser', Icon: TiMediaEject },
                { name: "Orders", link: '/orders', Icon: FiMessageSquare },
                 { name: "Promotion Zip", link: '/promotionZip', Icon: MdOutlineDashboard },
                 { name: "Gift Pick Up Orders", link: '/giftpickup', Icon: MdOutlineDashboard },
                { name: "Ask messages", link: '/askmessage', Icon: TiMediaEject },
                { name: "Shipment", link: '/product-update', Icon: TiMediaEject },
                { name: "State", link: '/state', Icon: TiMediaEject },
                { name: "Contacts", link: '/contact', Icon: TiMediaEject },
                { name: "Settings", link: '/settings', Icon: TiMediaEject },

            ],
        },


        
        {
            title: "Category",
            menus: [
                { name: "Category", link: '#', Icon: FiList, submenu: [
                    { name: "Categories", link: '/category', Icon: AiOutlineUser },
                    { name: "Attributes", link: '/presaleevent', Icon: AiOutlineUser },
  
                ]},
           
            ],
        },
        {
            title: "Settings",
            menus: [
                { name: "Settings", link: '/settings', Icon: FiMessageSquare },
                { name: "Billings", link: '/userss', Icon: TbReportAnalytics },
            ],
        },
    ];





    return (
        <section className={`flex gap-6
            ${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
              }`}>
            <div className={`bg-green-00 border-2  min-h-screen ${open ? 'w-48' : 'w-16'} duration-200  px-4`}>
              {/* ///Profile */}

                
                <div className="py-3 flex justify-end">
                    <HiMenuAlt3 size={26} className="cursor-pointer" onClick={() => setOpen(!open)} />
                </div>

                <div className="mt-4 flex flex-col  gap-4 relative ">
                    {categories.map((category, idx) => (
                        <div key={idx}>
                            <h2 className={`text-xs text-gray-400 py-2 font-bold  ${!open && 'opacity-0'} duration-500`}>
                                {category.title}
                            </h2>
                            {category.menus.map((menu, i) => (
                                <div key={i}>
                                    <div className="group flex items-center  hover:text-white text-xs gap-3.5 font-medium  hover:bg-gray-800  rounded-md cursor-pointer " onClick={() => {
                                        if (menu.submenu) {
                                            setDropdownOpen(dropdownOpen === menu.name ? null : menu.name);
                                        }
                                    }}>
                                        <Link href={menu.link} className={`flex flex-1 items-center ${open?"p-3":"w-[45px] p-2"} ${menu.submenu ? 'cursor-pointer' : ''}`}>
                                            <div>{React.createElement(menu.Icon, { size: "20" })}</div>
                                            
                                            <h2
                                                // style={{ transitionDelay: `${i + 0}00ms` }}
                                                className={`mx-2 whitespace-pre  duration-00 ${!open && 'opacity-0 translate-x-20 overflow-hidden'}`}>
                                                {menu.name}
                                            </h2>
                                            <h2 className={`${open && "hidden"} z-10 absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-2 group-hover:p-4 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}>
                                                {menu.name}
                                            </h2>
                                        </Link>
                                    </div>
                                    {menu.submenu && dropdownOpen === menu.name && (
                                        <div className={`pl-6 ${!open && 'opacity-0 translate-x-28 overflow-hidden'} duration-500 `}>
                                            {menu.submenu.map((sub, j) => (
                                                <Link href={sub.link} key={j} className="block text-xs text-gray-700 hover:text-white hover:bg-gray-800 p-2 rounded-md">
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SideBar2;
