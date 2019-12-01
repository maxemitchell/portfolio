import React from 'react'
import Navigation from './navigation'

const Layout = ({ children }) => {
    return (
      <div>
        <Navigation />
        {children}
      </div>
    )
}

export default Layout
