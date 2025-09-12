import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import { usePathname } from 'next/navigation'

export default function TopBar() {
    const pathname = usePathname();
    console.log(pathname);




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
                    <button onClick={handleLogout} className="flex items-center gap-2 cursor-pointer hover:underline">
                        ออกจากระบบ <FaSignOutAlt size={16} className="mt-1"/>
                    </button>
                </div>
   
            </div>
        </nav>


    );
}