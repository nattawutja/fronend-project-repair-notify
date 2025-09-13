import '../styles/globals.css'
import React,{ useState,useEffect } from 'react';
import TopBar from '../component/Topbar'
import Footer  from '../component/Footer'
import { setupSessionTimeout } from './utils/sessionTimeout'
function MyApp({ Component, pageProps }) {

  useEffect(() => {
    // สร้าง session timeout
    const { init, cleanup } = setupSessionTimeout(() => {
      alert("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
      localStorage.clear();
      window.location.href = "/";
    });

    init(); // เริ่มจับเวลา

    return () => {
      cleanup(); // ล้าง event listener ตอน unmount
    };

    
  }, []);


  return (
    <>
      <TopBar/>
      <Component {...pageProps} />
      <Footer/>
    </>
  )
}

export default MyApp
