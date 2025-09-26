import '../styles/globals.css'
import React,{ useState,useEffect } from 'react';
import TopBar from '../component/Topbar'
import Footer  from '../component/Footer'
import { setupSessionTimeout } from './utils/sessionTimeout'
function MyApp({ Component, pageProps }) {

  return (
    <>
      <TopBar/>
      <Component {...pageProps} />
      <Footer/>
    </>
  )
}

export default MyApp
