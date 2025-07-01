import React from 'react'
import Navbar from '../navbar/navbar/Navbar'
import Footer from '../navbar/footer/Footer'
function Layout({children}) {
  return (
    <div>
        <Navbar/>
        <div className="content">
            {children}
        </div>
        <Footer/>
    </div>
  )
}

export default Layout