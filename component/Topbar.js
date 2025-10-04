import Link from "next/link";
import { FaSignOutAlt,FaUserCircle } from "react-icons/fa";
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react";
import Image from "next/image";

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
    
    const handleHome = () => {
        window.location.href = "/repairNoti";
    };

    return (

        <nav className="text-gray-600 bg-gray-200 shadow-md">
            <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <div className="flex items-center space-x-4">
                        <div className="text-xl font-bold tracking-wide bg-white px-2 py-2 rounded-lg border">
                            <button onClick={handleHome} className="flex items-center gap-2 cursor-pointer hover:underline">
                            <Image
                            src="/waiwailogo.png"
                            alt="My Photo"
                            width={70}
                            height={50}
                            />
                            </button>
                        </div>
                        <div className="ms-2">
                            <h1 className="text-4xl font-bold gradient-text">Online Repair Notification System</h1>
                            <p>ระบบแจ้งซ่อมออนไลน์</p>
                        </div>
                    </div>
                   

                    {/* Logout button */}
    

                    <div className="inline-flex items-center">
                        <div>
                            <h1 className="text-4xl font-bold">
                            {fullName} ({divisionname})
                            </h1>
                        </div>
                         <div className="bg-white px-2 py-2 ml-2 border rounded-lg cursor-pointer">
                            <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 cursor-pointer hover:underline"
                        >
                            ออกจากระบบ <FaSignOutAlt size={16} className="mt-1" />
                        </button>
                         </div>
                    </div>
    
                </div>
            </div>
        </nav>


    );
}