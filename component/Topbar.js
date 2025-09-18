import Link from "next/link";
import { FaSignOutAlt,FaUserCircle } from "react-icons/fa";
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react";

export default function TopBar({ isLoading }) {
    const [fullName , setFullname] = useState("");
    const [divisionname , setDivisionname] = useState("");
    const pathname = usePathname();

    useEffect(() => {

        const storedName = localStorage.getItem("fullname");
        const nameDivision = localStorage.getItem("name_dvi");
        if (storedName) {
            setFullname(storedName);
        }
        if (nameDivision) {
            setDivisionname(nameDivision);
        }
    }, [pathname]);

    if(pathname == '/'){
        return null;
    }
        
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
    };
    
    return (

        <nav className="text-gray-600 bg-gray-200 shadow-md">
            <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
                {/* Logo */}
                <div className="text-xl font-bold tracking-wide">
                
                </div>

                {/* Menu Items */}
                <div className="hidden space-x-6 md:flex">
                
                </div>

                {/* Logout button */}
  

                <div className="inline-flex">
                    <span className="flex text-black me-2"> <FaUserCircle size={16} className="mt-1 me-2"/> {fullName}  {divisionname}</span>
                    <button onClick={handleLogout} className="flex items-center gap-2 cursor-pointer hover:underline">
                        ออกจากระบบ <FaSignOutAlt size={16} className="mt-1"/>
                    </button>
                </div>
   
            </div>
        </nav>


    );
}