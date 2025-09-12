import { usePathname } from 'next/navigation'

export default function Footer() {
    const pathname = usePathname();

    if(pathname == '/'){
      return null;
    }
    
  return (

    <footer className="w-full py-4 text-sm text-center text-gray-600 bg-gray-100 border-t">
      &copy; {new Date().getFullYear()} บริษัท โรงงานผลิตภัณฑ์อาหารไทย จำกัด
    </footer>


  );
}