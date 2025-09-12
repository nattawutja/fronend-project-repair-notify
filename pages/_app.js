import '../styles/globals.css'
import TopBar from '../component/Topbar'
import Footer  from '../component/Footer'

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
