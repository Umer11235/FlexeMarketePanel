"use client"

import Link from "next/link";
import {  useState } from "react";
import Icons from "@/utilities/icons/icons";
import { useTheme } from "@/components/ThemContext/theme";

interface NavbarProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
  }
// const Navbar: React.FC<NavbarProps> = ({theme,toggleTheme}) => {
const Navbar = () => {


   const [isDropdownOpen, SetisDropdownOpen] = useState(true)

    const toggleDropdown = () => {
        SetisDropdownOpen(!isDropdownOpen);
    }

    const menus = [
        { name: "Profile", link: '/home' },
        { name: "Setting", link: '/users' },
        { name: "Logout", link: '/markevents' },

    ]



    const { theme, toggleTheme } = useTheme();


    


    return (
        <div className="flex">
 {/* <nav className="bg-green-00 w-full border-y-2 bg-white text-gray-500  px-4 py-3 flex flex-wrap justify-between
          items-center
          "> */}

<nav
      className={`navbar w-full  border-y-2 px-4 py-3  flex flex-wrap  justify-between items-center ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
            <div className="text-md flex ">
                <h1>Dashboard <span className={`${theme==="dark"?"":"text-gray-800"} `}>/ Default</span></h1>
            </div>

<div></div>
<div></div>
<div></div>
<div></div>


<div className="flex flex-end ml-12">
   <input type="text" placeholder="Search" className=" bg-gray-200 focus:outline-slate-200  rounded-md w-full text-md p-1 px-10"  />
</div>
            <div className="relative">



                <ul className="flex cursor-pointer select-none">

                    <li  onClick={toggleTheme}><Icons color={`${theme==="dark"?"white":"black"}`}  icon={`${theme==="dark"?"Moon":"DarkMode"}`}/></li>
                    {/* <li  onClick={toggleNotification}><Icons color={`${theme==="dark"?"white":"black"}`} icon="Notification"/></li> */}
                    <li  onClick={toggleDropdown}><Icons color={`${theme==="dark"?"white":"black"}`} icon="Notification"/></li>
<li>
        {/* ///Profile */}
              <div>


                {!isDropdownOpen &&
                    (
                        <div className={`absolute right-0 mt-11 w-48  roudend-md shadow-lg z-10
                            ${
                                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-700"
                              }
                        `}>

                            {menus.map((menu, i) => (

                                <Link href={menu.link}
                                    className={`block px-4 py-2   ${theme==="dark"?"hover:bg-gray-100 hover:text-gray-900":"hover:bg-gray-100"}`} key={i}>
                                    {menu.name}
                                </Link>
                            ))}


                        </div>
                    )
                }

              </div>
              {/* ///Profile */}
</li>
                </ul>

            </div>

        </nav>
           

        </div>



    )
}

export default Navbar;