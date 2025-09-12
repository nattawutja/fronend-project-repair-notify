import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import { usePathname } from 'next/navigation'

export default function TopBar() {
    const pathname = usePathname();
    console.log(pathname);

    if(pathname == '/'){
        return null;
    }
        
    return (

        <nav className="text-gray-600 bg-gray-100 shadow-md">
        <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
            {/* Logo */}
            <div className="text-xl font-bold tracking-wide">
            
            </div>

            {/* Menu Items */}
            <div className="hidden space-x-6 md:flex">
            
            </div>

            {/* Logout button */}
            <div className="inline-flex">
            <Link href="/" className="transition hover:text-gray-200">&nbsp;ออกจากระบบ</Link>&nbsp; <FaSignOutAlt size={16} className="mt-1"/>
            </div>
        </div>
        </nav>


    );
}